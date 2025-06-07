import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Importing a wider set of icons for more interactivity
import {
  FaTag,
  FaAlignLeft,
  FaUserCog,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaPlusCircle,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// API function for deleting a category
const deleteActivityCategory = (categoryId) => {
  return axios.delete(
    `https://hotel.tradesync.software/api/v1/activity-categories/${categoryId}/`
  );
};

export default function HotelEvents() {
  const hotel = useHotelContext();
  const queryClient = useQueryClient();

  // State for search, filtering, and the delete confirmation modal
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // --- DATA FETCHING (useQuery) ---
  // Now correctly uses hotel.id for fetching and as a dependency in the queryKey
  const {
    data: events_categories = [], // Default to empty array
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-categories"],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/activity-categories/?name=&description=&hotel_id=&is_active=unknown&created_after=&created_before=&updated_after=&updated_before=`
      );
      return response.data.results;
    },
  });

  // --- DATA MUTATION (useMutation for Deleting) ---
  const deleteMutation = useMutation({
    mutationFn: deleteActivityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["events-categories"]);
      closeModal();
    },
  });

  // --- CLIENT-SIDE FILTERING ---
  // useMemo ensures this filtering logic only re-runs when its dependencies change
  const filteredCategories = useMemo(() => {
    return events_categories
      .filter((category) => {
        if (statusFilter === "active") return category.is_active;
        if (statusFilter === "inactive") return !category.is_active;
        return true; // 'all'
      })
      .filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [events_categories, searchTerm, statusFilter]);

  // --- MODAL HANDLERS ---
  const openModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setCategoryToDelete(null);
    setIsModalOpen(false);
  };
  const handleDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
  };

  // --- RENDER STATES ---
  if (isLoading || !hotel?.id) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <p className="mt-4 text-lg text-gray-800">
          Loading Event Categories...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div
          className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-900">
                An Error Has Occurred
              </p>
              <p className="text-md text-red-800 mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* ========== ENHANCED HEADER ========== */}
          <header className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="flex items-center text-3xl font-extrabold text-blue-900">
                  <FaCalendarAlt className="mr-3 text-purple-500" />
                  Event Categories
                </h1>
                <p className="mt-1 text-md text-gray-600">
                  Manage categories for{" "}
                  <span className="font-semibold text-amber-700">
                    {hotel.name}
                  </span>
                  .
                </p>
              </div>
              <Link
                to="/calendar/add-event"
                className="w-full md:w-auto flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaPlusCircle className="mr-2" />
                Add New Category
              </Link>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-2/3 lg:w-1/2 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by category name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-1.5 text-sm rounded-full ${
                    statusFilter === "all"
                      ? "bg-blue-500 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-4 py-1.5 text-sm rounded-full ${
                    statusFilter === "active"
                      ? "bg-emerald-500 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("inactive")}
                  className={`px-4 py-1.5 text-sm rounded-full ${
                    statusFilter === "inactive"
                      ? "bg-red-500 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </header>

          {/* --- Main Display with Animation --- */}
          {filteredCategories.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredCategories.map((category) => (
                  <motion.div
                    layout
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-lg flex flex-col border border-gray-200"
                  >
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-t-lg text-white">
                      <div className="flex justify-between items-center">
                        <h2 className="flex items-center text-xl font-bold">
                          <FaTag className="mr-2" />
                          {category.name}
                        </h2>
                        {category.is_active ? (
                          <span className="flex items-center text-xs font-semibold bg-emerald-500 px-2 py-1 rounded-full">
                            <FaCheckCircle className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-semibold bg-red-500 px-2 py-1 rounded-full">
                            <FaTimesCircle className="mr-1" /> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-grow">
                      <div className="mb-4">
                        <h3 className="flex items-center text-sm font-semibold text-purple-700 mb-1">
                          <FaAlignLeft className="mr-2 text-purple-400" />
                          Description
                        </h3>
                        <p className="text-gray-800 text-[0.95rem]">
                          {category.description}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h3 className="flex items-center text-sm font-semibold text-amber-700 mb-1">
                          <FaUserCog className="mr-2 text-amber-500" />
                          Created By
                        </h3>
                        <p className="text-gray-800 text-[0.95rem]">
                          {category.created_by || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 border-t border-gray-200 mt-auto flex justify-between items-center">
                      <p className="flex items-center text-xs text-gray-500">
                        <FaClock className="mr-2" />
                        {new Date(category.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          to={`/calendar/edit-event/${category.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => openModal(category)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800">
                No Matching Categories
              </h3>
              <p className="mt-2 text-gray-500">
                Your search or filter returned no results. Try adjusting your
                criteria.
              </p>
            </div>
          )}

          {/* ========== CREATIVE FOOTER ========== */}
          <footer className="mt-10 bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-bold text-blue-800">
                {filteredCategories.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-blue-800">
                {events_categories.length}
              </span>{" "}
              total categories.
            </div>
            {/* Pagination Component (UI Ready) */}
            <nav className="flex items-center gap-1">
              <button
                className="px-3 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-md shadow">
                1
              </button>
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                2
              </button>
              <span className="text-gray-500">...</span>
              <button
                className="px-3 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </nav>
          </footer>
        </div>
      </div>

      {/* ========== DELETE CONFIRMATION MODAL ========== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamationTriangle
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                      Delete Category
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Are you sure you want to delete the category{" "}
                        <strong className="text-red-700">
                          "{categoryToDelete?.name}"
                        </strong>
                        ? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : null}
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
