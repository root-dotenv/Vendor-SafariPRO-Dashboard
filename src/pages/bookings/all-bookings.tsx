import { useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useHotelContext } from "../../contexts/hotelContext";

// Types
interface Booking {
  id: string;
  code: string;
  full_name: string;
  email: string;
  start_date: string;
  end_date: string;
  amount_required: string;
  amount_paid: string;
  property_item_type: string;
  reference_number: string;
  booking_type: "Physical" | "Online";
}

interface BookingResponse {
  results: Booking[];
  count: number;
}

interface Filters {
  search: string;
  paymentStatus: string;
  bookingType: string;
  dateRange: string;
}

// Constants
const API_BASE = "http://booking.tradesync.software/api/v1";
const MICROSERVICE_ID = "44f1cafe-59f4-43b6-bf01-4a84668e2d29";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Query keys
const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
};

// API functions
const bookingApi = {
  getBookings: async (): Promise<BookingResponse> => {
    const { data } = await api.get(
      //  `/bookings`
      `/bookings?microservice_item_id=${MICROSERVICE_ID}`
    );
    return data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};

export default function AllBookings() {
  const hotel = useHotelContext();

  const [filters, setFilters] = useState<Filters>({
    search: "",
    paymentStatus: "",
    bookingType: "",
    dateRange: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch bookings query
  const {
    data: bookingDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: bookingApi.getBookings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: bookingApi.deleteBooking,
    onMutate: async (deletedId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookingKeys.lists() });

      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData<BookingResponse>(
        bookingKeys.lists()
      );

      // Optimistically update the cache
      queryClient.setQueryData<BookingResponse>(bookingKeys.lists(), (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.filter((booking) => booking.id !== deletedId),
          count: old.count - 1,
        };
      });

      // Return a context object with the snapshotted value
      return { previousBookings };
    },
    onError: (err, deletedId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBookings) {
        queryClient.setQueryData(bookingKeys.lists(), context.previousBookings);
      }
      console.error("Error deleting booking:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });

  // Helper functions
  const getPaymentStatus = (
    amountRequired: string,
    amountPaid: string
  ): string => {
    const required = parseFloat(amountRequired);
    const paid = parseFloat(amountPaid);

    if (paid >= required) return "Paid";
    if (paid <= 0) return "Unpaid";
    return "Partial";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Unpaid":
        return "bg-red-100 text-red-800 border-red-200";
      case "Partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBookingTypeColor = (type: string): string => {
    return type === "Physical"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  // Event handlers
  const handleDelete = async (id: string) => {
    console.log(`- - - DELETEDD HOTEL ID`, id);
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBookingMutation.mutateAsync(id);
      } catch (error) {
        //  - - - Error handled
      }
    }
  };

  const handleNewBooking = () => {
    navigate("/bookings/new-booking");
  };

  const handleRetry = () => {
    refetch();
  };

  // Filter bookings based on search and filters
  const filteredBookings =
    bookingDetails?.results?.filter((booking) => {
      const matchesSearch =
        booking.code?.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.full_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        booking.email?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPaymentStatus =
        !filters.paymentStatus ||
        getPaymentStatus(booking.amount_required, booking.amount_paid) ===
          filters.paymentStatus;

      const matchesBookingType =
        !filters.bookingType || booking.booking_type === filters.bookingType;

      return matchesSearch && matchesPaymentStatus && matchesBookingType;
    }) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log(`- - - HOTEL OBJECT GLOBAL ACCESSS`);
  console.log(hotel);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
              <p className="mt-2 text-gray-600">
                Manage and track all your bookings
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleNewBooking}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <FaPlus className="mr-2" />
                New Booking
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaFilter className="text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Payment Status Filter */}
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              {/* Booking Type Filter */}
              <div>
                <select
                  value={filters.bookingType}
                  onChange={(e) =>
                    setFilters({ ...filters, bookingType: e.target.value })
                  }
                  className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Booking Types</option>
                  <option value="Physical">Physical</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: e.target.value })
                  }
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCalendarAlt className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBookings.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCreditCard className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredBookings.filter(
                      (b) =>
                        getPaymentStatus(b.amount_required, b.amount_paid) ===
                        "Paid"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaCreditCard className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Partial</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredBookings.filter(
                      (b) =>
                        getPaymentStatus(b.amount_required, b.amount_paid) ===
                        "Partial"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaCreditCard className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unpaid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredBookings.filter(
                      (b) =>
                        getPaymentStatus(b.amount_required, b.amount_paid) ===
                        "Unpaid"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr style={{ backgroundColor: "#f8f4ff" }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Booking Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.start_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          ${booking.amount_paid}
                        </div>
                        <div className="text-xs text-gray-500">
                          of ${booking.amount_required}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.property_item_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.reference_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getBookingTypeColor(
                          booking.booking_type
                        )}`}
                      >
                        {booking.booking_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          getPaymentStatus(
                            booking.amount_required,
                            booking.amount_paid
                          )
                        )}`}
                      >
                        {getPaymentStatus(
                          booking.amount_required,
                          booking.amount_paid
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(booking.id)}
                          disabled={deleteBookingMutation.isPending}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete booking"
                        >
                          {deleteBookingMutation.isPending ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No results state */}
        {filteredBookings.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or create a new booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
