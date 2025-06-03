export default function Invoice() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/financials invoices, expenses'</p>
      <p className="text-purple-600 font-medium">Access: Admin only</p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - Displays: Total Balance, Total Income, Total Expenses.
        </li>
        <li>
          - - - - - Visualizations: Earnings Graph (e.g., 12-month trend), Pie
          Charts (e.g., Income & Expenses breakdown by category).
        </li>
        <li>
          - - - - - /financials/invoices: Manage guest and corporate invoices
          (creation, tracking, status).
        </li>
        <li>
          - - - - - Data Points per Expense: Expense (description), Category
          (e.g., Utilities, Supplies, Salaries), Quantity, Amount, Date, Status
          (e.g., Paid, Pending), Action (e.g., View Receipt).
        </li>
        <li>
          - - - - - /financials/reports: Generate various financial reports
          (e.g., profit & loss, revenue summaries).
        </li>
        <li>
          - - - - - /financials/earnings-booked-rooms: Specific report detailing
          earnings generated from room bookings.
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
