import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ui/protectedroute";
import { useAuth } from "../contexts/AuthContext";
import { Login } from "../pages/auth/login";
import { AdminDashboard } from "../pages/admin/Dashboard";
import StaffManagement from "../pages/Admin/StaffManagement";
import { StaffDashboard } from "../pages/Staff/Dashboard";
import TasksManagement from "../pages/Staff/Tasks";
import Financials from "../pages/Admin/Financials";
import Rooms from "../pages/Shared/Rooms";
import Bookings from "../pages/Shared/Bookings";

export function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/financials" element={<Financials />} />
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/tasks" element={<TasksManagement />} />
      </Route>

      {/* Shared Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>

      {/* Redirects */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              user?.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"
            }
          />
        }
      />
    </Routes>
  );
}
