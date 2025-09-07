// src/app/api/auth/signin/route.js

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { generateAuthToken } from "@/lib/authService/token";
import { validateSigninData } from "@/middleware/validate";
import { handleFailedAttempts } from "@/middleware/rate/handleFailedAttempts";
import { cookies } from "next/headers";
import { rateLimit } from "@/middleware/rate/signupRateLimit";

const BCRYPT_SALT_ROUNDS = 12;
const DUMMY_PASSWORD = "dummy_value_$#@!2024";

export async function POST(request) {
  const startTime = Date.now();
  const requestId =
    request.headers.get("X-Request-ID") ||
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  console.log(`[${requestId}] Sign-in request received.`);

  try {
    // 1. Rate Limiting by IP
    const clientIP =
      request.headers.get("X-Forwarded-For") ||
      request.headers.get("X-Real-IP") ||
      "unknown";

    console.log(`[${requestId}] Checking rate limit for IP: ${clientIP}`);
    const rateLimitResult = await rateLimit(`signin:${clientIP}`, 10, 900);
    if (!rateLimitResult.success) {
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { message: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": rateLimitResult.retryAfter } }
      );
    }

    const { email, password } = await request.json();
    console.log(`[${requestId}] Received data for email: ${email}`);

    // 2. Server-Side Validation
    const validation = validateSigninData({ email, password });
    if (!validation.isValid) {
      console.warn(
        `[${requestId}] Validation failed. Reason: ${validation.message}`
      );
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    // 3. Fetch user with security fields from user_exists table
    const normalizedEmail = email.toLowerCase().trim();
    console.log(
      `[${requestId}] Querying user_exists for user with email: ${normalizedEmail}`
    );

    const { data: user, error: fetchError } = await supabaseAdmin
      .from("user_exists")
      .select(
        `
        id, 
        username,
        email,
        phone,
        hashed_password,
        account_locked_until,
        failed_attempts_count,
        is_verified,
        created_at,
        updated_at,
        last_sign_in,
        profile_data
      `
      )
      .eq("email", normalizedEmail)
      .single();

    // 4. TIMING ATTACK PROTECTION: Constant-time comparison
    let comparisonHash;
    let userExists = false;

    if (fetchError || !user) {
      // User doesn't exist - use dummy hash for timing protection
      comparisonHash = await bcrypt.hash(DUMMY_PASSWORD, BCRYPT_SALT_ROUNDS);
      console.warn(
        `[${requestId}] Authentication attempt for non-existent email: ${normalizedEmail}`
      );
    } else {
      // User exists - use actual hash
      comparisonHash = user.hashed_password;
      userExists = true;
      console.log(`[${requestId}] User found: ${user.id}`);

      // 5. Brute-Force Protection Check (only for existing users)
      const now = new Date();
      if (
        user.account_locked_until &&
        new Date(user.account_locked_until) > now
      ) {
        console.warn(
          `[${requestId}] Account locked until: ${user.account_locked_until}`
        );
        return NextResponse.json(
          { message: "Account locked. Please try again later." },
          { status: 403 }
        );
      }
    }

    // 6. Verify Password (constant-time regardless of user existence)
    console.log(`[${requestId}] Performing password verification`);
    const passwordsMatch = await bcrypt.compare(password, comparisonHash);

    if (!passwordsMatch) {
      console.warn(`[${requestId}] Password verification failed`);
      // Only handle failed attempts if user actually exists
      if (userExists) {
        try {
          await handleFailedAttempts(user);
          console.log(
            `[${requestId}] Failed attempt logged for user ID: ${user.id}`
          );
        } catch (logError) {
          console.error(
            `[${requestId}] Error logging failed attempt:`,
            logError
          );
        }
      }
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 7. Handle Success (only reached if user exists AND password matches)
    console.log(
      `[${requestId}] Password verified successfully. Updating user record.`
    );

    const { error: updateError } = await supabaseAdmin
      .from("user_exists")
      .update({
        is_verified: true,
        failed_attempts_count: 0,
        account_locked_until: null,
        last_sign_in: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(
        `[${requestId}] Error updating user record after sign-in:`,
        updateError
      );
      return NextResponse.json(
        { message: "An internal server error occurred." },
        { status: 500 }
      );
    }

    // 8. Generate secure JWT
    console.log(`[${requestId}] Generating JWT token for user: ${user.id}`);
    const token = await generateAuthToken(user);

    // 9. Return minimal safe user data (no sensitive fields)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      is_verified: true,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_sign_in: new Date().toISOString(),
      profile_data: user.profile_data,
    };

    console.log(`[${requestId}] Successful sign-in for user: ${user.id}`);

    // 10. Set secure HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from strict to lax for better compatibility
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 11. Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully!",
        user: userData,
        tokenExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
      { status: 200 }
    );

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");

    console.log(
      `[${requestId}] Sign-in completed successfully. Duration: ${
        Date.now() - startTime
      }ms`
    );

    return response;
  } catch (error) {
    console.error(`[${requestId}] Critical sign-in error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
