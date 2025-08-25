// src/app/api/admin/performance-events/route.js

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

// Define the thresholds for different Core Web Vitals based on industry standards.
// These are the values that define a "good," "needs improvement," or "poor" metric.
const thresholds = {
  LCP: { good: 2500, needsImprovement: 4000 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

/**
 * A helper function to create a relative time string (e.g., "5 mins ago").
 * @param {string} timestamp ISO timestamp string.
 * @returns {string} Relative time string.
 */
const formatRelativeTime = (timestamp) => {
  const diffInMinutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
  if (diffInMinutes === 0) {
    return "just now";
  } else if (diffInMinutes === 1) {
    return "1 min ago";
  } else {
    return `${diffInMinutes} mins ago`;
  }
};

/**
 * API route to retrieve recent performance events and alerts by querying the database.
 * The events are synthesized by analyzing the raw performance metrics against defined thresholds.
 */
export async function GET(request) {
  try {
    // Query the `performance_metrics` table for the 20 most recent metrics.
    // This provides a good, small data set for analysis.
    const { data, error } = await supabaseAdmin
      .from("performance_metrics")
      .select("metric_name, value, page, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    // Handle any potential Supabase query errors.
    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch performance metrics" },
        { status: 500 }
      );
    }

    // Process the raw data into a structured list of events.
    const events = [];

    // Use a Set to track which pages/metrics have already been reported to avoid duplicates.
    const reportedEvents = new Set();

    data.forEach((metric) => {
      // Create a unique key for each event to prevent duplicates.
      const eventKey = `${metric.metric_name}-${metric.page}`;
      if (reportedEvents.has(eventKey)) {
        return; // Skip if this event has already been added
      }

      let severity = "info";
      let eventDescription = "";

      const metricThresholds = thresholds[metric.metric_name];
      if (!metricThresholds) {
        // Skip metrics we don't have thresholds for
        return;
      }

      const isMilliseconds = metric.metric_name !== "CLS";

      if (metric.value > metricThresholds.needsImprovement) {
        severity = "error";
        const val = isMilliseconds
          ? `${(metric.value / 1000).toFixed(2)}s`
          : metric.value.toFixed(2);
        eventDescription = `High ${metric.metric_name} (${val}) detected on page: ${metric.page}`;
      } else if (metric.value > metricThresholds.good) {
        severity = "warning";
        const val = isMilliseconds
          ? `${(metric.value / 1000).toFixed(2)}s`
          : metric.value.toFixed(2);
        eventDescription = `Slow ${metric.metric_name} (${val}) on page: ${metric.page}`;
      } else {
        severity = "success";
        const val = isMilliseconds
          ? `${(metric.value / 1000).toFixed(2)}s`
          : metric.value.toFixed(2);
        eventDescription = `Good ${metric.metric_name} (${val}) on page: ${metric.page}`;
      }

      // Add the synthesized event to our list
      events.push({
        time: formatRelativeTime(metric.created_at),
        event: eventDescription,
        severity: severity,
      });

      // Mark this event as reported to avoid duplicates
      reportedEvents.add(eventKey);
    });

    // Return the synthesized events to the client.
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Catch and handle any other unexpected errors.
    console.error("An unexpected error occurred:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
