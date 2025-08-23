// src/errorBoundary/ErrorBoundaryInit.js
"use client";

import { useEffect } from "react";
import { initializeErrorBoundaries } from "@/errorBoundary/utils";

//Step 1: Component to initialize error boundary system on app load
const ErrorBoundaryInit = ({ children }) => {
  useEffect(() => {
    // Initialize error boundary system
    initializeErrorBoundaries();
  }, []);

  return children;
};

export default ErrorBoundaryInit;
