// src/components/common/user-login/userForm.js

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { showToast } from "@/components/common/toastAlert/toast";
import { signinUser, signupUser } from "@/redux/action/authAction"; 

const UserForm = ({ redirectUrl }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

   const handleSubmit = async (e) => {
     e.preventDefault();

     if (!validateForm()) {
       showToast("Please fix the errors in the form", "error");
       return;
     }

     setIsLoading(true);

     try {
       if (isSignUp) {
         // Handle signup
         const signupData = {
           username: formData.username,
           email: formData.email,
           phone: formData.phone,
           password: formData.password,
         };

         // await dispatch(requestPasscode(signupData)); // Old code
         await dispatch(signupUser(signupData)); // New code

         showToast(
           "Account created successfully! Redirecting to sign in...",
           "success"
         );

         // Switch to sign in after successful signup
         setTimeout(() => {
           setIsSignUp(false);
           setFormData((prev) => ({
             ...prev,
             username: "",
             phone: "",
             confirmPassword: "",
           }));
         }, 1500);
       } else {
         // Handle signin
         const signinData = {
           email: formData.email,
           password: formData.password,
         };

         await dispatch(signinUser(signinData));
         showToast("Signed in successfully!", "success");

         // Redirect to intended page
         setTimeout(() => {
           router.push(redirectUrl);
         }, 1000);
       }
     } catch (error) {
       console.error("Auth error:", error);
       showToast(
         error.message ||
           `${isSignUp ? "Sign up" : "Sign in"} failed. Please try again.`,
         "error"
       );
     } finally {
       setIsLoading(false);
     }
   };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="p-6">
      {/* Toggle Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold font-montserrat text-gray-900 dark:text-gray-100 mb-2">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isSignUp
            ? "Fill in your details to get started"
            : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username - Sign Up Only */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium font-roboto text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg font-roboto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.username
                    ? "border-red-300 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.username}
              </p>
            )}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium font-roboto text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg font-roboto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.email
                  ? "border-red-300 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone - Sign Up Only */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium font-roboto text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg font-roboto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.phone
                    ? "border-red-300 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone}
              </p>
            )}
          </div>
        )}

        {/* Password */}
        <div>
          <label className="block text-sm font-medium font-roboto text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg font-roboto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.password
                  ? "border-red-300 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password - Sign Up Only */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium font-roboto text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg font-roboto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium font-montserrat text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Toggle Auth Mode */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium font-roboto transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
