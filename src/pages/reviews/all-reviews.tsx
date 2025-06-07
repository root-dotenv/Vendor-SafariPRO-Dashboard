import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Star,
  Quote,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Clock,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Review {
  id: string;
  title: string;
  comment: string;
  full_name: string;
  user_profile: string;
  is_approved: boolean;
  moderation_status: "approved" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
  rating: number | null;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
}

const API_BASE_URL = "https://feedback.tradesync.software/api/v1/reviews";

// --- HELPER & CHILD COMPONENTS ---

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  color: string;
}> = ({ icon, title, value, subtitle, trend, color }) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow border border-gray-100 hover:shadow transition-all duration-300 group cursor-pointer hover:-translate-y-0.5`}
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="relative bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col gap-4 transition-all duration-500 hover:shadow hover:-translate-y-0.5 group overflow-hidden">
    {/* Gradient accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {review.full_name}
        </h4>
        <p className="text-sm text-gray-500 font-medium">
          {review.user_profile}
        </p>
      </div>
      {review.rating && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating!
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
      )}
    </div>

    <div className="flex-1">
      <div className="flex items-start gap-3 mb-3">
        <Quote className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0 group-hover:text-purple-600 transition-colors" />
        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-gray-800 transition-colors">
          {review.title}
        </h3>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors line-clamp-4">
        {review.comment}
      </p>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-400">
      <span className="font-mono bg-gray-50 px-2 py-1 rounded">
        {review.moderation_status}
      </span>
      <div className="flex items-center gap-2 font-medium">
        <Calendar className="w-3 h-3" />
        {formatDate(review.updated_at)}
      </div>
    </div>
  </div>
);

const FilterTabs: React.FC<{
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All Reviews", icon: MessageCircle },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "top-rated", label: "Top Rated", icon: Star },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
            activeFilter === id
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchReviews = async (pageNum: number): Promise<ApiResponse> => {
    const response = await axios.get(`${API_BASE_URL}?page=${pageNum}`);
    return response.data;
  };

  const {
    data: reviews,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["reviews", page],
    queryFn: () => fetchReviews(page),
    keepPreviousData: true,
  });

  console.log(`Debugging All Reviews:`);
  console.log(`All Reviews:`, reviews);

  // Calculate stats from actual reviews
  const totalReviews = reviews?.count || 0;
  const currentReviews = reviews?.results?.length || 0;
  const avgRating = reviews?.results?.length
    ? reviews.results.reduce((acc, review) => acc + (review.rating || 0), 0) /
      reviews.results.length
    : 0;
  const recentReviews =
    reviews?.results?.filter(
      (review) =>
        new Date(review.created_at) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-200 border-b-blue-600 mx-auto animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">
            Loading Reviews...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 text-red-700 p-8 rounded-2xl shadow max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-center">
            Error Fetching Reviews
          </h3>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
            {error?.message || "An unknown error occurred."}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-3 h-12 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Customer Reviews
                </h1>
                <p className="text-gray-600 mt-1">
                  Real feedback from our valued customers
                </p>
              </div>
            </div>
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Interactive Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Total Reviews"
            value={totalReviews.toLocaleString()}
            subtitle="All time feedback"
            color="from-blue-500 to-blue-600"
            trend="+12%"
          />
          <StatCard
            icon={<Star className="w-6 h-6" />}
            title="Average Rating"
            value={avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
            subtitle="Out of 5 stars"
            color="from-yellow-500 to-orange-500"
            trend="+0.2"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="This Week"
            value={recentReviews}
            subtitle="New reviews"
            color="from-green-500 to-emerald-600"
            trend="+8%"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Response Rate"
            value="98%"
            subtitle="Customer satisfaction"
            color="from-purple-500 to-purple-600"
            trend="+5%"
          />
        </div>

        {/* Reviews Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Reviews
              <span className="ml-3 text-sm font-normal text-gray-500">
                Showing {currentReviews} of {totalReviews} reviews
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reviews?.results.map((review, index) => (
              <div
                key={review.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={!reviews?.previous}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 hover:shadow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            Previous
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Page</span>
            <span className="font-bold text-xl text-gray-900 bg-white px-4 py-2 rounded-lg shadow border">
              {page}
            </span>
            <span className="text-sm text-gray-500">
              of {Math.ceil(totalReviews / (currentReviews || 1))}
            </span>
          </div>

          <button
            onClick={() => setPage((old) => (reviews?.next ? old + 1 : old))}
            disabled={!reviews?.next || isFetching}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 hover:shadow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 group"
          >
            Next
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
