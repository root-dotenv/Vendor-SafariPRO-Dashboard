import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authcontext";
type ProtectedRouteProps = {
  allowedRoles: ("admin" | "staff")[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
}
