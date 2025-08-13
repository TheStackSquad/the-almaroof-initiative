// src/app/api/auth/validate-token/route.js
// Description: This endpoint securely validates the JWT on the server.
// It reads the token from an HttpOnly cookie.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin"; // Use our admin client for secure access

export async function GET(request) {
  // Get the token from the HttpOnly cookie
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        isAuthenticated: false,
        message: "No token provided.",
      },
      { status: 401 }
    );
  }

  try {
    // Use Supabase's built-in JWT verification
    // Note: We use supabaseAdmin to verify the token securely on the server
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("Supabase auth verification failed:", authError);
      return NextResponse.json(
        {
          isAuthenticated: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    // Since a user was found, we can now fetch their full profile from our 'users' table
    // to get the most up-to-date information.
    const { data: userProfile, error: dbError } = await supabaseAdmin
      .from("users")
      .select("id, username, email, phone")
      .eq("id", user.id) // Assuming a foreign key relationship with Supabase auth.users
      .single();

    if (dbError || !userProfile) {
      console.error("Failed to fetch user profile:", dbError);
      return NextResponse.json(
        {
          isAuthenticated: false,
          message: "User profile not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        phone: userProfile.phone,
      },
    });
  } catch (error) {
    console.error("Server-side token validation error:", error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
