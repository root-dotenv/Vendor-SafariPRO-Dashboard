import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FiPlus,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiX,
  FiCheck,
  FiTrash2,
  FiEye,
  FiPackage,
  FiClock,
} from "react-icons/fi";

interface LostItem {
  id: string;
  type: string;
  item_name: string;
  description: string;
  location_found: string;
  date_found: string;
  found_by: string;
  status: "unclaimed" | "claimed";
  guest_name: string;
  guest_contact: string;
  guest_email: string;
  notes: string;
}

export default function LostAndFound() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "view" | "claim">("add");
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unclaimed" | "claimed"
  >("all");

  // Fetch lost items
  const { data: lostItems = [], isLoading } = useQuery<LostItem[]>({
    queryKey: ["lost_items"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3001/lost_items");
      return response.data;
    },
  });

  // Add new item mutation
  const addMutation = useMutation({
    mutationFn: (newItem: Omit<LostItem, "id">) =>
      axios.post("http://localhost:3001/lost_items", newItem),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"]);
      setIsModalOpen(false);
    },
  });

  // Claim item mutation
  const claimMutation = useMutation({
    mutationFn: ({
      id,
      guestInfo,
    }: {
      id: string;
      guestInfo: Partial<LostItem>;
    }) =>
      axios.patch(`http://localhost:3001/lost_items/${id}`, {
        status: "claimed",
        ...guestInfo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"]);
      setIsModalOpen(false);
    },
  });

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`http://localhost:3001/lost_items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"]);
    },
  });

  // Filter items based on search and status
  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location_found.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (
    mode: "add" | "view" | "claim",
    item: LostItem | null = null
  ) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddItem = (formData: Omit<LostItem, "id">) => {
    addMutation.mutate({
      ...formData,
      status: "unclaimed",
      guest_name: "",
      guest_contact: "",
      guest_email: "",
    });
  };

  const handleClaimItem = (itemId: string, guestInfo: Partial<LostItem>) => {
    claimMutation.mutate({ id: itemId, guestInfo });
  };

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "claimed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "unclaimed":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "electronics":
        return <FiPackage className="w-4 h-4" />;
      case "jewelry":
        return <div className="w-4 h-4 rounded-full bg-yellow-400"></div>;
      case "clothing":
        return <FiUser className="w-4 h-4" />;
      case "documents":
        return <FiCalendar className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lost & Found Management
        </h1>
        <p className="text-gray-600">
          Manage lost items and help guests recover their belongings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Items</p>
              <p className="text-2xl font-bold">{lostItems.length}</p>
            </div>
            <FiPackage className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Unclaimed</p>
              <p className="text-2xl font-bold">
                {lostItems.filter((item) => item.status === "unclaimed").length}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Claimed</p>
              <p className="text-2xl font-bold">
                {lostItems.filter((item) => item.status === "claimed").length}
              </p>
            </div>
            <FiCheck className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items, descriptions, locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "unclaimed" | "claimed"
                )
              }
            >
              <option value="all">All Status</option>
              <option value="unclaimed">Unclaimed</option>
              <option value="claimed">Claimed</option>
            </select>
          </div>
          <button
            onClick={() => openModal("add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Lost Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Found
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Found By
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.item_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      {item.location_found}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.date_found}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.found_by}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(item.status)}>
                      {item.status === "claimed" ? "Claimed" : "Unclaimed"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal("view", item)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {item.status === "unclaimed" && (
                        <button
                          onClick={() => openModal("claim", item)}
                          className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Claimed"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          mode={modalMode}
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onAddItem={handleAddItem}
          onClaimItem={handleClaimItem}
          isLoading={addMutation.isLoading || claimMutation.isLoading}
        />
      )}
    </div>
  );
}

// Modal Component
function Modal({
  mode,
  item,
  onClose,
  onAddItem,
  onClaimItem,
  isLoading,
}: {
  mode: "add" | "view" | "claim";
  item: LostItem | null;
  onClose: () => void;
  onAddItem: (formData: Omit<LostItem, "id">) => void;
  onClaimItem: (itemId: string, guestInfo: Partial<LostItem>) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    type: item?.type || "Electronics",
    item_name: item?.item_name || "",
    description: item?.description || "",
    location_found: item?.location_found || "",
    date_found: item?.date_found || new Date().toISOString().split("T")[0],
    found_by: item?.found_by || "",
    notes: item?.notes || "",
    guest_name: item?.guest_name || "",
    guest_contact: item?.guest_contact || "",
    guest_email: item?.guest_email || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add") {
      onAddItem(formData);
    } else if (mode === "claim" && item) {
      onClaimItem(item.id, {
        guest_name: formData.guest_name,
        guest_contact: formData.guest_contact,
        guest_email: formData.guest_email,
      });
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add Lost Item";
      case "view":
        return "Item Details";
      case "claim":
        return "Mark as Claimed";
      default:
        return "Item";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-300/55 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {getModalTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={mode === "view"}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Found
                </label>
                <input
                  type="text"
                  name="location_found"
                  value={formData.location_found}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Found
                </label>
                <input
                  type="date"
                  name="date_found"
                  value={formData.date_found}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Found By
              </label>
              <input
                type="text"
                name="found_by"
                value={formData.found_by}
                onChange={handleChange}
                disabled={mode === "view"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                required
              />
            </div>

            {mode === "claim" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900">
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      name="guest_name"
                      value={formData.guest_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="guest_contact"
                      value={formData.guest_contact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="guest_email"
                    value={formData.guest_email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {mode === "view" && item?.status === "claimed" && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900">Claimed By</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Guest Name</p>
                    <p className="font-medium">
                      {item.guest_name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium">
                      {item.guest_contact || "Not provided"}
                    </p>
                  </div>
                </div>
                {item.guest_email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{item.guest_email}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={mode === "view"}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {mode !== "view" && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {mode === "add" ? "Add Item" : "Mark as Claimed"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
