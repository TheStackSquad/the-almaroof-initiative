//src/components/forms/permitForm.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/utils/auth/useAuth";
import { z } from "zod";

// Import the Zod schema
import { permitSchema } from "@/utils/validate/validatePermitForm";
import { onSubmitPermitForm } from "@/utils/handlers/onSubmitPermitForm";
import { showToast } from "@/components/common/toastAlert/toast";
import { getPermitFee } from "@/config/permitFees";

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
import { checkSession } from "@/redux/action/authAction";

export default function PermitForm({ permitType = "business-permit" }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();

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
    console.log("🔄 Checking for fee calculation:", {
      permit_type: formData.permit_type,
      application_type: formData.application_type,
      hasPermitType: !!formData.permit_type,
      hasApplicationType: !!formData.application_type,
    });

    if (formData.permit_type && formData.application_type) {
      console.log("✅ Conditions met, calculating fee...");

      const fee = getPermitFee(formData.permit_type, formData.application_type);

      console.log("💰 Fee calculation result:", {
        rawFee: fee,
        formattedFee: `₦${(fee / 100).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      });

      // Only update if amount is different to prevent infinite loops
      if (formData.amount !== fee) {
        console.log(
          "📊 Updating formData amount from",
          formData.amount,
          "to",
          fee
        );
        setFormData((prev) => ({ ...prev, amount: fee }));
      } else {
        console.log("⚡ Amount unchanged, skipping update");
      }
    } else {
      console.log("❌ Conditions not met for fee calculation");
    }
  }, [formData.permit_type, formData.application_type, formData.amount]); // Added formData.amount to dependencies

  // Add this useEffect to log formData changes
  useEffect(() => {
    console.log("📝 FormData updated:", {
      ...formData,
      amountDetails: {
        raw: formData.amount,
        formatted: `₦${(formData.amount / 100).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
    });
  }, [formData]);

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

  // Add log to handleTypeChange
  const handleTypeChange = useCallback(
    (e) => {
      const { value } = e.target;
      console.log("🎯 Application type changed to:", value);

      const fee = getPermitFee(formData.permit_type, value);
      console.log("💳 New fee calculated:", {
        raw: fee,
        formatted: `₦${(fee / 100).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      });

      setFormData((prev) => ({
        ...prev,
        application_type: value,
        amount: fee, // This should update the amount
      }));

      if (errors.application_type) {
        setErrors((prev) => ({ ...prev, application_type: "" }));
      }
    },
    [formData.permit_type, errors.application_type]
  );

  // Add this right after the component declaration to log initial config
  useEffect(() => {
    console.log("🎛️ Permit fees configuration:", {
      businessPermitNew: getPermitFee("business-permit", "new"),
      businessPermitRenew: getPermitFee("business-permit", "renew"),
      buildingPermitNew: getPermitFee("building-permit", "new"),
      buildingPermitRenew: getPermitFee("building-permit", "renew"),
      eventPermitNew: getPermitFee("event-permit", "new"),
      eventPermitRenew: getPermitFee("event-permit", "renew"),
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);

      console.log("🚀 SUBMISSION STARTED", { formData });

      try {
        // Step 1: Validate form data using Zod schema
        console.log("📋 Validating form data...");
        const result = permitSchema.safeParse(formData);
        console.log("✅ Validation result:", result);

        if (!result.success) {
          // Step 2: Format validation errors for display
          console.log("❌ Validation failed. Processing errors...");
          const formattedErrors = result.error.issues.reduce((acc, issue) => {
            console.log("📝 Error issue:", {
              path: issue.path,
              message: issue.message,
              code: issue.code,
            });

            if (issue.path.length > 0) {
              const fieldName = issue.path[0];
              acc[fieldName] = issue.message;
              console.log(`🔴 Field error: ${fieldName} - ${issue.message}`);
            } else if (issue.message) {
              // Handle schema-level errors without specific paths
              acc.submit = issue.message;
              console.log(`🔴 Schema error: ${issue.message}`);
            }
            return acc;
          }, {});

          console.log("📊 Formatted errors object:", formattedErrors);
          setErrors(formattedErrors);
          showToast("Please fix the errors in the form", "error");
          setLoading(false);
          return;
        }

        console.log("✅ Form validation passed. Proceeding to submission...");

        // Step 3: Submit validated data to backend API
        console.log("📤 Submitting to API...", { data: result.data });
        const resultFromSubmitHandler = await onSubmitPermitForm(
          result.data,
          authState
        );
        console.log("📥 API response:", resultFromSubmitHandler);

        // Step 4: Handle authentication requirements
        if (resultFromSubmitHandler.requiresAuth) {
          console.log("🔐 Authentication required, redirecting...");
          router.push("/auth-entry");
          return;
        }

        // Step 5: Handle submission failures
        if (!resultFromSubmitHandler.success) {
          console.log(
            "❌ API submission failed:",
            resultFromSubmitHandler.error
          );
          setErrors({ submit: resultFromSubmitHandler.error });
          showToast(
            resultFromSubmitHandler.error || "Submission failed",
            "error"
          );
          return;
        }

        console.log("✅ API submission successful");

        // Step 6: Handle successful submission
        if (resultFromSubmitHandler.data?.payment_url) {
          // Step 6a: Redirect to payment if required
          console.log(
            "💳 Redirecting to payment:",
            resultFromSubmitHandler.data.payment_url
          );
          router.push(resultFromSubmitHandler.data.payment_url);
        } else {
          // Step 6b: Show success message if no payment needed
          console.log("🎉 No payment required, showing success");
          showToast("Permit application submitted!", "success");
          setFormData((prev) => ({
            ...prev,
            permit_type: "",
            application_type: "",
          }));
        }
      } catch (error) {
        // Step 7: Handle unexpected errors
        console.error("💥 Unexpected submission error:", {
          message: error.message,
          stack: error.stack,
          formData: formData,
        });
        setErrors({ submit: error.message });
        showToast("An unexpected error occurred", "error");
      } finally {
        // Step 8: Clean up loading state
        console.log("🏁 Submission process completed");
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
            amount={formData.amount} // Pass the amount for proper formatting
          />
        )}
      </div>
    </div>
  );
}
