import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaBuilding, FaUserCircle, FaThLarge, FaList } from "react-icons/fa";
import { MdClear } from "react-icons/md";

// API function to fetch all staff
const fetchStaffs = async () => {
  const { data } = await axios.get("http://localhost:3001/staffs");
  return data.filter((user) => user.role === "staff");
};

// A small helper to cycle through a few theme colors
const departmentColors = [
  "border-t-cyan-500",
  "border-t-blue-500",
  "border-t-purple-500",
  "border-t-emerald-500",
  "border-t-red-500",
];

// --- Sub-components for different views ---

const StaffGridView = ({ staffByDept }) => (
  <div className="space-y-8">
    {Object.entries(staffByDept).map(([department, members], index) => (
      <div
        key={department}
        className={`bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden border-t-4 ${
          departmentColors[index % departmentColors.length]
        }`}
      >
        <header className="px-5 py-4">
          <h3 className="text-xl font-bold text-gray-800">{department}</h3>
        </header>
        <div className="p-2 md:p-4 border-t border-gray-100">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-100/60 rounded-lg transition-colors duration-200"
              >
                <FaUserCircle className="text-4xl text-gray-300" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {member.fullname}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

const StaffTableView = ({ staffList }) => (
  <div className="bg-white rounded-xl shadow-lg shadow-blue-500/5 overflow-hidden border border-slate-200/80 border-t-4 border-t-blue-600">
    <table className="w-full text-left">
      <thead className="bg-slate-50/70">
        <tr>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
            Email
          </th>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Department
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {staffList.map((member) => (
          <tr
            key={member.id}
            className="group hover:bg-slate-50 transition-colors duration-200"
          >
            <td className="px-6 py-4 border-l-4 border-transparent group-hover:border-purple-500 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={`https://i.pravatar.cc/150?u=${member.email}`}
                    alt={member.fullname}
                  />
                </div>
                <span className="font-semibold text-slate-800">
                  {member.fullname}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
              {member.email}
            </td>
            <td className="px-6 py-4">
              <span className="px-3 py-1 text-xs font-bold text-blue-800 bg-blue-100/80 rounded-full">
                {member.department}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function ServiceManagement() {
  const [view, setView] = useState("grid"); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const {
    data: staffs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaffs,
  });

  const filteredStaff = useMemo(() => {
    let result = staffs || [];
    if (selectedDept !== "All") {
      result = result.filter((staff) => staff.department === selectedDept);
    }
    if (searchQuery) {
      result = result.filter(
        (staff) =>
          staff.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [staffs, searchQuery, selectedDept]);

  const staffByDepartment = useMemo(() => {
    if (!filteredStaff) return {};
    return filteredStaff.reduce((acc, staff) => {
      const { department } = staff;
      if (!acc[department]) acc[department] = [];
      acc[department].push(staff);
      return acc;
    }, {});
  }, [filteredStaff]);

  const departments = useMemo(
    () => [
      "All",
      ...Object.keys(
        staffs?.reduce(
          (acc, staff) => ({ ...acc, [staff.department]: true }),
          {}
        ) || {}
      ),
    ],
    [staffs]
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8 min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-500">
          Loading Departments...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center p-8 min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-600 bg-red-100 p-4 rounded-lg">
          Error: Could not load staff data.
        </p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100/70 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBuilding className="text-blue-600" />
            <span>Service Management</span>
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Search, filter, and manage staff members across all service
            departments.
          </p>
        </header>

        {/* --- Controls: Filter, Search, and View Toggle --- */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="relative md:col-span-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <MdClear
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            )}
          </div>
          <div className="md:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 rounded-lg transition-colors ${
                view === "grid"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaThLarge size={18} />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2.5 rounded-lg transition-colors ${
                view === "table"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaList size={18} />
            </button>
          </div>
        </div>

        {/* --- Content: Grid or Table View --- */}
        <div className="mt-8">
          {filteredStaff.length > 0 ? (
            view === "grid" ? (
              <StaffGridView staffByDept={staffByDepartment} />
            ) : (
              <StaffTableView staffList={filteredStaff} />
            )
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-lg border border-dashed">
              <h3 className="text-lg font-medium text-gray-700">
                No Staff Members Found
              </h3>
              <p className="text-gray-500 mt-1">
                Your search or filter returned no results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
