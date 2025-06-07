// src/features/services/components/ServiceCard.tsx

import React from "react";
import { type Service } from "../../../pages/my-hotel/types";
import {
  FaBriefcase,
  FaUtensils,
  FaSpa,
  FaPlaneDeparture,
  FaInfoCircle,
  FaPencilAlt,
} from "react-icons/fa";

// --- HELPER FUNCTIONS ---

const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  const iconClass = "w-8 h-8";
  if (name.includes("business"))
    return <FaBriefcase className={`${iconClass} text-blue-500`} />;
  if (name.includes("dining"))
    return <FaUtensils className={`${iconClass} text-orange-500`} />;
  if (name.includes("spa"))
    return <FaSpa className={`${iconClass} text-pink-500`} />;
  if (name.includes("safari") || name.includes("tour"))
    return <FaPlaneDeparture className={`${iconClass} text-purple-500`} />;
  if (name.includes("airport") || name.includes("transport"))
    return <FaPlaneDeparture className={`${iconClass} text-cyan-500`} />;
  return <FaInfoCircle className={`${iconClass} text-slate-500`} />;
};

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className={`absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
      isActive
        ? "bg-emerald-100 text-emerald-800"
        : "bg-slate-100 text-slate-800"
    }`}
  >
    <div
      className={`w-2 h-2 rounded-full ${
        isActive ? "bg-emerald-500" : "bg-slate-500"
      }`}
    ></div>
    {isActive ? "Active" : "Inactive"}
  </div>
);

// --- MAIN CARD COMPONENT ---

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
}) => (
  <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
    <StatusBadge isActive={service.is_active} />
    <div className="flex items-center gap-4">
      <div className="bg-slate-100 p-4 rounded-xl">
        {getServiceIcon(service.name)}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{service.name}</h3>
      </div>
    </div>
    <p className="text-sm text-slate-600 flex-grow">{service.description}</p>
    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
      <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
        <FaInfoCircle className="text-amber-500" />
        <span>{service.amendment}</span>
      </p>
      <button
        onClick={onEdit}
        className="p-2 rounded-full bg-slate-100 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600"
        aria-label={`Edit ${service.name}`}
      >
        <FaPencilAlt />
      </button>
    </div>
  </div>
);
