import { useQueries } from "@tanstack/react-query";
import { useHotelContext } from "../../contexts/hotelContext";
import axios from "axios";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

export default function HotelFacilities() {
  const hotel = useHotelContext();
  console.log(`- - - Debugging: useHotelContext Data`);
  console.log(hotel.facilities);

  //  - - - Extract facility IDs from the hotel context
  const facilityIds = hotel.facilities || [];

  // - - - useQueries to fetch data for multiple facility IDs
  const facilityQueries = useQueries({
    queries: facilityIds.map((facilityId) => ({
      queryKey: ["facility", facilityId], // - - - Unique query key for each facility
      queryFn: async () => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/facilities/${facilityId}/`
        );
        return response.data;
      },
      // - - - other useQueries options goes here
    })),
  });

  // Check if any query is loading
  const isLoading = facilityQueries.some((query) => query.isLoading);

  // Check if any query has an error
  const isError = facilityQueries.some((query) => query.isError);

  // Get all errors
  const errors = facilityQueries
    .filter((query) => query.isError)
    .map((query) => query.error);

  // Get all successful data
  const facilitiesData = facilityQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data);

  if (isLoading) {
    console.log("Loading facilities...");
    return <p>Loading facilities...</p>;
  }

  if (isError) {
    console.error("Error fetching facilities:", errors);
    return (
      <div>
        <p>Error loading facilities:</p>
        <ul>
          {errors.map((err, index) => (
            <li key={index}>{err.message}</li>
          ))}
        </ul>
      </div>
    );
  }

  console.log(`- - - Facilities Response Object`, facilitiesData);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Hotel Facilities</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilitiesData.map((f) => (
          <li
            key={f.id}
            className="bg-white 
           p-4 rounded shadow-sm border border-gray-100 flex flex-col gap-y-3"
          >
            <div>CODE : {f.code}</div>
            <div className="flex gap-3  items-center">
              {f?.is_active ? (
                <span>
                  <FaCheck color="green" size={18} />
                </span>
              ) : (
                <span>
                  <RxCross2 color="red" size={18} />
                </span>
              )}
              <span>{f?.name}</span>
            </div>
            {/*  - - - Facility Descriptions */}
            <div>{f.description}</div>
            <div>
              Reservation Required : {f.reservation_required ? "Yes" : "No"}
            </div>
            <div>IS ACTIVE : {f.is_active ? "Yes" : "No"}</div>
            <div>FEE APPLIES : {f.fee_applies ? "Yes" : "No"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
