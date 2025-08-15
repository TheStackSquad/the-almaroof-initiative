// src/lib/authService/token.js
import { SignJWT } from "jose";

const secretKey =
  process.env.JWT_SECRET ||
  "your-very-strong-and-secure-default-secret-key-that-is-at-least-256-bits";
const key = new TextEncoder().encode(secretKey);

export async function generateAuthToken(user) {
  if (!user || !user.id || !user.email) {
    throw new Error(
      "User object is missing required properties for token generation."
    );
  }

  try {
    // Define the token's payload with essential, non-sensitive data
    const payload = {
      userId: user.id,
      email: user.email,
      isVerified: user.is_verified,
      // Add other non-sensitive data as needed
    };

    // Create and sign the JWT
    // The `jose` library handles all the complexities of token creation securely.
    const jwt = await new SignJWT(payload)
      // Set the protected header with the signing algorithm
      .setProtectedHeader({ alg: "HS256" })
      // Set the token's issuer (e.g., your application's domain)
      .setIssuer("urn:your-app:issuer")
      // Set the token's audience (e.g., your API endpoint)
      .setAudience("urn:your-app:audience")
      // Set the issue date
      .setIssuedAt()
      // Set the token's expiration time (e.g., 2 hours)
      .setExpirationTime("2h")
      // Sign the token with the secret key
      .sign(key);

    return jwt;
  } catch (error) {
    console.error("🚨 Error generating authentication token:", error);
    throw new Error("Failed to generate authentication token.");
  }
}
