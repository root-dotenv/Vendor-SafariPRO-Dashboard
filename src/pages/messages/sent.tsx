export default function Sent() {
  return (
    <div>
      <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
        <p>'/messages-sent,inbox,compose,admin-alerts'</p>
        <p className="text-purple-600 font-medium">
          Access: Admin & Staff - Hotel Intelligence Displayed i.e Not to be
          view, edited or deleted by Regular Staff.
        </p>
        <ul className="flex flex-col gap-y-4">
          <li>
            - - - - - View received internal messages and system-generated
            alerts (e.g., low inventory, new booking, maintenance requests).
          </li>
          <li>- - - - - View sent messages.</li>
          <li>
            - - - - - Interface to create and send new internal messages.
            (Admin, Staff - configurable recipient groups)
          </li>
          <li>
            - - - - - Dedicated channel for staff to send notifications to Admin
            (e.g., "Hotel Full" request). Admin can view and action these.
          </li>
        </ul>
        <p className="text-purple-600 text-[1.25rem] font-bold">
          TASK: Implementation details to be discussed with backend developers
        </p>
      </div>
    </div>
  );
}
