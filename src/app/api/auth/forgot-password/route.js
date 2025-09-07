//src/app/api/auth/forgot-password/route.js\

import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Validate email input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists in database
    const { data: user, error: userError } = await supabaseAdmin
      .from("user_exists")
      .select("id, email, username")
      .eq("email", email)
      .single();

    if (userError || !user) {
      // Security: Don't reveal if email exists or not
      return NextResponse.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    const { error: updateError } = await supabaseAdmin
      .from("user_exists")
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: "Failed to process password reset request" },
        { status: 500 }
      );
    }

    // Create password reset URL
    const resetUrl = `${req.headers.get(
      "origin"
    )}/reset-password?token=${resetToken}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Email template
    const mailOptions = {
      from: gmailUser,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.username || "there"},</p>
          <p>A password reset was requested for your account. If you did not make this request, please ignore this email.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
              style="background-color: #3b82f6; 
                     color: white; 
                     padding: 12px 24px; 
                     text-decoration: none; 
                     border-radius: 8px; 
                     font-weight: bold; 
                     display: inline-block;">
              Reset Your Password
            </a>
          </div>
          
          <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from ${req.headers.get("origin")}. 
            If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    return NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    // Handle specific errors
    if (error.code === "EAUTH") {
      console.error("Gmail authentication failed. Check your credentials.");
      return NextResponse.json(
        { error: "Email service configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
