//src/components/admin/adminDashboard.js

"use client";
import { useState, useEffect } from "react";
import { PerformanceMetrics } from "@/components/admin/performanceMetrics";
import { RealTimeChart } from "@/components/admin/realTimeChart";
import { AlertSystem } from "@/components/admin/alertSystem";

const AdminDashboard = () => {
  // Mock data for the historical performance metrics
  const mockHistoricalData = [
    {
      page: "/",
      metric: "LCP",
      value: 2200,
      timestamp: "2023-01-20T10:00:00Z",
      userAgent: "desktop",
    },
    {
      page: "/",
      metric: "FID",
      value: 80,
      timestamp: "2023-01-20T10:05:00Z",
      userAgent: "mobile",
    },
    {
      page: "/about",
      metric: "LCP",
      value: 3100,
      timestamp: "2023-01-20T11:00:00Z",
      userAgent: "desktop",
    },
    {
      page: "/about",
      metric: "FID",
      value: 95,
      timestamp: "2023-01-20T11:05:00Z",
      userAgent: "mobile",
    },
    {
      page: "/",
      metric: "CLS",
      value: 0.05,
      timestamp: "2023-01-20T12:00:00Z",
      userAgent: "desktop",
    },
    {
      page: "/",
      metric: "LCP",
      value: 2350,
      timestamp: "2023-01-20T12:00:00Z",
      userAgent: "desktop",
    },
    {
      page: "/blog",
      metric: "LCP",
      value: 1800,
      timestamp: "2023-01-20T13:00:00Z",
      userAgent: "tablet",
    },
    {
      page: "/blog",
      metric: "TTFB",
      value: 550,
      timestamp: "2023-01-20T13:00:00Z",
      userAgent: "tablet",
    },
  ];

  const [systemInfo, setSystemInfo] = useState({
    uptime: 0,
    memoryUsage: 0,
    activeUsers: 0,
    totalPageViews: 0,
  });

  const [data, setData] = useState(mockHistoricalData);
  const [realTimeMetrics, setRealTimeMetrics] = useState({});

  useEffect(() => {
    const updateSystemInfo = () => {
      setSystemInfo({
        uptime: Math.floor(Date.now() / 1000) % 86400,
        memoryUsage: Math.random() * 100,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        totalPageViews: Math.floor(Math.random() * 1000) + 5000,
      });
    };

    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateRealTimeMetrics = () => {
      setRealTimeMetrics({
        lcp: Math.random() * 4000 + 1000,
        fid: Math.random() * 200 + 50,
        cls: Math.random() * 0.2,
        ttfb: Math.random() * 800 + 300,
        timestamp: Date.now(),
      });
    };
    const interval = setInterval(updateRealTimeMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Overview
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatUptime(systemInfo.uptime)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  System Uptime
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(systemInfo.memoryUsage)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Memory Usage
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {systemInfo.activeUsers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Users
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {systemInfo.totalPageViews.toLocaleString()}
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
                {[
                  {
                    time: "2 mins ago",
                    event: "High LCP detected on /about page",
                    severity: "warning",
                  },
                  {
                    time: "5 mins ago",
                    event: "Performance budget exceeded for JS bundle",
                    severity: "error",
                  },
                  {
                    time: "8 mins ago",
                    event: "Core Web Vitals improved across all pages",
                    severity: "success",
                  },
                  {
                    time: "12 mins ago",
                    event: "New performance baseline established",
                    severity: "info",
                  },
                ].map((event, index) => (
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

        <AlertSystem metrics={realTimeMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Metrics</h2>
          <RealTimeChart metrics={realTimeMetrics} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
          <PerformanceMetrics data={data} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
