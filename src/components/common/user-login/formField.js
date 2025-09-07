//src/components/common/user-login/formField.js

import React, { memo } from "react";
import { EyeIcon, SlashIcon, XCircle } from "lucide-react";

const FormField = memo(
  ({
    field,
    value,
    error,
    showPassword,
    onToggleShowPassword,
    onChange,
    passwordCriteria = {},
    isPasswordFocused,
    onPasswordFocus,
    onPasswordBlur,
  }) => {
    // Logs commented out for production
    // console.log(`FormField rendered for: ${field.name}`);
    // console.log(`Password criteria available:`, passwordCriteria);
    // console.log(`Field value: ${value}`);
    // console.log(`Is password focused: ${isPasswordFocused}`);

    const FieldIcon = field.icon;
    const fieldType = field.showToggle
      ? showPassword
        ? "text"
        : field.type
      : field.type;

    const handleChange = (e) => {
      // console.log(`Input changed for ${field.name}: ${e.target.value}`);
      onChange(e.target.value);
    };

    const handleFocus = (e) => {
      // console.log(`Input focused: ${field.name}`);
      if (field.name === "password" && onPasswordFocus) {
        onPasswordFocus();
      }
    };

    const handleBlur = (e) => {
      // console.log(`Input blurred: ${field.name}`);
      if (field.name === "password" && onPasswordBlur) {
        onPasswordBlur();
      }
    };

    // Enhanced Password Criteria Component with better visual appeal
    const PasswordCriteriaTabs = () => {
      // console.log("PasswordCriteriaTabs rendering");

      const tabs = [
        {
          key: "hasMinLength",
          icon: "8+",
          label: "8+ characters",
          color: "blue",
        },
        {
          key: "hasUppercase",
          icon: "Aa",
          label: "Upper & lowercase",
          color: "green",
        },
        { key: "hasNumber", icon: "123", label: "Numbers", color: "purple" },
        {
          key: "hasSpecialChar",
          icon: "!@#",
          label: "Special characters",
          color: "orange",
        },
      ];

      // Helper function to get color values for the glow effect
      const getColorValue = (color) => {
        const colors = {
          blue: "#3b82f6",
          green: "#10b981",
          purple: "#8b5cf6",
          orange: "#f97316",
        };
        return colors[color] || "#3b82f6";
      };

      return (
        <div
          className={`mt-3 p-3 rounded-lg transition-all duration-300 ${
            isPasswordFocused || value.length > 0
              ? "bg-gray-50 dark:bg-gray-800/50"
              : "bg-gray-100/50 dark:bg-gray-800/30 opacity-70"
          }`}
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Password Strength
            </span>
            <span className="text-xs font-bold">
              {passwordCriteria.completedCount}/4
            </span>
          </div>

          {/* Tab row */}
          <div className="flex gap-2 justify-between">
            {tabs.map((tab) => {
              const isActive = passwordCriteria[tab.key];
              const isNewlyActive = passwordCriteria.changes?.[tab.key];
              const colorClass = isActive
                ? `border-${tab.color}-400`
                : "border-gray-300 dark:border-gray-600";
              const bgClass = isActive
                ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/30`
                : "bg-gray-100 dark:bg-gray-700";
              const textClass = isActive
                ? `text-${tab.color}-700 dark:text-${tab.color}-300`
                : "text-gray-500";

              return (
                <div
                  key={tab.key}
                  title={tab.label}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-center transition-all duration-300
                    border-2 ${colorClass} ${bgClass}
                    ${isNewlyActive ? "animate-pulse-glow" : ""}
                  `}
                  style={
                    isNewlyActive
                      ? {
                          boxShadow: `0 0 10px ${getColorValue(tab.color)}`,
                        }
                      : {}
                  }
                >
                  <div className={`font-bold text-sm ${textClass}`}>
                    {tab.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-roboto">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative group">
          <div className="flex items-center">
            <FieldIcon
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 z-10 ${
                error
                  ? "text-red-500"
                  : "text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 group-focus-within:scale-110"
              }`}
            />

            <input
              type={fieldType}
              name={field.name}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`
                w-full pl-8 pr-12 py-4 bg-transparent border-0 border-b-2 
                text-gray-900 dark:text-gray-100 font-roboto text-base
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out
                ${
                  error
                    ? "border-b-red-500 focus:border-b-red-500"
                    : "border-b-gray-200 dark:border-b-gray-600 focus:border-b-blue-500 hover:border-b-gray-300 dark:hover:border-b-gray-500"
                }
              `}
              placeholder={field.placeholder}
            />

            {field.showToggle && (
              <button
                type="button"
                onClick={onToggleShowPassword}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-10 hover:scale-110 ${
                  error
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <SlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Enhanced Animated underline */}
          <div
            className={`
            absolute bottom-0 left-0 h-0.5 transform origin-left transition-all duration-300 ease-in-out
            ${
              error
                ? "w-full bg-red-500 shadow-sm shadow-red-200"
                : "w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-focus-within:w-full group-hover:w-1/4 shadow-sm shadow-blue-200"
            }
          `}
          />
        </div>

        {/* Enhanced Password Criteria with better conditional rendering */}
        {field.name === "password" &&
          (isPasswordFocused || value.length > 0) &&
          passwordCriteria && <PasswordCriteriaTabs />}

        {/* When all criteria are met */}
        {field.name === "password" && passwordCriteria.completedCount === 4 && (
          <div className="mt-2 text-center">
            <span className="text-green-600 font-bold text-sm animate-bounce">
              🎉 Strong Password!
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 animate-fade-in">
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400 font-roboto">
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
