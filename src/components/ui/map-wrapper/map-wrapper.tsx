import React, { useEffect, useRef } from "react";

// Leaflet CSS and JS should be included in your main HTML file or loaded dynamically.
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

// --- Hotel Interface ---
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
  images?: string[]; // Optional: for a potential image gallery
  contactEmail?: string;
  contactPhone?: string;
}

// --- src/components/ui/MapWrapper.tsx (Conceptually) ---
interface MapWrapperProps {
  latitude: number;
  longitude: number;
  zoomLevel?: number;
  popupText?: string;
  hotelName?: string; // Added to customize popup
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  latitude,
  longitude,
  zoomLevel = 15,
  popupText, // Default popup text will be constructed using hotelName
  hotelName = "Hotel Location",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (
        mapRef.current &&
        !mapInstanceRef.current &&
        typeof L !== "undefined"
      ) {
        const map = L.map(mapRef.current).setView(
          [latitude, longitude],
          zoomLevel
        );
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const hotelIcon = L.icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          shadowSize: [41, 41],
        });

        const marker = L.marker([latitude, longitude], {
          icon: hotelIcon,
        }).addTo(map);
        const finalPopupText =
          popupText ||
          `<strong>${hotelName}</strong><br/>Lat: ${latitude}, Long: ${longitude}`;
        marker.bindPopup(finalPopupText).openPopup();
      }
    };

    if (typeof L === "undefined") {
      console.warn(
        "Leaflet library (L) is not loaded. Attempting to load dynamically."
      );
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
        link.onload = initializeMap; // Initialize map after CSS also loads
      };
      document.head.appendChild(script);
      return () => {
        // Basic cleanup, ideally manage scripts and links more robustly
        try {
          // document.head.removeChild(script);
          // if (document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) {
          //   document.head.removeChild(document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]'));
          // }
        } catch (error) {
          console.warn("Error during script/link cleanup for Leaflet:", error);
        }
      };
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoomLevel, popupText, hotelName]);

  return (
    <div
      ref={mapRef}
      className="h-[350px] md:h-[450px] w-full rounded-xl shadow-lg border border-slate-700" // Enhanced styling
      aria-label="Map showing hotel location"
    >
      {typeof L === "undefined" && (
        <div className="flex items-center justify-center h-full bg-slate-800 rounded-xl">
          <p className="p-4 text-center text-sky-400">Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default MapWrapper;
