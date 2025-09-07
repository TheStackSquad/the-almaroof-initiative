//src/app/api/permits/create/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    console.log("--- API Route: /api/permits/create POST request received ---");

    // 1. Get the token from the HttpOnly cookie
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");

    if (!tokenCookie) {
      console.log("❌ No auth token cookie found for permit creation.");
      return NextResponse.json(
        { message: "Authentication token is missing." },
        { status: 401 }
      );
    }

    const token = tokenCookie.value;
    console.log("✅ Auth token found.");

    // 2. Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    console.log("✅ Token decoded. User ID:", userId);

    if (!userId) {
      console.log("❌ No user ID found in token.");
      return NextResponse.json(
        { message: "Invalid user context." },
        { status: 401 }
      );
    }

    // 3. Get request body
    const permitData = await request.json();
    console.log("✅ Request body parsed. Received data:", permitData);

    // 4. Validate required fields
    const requiredFields = {
      full_name: "Full name is required",
      email: "Email is required",
      phone: "Phone is required",
      permit_type: "Permit type is required",
      application_type: "Application type is required",
      amount: "Amount is required",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !permitData[field])
      .map(([_, message]) => message);

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields.join(", "));
      return NextResponse.json(
        { message: missingFields.join(", ") },
        { status: 400 }
      );
    }

    console.log("🏗️ Creating permit for user:", userId);

    const insertData = {
      full_name: permitData.full_name.trim(),
      email: decoded.email || permitData.email.trim(),
      phone: permitData.phone.trim(),
      permit_type: permitData.permit_type,
      application_type: permitData.application_type,
      amount: permitData.amount,
      user_id: userId,
      // CORRECTED: The database 'permits_status_check' constraint
      // does not allow the value 'unpaid'.
      // The `users_update_retryable_permits` policy suggests 'pending_payment'
      // is a valid status for new insertions.
      status: "pending_payment",
    };

    console.log(
      "Attempting to insert the following data into 'permits' table:",
      insertData
    );

    const { data, error } = await supabaseAdmin
      .from("permits")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("🚨 Supabase insertion failed:", error);
      console.error("Supabase error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      throw error;
    }

    console.log("✅ Permit created successfully:", data.id);
    console.log("Successfully created permit data:", data);
    console.log("--- API Route: /api/permits/create request completed ---");

    return NextResponse.json(
      {
        success: true,
        message: "Permit created successfully",
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🚨 Permit creation API error:", error.message);

    // Handle JWT errors
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      const response = NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );

      // Clear invalid cookie
      response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      {
        message: error.message || "Failed to create permit",
      },
      { status: 500 }
    );
  }
}
