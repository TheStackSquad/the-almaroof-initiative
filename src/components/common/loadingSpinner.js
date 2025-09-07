// src/components/common/LoadingSpinner.js
export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400 rounded-full animate-spin`}
      />
    </div>
  );
}
