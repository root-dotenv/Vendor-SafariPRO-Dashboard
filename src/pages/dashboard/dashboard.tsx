import React from "react";
import { useAuth } from "../../contexts/authcontext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/dashboard-overview'</p>
      <p className="text-purple-600 font-medium">
        Access: Admin Only - Hotel Intelligence Displayed i.e Not to be view,
        edited or deleted by Regular Staff.
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - Number of New Bookings from SafariPro Booking App
          (Percentage Increase or Decrease)
        </li>
        <li>- - - - - Number of Chek-ins (Percentage Increase or Decrease)</li>
        <li>- - - - - Number of Chek-outs (Percentage Increase or Decrease)</li>
        <li>- - - - - Total Revenue from Regular (in-hotel bookings)</li>
        <li>- - - - - Total Revenue from SafariPro bookings</li>
        <li>- - - - - Summary of Room Availability</li>
        <li>- - - - - 6 Months Period Graph of Revenue</li>
        <li>
          - - - - - 7 Days Barchart of Bookings Comparisons (in-hotel/SafariPro)
        </li>
        <li>- - - - - Recent Activities</li>
        <li>
          - - - - - Overall Hotel Rating Card (derived from reviews) in five
          criterias (location, cleanliness,services,facilities,comfort)
        </li>
        <li>- - - - - 5 Recent Bookings</li>
        <li>- - - - - 5 Recent Tasks/Activities</li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Prepare Data types & structure to be returned/sent to the backend
        Endpoints &
      </p>
    </div>
  );
};

export default Dashboard;
