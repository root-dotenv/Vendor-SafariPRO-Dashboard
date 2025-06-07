import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiChevronDown,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiShoppingBag,
} from "react-icons/fi";

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

// --- Helper Component for Styled Status Badges ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let styles = {
    gradient: "from-gray-500 to-slate-500",
    icon: <FiShoppingBag />,
  };

  switch (status.toLowerCase()) {
    case "confirmed":
      styles = {
        gradient: "from-emerald-500 to-green-500",
        icon: <FiCheckCircle />,
      };
      break;
    case "pending":
      styles = {
        gradient: "from-amber-500 to-yellow-500",
        icon: <FiClock />,
      };
      break;
    case "cancelled":
      styles = {
        gradient: "from-red-500 to-pink-500",
        icon: <FiXCircle />,
      };
      break;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold text-white bg-gradient-to-r ${styles.gradient}`}
    >
      {styles.icon}
      <span>{status}</span>
    </div>
  );
};

const Guests: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["guests"],
    queryFn: fetchGuests,
    refetchInterval: 30000,
  });

  const filteredGuests = useMemo(() => {
    if (!data?.results) return [];
    return data.results.filter((guest) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        guest.full_name.toLowerCase().includes(lowerSearchTerm) ||
        guest.email.toLowerCase().includes(lowerSearchTerm) ||
        guest.code.toLowerCase().includes(lowerSearchTerm) ||
        guest.address.toLowerCase().includes(lowerSearchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        guest.booking_status.toLowerCase() === statusFilter;
      const matchesBookingType =
        bookingTypeFilter === "all" ||
        guest.booking_type.toLowerCase() === bookingTypeFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        guest.payment_status.toLowerCase() === paymentStatusFilter;

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

  const handleRowClick = (guestId: string) => {
    navigate(`/guests/${guestId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading guests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-8 rounded-xl shadow max-w-md w-full">
          <h3 className="font-bold text-lg mb-2">Failed to load guests</h3>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error.message || "An unknown error occurred."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Guests Management
          </h2>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, booking code, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-slate-50 hover:border-blue-400 transition-all text-gray-600 font-medium shadow-sm"
          >
            <FiFilter className="w-4 h-4 text-blue-500" />
            Filters
            <FiChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {["Booking Status", "Booking Type", "Payment Status"].map(
                (label, index) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <select
                      value={
                        [statusFilter, bookingTypeFilter, paymentStatusFilter][
                          index
                        ]
                      }
                      onChange={(e) =>
                        [
                          setStatusFilter,
                          setBookingTypeFilter,
                          setPaymentStatusFilter,
                        ][index](e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    >
                      {index === 0 && (
                        <>
                          <option value="all">All Statuses</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="expired">Expired</option>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <option value="all">All Types</option>
                          <option value="physical">Physical</option>
                          <option value="online">Online</option>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <option value="all">All Payment Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </>
                      )}
                    </select>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing{" "}
          <span className="font-bold text-blue-600">
            {filteredGuests.length}
          </span>{" "}
          of <span className="font-bold text-gray-700">{data?.count || 0}</span>{" "}
          guests
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {["Guest", "Contact", "Financials", "Booking Details"].map(
                  (title) => (
                    <th
                      key={title}
                      className="text-left p-4 font-semibold text-slate-600 border-b-2 border-slate-200 text-sm tracking-wider uppercase"
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr
                  key={guest.id}
                  onClick={() => handleRowClick(guest.id)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100"
                >
                  <td className="p-4 align-top">
                    <div className="font-bold text-gray-900">
                      {guest.full_name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {guest.address}
                    </div>
                  </td>
                  <td className="p-4 align-top text-sm">
                    <div className="font-medium text-gray-800">
                      {guest.email}
                    </div>
                    <div className="text-gray-500">{guest.phone_number}</div>
                  </td>
                  <td className="p-4 align-top text-sm">
                    <div className="font-semibold text-emerald-600">
                      ${guest.amount_paid}{" "}
                      <span className="text-gray-400 font-normal">of</span> $
                      {guest.amount_required}
                    </div>
                    <div className="text-gray-500">{guest.payment_status}</div>
                  </td>
                  <td className="p-4 align-top">
                    <StatusBadge status={guest.booking_status} />
                    <div className="text-sm text-gray-500 mt-2">
                      <span className="font-medium text-gray-700">
                        {guest.property_item_type}
                      </span>{" "}
                      ({guest.booking_type})
                    </div>
                    <code className="mt-1 inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">
                      {guest.code}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGuests.length === 0 && (
            <div className="text-center py-16">
              <FiUser className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2 font-semibold">
                No Guests Found
              </p>
              <p className="text-slate-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guests;
