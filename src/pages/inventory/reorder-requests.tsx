import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity_in_stock: number;
  quantity_to_reorder: number;
  reorder_request: number;
  cost_per_unit: number;
  hotel_id: string;
}

export default function ReorderRequests() {
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

  // Filter items with reorder_request > 0 and categorize by priority
  const highPriorityItems = inventories.filter(
    (item: InventoryItem) => item.reorder_request > 7
  );
  const mediumPriorityItems = inventories.filter(
    (item: InventoryItem) =>
      item.reorder_request > 5 && item.reorder_request <= 7
  );
  const lowPriorityItems = inventories.filter(
    (item: InventoryItem) =>
      item.reorder_request >= 1 && item.reorder_request <= 5
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-lg text-gray-600">
          Loading reorder requests...
        </p>
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
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
          </div>
          <p className="text-red-700">{(error as Error).message}</p>
        </div>
      </div>
    );

  const renderTable = (items: InventoryItem[], priority: string) => {
    if (items.length === 0) return null;

    const priorityColors = {
      high: "bg-red-50 border-red-200",
      medium: "bg-yellow-50 border-yellow-200",
      low: "bg-blue-50 border-blue-200",
    };

    const priorityTextColors = {
      high: "text-red-800",
      medium: "text-yellow-800",
      low: "text-blue-800",
    };

    const colorClass =
      priorityColors[priority as keyof typeof priorityColors] || "bg-gray-50";
    const textColorClass =
      priorityTextColors[priority as keyof typeof priorityTextColors] ||
      "text-gray-800";

    return (
      <div className={`mb-8 border rounded-lg overflow-hidden ${colorClass}`}>
        <div className={`px-4 py-3 border-b ${colorClass}`}>
          <h2 className={`font-semibold text-lg ${textColorClass}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            Items
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white">
              {items.length} items
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Housekeeping Item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity_in_stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.cost_per_unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.reorder_request > 7
                          ? "bg-red-100 text-red-800"
                          : item.reorder_request > 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.reorder_request}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Reorder Requests
        </h1>
        <p className="text-gray-600">
          Inventory items that need to be reordered, categorized by priority
          level
        </p>
      </div>

      {renderTable(highPriorityItems, "high")}
      {renderTable(mediumPriorityItems, "medium")}
      {renderTable(lowPriorityItems, "low")}

      {highPriorityItems.length === 0 &&
        mediumPriorityItems.length === 0 &&
        lowPriorityItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No reorder requests
            </h3>
            <p className="text-gray-500">
              All inventory items are sufficiently stocked.
            </p>
          </div>
        )}
    </div>
  );
}
