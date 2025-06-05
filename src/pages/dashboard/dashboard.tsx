import React, { useEffect, useState } from "react"; // Import useState and useEffect
import styles from "./dashboard.module.css";
import {
  FaBed,
  FaMoneyBillWave,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaRegCalendarCheck,
  FaDumbbell,
  FaSpa,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useHotelContext } from "../../contexts/hotelContext";

// Define an interface for a single facility detail response
interface FacilityDetail {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string | null; // Assuming icon could be a URL or a specific identifier
  // ... other properties from your API response if needed
}

const Dashboard = () => {
  const hotel = useHotelContext();
  console.log(`- - - Hotel Context`);
  console.log(hotel);

  // State to store fetched facility details
  const [facilitiesDetails, setFacilitiesDetails] = useState<FacilityDetail[]>(
    []
  );
  const API_BASE_URL = "https://hotel.tradesync.software/api/v1";

  useEffect(() => {
    const fetchFacilities = async () => {
      if (hotel && hotel.facilities && hotel.facilities.length > 0) {
        const fetchedDetails: FacilityDetail[] = [];
        for (const facilityId of hotel.facilities) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/facilities/${facilityId}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: FacilityDetail = await response.json();
            fetchedDetails.push(data);
          } catch (error) {
            console.error(`Failed to fetch facility ${facilityId}:`, error);
          }
        }
        setFacilitiesDetails(fetchedDetails);
      } else {
        setFacilitiesDetails([]); // Clear facilities if none are present in hotel data
      }
    };

    fetchFacilities();
  }, [hotel]); // Re-run effect if hotel object changes (e.g., on context update)

  // Data for charts - NOW DYNAMICALLY FETCHED FROM 'hotel' CONTEXT
  const roomStatusData = [
    {
      name: "Available",
      value: hotel.availability_stats.status_counts.Available || 0,
      color: "#4CAF50", // Green
    },
    {
      name: "Booked",
      value: hotel.availability_stats.status_counts.Booked || 0,
      color: "#F44336", // Red
    },
    {
      name: "Maintenance",
      value: hotel.availability_stats.status_counts.Maintenance || 0,
      color: "#FFC107", // Amber
    },
  ];

  const roomTypeData = hotel.room_type.map((room) => ({
    name: room.name,
    available: room.availability.available_rooms,
    booked: room.availability.booked_rooms,
    maintenance: room.availability.maintenance_rooms,
  }));

  const pricingData = [
    { name: "Min", price: hotel.pricing_data.min },
    { name: "Avg", price: hotel.pricing_data.avg },
    { name: "Max", price: hotel.pricing_data.max },
  ];

  // This `difference` function seems unrelated to the current usage
  // const difference = (a: number, b: number) => {
  //   return a - b;
  // };

  // Helper function to render icons based on facility name
  const getFacilityIcon = (facilityName: string) => {
    switch (facilityName.toLowerCase()) {
      case "free wifi":
        return <FaWifi />;
      case "swimming pool":
        return <FaSwimmingPool />;
      case "restaurant":
        return <FaUtensils />;
      case "parking":
        return <FaParking />;
      case "fitness center": // Example for another common facility
        return <FaDumbbell />;
      case "spa": // Example for another common facility
        return <FaSpa />;
      default:
        return null; // No specific icon, or you can use a generic one
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className="text-[1.75rem] font-extrabold">Dashboard</h1>
        <p className="text-[1.5rem] font-medium">Welcome Back!</p>
      </header>

      <div className={styles.overviewCards}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FaBed />
            <h3>Rooms Overview</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Total Rooms: <strong>{hotel.summary_counts.rooms}</strong>
            </p>
            <p>
              Available:
              <strong>
                {hotel.availability_stats.status_counts.Available}
              </strong>
            </p>
            <p>
              Occupancy Rate:
              <strong>{hotel.occupancy_rate?.toFixed(2)}%</strong>
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FaMoneyBillWave />
            <h3>Pricing</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Avg. Room Price:{" "}
              <strong>${hotel.average_room_price?.toFixed(2)}</strong>
            </p>
            <p>
              Min: <strong>${hotel.pricing_data.min?.toFixed(2)}</strong>
            </p>
            <p>
              Max: <strong>${hotel.pricing_data.max?.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FaStar />
            <h3>Ratings</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Average Rating: <strong>{hotel.average_rating}/5</strong>
            </p>
            <p>
              Total Reviews: <strong>{hotel.review_count}</strong>
            </p>
            <p>
              Star Rating:
              <strong className="gap-2 flex items-center">
                {hotel.star_rating}
                <FaStar style={{ color: "gold" }} />
              </strong>
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FaMapMarkerAlt />
            <h3>Property Info</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Floors: <strong>{hotel.number_floors}</strong>
            </p>
            <p>
              Restaurants: <strong>{hotel.number_restaurants}</strong>
            </p>
            <p>
              Built: <strong>{hotel.year_built}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <h3>Room Status Distribution</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Room Type Availability</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={roomTypeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="available"
                  stackId="a"
                  fill="#4CAF50"
                  name="Available"
                />
                <Bar
                  dataKey="booked"
                  stackId="a"
                  fill="#F44336"
                  name="Booked"
                />
                <Bar
                  dataKey="maintenance"
                  stackId="a"
                  fill="#FFC107"
                  name="Maintenance"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <h3>Pricing Range</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pricingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#8884d8" name="Price ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>Quick Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <FaCalendarAlt className={styles.infoIcon} />
              <div>
                <p>Check-in</p>
                <p>
                  <strong>{hotel.check_in_from}</strong>
                </p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FaRegCalendarCheck className={styles.infoIcon} />
              <div>
                <p>Check-out</p>
                <p>
                  <strong>{hotel.check_out_to}</strong>
                </p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FaUsers className={styles.infoIcon} />
              <div>
                <p>Staff</p>
                <p>
                  <strong>{hotel.summary_counts.staff}</strong>
                </p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FaWifi className={styles.infoIcon} />{" "}
              {/* Generic icon for facilities count */}
              <div>
                <p>Facilities</p>
                <p>
                  <strong>{hotel.facilities?.length || 0}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* --- Top Facilities --- */}
          <h4>Top Facilities</h4>
          <div className={styles.facilities}>
            {facilitiesDetails.slice(0, 6).map((facility) => (
              <span key={facility.id} className={styles.facilityTag}>
                {getFacilityIcon(facility.name)}
                {facility.name}
              </span>
            ))}
            {facilitiesDetails.length === 0 && hotel.facilities?.length > 0 && (
              <p>Loading facilities...</p>
            )}
            {hotel.facilities?.length === 0 && (
              <p>No facilities listed for this hotel.</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h3 className={`font-semibold text-[1.25rem] my-[0.5rem] ml-[0.5rem]`}>
          Room Type Details
        </h3>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Bed Type</th>
                <th>Max Occupancy</th>
                <th>Available</th>
                <th>Under Maintenance</th>
                <th>Booked</th>
                <th>Occupancy (%) </th>
                <th>Avg. Price</th>
              </tr>
            </thead>
            <tbody>
              {hotel.room_type.map((room, index) => (
                <tr key={index}>
                  <td>{room.name}</td>
                  <td>{room.bed_type}</td>
                  <td>{room.max_occupancy}</td>
                  <td>{room.availability.available_rooms}</td>
                  <td>{room.availability.maintenance_rooms}</td>
                  <td>{room.availability.booked_rooms}</td>
                  <td>{room.availability.occupancy_percentage?.toFixed(2)}%</td>
                  <td>${room.pricing.avg_price?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
