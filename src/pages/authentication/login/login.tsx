import React, { useState } from "react";
import { useAuth } from "../../../contexts/authcontext";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaSpinner,
  FaExclamationTriangle,
  FaEye, // <-- Import new icon
  FaEyeSlash, // <-- Import new icon
} from "react-icons/fa";
import { useHotelContext } from "../../../contexts/hotelContext";

// Replace this with a high-quality image of your hotel or a professional stock photo
const loginBgImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // --- New state for password visibility ---
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  const hotel = useHotelContext();
  console.log(hotel);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Image */}
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBgImage})` }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-violet-700 to-blue-500 bg-opacity-20"></div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full flex items-center justify-center p-8 sm:p-12 bg-slate-100">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 tracking-tight">
              Login{" "}
            </h1>
            <p className="text-slate-500 mt-4 text-base">
              Login to the {hotel.name}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3"
                role="alert"
              >
                <FaExclamationTriangle className="h-5 w-5" />
                <div>
                  <p className="font-bold">Login Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Username Input */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* --- Updated Password Input with Toggle Button --- */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                // --- Type is now dynamic based on state ---
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading}
                // --- Increased right-padding to make space for the icon ---
                className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {/* --- The Show/Hide Toggle Button --- */}
              <button
                type="button" // Important to prevent form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Confirmation Footer */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-sm">
              <h4 className="text-md font-semibold text-blue-900 mb-2">
                Login Details
              </h4>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">Username:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {username || "..."}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">Password:</span>
                <span className="text-slate-500">
                  {password ? "•".repeat(password.length) : "..."}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-3" />
                  Logging in...
                </>
              ) : (
                "Login Securely"
              )}
            </button>
          </form>

          <footer className="text-center mt-10">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} {hotel.name}. All Rights Reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
