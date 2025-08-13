// src/utils/validate/signupFormSchema.js
import { z } from "zod";

export const signupFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  phone_number: z
    .string()
    .regex(
      /^\+234\d{10}$/,
      "Invalid phone number format. Must be +234XXXXXXXXXX."
    ),
  email: z.string().email("Invalid email address."),
});
