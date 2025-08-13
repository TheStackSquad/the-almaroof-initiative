// src/components/community/yellowPage/emergencyServicesSection.js
"use client";
import EmergencyServiceCard from "@/components/community/yellowPage/emergenceyServiceCards";

export default function EmergencyServicesSection({ services }) {
  return (
    <section className="my-8" aria-labelledby="emergency-services-heading">
      <h2
        id="emergency-services-heading"
        className="text-2xl font-bold mb-6 dark:text-white"
      >
        Emergency Services
      </h2>
      <div className="space-y-4">
        {services.map((service) => (
          <EmergencyServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
