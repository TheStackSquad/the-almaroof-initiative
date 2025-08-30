// src/components/common/buttons/logoutButton.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/action/authAction";
import { useRouter } from "next/navigation";

const LogoutButton = ({
  variant = "default",
  className = "",
  showIcon = true,
  children,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      // Redirect to login page after successful logout
      router.push("/api/auth-entry");

      // Optional: Show success message
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, we should clear local storage and redirect
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      router.push("/api/auth-entry");
    }
  };

  const baseStyles =
    "px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
    ghost: "text-red-600 hover:bg-red-50 focus:ring-red-500",
    text: "text-red-600 hover:text-red-700 focus:ring-red-500",
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Logout"
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          Logging out...
        </span>
      ) : (
        <span className="flex items-center">
          {showIcon && (
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          )}
          {children || "Logout"}
        </span>
      )}
    </button>
  );
};

// Optional: Create a dropdown menu item version
export const LogoutDropdownItem = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/auth-entry");
    } catch (error) {
      // Fallback cleanup
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      router.push("/auth-entry");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
      role="menuitem"
    >
      <div className="flex items-center">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </div>
    </button>
  );
};

export default LogoutButton;
