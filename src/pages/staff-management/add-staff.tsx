import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FaUserPlus,
  FaUserTie,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaIdBadge,
} from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

// Define the departments
const departments = [
  "Front Office",
  "House Keeping",
  "Food & Beverage",
  "Maintenance",
  "Sales & Marketing",
  "Human Resources",
];

// API function to add a new staff member
const addStaffMember = async (newStaff) => {
  const { data } = await axios.post("http://localhost:3001/staffs", newStaff);
  return data;
};

// Define the initial state for the form
const initialState = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  department: departments[0],
  role: "staff",
};

export default function AddStaff() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const { mutate, isPending } = useMutation({
    mutationFn: addStaffMember,
    onSuccess: () => {
      alert("Staff member created successfully!");
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      setFormData(initialState);
      navigate("/staffs/staff-list", {
        state: { successMessage: "You created a new staff member!" },
      });
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData(initialState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  // Determine if the form has been touched enough to show the summary
  const showSummary =
    formData.fullname &&
    formData.username &&
    formData.email &&
    formData.password;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaUserPlus className="text-indigo-600" />
            <span>Add New Staff Member</span>
          </h2>
          <p className="text-slate-500 mt-2 text-base">
            Create credentials and assign a department for a new employee.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-xl shadow-slate-200/50 border-t-4 border-indigo-600 space-y-6"
        >
          {/* --- Personal & Login Information --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-slate-600">
                <FaUserTie className="mr-2 text-indigo-500" /> Full Name*
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-slate-600">
                <FaIdBadge className="mr-2 text-indigo-500" /> Username*
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-slate-600">
                <FaEnvelope className="mr-2 text-indigo-500" /> Email Address*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-slate-600">
                <FaLock className="mr-2 text-indigo-500" /> Password*
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* --- Department Assignment --- */}
          <div className="pt-4 border-t border-slate-200/70">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-slate-600">
                <FaBuilding className="mr-2 text-indigo-500" /> Department*
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Confirmation Footer --- */}
          {showSummary && (
            <div className="pt-6 border-t border-slate-200/70 animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-700">
                Confirm Details
              </h3>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-500">
                    Full Name
                  </span>
                  <span className="text-slate-800">{formData.fullname}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-500">Username</span>
                  <span className="text-slate-800">{formData.username}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-500">Email</span>
                  <span className="text-slate-800">{formData.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-500">
                    Department
                  </span>
                  <span className="text-slate-800">{formData.department}</span>
                </div>
              </div>
            </div>
          )}

          {/* --- Form Submission --- */}
          <footer className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-5">
            <button
              type="button"
              onClick={handleClearForm}
              className="flex items-center justify-center px-6 py-2.5 w-full sm:w-auto font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition-all duration-300"
            >
              <MdOutlineClear className="mr-1.5" />
              Clear
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center px-6 py-2.5 w-full sm:w-auto font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Create Staff Member"
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
