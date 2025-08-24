// ===== ENHANCED PERFORMANCE TRACKING UTILITIES =====
// utils/performanceAPI.js
const API_BASE = "/api/performance";

export class PerformanceAPI {
  static async saveMetric(data) {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to save performance metric:", error);
      return null;
    }
  }

  static async getMetrics(options = {}) {
    try {
      const params = new URLSearchParams();

      if (options.limit) params.append("limit", options.limit);
      if (options.metric) params.append("metric", options.metric);
      if (options.page) params.append("page", options.page);

      const response = await fetch(`${API_BASE}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch performance metrics:", error);
      return { data: [], total: 0, timestamp: Date.now() };
    }
  }

  static async getBudgetStatus() {
    try {
      const data = await this.getMetrics({ limit: 50 });
      const budgets = {
        LCP: 2500,
        FID: 100,
        CLS: 0.1,
        TTFB: 600,
      };

      const status = {};

      Object.keys(budgets).forEach((metric) => {
        const metricData = data.data.filter((item) => item.metric === metric);
        if (metricData.length > 0) {
          const average =
            metricData.reduce((sum, item) => sum + item.value, 0) /
            metricData.length;
          status[metric] = {
            current: Math.round(average),
            budget: budgets[metric],
            status: average <= budgets[metric] ? "good" : "poor",
            trend: this.calculateTrend(metricData),
          };
        }
      });

      return status;
    } catch (error) {
      console.error("Failed to get budget status:", error);
      return {};
    }
  }

  static calculateTrend(data) {
    if (data.length < 2) return "stable";

    const recent = data.slice(0, Math.floor(data.length / 2));
    const older = data.slice(Math.floor(data.length / 2));

    const recentAvg =
      recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, item) => sum + item.value, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 5) return "worsening";
    if (change < -5) return "improving";
    return "stable";
  }
}
