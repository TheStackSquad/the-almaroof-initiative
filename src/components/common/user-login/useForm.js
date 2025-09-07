

// src/components/common/user-login/userForm.js

"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { KeyIcon, ArrowRightIcon } from "lucide-react";

import { showToast } from "@/components/common/toastAlert/toast";
import { signinUser, signupUser } from "@/redux/action/authAction";
import { useAuthForm } from "@/utils/hooks/useAuthForm";
import { getFormFields } from "@/components/common/user-login/formFields";
import AuthToggle from "@/components/common/user-login/authToggle";
import FormField from "@/components/common/user-login/formField";
import AuthLayout from "@/components/common/user-login/authLayout";
import ForgotPasswordModal from "@/modal/forgotPasswordModal";
import SignupSuccessModal from "@/modal/signupSuccessModal";

const UserForm = ({ redirectUrl }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const {
    isSignUp,
    isLoading,
    showPassword,
    showConfirmPassword,
    errors,
    formData,
    isPasswordFocused,
    setIsLoading,
    setShowPassword,
    setShowConfirmPassword,
    validateForm,
    handleInputChange,
    generateNewPassword,
    toggleAuthMode,
    resetForm,
    passwordCriteria,
  } = useAuthForm(true);

  const formFields = useMemo(() => getFormFields(isSignUp), [isSignUp]);

   const handleSubmit = async (e) => {
     e.preventDefault();

     if (isLoading) return;

     const validationResult = validateForm();
     if (!validationResult.isValid) {
       showToast(validationResult.message || "Please fix the errors", "error");
       if (validationResult.firstErrorField) {
         document
           .querySelector(`[name="${validationResult.firstErrorField}"]`)
           ?.focus();
       }
       return;
     }

     setIsLoading(true);

     try {
       if (isSignUp) {
         // SIGN-UP LOGIC (corrected logic to always show success modal)
         const signupPayload = {
           username: formData.username?.trim(),
           email: formData.email?.trim()?.toLowerCase(),
           phone: formData.phone?.trim(),
           password: formData.password,
         };

         const result = await dispatch(signupUser(signupPayload));

         // Unify success handling for all sign-ups
         // This block will always run after a successful sign-up
         if (result.success) {
           setNewUsername(result.user?.username || formData.username?.trim());
           setShowSuccessModal(true);
           resetForm();
           toggleAuthMode(); // Transition to the sign-in UI

           // Display the appropriate toast message
           if (result.isDevelopmentMode) {
             showToast(
               "Account created! (Development mode - email auto-confirmed)",
               "success"
             );
           } else {
             showToast(
               "Account created! Please check your email for verification.",
               "info"
             );
           }
         } else {
           // This handles any non-success responses that don't throw an error
           throw new Error(result.message || "Sign up failed.");
         }
       } else {
         // SIMPLIFIED SIGN-IN LOGIC
         const signinPayload = {
           email: formData.email?.trim()?.toLowerCase(),
           password: formData.password,
         };

         const result = await dispatch(signinUser(signinPayload));

         if (result.success) {
           showToast("Signed in successfully!", "success");
           resetForm();
           router.push(redirectUrl || "/dashboard");
         } else {
           // Error handled by Redux action, just show the message
           throw new Error(result.error || "Sign in failed");
         }
       }
     } catch (error) {
       let errorMessage = `${
         isSignUp ? "Sign up" : "Sign in"
       } failed. Please try again.`;

       // Extract error message from different error formats
       if (error.message) {
         errorMessage = error.message;
       } else if (error.response?.data?.message) {
         errorMessage = error.response.data.message;
       } else if (typeof error === "string") {
         errorMessage = error;
       }

       showToast(errorMessage, "error");

       // Handle specific error cases for sign-up
       if (errorMessage.includes("email already exists") && isSignUp) {
         toggleAuthMode();
       }
     } finally {
       setIsLoading(false);
     }
   };


  return (
    <>
      <AuthLayout isSignUp={isSignUp}>
        <div className="w-full max-w-full lg:max-w-md">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-montserrat">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-roboto text-base">
              {isSignUp
                ? "Fill in your details to get started"
                : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            {/* Render form fields */}
            {formFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                showPassword={
                  field.name === "password" ? showPassword : showConfirmPassword
                }
                onToggleShowPassword={
                  field.name === "password"
                    ? () => setShowPassword(!showPassword)
                    : () => setShowConfirmPassword(!showConfirmPassword)
                }
                onChange={(value) => handleInputChange(field.name, value)}
                passwordCriteria={
                  field.name === "password" ? passwordCriteria : undefined
                }
                isPasswordFocused={isPasswordFocused}
              />
            ))}

            {/* Password Generator - Sign Up Only */}
            {isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={generateNewPassword}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 font-roboto"
                >
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Generate strong password
                </button>
              </div>
            )}

            {/* Forgot Password - Login Only */}
            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 font-roboto"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg text-white 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 
                focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200 shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                flex items-center justify-center space-x-3 font-montserrat
              `}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Auth Toggle */}
            <AuthToggle isSignUp={isSignUp} onToggle={toggleAuthMode} />
          </form>
        </div>
      </AuthLayout>

      <SignupSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        username={newUsername}
      />

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default UserForm;