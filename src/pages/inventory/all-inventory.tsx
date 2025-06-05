import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "./inventory.module.css";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiBox } from "react-icons/fi";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity_in_stock: number;
  quantity_to_reorder: number;
  cost_per_unit: number;
  reorder_request: boolean;
}

export default function AllInventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<InventoryItem>>({});

  const {
    data: inventories = [],
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventories"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3001/inventory`);
      return response.data;
    },
  });

  const handleEdit = (inventory: InventoryItem) => {
    setCurrentItem(inventory);
    setEditedItem({ ...inventory });
    setIsModalOpen(true);
  };

  const handleDelete = (inventoryId: string) => {
    console.log("Delete inventory ID:", inventoryId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]:
        name === "quantity_in_stock" ||
        name === "quantity_to_reorder" ||
        name === "cost_per_unit"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated inventory:", editedItem);
    setIsModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className={styles.loader}></div>
        <p className="ml-3 text-lg text-gray-600">Loading inventories...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-red-800 font-medium">
              Error Loading Inventories
            </h3>
          </div>
          <p className="text-red-700">{(error as Error).message}</p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Inventory Management
        </h1>
        <p className="text-gray-600 text-sm">
          Manage your hotel inventory items
        </p>
      </div>

      <div className={styles.inventoryGrid}>
        {inventories.map((inv: InventoryItem, i: number) => (
          <div key={inv.id} className={styles.inventoryCard}>
            <div className={styles.cardHeader}>
              <div className={styles.itemNumber}>#{i + 1}</div>
              <div className={styles.stockBadge}>
                <span
                  className={`${styles.stockIndicator} ${
                    inv.quantity_in_stock <= inv.quantity_to_reorder
                      ? styles.lowStock
                      : styles.inStock
                  }`}
                ></span>
                {inv.quantity_in_stock <= inv.quantity_to_reorder
                  ? "Low Stock"
                  : "In Stock"}
              </div>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.itemName}>
                <FiBox /> {inv.name}
              </h3>
              <p className={styles.itemDescription}>{inv.description}</p>

              <div className={styles.inventoryDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Stock:</span>
                  <span className={styles.detailValue}>
                    {inv.quantity_in_stock}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Reorder at:</span>
                  <span className={styles.detailValue}>
                    {inv.quantity_to_reorder}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Cost/Unit:</span>
                  <span className={styles.detailValue}>
                    ${inv.cost_per_unit}
                  </span>
                </div>
                {inv.reorder_request && (
                  <div className={styles.reorderAlert}>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reorder Requested
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                onClick={() => handleEdit(inv)}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                <BiSolidEditAlt size={18} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(inv.id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                <FaRegTrashAlt size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {inventories.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg
              className="mx-auto w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-md font-medium text-gray-900 mb-1">
            No inventory items found
          </h3>
          <p className="text-sm text-gray-500">
            Get started by adding your first inventory item.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && currentItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Inventory Item</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedItem.name || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <input
                  type="text"
                  name="description"
                  value={editedItem.description || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quantity in Stock</label>
                <input
                  type="number"
                  name="quantity_in_stock"
                  value={editedItem.quantity_in_stock || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Reorder Quantity</label>
                <input
                  type="number"
                  name="quantity_to_reorder"
                  value={editedItem.quantity_to_reorder || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cost per Unit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="cost_per_unit"
                  value={editedItem.cost_per_unit || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
