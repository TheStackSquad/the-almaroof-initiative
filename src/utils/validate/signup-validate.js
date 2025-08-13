// src/utils/validate/signup-validate.js

export const validateSignup = (formData) => {
  const errors = {};

  if (!formData.first_name) {
    errors.first_name = "First name is required.";
  }
  if (!formData.last_name) {
    errors.last_name = "Last name is required.";
  }
  if (!formData.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid.";
  }
  if (!formData.phone_number) {
    errors.phone_number = "Phone number is required.";
  } else if (!/^\+234\d{10}$/.test(formData.phone_number)) {
    errors.phone_number = "Phone number must be in the format +234XXXXXXXXXX.";
  }

  return errors;
};
