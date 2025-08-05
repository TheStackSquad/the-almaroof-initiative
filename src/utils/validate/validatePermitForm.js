// src/utils/validate/validatePermitForm.js

export default function validatePermitForm(formData) {
  const errors = {};

  if (!formData.full_name || formData.full_name.trim() === "") {
    errors.full_name = "Full name is required";
  }

  if (
    !formData.email ||
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
  ) {
    errors.email = "Valid email is required";
  }

  if (!formData.phone || !/^\d{10,15}$/.test(formData.phone)) {
    errors.phone = "Valid phone number is required";
  }

  if (!formData.permit_type || formData.permit_type !== "business-permit") {
    errors.permit_type = "Permit type must be 'business-permit'";
  }

  return errors;
}
