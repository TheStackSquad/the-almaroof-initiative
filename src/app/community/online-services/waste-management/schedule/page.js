// src/app/community/online-services/waste-management/schedule/page.js
"use client";

import React from "react";
import WasteManagementSchedule from "@/components/community/service-pages/wasteManagementSchedule";
import BackButton from "@/components/common/buttons/backButton";

export default function WasteManagementSchedulePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <BackButton />
      <WasteManagementSchedule />
    </div>
  );
}
