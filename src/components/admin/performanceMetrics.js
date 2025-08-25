// components/admin/performanceMetrics.jsx

"use client";
import { useState, useMemo } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * A component to display historical web performance metrics from Supabase.
 * It provides interactive charts and average metric cards.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.data - An array of all performance metric records from Supabase.
 */
export const PerformanceMetrics = ({ data = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState("all"); // Default to 'all'
  const [selectedPage, setSelectedPage] = useState("all"); // Default to 'all'

  // Process data for the time series chart
  const chartData = useMemo(() => {
    // FIX: Filter by the correct property names: 'metric_name' and 'page'
    const filtered = data.filter((item) => {
      const metricMatches =
        selectedMetric === "all" || item.metric_name === selectedMetric;
      const pageMatches = selectedPage === "all" || item.page === selectedPage;
      return metricMatches && pageMatches;
    });

    // Group by hour for time series
    const hourlyData = filtered.reduce((acc, item) => {
      // FIX: Use 'created_at' instead of 'timestamp'
      const hour = new Date(item.created_at).getHours();
      if (!acc[hour]) acc[hour] = [];
      acc[hour].push(item.value);
      return acc;
    }, {});

    const labels = Object.keys(hourlyData).sort((a, b) => a - b);
    const values = labels.map((hour) => {
      const hourValues = hourlyData[hour];
      return hourValues.reduce((sum, val) => sum + val, 0) / hourValues.length;
    });

    return {
      labels: labels.map((h) => `${h}:00`),
      datasets: [
        {
          label: selectedMetric === "all" ? "Average" : selectedMetric,
          data: values,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
      ],
    };
  }, [data, selectedMetric, selectedPage]);

  // Process data for device breakdown
  const deviceData = useMemo(() => {
    const devices = data.reduce((acc, item) => {
      acc[item.user_agent] = (acc[item.user_agent] || 0) + 1; // FIX: use user_agent
      return acc;
    }, {});

    return {
      labels: Object.keys(devices),
      datasets: [
        {
          data: Object.values(devices),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            // Add more colors if needed
          ],
        },
      ],
    };
  }, [data]);

  // Calculate overall averages
  const averages = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      // FIX: Use 'metric_name' instead of 'metric'
      if (!acc[item.metric_name]) acc[item.metric_name] = [];
      acc[item.metric_name].push(item.value);
      return acc;
    }, {});

    return Object.entries(grouped).reduce((acc, [metric, values]) => {
      // Handle CLS, which should not be rounded to an integer
      const isCls = metric === "CLS";
      const averageValue =
        values.reduce((sum, val) => sum + val, 0) / values.length;
      acc[metric] = isCls ? averageValue.toFixed(2) : Math.round(averageValue);
      return acc;
    }, {});
  }, [data]);

  // Get unique pages and metrics from the data
  const pages = useMemo(
    () => [...new Set(data.map((item) => item.page))],
    [data]
  );
  const metrics = useMemo(
    () => [...new Set(data.map((item) => item.metric_name))],
    [data]
  ); // FIX: use metric_name

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Metrics</option>
              {metrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Pages</option>
              {pages.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(averages).map(([metric, value]) => (
          <div
            key={metric}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {metric}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
              <span className="text-sm text-gray-500 ml-1">
                {/* FIX: Ensure unit is correct based on metric */}
                {metric === "CLS" ? "" : "ms"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time series chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Over Time
          </h3>
          {data.length > 0 ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "rgba(156, 163, 175, 0.2)" },
                    ticks: { color: "rgba(156, 163, 175, 0.8)" },
                  },
                  x: {
                    grid: { color: "rgba(156, 163, 175, 0.2)" },
                    ticks: { color: "rgba(156, 163, 175, 0.8)" },
                  },
                },
                plugins: {
                  legend: { labels: { color: "rgba(156, 163, 175, 0.8)" } },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No historical data available.
            </div>
          )}
        </div>

        {/* Device breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Device Breakdown
          </h3>
          {data.length > 0 ? (
            <Doughnut
              data={deviceData}
              options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: "rgba(156, 163, 175, 0.8)" } },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No historical data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
