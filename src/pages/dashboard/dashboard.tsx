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
  <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow border border-white/20 transition-all duration-500 hover:shadow hover:scale-[1.02] hover:bg-white/90 overflow-hidden">
    {/* Animated gradient border */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
        {title}
      </h3>
    </div>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const ChartWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow border border-white/30 h-full hover:shadow transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
        {title}
      </h3>
    </div>
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

  console.log(`- - - Global Hotel Objct: `);
  console.log(hotel);

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

  // --- CHART COLORS & DATA ---
  const COLORS = {
    green: "#10b981",
    red: "#ef4444",
    amber: "#f59e0b",
    blue: "#3b82f6",
    purple: "#8b5cf6",
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
    if (name.includes("gym"))
      return <FaDumbbell className={`${iconClass} text-red-500`} />;
    if (name.includes("spa"))
      return <FaSpa className={`${iconClass} text-pink-500`} />;
    if (name.includes("concierge"))
      return <FaConciergeBell className={`${iconClass} text-purple-500`} />;
    if (name.includes("coffee"))
      return <FaCoffee className={`${iconClass} text-amber-700`} />;
    return <FaStar className={`${iconClass} text-gray-400`} />;
  };

  // --- New helper function for occupancy bar color ---
  const getOccupancyColor = (percentage) => {
    if (percentage > 85) return "bg-gradient-to-r from-red-500 to-red-600";
    if (percentage > 60) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-emerald-500 to-green-500";
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
        className="font-bold text-sm drop-shadow"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="flex items-center gap-4 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30"></div>
            <div className="relative w-3 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-xl"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-[#3B82F6] bg-clip-text text-transparent">
              Hotel Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-2 font-medium">
              Real-time insights and performance metrics
            </p>
          </div>
        </header>

        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <DashboardStatCard
            icon={<FaBed className="text-blue-600 w-6 h-6" />}
            title="Rooms Overview"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50">
                <span className="text-slate-600">Total Rooms</span>
                <span className="font-bold text-slate-800 text-lg">
                  {hotel.summary_counts?.rooms || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50">
                <span className="text-slate-600">Available</span>
                <span className="font-bold text-emerald-600 text-lg">
                  {hotel.availability_stats?.status_counts?.Available || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/50">
                <span className="text-slate-600">Occupancy</span>
                <span className="font-bold text-blue-600 text-lg">
                  {hotel.occupancy_rate?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </DashboardStatCard>

          <DashboardStatCard
            icon={<FaMoneyBillWave className="text-emerald-600 w-6 h-6" />}
            title="Revenue & Pricing"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50">
                <span className="text-slate-600">Avg. Room Price</span>
                <span className="font-bold text-slate-800 text-lg">
                  ${hotel.average_room_price?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-green-50/50">
                <span className="text-slate-600">Min Price</span>
                <span className="font-bold text-green-600 text-lg">
                  ${hotel.pricing_data?.min?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50/50">
                <span className="text-slate-600">Max Price</span>
                <span className="font-bold text-purple-600 text-lg">
                  ${hotel.pricing_data?.max?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </DashboardStatCard>

          <DashboardStatCard
            icon={<FaStar className="text-amber-500 w-6 h-6" />}
            title="Ratings & Reviews"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50">
                <span className="text-slate-600">Avg. Rating</span>
                <span className="font-bold text-slate-800 text-lg">
                  {hotel.average_rating || 0}/5
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/50">
                <span className="text-slate-600">Total Reviews</span>
                <span className="font-bold text-blue-600 text-lg">
                  {hotel.review_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50/50">
                <span className="text-slate-600">Hotel Stars</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-600 text-lg">
                    {hotel.star_rating}
                  </span>
                  <FaStar className="text-amber-500 w-4 h-4" />
                </div>
              </div>
            </div>
          </DashboardStatCard>

          <DashboardStatCard
            icon={<FaMapMarkerAlt className="text-purple-600 w-6 h-6" />}
            title="Property Info"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50">
                <span className="text-slate-600">Floors</span>
                <span className="font-bold text-slate-800 text-lg">
                  {hotel.number_floors || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-orange-50/50">
                <span className="text-slate-600">Restaurants</span>
                <span className="font-bold text-orange-600 text-lg">
                  {hotel.number_restaurants || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-indigo-50/50">
                <span className="text-slate-600">Year Built</span>
                <span className="font-bold text-indigo-600 text-lg">
                  {hotel.year_built || "N/A"}
                </span>
              </div>
            </div>
          </DashboardStatCard>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <ChartWrapper title="Room Status Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter
                      id="shadow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="4"
                        stdDeviation="3"
                        floodOpacity="0.3"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={roomStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={70}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    filter="url(#shadow)"
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
          <div className="lg:col-span-3">
            <ChartWrapper title="Room Type Availability Analysis">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roomTypeData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="availableGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#059669"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                    <linearGradient id="bookedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#dc2626"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                    <linearGradient
                      id="maintenanceGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#d97706"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="available"
                    stackId="a"
                    fill="url(#availableGrad)"
                    name="Available"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="booked"
                    stackId="a"
                    fill="url(#bookedGrad)"
                    name="Booked"
                  />
                  <Bar
                    dataKey="maintenance"
                    stackId="a"
                    fill="url(#maintenanceGrad)"
                    name="Maintenance"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Enhanced Second Chart and Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartWrapper title="Pricing Strategy Overview">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pricingData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Price"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                />
                <Bar
                  dataKey="price"
                  fill="url(#priceGradient)"
                  name="Price ($)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow border border-white/30 hover:shadow transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Premium Facilities
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {facilitiesDetails.slice(0, 8).map((facility) => (
                <div
                  key={facility.id}
                  className="group flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100/50 backdrop-blur-sm hover:from-blue-50 hover:to-purple-50 text-slate-700 font-medium px-4 py-3 rounded-xl text-sm transition-all duration-300 hover:scale-105 hover:shadow border border-white/20"
                >
                  <div className="group-hover:scale-110 transition-transform duration-200">
                    {getFacilityIcon(facility.name)}
                  </div>
                  <span className="truncate">{facility.name}</span>
                </div>
              ))}
              {facilitiesDetails.length === 0 &&
                hotel.facilities?.length > 0 && (
                  <div className="col-span-2 text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-500">
                      Loading facilities...
                    </p>
                  </div>
                )}
              {!hotel.facilities?.length && (
                <div className="col-span-2 text-center py-8">
                  <p className="text-sm text-slate-500">
                    No facilities available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaBed className="text-white/90" />
              Room Type Analytics
            </h3>
            <p className="text-blue-100 mt-2">
              Detailed performance metrics by room category
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-6 text-left font-bold text-slate-700 tracking-wider">
                    Room Category
                  </th>
                  <th className="px-8 py-6 text-left font-bold text-slate-700 tracking-wider">
                    Configuration
                  </th>
                  <th className="px-8 py-6 text-center font-bold text-slate-700 tracking-wider">
                    Availability Status
                  </th>
                  <th className="px-8 py-6 text-left font-bold text-slate-700 tracking-wider">
                    Occupancy Rate
                  </th>
                  <th className="px-8 py-6 text-right font-bold text-slate-700 tracking-wider">
                    Average Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotel.room_type?.map((room, index) => {
                  const occupancy =
                    room.availability?.occupancy_percentage || 0;
                  const occupancyColor = getOccupancyColor(occupancy);

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 transition-all duration-200 group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 group-hover:scale-110 transition-transform duration-200">
                            <FaBed className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-lg">
                              {room.name}
                            </div>
                            <div className="text-slate-500 text-sm">
                              Premium Category
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-700">
                            {room.bed_type}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1">
                            <span>Max Occupancy:</span>
                            <span className="font-semibold text-blue-600">
                              {room.max_occupancy}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">
                              {room.availability?.available_rooms}
                            </div>
                            <div className="text-xs text-slate-500">
                              Available
                            </div>
                          </div>
                          <div className="w-px h-8 bg-slate-200"></div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">
                              {room.availability?.booked_rooms}
                            </div>
                            <div className="text-xs text-slate-500">Booked</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              Progress
                            </span>
                            <span className="font-bold text-slate-800">
                              {occupancy.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`${occupancyColor} h-3 rounded-full transition-all duration-1000 ease-out shadow`}
                              style={{ width: `${occupancy}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${room.pricing?.avg_price?.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500">per night</div>
                      </td>
                    </tr>
                  );
                })}
                {(!hotel.room_type || hotel.room_type.length === 0) && (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                          <FaBed className="text-slate-400 w-8 h-8" />
                        </div>
                        <div className="text-slate-500 text-lg font-medium">
                          No room data available
                        </div>
                        <div className="text-slate-400 text-sm">
                          Room type information will appear here when available
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
