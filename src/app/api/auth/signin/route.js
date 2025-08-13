// src/app/api/auth/signin/route.js

/**
 * @file This file is the API route handler for user sign-in. It
 * orchestrates the entire sign-in flow, including validation,
 * brute-force protection, password verification, token generation,
 * and database updates.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Assuming you have bcryptjs installed for password hashing
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { generateAuthToken } from "@/lib/authService/token";
import { validateSigninData } from "@/middleware/validate";
import { handleFailedAttempts } from "@/middleware/rate/handleFailedAttempts";

// Set a threshold for password comparison timing to prevent timing attacks
const BCRYPT_SALT_ROUNDS = 10;


export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Server-Side Validation
    const validation = validateSigninData({ email, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 } // Bad Request
      );
    }

    // 2. Fetch User from Database
    const { data: users, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !users) {
      // Return a generic error message for security to prevent user enumeration
      console.warn(`User with email '${email}' not found.`);
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 } // Unauthorized
      );
    }

    const user = users;

    // 3. Brute-Force Protection Check
    const now = new Date();
    if (
      user.account_locked_until &&
      new Date(user.account_locked_until) > now
    ) {
      return NextResponse.json(
        { message: "Account locked. Please try again later." },
        { status: 403 } // Forbidden
      );
    }

    // 4. Verify Password
    const passwordsMatch = await bcrypt.compare(password, user.hashed_password);

    if (!passwordsMatch) {
      // 5. Handle Failed Attempt & Return Generic Error
      await handleFailedAttempts(user);
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 } // Unauthorized
      );
    }

    // 6. Handle Success
    // Reset failed attempts and set is_verified to true
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
        "🚨 Error updating user record after successful sign-in:",
        updateError
      );
      return NextResponse.json(
        { message: "An internal server error occurred." },
        { status: 500 } // Internal Server Error
      );
    }

    // 7. Generate a secure JWT
    const token = await generateAuthToken(user);
    const userData = { ...user, is_verified: true }; // Update local user object for the response

    // 8. Return a successful response
    return NextResponse.json(
      {
        message: "Signed in successfully!",
        token,
        user: userData,
      },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("🚨 Sign-in route unexpected error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 } // Internal Server Error
    );
  }
}
