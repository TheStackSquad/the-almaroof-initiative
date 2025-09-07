// src/utils/supabase/createPermit.js - UPDATED
import { PERMIT_STATUS } from "@/components/common/permitStatus";

export const createPermitEntry = async (formData) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    if (isDevelopment) {
      console.log("--- createPermitEntry initiated ---");
      console.log("Received formData:", {
        ...formData,
        formattedAmount: `${formData.amount} kobo (₦${(
          formData.amount / 100
        ).toFixed(2)})`,
      });
    }

    // Send the ORIGINAL formData (with integer amount) to API
    const response = await fetch("/api/permits/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    // COMPLETE DEBUGGING PATTERN: Read response once as text
    console.log("Response status:", response.status);
    const responseText = await response.text();
    console.log("Response text:", responseText);

    let result;
    try {
      // Parse the text response manually to JSON
      result = JSON.parse(responseText);
      console.log("Parsed JSON result:", result);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", responseText);
      throw new Error("Invalid JSON response from server");
    }

    if (isDevelopment) {
      console.log("API response status:", response.status);
      console.log("Parsed API response body:", result);
    }

    if (!response.ok) {
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

      // Handle duplicate submission
      if (response.status === 409) {
        return {
          success: false,
          error: "This application has already been submitted",
          isDuplicate: true,
          existingPermitId: result.existingPermitId,
        };
      }

      throw new Error(result.error || "Failed to create permit");
    }

    // Validate response contains proper status
    if (!result.data || !result.data.status) {
      throw new Error("Invalid response from permit creation API");
    }

    // Check if permit is in expected state
    if (result.data.status !== PERMIT_STATUS.PENDING_PAYMENT) {
      if (isDevelopment) {
        console.warn(
          `Permit created with unexpected status: ${result.data.status}`
        );
      }
    }

    if (isDevelopment) {
      console.log("Permit created successfully. Result:", {
        ...result.data,
        amount: `${result.data.amount} kobo (₦${(
          result.data.amount / 100
        ).toFixed(2)})`,
      });
      console.log("--- createPermitEntry completed ---");
    }

    return result;
  } catch (error) {
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
