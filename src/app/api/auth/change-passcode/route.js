// // src/app/api/auth/change-passcode/route.js

// import { NextResponse } from "next/server";
// import { changeUserPasscode } from "@/lib/authService/passcode";
// import { sendPasscodeRateLimit } from "@/middleware/rateLimitCheck/rateLimiting";

// /**
//  * Handles the POST request for changing a user's passcode.
//  * This route first verifies the user's current passcode and then generates and sends a new one.
//  * @param {Request} request - The incoming request object.
//  * @returns {Promise<NextResponse>} The JSON response.
//  */
// export async function POST(request) {
//   console.log("===[ API: /api/auth/change-passcode ]===");

//   try {
//     // 1. Extract and validate request body
//     const requestBody = await request.json();
//     const { userId, currentPasscode } = requestBody;

//     console.log("Received request body:", requestBody);

//     if (!userId || !currentPasscode) {
//       console.error("🚨 Missing required fields.");
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     // 2. Apply rate limiting
//     // Note: In a real-world app, you might use the user ID for a more granular limit.
//     // For now, we'll use a simple key.
//     const ip = request.headers.get("x-real-ip") || "unknown"; // Placeholder for IP
//     const rateLimitResult = await sendPasscodeRateLimit(ip);

//     if (rateLimitResult.isLimited) {
//       console.warn("⚠️ Rate limit exceeded for IP:", ip);
//       return NextResponse.json(
//         { error: "Too many passcode requests. Please try again later." },
//         { status: 429 }
//       );
//     }
//     console.log(
//       `✅ Rate limit check passed. Remaining requests: ${rateLimitResult.remaining}`
//     );

//     // 3. Attempt to change the passcode
//     const result = await changeUserPasscode(userId, currentPasscode);
//     console.log("✅ Passcode change successful. Result:", result);

//     // 4. Construct success response
//     const responseData = {
//       message: `A new passcode has been sent to your ${result.communicationMethod}.`,
//       communicationMethod: result.communicationMethod,
//     };

//     if (process.env.NODE_ENV === "development") {
//       responseData.debug = {
//         passcode: result.passcode,
//         fullResult: result,
//       };
//       console.log("Debug info included in response:", responseData.debug);
//     }

//     console.log("Final API response sent with status 200.");
//     return NextResponse.json(responseData, { status: 200 });
//   } catch (error) {
//     console.error("🚨 Error in change-passcode API:", error);

//     // Handle specific errors from the service layer
//     if (error.message.includes("User not found")) {
//       return NextResponse.json({ error: "User not found." }, { status: 404 });
//     }
//     if (error.message.includes("Current passcode is incorrect")) {
//       return NextResponse.json(
//         { error: "Incorrect passcode." },
//         { status: 401 }
//       );
//     }
//     if (error.message.includes("Account is locked")) {
//       return NextResponse.json({ error: error.message }, { status: 403 });
//     }
//     if (error.message.includes("No communication method available")) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(
//       { error: "Internal server error." },
//       { status: 500 }
//     );
//   } finally {
//     console.log("================================\n");
//   }
// }
