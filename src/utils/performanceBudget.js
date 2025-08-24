// utils/performanceBudgets.js
export const performanceBudgets = {
  // Core Web Vitals targets
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  INP: 200, // Interaction to Next Paint (ms)

  // Custom metrics
  TTI: 3800, // Time to Interactive (ms)
  TTFB: 800, // Time to First Byte (ms)

  // Resource budgets
  totalPageSize: 1500000, // 1.5MB
  imageSize: 500000, // 500KB per image
  jsSize: 400000, // 400KB total JS
  cssSize: 100000, // 100KB total CSS
};

export function checkPerformanceBudget(metric, value) {
  const budget = performanceBudgets[metric];
  if (!budget) return true;

  const passed = value <= budget;

  if (!passed) {
    track("performance_budget_exceeded", {
      metric,
      value: Math.round(value),
      budget,
      overage: Math.round(((value - budget) / budget) * 100), // % over budget
    });
  }

  return passed;
}