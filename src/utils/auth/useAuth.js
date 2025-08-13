// src/utils/auth/useAuth.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
// Supabase client is no longer used for token validation here.
// We'll keep it in case it's used elsewhere in the hook.
import { supabase } from "../../utils/supabase/supaClient";

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    sessionExpiry: null,
  });

  const updateAuthState = (updates) => {
    setAuthState((prev) => ({ ...prev, ...updates }));
  };

  const getToken = useCallback(() => {
    // We will no longer rely on localStorage. Instead, we'll let
    // our new API endpoint retrieve the token from a secure HttpOnly cookie.
    return null;
  }, []);

  const startSessionTracking = useCallback(() => {
    // We will keep the session tracking logic as it is.
    const updateLastActive = () => {
      updateAuthState({ sessionExpiry: Date.now() + 30 * 60 * 1000 }); // 30 min timeout
    };

    updateLastActive();

    const events = ["click", "keypress", "scroll"];
    events.forEach((e) => window.addEventListener(e, updateLastActive));

    return () =>
      events.forEach((e) => window.removeEventListener(e, updateLastActive));
  }, []);

  const stopSessionTracking = useCallback(() => {
    updateAuthState({ sessionExpiry: null });
  }, []);

  // Removed setToken and removeToken as they are no longer needed for client-side storage.
  // The login and logout functions will now handle API calls that set/clear the cookie.

  // New function to validate the token on the server
  const validateServerToken = useCallback(async () => {
    try {
      // Call the new backend endpoint for server-side validation.
      // This endpoint will automatically read the HttpOnly cookie.
      const response = await fetch("/api/auth/validate-token");
      if (!response.ok) {
        throw new Error("Server token validation failed");
      }
      const data = await response.json();
      return data; // Returns { user, decoded }
    } catch (error) {
      console.error("Server token validation failed:", error);
      return null;
    }
  }, []);

  const validateToken = useCallback(async () => {
    // Instead of local validation, we make a server call.
    return await validateServerToken();
  }, [validateServerToken]);

  // Main auth checker
  useEffect(() => {
    const checkAuth = async () => {
      updateAuthState({ loading: true });
      const validation = await validateToken();

      if (validation) {
        updateAuthState({
          isAuthenticated: true,
          user: validation.user,
          loading: false,
          sessionExpiry: Date.now() + 30 * 60 * 1000,
        });
      } else {
        updateAuthState({ isAuthenticated: false, user: null, loading: false });
      }
    };

    checkAuth();
  }, [validateToken]);

  // The login function now makes a POST request and expects the token to be set as a cookie.
  const login = useCallback(
    async ({ token, user }, redirectPath = "/community/online-services") => {
      updateAuthState({
        isAuthenticated: true,
        user: user,
        sessionExpiry: Date.now() + 30 * 60 * 1000,
      });
      router.push(redirectPath);
    },
    [router]
  );

  const logout = useCallback(
    async (callbackUrl = "/") => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
      updateAuthState({ isAuthenticated: false, user: null });
      router.push(callbackUrl);
    },
    [router]
  );

  const requireAuth = useCallback(
    (redirectPath, checkSession = true) => {
      if (authState.loading) return null;

      const sessionValid =
        !checkSession ||
        (authState.sessionExpiry && authState.sessionExpiry > Date.now());

      if (!authState.isAuthenticated || !sessionValid) {
        router.push(
          `${redirectPath}?from=${encodeURIComponent(window.location.pathname)}`
        );
        return false;
      }
      return true;
    },
    [authState, router]
  );

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    getToken,
  };
}
