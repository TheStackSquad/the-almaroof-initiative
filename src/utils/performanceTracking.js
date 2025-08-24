// utils/performanceTracking.js
import { track } from "@vercel/analytics";

/**
 * Track custom performance events
 */
export function trackCustomEvent(eventName, properties = {}) {
  // Only track in production
  if (process.env.NODE_ENV === "production") {
    track(eventName, {
      timestamp: Date.now(),
      url: typeof window !== "undefined" ? window.location.href : "",
      ...properties,
    });
  }
}

/**
 * Track page load performance
 */
export function trackPageLoad(pageName) {
  if (typeof window === "undefined") return;

  // Track when page is fully loaded
  window.addEventListener("load", () => {
    const navigationTiming = performance.getEntriesByType("navigation")[0];

    trackCustomEvent("page_load_complete", {
      page: pageName,
      loadTime: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
      domContentLoaded:
        navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
      firstPaint:
        performance.getEntriesByName("first-paint")[0]?.startTime || 0,
      firstContentfulPaint:
        performance.getEntriesByName("first-contentful-paint")[0]?.startTime ||
        0,
    });
  });
}

/**
 * Track Core Web Vitals manually
 */
export function trackWebVitals(metric) {
  // This integrates with Next.js built-in Web Vitals reporting
  trackCustomEvent("web_vital", {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    label: metric.label,
  });
}

/**
 * Track user interactions for INP (Interaction to Next Paint)
 */
export function trackUserInteraction(elementType, action) {
  const startTime = performance.now();

  // Track the interaction
  requestIdleCallback(() => {
    const endTime = performance.now();
    trackCustomEvent("user_interaction", {
      elementType,
      action,
      duration: endTime - startTime,
      timestamp: startTime,
    });
  });
}
