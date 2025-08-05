// src/utils/handlers/createPermitEntry.js

import { supabase } from "../supabase/supaClient";

// Insert new permit record into Supabase
export const createPermitEntry = async (formData) => {
  const { full_name, email, phone, permit_type } = formData;

  const { data, error } = await supabase.from("permits").insert([
    {
      full_name,
      email,
      phone,
      permit_type,
      status: "pending", // default at entry point
    },
  ]);

  if (error) {
    console.error("Failed to create permit entry:", error.message);
    throw new Error("An error occurred while submitting your application.");
  }

  return data?.[0]; // return the inserted permit record
};
