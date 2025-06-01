import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "../../api/endpoints";
import { api } from "../../api/axios";

export function StaffDashboard() {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get(ENDPOINTS.TASKS).then((res) => res.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">My Tasks</h2>
        {tasks?.length ? (
          <ul className="space-y-2">
            {tasks.map((task: any) => (
              <li key={task.id} className="p-2 border-b">
                {task.title} - {task.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks assigned</p>
        )}
      </div>
    </div>
  );
}
