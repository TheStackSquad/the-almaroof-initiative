// src/app/api/auth/refresh/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
// Import your token generation function for consistency
import { generateAuthToken } from "@/lib/authService/token";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function POST() {
  // Note: No need for 'request' parameter
  try {
    // 1. Get the refresh token from the HttpOnly cookie
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refresh_token");

    if (!refreshTokenCookie) {
      return NextResponse.json(
        { message: "No refresh token provided" },
        { status: 401 }
      );
    }

    const refreshToken = refreshTokenCookie.value;

    // 2. Verify the refresh token using its specific secret
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // 3. Fetch the latest user data from the database
    // This ensures the user's data (e.g., username) is up-to-date in the JWT and Redux state.
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, username, phone, is_verified")
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    // 4. Generate a new access token using the central function
    const newToken = await generateAuthToken(user); // Uses JWT_SECRET internally

    // 5. Calculate the expiry for the client-side state
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // Match sign-in

    // 6. Create the response
    const response = NextResponse.json(
      {
        message: "Token refreshed",
        user: {
          // RETURN THE SAME USER PAYLOAD AS SIGN-IN
          id: user.id,
          email: user.email,
          username: user.username,
          ...(user.phone && { phone: user.phone }),
          is_verified: user.is_verified,
        },
        tokenExpiry: tokenExpiry, // Send the expiry so the client can update its state
      },
      { status: 200 }
    );

    // 7. Set the new access token in an HttpOnly cookie
    response.cookies.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    // 8. (Optional, for rotation) Set a new refresh token
    // const newRefreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    // response.cookies.set("refresh_token", newRefreshToken, { ...same secure settings });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      // Clear invalid cookies
      const response = NextResponse.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 }
      );
      response.cookies.set("refresh_token", "", { maxAge: 0 });
      response.cookies.set("auth_token", "", { maxAge: 0 }); // Also clear the potentially invalid access token
      return response;
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
