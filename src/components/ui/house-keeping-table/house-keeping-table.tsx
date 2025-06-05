import { useState } from "react";
import {
  Edit,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  X,
  Calendar,
  Clock as ClockIcon,
} from "lucide-react";

// Define the Task type
interface Task {
  id: number;
  room: string | null;
  start_time: string | null;
  end_time: string | null;
  priority: number;
  assigned_to: string | null;
  verified_by: string | null;
  notes: string | null;
  status: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
}

// Define form data interface
interface TaskFormData {
  room: string;
  priority: number;
  scheduled_date: string;
  scheduled_time: string;
  assigned_to: string;
  status: string;
  verified_by: string;
  notes: string;
}

// Define the props for the component
interface HousekeepingTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const HousekeepingTable: React.FC<HousekeepingTableProps> = ({
  tasks,
  onEdit,
  onDelete,
}) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    room: "",
    priority: 5,
    scheduled_date: "",
    scheduled_time: "",
    assigned_to: "",
    status: "Scheduled",
    verified_by: "",
    notes: "",
  });

  // Room options for dropdown
  const roomOptions = [
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "209",
    "210",
    "Lobby",
    "Reception",
    "Restaurant",
    "Conference Room A",
    "Conference Room B",
    "Gym",
    "Pool Area",
    "Spa",
    "Parking Garage",
    "Laundry Room",
  ];

  // Status options
  const statusOptions = [
    "Scheduled",
    "In Progress",
    "Completed",
    "Verified",
    "Needs Attention",
  ];

  // Priority Badge (0-5: Low, 5-7: Medium, 7-10: High)
  const getPriorityBadge = (priority: number) => {
    if (priority <= 5) return { text: "Low", color: "#D1FAE6" };
    if (priority <= 7) return { text: "Medium", color: "#FEF08A" };
    return { text: "High", color: "#FEE2E3" };
  };

  // Status Badge
  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return { text: "Scheduled", color: "#F9FAFC", textColor: "#535B75" };
      case "incomplete":
        return { text: "Incomplete", color: "#FEE2E3", textColor: "#EF4444" };
      case "in progress":
        return { text: "In Progress", color: "#D1FAE6", textColor: "#0EB981" };
      case "completed":
        return { text: "Completed", color: "#D1FAE6", textColor: "#0EB981" };
      case "verified":
        return { text: "Verified", color: "#D1FAE6", textColor: "#0EB981" };
      case "needs attention":
        return {
          text: "Needs Attention",
          color: "#FEE2E3",
          textColor: "#EF4444",
        };
      default:
        return { text: "Unknown", color: "#F9FAFC", textColor: "#535B75" };
    }
  };

  // Format date (dd/mm/yy, hr:mm)
  const formatDateTime = (date: string | Date | null) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // Handle Edit (opens modal)
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      room: task.room || "",
      priority: task.priority || 5,
      scheduled_date: task.scheduled_date || "",
      scheduled_time: task.scheduled_time || "",
      assigned_to: task.assigned_to || "",
      status: task.status || "Scheduled",
      verified_by: task.verified_by || "",
      notes: task.notes || "",
    });
    setEditModal(true);
    if (onEdit) onEdit(task);
  };

  // Handle Delete
  const handleDelete = (taskId: number) => {
    console.log("Delete clicked", taskId);
    if (onDelete) onDelete(taskId);
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof TaskFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSave = () => {
    console.log("Save edited task", { ...selectedTask, ...formData });
    setEditModal(false);
  };

  // Sample tasks for demo
  const sampleTasks: Task[] = [
    {
      id: 1,
      room: "101",
      start_time: "2025-06-05T09:00:00Z",
      end_time: "2025-06-05T10:30:00Z",
      priority: 8,
      assigned_to: "John Doe",
      verified_by: "Jane Smith",
      notes: "Deep cleaning required",
      status: "Completed",
      scheduled_date: "2025-06-05",
      scheduled_time: "09:00",
    },
    {
      id: 2,
      room: "102",
      start_time: null,
      end_time: null,
      priority: 5,
      assigned_to: "Alice Johnson",
      verified_by: null,
      notes: "Standard cleaning",
      status: "In Progress",
      scheduled_date: "2025-06-05",
      scheduled_time: "10:00",
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : sampleTasks;

  return (
    <div className="p-6">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {/* Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayTasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.room || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateTime(task.start_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateTime(task.end_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getPriorityBadge(task.priority).color,
                    }}
                  >
                    {getPriorityBadge(task.priority).text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.assigned_to || "Unassigned"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.verified_by || "Not Verified"}
                </td>
                <td
                  className="px-6 py-4 max-w-xs truncate"
                  title={task.notes || ""}
                >
                  {task.notes || "No notes"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{
                      backgroundColor: getStatusBadge(task.status).color,
                      color: getStatusBadge(task.status).textColor,
                    }}
                  >
                    {task.status === "Verified" && <Check size={10} />}
                    {task.status === "In Progress" && <Clock size={10} />}
                    {task.status === "Needs Attention" && (
                      <AlertTriangle size={10} />
                    )}
                    {getStatusBadge(task.status).text}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Professional Edit Modal */}
        {editModal && selectedTask && (
          <div className="fixed inset-0 bg-slate-300/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div
                className="px-6 py-4 border-b-2 rounded-t-xl flex items-center justify-between"
                style={{ backgroundColor: "#CCDCF1", borderColor: "#E6E7EB" }}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Housekeeping Task
                </h2>
                <button
                  onClick={() => setEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-5">
                  {/* Row 1: Room and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Room Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room / Place <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.room}
                        onChange={(e) =>
                          handleInputChange("room", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        style={{ borderColor: "#E6E7EB" }}
                        required
                      >
                        <option value="">Select Room/Place</option>
                        {roomOptions.map((room) => (
                          <option key={room} value={room}>
                            {room}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority (0-10)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.priority}
                        onChange={(e) =>
                          handleInputChange(
                            "priority",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        style={{ borderColor: "#E6E7EB" }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Scheduled Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-2" size={16} />
                        Scheduled Date
                      </label>
                      <input
                        type="date"
                        value={formData.scheduled_date}
                        onChange={(e) =>
                          handleInputChange("scheduled_date", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        style={{ borderColor: "#E6E7EB" }}
                      />
                    </div>

                    {/* Scheduled Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="inline mr-2" size={16} />
                        Scheduled Time
                      </label>
                      <input
                        type="time"
                        value={formData.scheduled_time}
                        onChange={(e) =>
                          handleInputChange("scheduled_time", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        style={{ borderColor: "#E6E7EB" }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Assigned To and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Assigned To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned To
                      </label>
                      <input
                        type="text"
                        value={formData.assigned_to}
                        onChange={(e) =>
                          handleInputChange("assigned_to", e.target.value)
                        }
                        placeholder="Enter staff name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        style={{ borderColor: "#E6E7EB" }}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        style={{ borderColor: "#E6E7EB" }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Verified By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verified By
                    </label>
                    <input
                      type="text"
                      value={formData.verified_by}
                      onChange={(e) =>
                        handleInputChange("verified_by", e.target.value)
                      }
                      placeholder="Enter verifier name"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ borderColor: "#E6E7EB" }}
                    />
                  </div>

                  {/* Row 5: Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Enter any additional notes or special instructions..."
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      style={{ borderColor: "#E6E7EB" }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="px-6 py-4 border-t rounded-b-xl flex justify-end gap-3"
                style={{ borderColor: "#E6E7EB" }}
              >
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: "#6B7280", color: "white" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#0EB981" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HousekeepingTable;
