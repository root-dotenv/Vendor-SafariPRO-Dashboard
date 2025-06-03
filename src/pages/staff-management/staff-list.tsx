export default function StaffList() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/calendar,my-schedule,hotel-events,add-events'</p>
      <p className="text-purple-600 font-medium">
        Access: Admin only (except for staff viewing their own tasks/schedules,
        which may be linked here or accessed via Calendar)
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>- - - - - /staffs/all-staff: List of all staff members.</li>
        <li>
          - - - - - Data Points per Staff: Name, Position, Schedule, Contact,
          Email.
        </li>
        <li>
          - - - - - Admin can perform CRUD operations on user accounts
          (corresponds to User Management under Admin permissions).
        </li>
        <li>- - - - - Form to create a new staff user account.</li>
        <li>
          - - - - - Form to edit existing staff member details and permissions.
        </li>
        <li>- - - - - Manage and publish staff work schedules.</li>
        <li>- - - - - Task management module.</li>
        <li>
          - - - - - Admin view to Create, Edit, Delete, and Assign tasks to
          staff. Filterable by staff member.
        </li>
        <li>
          - - - - - Staff view to see tasks assigned specifically to them.
        </li>
        <li>
          - - - - - Advanced section for Admin to define and manage user roles
          and their granular permissions within the system (beyond basic staff
          profile).
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
