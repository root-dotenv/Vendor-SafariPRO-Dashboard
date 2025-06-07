import { useHotelContext } from "../../contexts/hotelContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaWifi,
  FaLock,
  FaSnowflake,
  FaTv,
  FaMugHot,
  FaGlassMartiniAlt,
  FaShower,
  FaBath,
  FaDoorOpen,
  FaWind,
  FaQuestionCircle,
  FaTshirt, // Using FaTshirt for Iron
  FaDesktop,
} from "react-icons/fa";
import { ReactNode } from "react";

// --- Type Definition for an Amenity ---
interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
}

// --- Helper component to render icons dynamically ---
const AmenityIcon = ({ iconName }: { iconName: string }) => {
  const iconMap: { [key: string]: ReactNode } = {
    wifi: <FaWifi className="text-blue-500" />,
    lock: <FaLock className="text-gray-600" />,
    snowflake: <FaSnowflake className="text-cyan-500" />,
    tv: <FaTv className="text-gray-800" />,
    coffee: <FaMugHot className="text-amber-700" />,
    "glass-martini": <FaGlassMartiniAlt className="text-purple-500" />,
    shower: <FaShower className="text-blue-500" />,
    bath: <FaBath className="text-blue-600" />,
    "door-open": <FaDoorOpen className="text-amber-600" />,
    wind: <FaWind className="text-gray-500" />,
    iron: <FaTshirt className="text-indigo-500" />, // Using a suitable alternative for 'iron'
    desktop: <FaDesktop className="text-gray-700" />,
    default: <FaQuestionCircle className="text-gray-400" />,
  };

  return (
    <div className="text-3xl">{iconMap[iconName] || iconMap["default"]}</div>
  );
};

// --- API Fetching Function ---
// Note: This assumes the hotel context provides an array of amenity IDs.
const fetchAmenities = async (amenityIds: string[]): Promise<Amenity[]> => {
  if (!amenityIds || amenityIds.length === 0) {
    return [];
  }
  const amenityPromises = amenityIds.map((id) =>
    // Using the local endpoint as requested
    axios.get(`http://192.168.1.193:8090/api/v1/amenities/${id}/`)
  );
  const amenityResponses = await Promise.all(amenityPromises);
  return amenityResponses.map((response) => response.data);
};

// --- Main Amenities Component ---
export default function Amenities() {
  const amenity_ids = [
    "0e4f5d91-8a3a-4a9a-901b-a47e05b85b19",
    "14cecdbd-9295-4632-845f-a77e1294f50d",
    "2b702076-8982-414d-9d58-bdc2362dd9e9",
    "52a95c66-a18b-4ae3-a8f0-35e3264fc2d4",
    "7de7be00-0c6f-4ee1-8d0f-2235b1833c1e",
    "7ea23a3f-95f9-41e2-9fa5-9f2e412e4281",
    "80b8808e-bb8d-4052-8840-d964050dca4d",
    "91a9b8f4-55a9-487d-8122-078884d82e3d",
    "94233f1a-1f41-4d42-80c2-ab722f4e7561",
    "c66581b0-a2bc-4ad5-a54e-b3133c35367b",
    "db45feae-b23c-4d27-8eaf-694da116403d",
    "f19bd5a2-441c-40d1-8022-12f99646defa",
  ];

  const {
    data: amenities,
    isLoading,
    isError,
    error,
  } = useQuery<Amenity[], Error>({
    queryKey: ["amenities", amenity_ids],
    queryFn: () => fetchAmenities(amenity_ids),
    enabled: amenity_ids.length > 0, // Only run query if there are IDs
  });

  return (
    <div className="bg-gray-50 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-center text-blue-900">
            Features & Amenities
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Everything we offer to make your stay comfortable and memorable.
          </p>
        </header>

        {isLoading && (
          <div className="text-center text-lg text-gray-500">
            Loading amenities...
          </div>
        )}

        {isError && (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
            <p className="font-bold">Failed to load amenities.</p>
            <p className="text-sm">
              Could not connect to the server. Please try again later.
            </p>
            {/* Developer-friendly error message */}
            <pre className="mt-2 text-xs text-left bg-gray-800 text-white p-2 rounded">
              {error.message}
            </pre>
          </div>
        )}

        {!isLoading && !isError && (!amenities || amenities.length === 0) && (
          <div className="text-center text-lg text-gray-500">
            No amenities listed for this hotel.
          </div>
        )}

        {amenities && amenities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-start p-5 space-x-4"
              >
                <div className="flex-shrink-0">
                  <AmenityIcon iconName={amenity.icon} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">
                      {amenity.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        amenity.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {amenity.is_active ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
