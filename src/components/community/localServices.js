// src/components/community/localServices.js

"use client"; 

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useFadeIn } from "@/animation/aboutAnimate";
import {
  getAllServices,
  getServicesByCategory,
  getServiceById, // NEW: Import helper function
} from "@/data/localServicesData";
import ServiceModal from "@/modal/serviceModal";
import { generateServiceUrl } from "@/utils/route/routeValidator";

// Import the new sub-components
import ServiceCard from "@/components/community/local-services/serviceCards";
import CategorySection from "./local-services/categorySection";

export default function LocalServices() {
  const [ref, isVisible] = useFadeIn(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({
    "Emergency Services": true,
    "Online-First Services": true,
    "Utilities & Infrastructure": false,
    "Administrative Services": false,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  console.log("auth from redux:", authState);
  const { isAuthenticated, isLoading } = authState;

  // Handle service actions with proper auth check
  const handleServiceAction = (service, actionType) => {
    if (actionType === "details") {
      openServiceModal(service);
      return;
    }

    if (actionType === "online") {
      const targetUrl = getServiceUrl(service);

      // Check if auth state is still loading
      if (isLoading) {
        console.log("Auth state loading, please wait...");
        return;
      }

      if (!isAuthenticated) {
        const encodedRedirect = encodeURIComponent(targetUrl);
        router.push(
          `/community/online-services/protected-route?redirect=${encodedRedirect}`
        );
      } else {
        router.push(targetUrl);
      }
    }
  };

  const getServiceUrl = (service) => {
    const url = generateServiceUrl(service.id);

    if (!url) {
      console.warn(`Could not generate URL for service: ${service.id}`);
      if (service.id === "business-permits") {
        return "/community/online-services/business-permit/apply/";
      }
      return `/community/online-services/${service.id}/${
        service.primaryAction || "service"
      }`;
    }
    return url;
  };

  const openServiceModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const categories = [
    {
      name: "Emergency Services",
      icon: "🚨",
      color: "red",
      alwaysExpanded: true,
    },
    { name: "Online-First Services", icon: "💻", color: "green" },
    { name: "Utilities & Infrastructure", icon: "🔧", color: "blue" },
    { name: "Administrative Services", icon: "📋", color: "purple" },
  ];

  const getServicesByFilter = () => {
    const services =
      selectedCategory === "all"
        ? getAllServices()
        : getServicesByCategory(selectedCategory);

    return searchTerm
      ? services.filter(
          (service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : services;
  };

  return (
    <>
      <div
        ref={ref}
        className={`
          p-8 rounded-xl shadow-lg transition-all duration-1000 backdrop-blur-sm
          bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="font-montserrat text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Local Services Directory
          </h2>
          <p className="font-roboto text-gray-600 dark:text-gray-400 mb-4">
            Access government services online - Skip the queue, save time!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                bg-white border-gray-300 text-gray-900 placeholder-gray-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
              `}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchTerm(""); // Clear search when category changes
            }}
            className={`
              px-4 py-3 rounded-lg border-2 transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              bg-white border-gray-300 text-gray-900
              dark:bg-gray-700 dark:border-gray-600 dark:text-white
            `}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Services Display */}
        {selectedCategory === "all" ? (
          categories.map((category) => (
            <CategorySection
              key={category.name}
              category={category}
              expandedCategories={expandedCategories}
              setExpandedCategories={setExpandedCategories}
              openServiceModal={openServiceModal}
            />
          ))
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getServicesByFilter().map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAction={handleServiceAction}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {getServicesByFilter().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-montserrat text-xl font-semibold mb-2">
              No services found
            </h3>
            <p className="font-roboto text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </>
  );
}
