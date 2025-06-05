import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaBed,
  FaDollarSign,
  FaPlus,
  FaSpinner,
  FaCheck,
  FaRedo,
  FaUsers,
  FaHotel,
  FaStickyNote,
} from "react-icons/fa";

// Validation schema
const bookingSchema = yup.object().shape({
  full_name: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  address: yup.string(),
  phone_number: yup.string(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  start_date: yup.string().required("Start date is required"),
  end_date: yup
    .string()
    .required("End date is required")
    .test("date-after", "End date must be after start date", function (value) {
      const { start_date } = this.parent;
      if (start_date && value) {
        return new Date(value) > new Date(start_date);
      }
      return true;
    }),
  property_item_type: yup.string().required("Room type is required"),
  number_of_booked_property: yup
    .number()
    .required("Number of rooms is required")
    .min(1, "At least 1 room is required"),
  amount_paid: yup
    .number()
    .min(0, "Amount paid cannot be negative")
    .transform((value, originalValue) => {
      return originalValue === "" ? 0 : value;
    }),
});

// Form data interface
interface BookingFormData {
  full_name: string;
  address: string;
  phone_number: string;
  email: string;
  start_date: string;
  end_date: string;
  microservice_item_id: string;
  microservice_item_name: string;
  number_of_booked_property: number;
  amount_paid: number;
  amount_required: string;
  property_item_type: string;
  booking_type: string;
  property_item: string;
}

interface BookingResponse {
  id: string;
}

export default function NewBooking() {
  const hotel = useHotelContext();
  const [showSuccess, setShowSuccess] = useState(false);

  const initialFormState: BookingFormData = {
    full_name: "",
    address: "",
    phone_number: "",
    email: "",
    start_date: "",
    end_date: "",
    microservice_item_id: hotel.id,
    microservice_item_name: hotel.name,
    number_of_booked_property: 1,
    amount_paid: 0,
    amount_required: "",
    property_item_type: "",
    booking_type: "Physical",
    property_item: "5953bf7b-14f1-4964-a13c-d0a1e8377214",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
    getValues,
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    defaultValues: initialFormState,
    mode: "onChange",
  });

  const watchedPropertyType = watch("property_item_type");

  // Update amount required when room type changes
  React.useEffect(() => {
    if (watchedPropertyType) {
      const selectedRoom = hotel.room_type.find(
        (rt) => rt.name === watchedPropertyType
      );
      const avgPrice = selectedRoom?.pricing?.avg_price || 0;
      setValue("amount_required", avgPrice.toString());
    }
  }, [watchedPropertyType, hotel.room_type, setValue]);

  const createBookingMutation = useMutation<
    BookingResponse,
    Error,
    BookingFormData
  >({
    mutationFn: async (newBookingData) => {
      const response = await fetch(
        "http://booking.tradesync.software/api/v1/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newBookingData,
            initialFormState, // Include initial form state
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody.message ||
            `Failed to create booking: ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Booking created successfully:", data);
      console.log("Initial form state:", initialFormState);
      console.log("Final form data:", getValues());
      setShowSuccess(true);
      reset(initialFormState);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      alert(`Error creating booking: ${error.message}`);
    },
  });

  const onSubmit = (data: BookingFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Initial form state:", initialFormState);
    createBookingMutation.mutate(data);
  };

  const handleClear = () => {
    reset(initialFormState);
    setShowSuccess(false);
  };

  const currentValues = watch();

  console.log(`BOOKING RESPONSE`);
  console.log(createBookingMutation);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <FaCheck className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">
              Booking created successfully!
            </span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div
            className="px-6 py-4 border-b-2"
            style={{ backgroundColor: "#CCDCF1", borderColor: "#E6E7EB" }}
          >
            <div className="flex items-center gap-3">
              <FaPlus size={24} className="text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-800">
                Create New Booking
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Complete the form below to create a new hotel booking
            </p>
          </div>

          {/* Form Body */}
          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Row 1: Guest Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaUser size={16} />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("full_name")}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.full_name ? "border-red-300 bg-red-50" : ""
                    }`}
                    style={{
                      borderColor: errors.full_name ? "#FCA5A5" : "#E6E7EB",
                    }}
                    placeholder="Enter guest's full name"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope size={16} />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? "border-red-300 bg-red-50" : ""
                    }`}
                    style={{
                      borderColor: errors.email ? "#FCA5A5" : "#E6E7EB",
                    }}
                    placeholder="guest@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Contact Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaPhone size={16} />
                    Phone Number
                  </label>
                  <input
                    {...register("phone_number")}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.phone_number ? "border-red-300 bg-red-50" : ""
                    }`}
                    style={{
                      borderColor: errors.phone_number ? "#FCA5A5" : "#E6E7EB",
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt size={16} />
                    Address
                  </label>
                  <input
                    {...register("address")}
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                    placeholder="Guest's address"
                  />
                </div>
              </div>

              {/* Row 3: Booking Dates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt size={16} />
                    Check-in Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("start_date")}
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.start_date ? "border-red-300 bg-red-50" : ""
                    }`}
                    style={{
                      borderColor: errors.start_date ? "#FCA5A5" : "#E6E7EB",
                    }}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt size={16} />
                    Check-out Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("end_date")}
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.end_date ? "border-red-300 bg-red-50" : ""
                    }`}
                    style={{
                      borderColor: errors.end_date ? "#FCA5A5" : "#E6E7EB",
                    }}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Room Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Room Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaBed size={16} />
                    Room Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("property_item_type")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.property_item_type
                        ? "border-red-300 bg-red-50"
                        : ""
                    }`}
                    style={{
                      borderColor: errors.property_item_type
                        ? "#FCA5A5"
                        : "#E6E7EB",
                    }}
                  >
                    <option value="">Select Room Type</option>
                    {hotel.room_type.map((rt) => (
                      <option key={rt.name} value={rt.name}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                  {errors.property_item_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.property_item_type.message}
                    </p>
                  )}
                </div>

                {/* Number of Rooms */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaUsers size={16} />
                    Number of Rooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("number_of_booked_property", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.number_of_booked_property
                        ? "border-red-300 bg-red-50"
                        : ""
                    }`}
                    style={{
                      borderColor: errors.number_of_booked_property
                        ? "#FCA5A5"
                        : "#E6E7EB",
                    }}
                  />
                  {errors.number_of_booked_property && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.number_of_booked_property.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 5: Payment Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Amount Paid */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaDollarSign size={16} />
                    Amount Paid
                  </label>
                  <input
                    {...register("amount_paid", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.amount_paid ? "border-red-300 bg-red-50" : ""
                    }`}
                    style={{
                      borderColor: errors.amount_paid ? "#FCA5A5" : "#E6E7EB",
                    }}
                    placeholder="0.00"
                  />
                  {errors.amount_paid && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.amount_paid.message}
                    </p>
                  )}
                </div>

                {/* Amount Required */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaDollarSign size={16} />
                    Amount Required
                  </label>
                  <input
                    {...register("amount_required")}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none"
                    style={{ borderColor: "#E6E7EB" }}
                    placeholder="Select room type first"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Amount is automatically set based on selected room type
                  </p>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div
              className="mt-6 px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{ borderColor: "#E6E7EB" }}
            >
              <div className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Required fields
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80 flex-1 sm:flex-none justify-center"
                  style={{ backgroundColor: "#6B7280", color: "white" }}
                >
                  <FaRedo size={16} />
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={!isValid || createBookingMutation.isPending}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
                  style={{ backgroundColor: "#CCDCF1", color: "#374151" }}
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <FaPlus size={16} />
                      Create Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Booking Summary Card */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaStickyNote size={18} />
            Booking Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaHotel size={12} />
                Hotel:
              </span>
              <p className="text-gray-800 ml-4">
                {hotel.name || "Not specified"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaUser size={12} />
                Guest Name:
              </span>
              <p className="text-gray-800 ml-4">
                {currentValues.full_name || "Not entered"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaEnvelope size={12} />
                Email:
              </span>
              <p className="text-gray-800 ml-4">
                {currentValues.email || "Not entered"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaBed size={12} />
                Room Type:
              </span>
              <p className="text-gray-800 ml-4">
                {currentValues.property_item_type || "Not selected"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaUsers size={12} />
                Number of Rooms:
              </span>
              <p className="text-gray-800 ml-4">
                {currentValues.number_of_booked_property}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaCalendarAlt size={12} />
                Stay Period:
              </span>
              <p className="text-gray-800 ml-4">
                {currentValues.start_date && currentValues.end_date
                  ? `${currentValues.start_date} to ${currentValues.end_date}`
                  : "Not selected"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaDollarSign size={12} />
                Amount Required:
              </span>
              <p className="text-gray-800 ml-4">
                ${currentValues.amount_required || "0.00"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <FaDollarSign size={12} />
                Amount Paid:
              </span>
              <p className="text-gray-800 ml-4">
                ${currentValues.amount_paid || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
