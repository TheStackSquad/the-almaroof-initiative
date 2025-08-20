// src/app/api/auth/verify/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // 1. Get the token from the HttpOnly cookie - await cookies() in Next.js 15
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");

    if (!tokenCookie) {
      console.log("❌ No auth token cookie found.");
      return NextResponse.json(
        { message: "Authentication token is missing." },
        { status: 401 }
      );
    }

    const token = tokenCookie.value;

    // --- LOGGING FOR DEBUGGING ---
    const decodedPayload = jwt.decode(token);
    console.log("🕵️‍♂️ Token Payload (for debugging):", decodedPayload);
    // --- END LOGGING ---

    // 3. Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Extract complete user data from token payload
    const userData = {
      id: decoded.userId || decoded.id, // Handle both userId and id
      userId: decoded.userId || decoded.id, // Ensure userId is always available
      email: decoded.email,
      phone: decoded.phone || null,
      username: decoded.username || null,
      is_verified: decoded.isVerified || decoded.is_verified || false,
      created_at: decoded.created_at || null,
      updated_at: decoded.updated_at || null,
      last_login_attempt: decoded.last_login_attempt || null,
      failed_attempts_count: decoded.failed_attempts_count || 0,
      account_locked_until: decoded.account_locked_until || null,
      authProvider: decoded.authProvider || "traditional",
      lastLoginAt: decoded.lastLoginAt || new Date().toISOString(),
    };

    console.log("✅ Returning complete user data:", userData);

    // 5. Return complete user data matching signin structure
    return NextResponse.json(
      {
        message: "Session is valid.",
        user: userData,
        authProvider: userData.authProvider,
        lastLoginAt: userData.lastLoginAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Token verification failed:", error.message);

    // Clear invalid cookie
    const response = NextResponse.json(
      { message: "Session token is invalid or expired." },
      { status: 401 }
    );

    // Clear the invalid cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return response;
  }
}
