// src/app/community/online-services/water-sewage/apply/page.js
"use client";

import React from "react";
import WaterSewageApply from "@/components/community/service-pages/wasteManagementSchedule";
import BackButton from "@/components/common/buttons/backButton";
export default function WaterSewageApplyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <BackButton />
      <WaterSewageApply />
    </div>
  );
}
