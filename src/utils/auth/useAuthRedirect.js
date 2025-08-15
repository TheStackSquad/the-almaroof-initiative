// src/utils/auth/useAuthRedirect.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkSession } from "@/redux/action/authAction";

export const useAuthRedirect = (redirectUrl) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Dispatch the session check action when the component mounts.
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if the loading state is false and the user is not authenticated.
    if (!loading && !isAuthenticated) {
      console.log("❌ User not authenticated, redirecting to login");
      const encodedRedirect = encodeURIComponent(redirectUrl);
      router.push(
        `/community/online-services/protected-route?redirect=${encodedRedirect}`
      );
    }
  }, [loading, isAuthenticated, router, redirectUrl]);

  return { isLoading: loading, isAuthenticated };
};
