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

const Dashboard = () => {
  const hotel = useHotelContext();
  console.log(`- - - Hotel Context`);
  console.log(hotel);

  const hotelData = {
    name: "Grand Paradise Resort",
    star_rating: 5,
    address: "123 Ocean View Drive, Miami, FL",
    average_rating: "4.8",
    review_count: 1245,
    occupancy_rate: 78,
    average_room_price: 249,
    number_rooms: 120,
    number_floors: 12,
    number_restaurants: 3,
    number_bars: 2,
    number_parks: 1,
    number_halls: 4,
    is_superhost: true,
    is_eco_certified: true,
    year_built: 2015,
    check_in_from: "3:00 PM",
    check_out_to: "11:00 AM",
    facilities: [
      "Free WiFi",
      "Swimming Pool",
      "Spa",
      "Fitness Center",
      "Restaurant",
      "Parking",
    ],
    room_types: [
      {
        name: "Deluxe Room",
        max_occupancy: 2,
        bed_type: "King",
        availability: {
          available_rooms: 25,
          booked_rooms: 15,
          maintenance_rooms: 2,
          total_rooms: 42,
          occupancy_percentage: 65,
        },
        pricing: {
          min_price: 199,
          max_price: 299,
          avg_price: 249,
        },
      },
      {
        name: "Executive Suite",
        max_occupancy: 4,
        bed_type: "King + Sofa Bed",
        availability: {
          available_rooms: 8,
          booked_rooms: 12,
          maintenance_rooms: 1,
          total_rooms: 21,
          occupancy_percentage: 75,
        },
        pricing: {
          min_price: 349,
          max_price: 499,
          avg_price: 399,
        },
      },
      {
        name: "Presidential Suite",
        max_occupancy: 6,
        bed_type: "2 Kings",
        availability: {
          available_rooms: 2,
          booked_rooms: 3,
          maintenance_rooms: 0,
          total_rooms: 5,
          occupancy_percentage: 80,
        },
        pricing: {
          min_price: 799,
          max_price: 999,
          avg_price: 849,
        },
      },
    ],
    availability_stats: {
      occupancy_rate: 78,
      last_updated: "2023-06-15T10:30:00Z",
    },
    pricing_data: {
      min: 199,
      max: 999,
      avg: 349,
      currency: "USD",
      has_promotions: true,
    },
    summary_counts: {
      rooms: 120,
      images: 45,
      reviews: 1245,
      staff: 85,
      event_spaces: 4,
      promotions: 3,
      available_rooms: 65,
      maintenance_requests: 5,
    },
  };

  // Data for charts
  const roomStatusData = [
    {
      name: "Available",
      value: hotelData.summary_counts.available_rooms,
      color: "#4CAF50",
    },
    {
      name: "Booked",
      value:
        hotelData.summary_counts.rooms -
        hotelData.summary_counts.available_rooms,
      color: "#F44336",
    },
    {
      name: "Maintenance",
      value: hotelData.summary_counts.maintenance_requests,
      color: "#FFC107",
    },
  ];

  const roomTypeData = hotelData.room_types.map((room) => ({
    name: room.name,
    available: room.availability.available_rooms,
    booked: room.availability.booked_rooms,
    maintenance: room.availability.maintenance_rooms,
  }));

  const pricingData = [
    { name: "Min", price: hotelData.pricing_data.min },
    { name: "Avg", price: hotelData.pricing_data.avg },
    { name: "Max", price: hotelData.pricing_data.max },
  ];

  const difference = (a: number, b: number) => {
    return a - b;
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
              Total Rooms:{" "}
              <strong>
                {hotel.availability_stats.status_counts.Available}
              </strong>
            </p>
            <p>
              Available:
              <strong>
                {difference(
                  hotel.availability_stats.status_counts.Available ?? 0,
                  hotel.availability_stats.status_counts.Booked ?? 0
                )}
              </strong>
            </p>
            <p>
              Occupancy Rate:
              <strong>{hotel.availability_stats.occupancy_rate}</strong>
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
              Avg. Room Price: <strong>${hotel.average_room_price}</strong>
            </p>
            <p>
              Min: <strong>${hotelData.pricing_data.min}</strong>
            </p>
            <p>
              Max: <strong>${hotelData.pricing_data.max}</strong>
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
              Average Rating: <strong>{hotel.star_rating}/5</strong>
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
              <FaWifi className={styles.infoIcon} />
              <div>
                <p>Facilities</p>
                <p>
                  <strong>{hotel.facilities.length}</strong>
                </p>
              </div>
            </div>
          </div>

          <h4>Top Facilities</h4>
          <div className={styles.facilities}>
            {hotelData.facilities.slice(0, 6).map((facility, index) => (
              <span key={index} className={styles.facilityTag}>
                {facility === "Free WiFi" && <FaWifi />}
                {facility === "Swimming Pool" && <FaSwimmingPool />}
                {facility === "Restaurant" && <FaUtensils />}
                {facility === "Parking" && <FaParking />}
                {facility}
              </span>
            ))}
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
                  <td>{room.availability.occupancy_percentage}%</td>
                  <td>${room.pricing.avg_price}</td>
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
