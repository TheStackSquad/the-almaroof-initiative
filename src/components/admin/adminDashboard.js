"use client";
import { useState, useEffect } from "react";
// Assumed to be available components. Their internal logic doesn't need to change.
import { PerformanceMetrics } from "@/components/admin/performanceMetrics";
import { RealTimeChart } from "@/components/admin/realTimeChart";
import { AlertSystem } from "@/components/admin/alertSystem";

// Supabase imports
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminDashboard = () => {
  // We're replacing all mock data states with states that will be populated
  // by real-time data from Supabase.
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [lcpData, setLcpData] = useState([]);
  const [fidData, setFidData] = useState([]);
  const [clsData, setClsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to handle data fetching and real-time subscription
  useEffect(() => {
    // This is an async function to fetch data
    const fetchDataAndSubscribe = async () => {
      try {
        // 1. Fetch initial historical data from the 'performance_metrics' table
        // FIX: Change 'timestamp' to 'created_at' to match the database schema.
        const { data, error } = await supabase
          .from("performance_metrics")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching initial data:", error);
          return;
        }

        if (data) {
          setPerformanceMetrics(data);
          // Separate the data into metric-specific arrays for the chart and alerts
          setLcpData(data.filter((d) => d.metric_name === "LCP"));
          setFidData(data.filter((d) => d.metric_name === "FID"));
          setClsData(data.filter((d) => d.metric_name === "CLS"));
        }
      } catch (error) {
        console.error("An error occurred during initial data fetch:", error);
      } finally {
        setIsLoading(false);
      }

      // 2. Set up a real-time subscription to listen for new data inserts
      // We are subscribing to all changes in the 'performance_metrics' table
      const channel = supabase
        .channel("performance_metrics_changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "performance_metrics" },
          (payload) => {
            console.log("Real-time INSERT received:", payload.new);
            // On a new insert, update the state to include the new data point
            setPerformanceMetrics((prevData) => [...prevData, payload.new]);

            // Now, we update the metric-specific data arrays
            switch (
              payload.new.metric_name // FIX: Use 'metric_name'
            ) {
              case "LCP":
                setLcpData((prevData) => [...prevData, payload.new]);
                break;
              case "FID":
                setFidData((prevData) => [...prevData, payload.new]);
                break;
              case "CLS":
                setClsData((prevData) => [...prevData, payload.new]);
                break;
              case "INP": // Handle INP and TTFB as well
                setFidData((prevData) => [...prevData, payload.new]);
                break;
              case "TTFB":
                setClsData((prevData) => [...prevData, payload.new]);
                break;
              default:
                break;
            }
          }
        )
        .subscribe();

      // Clean up the subscription on component unmount
      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchDataAndSubscribe();
  }, []); // Empty dependency array to run only once on mount

  // FIX: Create a single metrics object with the latest values to pass to AlertSystem
  // We need to get the last entry for each metric from the respective data arrays.
  const latestLcp = lcpData[lcpData.length - 1]?.value;
  const latestFid = fidData[fidData.length - 1]?.value;
  const latestCls = clsData[clsData.length - 1]?.value;

  const realTimeMetrics = {
    lcp: latestLcp,
    fid: latestFid,
    cls: latestCls,
    // Note: If you want to include INP or TTFB, you would add them here.
    // For now, we will stick to the existing alert system metrics.
  };

  // Conditional rendering while data is being fetched
  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-6 flex items-center justify-center">
        <div className="text-xl font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  // The main rendering logic
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* ... (System Overview content here - unchanged) ... */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Overview
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  0h 0m
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  System Uptime
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  0%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Memory Usage
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  0
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
        {/* FIX: Pass a single `metrics` object instead of separate arrays */}
        <AlertSystem metrics={realTimeMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Metrics</h2>
          <RealTimeChart
            lcpData={lcpData}
            fidData={fidData}
            clsData={clsData}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
          {/* We pass the full performanceMetrics array to the historical component */}
          <PerformanceMetrics data={performanceMetrics} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
