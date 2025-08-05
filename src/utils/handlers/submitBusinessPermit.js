// src/utils/handlers/submitBusinessPermit.js

import { validatePermitForm } from "../validate/permitValidator";
import { createPermitEntry } from "../supabase/createPermit";

export const submitBusinessPermit = async (
  formData,
  setError,
  setLoading,
  router
) => {
  try {
    setLoading(true);
    setError(null);

    // 1. Validate user input
    const errors = validatePermitForm(formData);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      setLoading(false);
      return;
    }

    // 2. Create entry in Supabase
    const permit = await createPermitEntry(formData);

    // 3. Optionally, redirect to payment or confirmation
    router.push(
      `/community/online-services/business-permit/confirmation?ref=${permit.id}`
    );
  } catch (err) {
    setError({ general: err.message });
  } finally {
    setLoading(false);
  }
};
