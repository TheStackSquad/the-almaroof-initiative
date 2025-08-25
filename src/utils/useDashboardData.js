// src/utils/useDashboardData.js

import { useState, useEffect } from "react";

/**
 * A custom React hook to fetch all dashboard-specific data.
 * It fetches system stats, active users, and recent performance events.
 * @returns {object} An object containing the data, loading state, and any errors.
 */
export const useDashboardData = () => {
  // State to hold all the fetched data
  const [data, setData] = useState({
    systemStats: {
      uptimeMinutes: 0,
      memoryUsage: 0,
    },
    activeUsers: 0,
    performanceEvents: [],
  });

  // State to track loading status and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all three API routes concurrently using Promise.all
        const [
          systemStatsResponse,
          activeUsersResponse,
          performanceEventsResponse,
        ] = await Promise.all([
          fetch("/api/admin/system-stats"),
          fetch("/api/admin/active-users"),
          fetch("/api/admin/performance-events"),
        ]);

        // Check if all responses are ok
        if (
          !systemStatsResponse.ok ||
          !activeUsersResponse.ok ||
          !performanceEventsResponse.ok
        ) {
          throw new Error("One or more data fetches failed.");
        }

        // Parse the JSON data from each response
        const systemStats = await systemStatsResponse.json();
        const activeUsers = await activeUsersResponse.json();
        const performanceEvents = await performanceEventsResponse.json();

        // Update the state with the new data
        setData({
          systemStats,
          activeUsers: activeUsers.activeUsers,
          performanceEvents,
        });
      } catch (err) {
        // Catch any errors during the fetch and update the error state
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        // Set loading to false once all data is fetched or an error occurs
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return { data, isLoading, error };
};
