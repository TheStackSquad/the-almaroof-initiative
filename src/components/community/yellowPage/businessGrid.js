// src/components/community/yellowPage/BusinessGrid.js
import BusinessCard from "./businessCard";

export default function BusinessGrid({ businesses, onViewDetails }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
