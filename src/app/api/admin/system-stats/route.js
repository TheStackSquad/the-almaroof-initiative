// src/app/api/admin/system-stats/route.js
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export async function GET(request) {
  try {
    // 1. Get total unique sessions
    const { count: totalSessions, error: sessionError } = await supabaseAdmin
      .from("performance_metrics")
      .select("session_id", { count: "exact", head: true })
      .not("session_id", "is", null);

    if (sessionError) throw sessionError;

    // 2. Get total page views (all records)
    const { count: totalPageViews, error: viewsError } = await supabaseAdmin
      .from("performance_metrics")
      .select("*", { count: "exact", head: true });

    if (viewsError) throw viewsError;

    // 3. Get top performing pages (by number of visits)
    const { data: topPagesData, error: topPagesError } = await supabaseAdmin
      .from("performance_metrics")
      .select("page")
      .then((result) => {
        // Count page occurrences manually since we can't do GROUP BY with count in one query easily
        const pageCounts = {};
        result.data?.forEach((record) => {
          pageCounts[record.page] = (pageCounts[record.page] || 0) + 1;
        });

        // Convert to array and sort
        const sortedPages = Object.entries(pageCounts)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 pages

        return { data: sortedPages, error: null };
      });

    if (topPagesError) throw topPagesError;

    // 4. Get browser distribution analytics
    const { data: browserData, error: browserError } = await supabaseAdmin
      .from("performance_metrics")
      .select("user_agent")
      .then((result) => {
        const browserCounts = {
          Chrome: 0,
          Firefox: 0,
          Safari: 0,
          Edge: 0,
          Other: 0,
        };

        result.data?.forEach((record) => {
          const ua = record.user_agent || "";
          if (ua.includes("Chrome")) browserCounts.Chrome++;
          else if (ua.includes("Firefox")) browserCounts.Firefox++;
          else if (ua.includes("Safari") && !ua.includes("Chrome"))
            browserCounts.Safari++;
          else if (ua.includes("Edge")) browserCounts.Edge++;
          else browserCounts.Other++;
        });

        return { data: browserCounts, error: null };
      });

    if (browserError) throw browserError;

    const data = {
      // Core metrics
      totalSessions: totalSessions || 0,
      totalPageViews: totalPageViews || 0,

      // Top pages analytics
      topPages: topPagesData || [],

      // Browser distribution
      browserDistribution: browserData || {},

      // Performance overview (we'll keep this structure for future use)
      metricsSummary: {},  //explain what this data can look like
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to get system stats:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
