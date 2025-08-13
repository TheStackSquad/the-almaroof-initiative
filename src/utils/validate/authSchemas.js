// src/utils/validate/authSchemas.js

import { z } from "zod";





// Phone number validation - supports Nigerian format
const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must not exceed 15 digits")
  .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
  .transform((phone) => phone.replace(/\D/g, "")); // Remove non-digits for processing

// Email validation with common domains
const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(5, "Email must be at least 5 characters")
  .max(100, "Email must not exceed 100 characters");

// Name validation - allows letters, spaces, hyphens, apostrophes
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must not exceed 50 characters")
  .regex(
    /^[a-zA-Z\s\-']+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

// Passcode validation - 6 digits only
const passcodeSchema = z
  .string()
  .length(6, "Passcode must be exactly 6 digits")
  .regex(/^\d{6}$/, "Passcode must contain only digits");

// Security question validation - not empty, reasonable length
const securityQuestionSchema = z
  .string()
  .min(10, "Security question must be at least 10 characters")
  .max(200, "Security question must not exceed 200 characters")
  .trim();

// Security answer validation - not empty, reasonable length
const securityAnswerSchema = z
  .string()
  .min(2, "Security answer must be at least 2 characters")
  .max(100, "Security answer must not exceed 100 characters")
  .trim();

// Passcode hint validation - optional but if provided, must meet criteria
const passcodeHintSchema = z
  .string()
  .max(100, "Passcode hint must not exceed 100 characters")
  .optional()
  .or(z.literal(""));

// User identifier - must be either phone or email
const userIdentifierSchema = z
  .object({
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: "Either phone number or email is required",
  });

// === AUTHENTICATION MODE SCHEMAS ===

// Mode 1: SignUp with Security Info
export const signUpWithSecuritySchema = z.object({
  // Step 1: User Info
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneSchema,
  email: emailSchema,

  // Step 2: Security Setup
  securityQuestion: securityQuestionSchema,
  securityAnswer: securityAnswerSchema,
  passcodeHint: passcodeHintSchema,
});

// Mode 2: SignIn Check - validate user exists
const signInCheckSchema = z.object({
  identifier: z.string().trim().min(1, { message: "Identifier is required" }),
  passcode: z.string().trim().min(1, { message: "Passcode is required" }),
  type: z.enum(["email", "phone"], {
    message: "Identifier type must be 'email' or 'phone'",
  }),
});

// Mode 3: Recovery Initiate - start password recovery
export const recoveryInitiateSchema = z.object({
  identifier: z.string().min(1, "Phone number or email is required"), // Will be validated as phone or email in handler
  type: z.enum(["phone", "email"], {
    required_error: "Identifier type is required",
  }),
});

// Mode 4: Change Passcode - update existing passcode
export const changePasscodeSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  currentPasscode: passcodeSchema,
});

// === VERIFICATION SCHEMAS ===

// Passcode verification - used across all modes
export const verifyPasscodeSchema = z.object({
  identifier: z.string().min(1, "Phone number or email is required"),
  passcode: passcodeSchema,
  type: z.enum(["signup", "signin", "recovery", "change"], {
    required_error: "Passcode type is required",
  }),
});

// Security answer verification - used in recovery mode
export const verifySecurityAnswerSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  securityAnswer: securityAnswerSchema,
});

// Resend passcode request
export const resendPasscodeSchema = z.object({
  identifier: z.string().min(1, "Phone number or email is required"),
  type: z.enum(["phone", "email"], {
    required_error: "Identifier type is required",
  }),
  mode: z.enum(["signup", "signin", "recovery", "change"], {
    required_error: "Authentication mode is required",
  }),
});

// === HELPER VALIDATION FUNCTIONS ===

// Validate and format phone number to E164 format
export const validateAndFormatPhone = (phoneNumber) => {
  try {
    const validated = phoneSchema.parse(phoneNumber); // Remove non-digits

    // Format to E164 for Nigerian numbers
    let cleanNumber = validated;
    if (cleanNumber.startsWith("234")) {
      return `+${cleanNumber}`;
    }
    if (cleanNumber.startsWith("0")) {
      cleanNumber = `234${cleanNumber.substring(1)}`;
    } else if (!cleanNumber.startsWith("234")) {
      cleanNumber = `234${cleanNumber}`;
    }

    // Final length check for valid Nigerian numbers
    if (cleanNumber.length >= 13 && cleanNumber.length <= 15) {
      return `+${cleanNumber}`;
    }

    throw new Error("Invalid Nigerian phone number format");
  } catch (error) {
    throw new Error(`Phone validation error: ${error.message}`);
  }
};

// Validate email format
export const validateEmail = (email) => {
  try {
    return emailSchema.parse(email);
  } catch (error) {
    throw new Error(`Email validation error: ${error.message}`);
  }
};

// Validate user identifier (phone or email) and return formatted result
export const validateUserIdentifier = (identifier, type) => {
  if (type === "phone") {
    return {
      type: "phone",
      value: validateAndFormatPhone(identifier),
      original: identifier,
    };
  } else if (type === "email") {
    return {
      type: "email",
      value: validateEmail(identifier),
      original: identifier,
    };
  } else {
    throw new Error("Invalid identifier type. Must be 'phone' or 'email'");
  }
};

// Check if string is likely a phone number or email
export const detectIdentifierType = (identifier) => {
  const cleanIdentifier = identifier.trim();

  // If contains @ symbol, likely email
  if (cleanIdentifier.includes("@")) {
    return "email";
  }

  // If only contains digits, spaces, +, -, (, ), likely phone
  if (/^[\d\s\-\+\(\)]+$/.test(cleanIdentifier)) {
    return "phone";
  }

  // Default to email if unclear
  return "email";
};


// === EXPORT ALL SCHEMAS FOR EASY ACCESS ===
export { signInCheckSchema };
  
export const authSchemas = {
  signUpWithSecurity: signUpWithSecuritySchema,
  signInCheck: signInCheckSchema,
  recoveryInitiate: recoveryInitiateSchema,
  changePasscode: changePasscodeSchema,
  verifyPasscode: verifyPasscodeSchema,
  verifySecurityAnswer: verifySecurityAnswerSchema,
  resendPasscode: resendPasscodeSchema,
};
