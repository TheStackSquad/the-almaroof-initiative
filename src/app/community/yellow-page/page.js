// src/app/community/yellow-page/page.js
"use client";

import { useState, useMemo } from "react";
import { mockBusinesses, emergencyServices } from "@/data/yellowData";
import HeaderSection from "@/components/community/yellowPage/headerSection";
import StatsCards from "@/components/community/yellowPage/statCards";
import SearchFilters from "@/components/community/yellowPage/searchFilters";
import BusinessGridCategory from "@/components/community/yellowPage/businessGridCategory"; // Updated import
import EmptyResults from "@/components/community/yellowPage/emptyResults";
import FooterCTA from "@/components/community/yellowPage/footerCTA";
import BusinessModal from "@/components/community/yellowPage/businessModal";
import RegistrationForm from "@/components/community/yellowPage/registrationForm";
import EmergencyServicesSection from "@/components/community/yellowPage/emergencyServiceSection";

const YellowPageDirectory = () => {
  // State management (unchanged)
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Filter businesses (unchanged)
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

  // Statistics calculation (unchanged)
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

  // Handlers (unchanged)
  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const handleRegistrationSubmit = (newBusiness) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
    setShowRegistrationForm(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedArea("");
    setShowVerifiedOnly(false);
  };

  // Props for child components (unchanged)
  const filterProps = {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedArea,
    setSelectedArea,
    showVerifiedOnly,
    setShowVerifiedOnly,
    resultsCount: filteredBusinesses.length,
  };

  const modalProps = {
    business: selectedBusiness,
    isOpen: showModal,
    onClose: () => {
      setShowModal(false);
      setSelectedBusiness(null);
    },
  };

  const registrationProps = {
    isOpen: showRegistrationForm,
    onClose: () => setShowRegistrationForm(false),
    onSubmit: handleRegistrationSubmit,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <HeaderSection onRegister={() => setShowRegistrationForm(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Search and Filters */}
        <SearchFilters {...filterProps} />

        {/* Emergency Services Section */}
        <EmergencyServicesSection services={emergencyServices} />

        {/* Updated Business Grid with Categories */}
        {filteredBusinesses.length > 0 ? (
          <BusinessGridCategory
            businesses={filteredBusinesses}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <EmptyResults onClearFilters={handleClearFilters} />
        )}

        {/* Footer CTA */}
        <FooterCTA onRegister={() => setShowRegistrationForm(true)} />
      </div>

      {/* Modals */}
      <BusinessModal {...modalProps} />
      <RegistrationForm {...registrationProps} />
    </div>
  );
};

export default YellowPageDirectory;
