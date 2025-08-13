// src/middleware/validate.js

export const validateSigninData = (data) => {
  // Check for the presence of email and password
  if (!data.email) {
    return { isValid: false, message: "Email is required." };
  }
  if (!data.password) {
    return { isValid: false, message: "Password is required." };
  }

  // Basic email format validation using a simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, message: "Please enter a valid email address." };
  }

  // If all checks pass, the data is valid
  return { isValid: true, message: "Validation successful." };
};
