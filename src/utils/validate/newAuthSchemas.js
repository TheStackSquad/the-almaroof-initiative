/**
 * Validation schemas for authentication forms
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please enter a valid email address");
  } else if (email.length > 254) {
    errors.push("Email is too long");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: email?.trim() || "",
  };
};

// Password validation
export const validatePassword = (password, isSignUp = false) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
    return { isValid: false, errors, value: password };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Additional password requirements for signup
  if (isSignUp) {
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    if (password.length > 128) {
      errors.push("Password is too long (max 128 characters)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: password,
  };
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  if (!username || !username.trim()) {
    errors.push("Username is required");
  } else if (username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  } else if (username.trim().length > 30) {
    errors.push("Username must be less than 30 characters");
  } else if (!usernameRegex.test(username.trim())) {
    errors.push(
      "Username can only contain letters, numbers, underscores, and hyphens"
    );
  } else if (
    username.trim().startsWith("_") ||
    username.trim().startsWith("-")
  ) {
    errors.push("Username cannot start with underscore or hyphen");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: username?.trim() || "",
  };
};

// Phone validation
export const validatePhone = (phone) => {
  const errors = [];
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  const cleanPhone = phone?.replace(/[\s\-\(\)]/g, "") || "";

  if (!phone || !phone.trim()) {
    errors.push("Phone number is required");
  } else if (!phoneRegex.test(phone.trim())) {
    errors.push("Please enter a valid phone number");
  } else if (cleanPhone.length < 10) {
    errors.push("Phone number must be at least 10 digits");
  } else if (cleanPhone.length > 15) {
    errors.push("Phone number is too long");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: phone?.trim() || "",
  };
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  const errors = [];

  if (!confirmPassword) {
    errors.push("Please confirm your password");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: confirmPassword,
  };
};

// Complete signup form validation
export const validateSignupForm = (formData) => {
  const { username, email, phone, password, confirmPassword } = formData;

  const validations = {
    username: validateUsername(username),
    email: validateEmail(email),
    phone: validatePhone(phone),
    password: validatePassword(password, true), // isSignUp = true
    confirmPassword: validatePasswordConfirmation(password, confirmPassword),
  };

  const errors = {};
  const cleanData = {};
  let isValid = true;

  // Collect errors and clean data
  Object.keys(validations).forEach((field) => {
    const validation = validations[field];
    if (!validation.isValid) {
      errors[field] = validation.errors[0]; // Take first error for UI
      isValid = false;
    }
    cleanData[field] = validation.value;
  });

  return {
    isValid,
    errors,
    cleanData,
  };
};

// Complete signin form validation
export const validateSigninForm = (formData) => {
  const { email, password } = formData;

  const validations = {
    email: validateEmail(email),
    password: validatePassword(password, false), // isSignUp = false
  };

  const errors = {};
  const cleanData = {};
  let isValid = true;

  // Collect errors and clean data
  Object.keys(validations).forEach((field) => {
    const validation = validations[field];
    if (!validation.isValid) {
      errors[field] = validation.errors[0]; // Take first error for UI
      isValid = false;
    }
    cleanData[field] = validation.value;
  });

  return {
    isValid,
    errors,
    cleanData,
  };
};

// Google OAuth data validation
export const validateGoogleAuthData = (googleData) => {
  const errors = [];

  if (!googleData) {
    errors.push("Google authentication data is missing");
    return { isValid: false, errors, cleanData: null };
  }

  const { email, name, id, picture } = googleData;

  if (!email) {
    errors.push("Email is required from Google account");
  } else if (!validateEmail(email).isValid) {
    errors.push("Invalid email from Google account");
  }

  if (!name || !name.trim()) {
    errors.push("Name is required from Google account");
  }

  if (!id) {
    errors.push("Google account ID is missing");
  }

  const cleanData = {
    email: email?.trim() || "",
    name: name?.trim() || "",
    googleId: id || "",
    profilePicture: picture || "",
    provider: "google",
  };

  return {
    isValid: errors.length === 0,
    errors,
    cleanData,
  };
};

// Rate limiting validation (for security)
export const validateAuthAttempts = (
  attempts,
  maxAttempts = 5,
  timeWindow = 15 * 60 * 1000
) => {
  const now = Date.now();
  const recentAttempts = attempts.filter(
    (attempt) => now - attempt < timeWindow
  );

  return {
    isAllowed: recentAttempts.length < maxAttempts,
    attemptsRemaining: Math.max(0, maxAttempts - recentAttempts.length),
    nextAttemptAt:
      recentAttempts.length >= maxAttempts
        ? new Date(recentAttempts[0] + timeWindow)
        : null,
  };
};

// Sanitize input data
export const sanitizeAuthInput = (input) => {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>\"']/g, "") // Remove potentially dangerous characters
    .substring(0, 500); // Limit length
};

// Export all validation functions
export const authSchemas = {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validatePasswordConfirmation,
  validateSignupForm,
  validateSigninForm,
  validateGoogleAuthData,
  validateAuthAttempts,
  sanitizeAuthInput,
};
