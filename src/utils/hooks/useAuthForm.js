// src/utils/hooks/useAuthForm.js

import { useState, useCallback, useMemo, useRef } from "react";
import { validateSignupForm } from "@/utils/validate/signup-validate";
import { validateLoginForm } from "@/utils/validate/login-validate";
import { generatePassword } from "@/lib/generatePassword/generatePassword";

// 🔹 Helper: check password strength criteria
const getPasswordCriteria = (password) => ({
  hasMinLength: password.length >= 8,
  hasLowercase: /[a-z]/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
});

const initialFormData = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export const useAuthForm = (isSignUpInitial = true) => {
  // 🔹 State
  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  // 🔹 Keep track of previous password criteria for animations
  const previousCriteriaRef = useRef({});

  // 🔹 Validate form based on mode
  const validateForm = useCallback(() => {
    const validator = isSignUp ? validateSignupForm : validateLoginForm;
    const result = validator(formData);
    setErrors(result.errors);
    return result;
  }, [formData, isSignUp]);

  // 🔹 Handle input change
  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (prev[name]) {
        return { ...prev, [name]: "" };
      }
      return prev;
    });
  }, []);

  // 🔹 Generate password helper
  const generateNewPassword = useCallback(() => {
    const newPassword = generatePassword();
    handleInputChange("password", newPassword);
    if (isSignUp) {
      handleInputChange("confirmPassword", newPassword);
    }
  }, [isSignUp, handleInputChange]);

  // 🔹 Toggle signup / login
  const toggleAuthMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setFormData(initialFormData);
    setErrors({});
  }, []);

  // 🔹 Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  // 🔹 Password criteria (with animation flags + progress)
  const passwordCriteria = useMemo(() => {
    const newCriteria = getPasswordCriteria(formData.password);
    const previousCriteria = previousCriteriaRef.current;

    const criteriaChanges = {
      hasMinLength: !previousCriteria.hasMinLength && newCriteria.hasMinLength,
      hasLowercase: !previousCriteria.hasLowercase && newCriteria.hasLowercase,
      hasUppercase: !previousCriteria.hasUppercase && newCriteria.hasUppercase,
      hasNumber: !previousCriteria.hasNumber && newCriteria.hasNumber,
      hasSpecialChar:
        !previousCriteria.hasSpecialChar && newCriteria.hasSpecialChar,
    };

    // Update ref for next comparison
    previousCriteriaRef.current = newCriteria;

    const completedCount = Object.values(newCriteria).filter(Boolean).length;
    const totalCount = Object.keys(newCriteria).length;

    return {
      ...newCriteria,
      changes: criteriaChanges,
      completedCount,
      totalCount,
      isPasswordFocused,
      setIsPasswordFocused,
    };
  }, [formData.password, isPasswordFocused]);

  // 🔹 Expose API
  return {
    isSignUp,
    isLoading,
    showPassword,
    showConfirmPassword,
    errors,
    formData,
    setIsLoading,
    setShowPassword,
    setShowConfirmPassword,
    validateForm,
    handleInputChange,
    generateNewPassword,
    toggleAuthMode,
    resetForm,
    passwordCriteria,
  };
};
