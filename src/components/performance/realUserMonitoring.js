// components/performance/RealUserMonitoring.jsx
"use client";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function RealUserMonitoring() {
  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Track resource loading times
        if (entry.entryType === "resource") {
          const duration = entry.responseEnd - entry.requestStart;

          if (duration > 1000) {
            // Flag slow resources
            track("slow_resource", {
              resource: entry.name,
              duration: Math.round(duration),
              type: entry.initiatorType,
            });
          }
        }

        // Track long tasks (JavaScript execution > 50ms)
        if (entry.entryType === "longtask") {
          track("long_task", {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
          });
        }
      }
    });

    // Observe different entry types
    observer.observe({
      entryTypes: ["resource", "longtask", "measure"],
    });

    // Monitor memory usage (if available)
    if ("memory" in performance) {
      const logMemoryUsage = () => {
        const memory = performance.memory;
        track("memory_usage", {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        });
      };

      // Log every 30 seconds
      const memoryInterval = setInterval(logMemoryUsage, 30000);

      return () => {
        observer.disconnect();
        clearInterval(memoryInterval);
      };
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
