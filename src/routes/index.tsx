import React from "react";
import { Outlet } from "react-router-dom";

// Page Imports
import Dashboard from "../pages/dashboard/dashboard";
import Guests from "../pages/guests/guests";
import AllBookings from "../pages/bookings/all-bookings";
import NewBooking from "../pages/bookings/new-booking";
import AddRoomSafariPro from "../pages/safari-pro-bookings/add-rooms-safari-pro";
import RoomsReserved from "../pages/safari-pro-bookings/room-reserved";
import AddRoom from "../pages/rooms/add-room";
import Rooms from "../pages/rooms/rooms";
import HotelFacilities from "../pages/my-hotel/hotel-facilities";
import HotelServices from "../pages/my-hotel/hotel-services";
import SafariProStatus from "../pages/my-hotel/safari-pro-status";
import FunThingsToDo from "../pages/my-hotel/fun-things-to-do";
import Meals from "../pages/my-hotel/meals";
import Amenities from "../pages/my-hotel/amenities";
import Neighborhood from "../pages/my-hotel/neighborhood";
import AboutHotel from "../pages/my-hotel/about-hotel";
import Sent from "../pages/messages/sent";
import Inbox from "../pages/messages/inbox";
import Compose from "../pages/messages/compose";
import AdminAlerts from "../pages/messages/admin-alerts";
import Invoice from "../pages/financial/invoice";
import Expenses from "../pages/financial/expenses";
import AllInventory from "../pages/inventory/all-inventory";
import ReorderRequests from "../pages/inventory/reorder-requests";
import AddInventory from "../pages/inventory/add-inventory";
import StaffList from "../pages/staff-management/staff-list";
import Tasks from "../pages/staff-management/tasks";
import MyTasks from "../pages/staff-management/my-tasks";
import AddStaff from "../pages/staff-management/add-staff";
import ServiceManagement from "../pages/staff-management/service-management";
import Services from "../pages/staff-management/services";
import HotelEvents from "../pages/calendar/hotel-events";
import MySchedule from "../pages/calendar/my-schedule";
import AddEvent from "../pages/calendar/add-events";
import AllReviews from "../pages/reviews/all-reviews";
import Analytics from "../pages/reviews/analytics";
import LoyaltyPrograms from "../pages/reviews/loyalty-programs";
import Theme from "../pages/settings/theme";
import LostAndFound from "../pages/house-keeping/lost-and-found";
import AssignTask from "../pages/house-keeping/assign-task";
import HouseKeepingTasks from "../pages/house-keeping/house-keeping-tasks";
import GuestDetail from "../pages/guests/GuestDetail";
import RoomCategories from "../pages/rooms/rooms-categories";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  roles: ("admin" | "staff" | "all")[];
  children?: RouteConfig[];
}

export const allAppRoutes: RouteConfig[] = [
  { path: "dashboard", element: <Dashboard />, roles: ["admin"] },

  {
    path: "guests",
    element: <Outlet />,
    roles: ["admin", "staff"],
    children: [
      {
        path: "",
        element: <Guests />,
        roles: ["admin", "staff"],
      },
      {
        path: ":guestId",
        element: <GuestDetail />,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    path: "bookings",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      {
        path: "all-bookings",
        element: <AllBookings />,
        roles: ["admin", "staff"],
      },
      {
        path: "new-booking",
        element: <NewBooking />,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    path: "safari-pro-bookings",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      {
        path: "add-room",
        element: <AddRoomSafariPro />,
        roles: ["admin", "staff"],
      },
      {
        path: "rooms-reserved",
        element: <RoomsReserved />,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    path: "rooms",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin"],
    children: [
      { path: "add-room", element: <AddRoom />, roles: ["admin"] },
      { path: "all-rooms", element: <Rooms />, roles: ["all"] },
      { path: "room-categories", element: <RoomCategories />, roles: ["all"] },
    ],
  },
  {
    path: "my-hotel",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin"],
    children: [
      {
        path: "hotel-facilities",
        element: <HotelFacilities />,
        roles: ["admin"],
      },
      { path: "hotel-services", element: <HotelServices />, roles: ["admin"] },
      {
        path: "safari-pro-status",
        element: <SafariProStatus />,
        roles: ["admin"],
      },
      {
        path: "fun-things-to-do",
        element: <FunThingsToDo />,
        roles: ["admin"],
      },
      { path: "meals", element: <Meals />, roles: ["admin"] },
      { path: "amenities", element: <Amenities />, roles: ["admin"] },
      { path: "map-location", element: <Neighborhood />, roles: ["admin"] },
      { path: "about-hotel", element: <AboutHotel />, roles: ["admin"] },
    ],
  },
  {
    path: "messages",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      { path: "sent", element: <Sent />, roles: ["admin", "staff"] },
      { path: "inbox", element: <Inbox />, roles: ["admin", "staff"] },
      { path: "compose", element: <Compose />, roles: ["admin"] },
      { path: "admin-alerts", element: <AdminAlerts />, roles: ["admin"] },
    ],
  },
  {
    path: "financial",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin"],
    children: [
      { path: "invoice", element: <Invoice />, roles: ["admin"] },
      { path: "expenses", element: <Expenses />, roles: ["admin"] },
    ],
  },
  {
    path: "house-keeping",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      {
        path: "house-keeping-tasks",
        element: <HouseKeepingTasks />,
        roles: ["admin", "staff"],
      },
      { path: "assign-tasks", element: <AssignTask />, roles: ["admin"] },
      {
        path: "lost-and-found",
        element: <LostAndFound />,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    path: "inventory",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      {
        path: "all-inventory",
        element: <AllInventory />,
        roles: ["admin", "staff"],
      },
      {
        path: "reorder-request",
        element: <ReorderRequests />,
        roles: ["admin", "staff"],
      },
      { path: "add-item", element: <AddInventory />, roles: ["admin"] },
    ],
  },
  {
    path: "staffs",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      { path: "staff-list", element: <StaffList />, roles: ["admin", "staff"] },
      { path: "tasks", element: <Tasks />, roles: ["admin"] },
      { path: "my-tasks", element: <MyTasks />, roles: ["admin", "staff"] },
      { path: "add-staff", element: <AddStaff />, roles: ["admin"] },
      {
        path: "service-management",
        element: <ServiceManagement />,
        roles: ["admin"],
      },
      { path: "services", element: <Services />, roles: ["admin", "staff"] },
    ],
  },
  {
    path: "calendar",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      {
        path: "hotel-events",
        element: <HotelEvents />,
        roles: ["admin", "staff"],
      },
      // {
      //   path: "my-schedule",
      //   element: <MySchedule />,
      //   roles: ["admin", "staff"],
      // },
      { path: "add-event", element: <AddEvent />, roles: ["admin"] },
    ],
  },
  {
    path: "reviews",
    element: <Outlet />, // Use Outlet instead of null
    roles: ["admin", "staff"],
    children: [
      { path: "all-reviews", element: <AllReviews />, roles: ["admin"] },
      { path: "analytics", element: <Analytics />, roles: ["admin"] },
      {
        path: "loyalty-programs",
        element: <LoyaltyPrograms />,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    path: "settings",
    element: <Outlet />,
    roles: ["admin", "staff"],
    children: [
      { path: "theme", element: <Theme />, roles: ["admin", "staff"] },
    ],
  },
];
