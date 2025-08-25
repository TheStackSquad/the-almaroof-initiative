// src/utils/supabase/supabaseAdmin.js

import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are available.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL and/or service role key are not defined.");
  throw new Error("Supabase environment variables are required.");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);
