// components/common/HydrationProvider.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const HydrationContext = createContext({
  isHydrated: false,
});

/**
 * Provider that tracks hydration state and provides utilities
 * for handling hydration-sensitive components
 */
export function HydrationProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first paint
    setIsHydrated(true);

    // Optional: Log hydration performance
    if (typeof window !== "undefined" && window.__HYDRATION_START__) {
      const hydrationTime = Date.now() - window.__HYDRATION_START__;
      console.log(`🚀 Hydration completed in ${hydrationTime}ms`);
    }
  }, []);

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {children}
    </HydrationContext.Provider>
  );
}

/**
 * Hook to check if the component has been hydrated
 * Use this instead of typeof window !== 'undefined'
 */
export function useIsHydrated() {
  const context = useContext(HydrationContext);
  if (!context) {
    throw new Error("useIsHydrated must be used within a HydrationProvider");
  }
  return context.isHydrated;
}

export default HydrationProvider;
