import React, { useEffect, useState } from "react";

import {
  FaBed,
  FaMoneyBillWave,
  FaStar,
  FaMapMarkerAlt,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaDumbbell,
  FaSpa,
  FaConciergeBell,
  FaCoffee,
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

// --- TYPES ---

interface FacilityDetail {
  id: string;

  name: string;

  code: string;

  description: string;

  icon: string | null;
}

// --- HELPER COMPONENTS ---

const DashboardStatCard: React.FC<{
  icon: React.ReactNode;

  title: string;

  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-blue-100 p-3 rounded-full">{icon}</div>

      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
    </div>

    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const ChartWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,

  children,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

    <div className="h-80">{children}</div>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
  const hotel = useHotelContext();

  const [facilitiesDetails, setFacilitiesDetails] = useState<FacilityDetail[]>(
    []
  );

  const API_BASE_URL = "https://hotel.tradesync.software/api/v1";

  useEffect(() => {
    const fetchFacilities = async () => {
      if (hotel && hotel.facilities?.length > 0) {
        try {
          const promises = hotel.facilities.map((id) =>
            fetch(`${API_BASE_URL}/facilities/${id}`).then((res) => {
              if (!res.ok) throw new Error(`Facility fetch failed for ${id}`);

              return res.json();
            })
          );

          const results = await Promise.all(promises);

          setFacilitiesDetails(results);
        } catch (error) {
          console.error("Failed to fetch facilities:", error);

          setFacilitiesDetails([]);
        }
      } else {
        setFacilitiesDetails([]);
      }
    };

    fetchFacilities();
  }, [hotel]);

  // --- ENHANCED CHART COLORS & DATA ---

  const COLORS = {
    green: "#22c55e", // emerald-500

    red: "#ef4444", // red-500

    amber: "#f59e0b", // amber-500

    blue: "#3b82f6", // blue-500

    purple: "#8b5cf6", // purple-500
  };

  const roomStatusData = [
    {
      name: "Available",

      value: hotel.availability_stats?.status_counts?.Available || 0,

      color: COLORS.green,
    },

    {
      name: "Booked",

      value: hotel.availability_stats?.status_counts?.Booked || 0,

      color: COLORS.red,
    },

    {
      name: "Maintenance",

      value: hotel.availability_stats?.status_counts?.Maintenance || 0,

      color: COLORS.amber,
    },
  ];

  const roomTypeData =
    hotel.room_type?.map((room) => ({
      name: room.name,

      available: room.availability?.available_rooms || 0,

      booked: room.availability?.booked_rooms || 0,

      maintenance: room.availability?.maintenance_rooms || 0,
    })) || [];

  const pricingData = [
    { name: "Min Price", price: hotel.pricing_data?.min || 0 },

    { name: "Avg Price", price: hotel.pricing_data?.avg || 0 },

    { name: "Max Price", price: hotel.pricing_data?.max || 0 },
  ];

  // Helper to render themed icons for facilities

  const getFacilityIcon = (facilityName: string) => {
    const name = facilityName.toLowerCase();

    const iconClass = "w-5 h-5";

    if (name.includes("wifi"))
      return <FaWifi className={`${iconClass} text-blue-500`} />;

    if (name.includes("pool"))
      return <FaSwimmingPool className={`${iconClass} text-cyan-500`} />;

    if (name.includes("restaurant"))
      return <FaUtensils className={`${iconClass} text-orange-500`} />;

    if (name.includes("parking"))
      return <FaParking className={`${iconClass} text-slate-600`} />;

    if (name.includes("gym") || name.includes("fitness"))
      return <FaDumbbell className={`${iconClass} text-red-500`} />;

    if (name.includes("spa"))
      return <FaSpa className={`${iconClass} text-pink-500`} />;

    if (name.includes("service") || name.includes("concierge"))
      return <FaConciergeBell className={`${iconClass} text-purple-500`} />;

    if (name.includes("coffee") || name.includes("breakfast"))
      return <FaCoffee className={`${iconClass} text-amber-700`} />;

    return <FaStar className={`${iconClass} text-gray-400`} />;
  };

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,

    cy,

    midAngle,

    innerRadius,

    outerRadius,

    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);

    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <header className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Hotel Dashboard
        </h1>
      </header>

      {/* Overview Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatCard
          icon={<FaBed className="text-blue-500" />}
          title="Rooms Overview"
        >
          <p className="flex justify-between">
            Total Rooms:{" "}
            <strong className="text-gray-800">
              {hotel.summary_counts?.rooms || 0}
            </strong>
          </p>

          <p className="flex justify-between">
            Available:{" "}
            <strong className="text-emerald-600">
              {hotel.availability_stats?.status_counts?.Available || 0}
            </strong>
          </p>

          <p className="flex justify-between">
            Occupancy:{" "}
            <strong className="text-blue-600">
              {hotel.occupancy_rate?.toFixed(1) || 0}%
            </strong>
          </p>
        </DashboardStatCard>

        <DashboardStatCard
          icon={<FaMoneyBillWave className="text-emerald-500" />}
          title="Revenue & Pricing"
        >
          <p className="flex justify-between">
            Avg. Room Price:{" "}
            <strong className="text-gray-800">
              ${hotel.average_room_price?.toFixed(2) || "0.00"}
            </strong>
          </p>

          <p className="flex justify-between">
            Min Price:{" "}
            <strong className="text-gray-800">
              ${hotel.pricing_data?.min?.toFixed(2) || "0.00"}
            </strong>
          </p>

          <p className="flex justify-between">
            Max Price:{" "}
            <strong className="text-gray-800">
              ${hotel.pricing_data?.max?.toFixed(2) || "0.00"}
            </strong>
          </p>
        </DashboardStatCard>

        <DashboardStatCard
          icon={<FaStar className="text-amber-500" />}
          title="Ratings & Reviews"
        >
          <p className="flex justify-between">
            Avg. Rating:{" "}
            <strong className="text-gray-800">
              {hotel.average_rating || 0}/5
            </strong>
          </p>

          <p className="flex justify-between">
            Total Reviews:{" "}
            <strong className="text-gray-800">{hotel.review_count || 0}</strong>
          </p>

          <p className="flex justify-between items-center">
            Hotel Stars:{" "}
            <strong className="flex items-center gap-1 text-amber-500">
              {hotel.star_rating} <FaStar />
            </strong>
          </p>
        </DashboardStatCard>

        <DashboardStatCard
          icon={<FaMapMarkerAlt className="text-purple-500" />}
          title="Property Info"
        >
          <p className="flex justify-between">
            Floors:{" "}
            <strong className="text-gray-800">
              {hotel.number_floors || 0}
            </strong>
          </p>

          <p className="flex justify-between">
            Restaurants:{" "}
            <strong className="text-gray-800">
              {hotel.number_restaurants || 0}
            </strong>
          </p>

          <p className="flex justify-between">
            Year Built:{" "}
            <strong className="text-gray-800">
              {hotel.year_built || "N/A"}
            </strong>
          </p>
        </DashboardStatCard>
      </div>

      {/* Charts Row */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartWrapper title="Room Status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",

                    backdropFilter: "blur(5px)",

                    borderRadius: "12px",

                    borderColor: "#e5e7eb",
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        <div className="lg:col-span-3">
          <ChartWrapper title="Room Type Availability">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roomTypeData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                <YAxis />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",

                    backdropFilter: "blur(5px)",

                    borderRadius: "12px",

                    borderColor: "#e5e7eb",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="available"
                  stackId="a"
                  fill={COLORS.green}
                  name="Available"
                />

                <Bar
                  dataKey="booked"
                  stackId="a"
                  fill={COLORS.red}
                  name="Booked"
                />

                <Bar
                  dataKey="maintenance"
                  stackId="a"
                  fill={COLORS.amber}
                  name="Maintenance"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>

      {/* Second Chart and Info Row */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartWrapper title="Pricing Range">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pricingData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8} />

                  <stop
                    offset="95%"
                    stopColor={COLORS.purple}
                    stopOpacity={0.9}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="name" />

              <YAxis tickFormatter={(value) => `$${value}`} />

              <Tooltip
                formatter={(value) => `$${value}`}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",

                  backdropFilter: "blur(5px)",

                  borderRadius: "12px",

                  borderColor: "#e5e7eb",
                }}
              />

              <Bar dataKey="price" fill="url(#colorPrice)" name="Price ($)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Top Facilities
          </h3>

          <div className="flex flex-wrap gap-3">
            {facilitiesDetails.slice(0, 8).map((facility) => (
              <span
                key={facility.id}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 font-medium px-3 py-2 rounded-full text-sm transition-transform hover:scale-105"
              >
                {getFacilityIcon(facility.name)}

                {facility.name}
              </span>
            ))}

            {facilitiesDetails.length === 0 && hotel.facilities?.length > 0 && (
              <p className="text-sm text-slate-500">Loading facilities...</p>
            )}

            {!hotel.facilities?.length && (
              <p className="text-sm text-slate-500">No facilities listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Room Details Table */}

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Room Type Details
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">
                  Room Type
                </th>

                <th scope="col" className="px-6 py-3">
                  Bed Type
                </th>

                <th scope="col" className="px-6 py-3 text-center">
                  Max Occupancy
                </th>

                <th scope="col" className="px-6 py-3 text-center">
                  Available
                </th>

                <th scope="col" className="px-6 py-3 text-center">
                  Booked
                </th>

                <th scope="col" className="px-6 py-3 text-center">
                  Occupancy %
                </th>

                <th scope="col" className="px-6 py-3 rounded-r-lg">
                  Avg. Price
                </th>
              </tr>
            </thead>

            <tbody>
              {hotel.room_type?.map((room, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-blue-50 transition-colors"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap"
                  >
                    {room.name}
                  </th>

                  <td className="px-6 py-4">{room.bed_type}</td>

                  <td className="px-6 py-4 text-center">
                    {room.max_occupancy}
                  </td>

                  <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                    {room.availability?.available_rooms}
                  </td>

                  <td className="px-6 py-4 text-center font-semibold text-red-600">
                    {room.availability?.booked_rooms}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {room.availability?.occupancy_percentage?.toFixed(1)}%
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-blue-600">
                    ${room.pricing?.avg_price?.toFixed(2)}
                  </td>
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
