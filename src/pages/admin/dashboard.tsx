import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "../../api/endpoints";
import { api } from "../../api/axios";

export function AdminDashboard() {
  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.get(ENDPOINTS.ROOMS).then((res) => res.data),
  });

  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.get(ENDPOINTS.BOOKINGS).then((res) => res.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Rooms Overview</h2>
          <p>Total Rooms: {rooms?.length || 0}</p>
          <p>
            Available Rooms:{" "}
            {rooms?.filter((r: any) => r.isAvailable).length || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Bookings Overview</h2>
          <p>Total Bookings: {bookings?.length || 0}</p>
          <p>
            Active Bookings:{" "}
            {bookings?.filter((b: any) => b.status === "active").length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
