// src/app/AdminDashboard.js

"use client";

import { useEffect, useMemo } from "react";
import { PerformanceMetrics } from "@/components/admin/performanceMetrics";
import { RealTimeChart } from "@/components/admin/realTimeChart";
import { AlertSystem } from "@/components/admin/alertSystem";
import { usePerformanceMetrics } from "@/utils/usePerformanceMetrics";
import { useDashboardData } from "@/utils/useDashboardData";

const AdminDashboard = () => {
  const {
    performanceMetrics,
    lcpData,
    clsData,
    inpData,
    ttfbData,
    isLoading: isPerformanceLoading,
    error: performanceError,
  } = usePerformanceMetrics();

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboardData();

  useEffect(() => {
    if (!isDashboardLoading && !dashboardError && dashboardData) {
      console.log("Dashboard data received:", dashboardData);
      console.log("System Stats:", dashboardData.systemStats);
      console.log("Service Demand:", dashboardData.serviceDemand);
      console.log("Access Patterns:", dashboardData.accessPatterns);
    }
  }, [isDashboardLoading, dashboardError, dashboardData]);

  const isLoading = isPerformanceLoading || isDashboardLoading;
  const error = performanceError || dashboardError;

  const memoizedLcpData = useMemo(() => lcpData, [lcpData]);
  const memoizedClsData = useMemo(() => clsData, [clsData]);
  const memoizedInpData = useMemo(() => inpData, [inpData]);
  const memoizedTtfbData = useMemo(() => ttfbData, [ttfbData]);

  const latestLcp = memoizedLcpData[memoizedLcpData.length - 1]?.value;
  const latestCls = memoizedClsData[memoizedClsData.length - 1]?.value;
  const latestInp = memoizedInpData[memoizedInpData.length - 1]?.value;
  const latestTtfb = memoizedTtfbData[memoizedTtfbData.length - 1]?.value;

  const realTimeMetrics = {
    lcp: latestLcp,
    cls: latestCls,
    inp: latestInp,
    ttfb: latestTtfb,
  };

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

  // Safe data access with fallbacks
  const systemStats = dashboardData?.systemStats || {};
  const serviceDemand = dashboardData?.serviceDemand || {};
  const accessPatterns = dashboardData?.accessPatterns || {};

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-4 sm:p-6">
      {/* Header with mobile padding */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Government Services Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Citizen Engagement Overview
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            {/* Mobile-optimized grid with smaller gaps */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  {systemStats.totalSessions || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Citizen Sessions
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {systemStats.totalPageViews || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Total Interactions
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {systemStats.topPages?.[0]?.count || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Most Popular Service
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {systemStats.topPages?.[0]?.page || "N/A"}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(
                    ((systemStats.browserDistribution?.Chrome || 0) /
                      (systemStats.totalPageViews || 1)) *
                      100
                  ) || 0}
                  %
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Modern Access
                </div>
              </div>
            </div>

            {/* Top Services Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">
                Top Citizen Services
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {systemStats.topPages?.slice(0, 5).map((page, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {page.page?.replace(/\//g, " ").trim() || "Home"}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {page.count} visits
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Mobile optimized */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <button className="p-2 sm:p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Export Report
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Download data
                  </div>
                </button>

                <button className="p-2 sm:p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Service Analysis
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    View metrics
                  </div>
                </button>

                <button className="p-2 sm:p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Compare Periods
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Week-over-week
                  </div>
                </button>

                <button className="p-2 sm:p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Settings
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Configure alerts
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <AlertSystem metrics={realTimeMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Service Performance
          </h2>
          <RealTimeChart
            lcpData={memoizedLcpData}
            clsData={memoizedClsData}
            inpData={memoizedInpData}
            ttfbData={memoizedTtfbData}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Historical Engagement
          </h2>
          <PerformanceMetrics data={performanceMetrics} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
