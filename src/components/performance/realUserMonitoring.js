//src/components/performance/realUserMonitoring.js

"use client";
import { useEffect, useRef } from "react";
// Removed onFID from the import statement as it is no longer exported.
import { onLCP, onCLS, onINP, onTTFB } from "web-vitals";

/**
 * Custom React Hook to get and persist a unique session ID.
 * This hook correctly uses useRef to handle the session ID across renders.
 * @returns {string} The unique session ID for the current user session.
 */
const useSessionId = () => {
  const sessionIdRef = useRef(null);

  useEffect(() => {
    // This effect runs once on component mount.
    if (typeof window !== "undefined" && !sessionIdRef.current) {
      let sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("sessionId", sessionId);
      }
      sessionIdRef.current = sessionId;
    }
  }, []);

  return sessionIdRef.current;
};

/**
 * A client-side component to measure and report web performance metrics.
 * This component handles the core logic for collecting Core Web Vitals and
 * sending them to the custom API endpoint.
 * It's a client component, so it will only run on the browser.
 */
export default function RealUserMonitoring() {
  const sessionId = useSessionId();
  const metricsQueue = useRef([]);

  // A function to send batched metrics to the API route
  const sendMetricsToApi = async () => {
    // Only send if there are metrics in the queue
    if (metricsQueue.current.length === 0) {
      return;
    }

    try {
      // Use a copy of the queue and clear the original
      const metricsToSend = [...metricsQueue.current];
      metricsQueue.current = [];

      const response = await fetch("/api/admin/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metricsToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Log the error but don't re-throw to avoid breaking the app
      console.error("Failed to send web vitals:", error);
    }
  };

  useEffect(() => {
    // We only attach listeners if the sessionId has been established
    if (!sessionId) {
      return;
    }

    // Collect all web vitals and push them to the metrics queue
    const collectMetric = (metric) => {
      // Create a copy of the metric and add session and page info
      const metricPayload = {
        ...metric,
        page: window.location.pathname,
        metric_name: metric.name,
        user_agent: navigator.userAgent,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      };

      // We push a copy to the ref, so we don't mutate the original metric
      metricsQueue.current.push(metricPayload);
    };

    // Attach web-vitals listeners
    onLCP(collectMetric, { reportAllChanges: true });
    // onFID is removed, onINP is the new standard
    onCLS(collectMetric, { reportAllChanges: true });
    onINP(collectMetric);
    onTTFB(collectMetric);

    // Send metrics on page unload or before the component unmounts
    window.addEventListener("beforeunload", sendMetricsToApi);

    // Clean up function
    return () => {
      window.removeEventListener("beforeunload", sendMetricsToApi);
      sendMetricsToApi(); // Send any remaining metrics before unmount
    };
  }, [sessionId]); // Dependency array to re-run effect when sessionId is available

  // This component doesn't render anything visually
  return null;
}
