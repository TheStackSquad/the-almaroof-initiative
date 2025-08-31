// src/app/api/security/events/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Initialize Supabase admin client for inserting logs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Secret for hashing IPs (use a dedicated secret for this)
const IP_HASH_SECRET =
  process.env.IP_HASH_SECRET || "fallback-secret-change-in-prod";

/**
 * Hashes an IP address for privacy-conscious storage.
 * Uses HMAC-SHA256 with a secret key to make it irreversible without the key.
 * @param {string} ip - The IP address to hash
 * @returns {string} The hashed IP address
 */
function hashIpAddress(ip) {
  // If no IP is provided (e.g., in development), return a placeholder
  if (!ip || ip === "client_side_unknown") {
    return "not_available";
  }
  // Remove port number if present (e.g., from "::1" or "127.0.0.1:12345")
  const cleanIp = ip.split(":")[0];
  return crypto
    .createHmac("sha256", IP_HASH_SECRET)
    .update(cleanIp)
    .digest("hex");
}

export async function POST(request) {
  // Step 1: Get the client's real IP address from headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

  // Step 2: Hash the IP for privacy
  const hashedIp = hashIpAddress(realIp);

  let eventData;
  try {
    // Step 3: Parse and validate the incoming event
    eventData = await request.json();

    // Basic validation
    if (!eventData.type || !eventData.timestamp) {
      console.error(
        "Invalid security event: missing type or timestamp",
        eventData
      );
      return NextResponse.json(
        { error: "Invalid event data: type and timestamp are required" },
        { status: 400 }
      );
    }

    // Step 4: Prepare data for insertion into Supabase
    const supabasePayload = {
      event_id: eventData.id,
      type: eventData.type,
      timestamp: new Date(eventData.timestamp).toISOString(),
      user_id: eventData.userId || null, // Extract userId from details
      session_id: eventData.sessionId,
      user_agent: eventData.userAgent,
      ip_address: hashedIp, // Use the server-hashed IP, not the client's value
      details: { ...eventData }, // Store the entire original event for context
    };

    // Step 5: Insert the security event into the database
    const { data, error } = await supabaseAdmin
      .from("security_events")
      .insert(supabasePayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase insertion error for security event:", error);
      return NextResponse.json(
        { error: "Failed to store security event" },
        { status: 500 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📝 Security event logged:", {
        type: eventData.type,
        id: data.id,
      });
    }

    // Step 6: Return success response
    return NextResponse.json(
      { message: "Security event logged successfully", id: data.id },
      { status: 201 }
    );
  } catch (error) {
    // Handle JSON parsing errors or other unexpected issues
    console.error("Error processing security event request:", error, eventData);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
