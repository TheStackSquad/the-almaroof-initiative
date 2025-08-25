// src/app/api/admin/service-demand/route.js

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

/**
 * API route to analyze service demand from citizen interactions.
 * Uses actual government service paths for accurate analytics.
 */
export async function GET(request) {
  try {
    // 1. Get all performance metrics data
    const { data: allMetrics, error: metricsError } = await supabaseAdmin
      .from("performance_metrics")
      .select("page, session_id, created_at, metric_name, value");

    if (metricsError) {
      console.error("Supabase query error:", metricsError);
      return NextResponse.json(
        { error: "Failed to fetch service metrics" },
        { status: 500 }
      );
    }

    if (!allMetrics || allMetrics.length === 0) {
      return NextResponse.json(
        {
          totalCitizensEngaged: 0,
          totalServiceInteractions: 0,
          serviceCategoryDemand: {},
          topServices: [],
          avgInteractionsPerCitizen: 0,
          analysisPeriod: "No data available",
          dataPointsAnalyzed: 0,
        },
        { status: 200 }
      );
    }

    // 2. Define your actual government service categories
    const serviceCategories = {
      "Birth Certificate Services": 0,
      "Business Permit Services": 0,
      "Healthcare Services": 0,
      "Tax Payment Services": 0,
      "Waste Management Services": 0,
      "Water & Sewage Services": 0,
      "Community Services": 0,
      "Information & News": 0,
      "Other Services": 0,
    };

    // 3. Analyze page popularity and categorize services
    const pagePopularity = {};
    const uniqueSessionsByService = {};

    // Initialize unique sessions tracker for each service category
    Object.keys(serviceCategories).forEach((category) => {
      uniqueSessionsByService[category] = new Set();
    });

    allMetrics.forEach((metric) => {
      const page = metric.page;
      const sessionId = metric.session_id;

      // Count page popularity
      pagePopularity[page] = (pagePopularity[page] || 0) + 1;

      // Categorize based on actual service paths
      if (page.includes("/birth-certificate/")) {
        serviceCategories["Birth Certificate Services"]++;
        uniqueSessionsByService["Birth Certificate Services"].add(sessionId);
      } else if (page.includes("/business-permit/")) {
        serviceCategories["Business Permit Services"]++;
        uniqueSessionsByService["Business Permit Services"].add(sessionId);
      } else if (page.includes("/primary-healthcare/")) {
        serviceCategories["Healthcare Services"]++;
        uniqueSessionsByService["Healthcare Services"].add(sessionId);
      } else if (page.includes("/tax-payment/")) {
        serviceCategories["Tax Payment Services"]++;
        uniqueSessionsByService["Tax Payment Services"].add(sessionId);
      } else if (page.includes("/waste-management/")) {
        serviceCategories["Waste Management Services"]++;
        uniqueSessionsByService["Waste Management Services"].add(sessionId);
      } else if (page.includes("/water-sewage/")) {
        serviceCategories["Water & Sewage Services"]++;
        uniqueSessionsByService["Water & Sewage Services"].add(sessionId);
      } else if (
        page.includes("/community/services") ||
        page.includes("/community/")
      ) {
        serviceCategories["Community Services"]++;
        uniqueSessionsByService["Community Services"].add(sessionId);
      } else if (
        page.includes("/news/") ||
        page.includes("/about/") ||
        page.includes("/contact/")
      ) {
        serviceCategories["Information & News"]++;
        uniqueSessionsByService["Information & News"].add(sessionId);
      } else {
        serviceCategories["Other Services"]++;
        uniqueSessionsByService["Other Services"].add(sessionId);
      }
    });

    // 4. Calculate unique citizens per service category
    const uniqueCitizensByService = {};
    Object.keys(uniqueSessionsByService).forEach((category) => {
      uniqueCitizensByService[category] =
        uniqueSessionsByService[category].size;
    });

    // 5. Get top 10 most popular specific pages
    const topPages = Object.entries(pagePopularity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({
        page: page.replace(/\//g, " ").trim() || "Home",
        count,
      }));

    // 6. Calculate total unique citizens
    const totalUniqueSessions = new Set(allMetrics.map((m) => m.session_id))
      .size;

    // 7. Prepare the response data
    const data = {
      // High-level engagement metrics
      totalCitizensEngaged: totalUniqueSessions,
      totalServiceInteractions: allMetrics.length,

      // Service demand analytics (most valuable for policy)
      serviceCategoryDemand: serviceCategories,
      uniqueCitizensByService: uniqueCitizensByService,

      // Top specific services
      topServices: topPages,

      // Engagement metrics
      avgInteractionsPerCitizen:
        totalUniqueSessions > 0
          ? (allMetrics.length / totalUniqueSessions).toFixed(2)
          : 0,

      // Metadata
      analysisPeriod: "all available data",
      dataPointsAnalyzed: allMetrics.length,
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
