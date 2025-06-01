import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Sidebar() {
  const { user, logout } = useAuth();

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/staff", label: "Staff Management" },
    { to: "/admin/financials", label: "Financials" },
    { to: "/rooms", label: "Rooms" },
    { to: "/bookings", label: "Bookings" },
  ];

  const staffLinks = [
    { to: "/staff/dashboard", label: "Dashboard" },
    { to: "/staff/tasks", label: "My Tasks" },
    { to: "/rooms", label: "Rooms" },
    { to: "/bookings", label: "Bookings" },
  ];

  const links = user?.role === "admin" ? adminLinks : staffLinks;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-4 text-xl font-bold">Ostub Hotel</div>
      <nav className="flex-1 mt-6">
        <ul>
          {links.map((link) => (
            <li key={link.to} className="mb-1">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-2 hover:bg-gray-700 ${
                    isActive ? "bg-gray-900" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
