import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBoxOpen,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const API_URL = "http://192.168.1.193:8090/api/v1/inventory-items/";

// --- TYPE DEFINITION ---
interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity_instock: number;
  reorder_level: number;
  cost_per_unit: string;
}

// --- HELPER & CHILD COMPONENTS ---

const InventoryCard: React.FC<{ item: InventoryItem }> = ({ item }) => {
  const isLowStock = item.quantity_instock <= item.reorder_level;
  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div
        className={`absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
          isLowStock
            ? "bg-red-100 text-red-800"
            : "bg-emerald-100 text-emerald-800"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isLowStock ? "bg-red-500" : "bg-emerald-500"
          }`}
        ></div>
        {isLowStock ? "Low Stock" : "In Stock"}
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`p-4 rounded-xl ${
            isLowStock ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          <FaBoxOpen
            className={`w-8 h-8 ${
              isLowStock ? "text-red-500" : "text-blue-500"
            }`}
          />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
      </div>
      <p className="text-sm text-slate-600 flex-grow min-h-[40px]">
        {item.description}
      </p>
      <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2 rounded-lg mt-auto">
        <div>
          <p className="text-xs text-slate-500">In Stock</p>
          <strong className="text-slate-800">{item.quantity_instock}</strong>
        </div>
        <div>
          <p className="text-xs text-slate-500">Reorder At</p>
          <strong className="text-slate-800">{item.reorder_level}</strong>
        </div>
        <div>
          <p className="text-xs text-slate-500">Cost/Unit</p>
          <strong className="text-emerald-600">${item.cost_per_unit}</strong>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function AllInventory() {
  const {
    data: inventories,
    isError,
    isLoading,
    error,
  } = useQuery<InventoryItem[], Error>({
    queryKey: ["inventories"],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data.results;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-500 h-10 w-10 mx-auto" />
          <p className="ml-3 text-lg text-slate-600 mt-4">
            Loading Inventory...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="h-6 w-6 text-red-500" />
            <h3 className="font-bold text-lg">Failed to Load Inventory</h3>
          </div>
          <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg">
            {error.message}
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Overview
          </h1>
        </div>
      </header>

      <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 flex items-center gap-4">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory items..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {inventories && inventories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventories.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FaBoxOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2 font-semibold">
            No Inventory Items Found
          </p>
          <p className="text-slate-400">The inventory is currently empty.</p>
        </div>
      )}
    </div>
  );
}
