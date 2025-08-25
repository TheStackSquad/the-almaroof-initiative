// File: src/components/admin/alertSystem.js

"use client";
import { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * A client-side component to display performance-related alerts
 * based on Core Web Vitals thresholds.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.metrics - An object containing the latest metric values (e.g., { lcp: 2000, inp: 50, cls: 0.05 }).
 */
export const AlertSystem = ({ metrics }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // FIX: Update FID threshold to INP threshold. INP is the new Core Web Vital.
    // The threshold for INP is generally considered to be 200ms.
    const thresholds = {
      lcp: 2500, // ms
      inp: 200, // ms
      cls: 0.1, // score
      ttfb: 600, // ms
    };

    const newAlerts = [];

    // FIX: Iterate over the metrics object to check for alerts.
    // The metrics object is structured to align with the thresholds object.
    Object.entries(thresholds).forEach(([metric, threshold]) => {
      // Correctly check if the metric value exceeds the threshold
      const metricValue = metrics[metric];
      if (metricValue && metricValue > threshold) {
        let message;
        if (metric === "cls") {
          // CLS is a score, not in milliseconds.
          message = `Current score: ${metricValue.toFixed(
            2
          )} | Threshold: ${threshold}`;
        } else {
          message = `Current: ${Math.round(
            metricValue
          )}ms | Threshold: ${threshold}ms`;
        }

        newAlerts.push({
          id: `${metric}-${Date.now()}`,
          type: "warning",
          metric: metric.toUpperCase(),
          value: metricValue,
          threshold,
          message,
        });
      }
    });

    setAlerts((prev) => {
      // Keep only recent alerts (last 10)
      const combined = [...newAlerts, ...prev].slice(0, 10);
      return combined;
    });
  }, [metrics]); // 'metrics' is the only variable from outside the effect that changes.

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Performance Alerts
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">All metrics within thresholds</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-4 border-yellow-400"
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {alert.metric} Threshold Exceeded
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                  {alert.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
