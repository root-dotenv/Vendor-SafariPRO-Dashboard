import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiUser, FiChevronDown } from "react-icons/fi";

// Types
interface Guest {
  id: string;
  full_name: string;
  email: string;
  address: string;
  phone_number: number;
  amount_required: string;
  amount_paid: string;
  booking_type: string;
  property_item_type: string;
  code: string;
  booking_status: string;
  payment_status: string;
}

interface ApiResponse {
  count: number;
  results: Guest[];
}

// API function
const fetchGuests = async (): Promise<ApiResponse> => {
  const response = await axios.get(
    "http://booking.tradesync.software/api/v1/bookings"
  );
  return response.data;
};

const Guests: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["guests"],
    queryFn: fetchGuests,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Filter and search logic
  const filteredGuests = useMemo(() => {
    if (!data?.results) return [];

    return data.results.filter((guest) => {
      const matchesSearch =
        guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        guest.booking_status.toLowerCase() === statusFilter.toLowerCase();
      const matchesBookingType =
        bookingTypeFilter === "all" ||
        guest.booking_type.toLowerCase() === bookingTypeFilter.toLowerCase();
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        guest.payment_status.toLowerCase() ===
          paymentStatusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBookingType &&
        matchesPaymentStatus
      );
    });
  }, [
    data?.results,
    searchTerm,
    statusFilter,
    bookingTypeFilter,
    paymentStatusFilter,
  ]);

  // Handle row click for navigation
  const handleRowClick = (guestId: string) => {
    navigate(`/guests/${guestId}`);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">
          Failed to load guests data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Guests Management
        </h2>
        <p className="text-gray-600">Manage and view all guest bookings</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests by name, email, booking code, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          Filters
          <FiChevronDown
            className={`w-4 h-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Type
              </label>
              <select
                value={bookingTypeFilter}
                onChange={(e) => setBookingTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="physical">Physical</option>
                <option value="online">Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredGuests.length} of {data?.count || 0} guests
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Full Name
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Email
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Address
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Phone
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Amount Required
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Amount Paid
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Booking Type
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Room Type
              </th>
              <th className="text-left p-4 font-semibold text-gray-600 border-b-2 border-gray-200">
                Booking Code
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <tr
                key={guest.id}
                onClick={() => handleRowClick(guest.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200"
              >
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {guest.full_name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        guest.booking_status
                      )}`}
                    >
                      {guest.booking_status}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-700">{guest.email}</td>
                <td className="p-4 text-gray-700">{guest.address}</td>
                <td className="p-4 text-gray-700">{guest.phone_number}</td>
                <td className="p-4">
                  <span className="font-semibold text-gray-900">
                    ${guest.amount_required}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-green-600">
                    ${guest.amount_paid}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guest.booking_type.toLowerCase() === "online"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {guest.booking_type}
                  </span>
                </td>
                <td className="p-4 text-gray-700">
                  {guest.property_item_type}
                </td>
                <td className="p-4">
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {guest.code}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No guests found</p>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;
