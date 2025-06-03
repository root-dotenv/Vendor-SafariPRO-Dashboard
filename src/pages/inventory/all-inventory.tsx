export default function AllInventory() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/house-keeping,room-status,assign-tasks,lost-and-found'</p>
      <p className="text-purple-600 font-medium">
        Access: Admin (Full CRUD), Staff (View, Request Reorder)
      </p>
      <p className="text-purple-600 font-medium">
        Sub-routes & Functionalities: all-inventory, add-items, reorder-request
        (List of all inventory items), Staff (View, Request Reorder)
      </p>
      <p className="text-purple-600 font-medium">
        Data Points per Item: Item (Name with image), Category (e.g., Linens,
        Toiletries, F&B Supplies), Availability, Quantity in Stock, Quantity to
        Reorder (reorder point/level), Action (Reorder, View Detail - Staff may
        have limited actions).
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - Dashboard displaying the status of inventories of all rooms.
        </li>
        <li>- - - - - Form to add new items to the inventory. (Admin only)</li>
        <li>
          - - - - - System for staff to request item reordering; Admin manages
          these requests.
        </li>
        <li>- - - - - Manage inventory categories. (Admin only)</li>
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
