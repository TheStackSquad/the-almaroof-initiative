// app/admin/performance/page.js

"use client";
import { useState, useEffect } from "react";
import AdminDashboard from "@/components/admin/adminDashboard";
//import RealTimeChart from "@/components/admin/realTimeChart"; // This import is not used
//import AlertSystem from "@/components/admin/alertSystem"; // This import is not used
//import PerformanceMetrics from "@/components/admin/performanceMetrics"; // This import is not used

// Simple admin authentication (replace with your auth system)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123";

// Mock data generator (leave this function in the file)
function generateMockPerformanceData() {
  const pages = ["/about", "/contact", "/services", "/"];
  const metrics = ["LCP", "FID", "CLS", "TTFB"];
  const data = [];

  for (let i = 0; i < 50; i++) {
    data.push({
      timestamp: Date.now() - i * 60000, // Last 50 minutes
      page: pages[Math.floor(Math.random() * pages.length)],
      metric: metrics[Math.floor(Math.random() * metrics.length)],
      value: Math.random() * 3000 + 500,
      userAgent: Math.random() > 0.5 ? "Mobile" : "Desktop",
    });
  }

  return data;
}

export default function AdminPerformancePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      // Replaced alert with a simple message box to avoid a browser alert dialog.
      document.querySelector("#login-message").textContent =
        "Invalid password. Please try again.";
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Access Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter admin password to view performance dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p
                id="login-message"
                className="mt-2 text-center text-sm text-red-500"
              ></p>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard - now this is the only thing rendered when authenticated
  return <AdminDashboard />;
}
