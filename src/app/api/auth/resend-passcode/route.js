// // src/app/api/auth/resend-passcode/route.js

// import { NextResponse } from "next/server";
// import {
//   getUserByIdentifier,
//   generateAndSetPasscode,
// } from "@/lib/authService";
// import {
//   resendPasscodeSchema,
//   validateUserIdentifier,
// } from "@/utils/validate/authSchemas";
// import {
//   sendPasscodeRateLimit,
//   trackAuthAttempt,
// } from "@/middleware/rateLimitCheck/rateLimiting";
// import { checkAccountStatus } from "@/utils/security/securityHelpers";

// export async function POST(request) {
//   let validatedIdentifier = null;
//   let userId = null;

//   try {
//     // 1. Parse and validate request body
//     const body = await request.json();
//     const { identifier, type, mode } = resendPasscodeSchema.parse(body);

//     // 2. Validate and format identifier (phone or email)
//     validatedIdentifier = validateUserIdentifier(identifier, type);

//     // 3. Apply rate limiting (more restrictive for resends)
//     const rateLimitResult = await sendPasscodeRateLimit(
//       request,
//       validatedIdentifier.value
//     );
//     if (!rateLimitResult.allowed) {
//       return rateLimitResult; // Returns 429 response
//     }

//     // 4. Check if user exists
//     const user = await getUserByIdentifier(
//       validatedIdentifier.value,
//       validatedIdentifier.type
//     );

//     if (!user) {
//       // Don't reveal that user doesn't exist for security
//       await trackAuthAttempt(
//         validatedIdentifier.value,
//         "resend_passcode",
//         false
//       );

//       return NextResponse.json(
//         {
//           success: true,
//           message:
//             "If an account exists with this information, a new passcode has been sent.",
//         },
//         { status: 200 }
//       );
//     }

//     userId = user.id;

//     // 5. Check account status
//     const accountStatus = checkAccountStatus(user);

//     if (!accountStatus.canAttemptAuth) {
//       await trackAuthAttempt(
//         validatedIdentifier.value,
//         "resend_passcode",
//         false,
//         userId
//       );

//       return NextResponse.json(
//         {
//           error: "Account access restricted",
//           message: accountStatus.message,
//           lockTimeRemaining: accountStatus.lockTimeRemaining || null,
//         },
//         { status: 423 }
//       );
//     }

//     // 6. Additional checks based on mode
//     if (mode === "signin" && !user.is_verified) {
//       return NextResponse.json(
//         {
//           error: "Account not verified",
//           message:
//             "Please complete account verification first before signing in.",
//         },
//         { status: 403 }
//       );
//     }

//     // 7. Generate and send new passcode
//     const passcodeResult = await generateAndSetPasscode(
//       validatedIdentifier.value,
//       mode,
//       user.id
//     );

//     // 8. Track successful attempt
//     await trackAuthAttempt(
//       validatedIdentifier.value,
//       "resend_passcode",
//       true,
//       userId
//     );

//     // 9. Return success response
//     const response = {
//       success: true,
//       message: "A new passcode has been sent successfully.",
//       resend: {
//         method: passcodeResult.communicationMethod,
//         expiresInMinutes: 10,
//         mode: mode,
//         timestamp: new Date().toISOString(),
//       },
//       user: {
//         firstName: user.first_name,
//         hasPasscodeHint: !!user.passcode_hint,
//         passcodeHint: user.passcode_hint || null,
//       },
//       instructions: {
//         description:
//           "Enter the new passcode sent to your registered contact method.",
//       },
//     };

//     // Include debug info in development
//     if (process.env.NODE_ENV === "development") {
//       response.debug = {
//         newPasscode: passcodeResult.passcode,
//         identifierUsed: validatedIdentifier,
//         communicationDetails: passcodeResult,
//       };
//     }

//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error("🚨 Error in resend-passcode API:", error);

//     // Track failed attempt if we have identifier
//     if (validatedIdentifier) {
//       await trackAuthAttempt(
//         validatedIdentifier.value,
//         "resend_passcode",
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

//     // Handle account locked errors
//     if (error.message.includes("locked") || error.message.includes("wait")) {
//       return NextResponse.json(
//         {
//           error: "Account locked",
//           message:
//             "Account is temporarily locked. Please wait before requesting a new passcode.",
//         },
//         { status: 423 }
//       );
//     }

//     // Handle communication failures
//     if (error.message.includes("Failed to send")) {
//       return NextResponse.json(
//         {
//           error: "Communication failed",
//           message:
//             "Unable to send passcode at this time. Please try again later.",
//         },
//         { status: 500 }
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

//     // Generic success response for security (don't reveal system issues)
//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "If an account exists with this information, a new passcode has been sent.",
//       },
//       { status: 200 }
//     );
//   }
// }
