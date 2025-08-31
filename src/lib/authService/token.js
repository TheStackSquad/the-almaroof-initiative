import { SignJWT } from "jose";

// Step 1: Define JWT and refresh token secrets.
const secretKey =
  process.env.JWT_SECRET ||
  "your-very-strong-and-secure-default-secret-key-that-is-at-least-256-bits";
const refreshSecretKey = process.env.JWT_REFRESH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function generateAuthToken(user) {
  // Step 2: Validate user object for required properties.
  if (!user || !user.id || !user.email) {
    throw new Error(
      "User object is missing required properties for token generation."
    );
  }

  try {
    // Step 3: Define the token's payload with essential user data.
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      isVerified: user.is_verified,
    };
    console.log("unvieling payload:", payload);

    // Step 4: Create and sign the JWT.
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuer("urn:your-app:issuer")
      .setAudience("urn:your-app:audience")
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(key);

    return jwt;
  } catch (error) {
    console.error("🚨 Error generating authentication token:", error);
    throw new Error("Failed to generate authentication token.");
  }
}


export async function generateRefreshToken(user) {
  // Step 5: Validate user ID for refresh token generation.
  if (!user || !user.id) {
    throw new Error("User ID is required to generate a refresh token.");
  }

  try {
    // Step 6: Define a minimal payload for the refresh token.
    const payload = {
      userId: user.id,
    };

    // Step 7: Create and sign the refresh token.
    const refreshKey = new TextEncoder().encode(refreshSecretKey);
    const refreshJwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuer("urn:your-app:issuer")
      .setAudience("urn:your-app:audience:refresh")
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(refreshKey);

    return refreshJwt;
  } catch (error) {
    console.error("🚨 Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token.");
  }
}
