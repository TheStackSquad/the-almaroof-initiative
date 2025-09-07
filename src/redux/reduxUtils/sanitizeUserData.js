//src/redux/reduxUtils/sanitizeUserData.js
export function sanitizeUserData(userData) {
  if (!userData || typeof userData !== "object") return null;

  // Create a copy of the user object without sensitive fields
  const {
    password,
    confirmPassword,
    encryption_key,
    private_key,
    refresh_token,
    confirmation_token,
    recovery_token,
    // Supabase-specific sensitive fields
    encrypted_password,
    email_change_token_new,
    email_change_token_current,
    phone_change_token,
    reauthentication_token,
    raw_app_meta_data,
    raw_user_meta_data,
    ...safeData
  } = userData;

  return safeData;
}
