// ==============================================
// FILE: src/app/api/auth/logout/route.js
// Description: This endpoint clears the authentication cookie.
// ==============================================

import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ success: true, message: "Logged out" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Clear the HttpOnly cookie by setting its expiration to a past date
  response.cookies.set({
    name: "authToken",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
