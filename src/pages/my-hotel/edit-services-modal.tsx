import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { type Service } from "../types";
import { FaTrash, FaSpinner, FaTimes } from "react-icons/fa";

// --- VALIDATION SCHEMA (Moved into this file to resolve import error) ---
const serviceSchema = yup.object().shape({
  name: yup.string().required("Service name is required."),
  description: yup.string().required("Description is required."),
  amendment: yup.string().required("Amendment policy is required."),
  is_active: yup.boolean().required(),
});

// --- MODAL COMPONENT ---
interface EditServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onSave: (data: Service) => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  service,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Service>({
    resolver: yupResolver(serviceSchema),
    defaultValues: service || {},
  });

  if (!service) return null;

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${service.name}" service?`
      )
    ) {
      onDelete(service.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <header className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Service
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <FaTimes size={20} />
          </button>
        </header>
        <form onSubmit={handleSubmit(onSave)}>
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
                  defaultChecked={service.is_active}
                />{" "}
                Active
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("is_active")}
                  value="false"
                  defaultChecked={!service.is_active}
                />{" "}
                Inactive
              </label>
            </div>
          </div>
          <footer className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
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
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="px-6 py-2 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <FaSpinner className="animate-spin" /> : null} Save
              Changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
