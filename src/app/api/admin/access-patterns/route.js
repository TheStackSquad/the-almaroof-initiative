// src/app/api/admin/access-patterns/route.js

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

/**
 * API route to analyze citizen access patterns and digital inclusion metrics.
 * Provides insights into when and how citizens access government services.
 */
export async function GET(request) {
  try {
    // 1. Get all performance metrics with user agent and timing data
    const { data: allMetrics, error } = await supabaseAdmin
      .from("performance_metrics")
      .select("created_at, user_agent, page, session_id, metric_name, value")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch access pattern data" },
        { status: 500 }
      );
    }

    if (!allMetrics || allMetrics.length === 0) {
      return NextResponse.json(
        {
          message: "No access data available",
          hourlyAccess: {},
          browserUsage: {},
          deviceTypes: {},
          peakUsageTimes: [],
          weeklyPatterns: {},
          serviceAccessTrends: {},
          digitalInclusion: {},
          totalDataPoints: 0,
        },
        { status: 200 }
      );
    }

    // 2. Analyze hourly access patterns
    const hourlyAccess = {};
    for (let i = 0; i < 24; i++) {
      hourlyAccess[i] = 0; // Initialize all hours
    }

    // 3. Analyze browser usage and device types
    const browserUsage = {
      Chrome: 0,
      Firefox: 0,
      Safari: 0,
      Edge: 0,
      Other: 0,
    };

    const deviceTypes = {
      Mobile: 0,
      Desktop: 0,
      Tablet: 0,
    };

    // 4. Analyze service access trends
    const serviceAccessTrends = {};
    const weeklyPatterns = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    // 5. Process each metric record
    allMetrics.forEach((metric) => {
      const date = new Date(metric.created_at);
      const hour = date.getUTCHours();
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

      // Count hourly access
      hourlyAccess[hour] = (hourlyAccess[hour] || 0) + 1;

      // Count weekly patterns
      if (weeklyPatterns[dayOfWeek] !== undefined) {
        weeklyPatterns[dayOfWeek]++;
      }

      // Analyze browser usage
      const ua = metric.user_agent || "";
      if (ua.includes("Chrome")) browserUsage.Chrome++;
      else if (ua.includes("Firefox")) browserUsage.Firefox++;
      else if (ua.includes("Safari") && !ua.includes("Chrome"))
        browserUsage.Safari++;
      else if (ua.includes("Edge")) browserUsage.Edge++;
      else browserUsage.Other++;

      // Analyze device types
      if (
        ua.includes("Mobile") ||
        ua.includes("Android") ||
        ua.includes("iPhone")
      ) {
        deviceTypes.Mobile++;
      } else if (ua.includes("Tablet") || ua.includes("iPad")) {
        deviceTypes.Tablet++;
      } else {
        deviceTypes.Desktop++;
      }

      // Analyze service access trends (using your actual service paths)
      const page = metric.page;
      if (page.includes("/birth-certificate/")) {
        serviceAccessTrends["Birth Certificate"] =
          (serviceAccessTrends["Birth Certificate"] || 0) + 1;
      } else if (page.includes("/business-permit/")) {
        serviceAccessTrends["Business Permits"] =
          (serviceAccessTrends["Business Permits"] || 0) + 1;
      } else if (page.includes("/primary-healthcare/")) {
        serviceAccessTrends["Healthcare"] =
          (serviceAccessTrends["Healthcare"] || 0) + 1;
      } else if (page.includes("/tax-payment/")) {
        serviceAccessTrends["Tax Payments"] =
          (serviceAccessTrends["Tax Payments"] || 0) + 1;
      } else if (page.includes("/waste-management/")) {
        serviceAccessTrends["Waste Management"] =
          (serviceAccessTrends["Waste Management"] || 0) + 1;
      } else if (page.includes("/water-sewage/")) {
        serviceAccessTrends["Water & Sewage"] =
          (serviceAccessTrends["Water & Sewage"] || 0) + 1;
      } else if (page.includes("/community/")) {
        serviceAccessTrends["Community Services"] =
          (serviceAccessTrends["Community Services"] || 0) + 1;
      }
    });

    // 6. Identify peak usage times (top 3 hours with most access)
    const peakHours = Object.entries(hourlyAccess)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00-${parseInt(hour) + 1}:00`);

    // 7. Calculate digital inclusion score (modern browser usage)
    const modernBrowsers =
      browserUsage.Chrome + browserUsage.Firefox + browserUsage.Edge;
    const digitalInclusionScore =
      allMetrics.length > 0
        ? Math.round((modernBrowsers / allMetrics.length) * 100)
        : 0;

    // 8. Prepare the comprehensive response
    const data = {
      // Access patterns
      hourlyAccess,
      weeklyPatterns,
      peakUsageTimes: peakHours,

      // Technology usage
      browserUsage,
      deviceTypes,

      // Service-specific trends
      serviceAccessTrends,

      // Digital inclusion metrics
      digitalInclusion: {
        score: digitalInclusionScore,
        modernBrowserUsage: modernBrowsers,
        legacyBrowserUsage: browserUsage.Other + browserUsage.Safari,
      },

      // Metadata
      totalDataPoints: allMetrics.length,
      analysisPeriod: {
        start: allMetrics[allMetrics.length - 1]?.created_at,
        end: allMetrics[0]?.created_at,
      },
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
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
