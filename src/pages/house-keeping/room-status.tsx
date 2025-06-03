export default function RoomStatus() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/house-keeping,room-status,assign-tasks,lost-and-found'</p>
      <p className="text-purple-600 font-medium">
        Access: Admin & Staff - Both Can update housekeeping status.
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>- - - - - Dashboard displaying the status of all rooms.</li>
        <li>
          - - - - - Data Points per Room: Room Number, Room Type, House Keeping
          Status (e.g., Clean, Dirty, Needs Inspection, In Progress), Priority,
          Floor, Reservation Status (e.g., Occupied, Vacant, Due Out), Notes.
        </li>
        <li>
          - - - - - Interface to create and send new internal messages. (Admin,
          Staff - configurable recipient groups)
        </li>
        <li>
          - - - - - Admin interface to assign cleaning and maintenance tasks to
          housekeeping staff.
        </li>
        <li>
          - - - - - Log, view, and track maintenance issues reported for rooms
          or common areas. (Admin, Staff)
        </li>
        <li>
          - - - - - Module to manage and track lost and found items. (Admin,
          Staff)
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
