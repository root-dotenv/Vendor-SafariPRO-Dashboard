import { useState } from "react";
import { useHotelContext } from "../../contexts/hotelContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importing necessary icons from react-icons
import {
  FaUserCog,
  FaTag,
  FaAlignLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const createActivityCategory = async (categoryData) => {
  const { data } = await axios.post(
    "https://hotel.tradesync.software/api/v1/activity-categories/",
    categoryData
  );
  return data;
};

export default function AddEvent() {
  const hotel = useHotelContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    created_by: "",
    updated_by: "",
    is_active: true,
    hotel: hotel?.id || null,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createActivityCategory,
    onSuccess: (data) => {
      console.log("Category created successfully:", data);
      navigate("/calendar/hotel-events");
    },
    onError: (error) => {
      console.error("Error creating category:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.hotel) {
      alert("Hotel information is not available. Please try again later.");
      return;
    }
    // - - - Add the hotel ID to the form data just before submission
    const submissionData = { ...formData, hotel: hotel.id };
    mutate(submissionData);
  };

  // - - -  Log the context for debugging purposes as requested
  console.log(`- - - Debugging Global Hotel`);
  console.log(hotel);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-white">
            Create a New Event Category
          </h1>
          <p className="text-blue-200 mt-1">
            Fill in the details below to add a new category for hotel
            activities.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Name and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center text-sm font-medium text-blue-900 mb-1"
              >
                <FaTag className="mr-2 text-purple-500" />
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="e.g., Wellness & Spa"
                required
              />
            </div>

            {/* Created By */}
            <div>
              <label
                htmlFor="created_by"
                className="flex items-center text-sm font-medium text-blue-900 mb-1"
              >
                <FaUserCog className="mr-2 text-purple-500" />
                Created By (Full Name)
              </label>
              <input
                type="text"
                id="created_by"
                name="created_by"
                value={formData.created_by}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="e.g., John Doe"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="flex items-center text-sm font-medium text-blue-900 mb-1"
            >
              <FaAlignLeft className="mr-2 text-purple-500" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Provide a brief description of what this event category entails."
              required
            ></textarea>
          </div>

          {/* Row 2: Updated By and Is Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Updated By */}
            <div>
              <label
                htmlFor="updated_by"
                className="flex items-center text-sm font-medium text-blue-900 mb-1"
              >
                <FaUserCog className="mr-2 text-cyan-500" />
                Updated By (Full Name)
              </label>
              <input
                type="text"
                id="updated_by"
                name="updated_by"
                value={formData.updated_by}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="e.g., Jane Smith"
                required
              />
            </div>
            {/* Is Active Checkbox */}
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="is_active" className="ml-3 text-gray-800">
                Set as Active Event
              </label>
            </div>
          </div>

          {/* Confirmation Footer */}
          <div className="border-t-2 border-dashed border-gray-200 mt-6 pt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Confirmation Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Hotel:</span>
                <span className="text-purple-700 font-semibold">
                  {hotel?.name || "N/A"}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Category Name:
                </span>
                <span className="text-purple-700 font-semibold">
                  {formData.name || "..."}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Creator:</span>
                <span className="text-purple-700 font-semibold">
                  {formData.created_by || "..."}
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

          {/* Submission Area */}
          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={isPending || !hotel?.id}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-b from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-3" /> Submitting...
                </>
              ) : (
                "Create Event Category"
              )}
            </button>
          </div>
          {/* Error Message Display */}
          {isError && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-md"
              role="alert"
            >
              <div className="flex">
                <div className="py-1">
                  <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-3" />
                </div>
                <div>
                  <p className="font-bold">An Error Occurred</p>
                  <p className="text-sm">
                    {error.message ||
                      "Failed to create the category. Please check your input and try again."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
