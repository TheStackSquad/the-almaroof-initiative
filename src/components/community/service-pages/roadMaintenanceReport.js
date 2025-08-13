// src/components/community/service-pages/RoadMaintenanceReport.js
"use client";
import { useDispatch } from "react-redux";
import { reportRoadMaintenance } from "@/redux/action/roadMaintenanceAction";

export default function RoadMaintenanceReport({
  serviceId,
  actionId,
  serviceConfig,
  actionConfig,
}) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-montserrat text-gray-900 dark:text-white text-center">
        road maintenance report component
      </h1>
    </div>
  );
}
