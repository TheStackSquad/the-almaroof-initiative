// src/app/api/auth/verify/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // 1. Validate JWT_SECRET exists
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable not configured");
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    // 2. Get the token from HttpOnly cookie
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");

    if (!tokenCookie) {
      console.log("No auth token cookie found");
      return NextResponse.json(
        { message: "Authentication token is missing." },
        { status: 401 }
      );
    }

    const token = tokenCookie.value;

    // 3. Verify the token securely
    const decoded = jwt.verify(token, JWT_SECRET);

    // Secure logging - no PII exposure
    console.log("Session validated for user ID:", decoded.id || decoded.userId);

    // 4. Extract only essential user data for client
    const userData = {
      id: decoded.id || decoded.userId, // Standardize on 'id'
      email: decoded.email,
      username: decoded.username || null,
      is_verified: decoded.is_verified || decoded.isVerified || false,
      authProvider: decoded.authProvider || "traditional",
      // Only include phone if absolutely necessary for UI
      ...(decoded.phone && { phone: decoded.phone }),
    };

    // 5. Return minimal safe user data
    return NextResponse.json(
      {
        message: "Session is valid.",
        user: userData,
        authProvider: userData.authProvider,
        lastLoginAt: decoded.lastLoginAt || new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    // Secure error logging without exposing details
    if (error.name === "TokenExpiredError") {
      console.log("Token expired - requiring reauthentication");
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid token format received");
    } else {
      console.error("Token verification error type:", error.name);
    }

    // Clear invalid cookie securely
    const response = NextResponse.json(
      { message: "Session token is invalid or expired." },
      { status: 401 }
    );

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  }
}
