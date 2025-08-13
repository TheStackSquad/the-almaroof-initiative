// src/app/community/yellow-page/page.js
"use client";

import { useState, useMemo } from "react";
import { Plus, BookOpen, Users, Building2 } from "lucide-react";
import { mockBusinesses } from "../../data/yellowData";
import BusinessCard from "../../components/community/yellowPage/businessCard";
import SearchFilters from "../../components/community/yellowPage/searchFilters";
import BusinessModal from "../../components/community/yellowPage/businessModal";
import RegistrationForm from "../../components/community/yellowPage/registrationForm";

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
    // Add new business to the list
    setBusinesses((prev) => [newBusiness, ...prev]);
    console.log("New business registered:", newBusiness);
    // In a real app, this would make an API call
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 mt-10 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
                Oshodi Business Directory
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 font-['Roboto']">
                Your comprehensive guide to businesses and institutions in
                Oshodi LGA
              </p>
            </div>
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Register Business
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
                  {stats.total}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Total Businesses
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
                  {stats.verified}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Verified Businesses
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
                  {stats.categories}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Categories</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Business Grid */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-['Montserrat']">
                No businesses found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No businesses match your current search criteria. Try adjusting
                your filters or search term.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedArea("");
                  setShowVerifiedOnly(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-['Montserrat']">
              Want to list your business?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 font-['Roboto']">
              Join our growing directory and connect with customers in Oshodi
              LGA. Registration is free and easy!
            </p>
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Register Your Business
            </button>
          </div>
        </div>
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
