import { useQuery } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

// Importing necessary icons
import {
  FaTag,
  FaAlignLeft,
  FaUserCog,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaPlusCircle,
} from "react-icons/fa";

export default function HotelEvents() {
  const hotel = useHotelContext();

  const {
    data: events_categories,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-categories"],
    queryFn: async () => {
      // Fetch categories specifically for the hotel in context
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/activity-categories/?name=&description=&hotel_id=&is_active=unknown&created_after=&created_before=&updated_after=&updated_before=`
      );
      return response.data.results;
    },
  });

  // --- Loading State ---
  // A visually appealing loading component
  if (isLoading || !hotel?.id) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <p className="mt-4 text-lg text-gray-800">
          Loading Event Categories...
        </p>
      </div>
    );
  }

  // --- Error State ---
  // A clear and informative error message component
  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div
          className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-900">
                An Error Has Occurred
              </p>
              <p className="text-md text-red-800 mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("- - - Debugging events_categories");
  console.log(events_categories);

  // --- Main Display ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-4">
      <div className="p-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="flex items-center text-4xl font-extrabold text-blue-900">
            <FaCalendarAlt className="mr-3 text-purple-500" />
            Hotel Events Calendar
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            A grid view of all available activity categories for{" "}
            <span className="font-semibold text-amber-700">{hotel.name}</span>.
          </p>
        </div>

        {/* Grid for Event Categories */}
        {events_categories && events_categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events_categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow transition-transform transform hover:-translate-y-0.5 flex flex-col"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-t-lg text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="flex items-center text-xl font-bold">
                      <FaTag className="mr-2" />
                      {category.name}
                    </h2>
                    {category.is_active ? (
                      <span className="flex items-center text-xs font-semibold bg-emerald-500 px-2 py-1 rounded-full">
                        <FaCheckCircle className="mr-1" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-semibold bg-red-500 px-2 py-1 rounded-full">
                        <FaTimesCircle className="mr-1" /> Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow">
                  <div className="mb-4">
                    <h3 className="flex items-center text-sm font-semibold text-purple-700 mb-1">
                      <FaAlignLeft className="mr-2 text-purple-400" />
                      Description
                    </h3>
                    <p className="text-gray-800 text-[0.95rem]">
                      {category.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="flex items-center text-sm font-semibold text-amber-700 mb-1">
                      <FaUserCog className="mr-2 text-amber-500" />
                      Created By
                    </h3>
                    <p className="text-gray-800 text-[0.95rem]">
                      {category.created_by || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 p-3 border-t border-gray-200 rounded-b-lg mt-auto">
                  <p className="flex items-center text-xs text-gray-500">
                    <FaClock className="mr-2" />
                    Created on:{" "}
                    {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- Empty State ---
          <div className="text-center bg-white p-12 rounded-lg shadow">
            <h3 className="text-2xl font-semibold text-gray-800">
              No Categories Found
            </h3>
            <p className="mt-2 text-gray-500">
              There are no event categories for this hotel yet.
            </p>
            <Link
              to="/calendar/add-event"
              className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <FaPlusCircle className="mr-2" />
              Create First Category
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
