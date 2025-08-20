// src/utils/supabase/createPermit.js

export const createPermitEntry = async (formData) => {
  try {
    // ------------------------------------
    // START: ADDED LOGGING
    console.log("--- createPermitEntry initiated ---");
    console.log("Received formData:", formData);
    // ------------------------------------

    // Call the server-side API instead of direct Supabase
    const response = await fetch("/api/permits/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(formData),
    });

    // ------------------------------------
    // START: ADDED LOGGING
    console.log("API response status:", response.status);
    console.log("API response status text:", response.statusText);
    // ------------------------------------

    const result = await response.json();

    // ------------------------------------
    // START: ADDED LOGGING
    console.log("Parsed API response body:", result);
    // ------------------------------------

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // ------------------------------------
        // START: ADDED LOGGING
        console.warn(
          "Authentication error (401). Permit creation requires re-authentication."
        );
        // ------------------------------------
        return {
          success: false,
          error: result.error,
          requiresAuth: true,
        };
      }

      throw new Error(result.error || "Failed to create permit");
    }

    // ------------------------------------
    // START: ADDED LOGGING
    console.log("Permit created successfully. Result:", result);
    console.log("--- createPermitEntry completed ---");
    // ------------------------------------
    return result; // { success: true, data: permitData }
  } catch (error) {
    // ------------------------------------
    // START: ADDED LOGGING
    console.error("Permit creation error caught:", error);
    // ------------------------------------

    return {
      success: false,
      error: error.message || "Failed to create permit",
      requiresAuth:
        error.message.includes("Authentication") ||
        error.message.includes("Session expired"),
    };
  }
};
