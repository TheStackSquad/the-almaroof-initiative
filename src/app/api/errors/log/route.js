// src/app/api/errors/log/route.js

import { NextResponse } from "next/server";

//Step 1: Server-side error logging API endpoint
export async function POST(request) {
  try {
    const errorData = await request.json();

    // Add server timestamp
    const logEntry = {
      ...errorData,
      serverTimestamp: new Date().toISOString(),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("remote-addr") ||
        "unknown",
      referer: request.headers.get("referer") || "unknown",
    };

    // Log to server console (Vercel logs)
    console.error("🚨 CLIENT ERROR LOGGED:", JSON.stringify(logEntry, null, 2));

    // TODO: Later we can integrate with:
    // - Email notifications for critical errors
    // - External logging services (Sentry, LogRocket, etc.)
    // - Database storage for error analytics
    // - Slack notifications for team alerts

    //Step 1: Store in a simple log format for now
    const logMessage = `
=== ERROR LOG ===
Time: ${logEntry.serverTimestamp}
Error: ${logEntry.message}
Component: ${logEntry.componentName || logEntry.errorBoundary || "unknown"}
Route: ${logEntry.route || "unknown"}
URL: ${logEntry.url}
User Agent: ${logEntry.userAgent}
User ID: ${logEntry.userId || "anonymous"}
Stack: ${logEntry.stack}
=================
    `;

    console.log(logMessage);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Error logged successfully",
        logId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to process error log:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to log error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

//Step 1: GET endpoint to retrieve error logs (for admin dashboard later)
export async function GET(request) {
  try {
    // TODO: Implement error log retrieval
    // This could read from database, file system, or external service

    return NextResponse.json({
      message: "Error log retrieval not implemented yet",
      note: "This endpoint will be used for admin dashboard to view error logs",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve error logs" },
      { status: 500 }
    );
  }
}
