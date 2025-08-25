// components/admin/realTimeChart.jsx

"use client";
import { useEffect, useState } from "react";
// Import necessary Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components. This is required for tree-shaking.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/**
 * A real-time line chart component to display web performance metrics.
 *
 * This component visualizes LCP, FID, and CLS data over time,
 * using the data arrays passed from the parent component.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.lcpData - Array of LCP data points.
 * @param {Array<Object>} props.fidData - Array of FID data points.
 * @param {Array<Object>} props.clsData - Array of CLS data points.
 */
export const RealTimeChart = ({ lcpData = [], fidData = [], clsData = [] }) => {
  // We use a state to hold the chart data.
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // useEffect to update the chart data whenever a new data point arrives.
  // The effect re-runs when any of the data arrays change.
  useEffect(() => {
    // Combine all data points and sort them by creation date for the labels.
    const allData = [...lcpData, ...fidData, ...clsData].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    // Extract unique, formatted timestamps for the x-axis labels.
    const labels = allData.map((d) =>
      new Date(d.created_at).toLocaleTimeString()
    );

    // Filter and map each dataset.
    const lcpDataset = lcpData.map((d) => d.value);
    const fidDataset = fidData.map((d) => d.value);
    const clsDataset = clsData.map((d) => d.value);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "LCP (ms)",
          data: lcpDataset,
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "FID (ms)",
          data: fidDataset,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "CLS (score)",
          data: clsDataset,
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [lcpData, fidData, clsData]);

  const options = {
    responsive: true,
    animation: false,
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
  };

  // Check if any data exists to decide what to render.
  const hasData =
    lcpData.length > 0 || fidData.length > 0 || clsData.length > 0;

  return (
    <div>
      {hasData ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Waiting for real-time data...
        </div>
      )}
    </div>
  );
};
