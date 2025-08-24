// components/admin/RealTimeChart.jsx
"use client";
import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";

export const RealTimeChart = ({ metrics }) => {
  const dataPoints = useRef([]);
  const maxDataPoints = 20;

  useEffect(() => {
    if (metrics.timestamp) {
      dataPoints.current.push({
        ...metrics,
        time: new Date(metrics.timestamp).toLocaleTimeString(),
      });

      if (dataPoints.current.length > maxDataPoints) {
        dataPoints.current.shift();
      }
    }
  }, [metrics]);

  const chartData = {
    labels: dataPoints.current.map((point) => point.time),
    datasets: [
      {
        label: "LCP (ms)",
        data: dataPoints.current.map((point) => point.lcp),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
      {
        label: "FID (ms)",
        data: dataPoints.current.map((point) => point.fid),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "TTFB (ms)",
        data: dataPoints.current.map((point) => point.ttfb),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };

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

  return (
    <div>
      {dataPoints.current.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Waiting for real-time data...
        </div>
      )}
    </div>
  );
};
