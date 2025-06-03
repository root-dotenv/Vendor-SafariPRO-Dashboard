export default function AllReviews() {
  return (
    <div className="p-4 flex flex-col gap-y-4 text-[1.125rem]">
      <p>'/calendar,my-schedule,hotel-events,add-events'</p>
      <p className="text-purple-600 font-medium">
        Access: Admin Only (Manage/Respond)
      </p>
      <ul className="flex flex-col gap-y-4">
        <li>
          - - - - - /calendar/hotel-events: Centralized calendar for hotel-wide
          activities.
        </li>
        <li>
          - - - - - reviews/all-reviews: Display all guest reviews from direct
          collection and integrated 3rd-party platforms (e.g., SafariPro).
          (Admin, Staff)
        </li>
        <li>
          - - - - - (If moderation is implemented) Reviews awaiting admin
          approval before display. (Admin only)
        </li>
        <li>
          - - - - - Interface for Admin to compose and publish responses to
          guest reviews. (Admin only)
        </li>
        <li>
          - - - - - Insights from review data, such as sentiment analysis and
          common themes. (Admin only)
        </li>
      </ul>
      <p className="text-purple-600 text-[1.25rem] font-bold">
        TASK: Implementation details to be discussed with backend developers for
        API Availability (At time-t use json-mock data)
      </p>
    </div>
  );
}
