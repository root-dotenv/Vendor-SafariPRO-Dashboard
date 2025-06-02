import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiFilter } from "react-icons/fi";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { LiaStarSolid } from "react-icons/lia";
import { MdAdd } from "react-icons/md";
import AddHotelForm from "./AddHotelForm";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../../api/axiosClient";

export default function Hotels() {
  const {
    data: hotels,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const response = await axiosClient.get("/hotels");
      return response;
    },
  });

  console.log(`DATA REQUESTED`, hotels);

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    region: "",
    rating: "",
    type: "",
  });
  // - - - AddHotel Form Modal
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);

  const itemsPerPage = 9;

  // - - - On Loading data
  if (isLoading)
    return <div className="p-6 text-center">Loading hotels...</div>;

  // - - - On Error encounter
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">Error: {error.message}</div>
    );

  function getRandomRateNumber() {
    return Math.floor(Math.random() * 4) + 1;
  }

  function getRandomRoomNumber() {
    return Math.floor(Math.random() * 51) + 100;
  }

  // - - - Filter hotels based on search and filters
  const filteredHotels = hotels?.filter((hotel) => {
    // - - - Global search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = hotel.company.name.toLowerCase().includes(query);
      const locationMatch = `${hotel.address.city}, ${hotel.address.street}`
        .toLowerCase()
        .includes(query);
      const typeMatch = hotel.company.bs.toLowerCase().includes(query);
      const ratingMatch = Number(hotel.id + getRandomRateNumber())
        .toString()
        .includes(query);
      const roomsMatch = Number(hotel.id + getRandomRoomNumber())
        .toString()
        .includes(query);
      const themeMatch = hotel.website
        ? hotel.website.toLowerCase().includes(query)
        : false;

      if (
        !(
          nameMatch ||
          locationMatch ||
          typeMatch ||
          ratingMatch ||
          roomsMatch ||
          themeMatch
        )
      ) {
        return false;
      }
    }

    // - - - Apply advanced filters
    if (
      filters.country &&
      !hotel.address.city.toLowerCase().includes(filters.country.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.region &&
      !hotel.address.street.toLowerCase().includes(filters.region.toLowerCase())
    ) {
      return false;
    }

    if (filters.rating) {
      const rating = Number(hotel.id + getRandomRateNumber());
      if (rating < Number(filters.rating)) {
        return false;
      }
    }

    if (
      filters.type &&
      !hotel.company.bs.toLowerCase().includes(filters.type.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // - - - Pagenation
  const totalPages = Math.ceil((filteredHotels?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHotels?.slice(indexOfFirstItem, indexOfLastItem);

  // - - - Handler for page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //  - - - Handler for Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1); // - - -  Reset to first page when applying filters
  };

  // - - - Handler to Reset filters
  const handleResetFilters = () => {
    setFilters({
      country: "",
      region: "",
      rating: "",
      type: "",
    });
    setCurrentPage(1);
  };

  // - - - Add Hotel Form Modal Handler
  const handleAddHotelSubmit = (hotel: {
    name: string,
    location: string,
    rating: string,
  }) => {
    // TODO: API is ready? ( addHotel request) goes in here through hooks
    console.log("New hotel to be added:", hotel);

    // Close the modal
    setShowAddHotelModal(false);

    // - - - refresh the hotel list here (I'll think of this again)
    //  hotelQuery.refetch();
  };

  return (
    <div className="p-[1rem]">
      <AddHotelForm
        isOpen={showAddHotelModal}
        onClose={() => setShowAddHotelModal(false)}
        onSubmit={handleAddHotelSubmit}
      />

      {/* - - - This div will only be available for cleared users (SuperAdmin and Hotel Admin) */}
      <div className={`w-full mb-[2rem] flex justify-between items-center`}>
        <span>
          <h4
            className={`text-[2rem] text-[#141824] leading-[2rem] font-extrabold`}
          >
            Hotels
          </h4>
        </span>
        <button
          onClick={() => setShowAddHotelModal(true)}
          className="bg-[#F18E52] hover:bg-[#c97d4f] text-white px-6 py-[7px] rounded-md transition duration-300 flex items-center gap-[6px] font-semibold"
        >
          <MdAdd color="#FFF" size={18} /> Add Hotel
        </button>
      </div>

      {/* - - - Search Bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search for hotel? Type it here"
            className="w-full border border-[#CBD0DD] rounded-md px-3 py-[7px] focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-[7px] rounded-md transition duration-300 flex items-center gap-2"
        >
          {showFilters ? (
            <MdOutlineFilterAltOff size={24} />
          ) : (
            <FiFilter size={20} />
          )}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* - - - Advanced Filters */}
      {showFilters && (
        <div className="mb-6 bg-[#F9FAFB] p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 uppercase">
            Advanced Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[1rem] font-semibold text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                className="w-full border border-[#CBD0DD] rounded-md px-3 py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.country}
                onChange={(e) =>
                  setFilters({ ...filters, country: e.target.value })
                }
                placeholder="Filter by country..."
              />
            </div>
            <div>
              <label className="block text-[1rem] font-semibold text-gray-700 mb-1">
                Region
              </label>
              <input
                type="text"
                className="w-full border border-[#CBD0DD] rounded-md px-3 py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value })
                }
                placeholder="Filter by region..."
              />
            </div>
            <div>
              <label className="block text-[1rem] font-semibold text-gray-700 mb-1">
                Minimum Rating
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full border border-[#CBD0DD] rounded-md px-3 py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: e.target.value })
                }
                placeholder="Minimum rating..."
              />
            </div>
            <div>
              <label className="block text-[1rem] font-semibold text-gray-700 mb-1">
                Hotel Type
              </label>
              <input
                type="text"
                className="w-full border border-[#CBD0DD] rounded-md px-3 py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                placeholder="Filter by type..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-[6px] border border-[#CBD0DD] rounded-md shadow text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-[1px] focus:ring-blue-500"
            >
              Reset Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-[6px] border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* - - - Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          {/* - - - Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Rooms
              </th>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Theme
              </th>
              <th className="px-6 py-3 text-left text-[0.9375rem] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* - - - Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems?.map((hotel) => (
              <tr key={hotel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[0.875rem] font-medium text-gray-900">
                    {hotel.company.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[0.875rem] text-gray-500">
                    {hotel.address.city}, {hotel.address.street}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[0.875rem] text-gray-500">
                    {hotel.company.bs}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[0.875rem] text-gray-900 flex items-center gap-1">
                    <LiaStarSolid size={15} color="#FFCB00" />
                    {getRandomRateNumber() + hotel.id}.
                    {Number(getRandomRateNumber())}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[0.875rem] text-gray-900">
                    {Number(hotel.id + getRandomRoomNumber())}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[0.875rem] text-gray-500">
                    {hotel.website}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <button className="text-[#2C7FFF] hover:text-[#155DFC]">
                      <FaRegEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <RiDeleteBin5Line size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* - - - Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {indexOfLastItem > (filteredHotels?.length ?? 0)
                      ? filteredHotels?.length ?? 0
                      : indexOfLastItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredHotels?.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {/* - - - Page numbers */}
                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => handlePageChange(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === number + 1
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {number + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
