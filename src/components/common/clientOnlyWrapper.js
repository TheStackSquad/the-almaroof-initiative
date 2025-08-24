// components/common/clientOnlyWrapper.jsx
"use client";
import { useEffect, useState } from "react";

/**
 * Wrapper component that only renders children on the client side
 * Prevents hydration mismatches for components that rely on browser APIs
 */
const ClientOnlyWrapper = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During SSR and before hydration, show fallback or nothing
  if (!hasMounted) {
    return fallback;
  }

  // After hydration, show the actual children
  return children;
};

export default ClientOnlyWrapper;
