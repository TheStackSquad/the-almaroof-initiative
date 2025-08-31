// src/components/forms/permitForm.js
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/utils/auth/useAuth";

// Utils and configs
import validatePermitForm from "@/utils/validate/validatePermitForm";
import { onSubmitPermitForm } from "@/utils/handlers/onSubmitPermitForm";
import { showToast } from "@/components/common/toastAlert/toast";
import { getPermitFee, formatAmount } from "@/config/permitFees";
import { checkSession } from "@/redux/action/authAction";

// Static imports for critical components
import FormHeader from "@/components/forms/formHeader";
import FormFields from "@/components/forms/formFields";
import LoadingState from "@/components/forms/loadingState";
import AuthRequiredState from "@/components/forms/authRequiredState";

// Dynamic imports for non-critical components
const FeeCard = dynamic(() => import("@/components/common/feeCard"), {
  loading: () => (
    <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
  ),
});

const SuccessModal = dynamic(() => import("@/modal/successModal"), {
  ssr: false,
});

// Redux selectors
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
  const { requireAuth } = useAuth(); // Use the auth hook

  // Memoized selectors for performance
  const authState = useSelector(selectAuthState);
  const userId = useSelector(selectUserId);
  const userEmail = useSelector(selectUserEmail);
  const userPhone = useSelector(selectUserPhone);
  const userName = useSelector(selectUserName);

  // State management
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => ({
    full_name: "",
    email: "",
    phone: "",
    permit_type: permitType,
    application_type: "",
    amount: 0,
  }));

  // Authentication check
  useEffect(() => {
    const authCheck = requireAuth({
      redirectTo: "/auth/signin",
      checkSession: true,
      returnUrl: true,
    });

    if (authCheck.authorized === false && authCheck.redirectUrl) {
      router.push(authCheck.redirectUrl);
    }
  }, [requireAuth, router]);

  // Auto-fill form when user data is available
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
  ]);

  // Check session on component mount
  useEffect(() => {
    if (!authState.sessionChecked && !authState.loading) {
      dispatch(checkSession());
    }
  }, [dispatch, authState.sessionChecked, authState.loading]);

  // Update amount when permit/application type changes
  useEffect(() => {
    if (formData.permit_type && formData.application_type) {
      const fee = getPermitFee(formData.permit_type, formData.application_type);
      setFormData((prev) => ({ ...prev, amount: fee }));
    }
  }, [formData.permit_type, formData.application_type]);

  // Optimized event handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleTypeChange = useCallback(
    (e) => {
      const { value } = e.target;
      const fee = getPermitFee(formData.permit_type, value);

      setFormData((prev) => ({
        ...prev,
        application_type: value,
        amount: fee,
      }));

      if (errors.application_type) {
        setErrors((prev) => ({ ...prev, application_type: "" }));
      }
    },
    [formData.permit_type, errors.application_type]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);

      try {
        // Validate form first
        const formErrors = validatePermitForm(formData);
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          showToast("Please fix the errors in the form", "error");
          setLoading(false);
          return;
        }

        const result = await onSubmitPermitForm(formData, authState);

        if (result.requiresAuth) {
          router.push("/auth-entry");
          return;
        }

        if (!result.success) {
          setErrors({ submit: result.error });
          showToast(result.error || "Submission failed", "error");
          return;
        }

        // Redirect to payment first
        if (result.data?.payment_url) {
          router.push(result.data.payment_url);
        } else {
          // If no payment needed, show success
          showToast("Permit application submitted!", "success");
          setFormData((prev) => ({
            ...prev,
            permit_type: "",
            application_type: "",
          }));
        }
      } catch (error) {
        console.error("Submission error:", error);
        setErrors({ submit: error.message });
        showToast("An unexpected error occurred", "error");
      } finally {
        setLoading(false);
      }
    },
    [formData, authState, router]
  );

  const handleModalClose = useCallback(() => {
    setShowSuccessModal(false);
    setSubmissionResult(null);
    router.push("/community/online-services");
  }, [router]);

  // Simplified loading logic
  if (authState.loading || !authState.sessionChecked) {
    return <LoadingState type="authentication" />;
  }

  if (!authState.isAuthenticated) {
    return <AuthRequiredState onSignIn={() => router.push("/auth/signin")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <FormHeader
          permitType={permitType}
          authState={authState}
          userName={userName}
          userEmail={userEmail}
          userId={userId}
        />

        {formData.permit_type && (
          <div className="mb-6">
            <FeeCard
              permitType={formData.permit_type}
              applicationType={formData.application_type}
              amount={formData.amount}
              onTypeChange={handleTypeChange}
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <FormFields
            formData={formData}
            errors={errors}
            loading={loading}
            isFormReady={authState.isAuthenticated}
            canSubmit={
              !loading && formData.application_type && formData.amount > 0
            }
            onChange={handleChange}
            onTypeChange={handleTypeChange}
            onSubmit={handleSubmit}
          />
        </div>

        {showSuccessModal && (
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={handleModalClose}
            reference={submissionResult?.reference}
            email={formData.email}
            permitType={formData.permit_type}
            applicationType={formData.application_type}
          />
        )}
      </div>
    </div>
  );
}
