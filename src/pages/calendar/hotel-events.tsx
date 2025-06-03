export default function HotelEvents() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/calendar,my-schedule,hotel-events,add-events'</p>
      <p className="text-purple-600 font-medium">
        Admin (Full CRUD Can create, edit, and delete events.), Staff (View
        Events, View Own Schedule)
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - /calendar/hotel-events: Centralized calendar for hotel-wide
          activities.
        </li>
        <li>
          - - - - - Event Types: Training, Meeting, Guest Services (scheduled),
          Maintenance (scheduled), Event (hotel functions, conferences).
        </li>
        <li>
          - - - - - Displays personal schedules for staff (e.g., shifts,
          assigned training, specific guest service tasks).
        </li>
        <li>- - - - - Admin: Can view all staff schedules.</li>
        <li>- - - - - Staff: Can view their own schedule.</li>
        <li>
          - - - - - Interface to add new events to the hotel calendar.
          (Primarily Admin for hotel-wide events)
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
