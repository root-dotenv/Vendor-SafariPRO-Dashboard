import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";

// --- Type Definitions ---
interface BookingForm {
  full_name: string;
  address: string;
  phone_number: string;
  email: string;
  start_date: string;
  end_date: string;
  microservice_item_id: string;
  microservice_item_name: string;
  number_of_booked_property: number;
  amount_paid: string;
  amount_required: string;
  property_item_type: string;
}

interface BookingResponse {
  id: string;
}

export default function NewBooking() {
  const hotel = useHotelContext();

  const initialFormState: BookingForm = {
    full_name: "",
    address: "",
    phone_number: "",
    email: "",
    start_date: "",
    end_date: "",
    microservice_item_id: hotel.id,
    microservice_item_name: hotel.name,
    number_of_booked_property: 1,
    amount_paid: "",
    amount_required: "",
    property_item_type: "",
  };

  const [formData, setFormData] = useState<BookingForm>(initialFormState);

  const createBookingMutation = useMutation<
    BookingResponse,
    Error,
    BookingForm
  >({
    mutationFn: async (newBookingData) => {
      const response = await fetch(
        "http://booking.tradesync.software/api/v1/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
    onSuccess: (data) => {
      console.log("Booking created successfully:", data);
      setFormData(initialFormState);
      alert("Booking created successfully!");
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      alert(`Error creating booking: ${error.message}`);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const numValue = value === "" ? 0 : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else if (name === "property_item_type") {
      //  * - - -  Find the selected room type and set the amount required
      const selectedRoom = hotel.room_type.find((rt) => rt.name === value);
      const avgPrice = selectedRoom?.pricing?.avg_price || 0;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        amount_required: avgPrice.toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.property_item_type
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      alert("End date must be after start date.");
      return;
    }

    console.log(`############ All Form Inputs Data :`);
    console.log(
      formData.full_name,
      formData.address,
      formData.amount_paid,
      formData.amount_required,
      formData.email,
      formData.end_date,
      formData.number_of_booked_property,
      formData.property_item_type,
      formData.microservice_item_id,
      formData.microservice_item_name
    );
    console.log(`%%%%%%%%%%%% - - - Form Data`);

    createBookingMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">New Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Properties
          </label>
          <input
            type="number"
            name="number_of_booked_property"
            value={formData.number_of_booked_property}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount Paid</label>
          <input
            type="number"
            name="amount_paid"
            value={formData.amount_paid}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Amount Required
          </label>
          <input
            type="number"
            name="amount_required"
            value={formData.amount_required}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Select room type first"
            step="0.01"
            min="0"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            Amount is automatically set based on selected room type
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <select
            name="property_item_type"
            value={formData.property_item_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              Select a room type
            </option>
            {hotel.room_type.map((rt) => (
              <option key={rt.name} value={rt.name}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={createBookingMutation.isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {createBookingMutation.isPending
            ? "Creating Booking..."
            : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
