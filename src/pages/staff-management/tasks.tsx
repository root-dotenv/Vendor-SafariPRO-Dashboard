import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { FaEdit, FaMapMarker, FaTasks } from "react-icons/fa";

// Themed helper function for priority styles
const getPriorityInfo = (priority) => {
  if (priority >= 8)
    return {
      label: "High",
      color: "border-red-500",
      labelColor: "bg-red-500/10 text-red-700",
    };
  if (priority >= 5)
    return {
      label: "Medium",
      color: "border-amber-500",
      labelColor: "bg-amber-500/10 text-amber-700",
    };
  return {
    label: "Low",
    color: "border-emerald-500",
    labelColor: "bg-emerald-500/10 text-emerald-700",
  };
};

const AdminTaskCard = ({ task, onEdit }) => {
  const priorityInfo = getPriorityInfo(task.priority);
  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col border-l-4 ${priorityInfo.color}`}
    >
      {/* --- Card Header --- */}
      <header className="p-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-base font-bold text-blue-900">
            {task.task_title}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${priorityInfo.labelColor}`}
          >
            {priorityInfo.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
          <FaMapMarker className="text-gray-400" /> {task.room_place}
        </p>
      </header>

      {/* --- Card Body --- */}
      <div className="p-4 space-y-3 flex-grow border-t border-gray-100">
        <p className="text-sm font-medium text-gray-800">
          To:{" "}
          <span className="font-normal text-purple-700">
            {task.assigned_to_name} ({task.department})
          </span>
        </p>
        <p className="text-sm text-gray-600">{task.task_notes}</p>
      </div>

      {/* --- Card Footer --- */}
      <footer className="p-4 bg-gray-50/70 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-gray-800">
            Status: <span className="text-blue-500">{task.status}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {task.scheduled_date} at {task.scheduled_time}
          </p>
        </div>
        <button
          onClick={() => onEdit(task)}
          className="p-3 bg-white border border-gray-200 text-blue-500 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-110 transition-all duration-300"
        >
          <FaEdit />
        </button>
      </footer>
    </div>
  );
};

// Main Component
export default function Tasks() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { data: allTasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      axios.get("http://localhost:3001/tasks").then((res) => res.data),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask) =>
      axios.put(`http://localhost:3001/tasks/${updatedTask.id}`, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsModalOpen(false);
      setEditingTask(null);
      alert("Task updated successfully!");
    },
  });

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalFormChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateTaskMutation.mutate(editingTask);
  };

  if (isLoading)
    return (
      <p className="text-center p-12 font-medium text-gray-500 text-lg">
        Loading all tasks...
      </p>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-100/50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-3">
          <FaTasks /> All Assigned Tasks
        </h2>
        <p className="text-gray-500 mt-1">
          Oversee and manage all tasks across departments.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allTasks?.map((task) => (
          <AdminTaskCard key={task.id} task={task} onEdit={handleEditClick} />
        ))}
      </div>

      {/* --- Edit Modal --- */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 bg-slate-300/65 bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl shadow-purple-500/20 w-full max-w-lg transform transition-all duration-300 scale-100">
            <header className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-bold text-lg text-blue-900">Edit Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <MdClose size={24} />
              </button>
            </header>
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Task Title
                </label>
                <input
                  type="text"
                  name="task_title"
                  value={editingTask.task_title}
                  onChange={handleModalFormChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    name="priority"
                    min="1"
                    max="10"
                    value={editingTask.priority}
                    onChange={handleModalFormChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingTask.status}
                    onChange={handleModalFormChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  >
                    {[
                      "Scheduled",
                      "In Progress",
                      "Completed",
                      "Verified",
                      "Needs Attention",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Task Notes
                </label>
                <textarea
                  name="task_notes"
                  rows="4"
                  value={editingTask.task_notes}
                  onChange={handleModalFormChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <footer className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow-lg shadow-blue-500/30 transition"
                >
                  Save Changes
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
