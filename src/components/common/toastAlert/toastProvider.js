// src/components/common/toastAlert/toastProvider.jsx
"use client"; // This directive marks the component as a Client Component

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right" // Position of the toast notifications
      autoClose={5000} // Close after 5 seconds
      hideProgressBar={false} // Show the progress bar
      newestOnTop={false} // Oldest toasts on top
      closeOnClick // Close toast on click
      rtl={false} // No right-to-left support
      pauseOnFocusLoss // Pause timer when window loses focus
      draggable // Allow dragging toasts
      pauseOnHover // Pause timer on hover
      theme="colored" // Use a colored theme for toasts
    />
  );
}
