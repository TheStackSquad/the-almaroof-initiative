// src/utils/validate/validatePermitForm.js
import { getPermitFee } from "@/config/permitFees";

export default function validatePermitForm(formData) {
  const errors = {};

  // Required field validation
  if (!formData.full_name?.trim()) {
    errors.full_name = "Full name is required";
  } else if (formData.full_name.trim().length < 2) {
    errors.full_name = "Full name must be at least 2 characters";
  }

  // Email validation
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Phone validation
  if (!formData.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
    errors.phone = "Please enter a valid phone number";
  }

  // Permit type validation
  if (!formData.permit_type) {
    errors.permit_type = "Permit type is required";
  }

  // Application type validation
  if (!formData.application_type) {
    errors.application_type = "Application type is required";
  }

  // Amount validation
  if (!formData.amount || formData.amount <= 0) {
    errors.amount = "Amount is required";
  } else if (formData.permit_type && formData.application_type) {
    const expectedAmount = getPermitFee(
      formData.permit_type,
      formData.application_type
    );
    if (parseInt(formData.amount) !== expectedAmount) {
      errors.amount = `Incorrect amount. Expected ${(
        expectedAmount / 100
      ).toLocaleString()} for ${
        formData.application_type
      } ${formData.permit_type.replace("-", " ")}`;
    }
  }

  return errors;
}
