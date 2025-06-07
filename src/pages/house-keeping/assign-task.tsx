import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../contexts/authcontext"; // Assuming you have this
import {
  FaTasks,
  FaUser,
  FaBuilding,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaStickyNote,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoSave } from "react-icons/io5";

// --- Constants and Types ---
const statuses = ["Scheduled", "In Progress", "Needs Attention"];
type Staff = { id: string; fullname: string; department: string };

// --- API Functions ---
const fetchStaffList = async (): Promise<Staff[]> => {
  const { data } = await axios.get("http://localhost:3001/staffs?role=staff");
  return data;
};

const createTask = async (newTask) => {
  const { data } = await axios.post("http://localhost:3001/tasks", newTask);
  return data;
};

// --- Main Component ---
export default function AssignTask() {
  const { user: adminUser } = useAuth(); // Get logged-in admin
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    task_title: "",
    priority: 5,
    assigned_to_id: "",
    department: "",
    status: statuses[0],
    task_notes: "",
    scheduled_date: "",
    scheduled_time: "",
    room_place: "",
  });

  const { data: staffList = [] } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaffList,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      alert("Task assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch all tasks
      setFormData({
        task_title: "",
        priority: 5,
        assigned_to_id: "",
        department: "",
        status: statuses[0],
        task_notes: "",
        scheduled_date: "",
        scheduled_time: "",
        room_place: "",
      });
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  // Effect to update department when assigned staff changes
  useEffect(() => {
    const selectedStaff = staffList.find(
      (s) => s.id === formData.assigned_to_id
    );
    if (selectedStaff) {
      setFormData((prev) => ({
        ...prev,
        department: selectedStaff.department,
      }));
    }
  }, [formData.assigned_to_id, staffList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStaff = staffList.find(
      (s) => s.id === formData.assigned_to_id
    );
    if (!selectedStaff) {
      alert("Please select a staff member to assign the task.");
      return;
    }

    const submissionData = {
      ...formData,
      priority: Number(formData.priority),
      assigned_by: adminUser?.fullname || "Admin",
      assigned_to_name: selectedStaff.fullname,
    };
    mutate(submissionData);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
            <FaTasks /> Assign a New Task
          </h2>
          <p className="text-gray-600 mt-1">
            Delegate and schedule tasks for hotel staff.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-6"
        >
          <div>
            <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
              <FaStickyNote className="mr-2 text-purple-500" />
              Task Title*
            </label>
            <input
              type="text"
              name="task_title"
              value={formData.task_title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaUser className="mr-2 text-purple-500" />
                Assign To*
              </label>
              <select
                name="assigned_to_id"
                value={formData.assigned_to_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-white"
              >
                <option value="">Select Staff Member</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaBuilding className="mr-2 text-purple-500" />
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                disabled
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaExclamationTriangle className="mr-2 text-amber-500" />
                Priority (1-10)*
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaTasks className="mr-2 text-purple-500" />
                Initial Status*
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-white"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaCalendarAlt className="mr-2 text-purple-500" />
                Scheduled Date*
              </label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaClock className="mr-2 text-purple-500" />
                Scheduled Time*
              </label>
              <input
                type="time"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
                <FaMapMarkerAlt className="mr-2 text-purple-500" />
                Room / Place*
              </label>
              <input
                type="text"
                name="room_place"
                value={formData.room_place}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-blue-900 mb-1">
              <FaStickyNote className="mr-2 text-purple-500" />
              Task Notes
            </label>
            <textarea
              name="task_notes"
              value={formData.task_notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-md shadow-sm resize-none"
            />
          </div>

          <footer className="flex justify-end pt-4 border-t border-dashed">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center px-6 py-2 font-medium rounded-lg shadow-lg text-white bg-gradient-to-b from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-50"
            >
              <IoSave className="mr-2" />
              {isPending ? "Assigning..." : "Assign Task"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
