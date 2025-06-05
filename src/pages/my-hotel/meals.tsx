import React, { useState } from "react";
import { useHotelContext } from "../../contexts/hotelContext";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import styles from "./facilities.module.css";
import { MdClose, MdAdd } from "react-icons/md";
import { FaCheck, FaSort, FaSortUp, FaSortDown } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { GiMeal } from "react-icons/gi";
import { IoSave } from "react-icons/io5";

interface MealForm {
  code: string;
  name: string;
  score: number | string;
  description: string;
  is_active: boolean;
}

export default function Meals() {
  const hotel = useHotelContext();
  const queryClient = useQueryClient();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterActive, setFilterActive] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const initialFormState: MealForm = {
    code: "",
    name: "",
    score: "",
    description: "",
    is_active: false,
  };

  const [formData, setFormData] = useState<MealForm>(initialFormState);

  console.log(`- - - Debugging: useHotelContext Data`);
  console.log(hotel.meal_types);

  //  - - - Extract Meals IDs from the hotel context
  const mealsIds = hotel.meal_types || [];

  // - - - useQueries to fetch data for multiple Meals IDs
  const mealsQueries = useQueries({
    queries: mealsIds.map((mealId) => ({
      queryKey: ["meal", mealId], // - - - Unique query key for each Meals
      queryFn: async () => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/meal-types/${mealId}/`
        );
        return response.data;
      },
      // - - - other useQueries options goes here
    })),
  });

  // Create meal mutation
  const createMealMutation = useMutation({
    mutationFn: async (newMealData: MealForm) => {
      const response = await axios.post(
        `https://hotel.tradesync.software/api/v1/meal-types/`,
        {
          ...newMealData,
          score: Number(newMealData.score) || 0,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Meal created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["meal"] });
      setFormData(initialFormState);
      setShowModal(false);
      alert("Meal type created successfully!");
    },
    onError: (error) => {
      console.error("Error creating meal:", error);
      alert(`Error creating meal: ${error.message}`);
    },
  });

  const isLoading = mealsQueries.some((query) => query.isLoading);
  const isError = mealsQueries.some((query) => query.isError);
  const errors = mealsQueries
    .filter((query) => query.isError)
    .map((query) => query.error);

  // - - -Get all successful data
  const mealsData = mealsQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="opacity-50" />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      alert("Please fill in the required fields (Code and Name).");
      return;
    }

    createMealMutation.mutate(formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormState);
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = mealsData;

    // - - - Apply filter
    if (filterActive === "active") {
      filtered = mealsData.filter((f) => f.is_active);
    } else if (filterActive === "inactive") {
      filtered = mealsData.filter((f) => !f.is_active);
    }

    //  - - - Apply sort
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = sortConfig.key ? a[sortConfig.key] : null;
        let bVal = sortConfig.key ? b[sortConfig.key] : null;

        if (typeof aVal === "boolean") {
          aVal = aVal ? 1 : 0;
          bVal = bVal ? 1 : 0;
        }

        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortConfig.direction === "asc") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [mealsData, sortConfig, filterActive]);

  if (isLoading) {
    console.log("Loading Meal Types...");
    return <p className={styles.loading}>Loading Meal Types...</p>;
  }

  if (isError) {
    console.error("Error fetching Meal Types:", errors);
    return (
      <div className={styles.errorContainer}>
        <p>Error loading Meal Types:</p>
        <ul>
          {errors.map((err, index) => (
            <li key={index}>{err.message}</li>
          ))}
        </ul>
      </div>
    );
  }

  console.log(`- - - Meal Types Response Object`, mealsData);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`font-semibold text-[1.5rem] flex items-center gap-3 ml-[0.5rem]`}
        >
          <GiMeal size={24} /> Meal Types
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="gap-[6px] bg-[#10b981] text-[#FFF] px-4 py-[6px] rounded-md cursor-pointer hover:bg-[#0EB981] transition text-[0.875rem] flex items-center font-medium"
          >
            <MdAdd size={17} color="#FFF" /> New Meals
          </button>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Filter:
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="text-red-500" value="all">
                All Meal Types
              </option>
              <option className="text-red-500" value="active">
                Active Only
              </option>
              <option className="text-red-500" value="inactive">
                Inactive Only
              </option>
            </select>
          </label>

          <div className="text-sm text-gray-500">
            Showing {sortedAndFilteredData.length} of {mealsData.length} Meals
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.facilitiesTable}>
          <thead>
            <tr>
              <th>
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Code {getSortIcon("code")}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Meal Type{getSortIcon("name")}
                </button>
              </th>
              <th>Description</th>
              <th>
                <button
                  onClick={() => handleSort("is_active")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Status {getSortIcon("status")}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("score")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Meal Score {getSortIcon("score")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((meal) => (
              <tr key={meal.id}>
                <td>
                  <span className={styles.tableCode}>{meal.code}</span>
                </td>
                <td>
                  <div className={styles.tableName}>
                    <span>{meal.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.tableDescription}>
                    {meal.description}
                  </div>
                </td>
                <td>
                  <div
                    className={`${styles.tableStatus} ${
                      meal.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {meal.is_active ? (
                      <FaCheck className={styles.activeIcon} />
                    ) : (
                      <RxCross2 className={styles.inactiveIcon} />
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.tableBadge} ${
                      meal.score ? styles.yes : styles.no
                    }`}
                  >
                    {meal.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedAndFilteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No Meal Types found matching your filter criteria.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-300/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-4 border-b rounded-t-md"
              style={{ backgroundColor: "#CCDCF1", borderColor: "#E6E7EB" }}
            >
              <div className="flex items-center gap-2">
                <GiMeal size={20} className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Add New Meal Type
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                style={{ color: "#6B7280" }}
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4">
              {createMealMutation.isPending && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 text-sm">Creating meal type...</p>
                </div>
              )}

              {createMealMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">
                    Error:{" "}
                    {createMealMutation.error?.message ||
                      "Something went wrong."}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* Code Field */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: "#E6E7EB" }}
                    placeholder="e.g., BF, LN, DN"
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Meal Type Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: "#E6E7EB" }}
                    placeholder="e.g., Breakfast, Lunch, Dinner"
                  />
                </div>

                {/* Score Field */}
                <div>
                  <label
                    htmlFor="score"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Score
                  </label>
                  <input
                    type="number"
                    id="score"
                    name="score"
                    value={formData.score}
                    onChange={handleFormChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: "#E6E7EB" }}
                    placeholder="0"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ borderColor: "#E6E7EB" }}
                    placeholder="Optional description for this meal type"
                  />
                </div>

                {/* Active Status Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">
                    Status (Available)
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="flex justify-end gap-3 mt-6 pt-4 border-t"
                style={{ borderColor: "#E6E7EB" }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                  style={{ color: "#6B7280", borderColor: "#E6E7EB" }}
                  disabled={createMealMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: "#0EB981" }}
                  disabled={createMealMutation.isPending}
                >
                  <IoSave size={14} />
                  {createMealMutation.isPending
                    ? "Creating..."
                    : "Create Meal Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
