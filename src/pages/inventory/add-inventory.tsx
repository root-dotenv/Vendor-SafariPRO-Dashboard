import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FaPlus,
  FaUndo,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function AddInventory() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity_in_stock: "",
    quantity_to_reorder: "",
    reorder_request: "",
    cost_per_unit: "",
    hotel_id: "",
  });

  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  // Mutation for adding new inventory
  const addInventoryMutation = useMutation({
    mutationFn: async (newInventory) => {
      const response = await axios.post(
        "http://localhost:3001/inventory_items",
        newInventory
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      // Reset form and errors on success
      setFormData({
        name: "",
        description: "",
        quantity_in_stock: "",
        quantity_to_reorder: "",
        reorder_request: "",
        cost_per_unit: "",
        hotel_id: "",
      });
      setErrors({});
    },
    onError: (error) => {
      console.error("Error adding inventory:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.quantity_in_stock || formData.quantity_in_stock < 0)
      newErrors.quantity_in_stock = "Valid stock quantity is required";
    if (!formData.quantity_to_reorder || formData.quantity_to_reorder < 0)
      newErrors.quantity_to_reorder = "Valid reorder level is required";
    if (!formData.cost_per_unit || formData.cost_per_unit <= 0)
      newErrors.cost_per_unit = "Valid cost per unit is required";
    if (!formData.hotel_id.trim()) newErrors.hotel_id = "Hotel ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const inventoryData = {
      ...formData,
      quantity_in_stock: parseInt(formData.quantity_in_stock),
      quantity_to_reorder: parseInt(formData.quantity_to_reorder),
      reorder_request: formData.reorder_request
        ? parseInt(formData.reorder_request)
        : 0,
      cost_per_unit: parseFloat(formData.cost_per_unit),
    };
    addInventoryMutation.mutate(inventoryData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      quantity_in_stock: "",
      quantity_to_reorder: "",
      reorder_request: "",
      cost_per_unit: "",
      hotel_id: "",
    });
    setErrors({});
  };

  // Common Tailwind classes
  const formLabelClass = "block text-sm font-medium text-slate-700 mb-1";
  const formInputClass =
    "w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 transition";
  const inputErrorClass = "border-red-500 ring-red-500";
  const errorTextClass = "text-xs text-red-600 mt-1";
  const actionButtonClass =
    "flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all transform";

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Add New Inventory Item
        </h1>
        <p className="text-slate-600">
          Fill out the form below to create a new item.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80">
          <div className="p-5 bg-slate-50 border-b border-slate-200 rounded-t-2xl">
            <div className="flex items-center gap-3 text-slate-700">
              <FaPlus />
              <span className="font-semibold">New Item Details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className={formLabelClass}>
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${formInputClass} ${
                  errors.name ? inputErrorClass : ""
                }`}
                placeholder="e.g., Hotel Branded Spring Water"
              />
              {errors.name && (
                <span className={errorTextClass}>{errors.name}</span>
              )}
            </div>

            <div>
              <label htmlFor="description" className={formLabelClass}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`${formInputClass} ${
                  errors.description ? inputErrorClass : ""
                }`}
                placeholder="e.g., 500ml bottled spring water with hotel logo."
              />
              {errors.description && (
                <span className={errorTextClass}>{errors.description}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantity_in_stock" className={formLabelClass}>
                  Current Stock *
                </label>
                <input
                  type="number"
                  id="quantity_in_stock"
                  name="quantity_in_stock"
                  value={formData.quantity_in_stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`${formInputClass} ${
                    errors.quantity_in_stock ? inputErrorClass : ""
                  }`}
                  placeholder="980"
                />
                {errors.quantity_in_stock && (
                  <span className={errorTextClass}>
                    {errors.quantity_in_stock}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="quantity_to_reorder" className={formLabelClass}>
                  Reorder Level *
                </label>
                <input
                  type="number"
                  id="quantity_to_reorder"
                  name="quantity_to_reorder"
                  value={formData.quantity_to_reorder}
                  onChange={handleInputChange}
                  min="0"
                  className={`${formInputClass} ${
                    errors.quantity_to_reorder ? inputErrorClass : ""
                  }`}
                  placeholder="100"
                />
                {errors.quantity_to_reorder && (
                  <span className={errorTextClass}>
                    {errors.quantity_to_reorder}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cost_per_unit" className={formLabelClass}>
                  Cost per Unit ($) *
                </label>
                <input
                  type="number"
                  id="cost_per_unit"
                  name="cost_per_unit"
                  value={formData.cost_per_unit}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`${formInputClass} ${
                    errors.cost_per_unit ? inputErrorClass : ""
                  }`}
                  placeholder="0.90"
                />
                {errors.cost_per_unit && (
                  <span className={errorTextClass}>{errors.cost_per_unit}</span>
                )}
              </div>
              <div>
                <label htmlFor="hotel_id" className={formLabelClass}>
                  Hotel ID *
                </label>
                <input
                  type="text"
                  id="hotel_id"
                  name="hotel_id"
                  value={formData.hotel_id}
                  onChange={handleInputChange}
                  className={`${formInputClass} ${
                    errors.hotel_id ? inputErrorClass : ""
                  }`}
                  placeholder="htl-gem-101"
                />
                {errors.hotel_id && (
                  <span className={errorTextClass}>{errors.hotel_id}</span>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className={`${actionButtonClass} bg-slate-600 text-white hover:bg-slate-700`}
                disabled={addInventoryMutation.isPending}
              >
                <FaUndo /> Reset
              </button>
              <button
                type="submit"
                className={`${actionButtonClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white`}
                disabled={addInventoryMutation.isPending}
              >
                {addInventoryMutation.isPending ? (
                  "Adding..."
                ) : (
                  <>
                    <FaPlus /> Add Inventory Item
                  </>
                )}
              </button>
            </div>

            {addInventoryMutation.isSuccess && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                <FaCheckCircle size={20} /> Inventory item added successfully!
              </div>
            )}
            {addInventoryMutation.isError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                <FaExclamationCircle size={20} /> Error adding inventory item.
                Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
