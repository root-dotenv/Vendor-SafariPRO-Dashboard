import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useHotelContext } from "../../contexts/hotelContext";
import {
  FaMapMarkerAlt,
  FaImages,
  FaHeart,
  FaLocationArrow,
  FaGlobe,
  FaTag,
  FaSpinner,
} from "react-icons/fa";
import { useState } from "react";

// Type definitions
interface HotelImage {
  id: string;
  hotel_name: string;
  hotel_id: string;
  category_name: string;
  category_id: string;
  thumbnails: string[];
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tag: string;
  original: string;
  image_type: string;
  is_primary: boolean;
  caption: string | null;
  category: string;
  hotel: string;
  translation: any | null;
}

interface Theme {
  id: string;
  translation_language: string | null;
  translation_id: string | null;
  hotel_count: number;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  description: string;
  translation: any | null;
}

interface HotelContextType {
  longitude: number;
  latitude: number;
  address: string;
  country: string;
  description: string;
  destination: string;
  image_ids: string[];
  themes: string[];
  zip_code: string;
}

export default function Neighborhood() {
  const hotel = useHotelContext() as HotelContextType;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  console.log(` - - - Hotel Global Object (Map Location)`);
  const {
    longitude,
    latitude,
    address,
    country,
    description,
    destination,
    image_ids,
    themes,
    zip_code,
  } = hotel;

  console.log(` - - - Coordinates`);
  console.log(
    longitude,
    latitude,
    address,
    country,
    description,
    destination,
    image_ids,
    themes,
    zip_code
  );

  // Fetch hotel images
  const { data: images, isLoading: imagesLoading } = useQuery<HotelImage[]>({
    queryKey: ["hotel-images", image_ids],
    queryFn: async () => {
      if (!image_ids || image_ids.length === 0) return [];

      const imagePromises = image_ids.map(async (id) => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/hotel-images/${id}`
        );
        return response.data;
      });

      return Promise.all(imagePromises);
    },
    enabled: !!image_ids && image_ids.length > 0,
  });

  // Fetch themes
  const { data: themesData, isLoading: themesLoading } = useQuery<Theme[]>({
    queryKey: ["themes", themes],
    queryFn: async () => {
      if (!themes || themes.length === 0) return [];

      const themePromises = themes.map(async (themeId) => {
        const response = await axios.get(
          `https://hotel.tradesync.software/api/v1/themes/${themeId}/`
        );
        return response.data;
      });

      return Promise.all(themePromises);
    },
    enabled: !!themes && themes.length > 0,
  });

  // Generate map URL (using a simple map service)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`;

  // Fallback map using OpenStreetMap
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.01
  },${latitude - 0.01},${longitude + 0.01},${
    latitude + 0.01
  }&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {destination}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Map and Location Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Map */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaMapMarkerAlt className="text-amber-500" />
                Hotel Location
              </h2>
            </div>
            <div className="p-6">
              <div className="relative h-80 rounded-xl overflow-hidden bg-gray-200">
                <iframe
                  src={osmMapUrl}
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  title="Hotel Location Map"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <FaLocationArrow className="text-blue-500" />
                    <span className="font-medium text-gray-800">
                      {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FaGlobe className="text-emerald-500" />
              Location Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Address</h4>
                  <p className="text-gray-600">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl">
                <FaGlobe className="text-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Country</h4>
                  <p className="text-gray-600">{country}</p>
                </div>
              </div>

              {zip_code && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                  <FaTag className="text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Zip Code</h4>
                    <p className="text-gray-600">{zip_code}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <FaLocationArrow className="text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Coordinates</h4>
                  <p className="text-gray-600">
                    Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Images Gallery */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaImages className="text-amber-500" />
              Hotel Gallery
            </h2>
          </div>

          {imagesLoading ? (
            <div className="p-8 flex items-center justify-center">
              <FaSpinner className="animate-spin text-3xl text-blue-500" />
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          ) : images && images.length > 0 ? (
            <div className="p-6">
              {/* Main Image Display */}
              <div className="mb-6">
                <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200">
                  <img
                    src={images[selectedImageIndex]?.original}
                    alt={images[selectedImageIndex]?.tag || "Hotel Image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Hotel+Image";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                    <p className="font-medium">
                      {images[selectedImageIndex]?.tag}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "ring-4 ring-blue-500 scale-105"
                        : "hover:scale-105 hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image.original}
                      alt={image.tag}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/150x150/e5e7eb/6b7280?text=Image";
                      }}
                    />
                    {image.is_primary && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No images available
            </div>
          )}
        </div>

        {/* Themes Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaHeart className="text-amber-500" />
              Hotel Themes & Experiences
            </h2>
          </div>

          {themesLoading ? (
            <div className="p-8 flex items-center justify-center">
              <FaSpinner className="animate-spin text-3xl text-purple-500" />
              <span className="ml-3 text-gray-600">Loading themes...</span>
            </div>
          ) : themesData && themesData.length > 0 ? (
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themesData.map((theme, index) => {
                  const colors = [
                    "from-blue-500 to-purple-500",
                    "from-emerald-500 to-cyan-500",
                    "from-amber-500 to-orange-500",
                    "from-red-500 to-pink-500",
                    "from-purple-500 to-indigo-500",
                    "from-cyan-500 to-blue-500",
                  ];
                  const textColors = [
                    "text-blue-500",
                    "text-emerald-500",
                    "text-amber-500",
                    "text-red-500",
                    "text-purple-500",
                    "text-cyan-500",
                  ];

                  return (
                    <div
                      key={theme.id}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                    >
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${
                          colors[index % colors.length]
                        } mb-4`}
                      >
                        <FaHeart className="text-white text-xl" />
                      </div>

                      <h3
                        className={`text-xl font-bold ${
                          textColors[index % textColors.length]
                        } mb-3`}
                      >
                        {theme.name}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {theme.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {theme.hotel_count} Hotels
                        </span>
                        <div
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${
                            colors[index % colors.length]
                          } text-white text-xs font-medium`}
                        >
                          Featured
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No themes available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
