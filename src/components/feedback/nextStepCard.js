// src/components/feedback/nextStepCard.js
import React from "react";
import { CheckCircle } from "lucide-react";

export default function NextStepCard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Application Received!
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Your Business Permit application has been submitted successfully.
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        A reference number has been sent to your email. Proceed to payment if
        you haven&apos;t yet.
      </div>
      <a
        href="https://paystack.com/pay/businesspermit"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Complete Payment
      </a>
    </div>
  );
}
