import React, { useState, useMemo, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBed,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaStar,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const mockHotel = {
  id: "bf085741-2796-406c-86ef-0216a5bccc8b",
  name: "Dar es Salaam Serena Hotel",
};
const HotelContext = createContext(mockHotel);
const useHotelContext = () => useContext(HotelContext);

// --- TYPE DEFINITIONS ---
interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: "Available" | "Booked" | "Maintenance";
  average_rating: string;
  room_type: string;
}

interface AmenityDetail {
  id: string;
  name: string;
}

interface FeatureDetail {
  id: string;
  name: string;
}

interface RoomTypeDetails {
  id: string;
  name: string;
  description: string;
  bed_type: string;
  features_list: FeatureDetail[];
  amenities_details: AmenityDetail[];
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

interface CombinedRoom extends Room {
  roomTypeInfo: RoomTypeDetails;
}

// --- API Fetching Logic (Updated for Pagination) ---
const fetchHotelRooms = async (
  hotelId: string,
  page: number
): Promise<{ apiResponse: ApiResponse; combinedRooms: CombinedRoom[] }> => {
  if (!hotelId) throw new Error("Hotel ID is not provided.");

  // 1. Fetch the paginated list of rooms for the hotel
  const roomsResponse = await axios.get<ApiResponse>(
    `https://hotel.tradesync.software/api/v1/rooms/?hotel_id=${hotelId}&page=${page}`
  );
  const paginatedData = roomsResponse.data;
  const rooms: Room[] = paginatedData.results;

  if (!rooms || rooms.length === 0) {
    return { apiResponse: paginatedData, combinedRooms: [] };
  }

  // 2. Get unique room type IDs from the current page's results
  const roomTypeIds = [...new Set(rooms.map((room) => room.room_type))];

  // 3. Fetch all unique room type details for the current page
  const roomTypePromises = roomTypeIds.map((id) =>
    axios.get(`https://hotel.tradesync.software/api/v1/room-types/${id}`)
  );
  const roomTypeResults = await Promise.all(roomTypePromises);
  const roomTypeMap: Map<string, RoomTypeDetails> = new Map(
    roomTypeResults.map((res) => [res.data.id, res.data])
  );

  // 4. Merge the datasets
  const combinedRooms: CombinedRoom[] = rooms
    .map((room) => ({
      ...room,
      roomTypeInfo: roomTypeMap.get(room.room_type),
    }))
    .filter((room) => room.roomTypeInfo);

  return { apiResponse: paginatedData, combinedRooms };
};

// --- HELPER & CHILD COMPONENTS ---

const StatusBadge: React.FC<{ status: Room["availability_status"] }> = ({
  status,
}) => {
  const styles = {
    Available: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: <FaCheckCircle />,
    },
    Booked: { bg: "bg-red-100", text: "text-red-700", icon: <FaTimesCircle /> },
    Maintenance: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <FaExclamationTriangle />,
    },
  }[status];
  return (
    <div
      className={`absolute top-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow ${styles.bg} ${styles.text}`}
    >
      {styles.icon} {status}
    </div>
  );
};

const RoomCard: React.FC<{ room: CombinedRoom }> = ({ room }) => {
  const { roomTypeInfo } = room;
  const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    if (name.includes("wifi")) return <FaWifi className="text-blue-500" />;
    if (name.includes("pool"))
      return <FaSwimmingPool className="text-cyan-500" />;
    if (name.includes("restaurant"))
      return <FaUtensils className="text-orange-500" />;
    if (name.includes("parking"))
      return <FaParking className="text-slate-600" />;
    return <FaStar className="text-amber-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative h-48">
        <img
          src={room.image}
          alt={roomTypeInfo.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <StatusBadge status={room.availability_status} />
        <div className="absolute bottom-3 right-3 text-white font-bold text-2xl">
          ${room.price_per_night}{" "}
          <span className="text-sm font-normal">/ night</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800">
          {roomTypeInfo.name}
        </h3>
        <p className="text-sm text-slate-500 mb-3 font-medium">
          Room #{room.code}
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-600 border-y border-slate-100 py-2 my-2">
          <span className="flex items-center gap-1.5">
            <FaUsers /> {room.max_occupancy} Guests
          </span>
          <span className="flex items-center gap-1.5">
            <FaBed /> {roomTypeInfo.bed_type}
          </span>
        </div>
        <div className="flex-grow">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Top Amenities
          </h4>
          <div className="flex flex-wrap gap-2">
            {roomTypeInfo?.amenities_details?.slice(0, 4).map((amenity) => (
              <span
                key={amenity.id}
                className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {getAmenityIcon(amenity.name)}
                {amenity.name}
              </span>
            ))}
          </div>
        </div>
        <button className="w-full mt-4 py-2 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all hover:shadow-lg hover:-translate-y-0.5">
          Manage Room
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function RoomsGrid() {
  const hotel = useHotelContext();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["hotelRooms", hotel.id, page],
    queryFn: () => fetchHotelRooms(hotel.id, page),
    enabled: !!hotel.id,
    keepPreviousData: true, // For smooth pagination
  });

  const { combinedRooms, apiResponse } = data || {};

  const filteredRooms = useMemo(() => {
    if (!combinedRooms) return [];
    return combinedRooms.filter((room) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        room.code.toLowerCase().includes(lowerSearch) ||
        room.roomTypeInfo.name.toLowerCase().includes(lowerSearch);
      const matchesType =
        typeFilter === "all" || room.roomTypeInfo.id === typeFilter;
      const matchesStatus =
        statusFilter === "all" || room.availability_status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [combinedRooms, searchTerm, typeFilter, statusFilter]);

  const roomTypes = useMemo(() => {
    if (!combinedRooms) return [];
    const types = new Map(
      combinedRooms.map((room) => [
        room.roomTypeInfo.id,
        room.roomTypeInfo.name,
      ])
    );
    return Array.from(types, ([id, name]) => ({ id, name }));
  }, [combinedRooms]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Hotel Rooms...</p>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-8 rounded-xl shadow max-w-md w-full">
          <h3 className="font-bold text-lg mb-2">Error Fetching Rooms</h3>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error.message}
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <header className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage Hotel Rooms
        </h1>
      </header>

      {/* Filters & Search */}
      <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="relative md:col-span-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full appearance-none pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Room Types</option>
            {roomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      {isFetching && (
        <div className="text-center mb-4 text-blue-600 font-semibold">
          Fetching next page...
        </div>
      )}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FaBed className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2 font-semibold">
            No Rooms Found
          </p>
          <p className="text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-12">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={!apiResponse?.previous || isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          <FaChevronLeft /> Previous
        </button>
        <span className="font-bold text-slate-600">Page {page}</span>
        <button
          onClick={() => setPage((old) => old + 1)}
          disabled={!apiResponse?.next || isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
