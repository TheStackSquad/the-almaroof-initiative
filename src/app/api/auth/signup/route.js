// src/app/api/signup/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export async function POST(request) {
  try {
    // 1. Receive and parse the request body
    const { username, email, phone, password } = await request.json();

    // 2. Server-side validation
    if (!username || !email || !phone || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // You can add more complex validation here, e.g., checking password strength
    // or validating the email format again, but for this example, we'll assume
    // the client-side validation has handled most of it.

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert the new user into the public.users table
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          username,
          email,
          phone,
          hashed_password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle database errors, like duplicate email or username
      console.error("Supabase signup error:", error);
      if (error.code === "23505") {
        // PostgreSQL unique constraint violation
        if (error.details.includes("email")) {
          return NextResponse.json(
            { message: "Email already in use." },
            { status: 409 }
          );
        }
        if (error.details.includes("username")) {
          return NextResponse.json(
            { message: "Username is already taken." },
            { status: 409 }
          );
        }
      }
      return NextResponse.json(
        { message: "Something went wrong during signup." },
        { status: 500 }
      );
    }

    // 5. Send a success response
    // For a real-world app, you might also generate a JWT and return it here.
    return NextResponse.json(
      {
        message: "Account created successfully!",
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          phone: data.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup route error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

