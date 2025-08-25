// src/app/api/admin/system-stats/route.js

/**
 * API route to get system statistics like uptime and memory usage.
 * This route returns mock data for development purposes.
 */
export async function GET(request) {
  try {
    // Generate a random mock memory usage between 50% and 95%
    const mockMemoryUsage = (Math.random() * (0.95 - 0.5) + 0.5).toFixed(2);
    // Generate a random mock uptime in minutes (up to 12 hours)
    const mockUptimeMinutes = Math.floor(Math.random() * 720);

    const data = {
      uptimeMinutes: mockUptimeMinutes,
      memoryUsage: parseFloat(mockMemoryUsage),
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

