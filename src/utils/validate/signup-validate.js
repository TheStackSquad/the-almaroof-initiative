//src/utils/validate/signup-validate.js

import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// A standalone schema for validating user emails.
export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// A standalone schema for validating phone numbers.
export const phoneSchema = z.object({
  phone: z.string().refine((phone) => isValidPhoneNumber(phone, "NG"), {
    message: "Please enter a valid Nigerian phone number",
  }),
});

// A schema to validate the new password and its confirmation.
export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_+-=[]{}|;:,.<>?]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Main signup schema
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),

    email: z
      .string()
      .min(1, "Email is required.")
      .email("Email is invalid.")
      .toLowerCase()
      .trim(),

    phone: z
      .string()
      .min(1, "Phone number is required.")
      .refine((phone) => isValidPhoneNumber(phone, "NG"), {
        message: "Please enter a valid Nigerian phone number",
      }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/, // ← Simple: any non-alphanumeric character
        "Password must contain at least one special character"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// A utility function to validate an object against a given schema
export const validateForm = (schema, data) => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    // Handle non-Zod errors or Zod errors without .errors property
    if (!error.errors || !Array.isArray(error.errors)) {
      console.error("Unexpected error type:", error);
      return {
        isValid: false,
        errors: { _general: "Validation failed unexpectedly" },
      };
    }

    const errors = {};
    error.errors.forEach((err) => {
      if (err.path[0]) {
        errors[err.path[0]] = err.message;
      }
    });
    return { isValid: false, errors };
  }
};

// Now returns both isValid and errors
export const validateSignupForm = (formData) => {
  return validateForm(signupSchema, formData);
};
