// src/app/api/auth/signup/route.js

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { generateAuthToken } from "@/lib/authService/token";
import { cookies } from "next/headers";
import { rateLimit } from "@/middleware/rate/signupRateLimit";
import { sanitizeInput } from "@/utils/sanitize/sanitizeInput";
import { signupSchema } from "@/utils/validate/signup-validate";
import { sendMail } from "@/lib/nodemailer";
import crypto from "crypto";

const isDevelopment = process.env.NODE_ENV === "development";
const isDebugMode = process.env.DEBUG_SIGNUP === "true";
const BCRYPT_SALT_ROUNDS = 12;

function debugLog(requestId, message, data = null) {
  if (isDevelopment || isDebugMode) {
    if (data) {
      console.log(`[${requestId}] ${message}`, data);
    } else {
      console.log(`[${requestId}] ${message}`);
    }
  }
}

function errorLog(requestId, message, error = null) {
  if (error) {
    console.error(`[${requestId}] ${message}`, error);
  } else {
    console.error(`[${requestId}] ${message}`);
  }
}

function warnLog(requestId, message, data = null) {
  if (data) {
    console.warn(`[${requestId}] ${message}`, data);
  } else {
    console.warn(`[${requestId}] ${message}`);
  }
}

// Asynchronous function to handle email sending in the background
async function sendWelcomeEmailAsync(email, username, requestId) {
  try {
    const subject = "Welcome to Our Platform!";
    const html = `
      <h1>Welcome, ${username}!</h1>
      <p>Your account has been successfully created. We are excited to have you on board!</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Thanks,<br/>The Team</p>
    `;
    debugLog(requestId, `Attempting to send welcome email asynchronously...`);
    const emailResult = await sendMail(email, subject, html);
    if (emailResult.success) {
      debugLog(
        requestId,
        `Welcome email sent successfully. Message ID: ${emailResult.messageId}`
      );
    } else {
      errorLog(
        requestId,
        `Failed to send welcome email. Reason: ${emailResult.error}`
      );
    }
  } catch (emailError) {
    errorLog(
      requestId,
      `Nodemailer sendMail failed unexpectedly during async send:`,
      emailError
    );
  }
}

export async function POST(request) {
  const startTime = Date.now();
  const requestId =
    request.headers.get("X-Request-ID") ||
    `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  const clientIP =
    request.headers.get("X-Forwarded-For") ||
    request.headers.get("X-Real-IP") ||
    "unknown";
  const userAgent = request.headers.get("User-Agent");

  debugLog(
    requestId,
    `Signup request start. IP: ${clientIP}, User-Agent: ${userAgent}`
  );

  try {
    // Stage 1: Rate Limiting
    debugLog(requestId, `Applying rate limit for IP: ${clientIP}`);
    const rateLimitResult = await rateLimit(`signup:${clientIP}`, 5, 900);
    debugLog(requestId, `Rate limit check result:`, rateLimitResult);

    if (!rateLimitResult.success) {
      warnLog(requestId, `Rate limit exceeded. Final status: 429`);
      return NextResponse.json(
        {
          success: false,
          message: "Too many signup attempts. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      );
    }

    // Stage 2: Payload Parsing & Sanitization
    debugLog(requestId, `Parsing request body...`);
    const requestPayload = await request.json();
    debugLog(requestId, `Raw request payload received:`, requestPayload);

    const sanitizedPayload = {
      username: sanitizeInput(requestPayload.username),
      email: sanitizeInput(requestPayload.email),
      phone: sanitizeInput(requestPayload.phone),
      password: requestPayload.password,
      confirmPassword: requestPayload.password,
    };
    debugLog(requestId, `Payload after sanitization:`, sanitizedPayload);

    // Stage 3: Schema Validation
    debugLog(requestId, `Running schema validation...`);
    const validationResult = signupSchema.safeParse(sanitizedPayload);

    if (!validationResult.success) {
      let errors = [];
      try {
        if (validationResult.error?.errors?.length > 0) {
          errors = validationResult.error.errors.map((err) => ({
            field: err.path?.[0] || "unknown",
            message: err.message || "Invalid value",
          }));
        } else {
          errors = [
            {
              field: "general",
              message: "Validation failed - please check your input",
            },
          ];
        }
      } catch (errorMappingError) {
        errorLog(
          requestId,
          `Error mapping validation errors:`,
          errorMappingError
        );
        errors = [
          {
            field: "general",
            message: "Validation error occurred",
          },
        ];
      }

      warnLog(requestId, `Validation failed. Errors:`, errors);
      debugLog(requestId, `Raw validation error:`, validationResult.error);
      warnLog(requestId, `Final status: 400`);

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    debugLog(requestId, `Validation successful.`);
    const { username, email, phone, password } = validationResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Stage 4: Check for Duplicates in user_exists table
    debugLog(
      requestId,
      `Checking for existing user data in user_exists table...`
    );

    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from("user_exists")
      .select("id, email, username, phone")
      .or(
        `username.eq.${username},phone.eq.${phone},email.eq.${normalizedEmail}`
      )
      .maybeSingle();

    if (checkError) {
      errorLog(requestId, `Database check error:`, checkError);
      return NextResponse.json(
        { success: false, message: "Database error occurred." },
        { status: 500 }
      );
    }

    if (existingUsers) {
      debugLog(requestId, `Duplicate user data detected:`, existingUsers);
      let message = "Account already exists";
      if (existingUsers.username === username) {
        message = "Username already exists";
      } else if (existingUsers.phone === phone) {
        message = "Phone number already registered";
      } else if (existingUsers.email === normalizedEmail) {
        message = "Email address already registered";
      }

      warnLog(requestId, `Duplicate detected: ${message}. Final status: 409`);
      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    debugLog(requestId, `No duplicate user found. Proceeding with creation.`);

    // Stage 5: Hash Password
    debugLog(requestId, `Hashing password...`);
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Stage 6: Create User in user_exists table
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    debugLog(requestId, `Creating user in user_exists table...`);
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("user_exists")
      .insert([
        {
          id: userId,
          username,
          email: normalizedEmail,
          phone,
          hashed_password: hashedPassword,
          failed_attempts_count: 0,
          is_verified: false, // Can be set to true if you don't need email verification
          account_locked_until: null,
          created_at: now,
          updated_at: now,
          last_sign_in: null,
          profile_data: {
            sub: userId,
            email: normalizedEmail,
            phone,
            username,
            ip_address: clientIP,
            user_agent: userAgent,
            created_via: "signup_form",
            email_verified: false,
            phone_verified: false,
          },
        },
      ])
      .select()
      .single();

    if (createError) {
      errorLog(requestId, `User creation error:`, createError);
      let userMessage = "Account creation failed. Please try again.";

      if (createError.code === "23505") {
        // Unique constraint violation
        userMessage = "An account with this information already exists.";
      }

      warnLog(requestId, `User creation failed. Final status: 400`);
      return NextResponse.json(
        { success: false, message: userMessage },
        { status: 400 }
      );
    }

    debugLog(requestId, `User created successfully:`, {
      id: newUser.id,
      email: newUser.email,
    });

    // Stage 7: Generate JWT Token (Auto-login)
    debugLog(requestId, `Generating JWT token for auto-login...`);
    const token = await generateAuthToken(newUser);

    // Stage 8: Set Secure Session Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Stage 9: Return Success Response Immediately
    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      phone: newUser.phone,
      is_verified: newUser.is_verified,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      profile_data: newUser.profile_data,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
        user: userData,
        tokenExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
      { status: 201 }
    );

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");

    debugLog(
      requestId,
      `Returning success response to client. Duration: ${
        Date.now() - startTime
      }ms`
    );

    // Stage 10: Send Welcome Email Asynchronously (fire-and-forget)
    // We don't await this so the client response is not blocked.
    sendWelcomeEmailAsync(normalizedEmail, username, requestId);

    debugLog(requestId, `Request finished in ${Date.now() - startTime}ms`);

    return response;
  } catch (error) {
    errorLog(requestId, `Uncaught signup route error:`, error);
    errorLog(requestId, `Error stack:`, error.stack);
    errorLog(requestId, `Final status: 500`);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
        requestId,
      },
      { status: 500 }
    );
  } finally {
    const duration = Date.now() - startTime;
    debugLog(requestId, `Request finished in ${duration}ms`);
  }
}
