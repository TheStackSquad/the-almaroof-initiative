// src/middleware/rate/handleFailedAttempts.js

import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function handleFailedAttempts(user) {
  try {
    const newFailedCount = (user.failed_attempts_count || 0) + 1;
    let accountLockedUntil = null;

    // Lock account if max attempts reached
    if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
      accountLockedUntil = new Date(
        Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
      ).toISOString();
    }

    // Update user_exists table with new failed attempt count
    const { error } = await supabaseAdmin
      .from("user_exists")
      .update({
        failed_attempts_count: newFailedCount,
        account_locked_until: accountLockedUntil,
      })
      .eq("id", user.id);

    if (error) {
      console.error("🚨 Error updating failed attempts count:", error);
      throw error;
    }

    if (accountLockedUntil) {
      console.warn(
        `Account locked for user ${user.id} until ${accountLockedUntil} after ${newFailedCount} failed attempts.`
      );
    } else {
      console.log(
        `Failed attempt #${newFailedCount} recorded for user ${user.id}.`
      );
    }
  } catch (error) {
    console.error("Error in handleFailedAttempts:", error);
    throw error;
  }
}
