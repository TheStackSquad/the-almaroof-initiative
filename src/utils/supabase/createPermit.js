// src/utils/supabase/createPermit.js

import { supabase } from "@/utils/supabase/supabaseClient";

export const createPermitEntry = async (formData) => {
  const { full_name, email, phone, permit_type } = formData;

  const { data, error } = await supabase
    .from("permits")
    .insert([
      {
        full_name,
        email,
        phone,
        permit_type,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
