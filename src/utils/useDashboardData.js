// src/utils/useDashboardData.js

import { useState, useEffect } from "react";

/**
 * A custom React hook to fetch all dashboard-specific data.
 * Now fetches system stats, service demand analytics, and access patterns.
 * @returns {object} An object containing the data, loading state, and any errors.
 */
export const useDashboardData = () => {
  // State to hold all the fetched data
  const [data, setData] = useState({
    systemStats: {
      uptimeMinutes: 0,
      memoryUsage: 0,
      totalSessions: 0,
      totalPageViews: 0,
      topPages: [],
      browserDistribution: {},
    },
    serviceDemand: {
      totalCitizensEngaged: 0,
      totalServiceInteractions: 0,
      serviceCategoryDemand: {},
      uniqueCitizensByService: {},
      topServices: [],
      avgInteractionsPerCitizen: 0,
    },
    accessPatterns: {
      hourlyAccess: {},
      browserUsage: {},
      deviceTypes: {},
      peakUsageTimes: [],
      weeklyPatterns: {},
      serviceAccessTrends: {},
      digitalInclusion: {},
      totalDataPoints: 0,
    },
  });

  // State to track loading status and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all three API routes concurrently
        const [
          systemStatsResponse,
          serviceDemandResponse,
          accessPatternsResponse,
        ] = await Promise.all([
          fetch("/api/admin/system-stats"),
          fetch("/api/admin/service-demand"),
          fetch("/api/admin/access-patterns"),
        ]);

        // Handle each response independently
        let systemStats = { uptimeMinutes: 0, memoryUsage: 0 };
        let serviceDemand = {
          totalCitizensEngaged: 0,
          totalServiceInteractions: 0,
          serviceCategoryDemand: {},
          topServices: [],
        };
        let accessPatterns = {
          hourlyAccess: {},
          browserUsage: {},
          deviceTypes: {},
          peakUsageTimes: [],
          weeklyPatterns: {},
          serviceAccessTrends: {},
          digitalInclusion: { score: 0 },
        };

        // Process system stats
        if (systemStatsResponse.ok) {
          systemStats = await systemStatsResponse.json();
        } else {
          console.warn("System stats API failed:", systemStatsResponse.status);
        }

        // Process service demand
        if (serviceDemandResponse.ok) {
          serviceDemand = await serviceDemandResponse.json();
        } else {
          console.warn(
            "Service demand API failed:",
            serviceDemandResponse.status
          );
        }

        // Process access patterns
        if (accessPatternsResponse.ok) {
          accessPatterns = await accessPatternsResponse.json();
        } else {
          console.warn(
            "Access patterns API failed:",
            accessPatternsResponse.status
          );
        }

        // Update the state with the new data
        setData({
          systemStats,
          serviceDemand,
          accessPatterns,
        });
      } catch (err) {
        // Catch any unexpected errors
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        // Set loading to false once all data is fetched or an error occurs
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Runs only once on mount

  return { data, isLoading, error };
};
