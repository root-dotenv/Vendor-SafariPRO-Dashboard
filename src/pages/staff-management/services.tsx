import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBuilding,
  FaUserTie,
  FaCrown,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";

// --- API Functions ---
const api = axios.create({ baseURL: "http://localhost:3001" });
const fetchDepartments = async () => (await api.get("/departments")).data;
const fetchStaffList = async () => (await api.get("/staffs?role=staff")).data;
const updateDepartment = async (deptData) =>
  (await api.patch(`/departments/${deptData.id}`, deptData)).data;
const deleteDepartment = async (deptId) =>
  (await api.delete(`/departments/${deptId}`)).data;

// --- Main Component ---
export default function Services() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({ type: null, data: null }); // type: 'update' | 'delete' | 'assign'

  const {
    data: departments,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["departments"], queryFn: fetchDepartments });
  const { data: staffList = [] } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaffList,
  });

  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setModal({ type: null, data: null });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setModal({ type: null, data: null });
    },
  });

  const handleUpdate = (formData) => updateMutation.mutate(formData);
  const handleDelete = (deptId) => deleteMutation.mutate(deptId);
  const handleAssignHod = (dept, staffId) => {
    const staffMember = staffList.find((s) => s.id === staffId);
    if (!dept || !staffMember) return;
    updateMutation.mutate({
      id: dept.id,
      hod_id: staffMember.id,
      hod_name: staffMember.fullname,
    });
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
        <p className="text-lg font-medium">Loading Departments...</p>
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-700 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto min-h-screen flex flex-col justify-center">
        <FaExclamationTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
        <p className="text-xl font-bold">Failed to Load Data</p>
        <p className="text-slate-600 mt-2">
          Please check your network connection and refresh the page.
        </p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaBuilding className="text-indigo-600" />
            <span>Departments & Services</span>
          </h2>
          <p className="text-slate-500 mt-2 text-base">
            Manage all operational departments and assign leadership.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onUpdate={() => setModal({ type: "update", data: dept })}
              onDelete={() => setModal({ type: "delete", data: dept })}
              onAssign={() => setModal({ type: "assign", data: dept })}
            />
          ))}
        </div>

        {modal.type && (
          <ActionModal
            modal={modal}
            onClose={() => setModal({ type: null, data: null })}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAssignHod={handleAssignHod}
            staffList={staffList}
            isLoading={updateMutation.isPending || deleteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

// --- Sub-components for better organization ---
const DepartmentCard = ({ department, onUpdate, onDelete, onAssign }) => (
  <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 border-t-4 border-indigo-600">
    <header className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {department.name}
          </h3>
          <p className="text-sm font-mono text-slate-500 mt-1">
            {department.code}
          </p>
        </div>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
          {department.staff_count || 0} staff
        </span>
      </div>
    </header>
    <div className="p-5 flex-grow space-y-4 border-t border-slate-100">
      <p className="text-slate-600 text-sm leading-relaxed min-h-[40px]">
        {department.description || "No description available."}
      </p>
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Head of Department
        </p>
        {department.hod_name ? (
          <div className="flex items-center gap-3 bg-slate-100/70 rounded-lg p-3">
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 ring-4 ring-white">
              <FaUserTie />
            </div>
            <div>
              <p className="font-bold text-slate-800">{department.hod_name}</p>
              <p className="text-xs text-slate-500">Assigned Leader</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/70 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-slate-500">
              No HOD assigned
            </p>
          </div>
        )}
      </div>
    </div>
    <footer className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex justify-end gap-2">
      <button
        onClick={onAssign}
        className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
      >
        <FaCrown /> Assign
      </button>
      <button
        onClick={onUpdate}
        className="px-3 py-1.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-md hover:bg-sky-200 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
      >
        Delete
      </button>
    </footer>
  </div>
);

const ActionModal = ({
  modal,
  onClose,
  onUpdate,
  onDelete,
  onAssignHod,
  staffList,
  isLoading,
}) => {
  const [formData, setFormData] = useState(modal.data);
  const [hod, setHod] = useState(modal.data.hod_id || "");

  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const modalAccentColors = {
    update: "border-t-sky-500",
    delete: "border-t-red-500",
    assign: "border-t-emerald-500",
  };

  const renderContent = () => {
    switch (modal.type) {
      case "update":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdate(formData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
              />
            </div>
            <footer className="flex justify-end gap-3 pt-5 mt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </footer>
          </form>
        );
      case "delete":
        return (
          <div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-800">Confirm Deletion</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Are you sure you want to delete the{" "}
                    <strong>{modal.data.name}</strong> department? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <footer className="flex justify-end gap-3 pt-5 mt-2 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(modal.data.id)}
                disabled={isLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Delete Department"
                )}
              </button>
            </footer>
          </div>
        );
      case "assign":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAssignHod(modal.data, hod);
            }}
            className="space-y-4"
          >
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                <FaCrown className="text-emerald-600" />
                Assign Head of Department
              </h4>
              <p className="text-sm text-emerald-700 mt-1">
                Select a staff member to lead the{" "}
                <strong>{modal.data.name}</strong> department.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Staff Member
              </label>
              <select
                value={hod}
                onChange={(e) => setHod(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                required
              >
                <option value="" disabled>
                  Select Staff Member
                </option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullname} ({s.position || "Staff"})
                  </option>
                ))}
              </select>
            </div>
            <footer className="flex justify-end gap-3 pt-5 mt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Assign HOD"
                )}
              </button>
            </footer>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border-t-4 ${
          modalAccentColors[modal.type]
        }`}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 capitalize">
            {modal.type === "update" && "Edit Department"}
            {modal.type === "delete" && "Delete Department"}
            {modal.type === "assign" && "Assign Department Head"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1"
          >
            <MdClose size={24} />
          </button>
        </header>
        <div className="p-5">{renderContent()}</div>
      </div>
    </div>
  );
};
