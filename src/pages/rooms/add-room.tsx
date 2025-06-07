import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import {
  FaBed,
  FaDollarSign,
  FaPlus,
  FaSpinner,
  FaCheck,
  FaRedo,
  FaUsers,
  FaHashtag,
  FaAlignLeft,
  FaImage,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";

// --- Validation Schema ---
const addRoomSchema = yup.object().shape({
  code: yup.string().required("Room number or code is required."),
  description: yup.string().required("A brief description is required."),
  room_type_id: yup.string().required("Please select a room type."),
  price_per_night: yup
    .number()
    .typeError("Price must be a valid number.")
    .min(0, "Price cannot be negative.")
    .required("Price per night is required."),
  max_occupancy: yup
    .number()
    .typeError("Max occupancy must be a number.")
    .min(1, "At least 1 guest is required.")
    .required("Max occupancy is required."),
  amenities: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one amenity."),
  image: yup
    .string()
    .url("Please enter a valid URL.")
    .required("An image URL is required."),
  availability_status: yup
    .string()
    .required("Initial availability status is required."),
});

// --- Form Data & API Interfaces ---
interface AddRoomFormData {
  code: string;
  description: string;
  room_type_id: string;
  price_per_night: number;
  max_occupancy: number;
  hotel_id: string;
  amenities: string[];
  image: string;
  availability_status: string;
}

interface ApiResponse {
  id: string; // Assuming the API returns the new room's ID
}

// --- Reusable Form Field Component ---
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

export default function AddRoom() {
  const hotel = useHotelContext();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  // --- React Hook Form Setup ---
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<AddRoomFormData>({
    resolver: yupResolver(addRoomSchema),
    mode: "onChange",
    defaultValues: {
      hotel_id: hotel.id,
      max_occupancy: 2,
      availability_status: "Available",
    },
  });

  // --- TanStack Mutation for API Call ---
  const addRoomMutation = useMutation<ApiResponse, Error, AddRoomFormData>({
    mutationFn: async (newRoomData) => {
      // **IMPORTANT**: Replace with your actual API endpoint for creating rooms
      const response = await fetch(
        "https://hotel.tradesync.software/api/v1/rooms/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRoomData),
        }
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || "Failed to create room.");
      }
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      reset(); // Clear the form
      queryClient.invalidateQueries({ queryKey: ["hotelData"] }); // Optional: refetch hotel data to show new room counts
      window.scrollTo(0, 0);
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (error) => {
      alert(`Error creating room: ${error.message}`);
    },
  });

  const onSubmit = (data: AddRoomFormData) => {
    addRoomMutation.mutate(data);
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all shadow-sm ${
      hasError
        ? "border-red-400 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500"
        : "border-slate-300 bg-white focus:ring-blue-500 focus:border-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {showSuccess && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl p-4 flex items-center gap-3 shadow-lg animate-pulse">
            <FaCheck size={20} />
            <span className="font-bold">New room added successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <header className="flex items-center gap-4 p-6 border-b border-slate-200">
            <div className="w-2 h-10 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Add New Room
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Provide the details for the new room to add it to your property.
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-8">
              {/* --- Room Details Section --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  label="Room Number / Code"
                  icon={<FaHashtag className="text-slate-400" />}
                  error={errors.code?.message}
                  isRequired
                >
                  <input
                    {...register("code")}
                    type="text"
                    className={inputClass(!!errors.code)}
                    placeholder="e.g., 101, 205-A, P-1"
                  />
                </FormField>
                <FormField
                  label="Room Type"
                  icon={<FaBed className="text-slate-400" />}
                  error={errors.room_type_id?.message}
                  isRequired
                >
                  <select
                    {...register("room_type_id")}
                    className={inputClass(!!errors.room_type_id)}
                  >
                    <option value="">Select a room type...</option>
                    {hotel.room_type?.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <div className="lg:col-span-2">
                  <FormField
                    label="Description"
                    icon={<FaAlignLeft className="text-slate-400" />}
                    error={errors.description?.message}
                    isRequired
                  >
                    <textarea
                      {...register("description")}
                      className={`${inputClass(
                        !!errors.description
                      )} min-h-[100px]`}
                      placeholder="A brief, enticing description of the room..."
                    ></textarea>
                  </FormField>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* --- Capacity & Pricing Section --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  label="Max Occupancy"
                  icon={<FaUsers className="text-slate-400" />}
                  error={errors.max_occupancy?.message}
                  isRequired
                >
                  <input
                    {...register("max_occupancy")}
                    type="number"
                    min="1"
                    className={inputClass(!!errors.max_occupancy)}
                  />
                </FormField>
                <FormField
                  label="Price Per Night ($)"
                  icon={<FaDollarSign className="text-emerald-500" />}
                  error={errors.price_per_night?.message}
                  isRequired
                >
                  <input
                    {...register("price_per_night")}
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputClass(!!errors.price_per_night)}
                    placeholder="e.g., 150.00"
                  />
                </FormField>
              </div>

              <hr className="border-slate-200" />

              {/* --- Features & Status Section --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <FormField
                    label="Image URL"
                    icon={<FaImage className="text-slate-400" />}
                    error={errors.image?.message}
                    isRequired
                  >
                    <input
                      {...register("image")}
                      type="text"
                      className={inputClass(!!errors.image)}
                      placeholder="https://example.com/image.png"
                    />
                  </FormField>
                </div>
                <FormField
                  label="Amenities"
                  icon={<FaShieldAlt className="text-slate-400" />}
                  error={errors.amenities?.message}
                  isRequired
                >
                  <select
                    {...register("amenities")}
                    multiple
                    className={`${inputClass(!!errors.amenities)} h-32`}
                  >
                    {hotel.amenities?.map((am) => (
                      <option key={am} value={am}>
                        {am}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Hold Ctrl/Cmd to select multiple amenities.
                  </p>
                </FormField>
                <FormField
                  label="Initial Status"
                  icon={<FaTools className="text-slate-400" />}
                  error={errors.availability_status?.message}
                  isRequired
                >
                  <select
                    {...register("availability_status")}
                    className={inputClass(!!errors.availability_status)}
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
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
                  onClick={() => reset()}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-200 text-slate-700 transition-all hover:bg-slate-300"
                >
                  <FaRedo size={14} /> Clear
                </button>
                <button
                  type="submit"
                  disabled={!isValid || addRoomMutation.isPending}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {addRoomMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} /> Adding
                      Room...
                    </>
                  ) : (
                    <>
                      <FaPlus size={16} /> Add Room
                    </>
                  )}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}
