// src/app/community/service/dashboard/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/utils/supabase/supaClient";
import { PERMIT_STATUS, STATUS_DISPLAY_NAMES } from "@/components/common/permitStatus";
import LoadingSpinner from "@/components/common/loadingSpinner";
import PermitCard from "@/components/common/dashboard/permitCard";
import { logoutUser } from "@/redux/action/authAction";

// Preload critical fonts for LCP
if (typeof window !== "undefined") {
  const preloadFonts = () => {
    const fonts = [
      "/fonz/MontserratAlternates-Bold.woff",
      "/fonz/RobotoSlab-Bold.woff",
    ];

    fonts.forEach((font) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = font;
      link.as = "font";
      link.type = "font/woff";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", preloadFonts);
  } else {
    preloadFonts();
  }
}

export default function DashboardPage() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const fetchUserPermits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("permits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPermits(data || []);
    } catch (err) {
      console.error("Error fetching permits:", err);
      setError("Failed to load your permits. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

    useEffect(() => {
      if (isAuthenticated && user) {
        fetchUserPermits();
      }
    }, [isAuthenticated, user, fetchUserPermits]);

  const filteredPermits =
    filter === "all"
      ? permits
      : permits.filter((permit) => permit.status === filter);

  const getStatusCounts = () => {
    const counts = {};
    Object.values(PERMIT_STATUS).forEach((status) => {
      counts[status] = permits.filter((p) => p.status === status).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusColor = (status) => {
    const colors = {
      [PERMIT_STATUS.PENDING_PAYMENT]:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-l-amber-400",
      [PERMIT_STATUS.PAYMENT_PROCESSING]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-l-blue-400",
      [PERMIT_STATUS.PAID]:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-l-green-400",
      [PERMIT_STATUS.PAYMENT_FAILED]:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-l-red-400",
      [PERMIT_STATUS.EXPIRED]:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-l-gray-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-montserrat mb-4">
              Access Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-roboto mb-6">
              Please sign in to view your permit dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-montserrat mb-2">
                Permit Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-roboto">
                Manage your permit applications and track their status
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-roboto hidden sm:block">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logoutUser}
                className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm font-medium font-roboto transition-colors duration-200 border border-red-200 dark:border-red-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Status Summary - Critical for LCP */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          role="status"
          aria-label="Permit status summary"
        >
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 ${getStatusColor(
                status
              )} border border-gray-200 dark:border-gray-700`}
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white font-montserrat">
                {count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-roboto capitalize mt-1">
                {STATUS_DISPLAY_NAMES[status] || status.replace("_", " ")}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-roboto transition-colors duration-200 border ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
              }`}
            >
              All ({permits.length})
            </button>
            {Object.entries(statusCounts).map(
              ([status, count]) =>
                count > 0 && (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium font-roboto transition-colors duration-200 border ${
                      filter === status
                        ? getStatusColor(status) + " border-current"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {STATUS_DISPLAY_NAMES[status] || status.replace("_", " ")} (
                    {count})
                  </button>
                )
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-roboto">
              Loading your permits...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="text-red-500 dark:text-red-400 text-6xl mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat mb-2">
              Unable to Load Permits
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-roboto mb-4">
              {error}
            </p>
            <button
              onClick={fetchUserPermits}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium font-roboto transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredPermits.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              📋
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat mb-2">
              {filter === "all"
                ? "No permits yet"
                : `No ${filter.replace("_", " ")} permits`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-roboto max-w-md mx-auto">
              {filter === "all"
                ? "Get started by submitting your first permit application from our services page."
                : `You don't have any permits with ${
                    STATUS_DISPLAY_NAMES[filter] || filter
                  } status.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPermits.map((permit) => (
              <PermitCard
                key={permit.id}
                permit={permit}
                onUpdate={fetchUserPermits}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
