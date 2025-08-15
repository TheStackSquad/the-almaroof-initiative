// src/utils/handlers/createPermitEntry.js

import { supabase } from "../supabase/supaClient";

/**
 * Inserts a new permit record into the 'permits' table.
 * @param {object} formData - The permit form data.
 * @param {string} userId - The authenticated user's ID from Redux state.
 * @returns {object} The inserted permit record with its new ID.
 */
export const createPermitEntry = async (formData, userId) => {
  const { full_name, email, phone, permit_type } = formData;

  const { data, error } = await supabase
    .from("permits")
    .insert([
      {
        full_name,
        email,
        phone,
        permit_type,
        user_id: userId,
        status: "pending",
      },
    ])
    .select(); // Use select() to return the newly inserted data

  if (error) {
    console.error("Failed to create permit entry:", error.message);
    throw new Error("An error occurred while submitting your application.");
  }

  return data?.[0]; // return the inserted permit record
};
