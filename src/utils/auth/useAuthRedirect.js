// src/utils/auth/useAuthRedirect.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkSession } from "@/redux/action/authAction";

export const useAuthRedirect = (redirectUrl) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionChecked } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Always check session on mount, but respect loading state
    if (!loading) {
      dispatch(checkSession());
    }
  }, [dispatch, loading]); // Remove sessionChecked from dependencies

  useEffect(() => {
    // Redirect only when session is checked and not authenticated
    if (sessionChecked && !isAuthenticated && !loading) {
      console.log("User not authenticated, redirecting to login");
      const encodedRedirect = encodeURIComponent(redirectUrl);
      router.push(
        `/community/online-services/protected-route?redirect=${encodedRedirect}`
      );
    }
  }, [sessionChecked, isAuthenticated, loading, router, redirectUrl]);

  return { isLoading: loading, isAuthenticated, sessionChecked };
};
