// src/utils/supabase/createPermit.js

export const createPermitEntry = async (formData) => {
  // Step 1: Determine environment for conditional logging
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    // Step 2: Conditional logging for development only
    if (isDevelopment) {
      console.log("--- createPermitEntry initiated ---");
      // Log a sanitized version or omit sensitive data in logs, even in development
      console.log("Received formData:", {
        ...formData,
        // Optionally mask sensitive fields if they were present, e.g., email: '***'
      });
    }

    // Step 3: Call the server-side API
    const response = await fetch("/api/permits/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(formData),
    });

    // Step 4: Conditional logging for response status
    if (isDevelopment) {
      console.log("API response status:", response.status);
      console.log("API response status text:", response.statusText);
    }

    const result = await response.json();

    // Step 5: Conditional logging for full response
    if (isDevelopment) {
      console.log("Parsed API response body:", result);
    }

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        if (isDevelopment) {
          console.warn(
            "Authentication error (401). Permit creation requires re-authentication."
          );
        }
        return {
          success: false,
          error: result.error,
          requiresAuth: true,
        };
      }

      throw new Error(result.error || "Failed to create permit");
    }

    // Step 6: Conditional success logging
    if (isDevelopment) {
      console.log("Permit created successfully. Result:", result);
      console.log("--- createPermitEntry completed ---");
    }
    return result; // { success: true, data: permitData, payment_authorization_url }
  } catch (error) {
    // Step 7: Always log actual errors for debugging, regardless of environment
    console.error("Permit creation error caught:", error);

    return {
      success: false,
      error: error.message || "Failed to create permit",
      requiresAuth:
        error.message.includes("Authentication") ||
        error.message.includes("Session expired"),
    };
  }
};
