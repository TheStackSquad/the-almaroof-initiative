// src/lib/generatePassword/generatePassword.js

export const generatePassword = (length = 12) => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*"; 
  const allChars = lowercase + uppercase + numbers + symbols;

  // Use a secure random number generator from the Web Crypto API
  const crypto = typeof window !== "undefined" && window.crypto;
  if (!crypto || !crypto.getRandomValues) {
    throw new Error(
      "Cryptographically secure random numbers are not supported in this environment."
    );
  }

  // Create an array to hold the password characters
  let passwordChars = [];

  // Ensure at least one of each character type
  passwordChars.push(
    lowercase[crypto.getRandomValues(new Uint32Array(1))[0] % lowercase.length]
  );
  passwordChars.push(
    uppercase[crypto.getRandomValues(new Uint32Array(1))[0] % uppercase.length]
  );
  passwordChars.push(
    numbers[crypto.getRandomValues(new Uint32Array(1))[0] % numbers.length]
  );
  passwordChars.push(
    symbols[crypto.getRandomValues(new Uint32Array(1))[0] % symbols.length]
  );

  // Fill the rest of the password length
  const remainingLength = length - passwordChars.length;
  const randomBytes = new Uint32Array(remainingLength);
  crypto.getRandomValues(randomBytes);

  for (let i = 0; i < remainingLength; i++) {
    passwordChars.push(allChars[randomBytes[i] % allChars.length]);
  }

  // Shuffle the password array securely
  // Fisher-Yates shuffle using a secure random number generator
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
};

// The password strength function is fine as is
export const passwordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};
