// src/app/community/online-services/tax-payment/pay/page.js
"use client";

import React from "react";
import TaxPayment from "@/components/community/service-pages/taxPayment";
import BackButton from "@/components/common/buttons/backButton";

export default function TaxPaymentPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
        <BackButton />
      <TaxPayment />
    </div>
  );
}
