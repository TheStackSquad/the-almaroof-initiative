// src/utils/validate/login-validate.js
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export const validateLoginForm = (data) => {
  try {
    loginSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};
