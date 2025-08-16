// src/utils/handlers/createPermitEntry.js
import { supabase } from "@/utils/supabase/supaClient";

export const createPermitEntry = async (formData, userId) => {
  try {
    const requiredFields = [
      "full_name",
      "email",
      "phone",
      "permit_type",
      "application_type",
      "amount",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const { full_name, email, phone, permit_type, application_type, amount } =
      formData;

    const { data, error } = await supabase
      .from("permits")
      .insert([
        {
          full_name,
          email,
          phone,
          permit_type,
          application_type,
          amount: amount / 100, // Convert from kobo to naira for storage
          user_id: userId,
          status: "pending",
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Database error creating permit:", error);
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("createPermitEntry error:", error);
    return {
      success: false,
      error: error.message || "Failed to create permit entry",
    };
  }
};
