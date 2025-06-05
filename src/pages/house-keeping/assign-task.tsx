import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  FileText,
  Plus,
  RotateCcw,
  Check,
} from "lucide-react";

// Define form data interface
interface TaskFormData {
  room: string;
  priority: number;
  scheduled_date: string;
  scheduled_time: string;
  assigned_to: string;
  status: string;
  verified_by: string;
  notes: string;
  hotel: string;
}

export default function AssignTask() {
  const [formData, setFormData] = useState<TaskFormData>({
    room: "",
    priority: 5,
    scheduled_date: "",
    scheduled_time: "",
    assigned_to: "",
    status: "Scheduled",
    verified_by: "",
    notes: "",
    hotel: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Room options for dropdown
  const roomOptions = [
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "209",
    "210",
    "301",
    "302",
    "303",
    "304",
    "305",
    "306",
    "307",
    "308",
    "309",
    "310",
    "Lobby",
    "Reception",
    "Restaurant",
    "Conference Room A",
    "Conference Room B",
    "Gym",
    "Pool Area",
    "Spa",
    "Business Center",
    "Parking Garage",
    "Laundry Room",
    "Kitchen",
    "Bar",
    "Terrace",
    "Garden",
    "Storage Room",
  ];

  // Status options
  const statusOptions = [
    "Scheduled",
    "In Progress",
    "Completed",
    "Verified",
    "Needs Attention",
  ];

  // Hotel options
  const hotelOptions = [
    "Grand Plaza Hotel",
    "Ocean View Resort",
    "City Center Inn",
    "Mountain Lodge",
    "Seaside Suites",
    "Downtown Business Hotel",
  ];

  // Staff members
  const staffOptions = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Wilson",
    "Carol Brown",
    "David Lee",
    "Emma Davis",
    "Frank Miller",
    "Grace Taylor",
    "Henry Clark",
  ];

  // Handle form input changes
  const handleInputChange = (
    field: keyof TaskFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("New task created:", formData);
      setIsSubmitting(false);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Handle form clear
  const handleClear = () => {
    setFormData({
      room: "",
      priority: 5,
      scheduled_date: "",
      scheduled_time: "",
      assigned_to: "",
      status: "Scheduled",
      verified_by: "",
      notes: "",
      hotel: "",
    });
    setShowSuccess(false);
  };

  // Check if form is valid
  const isFormValid = formData.room && formData.assigned_to && formData.hotel;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">
              Task assigned successfully!
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
              <Plus size={24} className="text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-800">
                Assign New Housekeeping Task
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Create and assign a new housekeeping task to staff members
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Row 1: Hotel and Room */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hotel Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Hotel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hotel}
                    onChange={(e) => handleInputChange("hotel", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                    required
                  >
                    <option value="">Select Hotel</option>
                    {hotelOptions.map((hotel) => (
                      <option key={hotel} value={hotel}>
                        {hotel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Room / Place <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.room}
                    onChange={(e) => handleInputChange("room", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                    required
                  >
                    <option value="">Select Room/Place</option>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Priority and Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <AlertTriangle size={16} />
                    Priority (0-10)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange(
                          "priority",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ borderColor: "#E6E7EB" }}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {formData.priority <= 5
                        ? "🟢 Low Priority"
                        : formData.priority <= 7
                        ? "🟡 Medium Priority"
                        : "🔴 High Priority"}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Check size={16} />
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Date and Time */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scheduled Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} />
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) =>
                      handleInputChange("scheduled_date", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                  />
                </div>

                {/* Scheduled Time */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} />
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) =>
                      handleInputChange("scheduled_time", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                  />
                </div>
              </div>

              {/* Row 4: Staff Assignment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned To */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Assigned To <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) =>
                      handleInputChange("assigned_to", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                    required
                  >
                    <option value="">Select Staff Member</option>
                    {staffOptions.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verified By */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Verified By
                  </label>
                  <select
                    value={formData.verified_by}
                    onChange={(e) =>
                      handleInputChange("verified_by", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ borderColor: "#E6E7EB" }}
                  >
                    <option value="">Select Verifier (Optional)</option>
                    {staffOptions.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Task Notes & Instructions
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter detailed task instructions, special requirements, or additional notes..."
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  style={{ borderColor: "#E6E7EB" }}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.notes.length}/500 characters
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div
            className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4"
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
                <RotateCcw size={16} />
                Clear
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
                style={{ backgroundColor: "#0EB981" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Assign Task
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form Summary Card */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Task Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Hotel:</span>
              <p className="text-gray-800">
                {formData.hotel || "Not selected"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Room/Place:</span>
              <p className="text-gray-800">{formData.room || "Not selected"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Assigned To:</span>
              <p className="text-gray-800">
                {formData.assigned_to || "Not assigned"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Priority:</span>
              <p className="text-gray-800">
                {formData.priority} -{" "}
                {formData.priority <= 5
                  ? "Low"
                  : formData.priority <= 7
                  ? "Medium"
                  : "High"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <p className="text-gray-800">{formData.status}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Schedule:</span>
              <p className="text-gray-800">
                {formData.scheduled_date && formData.scheduled_time
                  ? `${formData.scheduled_date} at ${formData.scheduled_time}`
                  : "Not scheduled"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
