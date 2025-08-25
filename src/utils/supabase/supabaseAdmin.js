// src/utils/supabase/supabaseAdmin.js

import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are available.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if the variables are defined. If not, log a warning
// instead of crashing the build. This allows the build to
// proceed for other parts of the application.
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL and/or service role key are not defined.");
  // Return a mock or null client to prevent a hard crash
  // in environments where these are not configured.
  // This is a temporary solution for the build process.
  // The API routes will fail, but the build itself will not.
  // In a production environment, you would ensure these are always set.
  throw new Error("Supabase environment variables are required.");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);
