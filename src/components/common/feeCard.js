// src/components/common/feeCard.js
"use client";

import { formatAmount } from "@/config/permitFees";

export default function FeeCard({
  permitType,
  applicationType,
  amount,
  onTypeChange,
}) {
  if (!permitType) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-blue-100 dark:border-gray-600 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {permitType.replace("-", " ")} Fee
        </h3>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatAmount(amount)}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="radio"
            name="application_type"
            value="new"
            checked={applicationType === "new"}
            onChange={onTypeChange}
            className="mr-3 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">
            New Application
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="application_type"
            value="renew"
            checked={applicationType === "renew"}
            onChange={onTypeChange}
            className="mr-3 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">Renewal</span>
        </label>
      </div>
    </div>
  );
}
