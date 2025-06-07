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
  return (
    <p>
      {/* in this page, Let's have a grid layout for inventory category on the left
      and inventory items on the right side and on top header lets create a
      modal form to create inventory categories and display the already created
      inventory categoies, use this ENDPOINT for sending the form data to create
      inventory categories ""http://192.168.1.193:8090/api/v1/inventory-categories/?hotel_id=0c9c6965-eee2-4af3-8761-83a06ec720f4"" and this ENDPOINT for fetching (getting) all the
      created inventory categories, then I want that when a user click on a
      certain inventory category card, i display all the availlable inventory
      itemms for that particular invotory category, the modal form for sending
      inventory category data should have the following input field and should
      have the bottom div/container to display the inputs before sending them to
      the API, here's the input structure and data types for the inventory form: SEND POST Request to "http://192.168.1.193:8090/api/v1/inventory-categories/?hotel_id=0c9c6965-eee2-4af3-8761-83a06ec720f4" (note write this endpoint as is, don't change anything)
      {
    
    "is_active": boolean (default to true),
     "name": (string)
    "description": (string),
    "hotel": (string) - use default "0c9c6965-eee2-4af3-8761-83a06ec720f4"
}
       */}
      Inventory Goes On Here
    </p>
  );
}
