// src/components/community/service-pages/WaterSewageApply.js
"use client";
import { useDispatch } from "react-redux";
//import { submitWaterSewageApplication } from "@/redux/action/waterSewageAction";

export default function WaterSewageApply({
  serviceId,
  actionId,
  serviceConfig,
  actionConfig,
}) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-montserrat text-gray-900 dark:text-white text-center">
        water sewage apply component
      </h1>
    </div>
  );
}
