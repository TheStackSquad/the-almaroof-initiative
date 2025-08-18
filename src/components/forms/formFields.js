// src/components/forms/formFields.js
import React, { memo } from "react";
import AnimatedInput from "@/components/forms/animatedInput";
import { formatAmount } from "@/config/permitFees";

const FormFields = memo(
  ({
    formData,
    errors,
    loading,
    isFormReady,
    canSubmit,
    onChange,
    onTypeChange,
    onSubmit,
  }) => {
    return (
      <form
        onSubmit={onSubmit}
        className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6"
      >
        <div className="space-y-4 sm:space-y-5">
          <AnimatedInput
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={onChange}
            error={errors.full_name}
            required
            autoComplete="name"
          />

          <AnimatedInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            error={errors.email}
            required
            autoComplete="email"
          />

          <AnimatedInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            error={errors.phone}
            required
            autoComplete="tel"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <AnimatedInput
              label="Application Type"
              name="application_type"
              type="select"
              value={formData.application_type}
              onChange={onTypeChange}
              error={errors.application_type}
              required
            >
              <option value="">Select type</option>
              <option value="new">New Application</option>
              <option value="renew">Renewal</option>
            </AnimatedInput>

            <AnimatedInput
              label="Permit Type"
              name="permit_type"
              type="select"
              value={formData.permit_type}
              onChange={onChange}
              error={errors.permit_type}
              required
            >
              <option value="">Select permit</option>
              <option value="business-permit">Business Permit</option>
              <option value="building-permit">Building Permit</option>
              <option value="event-permit">Event Permit</option>
            </AnimatedInput>
          </div>
        </div>

        {formData.amount > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                Application Fee:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatAmount(formData.amount)}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              This fee will be processed upon form submission
            </p>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg sm:rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Submission Error
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                  {errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 sm:pt-4 space-y-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
            w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl 
            font-semibold text-white text-sm sm:text-base
            transition-all duration-300 transform
            focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
            ${
              canSubmit
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-[0.98]"
                : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-75"
            }
          `}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin -ml-1 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Submitting...</span>
              </span>
            ) : !isFormReady ? (
              "Verifying Authentication..."
            ) : !formData.application_type ? (
              "Select Application Type"
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>Submit Application</span>
                {formData.amount > 0 && (
                  <>
                    <span>•</span>
                    <span className="font-bold">
                      {formatAmount(formData.amount)}
                    </span>
                  </>
                )}
              </span>
            )}
          </button>

          {process.env.NODE_ENV === "development" && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-4 space-y-1 sm:space-y-0">
                <span>Auth: {isFormReady ? "✅" : "❌"}</span>
                <span>Form: {canSubmit ? "✅" : "❌"}</span>
                <span>Fee: {formData.amount > 0 ? "✅" : "❌"}</span>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }
);

FormFields.displayName = "FormFields";

export default FormFields;
