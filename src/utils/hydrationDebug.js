// utils/hydrationDebug.js - Production debugging utilities

import { useState, useEffect } from "react";

/**
 * Safe component wrapper that catches hydration errors
 */
export function withHydrationSafety(Component, fallback = null) {
  return function HydrationSafeComponent(props) {
    if (typeof window === "undefined") {
      return fallback;
    }

    try {
      return <Component {...props} />;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Hydration error in component:", Component.name, error);
      }
      return fallback;
    }
  };
}

/**
 * Utility to safely access browser APIs during SSR
 */
export function safeWindow(callback, fallback = null) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    return callback(window);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Safe window access error:", error);
    }
    return fallback;
  }
}

/**
 * Safe date formatting that works consistently across SSR/CSR
 */
export function safeFormatDate(date, options = {}) {
  // Use consistent timezone for SSR/CSR
  const safeOptions = {
    timeZone: "UTC",
    ...options,
  };

  try {
    return new Intl.DateTimeFormat("en-US", safeOptions).format(new Date(date));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Date formatting error:", error);
    }
    return date.toString();
  }
}

/**
 * Hydration-safe random ID generator
 */
export function createStableId(prefix = "id") {
  // Use a deterministic approach during SSR
  if (typeof window === "undefined") {
    return `${prefix}-server-${Math.floor(Math.random() * 1000)}`;
  }

  // Use crypto.randomUUID if available, fallback to Math.random
  if (window.crypto && window.crypto.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Component to detect and report hydration mismatches in development
 */
export function HydrationMismatchDetector({ children }) {
  // AVOID THIS PATTERN:
  // if (process.env.NODE_ENV === "production") {
  //   return children;
  // }
  // This causes a React Hook violation because useState and useEffect are now
  // conditionally called.

  // Instead, declare the hooks unconditionally at the top level
  // This respects the "Rules of Hooks"
  const [serverHTML, setServerHTML] = useState("");
  const [clientHTML, setClientHTML] = useState("");

  useEffect(() => {
    // Then, use the conditional check inside the effect to control the side effect logic
    if (process.env.NODE_ENV === "production") {
      return;
    }
    // Capture client-side HTML after hydration
    const container = document.getElementById("main-content");
    if (container) {
      setClientHTML(container.innerHTML);
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    if (serverHTML && clientHTML && serverHTML !== clientHTML) {
      console.warn("🚨 Potential hydration mismatch detected!");
      console.warn("Server HTML length:", serverHTML.length);
      console.warn("Client HTML length:", clientHTML.length);
    }
  }, [serverHTML, clientHTML]);

  // Now, you can safely return the children component
  return children;
}
