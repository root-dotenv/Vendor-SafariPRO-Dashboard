import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/layout";
import Login from "./pages/authentication/login/login";
import { AuthProvider, useAuth } from "./contexts/authcontext";
import Dashboard from "./pages/dashboard/dashboard";
import { allAppRoutes, type RouteConfig } from "./routes";
import { HotelProvider } from "./contexts/hotelContext";
import { useHotel } from "./hooks/useHotel";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthenticatedAppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filterRoutesByRole = (
    routes: RouteConfig[],
    userRole: typeof user.role
  ): RouteConfig[] => {
    return routes.filter((route) => {
      const isRouteAllowed =
        route.roles.includes("all") || route.roles.includes(userRole);

      if (isRouteAllowed && route.children) {
        const filteredChildren = filterRoutesByRole(route.children, userRole);
        // Only include the parent route if it has children or has its own element
        return filteredChildren.length > 0 || route.element !== null;
      }

      return isRouteAllowed;
    });
  };

  const accessibleRoutes = filterRoutesByRole(allAppRoutes, user.role);

  const renderRoutes = (routes: RouteConfig[]): React.ReactElement[] => {
    return routes.map((route) => {
      // For parent routes with children but no element, use Outlet
      if (
        route.children &&
        route.children.length > 0 &&
        route.element === null
      ) {
        return (
          <Route key={route.path} path={route.path} element={<Outlet />}>
            {renderRoutes(route.children)}
          </Route>
        );
      }

      // For routes with both element and children
      if (
        route.children &&
        route.children.length > 0 &&
        route.element !== null
      ) {
        return (
          <Route key={route.path} path={route.path} element={route.element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }

      // For leaf routes (no children)
      return (
        <Route key={route.path} path={route.path} element={route.element} />
      );
    });
  };

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      {renderRoutes(accessibleRoutes)}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

function App() {
  const { data: hotel } = useHotel();

  if (!hotel) return <div>Loading...</div>;

  return (
    <HotelProvider value={hotel}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="*" element={<AuthenticatedAppRoutes />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </HotelProvider>
  );
}

export default App;
