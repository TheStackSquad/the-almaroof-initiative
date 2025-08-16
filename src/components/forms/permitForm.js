// src/components/forms/PermitForm.js
"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import validatePermitForm from "@/utils/validate/validatePermitForm";
import { onSubmitPermitForm } from "@/utils/handlers/onSubmitPermitForm";
import { showToast } from "@/components/common/toastAlert/toast";
import { getPermitFee, formatAmount } from "@/config/permitFees";
import { checkSession } from "@/redux/action/authAction";
import AnimatedInput from "@/components/forms/animatedInput";
import FeeCard from "@/components/common/feeCard";
import SuccessModal from "@/modal/successModal";
import {
  selectAuthState,
  selectUserId,
  selectUserEmail,
  selectUserPhone,
  selectUserName,
} from "@/redux/lib/constant";

export default function PermitForm({ permitType = "business-permit" }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector(selectAuthState);
  const userId = useSelector(selectUserId);
  const userEmail = useSelector(selectUserEmail);
  const userPhone = useSelector(selectUserPhone);
  const userName = useSelector(selectUserName);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    permit_type: permitType,
    application_type: "",
    amount: 0,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Auto-fill form when user data is available

  useEffect(() => {
    if (authState.user && authState.isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        full_name: userName || prev.full_name,
        email: userEmail || prev.email,
        phone: userPhone || prev.phone,
      }));
    }
  }, [
    authState.user,
    authState.isAuthenticated,
    userName,
    userEmail,
    userPhone,
    userId,
  ]); // Check session on component mount if not already checked

  useEffect(() => {
    if (!authState.sessionChecked && !authState.loading) {
      dispatch(checkSession());
    }
  }, [dispatch, authState.sessionChecked, authState.loading]); // Update amount when permit/application type changes

  useEffect(() => {
    if (formData.permit_type && formData.application_type) {
      const fee = getPermitFee(formData.permit_type, formData.application_type);
      setFormData((prev) => ({ ...prev, amount: fee }));
    }
  }, [formData.permit_type, formData.application_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      application_type: value,
      amount: getPermitFee(prev.permit_type, value),
    }));

    if (errors.application_type) {
      setErrors((prev) => ({ ...prev, application_type: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (!authState.isAuthenticated || !userId) {
        showToast("Please sign in to submit your application", "error");
        if (authState.loading) {
          return; // Don't redirect if still loading
        }
        router.push("/auth-entry");
        return;
      }

      const validationErrors = validatePermitForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast("Please fix the errors in the form", "error");
        return;
      }

      const result = await onSubmitPermitForm(formData, userId);

      if (!result.success) {
        setErrors({ submit: result.error });
        showToast(
          result.error || "Failed to submit. Please try again.",
          "error"
        );
        return;
      }

      setSubmissionResult(result.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("💥 Unexpected error in form submission:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
      setErrors({ submit: "Unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setSubmissionResult(null);
    router.push("/community/online-services");
  };

  if (authState.loading && !authState.sessionChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
               {" "}
        <div className="text-center">
                   {" "}
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                   {" "}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Checking Authentication          {" "}
          </h2>
                   {" "}
          <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we verify your session...          {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }

  if (!authState.isAuthenticated && authState.sessionChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
               {" "}
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                   {" "}
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                       {" "}
            <svg
              className="w-10 h-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
                         {" "}
            </svg>
                     {" "}
          </div>
                   {" "}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Sign In Required          {" "}
          </h2>
                   {" "}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You need to be signed in to submit a permit application.
                     {" "}
          </p>
                   {" "}
          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
                        Sign In to Continue          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }

  const isFormReady =
    authState.isAuthenticated && userId && authState.sessionChecked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
           {" "}
      <div className="max-w-lg mx-auto">
               {" "}
        <div className="text-center mb-8">
                   {" "}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                       {" "}
            {permitType
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                        Application          {" "}
          </h1>
                   {" "}
          <p className="text-gray-600 dark:text-gray-400">
                        Fill out the form below to apply for your permit        
             {" "}
          </p>
                   {" "}
          {authState.user && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                           {" "}
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                                Welcome back,                {" "}
                <span className="font-semibold">{userName || userEmail}</span>!
                             {" "}
              </p>
                           {" "}
              <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                                User ID: {userId?.slice(0, 8)}...              {" "}
              </p>
                         {" "}
            </div>
          )}
                 {" "}
        </div>
               {" "}
        {formData.permit_type && (
          <FeeCard
            permitType={formData.permit_type}
            applicationType={formData.application_type}
            amount={formData.amount}
            onTypeChange={handleTypeChange}
          />
        )}
               {" "}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                   {" "}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
                       {" "}
            <AnimatedInput
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
              required
            />
                       {" "}
            <AnimatedInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
                       {" "}
            <AnimatedInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
                                    {/* NEW: Application Type Input */}         
             {" "}
            <AnimatedInput
              label="Application Type"
              name="application_type"
              type="select"
              value={formData.application_type}
              onChange={handleTypeChange}
              error={errors.application_type}
              required
            >
                            <option value="">Select a type</option>             {" "}
              <option value="new">New</option>             {" "}
              <option value="renew">Renewal</option>           {" "}
            </AnimatedInput>
                       {" "}
            <AnimatedInput
              label="Permit Type"
              name="permit_type"
              type="select"
              value={formData.permit_type}
              onChange={handleChange}
              error={errors.permit_type}
              required
            >
                            <option value="">Select a permit type</option>     
                      <option value="business-permit">Business Permit</option> 
                         {" "}
              <option value="building-permit">Building Permit</option>         
                  <option value="event-permit">Event Permit</option>           {" "}
            </AnimatedInput>
                       {" "}
            {formData.amount > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                               {" "}
                <div className="flex justify-between items-center">
                                   {" "}
                  <span className="text-gray-600 dark:text-gray-400">
                                        Amount to Pay:                  {" "}
                  </span>
                                   {" "}
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatAmount(formData.amount)}         
                           {" "}
                  </span>
                                 {" "}
                </div>
                             {" "}
              </div>
            )}
                       {" "}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                               {" "}
                <p className="text-red-600 dark:text-red-400">
                                    {errors.submit}               {" "}
                </p>
                             {" "}
              </div>
            )}
                       {" "}
            <button
              type="submit"
              disabled={loading || !isFormReady || !formData.application_type}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-white
                transition-all duration-300 transform
                ${
                loading || !isFormReady || !formData.application_type
                  ? "bg-gray-400 cursor-not-allowed scale-100"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
              }
              `}
            >
                           {" "}
              {loading ? (
                <span className="flex items-center justify-center">
                                   {" "}
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                                       {" "}
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                                     {" "}
                  </svg>
                                    Submitting...                {" "}
                </span>
              ) : !isFormReady ? (
                "Verifying Authentication..."
              ) : (
                `Submit Application & Pay ${formatAmount(formData.amount)}`
              )}
                         {" "}
            </button>
                       {" "}
            {process.env.NODE_ENV === "development" && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                               {" "}
                <p>
                                    Auth:{" "}
                  {authState.isAuthenticated ? "✅" : "❌"} | Session:          
                          {authState.sessionChecked ? "✅" : "❌"}             
                   {" "}
                </p>
                               {" "}
                <p>
                                    User: {userName || "N/A"} • ID:{" "}
                  {userId?.slice(0, 8) || "N/A"}                  ...          
                       {" "}
                </p>
                                <p>Ready: {isFormReady ? "✅" : "❌"}</p>       
                     {" "}
              </div>
            )}
                     {" "}
          </form>
                 {" "}
        </div>
               {" "}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleModalClose}
          reference={submissionResult?.reference}
          email={formData.email}
          permitType={formData.permit_type}
          applicationType={formData.application_type}
        />
             {" "}
      </div>
         {" "}
    </div>
  );
}
