// File: src/middleware/middleware.js

import { NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";

export async function middleware(request) {
  const start = Date.now();
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referer = request.headers.get("referer") || "direct";

  // Continue with the request
  const response = NextResponse.next();

  // Calculate response time
  const responseTime = Date.now() - start;

  // Track server-side metrics (only in production)
  if (process.env.NODE_ENV === "production") {
    // Track page requests
    await track("page_request", {
      path: pathname,
      query: search,
      responseTime,
      userAgent: userAgent.includes("Mobile") ? "Mobile" : "Desktop",
      referer: referer !== "direct" ? new URL(referer).hostname : "direct",
      status: response.status,
    });

    // Track slow requests
    if (responseTime > 1000) {
      await track("slow_request", {
        path: pathname,
        responseTime,
        userAgent,
      });
    }
  }

  // Add performance headers
  response.headers.set("X-Response-Time", `${responseTime}ms`);
  response.headers.set("X-Cache-Status", "MISS"); // Update based on your caching strategy

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

