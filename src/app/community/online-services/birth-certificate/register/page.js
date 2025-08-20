// src/app/community/online-services/birth-certificate/register/page.js
"use client";

import React from "react";
import BirthCertificateRegister from "@/components/community/service-pages/birthCertificateRegister";
import BackButton from "@/components/common/buttons/backButton";

export default function BirthCertificateRegisterPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <BackButton />
      <BirthCertificateRegister />
    </div>
  );
}
