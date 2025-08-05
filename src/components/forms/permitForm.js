// src/components/forms/permitForm.js
"use client";

import { useState } from "react";
import  validatePermitForm  from "../../utils/validate/validatePermitForm";
import { onSubmitPermitForm } from "../../utils/handlers/onSubmitPermitForm";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/common/toastAlert/toast"; // Import the showToast function

export default function PermitForm({ permitType }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    permit_type: permitType || "",
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

    const validationErrors = validatePermitForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      showToast("Please fix the errors in the form", "error"); // Toast for validation error
      return;
    }

    const { success, data, error } = await onSubmitPermitForm(formData);

    if (!success) {
      setErrors({ submit: error || "Submission failed" });
      showToast(error || "Failed to submit. Try again.", "error"); // Toast for API submission error
      setLoading(false);
      return;
    }

    showToast("Application submitted successfully!", "success"); // Toast for successful submission

    // Store payment link or redirect
    if (data?.reference) {
      const paymentUrl = `/community/online-services/business-permit/next-step?ref=${data.reference}`;
      setPaymentLink(paymentUrl);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4">
      {/* ... (form elements) ... */}
      <h2 className="text-2xl font-bold text-center">Apply for {permitType}</h2>

      <div>
        <label htmlFor="full_name" className="block font-medium">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {errors.full_name && <p className="text-red-500">{errors.full_name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block font-medium">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {paymentLink && (
        <div className="mt-6">
          <a
            href={paymentLink}
            className="inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Proceed to Payment
          </a>
        </div>
      )}
    </form>
  );
}