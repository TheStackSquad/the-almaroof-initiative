// src/components/common/buttonRedirect.js
"use client";

import { useRouter } from "next/navigation"; // Changed from next/router

export default function ButtonRedirect() {
  const router = useRouter();

  const handleContactRedirect = () => {
    router.push("/contact#target-section");
  };

  const handleEmergencyRedirect = () => {
    // Consider using window.location for external URLs
      router.push("/community/services");
  };

  const handleBusinessRedirect = () => {
     router.push("/community/yellow-page");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={handleEmergencyRedirect}
        className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
      >
        <div className="text-2xl mb-2">🚨</div>
        <div className="font-semibold">Emergency Services</div>
      </button>
      <button
        onClick={handleContactRedirect}
        className="p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
      >
        <div className="text-2xl mb-2">📞</div>
        <div className="font-semibold">Contact Officials</div>
      </button>
      <button
        onClick={handleBusinessRedirect}
        className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
      >
        <div className="text-2xl mb-2">📋</div>
        <div className="font-semibold">Business Directory</div>
      </button>
    </div>
  );
}
