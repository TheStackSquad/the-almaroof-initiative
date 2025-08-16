// src/components/form/animatedInput.js
"use client";

import { useState } from "react";

export default function AnimatedInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  disabled = false,
  children, // for select options
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;
  const isFloating = isFocused || hasValue;

  const inputClasses = `
    peer w-full px-4 pt-6 pb-2 text-gray-900 dark:text-gray-100 
    bg-white dark:bg-gray-700 border rounded-lg outline-none 
    transition-all duration-300 ease-in-out
    ${
      error
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-300 ease-in-out pointer-events-none
    ${
      isFloating
        ? "top-2 text-xs text-blue-600 dark:text-blue-400 font-medium"
        : "top-4 text-gray-500 dark:text-gray-400"
    }
    ${error ? "text-red-500 dark:text-red-400" : ""}
  `;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative mb-6 group">
      {type === "select" ? (
        <>
          <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className={`${inputClasses} cursor-pointer`}
          >
            {children}
          </select>
          <label className={labelClasses}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </>
      ) : (
        <>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            disabled={disabled}
            required={required}
            className={inputClasses}
          />
          <label className={labelClasses}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </>
      )}

      {/* Floating border animation */}
      <div
        className={`absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse"></div>
      </div>

      {error && (
        <div className="flex items-center mt-2 text-red-500 dark:text-red-400 text-sm animate-fadeIn">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
