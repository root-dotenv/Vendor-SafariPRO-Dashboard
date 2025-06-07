import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaArrowDown,
  FaArrowUp,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaHistory,
  // FIXED: Added missing icons for the History table's status label
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

// --- API Service (All functions in one place) ---
const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

const fetchInventoryData = async () => {
  const [itemsRes, categoriesRes] = await Promise.all([
    apiClient.get("/inventory_items"),
    apiClient.get("/inventory_categories"),
  ]);
  const categoriesMap = new Map(
    categoriesRes.data.map((cat) => [cat.id, cat.name])
  );
  const items = itemsRes.data.map((item) => ({
    ...item,
    category_name: categoriesMap.get(item.category_id) || "Unknown",
  }));
  return items;
};

const fetchReorderHistory = async () => {
  const [approvedRes, rejectedRes] = await Promise.all([
    apiClient.get("/approved_reorder_requests"),
    apiClient.get("/rejected_reorder_requests"),
  ]);
  const approved = approvedRes.data.map((item) => ({
    ...item,
    status: "approved",
  }));
  const rejected = rejectedRes.data.map((item) => ({
    ...item,
    status: "rejected",
  }));
  const combined = [...approved, ...rejected];
  combined.sort(
    (a, b) =>
      new Date(b.approved_at || b.rejected_at) -
      new Date(a.approved_at || a.rejected_at)
  );
  return combined;
};

const updateItemStatus = ({ id, reorder_status }) =>
  apiClient.patch(`/inventory_items/${id}`, { reorder_status });
const createApprovedRequest = (requestData) =>
  apiClient.post("/approved_reorder_requests", requestData);
const createRejectedRequest = (requestData) =>
  apiClient.post("/rejected_reorder_requests", requestData);

// NOTE: This component contains the logic from your `ReorderRequests` file.
// For clarity, I'm calling the main function `ReorderManagement`.
export default function ReorderManagement() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ priority: "all" });
  const [sortConfig, setSortConfig] = useState({
    key: "reorder_level",
    direction: "descending",
  });

  const {
    data: pendingItems,
    isLoading: pendingLoading,
    isError: pendingError,
  } = useQuery({
    queryKey: ["inventoryWithCategories"],
    queryFn: fetchInventoryData,
  });

  const {
    data: historyItems,
    isLoading: historyLoading,
    isError: historyError,
  } = useQuery({
    queryKey: ["reorderHistory"],
    queryFn: fetchReorderHistory,
  });

  const approveMutation = useMutation({
    mutationFn: async (item) => {
      const quantityToRestock = item.reorder_level;
      await createApprovedRequest({
        name: item.name,
        quantity_to_restock: quantityToRestock,
        total_cost: quantityToRestock * item.cost_per_unit,
        category: item.category_name,
        approved_at: new Date().toISOString(),
      });
      return updateItemStatus({ id: item.id, reorder_status: "approved" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryWithCategories"] });
      queryClient.invalidateQueries({ queryKey: ["reorderHistory"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (item) => {
      await createRejectedRequest({
        name: item.name,
        category: item.category_name,
        rejected_at: new Date().toISOString(),
      });
      return updateItemStatus({ id: item.id, reorder_status: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryWithCategories"] });
      queryClient.invalidateQueries({ queryKey: ["reorderHistory"] });
    },
  });

  const processedPendingItems = useMemo(() => {
    if (!pendingItems) return [];
    let filtered = pendingItems.filter(
      (item) => item.reorder_status === "pending"
    );
    filtered = filtered.filter(
      (item) =>
        filters.priority === "all" ||
        getPriority(item.reorder_level).label.toLowerCase() === filters.priority
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === "reorder_level") {
          aValue = getPriority(aValue).level;
          bValue = getPriority(bValue).level;
        }
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [pendingItems, filters, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((s) => ({
      key: k,
      direction:
        s.key === key && s.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen font-sans">
      <section className="space-y-12">
        <div>
          <header className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-amber-500/30">
              <FaBell size={28} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Pending Reorder Requests
            </h1>
          </header>
          <PendingRequestsTable
            items={processedPendingItems}
            isLoading={pendingLoading}
            onApprove={approveMutation.mutate}
            onReject={rejectMutation.mutate}
            filters={filters}
            setFilters={setFilters}
            sortConfig={sortConfig}
            requestSort={requestSort}
          />
        </div>
        <div className="my-12 border-b-2 border-dashed border-slate-300"></div>
        <div>
          <header className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-slate-500/30">
              <FaHistory size={28} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Reorder History
            </h1>
          </header>
          <HistoryTable items={historyItems || []} isLoading={historyLoading} />
        </div>
      </section>
    </div>
  );
}

// --- Helper and Table Components ---

const getPriority = (level) => {
  if (level >= 7)
    return { label: "High", color: "red", icon: <FaArrowUp />, level: 3 };
  if (level >= 4)
    return {
      label: "Medium",
      color: "amber",
      icon: <FaExclamationTriangle />,
      level: 2,
    };
  return { label: "Low", color: "emerald", icon: <FaArrowDown />, level: 1 };
};

const PriorityBadge = ({ level }) => {
  const priority = getPriority(level);
  return (
    <span
      className={`flex items-center justify-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full w-24 bg-${priority.color}-100 text-${priority.color}-700`}
    >
      {priority.icon} {priority.label}
    </span>
  );
};

const PendingRequestsTable = ({
  items,
  isLoading,
  onApprove,
  onReject,
  filters,
  setFilters,
  sortConfig,
  requestSort,
}) => {
  const SortableHeader = ({ tKey, title, className = "" }) => {
    const isSorted = sortConfig.key === tKey;
    const icon = isSorted ? (
      sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      )
    ) : (
      <FaSort />
    );
    return (
      <th
        scope="col"
        className={`px-6 py-4 font-semibold tracking-wider cursor-pointer ${className}`}
        onClick={() => requestSort(tKey)}
      >
        <div className="flex items-center gap-2">
          {title} {icon}
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
      <div className="p-4 flex items-center gap-4 border-b border-slate-200">
        <FaFilter className="text-slate-500" />
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value })}
          className="border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Filter by All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100/80">
          <tr>
            <SortableHeader tKey="name" title="Inventory Item" />
            <SortableHeader tKey="category_name" title="Category" />
            {/* FIXED: The SortableHeader is now used directly without a wrapping <th> */}
            <SortableHeader
              tKey="reorder_level"
              title="Priority"
              className="justify-center"
            />
            <th
              scope="col"
              className="px-6 py-4 font-semibold tracking-wider text-center"
            >
              Manager Approval
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {isLoading ? (
            <tr>
              <td colSpan="4" className="text-center py-8 animate-pulse">
                Loading...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-slate-500">
                No pending requests found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500">
                    Stock: {item.quantity_in_stock} | Cost:{" "}
                    <span className="font-mono">
                      ${item.cost_per_unit.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.category_name}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <PriorityBadge level={item.reorder_level} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onApprove(item)}
                      className="p-2 rounded-full w-10 h-10 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 transition-all transform hover:scale-110"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => onReject(item)}
                      className="p-2 rounded-full w-10 h-10 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-110"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const HistoryTable = ({ items, isLoading }) => {
  const StatusLabel = ({ status }) => {
    const isApproved = status === "approved";
    // FIXED: The icons FaCheckCircle and FaTimesCircle are now defined because they were imported.
    return (
      <span
        className={`flex items-center justify-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full w-32 ${
          isApproved
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isApproved ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
        {isApproved ? "Accepted" : "Rejected"}
      </span>
    );
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100/80">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
              Item Name
            </th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold tracking-wider text-center"
            >
              Request Status
            </th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
              Details
            </th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
              Action Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-8 animate-pulse">
                Loading History...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-8 text-slate-500">
                No reorder history found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4 text-center">
                  <StatusLabel status={item.status} />
                </td>
                <td className="px-6 py-4">
                  {item.status === "approved" ? (
                    `Qty: ${
                      item.quantity_to_restock
                    } | Cost: $${item.total_cost.toFixed(2)}`
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(
                    item.approved_at || item.rejected_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
