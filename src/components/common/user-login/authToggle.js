// src/components/common/user-login/authToggle.js
import React, { memo } from "react";

const AuthToggle = memo(({ isSignUp, onToggle }) => (
  <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-700">
    <p className="text-sm text-gray-600 dark:text-gray-400 font-roboto">
      {isSignUp ? "Already have an account?" : "Don't have an account?"}
      <button
        type="button"
        onClick={onToggle}
        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
      >
        {isSignUp ? "Sign In" : "Sign Up"}
      </button>
    </p>
  </div>
));

AuthToggle.displayName = "AuthToggle";

export default AuthToggle;
