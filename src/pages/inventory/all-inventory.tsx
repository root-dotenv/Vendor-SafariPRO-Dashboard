import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaWarehouse,
  FaUndo,
  FaExclamationTriangle,
  FaArrowDown,
  FaArrowUp,
  FaBoxOpen,
} from "react-icons/fa";
import { FiChevronRight, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

// --- Helper Functions ---

// Centralized logic for determining re-order priority and styling
const getReorderPriority = (level) => {
  if (level >= 7) {
    return {
      label: "High",
      className: "bg-red-100 text-red-700 border border-red-200",
      icon: <FaArrowUp />,
    };
  }
  if (level >= 4) {
    return {
      label: "Medium",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
      icon: <FaExclamationTriangle />,
    };
  }
  return {
    label: "Low",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: <FaArrowDown />,
  };
};

// --- API Service ---
const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

const fetchInventoryCategories = async () => {
  const { data } = await apiClient.get("/inventory_categories");
  return data;
};

const fetchInventoryItems = async (categoryId) => {
  if (!categoryId) return [];
  const { data } = await apiClient.get(
    `/inventory_items?category_id=${categoryId}`
  );
  return data;
};

const addInventoryItem = async (itemData) => {
  const { data } = await apiClient.post("/inventory_items", itemData);
  return data;
};

const updateInventoryItem = async (itemData) => {
  // The item's ID is crucial for the PUT request URL
  const { data } = await apiClient.put(
    `/inventory_items/${itemData.id}`,
    itemData
  );
  return data;
};

const deleteInventoryItem = async (itemId) => {
  // The item's ID is all that's needed for the DELETE request
  await apiClient.delete(`/inventory_items/${itemId}`);
  return itemId;
};

// --- Main Inventory Component ---
export default function AllInventory() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["inventoryCategories"],
    queryFn: fetchInventoryCategories,
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["inventoryItems", selectedCategory],
    queryFn: () => fetchInventoryItems(selectedCategory),
    enabled: !!selectedCategory,
  });

  const addMutation = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({
        queryKey: ["inventoryItems", newItem.category_id],
      });
      setSelectedCategory(newItem.category_id);
      setIsAddModalOpen(false);
    },
  });

  // CORRECTED: The update mutation logic
  const updateMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      // On success, invalidate the current category's items to refetch data
      queryClient.invalidateQueries({
        queryKey: ["inventoryItems", selectedCategory],
      });
      // Close the modal by resetting the editingItem state
      setEditingItem(null);
    },
  });

  // CORRECTED: The delete mutation logic
  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      // On success, simply invalidate the current query to refetch the item list
      queryClient.invalidateQueries({
        queryKey: ["inventoryItems", selectedCategory],
      });
    },
  });

  const filteredItems = useMemo(() => {
    if (!items) return [];
    let filtered = items;
    if (filter === "low_stock") {
      filtered = filtered.filter(
        (item) => item.quantity_instock < item.reorder_level
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [items, searchQuery, filter]);

  React.useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Handler to initiate deletion
  const handleDeleteItem = (itemId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this item?")
    ) {
      deleteMutation.mutate(itemId);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-4 bg-slate-100 min-h-screen font-sans">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="lg:col-span-1">
          <CategoryList
            categories={categories}
            isLoading={categoriesLoading}
            isError={categoriesError}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-2xl shadow border border-gray-200/80">
            <ItemsHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
              onAddItem={() => setIsAddModalOpen(true)}
            />
            <ItemsTable
              items={filteredItems}
              isLoading={itemsLoading}
              onEdit={(item) => setEditingItem(item)}
              onDelete={handleDeleteItem} // Use the new handler
            />
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <ItemModal
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={addMutation.mutate}
          categories={categories || []}
        />
      )}

      {editingItem && (
        <ItemModal
          mode="edit"
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={updateMutation.mutate} // Pass the correct mutation function
          categories={categories || []}
        />
      )}
    </div>
  );
}

// --- Sub-components (Styling and logic are correct) ---

const Header = () => (
  <header className="flex items-center gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-2xl shadow shadow-blue-500/30">
      <FaWarehouse size={28} />
    </div>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
      Inventory Items
    </h1>
  </header>
);

const CategoryList = ({
  categories,
  isLoading,
  isError,
  selectedCategory,
  onSelectCategory,
}) => (
  <div className="bg-white p-4 rounded-2xl shadow border border-gray-200/80 h-full">
    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
      <FaClipboardList className="text-purple-600" />
      Categories
    </h2>
    {isLoading && (
      <p className="text-slate-500 animate-pulse">Loading categories...</p>
    )}
    {isError && (
      <p className="text-red-500 flex items-center gap-2">
        <FiAlertTriangle /> Failed to load.
      </p>
    )}
    <ul className="space-y-2">
      {categories?.map((category) => (
        <li key={category.id}>
          <button
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left p-3.5 rounded-lg flex justify-between items-center transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow shadow-blue-500/30"
                : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span className="font-semibold">{category.name}</span>
            {selectedCategory === category.id && (
              <FiChevronRight
                size={20}
                className="transform transition-transform"
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const ItemsHeader = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  onAddItem,
}) => (
  <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="relative w-full sm:w-72">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search item name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
      />
    </div>
    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
      <div className="flex items-center gap-2">
        <FaFilter className="text-slate-500" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Items</option>
          <option value="low_stock">Low Stock</option>
        </select>
      </div>
      <button
        onClick={onAddItem}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow shadow-blue-500/30 hover:shadow hover:-translate-y-0.5 transition-all transform"
      >
        <FaPlus />
        Add Item
      </button>
    </div>
  </div>
);

const ItemsTable = ({ items, isLoading, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-slate-600">
      <thead className="text-xs text-slate-700 uppercase bg-slate-100/80">
        <tr>
          <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
            Item Name
          </th>
          <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
            Stock Status
          </th>
          <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
            Re-order Priority
          </th>
          <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
            Unit Cost
          </th>
          <th
            scope="col"
            className="px-6 py-4 font-semibold tracking-wider text-center"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {isLoading ? (
          <tr>
            <td
              colSpan="5"
              className="text-center py-12 text-slate-500 animate-pulse"
            >
              Loading items...
            </td>
          </tr>
        ) : items.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-12 text-slate-500">
              <div className="flex flex-col items-center gap-2">
                <FaBoxOpen size={32} className="text-slate-400" />
                No items found in this category.
              </div>
            </td>
          </tr>
        ) : (
          items.map((item) => {
            const priority = getReorderPriority(item.reorder_level);
            const isLowStock = item.quantity_instock < item.reorder_level;
            return (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-bold ${
                      isLowStock ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {item.quantity_instock}
                  </span>
                  <span className="text-slate-500"> in stock</span>
                  {isLowStock && (
                    <p className="text-xs text-red-500">Re-order needed</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${priority.className}`}
                  >
                    {priority.icon} {priority.label}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-800">
                  ${item.cost_per_unit.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800 transition-colors transform hover:scale-125"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors transform hover:scale-125"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

const ItemModal = ({ mode, item = {}, onClose, onSubmit, categories }) => {
  const isEditMode = mode === "edit";

  const initialFormState = {
    name: "",
    description: "",
    category_id: categories[0]?.id || "",
    quantity_instock: 0,
    reorder_level: 1,
    cost_per_unit: 0,
  };

  const [formData, setFormData] = useState(
    isEditMode ? item : initialFormState
  );

  const handleChange = (e) => {
    let { name, value, type } = e.target;
    let processedValue = value;

    if (type === "number") {
      processedValue = parseFloat(value) || 0;
      if (name === "reorder_level") {
        if (processedValue > 10) processedValue = 10;
        if (processedValue < 1) processedValue = 1;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleClear = () => setFormData(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const priority = getReorderPriority(formData.reorder_level);
  const selectedCategoryName =
    categories.find((c) => c.id === formData.category_id)?.name || "N/A";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-2xl shadow w-full max-w-2xl relative transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {isEditMode ? <FaEdit /> : <FaPlus />}
            {isEditMode ? `Edit Item: ${item.name}` : "Add New Inventory Item"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-purple-200 hover:text-white transition-colors"
        >
          <FaTimes size={22} />
        </button>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Item Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                required
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={isEditMode}
                className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Re-order Level (1-10)
              </label>
              <div className="flex items-center gap-2">
                <input
                  required
                  type="number"
                  name="reorder_level"
                  min="1"
                  max="10"
                  value={formData.reorder_level}
                  onChange={handleChange}
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                />
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full w-24 text-center ${priority.className}`}
                >
                  {priority.label}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Quantity In-Stock
              </label>
              <input
                required
                type="number"
                name="quantity_instock"
                value={formData.quantity_instock}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Cost Per Unit ($)
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="cost_per_unit"
                value={formData.cost_per_unit}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-700 mb-2">
              Confirmation Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm text-slate-600">
              <p>
                <strong>Name:</strong> {formData.name || "..."}
              </p>
              <p>
                <strong>Category:</strong> {selectedCategoryName}
              </p>
              <p>
                <strong>In Stock:</strong> {formData.quantity_instock}
              </p>
              <p>
                <strong>Cost:</strong> ${formData.cost_per_unit.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            {isEditMode ? (
              <div></div>
            ) : (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-slate-700 transition-colors"
              >
                <FaUndo /> Clear
              </button>
            )}
            <button
              type="submit"
              className={`flex items-center gap-2 font-semibold py-2 px-5 rounded-lg shadow hover:shadow hover:-translate-y-0.5 transition-all transform ${
                isEditMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30"
                  : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30"
              }`}
            >
              {isEditMode ? <FiCheckCircle /> : <FaPlus />}
              {isEditMode ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
