//src/app/api/auth/reset-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    // Validate input
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Validate password strength (basic validation)
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const { data: user, error: userError } = await supabaseAdmin
      .from("user_exists")
      .select("id, email, username, reset_token, reset_token_expiry")
      .eq("reset_token", token)
      .single();

    // Check if token exists
    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    const tokenExpiry = new Date(user.reset_token_expiry);

    if (now > tokenExpiry) {
      // Clean up expired token
      await supabaseAdmin
        .from("user_exists")
        .update({
          reset_token: null,
          reset_token_expiry: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      return NextResponse.json(
        {
          error:
            "Reset token has expired. Please request a new password reset.",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and clear reset token (single-use)
    const { error: updateError } = await supabaseAdmin
      .from("user_exists")
      .update({
        hashed_password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json({
      message:
        "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    // Handle bcrypt errors
    if (error.name === "Error" && error.message.includes("bcrypt")) {
      return NextResponse.json(
        { error: "Password processing error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while resetting your password" },
      { status: 500 }
    );
  }
}
