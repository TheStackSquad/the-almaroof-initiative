// src/components/forms/permitForm.js

"use client";

import { useState } from "react";
import validatePermitForm from "../../utils/validate/validatePermitForm";
import { onSubmitPermitForm } from "../../utils/handlers/onSubmitPermitForm";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/common/toastAlert/toast";

export default function PermitForm({ permitType }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    permit_type: "", // Initialized as an empty string
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    console.log("Submitting form with data:", formData);

    const validationErrors = validatePermitForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation failed with errors:", validationErrors);
      setErrors(validationErrors);
      setLoading(false);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    console.log("Validation successful. Submitting to API...");
    const { success, data, error } = await onSubmitPermitForm(formData);

    if (!success) {
      console.error("API submission failed:", error);
      setErrors({ submit: error || "Submission failed" });
      showToast(error || "Failed to submit. Try again.", "error");
      setLoading(false);
      return;
    }

    console.log("API submission successful. Response data:", data);
    showToast("Application submitted successfully!", "success");

    if (data?.reference) {
      const paymentUrl = `/community/online-services/business-permit/next-step?ref=${data.reference}`;
      setPaymentLink(paymentUrl);
      console.log("Payment link generated:", paymentUrl);
    }

    setLoading(false);
    console.log("Form submission process finished.");
  };

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Apply for {permitType}
        </h2>

        {/* Full Name field */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
            />
          </div>
          {errors.full_name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.full_name}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone field */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number
          </label>
          <div className="mt-1">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
            />
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Permit Type Dropdown (New) */}
        <div>
          <label
            htmlFor="permit_type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Permit Type
          </label>
          <div className="mt-1">
            <select
              name="permit_type"
              value={formData.permit_type}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
            >
              <option value="" disabled>
                Select a permit type
              </option>
              <option value="business-permit">Business Permit</option>
              <option value="building-permit">Building Permit</option>
              <option value="event-permit">Event Permit</option>
            </select>
          </div>
          {errors.permit_type && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.permit_type}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>

        {/* Payment Link */}
        {paymentLink && (
          <div className="mt-6 text-center">
            <a
              href={paymentLink}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Proceed to Payment
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
