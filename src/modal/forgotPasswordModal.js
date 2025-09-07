// src/components/common/user-login/forgotPasswordModal.js

"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { XIcon, MailIcon, CheckCircleIcon } from "lucide-react";
import { showToast } from "@/components/common/toastAlert/toast";
import {
  validateForm,
  emailSchema,
} from "@/utils/validate/signup-validate";
import { sendForgotPasswordLink } from "@/redux/action/authAction";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLinkSent, setIsLinkSent] = useState(false);

  const handleSendMagicLink = async () => {
    const { isValid, errors: validationErrors } = validateForm(emailSchema, {
      email,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(sendForgotPasswordLink(email));
      showToast("A password reset link has been sent to your email", "success");
      setIsLinkSent(true);
    } catch (error) {
      // The action creator handles the toast notification for the error,
      // so we only need to handle the local state here.
      setErrors(error.response?.data?.errors || {});
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setErrors({});
    setIsLinkSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl transition-all duration-300 transform scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-200">
            Reset Password
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Content based on state */}
        <div className="space-y-4">
          {!isLinkSent ? (
            <>
              <MailIcon className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-300 text-center mb-4">
                Enter your email address and we&apos;ll send you a password
                reset link.
              </p>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <button
                onClick={handleSendMagicLink}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-300 text-center mb-4">
                A password reset link has been sent to your email. Please check
                your inbox and click the link to continue.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

