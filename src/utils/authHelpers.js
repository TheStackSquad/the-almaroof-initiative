// src/components/common/user-login/utils/authHelpers.js

export const AUTH_MODES = {
  SELECTOR: "selector",
  SIGNUP: "signup",
  SIGNIN: "signin",
  RECOVERY: "recovery",
  CHANGE: "change",
};

// --- Signup Flow Steps ---
/**
 * Defines the steps within the user signup flow.
 */
export const SIGNUP_STEPS = {
  INFO: "info",
  SECURITY: "security",
  VERIFICATION: "verification",
};

// --- Sign-in Flow Steps ---
/**
 * Defines the steps within the user sign-in flow.
 */
export const SIGNIN_STEPS = {
  CREDENTIALS: "credentials",
  VERIFICATION: "verification",
};

// --- Passcode Recovery Flow Steps ---
/**
 * Defines the steps within the passcode recovery flow.
 */
export const RECOVERY_STEPS = {
  IDENTIFIER: "identifier",
  SECURITY: "security",
  VERIFICATION: "verification",
};

// --- Helper Functions ---

/**
 * Formats the remaining lockout time in minutes or hours.
 * @param {string} lockedUntil The ISO string for when the account lockout ends.
 * @returns {string} A human-readable string of the remaining lockout time.
 */
export const formatLockoutTime = (lockedUntil) => {
  const lockoutDate = new Date(lockedUntil);
  const now = new Date();
  const timeDiff = lockoutDate - now;

  if (timeDiff <= 0) {
    return "Account is unlocked";
  }

  const minutes = Math.ceil(timeDiff / (1000 * 60));

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};

/**
 * Determines the current lock status of an account.
 * @param {{lockedUntil: string, failedAttempts: number}} lockoutInfo Object containing lockout details.
 * @returns {{isLocked: boolean, message: string|null, failedAttempts: number, lockedUntil: string}}
 */
export const getAccountStatus = (lockoutInfo) => {
  if (!lockoutInfo || !lockoutInfo.lockedUntil) {
    return { isLocked: false, message: null };
  }

  const now = new Date();
  const lockedUntil = new Date(lockoutInfo.lockedUntil);

  if (now < lockedUntil) {
    return {
      isLocked: true,
      message: `Account locked for ${formatLockoutTime(
        lockoutInfo.lockedUntil
      )}`,
      failedAttempts: lockoutInfo.failedAttempts,
      lockedUntil: lockoutInfo.lockedUntil,
    };
  }

  return { isLocked: false, message: null };
};

/**
 * Sanitizes user input by trimming whitespace and converting to lowercase.
 * @param {string} input The raw user input string.
 * @returns {string} The sanitized string.
 */
export const sanitizeUserInput = (input) => {
  return input.trim().toLowerCase();
};

/**
 * Masks an email or phone number for display.
 * @param {string} identifier The user's phone number or email.
 * @returns {string} The masked identifier.
 */
export const maskIdentifier = (identifier) => {
  if (identifier.includes("@")) {
    // Email masking
    const [username, domain] = identifier.split("@");
    const maskedUsername =
      username.length > 2
        ? username[0] +
          "*".repeat(username.length - 2) +
          username[username.length - 1]
        : "*".repeat(username.length);
    return `${maskedUsername}@${domain}`;
  } else {
    // Phone number masking
    const cleanNumber = identifier.replace(/[^\d]/g, "");
    if (cleanNumber.length > 4) {
      const visibleDigits = 2;
      const start = cleanNumber.substring(0, visibleDigits);
      const end = cleanNumber.substring(cleanNumber.length - visibleDigits);
      const masked = "*".repeat(cleanNumber.length - visibleDigits * 2);
      return `+${start}${masked}${end}`;
    }
    return identifier;
  }
};

/**
 * Maps a generic error code to a user-friendly message.
 * @param {string} error The error code or message from an API.
 * @param {string} [context=''] An optional context to prepend to the message.
 * @returns {string} A user-friendly error message.
 */
export const getErrorMessage = (error, context = "") => {
  const errorMessages = {
    "Invalid or expired OTP":
      "The passcode you entered is incorrect or has expired.",
    "Account not found": "No account found with this phone number or email.",
    "Account locked":
      "Your account has been temporarily locked due to multiple failed attempts.",
    "Invalid security answer": "The security answer you provided is incorrect.",
    "User already exists": "An account with this information already exists.",
    "Network error":
      "Unable to connect to the server. Please check your internet connection.",
    "Server error": "Something went wrong on our end. Please try again later.",
  };

  const message =
    errorMessages[error] || error || "An unexpected error occurred.";

  if (context) {
    return `${context}: ${message}`;
  }

  return message;
};
