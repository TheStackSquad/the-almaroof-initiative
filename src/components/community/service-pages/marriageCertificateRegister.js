// src/components/community/service-pages/MarriageCertificateRegister.js
"use client";
import { useDispatch } from "react-redux";
import { submitMarriageCertificateRegistration } from "@/redux/action/marriageCertificateAction";

export default function MarriageCertificateRegister({
  serviceId,
  actionId,
  serviceConfig,
  actionConfig,
}) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-montserrat text-gray-900 dark:text-white text-center">
        marriage certificate register component
      </h1>
    </div>
  );
}
