import { useState } from "react";
import EditHotelModal from "./edit-hotel-modal";
import {
  Star,
  MapPin,
  Edit3,
  CheckCircle,
  Tag,
  Eye,
  Info,
  ListChecks,
} from "lucide-react";
import MapWrapper from "../../components/ui/map-wrapper/map-wrapper";

// Define the Hotel type
interface Hotel {
  name: string;
  zipcode: string;
  address: string;
  starRating: number;
  hotel_type: string;
  latitude: number;
  longitude: number;
  hotelDescription: string;
  amenities: string[];
  images: string[];
  contactEmail: string;
  contactPhone: string;
}

// --- src/pages/my-hotel/AboutHotel.tsx (Conceptually) ---
const AboutHotel: React.FC = () => {
  const [hotel, setHotel] = useState<Hotel>({
    name: "The Residence Zanzibar",
    zipcode: "1411204",
    address: "Mzizima, Kizimkazi, P.O. Box 2414, Zanzibar, Tanzania",
    starRating: 4.7,
    hotel_type: "Luxury Villa Resort",
    latitude: -6.4381,
    longitude: 39.4779,
    hotelDescription: `Nestled along the pristine shores of Southwest Zanzibar, The Residence Zanzibar offers an unparalleled experience of opulence and tranquility. Our resort features exquisite private pool villas, each a sanctuary of comfort and elegance, complemented by dedicated butler service. \n\nIndulge your palate with world-class dining options, rejuvenate your senses at our serene spa, or explore the turquoise waters of the Indian Ocean with a variety of water sports. Surrounded by lush tropical gardens, we provide the perfect blend of relaxation, adventure, and authentic Zanzibari hospitality. Discover an unforgettable escape where luxury meets nature.`,
    amenities: [
      "Private Beach Access",
      "Individual Pool Villas",
      "Award-Winning Spa",
      "24/7 Butler Service",
      "High-Speed WiFi",
      "Gourmet Restaurants",
      "Airport Concierge",
      "Water Sports Center",
      "Cultural Excursions",
      "Kids' Club & Activities",
      "Fitness Center",
      "Boutique Shop",
    ],
    images: [
      // Example images (replace with actual image URLs or placeholders)
      "https://placehold.co/800x600/1e293b/94a3b8?text=Villa+Exterior",
      "https://placehold.co/800x600/1e293b/94a3b8?text=Pool+View",
      "https://placehold.co/800x600/1e293b/94a3b8?text=Restaurant+Dining",
      "https://placehold.co/800x600/1e293b/94a3b8?text=Beach+Sunset",
    ],
    contactEmail: "reservations.zanzibar@cenizaro.com",
    contactPhone: "+255 773 356 735",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSave = (updatedHotel: Hotel) => {
    console.log("Updated hotel information:", updatedHotel);
    setHotel(updatedHotel);
  };

  const StarRatingDisplay = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-5 h-5 text-yellow-400 fill-current"
          />
        ))}
        {halfStar && (
          <Star
            key="half"
            className="w-5 h-5 text-yellow-400"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-5 h-5 text-slate-600 fill-current"
          />
        ))}
        <span className="ml-2 text-slate-300 font-medium">
          {rating.toFixed(1)} Stars
        </span>
      </div>
    );
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % (hotel.images?.length || 1));
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (hotel.images?.length || 1)) % (hotel.images?.length || 1)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-7xl">
        {/* Header Section */}
        <header className="mb-10 md:mb-14 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-2">
                {hotel.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-slate-400">
                <StarRatingDisplay rating={hotel.starRating} />
                <span className="hidden sm:inline text-slate-600">|</span>
                <div className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-sky-500" />
                  <span>{hotel.hotel_type}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 md:mt-0 px-6 py-3 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center font-medium"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Edit Information
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Left Column: Details & Amenities */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            {/* Image Gallery Section */}
            {hotel.images && hotel.images.length > 0 && (
              <section className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
                <h2 className="text-2xl font-semibold text-sky-400 mb-5 flex items-center">
                  <Eye className="mr-2 h-6 w-6" />
                  Gallery
                </h2>
                <div className="relative">
                  <img
                    src={hotel.images[currentImageIndex]}
                    alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md border border-slate-600"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/800x600/1e293b/7f8c8d?text=Image+Not+Available")
                    }
                  />
                  {hotel.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {hotel.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full ${
                          index === currentImageIndex
                            ? "bg-sky-400"
                            : "bg-slate-500/70"
                        } hover:bg-sky-300 transition-colors`}
                        aria-label={`Go to image ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* About Section */}
            <section className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
              <h2 className="text-2xl font-semibold text-sky-400 mb-4 flex items-center">
                <Info className="mr-2 h-6 w-6" />
                About Our Hotel
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {hotel.hotelDescription}
              </p>
            </section>

            {/* Amenities Section */}
            <section className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
              <h2 className="text-2xl font-semibold text-sky-400 mb-5 flex items-center">
                <ListChecks className="mr-2 h-6 w-6" />
                Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-slate-700/50 p-3.5 rounded-lg transition-all hover:bg-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Address & Map */}
          <div className="space-y-8 md:space-y-10">
            {/* Address Section */}
            <section className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
              <h2 className="text-2xl font-semibold text-sky-400 mb-4 flex items-center">
                <MapPin className="mr-2 h-6 w-6" />
                Our Address
              </h2>
              <div className="space-y-2 text-slate-300">
                <p>{hotel.address}</p>
                <p>Postal Code: {hotel.zipcode}</p>
                {hotel.contactEmail && (
                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${hotel.contactEmail}`}
                      className="text-sky-400 hover:underline"
                    >
                      {hotel.contactEmail}
                    </a>
                  </p>
                )}
                {hotel.contactPhone && (
                  <p>
                    Phone:{" "}
                    <a
                      href={`tel:${hotel.contactPhone.replace(/\s/g, "")}`}
                      className="text-sky-400 hover:underline"
                    >
                      {hotel.contactPhone}
                    </a>
                  </p>
                )}
              </div>
            </section>

            {/* Map Section */}
            <section className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
              <h2 className="text-2xl font-semibold text-sky-400 mb-4">
                Find Us Here
              </h2>
              <MapWrapper
                latitude={hotel.latitude}
                longitude={hotel.longitude}
                hotelName={hotel.name}
              />
              <div className="mt-5 text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
                >
                  <MapPin className="w-5 h-5 mr-2" /> Open in Google Maps
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-slate-700 text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {hotel.name}. All rights reserved.
          </p>
          <p className="mt-1">
            Experience luxury redefined in the heart of Zanzibar.
          </p>
        </footer>
      </div>

      <EditHotelModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        hotel={hotel}
        onSave={handleSave}
      />
    </div>
  );
};

export default AboutHotel;
