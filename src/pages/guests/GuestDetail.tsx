import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "../../utils/format";
import { useParams } from "react-router-dom";
import {
  FaCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaDesktop,
  FaStar,
  FaWifi,
  FaSwimmingPool,
  FaCar,
  FaUtensils,
  FaConciergeBell,
  FaDumbbell,
  FaCoffee,
} from "react-icons/fa";
import { FaCalendarCheck, FaCalendarXmark, FaBed } from "react-icons/fa6";

// --- TYPES (Interfaces remain the same) ---
interface GuestDetail {
  id: string;
  payment_status: string;
  full_name: string;
  code: string;
  address: string;
  phone_number: number;
  email: string;
  start_date: string;
  end_date: string;
  checkin: string | null;
  checkout: string | null;
  microservice_item_name: string;
  property_id: string;
  number_of_booked_property: number;
  amount_paid: string;
  amount_required: string;
  property_item_type: string;
  reference_number: string;
  booking_status: string;
  booking_type: string;
  voucher_code: string | null;
  rating: number | null;
  feedback: string | null;
  service_notes: string | null;
  special_requests: string | null;
  booking_source: string;
  payment_reference: string;
  cancellation_policy: string;
  status_history: Array<{
    status: string;
    timestamp: string;
    reason: string;
    amount_paid?: number;
    amount_required?: number;
  }>;
  discount_amount: string;
  discount_percentage: string;
  created_at: string;
  updated_at: string;
  duration_days: number;
}

interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  deleted_by: string | null;
}

interface RoomDetails {
  amenities: Amenity[];
  availability_status: string;
  average_rating: string;
  code: string;
  created_at: string;
  created_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  description: string;
  hotel: string;
  hotel_id: string;
  hotel_name: string;
  id: string;
  image: string;
  is_active: boolean;
  is_deleted: boolean;
  max_occupancy: number;
  price_per_night: number;
  review_count: number;
  room_aminities: string[];
  room_type: string;
  room_type_id: string;
  room_type_name: string;
  updated_at: string;
}

// --- COMPONENT ---
const GuestDetail: React.FC = () => {
  const { guestId } = useParams<{ guestId: string }>();
  console.log("- - - guestId");
  console.log(guestId);

  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

  const guestURL = `http://booking.tradesync.software/api/v1/bookings/${guestId}`;

  const {
    data: guestDetails,
    isLoading,
    isError,
    error,
  } = useQuery<GuestDetail>({
    queryKey: ["guest-details", guestId],
    queryFn: async () => {
      try {
        const response = await axios.get(guestURL);
        return response.data;
      } catch (error) {
        console.log(`An Error has occured: ${error.message}`);
        throw error;
      }
    },
  });

  const getRoomDetails = React.useCallback(async () => {
    try {
      if (guestDetails?.property_id) {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/rooms/${guestDetails.property_id}/`
        );
        setRoomDetails(response.data);
      }
    } catch (error) {
      console.log(`An Error has occured: ${error.message}`);
    }
  }, [guestDetails]);

  useEffect(() => {
    getRoomDetails();
  }, [getRoomDetails]);

  // Helper function to get amenity icon
  const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    if (name.includes("wifi") || name.includes("internet"))
      return <FaWifi className="text-blue-500" />;
    if (name.includes("pool") || name.includes("swimming"))
      return <FaSwimmingPool className="text-cyan-500" />;
    if (name.includes("parking") || name.includes("car"))
      return <FaCar className="text-gray-600" />;
    if (name.includes("restaurant") || name.includes("dining"))
      return <FaUtensils className="text-orange-500" />;
    if (name.includes("service") || name.includes("concierge"))
      return <FaConciergeBell className="text-purple-500" />;
    if (name.includes("gym") || name.includes("fitness"))
      return <FaDumbbell className="text-red-500" />;
    if (name.includes("coffee") || name.includes("breakfast"))
      return <FaCoffee className="text-amber-600" />;
    return <FaCheck className="text-emerald-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading guest details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-8 rounded-xl shadow  max-w-md w-full">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Error Fetching Data</h3>
          </div>
          <p className="mb-4">
            Failed to load guest data. Please check your connection and try
            again.
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error?.message || "An unknown error occurred."}
          </p>
        </div>
      </div>
    );
  }

  if (!guestDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="bg-gray-200 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <FaUser className="text-gray-500 text-2xl" />
          </div>
          <p className="text-gray-500 text-xl">Guest details not available.</p>
        </div>
      </div>
    );
  }

  const BookingStatusBadge = ({ status }: { status: string }) => {
    const baseClasses =
      "px-4 py-2 text-sm font-bold rounded-full inline-flex items-center gap-2 shadow";
    let statusClasses = "";
    let icon = null;

    switch (status.toLowerCase()) {
      case "confirmed":
        statusClasses =
          "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200";
        icon = <FaCheck className="w-3 h-3" />;
        break;
      case "pending":
        statusClasses =
          "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-200";
        icon = (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
        break;
      case "cancelled":
        statusClasses =
          "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200";
        icon = (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
        break;
      default:
        statusClasses =
          "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-gray-200";
        icon = <FaDesktop className="w-3 h-3" />;
    }

    return (
      <span className={`${baseClasses} ${statusClasses}`}>
        {icon}
        {status}
      </span>
    );
  };

  const PaymentStatusLabel = ({ status }: { status: string }) => {
    const isCompleted =
      status.toLowerCase().includes("completed") ||
      status.toLowerCase().includes("paid");
    const isPending = status.toLowerCase().includes("pending");

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isCompleted
              ? "bg-emerald-500 animate-pulse"
              : isPending
              ? "bg-amber-500 animate-pulse"
              : "bg-gray-400"
          }`}
        ></div>
        <span
          className={`font-semibold ${
            isCompleted
              ? "text-emerald-600"
              : isPending
              ? "text-amber-600"
              : "text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="grid grid-cols-12 gap-8">
        {/* --- Enhanced Profile Card --- */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl shadow p-6 h-fit transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Guest Profile
            </h2>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              <span className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full h-24 w-24 text-4xl font-bold mb-4 shadow">
                {guestDetails.full_name.charAt(0)}
              </span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <FaCheck className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {guestDetails.full_name}
            </h2>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-600">
                ID: {guestDetails.code}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm mb-6">
            <div className="flex items-center text-gray-700 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FaPhone className="text-blue-600 text-sm" />
              </div>
              <span className="font-medium">{guestDetails.phone_number}</span>
            </div>
            <div className="flex items-center text-gray-700 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <FaEnvelope className="text-emerald-600 text-sm" />
              </div>
              <span className="font-medium break-all">
                {guestDetails.email}
              </span>
            </div>
            <div className="flex items-start text-gray-700 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 mt-0">
                <FaMapMarkerAlt className="text-red-600 text-sm" />
              </div>
              <span className="font-medium">{guestDetails.address}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaCreditCard className="text-blue-600 text-sm" />
                  </div>
                  <span className="font-medium text-gray-700">Payment</span>
                </div>
                <PaymentStatusLabel status={guestDetails.payment_status} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FaDesktop className="text-purple-600 text-sm" />
                  </div>
                  <span className="font-medium text-gray-700">Platform</span>
                </div>
                <span className="font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs">
                  {guestDetails.booking_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Enhanced Booking & Room Card --- */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow grid grid-cols-12 gap-0 overflow-hidden transition-all duration-300 hover:shadow border border-gray-100">
          <div className="p-8 col-span-12 md:col-span-8 bg-gradient-to-br from-white to-blue-50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Booking Information
                  </h2>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full inline-block">
                  <p className="text-xs text-gray-600 font-medium">
                    Booked on: {formatDateTime(guestDetails.created_at)}
                  </p>
                </div>
              </div>
              <BookingStatusBadge status={guestDetails.booking_status} />
            </div>

            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <span className="text-sm font-medium text-blue-700 block mb-1">
                Payment Reference
              </span>
              <div className="flex items-center gap-2">
                <p className="font-bold text-blue-900 text-lg">
                  {guestDetails.payment_reference}
                </p>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <FaBed className="text-blue-500" />
                  <h4 className="text-sm font-bold text-blue-700">Room Type</h4>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {guestDetails.property_item_type}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-purple-500" />
                  <h4 className="text-sm font-bold text-purple-700">
                    Max Occupancy
                  </h4>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {roomDetails?.max_occupancy} Guests
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                  <h4 className="text-sm font-bold text-emerald-700">
                    Room Code
                  </h4>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {roomDetails?.code}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarCheck className="text-emerald-500" />
                  <h4 className="text-sm font-bold text-emerald-700">
                    Check-in
                  </h4>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {guestDetails.start_date}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarXmark className="text-red-500" />
                  <h4 className="text-sm font-bold text-red-700">Check-out</h4>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {guestDetails.end_date}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                  <h4 className="text-sm font-bold text-amber-700">Duration</h4>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {guestDetails.duration_days} Days
                </p>
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold">Total Amount</h4>
                </div>
                <p className="text-3xl font-bold">
                  ${parseFloat(guestDetails.amount_required).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex flex-col border-l border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Room Details
              </h4>
            </div>

            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 shadow group">
              <img
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={
                  roomDetails?.image || "https://via.placeholder.com/400x300"
                }
                alt={roomDetails?.room_type_name || "Hotel Room"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              {roomDetails?.average_rating && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-amber-500 text-xs" />
                  <span className="text-xs font-bold text-gray-800">
                    {roomDetails.average_rating}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FaBed className="text-blue-500" />
                <h4 className="font-bold text-gray-800">Amenities</h4>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {roomDetails?.amenities.slice(0, 6).map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg shadow hover:shadow transition-shadow"
                  >
                    {getAmenityIcon(amenity.name)}
                    <span className="text-sm font-medium text-gray-700">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {roomDetails?.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetail;
