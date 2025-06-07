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
  FaStickyNote,
} from "react-icons/fa";

// * - - - - - Validation Schema
const bookingSchema = yup.object().shape({
  full_name: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  address: yup.string(),
  phone_number: yup.number().typeError("Phone number must be a valid number"),
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
      return !start_date || !value || new Date(value) > new Date(start_date);
    }),
  property_item_type: yup.string().required("Please select a room type"),
  number_of_booked_property: yup
    .number()
    .required("Number of rooms is required")
    .min(1, "At least 1 room is required")
    .typeError("Must be a number"),
  amount_paid: yup
    .number()
    .min(0, "Amount paid cannot be negative")
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .typeError("Must be a number"),
});

// * * * - - - FORM DATA INTERFACE
interface BookingFormData {
  full_name: string;
  address: string;
  phone_number: number;
  email: string;
  start_date: string;
  end_date: string;
  microservice_item_id: string;
  microservice_item_name: string;
  number_of_booked_property: number;
  amount_paid: string;
  amount_required: string;
  property_item_type: string;
  booking_type: string;
  property_item: string;
}

interface BookingResponse {
  id: string;
}

// --- HELPER COMPONENT FOR FORM FIELDS ---
const FormField: React.FC<{
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  isRequired?: boolean;
}> = ({ label, icon, error, children, isRequired }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
      {icon}
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default function NewBooking() {
  const hotel = useHotelContext();
  const [showSuccess, setShowSuccess] = useState(false);

  const initialFormState: BookingFormData = {
    full_name: "",
    address: "",
    phone_number: undefined,
    email: "",
    start_date: "",
    end_date: "",
    microservice_item_id: hotel.id,
    microservice_item_name: hotel.name,
    number_of_booked_property: 1,
    amount_paid: "",
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
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    defaultValues: initialFormState,
    mode: "onChange",
  });

  const watchedPropertyType = watch("property_item_type");

  React.useEffect(() => {
    if (watchedPropertyType) {
      const selectedRoom = hotel.room_type.find(
        (rt) => rt.name === watchedPropertyType
      );
      const avgPrice = selectedRoom?.pricing?.avg_price || 0;
      setValue("amount_required", avgPrice.toFixed(2));
    } else {
      setValue("amount_required", "0.00");
    }
  }, [watchedPropertyType, hotel.room_type, setValue]);

  const createBookingMutation = useMutation<
    BookingResponse,
    Error,
    BookingFormData
  >({
    mutationFn: async (newBookingData) => {
      const response = await fetch(
        "http://booking.tradesync.software/api/v1/bookings/web-create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBookingData),
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
    onSuccess: () => {
      setShowSuccess(true);
      reset(initialFormState);
      window.scrollTo(0, 0); // Scroll to top to show success message
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (error) => {
      alert(`Error creating booking: ${error.message}`);
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const handleClear = () => {
    reset(initialFormState);
    setShowSuccess(false);
  };

  const currentValues = watch();

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all shadow ${
      hasError
        ? "border-red-400 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500"
        : "border-slate-300 bg-white focus:ring-blue-500 focus:border-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {showSuccess && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl p-4 flex items-center gap-3 shadow animate-pulse">
            <FaCheck size={20} />
            <span className="font-bold">Booking created successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
          <header className="flex items-center gap-4 p-6 border-b border-slate-200">
            <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Booking
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Complete the form below to create a new hotel booking.
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-8">
              {/* --- Guest Information Section --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  icon={<FaUser className="text-slate-400" />}
                  error={errors.full_name?.message}
                  isRequired
                >
                  <input
                    {...register("full_name")}
                    type="text"
                    className={inputClass(!!errors.full_name)}
                    placeholder="Enter guest's full name"
                  />
                </FormField>
                <FormField
                  label="Email Address"
                  icon={<FaEnvelope className="text-slate-400" />}
                  error={errors.email?.message}
                  isRequired
                >
                  <input
                    {...register("email")}
                    type="email"
                    className={inputClass(!!errors.email)}
                    placeholder="guest@example.com"
                  />
                </FormField>
                <FormField
                  label="Phone Number"
                  icon={<FaPhone className="text-slate-400" />}
                  error={errors.phone_number?.message}
                >
                  <input
                    {...register("phone_number")}
                    type="tel"
                    className={inputClass(!!errors.phone_number)}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormField>
                <FormField
                  label="Address"
                  icon={<FaMapMarkerAlt className="text-slate-400" />}
                  error={errors.address?.message}
                >
                  <input
                    {...register("address")}
                    type="text"
                    className={inputClass(!!errors.address)}
                    placeholder="123 Main St, Anytown, USA"
                  />
                </FormField>
              </div>

              <hr className="border-slate-200" />

              {/* --- Booking Details Section --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  label="Check-in Date"
                  icon={<FaCalendarAlt className="text-slate-400" />}
                  error={errors.start_date?.message}
                  isRequired
                >
                  <input
                    {...register("start_date")}
                    type="date"
                    className={inputClass(!!errors.start_date)}
                  />
                </FormField>
                <FormField
                  label="Check-out Date"
                  icon={<FaCalendarAlt className="text-slate-400" />}
                  error={errors.end_date?.message}
                  isRequired
                >
                  <input
                    {...register("end_date")}
                    type="date"
                    className={inputClass(!!errors.end_date)}
                  />
                </FormField>
                <FormField
                  label="Room Type"
                  icon={<FaBed className="text-slate-400" />}
                  error={errors.property_item_type?.message}
                  isRequired
                >
                  <select
                    {...register("property_item_type")}
                    className={inputClass(!!errors.property_item_type)}
                  >
                    <option value="">Select Room Type</option>
                    {hotel.room_type.map((rt) => (
                      <option key={rt.name} value={rt.name}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Number of Rooms"
                  icon={<FaUsers className="text-slate-400" />}
                  error={errors.number_of_booked_property?.message}
                  isRequired
                >
                  <input
                    {...register("number_of_booked_property")}
                    type="number"
                    min="1"
                    className={inputClass(!!errors.number_of_booked_property)}
                  />
                </FormField>
              </div>

              <hr className="border-slate-200" />

              {/* --- Payment Information Section --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  label="Amount Paid ($)"
                  icon={<FaDollarSign className="text-emerald-500" />}
                  error={errors.amount_paid?.message}
                >
                  <input
                    {...register("amount_paid")}
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputClass(!!errors.amount_paid)}
                    placeholder="0.00"
                  />
                </FormField>
                <FormField
                  label="Amount Required ($)"
                  icon={<FaDollarSign className="text-slate-400" />}
                >
                  <input
                    {...register("amount_required")}
                    type="text"
                    className={`${inputClass(
                      false
                    )} bg-slate-100 cursor-not-allowed`}
                    readOnly
                  />
                </FormField>
              </div>
            </div>

            <footer className="mt-6 px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-200 text-slate-700 transition-all hover:bg-slate-300"
                >
                  <FaRedo size={14} /> Clear
                </button>
                <button
                  type="submit"
                  disabled={!isValid || createBookingMutation.isPending}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all hover:shadow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />{" "}
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus size={16} /> Create Booking
                    </>
                  )}
                </button>
              </div>
            </footer>
          </form>
        </div>

        {/* --- Booking Summary Card --- */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <FaStickyNote className="text-blue-500" size={20} />
            <h3 className="text-xl font-bold text-slate-800">
              Live Booking Summary
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-500">
                Hotel
              </span>{" "}
              <p className="text-slate-800 font-medium">{hotel.name}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-500">
                Guest Name
              </span>{" "}
              <p className="text-slate-800 font-medium">
                {currentValues.full_name || "..."}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-500">
                Email
              </span>{" "}
              <p className="text-slate-800 font-medium truncate">
                {currentValues.email || "..."}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-500">
                Room Type
              </span>{" "}
              <p className="text-slate-800 font-medium">
                {currentValues.property_item_type || "..."}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-500">
                # of Rooms
              </span>{" "}
              <p className="text-slate-800 font-medium">
                {currentValues.number_of_booked_property}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg col-span-2 md:col-span-1">
              <span className="block text-xs font-semibold text-slate-500">
                Stay Period
              </span>{" "}
              <p className="text-slate-800 font-medium">
                {currentValues.start_date && currentValues.end_date
                  ? `${currentValues.start_date} → ${currentValues.end_date}`
                  : "..."}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <span className="block text-xs font-semibold text-emerald-700">
                Total Required
              </span>{" "}
              <p className="text-emerald-800 font-bold text-base">
                ${currentValues.amount_required || "0.00"}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="block text-xs font-semibold text-blue-700">
                Total Paid
              </span>{" "}
              <p className="text-blue-800 font-bold text-base">
                ${currentValues.amount_paid || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
