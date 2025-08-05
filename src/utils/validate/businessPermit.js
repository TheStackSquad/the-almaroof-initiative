// src/utils/validate/businessPermit.js

export default function validateBusinessPermit(form) {
  const { full_name, email, phone, permit_type } = form;

  if (!full_name.trim()) {
    return { valid: false, error: "Full name is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Enter a valid email address." };
  }

  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return {
      valid: false,
      error: "Enter a valid phone number (10-15 digits).",
    };
  }

  if (!["new", "renewal"].includes(permit_type)) {
    return { valid: false, error: "Please select a valid permit type." };
  }

  return { valid: true };
}
