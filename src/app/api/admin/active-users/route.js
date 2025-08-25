// src/app/api/admin/active-users/route.js

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

/**
 * API route to get the number of active users.
 * This route queries the Supabase database for recent performance metrics
 * and counts the number of unique sessions.
 */
export async function GET(request) {
  try {
    // 1. Define the time frame for "active" users (e.g., the last 5 minutes)
    // We create an ISO string for comparison in the database query.
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // 2. Query the Supabase database for the count of distinct session IDs
    // that have generated a metric within the last five minutes.
    const { count, error } = await supabaseAdmin
      .from("performance_metrics")
      .select("session_id", { count: "exact", head: true }) // Selects only the count, not the data
      .gt("created_at", fiveMinutesAgo) // Filters for records created greater than five minutes ago
      .order("created_at", { ascending: false }); // Optional: Order by date for efficiency

    // 3. Handle potential Supabase query errors.
    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch active users" },
        { status: 500 }
      );
    }

    // The count variable now holds the number of active users.
    const data = {
      activeUsers: count,
    };

    // 4. Return the real data in the response.
    return new Response(JSON.stringify(data), {
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
