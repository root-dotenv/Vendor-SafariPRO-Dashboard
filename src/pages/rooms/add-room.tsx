export default function AddRoom() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/rooms invoices, expenses'</p>
      <p className="text-purple-600 font-medium">Access: Admin only</p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - Data Points per Room: Images (visuals of the room), Room ID
          (NO# - unique identifier), Room Description, Room Quality (e.g.,
          Standard, Deluxe), Room Type (e.g., Single, Double), Type of Beds
          (e.g., Queen, King), Area Size (sqm/sqft), Room Pricing (USD).
        </li>
        <li>- - - - - Admin: Full CRUD on room details.</li>
        <li>- - - - - Staff: View only</li>
        <li>
          - - - - - Filtered view showing only available (not-booked) rooms.
          (Admin, Staff - View only)
        </li>
        <li>- - - - - Filtered view showing booked rooms.</li>
        <li>
          - - - - - /financials/earnings-booked-rooms: Specific report detailing
          earnings generated from room bookings.
        </li>
        <li>
          - - - - - Form to add new room instances or room types. (Admin only) .
        </li>
        <li>
          - - - - - rooms/edit-room/:roomId - Interface to edit details of an
          existing room. (Admin only)
        </li>
        <li>
          - - - - - Manage the defined room types (e.g., Single, Double) and
          quality standards (e.g., Standard, Deluxe, Suite). (Admin only)
        </li>
        <li>
          - - - - -/my-property/rooms/edit-room/:roomId - Interface to edit
          details of an existing room. (Admin only)
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
