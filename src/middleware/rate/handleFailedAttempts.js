// src/middleware/rate/handleFailedAttempts.js

import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

// Define constants for the rate-limiting policy
const MAX_FAILED_ATTEMPTS = 5; // The maximum number of failed attempts before locking the account
const LOCK_DURATION_HOURS = 1; // The number of hours the account will be locked

export const handleFailedAttempts = async (user) => {
  const { failed_attempts_count } = user;

  const newFailedAttemptsCount = failed_attempts_count + 1;
  let account_locked_until = null;

  // Check if the new count exceeds the maximum allowed attempts
  if (newFailedAttemptsCount >= MAX_FAILED_ATTEMPTS) {
    // Lock the account for the specified duration
    const lockUntil = new Date();
    lockUntil.setHours(lockUntil.getHours() + LOCK_DURATION_HOURS);
    account_locked_until = lockUntil.toISOString();
    console.warn(
      `🔐 Account for user ${user.id} has been locked until ${account_locked_until}`
    );
  }

  try {
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        failed_attempts_count: newFailedAttemptsCount,
        last_login_attempt: new Date().toISOString(),
        account_locked_until,
      })
      .eq("id", user.id);

    if (error) {
      console.error("🚨 Error updating failed attempts count:", error);
    }
  } catch (err) {
    console.error("🚨 Unexpected error in handleFailedAttempts:", err);
  }
};
