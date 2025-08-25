// src/app/AdminDashboard.js

"use client";

import { useState, useEffect } from "react";
// Assumed to be available components. Their internal logic doesn't need to change.
import { PerformanceMetrics } from "@/components/admin/performanceMetrics";
import { RealTimeChart } from "@/components/admin/realTimeChart";
import { AlertSystem } from "@/components/admin/alertSystem";

// Import the new custom hook to handle all data fetching logic
import { usePerformanceMetrics } from "@/utils/usePerformanceMetrics";
// Import the new hook for dashboard-specific data
import { useDashboardData } from "@/utils/useDashboardData";

/**
 * A helper function to convert minutes to a formatted "0h 0m" string.
 * @param {number} totalMinutes The total number of minutes.
 * @returns {string} The formatted string.
 */
const formatUptime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return `${hours}h ${minutes}m`;
};

const AdminDashboard = () => {
  // Use the custom hook to get all the performance metrics data
  const {
    performanceMetrics,
    lcpData,
    clsData,
    inpData,
    ttfbData,
    isLoading: isPerformanceLoading,
    error: performanceError,
  } = usePerformanceMetrics();

  // Use the new custom hook to get the system and event data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboardData();

  // Combine the loading and error states for a unified display
  const isLoading = isPerformanceLoading || isDashboardLoading;
  const error = performanceError || dashboardError;

  // Create a single metrics object with the latest values to pass to AlertSystem.
  // Note: FID data is no longer collected, so we will remove it.
  const latestLcp = lcpData[lcpData.length - 1]?.value;
  const latestCls = clsData[clsData.length - 1]?.value;
  const latestInp = inpData[inpData.length - 1]?.value;
  const latestTtfb = ttfbData[ttfbData.length - 1]?.value;

  const realTimeMetrics = {
    lcp: latestLcp,
    cls: latestCls,
    inp: latestInp,
    ttfb: latestTtfb,
  };

  // Conditional rendering for loading and error states
  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-6 flex items-center justify-center">
        <div className="text-xl font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-6 flex items-center justify-center">
        <div className="text-xl font-medium text-red-500">Error: {error}</div>
      </div>
    );
  }

  // The main rendering logic
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* We are now using dynamic data from the useDashboardData hook */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Overview
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatUptime(dashboardData.systemStats.uptimeMinutes)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  System Uptime
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {(dashboardData.systemStats.memoryUsage * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Memory Usage
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {dashboardData.activeUsers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Users
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  0
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Page Views
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Performance Events
              </h3>

              <div className="space-y-3">
                {/* Now mapping over the data from the hook */}
                {dashboardData.performanceEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        event.severity === "error"
                          ? "bg-red-500"
                          : event.severity === "warning"
                          ? "bg-yellow-500"
                          : event.severity === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {event.event}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Clear Cache
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Reset performance data
                  </div>
                </button>

                <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Export Data
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Download CSV report
                  </div>
                </button>

                <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Run Audit
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Manual performance check
                  </div>
                </button>

                <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Settings
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Configure thresholds
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Pass a single `metrics` object to the AlertSystem */}
        <AlertSystem metrics={realTimeMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Metrics</h2>
          <RealTimeChart
            lcpData={lcpData}
            clsData={clsData}
            inpData={inpData}
            ttfbData={ttfbData}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
          {/* Pass the full performanceMetrics array to the historical component */}
          <PerformanceMetrics data={performanceMetrics} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
