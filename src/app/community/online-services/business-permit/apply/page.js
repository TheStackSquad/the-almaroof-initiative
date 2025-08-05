// /src/app/community/online-services/business-permit/apply/page.js
import React from "react";
import PermitForm from "@/components/forms/permitForm";

export const metadata = {
  title: "Apply for Business Permit",
  description: "Submit your application for a new business permit.",
};

export default function BusinessPermitApplyPage() {
  return (
    <main className="min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-32 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        Apply for a New Business Permit
      </h1>
      <PermitForm />
    </main>
  );
}
