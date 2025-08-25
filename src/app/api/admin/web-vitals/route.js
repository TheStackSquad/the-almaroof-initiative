// src/app/api/admin/web-vitals/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export async function POST(request) {
  try {
    // step 1: parse request body
    const metrics = await request.json();

    // step 2: validate incoming data and map to database schema
    const dataToInsert = metrics.map((metric) => ({
      page: metric.page,
      metric_name: metric.metric_name,
      value: metric.value,
      user_agent: metric.user_agent,
      session_id: metric.session_id,
      created_at: new Date(metric.created_at).toISOString(),
    }));

    // step 3: insert data into the performance_metrics table using supabaseAdmin
    const { data, error } = await supabaseAdmin
      .from("performance_metrics")
      .insert(dataToInsert);

    // step 4: handle potential database errors
    if (error) {
      console.error("Supabase insertion error:", error);
      return NextResponse.json(
        { error: "Failed to save metrics" },
        { status: 500 }
      );
    }

    // step 5: return a success response
    return NextResponse.json(
      { message: "Metrics saved successfully", data },
      { status: 201 }
    );
  } catch (error) {
    // step 6: catch and handle any other errors
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
