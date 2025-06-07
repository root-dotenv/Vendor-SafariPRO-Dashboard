import React, { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import axios from "axios";
import {
  FaPlus,
  FaBuilding,
  FaCalendarCheck,
  FaDollarSign,
  FaTag,
  FaInfoCircle,
  FaListOl,
  FaQuestionCircle,
} from "react-icons/fa";
import { BsUiChecksGrid, BsX } from "react-icons/bs";
import { MdClose } from "react-icons/md";

// Main Component
export default function HotelFacilitiesTable() {
  const hotel = useHotelContext();
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filterActive, setFilterActive] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial State for the form
  const initialFormState = {
    name: "",
    code: "",
    description: "",
    category_id: null,
    fee_applies: false,
    reservation_required: false,
    additional_info: "",
    is_active: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const facilityIds = hotel.facilities || [];

  // Fetching data
  const facilityQueries = useQueries({
    queries: facilityIds.map((facilityId) => ({
      queryKey: ["facility", facilityId],
      queryFn: async () => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/facilities/${facilityId}/`
        );
        return response.data;
      },
    })),
  });

  const isLoading = facilityQueries.some((query) => query.isLoading);
  const isError = facilityQueries.some((query) => query.isError);

  // Memoized sorting and filtering logic
  const sortedAndFilteredData = useMemo(() => {
    const facilitiesData = facilityQueries
      .filter((query) => query.isSuccess)
      .map((query) => query.data);

    let filtered = facilitiesData;
    if (filterActive === "active") {
      filtered = facilitiesData.filter((f) => f.is_active);
    } else if (filterActive === "inactive") {
      filtered = facilitiesData.filter((f) => !f.is_active);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const key = sortConfig.key;
        if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [facilityQueries, sortConfig, filterActive]);

  // Handlers
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting facility:", formData);
    // Add your mutation logic here
    closeModal();
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">Loading Facilities...</div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Error loading data.</div>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
            <BsUiChecksGrid /> Hotel Facilities
          </h2>
          <p className="text-gray-600 mt-1">
            Manage all facilities available at the hotel.
          </p>
        </header>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Facilities</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSort("name")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 hover:bg-gray-100"
              >
                Sort by Name
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors w-full sm:w-auto"
          >
            <FaPlus /> New Facility
          </button>
        </div>

        {/* Grid of Facility Cards */}
        {sortedAndFilteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredData.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div
                  className={`p-4 rounded-t-lg ${
                    facility.is_active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FaBuilding /> {facility.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        facility.is_active
                          ? "bg-white text-emerald-700"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {facility.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-mono mt-1 ${
                      facility.is_active ? "text-blue-200" : "text-gray-200"
                    }`}
                  >
                    {facility.code}
                  </p>
                </div>
                <div className="p-4 flex-grow">
                  <p className="text-gray-700 text-sm">
                    {facility.description || "No description provided."}
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200 space-y-2 text-sm">
                  <p
                    className={`flex items-center gap-2 font-medium ${
                      facility.reservation_required
                        ? "text-amber-700"
                        : "text-gray-500"
                    }`}
                  >
                    {facility.reservation_required ? (
                      <FaCalendarCheck />
                    ) : (
                      <BsX className="text-red-500" />
                    )}
                    Reservation{" "}
                    {facility.reservation_required
                      ? "Required"
                      : "Not Required"}
                  </p>
                  <p
                    className={`flex items-center gap-2 font-medium ${
                      facility.fee_applies ? "text-amber-700" : "text-gray-500"
                    }`}
                  >
                    {facility.fee_applies ? (
                      <FaDollarSign />
                    ) : (
                      <BsX className="text-red-500" />
                    )}
                    Fee {facility.fee_applies ? "Applies" : "Does Not Apply"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">
              No Facilities Found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your filters or add a new facility.
            </p>
          </div>
        )}
      </div>

      {/* --- Create New Facility Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <header className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaPlus /> Create New Facility
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/20 rounded-full"
              >
                <MdClose size={22} />
              </button>
            </header>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                    <FaTag className="mr-2 text-purple-500" />
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                    <FaTag className="mr-2 text-purple-500" />
                    Code*
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                  <FaInfoCircle className="mr-2 text-purple-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                    <FaListOl className="mr-2 text-purple-500" />
                    Category ID
                  </label>
                  <input
                    type="text"
                    name="category_id"
                    value={formData.category_id || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                    <FaQuestionCircle className="mr-2 text-purple-500" />
                    Additional Info
                  </label>
                  <input
                    type="text"
                    name="additional_info"
                    value={formData.additional_info}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-dashed">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="is_active"
                      className="ml-2 font-medium text-gray-800"
                    >
                      Active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fee_applies"
                      name="fee_applies"
                      checked={formData.fee_applies}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="fee_applies"
                      className="ml-2 font-medium text-gray-800"
                    >
                      Fee Applies
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reservation_required"
                      name="reservation_required"
                      checked={formData.reservation_required}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="reservation_required"
                      className="ml-2 font-medium text-gray-800"
                    >
                      Reservation Required
                    </label>
                  </div>
                </div>
              </div>

              <footer className="flex justify-end gap-4 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-gradient-to-b from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:opacity-90"
                >
                  Create Facility
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
