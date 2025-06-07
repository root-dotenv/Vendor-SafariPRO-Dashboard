import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FaBriefcase,
  FaUtensils,
  FaSpa,
  FaPlaneDeparture,
  FaSearch,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaPencilAlt,
  FaTimes,
  FaList,
  FaTh, // Using FaTh as a replacement for the grid icon
} from "react-icons/fa";

const API_URL = "http://localhost:3001/services";

// --- TYPE & SCHEMA DEFINITIONS ---
interface Service {
  id: string;
  name: string;
  description: string;
  amendment: string;
  is_active: boolean;
}

const serviceSchema = yup.object().shape({
  name: yup.string().required("Service name is required."),
  description: yup.string().required("Description is required."),
  amendment: yup.string().required("Amendment policy is required."),
  is_active: yup.boolean().required(),
});

// --- HELPER & CHILD COMPONENTS ---

const getServiceIcon = (serviceName: string, sizeClass = "w-8 h-8") => {
  const name = serviceName.toLowerCase();
  if (name.includes("business"))
    return <FaBriefcase className={`${sizeClass} text-blue-500`} />;
  if (name.includes("dining"))
    return <FaUtensils className={`${sizeClass} text-orange-500`} />;
  if (name.includes("spa"))
    return <FaSpa className={`${sizeClass} text-pink-500`} />;
  if (name.includes("safari") || name.includes("tour"))
    return <FaPlaneDeparture className={`${sizeClass} text-purple-500`} />;
  if (name.includes("airport") || name.includes("transport"))
    return <FaPlaneDeparture className={`${sizeClass} text-cyan-500`} />;
  return <FaInfoCircle className={`${sizeClass} text-slate-500`} />;
};

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
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

const ServiceCard: React.FC<{
  service: Service;
  onEdit: () => void;
  view: "grid" | "list";
}> = ({ service, onEdit, view }) => {
  // Grid View Layout
  if (view === "grid") {
    return (
      <div className="relative bg-white rounded-[0.5rem] shadow border border-gray-100 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow hover:-translate-y-0 group">
        <div className="absolute top-4 right-4">
          <StatusBadge isActive={service.is_active} />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-4 rounded-xl">
            {getServiceIcon(service.name)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{service.name}</h3>
          </div>
        </div>
        <p className="text-sm text-slate-600 flex-grow">
          {service.description}
        </p>
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
  }

  // List View Layout
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow hover:border-blue-200">
      <div className="bg-slate-100 p-3 rounded-xl">
        {getServiceIcon(service.name, "w-6 h-6")}
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-slate-800">{service.name}</h3>
        <p className="text-sm text-slate-500">{service.description}</p>
      </div>
      <div className="flex-shrink-0 w-48 text-xs text-slate-500">
        <p className="font-medium flex items-center gap-2">
          <FaInfoCircle className="text-amber-500" /> {service.amendment}
        </p>
      </div>
      <div className="flex-shrink-0 w-28">
        <StatusBadge isActive={service.is_active} />
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onEdit}
          className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-600"
          aria-label={`Edit ${service.name}`}
        >
          <FaPencilAlt />
        </button>
      </div>
    </div>
  );
};

const ServiceFormModal: React.FC<{
  service: Partial<Service> | null;
  onClose: () => void;
  onSave: (data: Omit<Service, "id">, id?: string) => void;
  onDelete?: (id: string) => void;
  isSaving: boolean;
  isDeleting?: boolean;
}> = ({ service, onClose, onSave, onDelete, isSaving, isDeleting }) => {
  const isEditMode = !!service?.id;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Service>({
    resolver: yupResolver(serviceSchema),
    defaultValues: service || {
      name: "",
      description: "",
      amendment: "",
      is_active: true,
    },
  });

  const handleDelete = () => {
    if (
      service?.id &&
      onDelete &&
      window.confirm(
        `Are you sure you want to delete the "${service.name}" service?`
      )
    ) {
      onDelete(service.id);
    }
  };
  const handleFormSubmit = (data: Service) => onSave(data, service?.id);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="relative bg-white rounded-2xl shadow w-full max-w-lg">
        <header className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isEditMode ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <FaTimes size={20} />
          </button>
        </header>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Service Name
              </label>
              <input
                {...register("name")}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">
                Amendment Policy
              </label>
              <input
                {...register("amendment")}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.amendment && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.amendment.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-slate-700">Status</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("is_active")}
                  value="true"
                  defaultChecked={service?.is_active !== false}
                />{" "}
                Active
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("is_active")}
                  value="false"
                  defaultChecked={service?.is_active === false}
                />{" "}
                Inactive
              </label>
            </div>
          </div>
          <footer className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}{" "}
                Delete
              </button>
            ) : (
              <div></div>
            )}
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="px-6 py-2 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <FaSpinner className="animate-spin" /> : null}{" "}
              {isEditMode ? "Save Changes" : "Add Service"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function HotelServices() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useQuery<Service[], Error>({
    queryKey: ["services"],
    queryFn: async () => axios.get(API_URL).then((res) => res.data),
  });

  const addServiceMutation = useMutation<Service, Error, Omit<Service, "id">>({
    mutationFn: (newService) =>
      axios.post(API_URL, newService).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsModalOpen(false);
    },
  });
  const updateServiceMutation = useMutation<Service, Error, Service>({
    mutationFn: (updatedService) =>
      axios
        .put(`${API_URL}/${updatedService.id}`, updatedService)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsModalOpen(false);
    },
  });
  const deleteServiceMutation = useMutation<void, Error, string>({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsModalOpen(false);
    },
  });

  const handleOpenAddModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };
  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  const handleSave = (data: Omit<Service, "id">, id?: string) => {
    const serviceData = {
      ...data,
      is_active: (data.is_active as any) === "true",
    };
    if (id) {
      updateServiceMutation.mutate({ ...serviceData, id });
    } else {
      addServiceMutation.mutate(serviceData);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Services...</p>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-8 rounded-xl shadow max-w-md w-full">
          <h3 className="font-bold text-lg mb-2">Error Fetching Data</h3>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error.message}
          </p>
        </div>
      </div>
    );

  return (
    <>
      {isModalOpen && (
        <ServiceFormModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={(id) => deleteServiceMutation.mutate(id)}
          isSaving={
            addServiceMutation.isPending || updateServiceMutation.isPending
          }
          isDeleting={deleteServiceMutation.isPending}
        />
      )}
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hotel Services & Add-ons
            </h1>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 transition-all hover:shadow hover:-translate-y-0"
          >
            <FaPlus /> Add New Service
          </button>
        </header>

        <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow border border-gray-100 flex items-center gap-4">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-0.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a service..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow"
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              <FaTh size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow"
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              <FaList size={20} />
            </button>
          </div>
        </div>

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {services?.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => handleEditClick(service)}
              view={viewMode}
            />
          ))}
        </div>
      </div>
    </>
  );
}
