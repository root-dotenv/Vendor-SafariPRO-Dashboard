import React, { useState, useMemo } from "react";
import { useHotelContext } from "../../contexts/hotelContext";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MdClose, MdAdd } from "react-icons/md";
import { GiMeal, GiCardboardBox } from "react-icons/gi";
import { IoSave } from "react-icons/io5";
// Add these icons to your existing react-icons import
import {
  FaUtensils,
  FaHashtag,
  FaInfoCircle,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";

// --- Type Definitions ---
interface Meal {
  id: string;
  code: string;
  name: string;
  score: number;
  description: string;
  is_active: boolean;
}

interface MealForm {
  code: string;
  name: string;
  score: number | string;
  description: string;
  is_active: boolean;
}

// --- Main Meals Component ---
export default function Meals() {
  const hotel = useHotelContext();
  const queryClient = useQueryClient();

  // --- State Management ---
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Meal | null;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [filterActive, setFilterActive] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const initialFormState: MealForm = {
    code: "",
    name: "",
    score: "",
    description: "",
    is_active: true,
  };
  const [formData, setFormData] = useState<MealForm>(initialFormState);

  // --- Data Fetching ---
  const mealsIds = hotel.meal_types || [];

  const mealsQueries = useQueries({
    queries: mealsIds.map((mealId) => ({
      queryKey: ["meal", mealId],
      queryFn: async () => {
        const response = await axios.get<Meal>(
          `https://hotel.tradesync.software/api/v1/meal-types/${mealId}/`
        );
        return response.data;
      },
    })),
  });

  // --- Data Mutation for Creating Meals ---
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal"] });
      closeModal();
      // Optionally, show a success toast here instead of an alert
    },
    onError: (error) => {
      console.error("Error creating meal:", error);
      // Optionally, show an error toast
    },
  });

  // --- Loading and Error States ---
  const isLoading = mealsQueries.some((query) => query.isLoading);
  const isError = mealsQueries.some((query) => query.isError);

  // --- Data Processing: Sorting and Filtering ---
  const sortedAndFilteredData = useMemo(() => {
    const mealsData = mealsQueries
      .filter((query) => query.isSuccess)
      .map((query) => query.data);

    let filtered = mealsData;
    if (filterActive === "active") {
      filtered = mealsData.filter((f) => f.is_active);
    } else if (filterActive === "inactive") {
      filtered = mealsData.filter((f) => !f.is_active);
    }

    if (sortConfig.key) {
      const key = sortConfig.key;
      filtered.sort((a, b) => {
        if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [mealsQueries, sortConfig, filterActive]);

  // --- Event Handlers ---
  const handleSort = (key: keyof Meal) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMealMutation.mutate(formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormState);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading Meal Types...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading data. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        {/* --- Header --- */}
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
            <GiMeal /> Meal Types
          </h2>
          <p className="text-gray-600 mt-1">
            Manage meal options available at the hotel.
          </p>
        </header>

        {/* --- Controls Bar --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Meals</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSort("name")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
              >
                Sort by Name
              </button>
              <button
                onClick={() => handleSort("score")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
              >
                Sort by Score
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors w-full sm:w-auto"
          >
            <MdAdd size={20} /> New Meal
          </button>
        </div>

        {/* --- Grid of Meal Cards --- */}
        {sortedAndFilteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredData.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div
                  className={`p-4 rounded-t-lg ${
                    meal.is_active
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {meal.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        meal.is_active
                          ? "bg-white text-emerald-700"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {meal.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      meal.is_active ? "text-emerald-50" : "text-gray-200"
                    }`}
                  >
                    {meal.code}
                  </p>
                </div>
                <div className="p-4 flex-grow">
                  <p className="text-gray-700 text-sm">
                    {meal.description || "No description available."}
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-purple-700">
                    Score:{" "}
                    <span className="text-lg font-bold">{meal.score}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
            <GiCardboardBox className="mx-auto text-6xl text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              No Meal Types Found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your filters or add a new meal type.
            </p>
          </div>
        )}
      </div>

      {/* --- Add New Meal Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-300/55 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <GiMeal /> Add New Meal Type
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <MdClose size={22} className="text-gray-600" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-0">
              {/* --- Form Body --- */}
              <div className="p-6 space-y-6">
                {/* Row 1: Name and Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Meal Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="flex items-center text-sm font-medium text-blue-900 mb-1"
                    >
                      <FaUtensils className="mr-2 text-purple-500" />
                      Meal Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      placeholder="e.g., Breakfast"
                    />
                  </div>

                  {/* Meal Code */}
                  <div>
                    <label
                      htmlFor="code"
                      className="flex items-center text-sm font-medium text-blue-900 mb-1"
                    >
                      <FaHashtag className="mr-2 text-purple-500" />
                      Code <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      placeholder="e.g., BF"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="flex items-center text-sm font-medium text-blue-900 mb-1"
                  >
                    <FaInfoCircle className="mr-2 text-purple-500" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 resize-none"
                    placeholder="A short description of the meal"
                  />
                </div>

                {/* Row 2: Score and Is Active */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Score */}
                  <div>
                    <label
                      htmlFor="score"
                      className="flex items-center text-sm font-medium text-blue-900 mb-1"
                    >
                      <FaStar className="mr-2 text-amber-500" />
                      Score
                    </label>
                    <input
                      type="number"
                      id="score"
                      name="score"
                      value={formData.score}
                      onChange={handleFormChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      placeholder="0"
                    />
                  </div>

                  {/* Is Active Checkbox */}
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleFormChange}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="is_active"
                      className="ml-3 font-medium text-gray-800"
                    >
                      Set as Active
                    </label>
                  </div>
                </div>

                {/* --- Confirmation Section --- */}
                <div className="border-t-2 border-dashed border-gray-200 mt-6 pt-5">
                  <h3 className="text-md font-semibold text-blue-900 mb-3">
                    Summary
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Meal Name:
                      </span>
                      <span className="text-purple-700 font-semibold">
                        {formData.name || "..."}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">Status:</span>
                      {formData.is_active ? (
                        <span className="flex items-center font-semibold text-emerald-700">
                          <FaCheckCircle className="mr-1" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center font-semibold text-red-700">
                          <FaTimesCircle className="mr-1" /> Inactive
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- Modal Footer / Actions --- */}
              <footer className="flex items-center justify-end gap-4 p-4 bg-gray-50 border-t rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                  disabled={createMealMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center px-5 py-2 text-sm font-medium rounded-lg shadow-lg text-white bg-gradient-to-b from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createMealMutation.isPending}
                >
                  {createMealMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <IoSave className="mr-2" />
                      Save Meal
                    </>
                  )}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
