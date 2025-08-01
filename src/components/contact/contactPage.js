//src/components/contact/ContactPage.js

import React, { useState, useMemo } from "react";
import ContactHeader from "./contactHeader";
import QuickContacts from "./quickContacts";
import ContactFilter from "./contactFilter";
import ContactGrid from "./contactGrid";
import {
  contactData,
  contactCategories,
  quickContacts,
} from "../../data/contactData";

const ContactPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and search logic
  const filteredContacts = useMemo(() => {
    let allContacts = [];

    // Combine all contacts
    if (activeCategory === "all") {
      allContacts = [
        ...contactData.executive.contacts,
        ...contactData.legislative.contacts,
      ];
    } else if (activeCategory === "executive") {
      allContacts = contactData.executive.contacts;
    } else if (activeCategory === "legislative") {
      allContacts = contactData.legislative.contacts;
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      allContacts = allContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchLower) ||
          contact.position.toLowerCase().includes(searchLower) ||
          contact.department.toLowerCase().includes(searchLower) ||
          (contact.ward && contact.ward.toLowerCase().includes(searchLower))
      );
    }

    return allContacts;
  }, [activeCategory, searchTerm]);

  const groupedContacts = useMemo(() => {
    if (activeCategory === "all") {
      const executive = filteredContacts.filter((contact) =>
        contactData.executive.contacts.some((exec) => exec.id === contact.id)
      );
      const legislative = filteredContacts.filter((contact) =>
        contactData.legislative.contacts.some((leg) => leg.id === contact.id)
      );
      return { executive, legislative };
    }
    return null;
  }, [filteredContacts, activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchTerm("");
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <ContactHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Quick Contacts Section */}
        <QuickContacts quickContacts={quickContacts} />

        {/* Filter Section */}
        <ContactFilter
          categories={contactCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeCategory === "all"
                  ? "All Contacts"
                  : activeCategory === "executive"
                  ? "Executive Branch"
                  : "Legislative Branch"}
              </h2>
              <p className="text-gray-600 mt-1">
                {searchTerm ? (
                  <>
                    Showing {filteredContacts.length} result
                    {filteredContacts.length !== 1 ? "s" : ""} for &quot;
                    {searchTerm}&quot;
                  </>
                ) : (
                  <>
                    Showing {filteredContacts.length} contact
                    {filteredContacts.length !== 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="name">Name</option>
                <option value="position">Position</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Display */}
        {activeCategory === "all" && groupedContacts ? (
          <>
            {/* Executive Branch */}
            {groupedContacts.executive.length > 0 && (
              <ContactGrid
                contacts={groupedContacts.executive}
                title={contactData.executive.title}
                description={contactData.executive.description}
              />
            )}

            {/* Legislative Branch */}
            {groupedContacts.legislative.length > 0 && (
              <ContactGrid
                contacts={groupedContacts.legislative}
                title={contactData.legislative.title}
                description={contactData.legislative.description}
              />
            )}
          </>
        ) : (
          <ContactGrid
            contacts={filteredContacts}
            title={
              activeCategory === "executive"
                ? contactData.executive.title
                : activeCategory === "legislative"
                ? contactData.legislative.title
                : null
            }
            description={
              activeCategory === "executive"
                ? contactData.executive.description
                : activeCategory === "legislative"
                ? contactData.legislative.description
                : null
            }
          />
        )}

        {/* Office Hours & Additional Info */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Office Hours */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Office Hours
              </h3>
              <p className="text-gray-600">Monday - Friday</p>
              <p className="text-gray-600">8:00 AM - 5:00 PM</p>
              <p className="text-sm text-blue-600 mt-2">
                Closed on public holidays
              </p>
            </div>

            {/* Location */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0L4.343 16.657a8 8 0 1113.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600">Oshodi Local Government</p>
              <p className="text-gray-600">Secretariat, Oshodi</p>
              <p className="text-gray-600">Lagos State, Nigeria</p>
            </div>

            {/* Response Time */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Response Time
              </h3>
              <p className="text-gray-600">Emergency: Immediate</p>
              <p className="text-gray-600">General: 24-48 hours</p>
              <p className="text-gray-600">Complex issues: 3-5 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
