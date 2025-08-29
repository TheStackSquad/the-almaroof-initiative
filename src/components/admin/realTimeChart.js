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
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components. This is required for tree-shaking.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export const RealTimeChart = ({
  lcpData = [],
  clsData = [],
  inpData = [],
  ttfbData = [],
}) => {
  // We use a state to hold the chart data.
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Debug logging useEffect - separate from the chart data effect
  useEffect(() => {
    console.log("=== REAL-TIME CHART DATA DEBUG ===");
    console.log("LCP Data:", lcpData);
    console.log("CLS Data:", clsData);
    console.log("INP Data:", inpData);
    console.log("TTFB Data:", ttfbData);

    // Check the actual timestamps
    const allData = [...lcpData, ...clsData, ...inpData, ...ttfbData];
    console.log(
      "All timestamps:",
      allData.map((d) => d.created_at)
    );

    // Log timezone info for debugging
    console.log(
      "Browser timezone:",
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    console.log("Current local time:", new Date().toLocaleString());
    console.log("================================");
  }, [lcpData, clsData, inpData, ttfbData]);

  // Separate useEffect for chart data processing
  useEffect(() => {
    // Combine all data points and sort them by creation date for the labels.
    const allData = [...lcpData, ...clsData, ...inpData, ...ttfbData].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    // Extract unique, formatted timestamps for the x-axis labels.
    const labels = allData.map((d) =>
      new Date(d.created_at).toLocaleTimeString()
    );

    // Filter and map each dataset.
    const lcpDataset = lcpData.map((d) => d.value);
    const clsDataset = clsData.map((d) => d.value);
    const inpDataset = inpData.map((d) => d.value);
    const ttfbDataset = ttfbData.map((d) => d.value);

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
          label: "INP (ms)",
          data: inpDataset,
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
        {
          label: "TTFB (ms)",
          data: ttfbDataset,
          borderColor: "rgb(139, 92, 246)",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [lcpData, clsData, inpData, ttfbData]);

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
    lcpData.length > 0 ||
    clsData.length > 0 ||
    inpData.length > 0 ||
    ttfbData.length > 0;

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
