// src/utils/handlers/onSubmitPermitForm.js
import { createPermitEntry } from "./createPermitEntry";

export const onSubmitPermitForm = async (formData) => {
  try {
    const { success, data, error } = await createPermitEntry(formData);

    if (!success) {
      return { success: false, error: error || "Submission failed" };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Permit submission error:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
};
