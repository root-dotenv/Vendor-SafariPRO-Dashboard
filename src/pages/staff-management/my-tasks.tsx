import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../contexts/authcontext";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserCheck,
} from "react-icons/fa";

// --- Helper Functions & Components ---
const getPriorityInfo = (priority) => {
  if (priority >= 8)
    return { label: "High", color: "bg-red-100 text-red-800 border-red-500" };
  if (priority >= 5)
    return {
      label: "Medium",
      color: "bg-amber-100 text-amber-800 border-amber-500",
    };
  return {
    label: "Low",
    color: "bg-emerald-100 text-emerald-800 border-emerald-500",
  };
};

const TaskCard = ({ task, onUpdateStatus }) => {
  const priorityInfo = getPriorityInfo(task.priority);
  const possibleStatusUpdates = ["In Progress", "Completed", "Needs Attention"];

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
      {/* --- Card Header --- */}
      <header
        className={`p-4 border-b-2 ${priorityInfo.color.split(" ")[2]}`} // Use border color from priority
      >
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-base font-bold text-slate-800">
            {task.task_title}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full flex-shrink-0 ${priorityInfo.color}`}
          >
            {priorityInfo.label}
          </span>
        </div>
        <p className="text-sm text-slate-500 flex items-center gap-2 mt-2">
          <FaMapMarkerAlt className="text-slate-400" /> {task.room_place}
        </p>
      </header>

      {/* --- Card Body --- */}
      <div className="p-4 space-y-4 flex-grow">
        <p className="text-sm text-slate-600 leading-relaxed">
          {task.task_notes}
        </p>
        <p className="text-xs text-slate-400 pt-3 border-t border-slate-100">
          Assigned by:{" "}
          <span className="font-semibold text-slate-600">
            {task.assigned_by}
          </span>
        </p>
      </div>

      {/* --- Card Footer --- */}
      <footer className="p-4 bg-slate-50/70 border-t border-slate-200/80 space-y-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-slate-400" />
            <span className="font-medium">{task.scheduled_date}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FaClock className="text-slate-400" />
            <span className="font-medium">{task.scheduled_time}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700">
            Status:{" "}
            <span className="font-bold text-slate-800">{task.status}</span>
          </span>
          <select
            onChange={(e) => onUpdateStatus(task.id, e.target.value)}
            defaultValue=""
            className="text-xs border border-slate-300 rounded-md bg-white px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-50"
          >
            <option value="" disabled>
              Update Status
            </option>
            {possibleStatusUpdates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </div>
  );
};

// --- Main Component ---
export default function MyTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: myTasks, isLoading } = useQuery({
    queryKey: ["tasks", "my", user?.id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3001/tasks?assigned_to_id=${user.id}`
      );
      return data;
    },
    enabled: !!user, // Only fetch if user is logged in
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      axios.patch(`http://localhost:3001/tasks/${taskId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "my", user?.id] });
      alert("Status updated!");
    },
  });

  const handleUpdateStatus = (taskId, status) => {
    updateTaskStatusMutation.mutate({ taskId, status });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="text-lg font-medium text-slate-500">
          Loading your tasks...
        </p>
      </div>
    );
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
          <FaUserCheck className="text-blue-500" />
          <span>My Assigned Tasks</span>
        </h2>
        <p className="mt-1 text-slate-500">
          Tasks assigned to you that require your attention.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myTasks && myTasks.length > 0 ? (
          myTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-lg border border-dashed border-slate-300">
            <h3 className="text-xl font-medium text-slate-700">All Clear!</h3>
            <p className="text-slate-500 mt-2">
              You have no pending tasks assigned to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
