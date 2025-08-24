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

export const PerformanceMetrics = ({ data = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState("LCP");
  const [selectedPage, setSelectedPage] = useState("all");

  // Process data for charts
  const chartData = useMemo(() => {
    const filtered = data.filter((item) => {
      if (selectedPage !== "all" && item.page !== selectedPage) return false;
      if (selectedMetric !== "all" && item.metric !== selectedMetric)
        return false;
      return true;
    });

    // Group by hour for time series
    const hourlyData = filtered.reduce((acc, item) => {
      const hour = new Date(item.timestamp).getHours();
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
          label: selectedMetric,
          data: values,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
      ],
    };
  }, [data, selectedMetric, selectedPage]);

  // Device breakdown
  const deviceData = useMemo(() => {
    const devices = data.reduce((acc, item) => {
      acc[item.userAgent] = (acc[item.userAgent] || 0) + 1;
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
          ],
        },
      ],
    };
  }, [data]);

  // Get unique pages and metrics
  const pages = [...new Set(data.map((item) => item.page))];
  const metrics = [...new Set(data.map((item) => item.metric))];

  // Calculate averages
  const averages = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.metric]) acc[item.metric] = [];
      acc[item.metric].push(item.value);
      return acc;
    }, {});

    return Object.entries(grouped).reduce((acc, [metric, values]) => {
      acc[metric] = Math.round(
        values.reduce((sum, val) => sum + val, 0) / values.length
      );
      return acc;
    }, {});
  }, [data]);

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
        </div>

        {/* Device breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Device Breakdown
          </h3>
          <Doughnut
            data={deviceData}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: "rgba(156, 163, 175, 0.8)" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
