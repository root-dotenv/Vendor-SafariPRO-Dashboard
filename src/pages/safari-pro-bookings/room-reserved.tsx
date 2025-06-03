export default function RoomsReserved() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/my-hotel(my-property) </p>
      <p className="text-purple-600 font-medium">
        Access: Admin Only (Full CRUD)
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - Interface for Admin to set the Hotel as "full booked"
          (unavailable) or available on SafariPro. (Admin only)
        </li>
        <li>
          - - - - - List/Add/Edit rooms available to be available on
          SafariPro(Admin Only)
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
