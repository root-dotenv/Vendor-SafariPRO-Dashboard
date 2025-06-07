import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../contexts/authcontext";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaEnvelope,
  FaIdBadge,
  FaBuilding,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";

// --- API Functions ---
const api = axios.create({ baseURL: "http://localhost:3001" });
const fetchStaffs = async () => (await api.get("/staffs")).data;
const updateStaff = async (staffData) =>
  (await api.put(`/staffs/${staffData.id}`, staffData)).data;
const deleteStaff = async (staffId) =>
  (await api.delete(`/staffs/${staffId}`)).data;

// --- Main Component ---
export default function StaffList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [modalState, setModalState] = useState({ type: null, data: null });

  const {
    data: staffs = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["staffs"], queryFn: fetchStaffs });

  const updateStaffMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      setModalState({ type: null, data: null });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      setModalState({ type: null, data: null });
    },
  });

  const filteredStaffs = useMemo(() => {
    return staffs.filter((staff) => {
      if (departmentFilter !== "all" && staff.department !== departmentFilter)
        return false;
      if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
          staff.fullname.toLowerCase().includes(lowercasedTerm) ||
          staff.username.toLowerCase().includes(lowercasedTerm) ||
          staff.email.toLowerCase().includes(lowercasedTerm)
        );
      }
      return true;
    });
  }, [staffs, searchTerm, departmentFilter]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredStaffs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredStaffs.length / rowsPerPage);

  const uniqueDepartments = useMemo(
    () => Array.from(new Set(staffs.map((s) => s.department))),
    [staffs]
  );

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading Staff Directory...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Error loading data.</div>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center gap-3">
            <FaUsers className="text-indigo-600" /> Staff Directory
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Search, filter, and manage all staff members.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-white rounded-xl shadow-md mb-8 border border-gray-100">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Contact
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Department
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Role
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-4 font-medium text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((staff) => (
                <tr
                  key={staff.id}
                  className="bg-white border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-base">
                        {staff.fullname.charAt(0)}
                      </div>
                      {staff.fullname}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="font-medium">{staff.email}</div>
                    <div className="text-xs text-gray-500">
                      @{staff.username}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
                      {staff.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                        staff.role === "admin"
                          ? "text-purple-800 bg-purple-100"
                          : "text-gray-800 bg-gray-100"
                      }`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            setModalState({ type: "edit", data: staff })
                          }
                          title="Edit Staff"
                          className="p-2 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <FaEdit size={16} />
                        </button>
                        {user.id !== staff.id && (
                          <button
                            onClick={() =>
                              setModalState({ type: "delete", data: staff })
                            }
                            title="Delete Staff"
                            className="p-2 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {currentRows.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No staff found.
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <span className="text-sm text-gray-600">
            Showing{" "}
            <strong>
              {filteredStaffs.length > 0 ? indexOfFirstRow + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>{Math.min(indexOfLastRow, filteredStaffs.length)}</strong>{" "}
            of <strong>{filteredStaffs.length}</strong> entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((c) => c - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              <FaChevronLeft size={12} />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((c) => c + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              Next
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {modalState.type === "edit" && (
          <EditStaffModal
            staff={modalState.data}
            departments={uniqueDepartments}
            onClose={() => setModalState({ type: null, data: null })}
            onSave={updateStaffMutation.mutate}
            isSaving={updateStaffMutation.isPending}
          />
        )}
        {modalState.type === "delete" && (
          <DeleteStaffModal
            staff={modalState.data}
            onClose={() => setModalState({ type: null, data: null })}
            onConfirm={() => deleteStaffMutation.mutate(modalState.data.id)}
            isDeleting={deleteStaffMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

// --- Enhanced Modal Sub-components ---

function EditStaffModal({ staff, departments, onClose, onSave, isSaving }) {
  const [formData, setFormData] = useState(staff);
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-300/65 bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-bold text-xl text-blue-900 flex items-center gap-3">
            <FaEdit /> Edit Staff Member
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <MdClose size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaUserTie className="mr-2 text-purple-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaIdBadge className="mr-2 text-purple-500" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="mr-2 text-purple-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaBuilding className="mr-2 text-purple-500" />
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Confirmation Footer */}
          <div className="p-6 bg-gray-50 border-y">
            <h4 className="text-md font-semibold text-blue-900 mb-3">
              Summary of Changes
            </h4>
            <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="font-semibold">{formData.fullname}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Department:</span>
                <span className="font-semibold">{formData.department}</span>
              </p>
            </div>
          </div>

          <footer className="flex justify-end gap-4 p-5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 font-semibold bg-gradient-to-b from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function DeleteStaffModal({ staff, onClose, onConfirm, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-slate-300/65 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all text-center">
        <div className="p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaTrash className="text-3xl text-red-600" />
          </div>
          <h3 className="font-bold text-2xl text-gray-800 mt-4">Delete User</h3>
          <p className="text-gray-600 mt-2">
            Are you sure you want to delete{" "}
            <strong className="font-semibold">{staff.fullname}</strong>? This
            action cannot be undone.
          </p>
        </div>
        <div className="flex justify-center gap-4 p-5 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full px-4 py-2.5 font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
