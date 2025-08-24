// File: app/api/performance/route.js

import { NextResponse } from "next/server";

// In-memory storage (replace with database in production)
let performanceData = [];
const MAX_RECORDS = 1000;

export async function POST(request) {
  try {
    const data = await request.json();

    // Add timestamp and ID
    const record = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      userAgent: request.headers.get("user-agent"),
    };

    // Store the record
    performanceData.unshift(record);

    // Keep only latest records
    if (performanceData.length > MAX_RECORDS) {
      performanceData = performanceData.slice(0, MAX_RECORDS);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing performance data:", error);
    return NextResponse.json(
      { error: "Failed to store performance data" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "100"),
      MAX_RECORDS
    );
    const metric = searchParams.get("metric");
    const page = searchParams.get("page");

    let filtered = performanceData;

    // Apply filters
    if (metric && metric !== "all") {
      filtered = filtered.filter((item) => item.metric === metric);
    }

    if (page && page !== "all") {
      filtered = filtered.filter((item) => item.page === page);
    }

    // Return limited results
    return NextResponse.json({
      data: filtered.slice(0, limit),
      total: filtered.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}
