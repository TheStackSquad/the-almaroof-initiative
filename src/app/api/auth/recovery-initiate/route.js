// // src/app/api/auth/recovery-initiate/route.js

// import { NextResponse } from "next/server";
// import { initiatePasscodeRecovery } from "@/lib/authService";
// import {
//   recoveryInitiateSchema,
//   validateUserIdentifier,
// } from "@/utils/validate/authSchemas";
// import {
//   recoveryRateLimit,
//   trackAuthAttempt,
// } from "@/middleware/rateLimitCheck/rateLimiting";

// export async function POST(request) {
//   let validatedIdentifier = null;
//   let userId = null;

//   try {
//     // 1. Parse and validate request body
//     const body = await request.json();
//     const { identifier, type } = recoveryInitiateSchema.parse(body);

//     // 2. Validate and format identifier (phone or email)
//     validatedIdentifier = validateUserIdentifier(identifier, type);

//     // 3. Apply rate limiting for recovery attempts
//     const rateLimitResult = await recoveryRateLimit(
//       request,
//       validatedIdentifier.value
//     );
//     if (!rateLimitResult.allowed) {
//       return rateLimitResult; // Returns 429 response
//     }

//     // 4. Initiate recovery process
//     const recoveryResult = await initiatePasscodeRecovery(
//       validatedIdentifier.value,
//       validatedIdentifier.type
//     );

//     userId = recoveryResult.userId;

//     // 5. Track successful attempt
//     await trackAuthAttempt(
//       validatedIdentifier.value,
//       "recovery_initiate",
//       true,
//       userId
//     );

//     // 6. Return success response with security question
//     const response = {
//       success: true,
//       message:
//         "Recovery process initiated. Please answer your security question.",
//       recovery: {
//         userId: recoveryResult.userId,
//         securityQuestion: recoveryResult.securityQuestion,
//         hasPasscodeHint: recoveryResult.hasPasscodeHint,
//         passcodeHint: recoveryResult.passcodeHint,
//       },
//       user: {
//         firstName: recoveryResult.firstName,
//       },
//       instructions: {
//         step: "security_question",
//         description:
//           "Answer the security question to proceed with account recovery.",
//       },
//     };

//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error("🚨 Error in recovery-initiate API:", error);

//     // Track failed attempt if we have identifier
//     if (validatedIdentifier) {
//       await trackAuthAttempt(
//         validatedIdentifier.value,
//         "recovery_initiate",
//         false,
//         userId
//       );
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

//     // Handle security-related errors (don't reveal too much info)
//     if (
//       error.message.includes("account exists") ||
//       error.message.includes("recovery instructions")
//     ) {
//       // Generic response to prevent user enumeration
//       return NextResponse.json(
//         {
//           success: true,
//           message:
//             "If an account exists with this information, recovery instructions will be provided.",
//         },
//         { status: 200 }
//       );
//     }

//     // Handle account locked errors
//     if (error.message.includes("locked")) {
//       return NextResponse.json(
//         {
//           error: "Account locked",
//           message:
//             "Account is temporarily locked. Please wait before attempting recovery.",
//         },
//         { status: 423 }
//       );
//     }

//     // Handle known business logic errors
//     const knownErrors = [
//       "Invalid phone number",
//       "Invalid email format",
//       "Account is locked",
//     ];

//     if (knownErrors.some((known) => error.message.includes(known))) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }

//     // Generic error response (don't reveal system details)
//     return NextResponse.json(
//       {
//         error: "Recovery process failed",
//         message:
//           "Unable to initiate recovery at this time. Please try again later.",
//       },
//       { status: 500 }
//     );
//   }
// }
