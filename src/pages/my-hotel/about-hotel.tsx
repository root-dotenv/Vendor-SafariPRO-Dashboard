export default function AboutHotel() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/my-hotel(my-property) </p>
      <p className="text-purple-600 font-medium">
        Access: Admin (Full CRUD), Staff (View only for most sections, specific
        operational permissions where noted)
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - Sub-routes & Functionalities: * /my-property/about-hotel:
          Manage core hotel information displayed on SafariPro and other
          public-facing platforms. (Admin CRUD)
        </li>
        <li>
          - - - - - Includes general hotel description, contact information,
          main policies, etc.
        </li>
        <li>
          - - - - - Manage information about available meals. (Admin CRUD, Staff
          View) * Details: Restaurant menus, room service options, breakfast
          information.
        </li>
        <li>
          - - - - - Manage information about activities, attractions, or
          hotel-specific entertainment. (Admin CRUD, Staff View)
        </li>
        <li>
          - - - - - Manage location details and neighborhood images. (Admin
          CRUD, Staff View) * Includes images showcasing the hotel in its
          neighborhood.
        </li>
        <li>
          - - - - - Manage hotel-wide and room-specific special amenities.
          (Admin CRUD, Staff View)
        </li>
        <li>
          - - - - - Interface for Admin to set the Hotel as "full booked"
          (unavailable) or available on SafariPro. (Admin only)
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
