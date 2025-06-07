import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBed,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaSpa,
  FaCheck,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxEnterFullScreen } from "react-icons/rx";
import { IoBedOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { truncateStr } from "../../utils/truncate";
import { MdBusinessCenter } from "react-icons/md";
import { GiElephant } from "react-icons/gi";

// --- TYPE DEFINITIONS ---
interface RoomType {
  id: string;
  name: string;
  image: string;
  is_active: boolean;
  size_sqm: number | null;
  bed_type: string;
  max_occupancy: number;
  description: string;
  room_availability: number;
  base_price: string;
  features: string[]; // Assumed to be an array of feature/service IDs
  amenities: string[]; // This is an array of amenity IDs
}

interface Amenity {
  id: string;
  name: string;
}

interface Feature {
  id: string;
  name: string;
}

// --- HELPER COMPONENT FOR FEATURE/AMENITY ICONS ---
const getFeatureIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  const iconClass = "w-4 h-4";
  if (lowerName.includes("wifi"))
    return <FaWifi className={`${iconClass} text-blue-500`} />;
  if (lowerName.includes("pool"))
    return <FaSwimmingPool className={`${iconClass} text-cyan-500`} />;
  if (lowerName.includes("restaurant") || lowerName.includes("dining"))
    return <FaUtensils className={`${iconClass} text-orange-500`} />;
  if (lowerName.includes("parking"))
    return <FaParking className={`${iconClass} text-slate-600`} />;
  if (lowerName.includes("safari"))
    return <GiElephant className={`${iconClass} text-purple-500`} />;
  if (
    lowerName.includes("gym") ||
    lowerName.includes("fitness") ||
    lowerName.includes("business")
  )
    return <MdBusinessCenter className={`${iconClass} text-red-500`} />;
  if (
    lowerName.includes("spa") ||
    lowerName.includes("safari") ||
    lowerName.includes("tour")
  )
    return <FaSpa className={`${iconClass} text-pink-500`} />;
  return <FaCheck className={`${iconClass} text-emerald-500`} />;
};

const RoomCategories = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [amenityDetails, setAmenityDetails] = useState<Amenity[]>([]);
  const [featureDetails, setFeatureDetails] = useState<Feature[]>([]); // State for fetched feature details
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // --- DATA FETCHING ---
  const {
    data: roomsTypes,
    error,
    isError,
    isLoading,
  } = useQuery<RoomType[]>({
    queryKey: ["roomTypes"],
    queryFn: async () => {
      const response = await axios.get(
        "https://hotel.tradesync.software/api/v1/room-types/"
      );
      return response.data.results;
    },
  });

  // Effect to set the initial selected room
  useEffect(() => {
    if (!selectedRoom && roomsTypes && roomsTypes.length > 0) {
      setSelectedRoom(roomsTypes[0]);
    }
  }, [roomsTypes, selectedRoom]);

  // Effect to fetch amenities and features for the *currently selected* room
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedRoom) return;

      setIsLoadingDetails(true);

      // Create promises for both amenities and features
      const amenityPromises =
        selectedRoom.amenities?.map((id) =>
          axios.get(`https://hotel.tradesync.software/api/v1/amenities/${id}/`)
        ) || [];

      const featurePromises =
        selectedRoom.features?.map((id) =>
          axios.get(`https://hotel.tradesync.software/api/v1/services/${id}/`)
        ) || [];

      try {
        // Fetch all details concurrently
        const [amenityResponses, featureResponses] = await Promise.all([
          Promise.all(amenityPromises),
          Promise.all(featurePromises),
        ]);

        const fetchedAmenities = amenityResponses.map((res) => res.data);
        const fetchedFeatures = featureResponses.map((res) => res.data);

        setAmenityDetails(fetchedAmenities);
        setFeatureDetails(fetchedFeatures);
      } catch (err) {
        console.error("Failed to fetch room details:", err);
        setAmenityDetails([]);
        setFeatureDetails([]);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedRoom]); // This effect re-runs whenever the selectedRoom changes

  // --- RENDER LOGIC ---
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading Room Categories...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-8 rounded-xl shadow max-w-md w-full">
          <h3 className="font-bold text-lg mb-2">Error Fetching Data</h3>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );

  const hotelTypes: RoomType[] = roomsTypes || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- Left Column: Room Types List --- */}
        <div className="lg:col-span-7 xl:col-span-8">
          <header className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Room Categories
            </h1>
          </header>

          <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow border border-gray-100 flex items-center gap-4">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search room types..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 font-medium shadow">
              <FaFilter className="text-blue-500" /> Filters
            </button>
          </div>

          <ul className="flex flex-col gap-y-6">
            {hotelTypes.map((ht) => (
              <li
                className={`bg-white grid grid-cols-12 p-4 gap-x-6 border rounded-2xl shadow transition-all duration-300 cursor-pointer hover:shadow hover:-translate-y-1 ${
                  selectedRoom?.id === ht.id
                    ? "border-blue-500 ring-2 ring-blue-500"
                    : "border-gray-100"
                }`}
                key={ht.id}
                onClick={() => setSelectedRoom(ht)}
              >
                <div className="col-span-12 sm:col-span-3 flex items-center">
                  <img
                    className="w-full h-full block object-cover rounded-xl"
                    src={ht.image}
                    alt={ht.name}
                  />
                </div>
                <div className="col-span-12 sm:col-span-9 flex flex-col gap-y-3 pt-4 sm:pt-0">
                  <div className="w-full flex items-start justify-between">
                    <span className="font-bold text-2xl capitalize text-slate-800">
                      {ht.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        ht.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ht.is_active ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      ></div>
                      {ht.is_active ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-slate-600 text-sm">
                    <span className="flex items-center gap-x-2 font-medium">
                      <RxEnterFullScreen size={16} /> {ht.size_sqm || "35"} sqm
                    </span>
                    <span className="flex items-center gap-x-2 font-medium">
                      <IoBedOutline size={16} /> {ht.bed_type}
                    </span>
                    <span className="flex items-center gap-x-2 font-medium">
                      <LuUsers size={16} /> {ht.max_occupancy} Guests
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    {truncateStr(ht.description, 25)}
                  </p>
                  <div className="w-full flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                    <span className="text-slate-500 font-medium text-sm">
                      Availability:{" "}
                      <span className="text-blue-600 text-base font-bold">
                        {ht.room_availability} Rooms
                      </span>
                    </span>
                    <span className="text-emerald-600 text-2xl font-bold">
                      ${ht.base_price}
                      <span className="text-slate-500 text-sm font-medium">
                        /night
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Right Column: Details View --- */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl w-full min-h-[90vh] sticky top-8 shadow p-6 border border-gray-100">
            {selectedRoom ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <h2 className="text-2xl font-bold capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedRoom.name}
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all hover:shadow hover:-translate-y-0.5">
                    <MdEdit /> Edit
                  </button>
                </div>
                <div className="w-full h-64 rounded-xl overflow-hidden shadow">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Size</p>
                    <strong className="text-slate-800">
                      {selectedRoom.size_sqm || "N/A"} sqm
                    </strong>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Bed Type</p>
                    <strong className="text-slate-800">
                      {selectedRoom.bed_type}
                    </strong>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Max Guests</p>
                    <strong className="text-slate-800">
                      {selectedRoom.max_occupancy}
                    </strong>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedRoom.description}
                  </p>
                </div>

                {/* --- RENDER FEATURES AND AMENITIES --- */}
                <div className="space-y-4">
                  {isLoadingDetails ? (
                    <div className="flex items-center justify-center gap-2 text-slate-500 pt-4">
                      <FaSpinner className="animate-spin" /> Loading Details...
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                          Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {featureDetails.map((feature) => (
                            <span
                              key={feature.id}
                              className="flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full"
                            >
                              {getFeatureIcon(feature.name)} {feature.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                          Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {amenityDetails.map((amenity) => (
                            <span
                              key={amenity.id}
                              className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full"
                            >
                              {getFeatureIcon(amenity.name)} {amenity.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <FaBed className="mx-auto text-4xl mb-4" />
                  <p className="font-bold">Select a Room Type</p>
                  <p className="text-sm">
                    Choose a category from the left to see its details.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCategories;
