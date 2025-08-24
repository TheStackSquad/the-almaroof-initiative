// ===== UPDATED PERFORMANCE TRACKING WITH API =====
// utils/enhancedPerformanceTracking.js
import { track } from "@vercel/analytics";
import { PerformanceAPI } from "@/utils/performanceApi";

export class EnhancedPerformanceTracker {
  constructor() {
    this.buffer = [];
    this.flushInterval = 5000; // Flush every 5 seconds
    this.maxBufferSize = 50;

    // Start buffer flushing
    this.startBufferFlushing();
  }

  // Track performance metric with both Vercel and custom API
  async trackMetric(metric, value, metadata = {}) {
    const data = {
      metric,
      value: Math.round(value),
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      timestamp: Date.now(),
      ...metadata,
    };

    // Add to buffer for batch processing
    this.buffer.push(data);

    // Track with Vercel Analytics immediately
    track(`performance_${metric.toLowerCase()}`, data);

    // Flush buffer if it's getting full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flushBuffer();
    }
  }

  // Flush buffer to API
  async flushBuffer() {
    if (this.buffer.length === 0) return;

    const dataToFlush = [...this.buffer];
    this.buffer = [];

    try {
      // Send batch to API
      for (const data of dataToFlush) {
        await PerformanceAPI.saveMetric(data);
      }
    } catch (error) {
      console.error("Failed to flush performance buffer:", error);
      // Re-add failed data to buffer (with limit)
      this.buffer = [...dataToFlush.slice(-10), ...this.buffer];
    }
  }

  // Start automatic buffer flushing
  startBufferFlushing() {
    if (typeof window === "undefined") return;

    setInterval(() => {
      this.flushBuffer();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener("beforeunload", () => {
      this.flushBuffer();
    });
  }

  // Track Web Vitals with enhanced data
  trackWebVital(metric) {
    const enhancedData = {
      ...metric,
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      deviceMemory: this.getDeviceMemory(),
      timestamp: Date.now(),
    };

    this.trackMetric(metric.name, metric.value, enhancedData);
  }

  // Get connection information
  getConnectionInfo() {
    if ("connection" in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
      };
    }
    return null;
  }

  // Get device memory info
  getDeviceMemory() {
    return "deviceMemory" in navigator ? navigator.deviceMemory : null;
  }
}

// Global instance
export const performanceTracker = new EnhancedPerformanceTracker();

export default EnhancedPerformanceTracker;
