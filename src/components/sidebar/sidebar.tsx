import styles from "./side-navbar.module.css";
import MenuItem from "../menu-item/menu-item";
import { useAuth } from "../../contexts/authcontext";
import {
  HiOutlineTicket,
  HiOutlineStar,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { LuMessageSquareText } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { MdOutlineHotel, MdOutlineAssignmentTurnedIn } from "react-icons/md";
import {
  RiMoneyDollarBoxLine,
  RiExpandRightLine,
  RiExpandLeftLine,
} from "react-icons/ri";
import { IoCalendarNumberOutline, IoGridOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import safari_pro_logo from "../../../public/images/safari-pro-logo.png";
import { BsBoxes } from "react-icons/bs";

interface SubRoute {
  to: string;
  text: string;
  roles: ("admin" | "staff")[]; // - - - Roles for sub-routes
}

interface MenuItemConfig {
  to: string;
  icon: React.ReactNode;
  text: string;
  roles: ("admin" | "staff")[]; // - - - Roles for main menu items
  subRoutes?: SubRoute[];
}

// * - - Menu structure with roles
const menuConfig: MenuItemConfig[] = [
  {
    to: "/dashboard",
    icon: <IoGridOutline size={20} />,
    text: "Dashboard",
    roles: ["admin"],
  },
  {
    to: "/guests",
    icon: <TbUsers size={20} />,
    text: "Guests",
    roles: ["admin", "staff"],
  },
  {
    to: "/bookings",
    icon: <HiOutlineTicket size={20} />,
    text: "Bookings",
    roles: ["admin", "staff"],
    subRoutes: [
      {
        to: "/bookings/all-bookings",
        text: "All Bookings",
        roles: ["admin", "staff"],
      },
      {
        to: "/bookings/new-booking",
        text: "New Booking",
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    to: "/safari-pro-bookings",
    icon: (
      <div className="w-[22px] h-[22px] flex items-center justify-center">
        <img
          className="max-w-full max-h-full"
          src={safari_pro_logo}
          alt="safari_pro_bookings"
        />
      </div>
    ),
    text: "SafariPro Bookings",
    roles: ["admin", "staff"],
    subRoutes: [
      {
        to: "/safari-pro-bookings/add-room",
        text: "Add Room",
        roles: ["admin", "staff"],
      },
      {
        to: "/safari-pro-bookings/rooms-reserved",
        text: "Rooms Reserved",
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    to: "/rooms",
    icon: <MdOutlineHotel size={20} />,
    text: "Rooms",
    roles: ["admin"],
    subRoutes: [
      { to: "/rooms/add-room", text: "Add Room", roles: ["admin"] },
      { to: "/rooms/all-rooms", text: "All Rooms", roles: ["admin"] },
    ],
  },
  {
    to: "/my-hotel",
    icon: <RiHotelLine size={20} />,
    text: "My Hotel",
    roles: ["admin"],
    subRoutes: [
      {
        to: "/my-hotel/hotel-facilities",
        text: "Hotel Facilities",
        roles: ["admin"],
      },
      {
        to: "/my-hotel/hotel-services",
        text: "Hotel Services",
        roles: ["admin"],
      },
      {
        to: "/my-hotel/safari-pro-status",
        text: "Safari Pro Status",
        roles: ["admin"],
      },
      {
        to: "/my-hotel/fun-things-to-do",
        text: "Fun Things To Do",
        roles: ["admin"],
      },
      { to: "/my-hotel/meals", text: "Meals", roles: ["admin"] },
      { to: "/my-hotel/amenities", text: "Amenities", roles: ["admin"] },
      { to: "/my-hotel/map-location", text: "Map Location", roles: ["admin"] },
      { to: "/my-hotel/about-hotel", text: "About Hotel", roles: ["admin"] },
    ],
  },
  {
    to: "/messages",
    icon: <LuMessageSquareText size={20} />,
    text: "Messages",
    roles: ["admin", "staff"],
    subRoutes: [
      { to: "/messages/sent", text: "Sent", roles: ["admin", "staff"] },
      { to: "/messages/inbox", text: "Inbox", roles: ["admin", "staff"] },
      { to: "/messages/compose", text: "Compose", roles: ["admin"] }, // - - - [Admin]
      { to: "/messages/admin-alerts", text: "Admin Alerts", roles: ["admin"] }, // - - - [Admin]
    ],
  },
  {
    to: "/financial",
    icon: <RiMoneyDollarBoxLine size={20} />,
    text: "Financial",
    roles: ["admin"], // - - - Only admin can access
    subRoutes: [
      { to: "/financial/invoice", text: "Invoice", roles: ["admin"] },
      { to: "/financial/expenses", text: "Expenses", roles: ["admin"] },
    ],
  },
  {
    to: "/house-keeping",
    icon: <MdOutlineAssignmentTurnedIn size={20} />,
    text: "House Keeping",
    roles: ["admin", "staff"],
    subRoutes: [
      {
        to: "/house-keeping/rooms-status",
        text: "Room Status",
        roles: ["admin", "staff"],
      },
      {
        to: "/house-keeping/assign-tasks",
        text: "Assign Task",
        roles: ["admin"],
      }, // - - - Admin only
      {
        to: "/house-keeping/lost-and-found",
        text: "Lost and Found",
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    to: "/inventory",
    icon: <BsBoxes size={20} />,
    text: "Inventory",
    roles: ["admin", "staff"],
    subRoutes: [
      {
        to: "/inventory/all-inventory",
        text: "All Inventory",
        roles: ["admin", "staff"],
      },
      {
        to: "/inventory/reorder-request",
        text: "Reorder Request",
        roles: ["admin", "staff"],
      },
      { to: "/inventory/add-item", text: "Add Item", roles: ["admin"] }, // Admin only
    ],
  },
  {
    to: "/staffs",
    icon: <TbUsers size={20} />,
    text: "Staff",
    roles: ["admin", "staff"],
    subRoutes: [
      {
        to: "/staffs/staff-list",
        text: "Staff List",
        roles: ["admin", "staff"],
      },
      { to: "/staffs/tasks", text: "Tasks", roles: ["admin"] }, // Admin only
      { to: "/staffs/my-tasks", text: "My Tasks", roles: ["admin", "staff"] },
      { to: "/staffs/add-staff", text: "Add Staff", roles: ["admin"] }, // Admin only
      {
        to: "/staffs/service-management",
        text: "Service Management",
        roles: ["admin"],
      }, // Admin only
      { to: "/staffs/services", text: "Services", roles: ["admin", "staff"] },
    ],
  },
  {
    to: "/calendar",
    icon: <IoCalendarNumberOutline size={20} />,
    text: "Calendar",
    roles: ["admin", "staff"],
    subRoutes: [
      {
        to: "/calendar/hotel-events",
        text: "Hotel Events",
        roles: ["admin", "staff"],
      },
      {
        to: "/calendar/my-schedule",
        text: "My Schedule",
        roles: ["admin", "staff"],
      },
      { to: "/calendar/add-event", text: "Add Event", roles: ["admin"] }, // Admin only
    ],
  },
  {
    to: "/reviews",
    icon: <HiOutlineStar size={20} />,
    text: "Reviews",
    roles: ["admin", "staff"],
    subRoutes: [
      { to: "/reviews/all-reviews", text: "All Reviews", roles: ["admin"] }, // Admin only
      { to: "/reviews/analytics", text: "Analytics", roles: ["admin"] }, // Admin only
      {
        to: "/reviews/loyalty-programs",
        text: "Loyalty Programs",
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    to: "/settings",
    icon: <HiOutlineCog6Tooth size={20} />,
    text: "Settings",
    roles: ["admin", "staff"],
    subRoutes: [
      { to: "/settings/theme", text: "Theme", roles: ["admin", "staff"] },
    ],
  },
];

interface SideNavbarProps {
  isExpanded: boolean; // Receive isExpanded from Layout
  toggleSidebar: () => void; // Receive toggleSidebar from Layout
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  isExpanded,
  toggleSidebar,
}) => {
  const { user } = useAuth(); // Get the current user from context

  if (!user) {
    return null; // Don't render the sidebar if no user is logged in
  }

  // Filter the menu items based on the user's role
  const filteredMenu = menuConfig.filter((item) => {
    // Check if the main menu item is allowed for the user's role
    const isMainItemAllowed = item.roles.includes(user.role);

    if (isMainItemAllowed && item.subRoutes) {
      // If the main item is allowed and has sub-routes, filter its sub-routes
      item.subRoutes = item.subRoutes.filter((subItem) =>
        subItem.roles.includes(user.role)
      );
      // Only include the main item if it still has allowed sub-routes
      // or if it's a direct link (i.e., didn't have subRoutes initially or they all got filtered)
      return item.subRoutes.length > 0 || !item.subRoutes.length;
    }
    return isMainItemAllowed;
  });

  return (
    <nav
      className={`${styles.sidebar} ${
        isExpanded ? styles.expanded : styles.collapsed
      } pt-[1rem] px-[0.75rem] border-r-[1.5px] border-[#EFF2F6]`}
    >
      <ul className="h-full flex flex-col justify-between">
        <div>
          {/* Render filtered menu items */}
          {filteredMenu.map((item) => (
            <MenuItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              text={item.text}
              isExpanded={isExpanded}
              hasSubRoutes={!!item.subRoutes && item.subRoutes.length > 0} // Ensure boolean
              subRoutes={item.subRoutes}
            />
          ))}
        </div>
        {/* Expand/Collapse Sidebar Button */}
        <div className="mb-[1rem] mt-[1rem] pl-[0.75rem] w-full flex items-center">
          {isExpanded ? (
            <span
              onClick={toggleSidebar}
              className="flex items-center gap-3 cursor-pointer"
            >
              <RiExpandLeftLine color="#525b75" size={22} /> Collapsed View
            </span>
          ) : (
            <RiExpandRightLine
              onClick={toggleSidebar}
              color="#525b75"
              size={22}
              className="cursor-pointer"
            />
          )}
        </div>
      </ul>
    </nav>
  );
};

export default SideNavbar;
