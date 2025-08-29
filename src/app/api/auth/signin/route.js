// src/app/api/auth/signin/route.js

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { generateAuthToken } from "@/lib/authService/token";
import { validateSigninData } from "@/middleware/validate";
import { handleFailedAttempts } from "@/middleware/rate/handleFailedAttempts";
import { cookies } from "next/headers";

const BCRYPT_SALT_ROUNDS = 10;
const DUMMY_PASSWORD = "dummy_value_$#@!2024"; // More realistic dummy

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Server-Side Validation
    const validation = validateSigninData({ email, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    // 2. Fetch ONLY necessary user fields for security
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select(
        "id, hashed_password, account_locked_until, failed_attempts_count, email, username, phone"
      )
      .eq("email", email)
      .single();

    // 3. TIMING ATTACK FIX: Use constant-time comparison regardless of user existence
    let comparisonHash;
    let userExists = false;

    if (fetchError || !user) {
      // User doesn't exist - use dummy hash
      comparisonHash = await bcrypt.hash(DUMMY_PASSWORD, BCRYPT_SALT_ROUNDS);
      console.warn(`Authentication attempt for non-existent email: ${email}`);
    } else {
      // User exists - use actual hash
      comparisonHash = user.hashed_password;
      userExists = true;

      // 4. Brute-Force Protection Check (only for existing users)
      const now = new Date();
      if (
        user.account_locked_until &&
        new Date(user.account_locked_until) > now
      ) {
        return NextResponse.json(
          { message: "Account locked. Please try again later." },
          { status: 403 }
        );
      }
    }

    // 5. Verify Password (constant-time regardless of user existence)
    const passwordsMatch = await bcrypt.compare(password, comparisonHash);

    if (!passwordsMatch) {
      // Only handle failed attempts if user actually exists
      if (userExists) {
        await handleFailedAttempts(user);
      }
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 6. Handle Success (only reached if user exists AND password matches)
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        is_verified: true,
        failed_attempts_count: 0,
        account_locked_until: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(
        "Error updating user record after sign-in:",
        updateError.message
      );
      return NextResponse.json(
        { message: "An internal server error occurred." },
        { status: 500 }
      );
    }

    // 7. Generate secure JWT
    const token = await generateAuthToken(user);

    // 8. Return minimal safe user data (no sensitive fields)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      is_verified: true,
      // Include phone only if absolutely necessary
      ...(user.phone && { phone: user.phone }),
    };

    // Secure logging
    console.log("Successful sign-in for user:", user.id);

    // 9. Set secure HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // Add maxAge for better session management
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 10. Return success response
    return NextResponse.json(
      {
        message: "Signed in successfully!",
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    // Secure error logging
    console.error("Sign-in route error:", error.name);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
