import React, { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import axios from "axios";
import { FaCheck, FaSort, FaSortUp, FaSortDown, FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import styles from "./hotel-facilities.module.css";
import { BsUiChecksGrid } from "react-icons/bs";
import { MdClose } from "react-icons/md";

export default function HotelFacilitiesTable() {
  const hotel = useHotelContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterActive, setFilterActive] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    category_id: null,
    fee_applies: false,
    reservation_required: false,
    additional_info: "",
    is_active: false,
  });

  console.log(`- - - Debugging: useHotelContext Data`);
  console.log(hotel.facilities);

  //  - - - Extract facility IDs from the hotel context
  const facilityIds = hotel.facilities || [];

  // - - - useQueries to fetch data for multiple facility IDs
  const facilityQueries = useQueries({
    queries: facilityIds.map((facilityId) => ({
      queryKey: ["facility", facilityId], // - - - Unique query key for each facility
      queryFn: async () => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/facilities/${facilityId}/`
        );
        return response.data;
      },
      // - - - other useQueries options goes here
    })),
  });

  const isLoading = facilityQueries.some((query) => query.isLoading);
  const isError = facilityQueries.some((query) => query.isError);
  const errors = facilityQueries
    .filter((query) => query.isError)
    .map((query) => query.error);

  // - - -Get all successful data
  const facilitiesData = facilityQueries
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

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      code: "",
      description: "",
      category_id: null,
      fee_applies: false,
      reservation_required: false,
      additional_info: "",
      is_active: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your API call here to create the facility
      console.log("Submitting facility:", formData);
      // await axios.post('your-api-endpoint', formData);
      closeModal();
    } catch (error) {
      console.error("Error creating facility:", error);
    }
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = facilitiesData;

    // - - - Apply filter
    if (filterActive === "active") {
      filtered = facilitiesData.filter((f) => f.is_active);
    } else if (filterActive === "inactive") {
      filtered = facilitiesData.filter((f) => !f.is_active);
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
  }, [facilitiesData, sortConfig, filterActive]);

  if (isLoading) {
    console.log("Loading facilities...");
    return <p className={styles.loading}>Loading facilities...</p>;
  }

  if (isError) {
    console.error("Error fetching facilities:", errors);
    return (
      <div className={styles.errorContainer}>
        <p>Error loading facilities:</p>
        <ul>
          {errors.map((err, index) => (
            <li key={index}>{err.message}</li>
          ))}
        </ul>
      </div>
    );
  }

  console.log(`- - - Facilities Response Object`, facilitiesData);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`font-semibold text-[1.5rem] flex items-center gap-3 ml-[0.5rem]`}
        >
          <BsUiChecksGrid size={22} /> Hotel Facilities
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={openModal}
            className="gap-[6px] bg-[#0EB981] text-[#FFF] px-4 py-[6px] rounded-md cursor-pointer hover:bg-[#0d9f6e] transition text-[0.875rem] flex items-center font-medium"
          >
            <FaPlus size={14} color="#FFF" /> New Facility
          </button>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Filter:
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="text-red-500" value="all">
                All Facilities
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
            Showing {sortedAndFilteredData.length} of {facilitiesData.length}
            facilities
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
                  Facility Name {getSortIcon("name")}
                </button>
              </th>
              <th>Description</th>
              <th>
                <button
                  onClick={() => handleSort("is_active")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Status {getSortIcon("is_active")}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("reservation_required")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Reservation {getSortIcon("reservation_required")}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort("fee_applies")}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  Fee Applies {getSortIcon("fee_applies")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((facility) => (
              <tr key={facility.id}>
                <td>
                  <span className={styles.tableCode}>{facility.code}</span>
                </td>
                <td>
                  <div className={styles.tableName}>
                    <span>{facility.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.tableDescription}>
                    {facility.description}
                  </div>
                </td>
                <td>
                  <div
                    className={`${styles.tableStatus} ${
                      facility.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {facility.is_active ? (
                      <FaCheck className={styles.activeIcon} />
                    ) : (
                      <RxCross2 className={styles.inactiveIcon} />
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.tableBadge} ${
                      facility.reservation_required ? styles.yes : styles.no
                    }`}
                  >
                    {facility.reservation_required
                      ? "Required"
                      : "Not Required"}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.tableBadge} ${
                      facility.fee_applies ? styles.yes : styles.no
                    }`}
                  >
                    {facility.fee_applies ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedAndFilteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No facilities found matching your filter criteria.
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-slate-300/60 bg-opacity-50"
            onClick={closeModal}
          ></div>
          <div
            className={`${styles.modal} relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div
              className={`${styles.modalHeader} flex items-center justify-between p-4 border-b`}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Create New Facility
              </h3>
              <button
                onClick={closeModal}
                className="text-[#6B7280] hover:text-gray-800 transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`${styles.formTextarea} resize-none`}
                />
              </div>

              {/* Category ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category ID
                </label>
                <input
                  type="string"
                  name="category_id"
                  value={formData.category_id || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  rows={3}
                  className={`${styles.formTextarea} resize-none`}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fee_applies"
                    name="fee_applies"
                    checked={formData.fee_applies}
                    onChange={handleInputChange}
                    className={styles.formCheckbox}
                  />
                  <label
                    htmlFor="fee_applies"
                    className="ml-2 text-sm text-gray-700"
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
                    className={styles.formCheckbox}
                  />
                  <label
                    htmlFor="reservation_required"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Reservation Required
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className={styles.formCheckbox}
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6E7EB]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-[#6B7280] border border-[#E6E7EB] rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0EB981] text-white rounded-md hover:bg-[#0d9f6e] transition-colors flex items-center gap-2"
                >
                  <FaPlus size={14} />
                  Create Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
