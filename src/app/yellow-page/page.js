// src/app/community/yellow-page/page.js
"use client";

import { useState, useMemo } from "react";
import { mockBusinesses } from "@/data/yellowData";

// Correctly import all necessary components from the directory
import BusinessCard from "@/components/community/yellowPage/businessCard";
import SearchFilters from "@/components/community/yellowPage/searchFilters";
import BusinessModal from "@/components/community/yellowPage/businessModal";
import RegistrationForm from "@/components/community/yellowPage/registrationForm";
import BusinessGrid from "@/components/community/yellowPage/businessGrid";
import StatCards from "@/components/community/yellowPage/statCards";
import HeaderSection from "@/components/community/yellowPage/headerSection";
import EmptyResults from "@/components/community/yellowPage/emptyResults";
import FooterCTA from "@/components/community/yellowPage/footerCTA";

const YellowPageDirectory = () => {
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Filter businesses based on search criteria
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || business.category === selectedCategory;
      const matchesArea = !selectedArea || business.area === selectedArea;
      const matchesVerified = !showVerifiedOnly || business.verified;

      return matchesSearch && matchesCategory && matchesArea && matchesVerified;
    });
  }, [
    businesses,
    searchTerm,
    selectedCategory,
    selectedArea,
    showVerifiedOnly,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const totalBusinesses = businesses.length;
    const verifiedBusinesses = businesses.filter((b) => b.verified).length;
    const categories = [...new Set(businesses.map((b) => b.category))].length;

    return {
      total: totalBusinesses,
      verified: verifiedBusinesses,
      categories: categories,
    };
  }, [businesses]);

  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const handleRegistrationSubmit = (newBusiness) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
    console.log("New business registered:", newBusiness);
    // In a real app, this would make an API call
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Refactored to use the HeaderSection component */}
      <HeaderSection onRegisterClick={() => setShowRegistrationForm(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Refactored to use the StatCards component */}
        <StatCards stats={stats} />

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          showVerifiedOnly={showVerifiedOnly}
          setShowVerifiedOnly={setShowVerifiedOnly}
          resultsCount={filteredBusinesses.length}
        />

        {/* Business Grid or Empty Results */}
        {filteredBusinesses.length > 0 ? (
          // Refactored to use the BusinessGrid component
          <BusinessGrid
            businesses={filteredBusinesses}
            onViewDetails={handleViewDetails}
          />
        ) : (
          // Refactored to use the EmptyResults component
          <EmptyResults
            onClearFilters={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSelectedArea("");
              setShowVerifiedOnly(false);
            }}
          />
        )}

        {/* Refactored to use the FooterCTA component */}
        <FooterCTA onRegisterClick={() => setShowRegistrationForm(true)} />
      </div>

      {/* Business Details Modal */}
      <BusinessModal
        business={selectedBusiness}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBusiness(null);
        }}
      />

      {/* Registration Form Modal */}
      <RegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  );
};

export default YellowPageDirectory;
