// utils/analytics.js
const isDev = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export const analyticsConfig = {
  // Enable debug mode in development
  debug: isDev,

  // Sample rate for development (lower to reduce noise)
  sampleRate: isDev ? 0.1 : 1.0,

  // Custom tracking for different environments
  environment: process.env.VERCEL_ENV || "development",

  // Enable different features per environment
  enableHeatmaps: isProduction,
  enableErrorTracking: true,
  enablePerformanceTracking: true,
};
