import HousekeepingTable from "../../components/ui/house-keeping-table/house-keeping-table";

export default function HouseKeepingTasks() {
  const mockTasks = [
    {
      id: 1,
      room: "107",
      start_time: "2023-10-05T09:00:00",
      end_time: "2023-10-05T10:30:00",
      priority: 2,
      assigned_to: "John Doe",
      verified_by: "Manager",
      notes: "Guest requested extra towels.",
      status: "Verified",
    },
    {
      id: 2,
      room: "205",
      start_time: "2023-10-05T11:00:00",
      end_time: null,
      priority: 7,
      assigned_to: "Jane Smith",
      verified_by: null,
      notes: "Deep cleaning needed.",
      status: "Verified",
    },
    {
      id: 3,
      room: "29",
      start_time: "2023-10-05T11:00:00",
      end_time: null,
      priority: 10,
      assigned_to: "Ron Smith",
      verified_by: "Manager",
      notes: "Deliver Weed.",
      status: "In Progress",
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <HousekeepingTable tasks={mockTasks} />
    </div>
  );
}
