// src/components/performance/realUserMonitoring.js

"use client";
import { useEffect, useRef } from "react";
// We no longer import onFID, as it has been replaced by onINP.
import { onLCP, onCLS, onINP, onTTFB } from "web-vitals";

/**
 * Custom React Hook to get and persist a unique session ID.
 * This hook correctly uses useRef to handle the session ID across renders,
 * ensuring it is only created once per user session.
 *
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
 * sending them to the custom API endpoint in a batched manner.
 */
export default function RealUserMonitoring() {
  const sessionId = useSessionId();
  const metricsQueue = useRef([]);
  const timerRef = useRef(null);

  /**
   * A function to send batched metrics to the API route.
   * It's called on a timer and on page unload.
   */
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
      console.log("Web vitals sent successfully.");
    } catch (error) {
      console.error("Failed to send web vitals:", error);
      // Re-queue the metrics if the send failed. This provides a basic retry mechanism.
      metricsQueue.current = [...metricsToSend, ...metricsQueue.current];
    }
  };

  useEffect(() => {
    // We only attach listeners and start the timer if the sessionId is available
    if (!sessionId) {
      return;
    }

    /**
     * Collects a web vital metric and adds it to the queue.
     * This function is the callback for all web-vitals listeners.
     */
    const collectMetric = (metric) => {
      // Create a copy of the metric and add session and page info
      const metricPayload = {
        page: window.location.pathname,
        metric_name: metric.name,
        value: metric.value,
        user_agent: navigator.userAgent,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      };

      // Add the processed metric to the queue
      metricsQueue.current.push(metricPayload);
    };

    // Attach web-vitals listeners to collect all relevant metrics
    onLCP(collectMetric, { reportAllChanges: true });
    // onFID has been replaced by onINP, which is why the previous code failed.
    onCLS(collectMetric, { reportAllChanges: true });
    onINP(collectMetric);
    onTTFB(collectMetric);

    // Start a timer to send batched metrics periodically.
    timerRef.current = setInterval(() => {
      if (metricsQueue.current.length > 0) {
        sendMetricsToApi();
      }
    }, 5000); // Send every 5 seconds.

    // Listen for a window unload event to send any remaining metrics
    window.addEventListener("beforeunload", sendMetricsToApi);

    // Clean up function for the effect
    return () => {
      // Clear the timer and remove the event listener on unmount
      clearInterval(timerRef.current);
      window.removeEventListener("beforeunload", sendMetricsToApi);
      sendMetricsToApi(); // Send any remaining metrics before the component unmounts
    };
  }, [sessionId]); // Dependency array to re-run effect when sessionId becomes available

  // This component doesn't render anything visually, so we return null.
  return null;
}
