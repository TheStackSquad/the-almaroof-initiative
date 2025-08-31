import { z } from "zod";
import { getPermitFee } from "@/config/permitFees";
import DOMPurify from "dompurify";

// Sanitization function
const sanitizeInput = (value) => {
  if (typeof value !== "string") return value;
  return DOMPurify.sanitize(value.trim());
};

// Updated phone validation function
const isValidNGRPhone = (phone) => {
  // More inclusive Nigerian phone validation
  const regex = /^(?:\+234|0|234)?[7-9][0-1]\d{8}$/;
  const cleaned = phone.replace(/\D/g, ''); // Remove all non-digits
  
  // Standardize to 11 digits (0XXXXXXXXXX) for comparison
  let standardized = cleaned;
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    standardized = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('+234') && cleaned.length === 14) {
    standardized = '0' + cleaned.substring(4);
  }
  
  return regex.test(cleaned) && standardized.length === 11;
};

// Create Zod schema
export const permitSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .transform(sanitizeInput)
    .refine((val) => !/[<>{}]/.test(val), "Name contains invalid characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => sanitizeInput(val).toLowerCase()),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform(sanitizeInput)
    .refine(isValidNGRPhone, "Please enter a valid phone number"),

  permit_type: z.string().min(1, "Permit type is required"),

  application_type: z.string().min(1, "Application type is required"),

  // Updated amount validation
  amount: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, "Amount must be a positive number")
    .refine(
      (amount, ctx) => {
        const { permit_type, application_type } = ctx.parent;
        if (!permit_type || !application_type) return true;

        const expectedAmount = getPermitFee(permit_type, application_type);
        return amount === expectedAmount;
      },
      (amount, ctx) => {
        const { permit_type, application_type } = ctx.parent;
        const expectedAmount = getPermitFee(permit_type, application_type);
        return {
          message: `Incorrect amount. Expected ${formatAmount(
            expectedAmount
          )} for ${application_type} ${permit_type.replace("-", " ")}`,
        };
      }
    ),
});

// Create form data version for form submission
export const permitFormDataSchema = permitSchema.transform((val) => ({
  ...val,
  amount: val.amount.toString(), // Convert to string for form data
}));
