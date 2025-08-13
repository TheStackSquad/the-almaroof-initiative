// src/components/common/RecoveryModal.js

"use client";

import React, { useState } from "react";
import {
  validatePhone,
  validateEmail,
  sendPasscodeToContact,
  formatPhoneNumber,
} from "../../utils/auth";

export default function RecoveryModal({ userData, onSubmit, onCancel }) {
  const [recoveryMethod, setRecoveryMethod] = useState(""); // 'phone' or 'email'
  const [contactInfo, setContactInfo] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleContactChange = (e) => {
    setContactInfo(e.target.value);
    if (errors.contact) {
      setErrors((prev) => ({ ...prev, contact: "" }));
    }
  };

  const handleMethodSelect = (method) => {
    setRecoveryMethod(method);
    setContactInfo("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!recoveryMethod) {
      setErrors({ method: "Please select a recovery method" });
      return;
    }

    if (!contactInfo.trim()) {
      setErrors({
        contact: `Please enter your ${
          recoveryMethod === "phone" ? "phone number" : "email address"
        }`,
      });
      return;
    }

    // Validate contact information
    let validation;
    if (recoveryMethod === "phone") {
      validation = validatePhone(contactInfo);
    } else {
      validation = validateEmail(contactInfo);
    }

    if (!validation.isValid) {
      setErrors({ contact: validation.error });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Send passcode to the provided contact
      const result = await sendPasscodeToContact(contactInfo, recoveryMethod);

      if (result.success) {
        // Pass recovery data to parent component
        onSubmit({
          method: recoveryMethod,
          contact: contactInfo,
          username: userData?.username,
          message: result.message,
          devPasscode: result.passcode, // Only for development
        });
      } else {
        setErrors({
          general:
            result.message ||
            "Failed to send verification code. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Username Display */}
      {userData?.username && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p
            className="text-sm text-indigo-800 dark:text-indigo-200"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <span className="font-semibold">Recovering access for:</span>{" "}
            {userData.username}
          </p>
        </div>
      )}

      {/* Recovery Method Selection */}
      <div className="space-y-4">
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-white"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          How would you like to receive your verification code?
        </h3>

        {/* Phone Option */}
        <div
          onClick={() => handleMethodSelect("phone")}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
            recoveryMethod === "phone"
              ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                recoveryMethod === "phone"
                  ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400"
                  : "border-gray-300 dark:border-gray-500"
              }`}
            >
              {recoveryMethod === "phone" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span
                  className="font-semibold text-gray-900 dark:text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  SMS to Phone
                </span>
              </div>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                We&apos;ll send a 6-digit code to your phone number
              </p>
            </div>
          </div>
        </div>

        {/* Email Option */}
        <div
          onClick={() => handleMethodSelect("email")}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
            recoveryMethod === "email"
              ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                recoveryMethod === "email"
                  ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400"
                  : "border-gray-300 dark:border-gray-500"
              }`}
            >
              {recoveryMethod === "email" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <span
                  className="font-semibold text-gray-900 dark:text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Email
                </span>
              </div>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                We&apos;ll send a verification code to your email address
              </p>
            </div>
          </div>
        </div>

        {errors.method && (
          <p
            className="text-red-500 dark:text-red-400 text-sm flex items-center"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.method}
          </p>
        )}
      </div>

      {/* Contact Information Input */}
      {recoveryMethod && (
        <div className="space-y-2">
          <label
            htmlFor="contact"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {recoveryMethod === "phone" ? "Phone Number" : "Email Address"} *
          </label>
          <div className="relative">
            <input
              type={recoveryMethod === "phone" ? "tel" : "email"}
              id="contact"
              value={contactInfo}
              onChange={handleContactChange}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.contact
                  ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
              placeholder={
                recoveryMethod === "phone"
                  ? "+234 801 234 5678"
                  : "your.email@example.com"
              }
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {recoveryMethod === "phone" ? (
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              )}
            </div>
          </div>
          {errors.contact && (
            <p
              className="text-red-500 dark:text-red-400 text-sm flex items-center"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.contact}
            </p>
          )}
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p
            className="text-red-600 dark:text-red-400 text-sm flex items-center"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.general}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || !recoveryMethod || !contactInfo.trim()}
          className={`flex-1 relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-500 dark:to-cyan-500 hover:from-indigo-700 hover:to-cyan-700 dark:hover:from-indigo-600 dark:hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <span className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending Code...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send Code
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>

      {/* Help Text */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4
              className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Need Help?
            </h4>
            <p
              className="text-sm text-blue-700 dark:text-blue-300"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              If you don&apos;t receive the verification code, check your spam folder
              or try the other method. The code will expire in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
