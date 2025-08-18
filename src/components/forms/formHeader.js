// src/components/forms/formHeader.js
import React, { memo } from "react";

const FormHeader = memo(
  ({ permitType, authState, userName, userEmail, userId }) => {
    const formatPermitType = (type) => {
      return type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
      <div className="text-center mb-6 sm:mb-8">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight px-4">
            {formatPermitType(permitType)} Application
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed px-4 max-w-md mx-auto">
            Fill out the form below to apply for your permit
          </p>
        </div>

        {authState.user && (
          <div className="mt-4 sm:mt-6 mx-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                <p className="text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                  <span className="block sm:inline">Welcome back,</span>{" "}
                  <span className="font-semibold truncate max-w-[200px] sm:max-w-none">
                    {userName || userEmail}
                  </span>
                  !
                </p>
              </div>

              {userId && (
                <p className="text-blue-600 dark:text-blue-300 text-xs sm:text-sm mt-1 opacity-75">
                  User ID:{" "}
                  <span className="font-mono">{userId.slice(0, 8)}...</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FormHeader.displayName = "FormHeader";

export default FormHeader;
