// src/utils/handlers/onSubmitPermitForm.js
import { createPermitEntry } from "./createPermitEntry";


// src/utils/handlers/onSubmitPermitForm.js
export const onSubmitPermitForm = async (formData) => {
  try {
    console.log("Submitting form data to backend handler:", formData);
    const { success, data, error } = await createPermitEntry(formData);

    if (!success) {
      console.error("Backend handler failed to create entry:", error);
      return { success: false, error: error || "Submission failed" };
    }

    console.log("Backend handler succeeded. Returning data:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Permit submission error caught in handler:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
};