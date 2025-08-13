// // src/app/api/auth/verify-security-answer/route.js

// import { NextResponse } from "next/server";
// import { verifySecurityAnswerAndGeneratePasscode } from "@/lib/authService";
// import { verifySecurityAnswerSchema } from "@/utils/validate/authSchemas";
// import {
//   securityQuestionRateLimit,
//   trackAuthAttempt,
// } from "@/middleware/rateLimitCheck/rateLimiting";

// export async function POST(request) {
//   let userId = null;

//   try {
//     // 1. Parse and validate request body
//     const body = await request.json();
//     const { userId: requestUserId, securityAnswer } =
//       verifySecurityAnswerSchema.parse(body);
//     userId = requestUserId;

//     // 2. Apply rate limiting for security question attempts
//     const rateLimitResult = await securityQuestionRateLimit(request, userId);
//     if (!rateLimitResult.allowed) {
//       return rateLimitResult; // Returns 429 response
//     }

//     // 3. Verify security answer and generate recovery passcode
//     const recoveryResult = await verifySecurityAnswerAndGeneratePasscode(
//       userId,
//       securityAnswer
//     );

//     // 4. Track successful attempt
//     await trackAuthAttempt(userId, "security_answer", true, userId);

//     // 5. Return success response
//     const response = {
//       success: true,
//       message: "Security answer verified. Recovery passcode sent successfully.",
//       recovery: {
//         method: recoveryResult.communicationMethod,
//         expiresInMinutes: 10,
//         message: recoveryResult.message,
//       },
//       instructions: {
//         step: "passcode_verification",
//         description:
//           "Enter the recovery passcode sent to your registered contact method.",
//       },
//     };

//     // Include debug info in development
//     if (process.env.NODE_ENV === "development") {
//       response.debug = {
//         recoveryPasscode: recoveryResult.passcode,
//         communicationDetails: recoveryResult,
//       };
//     }

//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error("🚨 Error in verify-security-answer API:", error);

//     // Track failed attempt
//     if (userId) {
//       await trackAuthAttempt(userId, "security_answer", false, userId);
//     }

//     // Handle validation errors
//     if (error.name === "ZodError") {
//       return NextResponse.json(
//         {
//           error: "Validation failed",
//           details: error.errors.map((err) => ({
//             field: err.path.join("."),
//             message: err.message,
//           })),
//         },
//         { status: 400 }
//       );
//     }

//     // Handle incorrect security answer
//     if (error.message.includes("Incorrect security answer")) {
//       return NextResponse.json(
//         {
//           error: "Incorrect answer",
//           message:
//             "The security answer provided is incorrect. Please try again.",
//         },
//         { status: 401 }
//       );
//     }

//     // Handle user not found
//     if (error.message.includes("User not found")) {
//       return NextResponse.json(
//         {
//           error: "Invalid request",
//           message:
//             "Invalid recovery request. Please start the recovery process again.",
//         },
//         { status: 404 }
//       );
//     }

//     // Handle account locked due to failed attempts
//     if (
//       error.message.includes("failed attempt") ||
//       error.message.includes("locked")
//     ) {
//       return NextResponse.json(
//         {
//           error: "Account locked",
//           message:
//             "Too many incorrect attempts. Account is temporarily locked for security.",
//         },
//         { status: 423 }
//       );
//     }

//     // Handle passcode generation failures
//     if (error.message.includes("Failed to generate")) {
//       return NextResponse.json(
//         {
//           error: "Recovery failed",
//           message:
//             "Unable to generate recovery passcode. Please try again later.",
//         },
//         { status: 500 }
//       );
//     }

//     // Generic error response
//     return NextResponse.json(
//       {
//         error: "Security verification failed",
//         message:
//           "Unable to verify security answer at this time. Please try again later.",
//       },
//       { status: 500 }
//     );
//   }
// }
