import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import styles from "./inventory.module.css";

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
        "http://localhost:3001/inventory",
        newInventory
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch inventory list
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      // Reset form
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.quantity_in_stock || formData.quantity_in_stock < 0) {
      newErrors.quantity_in_stock = "Valid stock quantity is required";
    }

    if (!formData.quantity_to_reorder || formData.quantity_to_reorder < 0) {
      newErrors.quantity_to_reorder = "Valid reorder quantity is required";
    }

    if (!formData.cost_per_unit || formData.cost_per_unit <= 0) {
      newErrors.cost_per_unit = "Valid cost per unit is required";
    }

    if (!formData.hotel_id.trim()) {
      newErrors.hotel_id = "Hotel ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert numeric fields to appropriate types
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Add New Inventory Item
        </h1>
        <p className="text-gray-600">
          Create a new inventory item for your hotel
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className={`${styles.inventoryCard} ${styles.formCard}`}>
          <div className={styles.cardHeader}>
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="font-semibold">New Inventory Item</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.formBody}>
            {/* Item Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.formInput} ${
                  errors.name ? styles.inputError : ""
                }`}
                placeholder="e.g., Hotel Branded Spring Water"
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.formLabel}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`${styles.formInput} ${styles.formTextarea} ${
                  errors.description ? styles.inputError : ""
                }`}
                placeholder="e.g., 500ml bottled spring water with hotel logo. For minibar and complimentary service."
              />
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
              )}
            </div>

            {/* Stock Quantities Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="quantity_in_stock" className={styles.formLabel}>
                  Current Stock *
                </label>
                <input
                  type="number"
                  id="quantity_in_stock"
                  name="quantity_in_stock"
                  value={formData.quantity_in_stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`${styles.formInput} ${
                    errors.quantity_in_stock ? styles.inputError : ""
                  }`}
                  placeholder="980"
                />
                {errors.quantity_in_stock && (
                  <span className={styles.errorText}>
                    {errors.quantity_in_stock}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label
                  htmlFor="quantity_to_reorder"
                  className={styles.formLabel}
                >
                  Reorder Level *
                </label>
                <input
                  type="number"
                  id="quantity_to_reorder"
                  name="quantity_to_reorder"
                  value={formData.quantity_to_reorder}
                  onChange={handleInputChange}
                  min="0"
                  className={`${styles.formInput} ${
                    errors.quantity_to_reorder ? styles.inputError : ""
                  }`}
                  placeholder="1200"
                />
                {errors.quantity_to_reorder && (
                  <span className={styles.errorText}>
                    {errors.quantity_to_reorder}
                  </span>
                )}
              </div>
            </div>

            {/* Cost and Hotel ID Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cost_per_unit" className={styles.formLabel}>
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
                  className={`${styles.formInput} ${
                    errors.cost_per_unit ? styles.inputError : ""
                  }`}
                  placeholder="0.90"
                />
                {errors.cost_per_unit && (
                  <span className={styles.errorText}>
                    {errors.cost_per_unit}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hotel_id" className={styles.formLabel}>
                  Hotel ID *
                </label>
                <input
                  type="text"
                  id="hotel_id"
                  name="hotel_id"
                  value={formData.hotel_id}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${
                    errors.hotel_id ? styles.inputError : ""
                  }`}
                  placeholder="htl-gem-101"
                />
                {errors.hotel_id && (
                  <span className={styles.errorText}>{errors.hotel_id}</span>
                )}
              </div>
            </div>

            {/* Reorder Request (Optional) */}
            <div className={styles.formGroup}>
              <label htmlFor="reorder_request" className={styles.formLabel}>
                Reorder Request (Optional)
              </label>
              <input
                type="number"
                id="reorder_request"
                name="reorder_request"
                value={formData.reorder_request}
                onChange={handleInputChange}
                min="0"
                className={styles.formInput}
                placeholder="0"
              />
              <span className={styles.helpText}>
                Number of pending reorder requests (leave empty or 0 if none)
              </span>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleReset}
                className={`${styles.actionButton} ${styles.resetButton}`}
                disabled={addInventoryMutation.isPending}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Form
              </button>

              <button
                type="submit"
                className={`${styles.actionButton} ${styles.submitButton}`}
                disabled={addInventoryMutation.isPending}
              >
                {addInventoryMutation.isPending ? (
                  <>
                    <div className={styles.loader}></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Inventory Item
                  </>
                )}
              </button>
            </div>

            {/* Success/Error Messages */}
            {addInventoryMutation.isSuccess && (
              <div className={styles.successMessage}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Inventory item added successfully!
              </div>
            )}

            {addInventoryMutation.isError && (
              <div className={styles.errorMessage}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Error adding inventory item. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
