// src/app/api/auth/verify/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Use an environment variable for the secret key.
// It must match the secret used in your sign-in route.
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // 1. Get the token from the HttpOnly cookie.
    // The cookies() function must be awaited as it's a dynamic API in Next.js.
    const tokenCookie = await cookies().get("auth_token");

    // 2. If the cookie is not present, the session is invalid.
    if (!tokenCookie) {
      console.log("❌ No auth token cookie found.");
      return NextResponse.json(
        { message: "Authentication token is missing." },
        { status: 401 } // Unauthorized
      );
    }

    const token = tokenCookie.value;

    // --- LOGGING FOR DEBUGGING ---
    // Safely decode the token to inspect its contents without verifying the signature
    const decodedPayload = jwt.decode(token);
    console.log("🕵️‍♂️ Token Payload (for debugging):", decodedPayload);
    // --- END LOGGING ---

    // 3. Verify the token. This is a stateless, fast check.
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. On success, return the user payload.
    return NextResponse.json(
      {
        message: "Session is valid.",
        user: {
          id: decoded.id,
          email: decoded.email,
        },
      },
      { status: 200 } // OK
    );
  } catch (error) {
    // 5. If verification fails (e.g., token expired or invalid), return 401.
    console.error("🚨 Token verification failed:", error.message);
    return NextResponse.json(
      { message: "Session token is invalid or expired." },
      { status: 401 } // Unauthorized
    );
  }
}
