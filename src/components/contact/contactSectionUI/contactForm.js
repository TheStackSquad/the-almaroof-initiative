//src/components/contact/contactSectionUI/contactForm.js
"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Form submitted successfully:", result);
        // Reset form, show success message, etc.
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Form submission failed:", result.error);
        // Show error message to user
      }
    } catch (error) {
      console.error("Network error:", error);
      // Show network error message
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-shadow duration-500">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-montserrat">
        Send a Message
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 font-roboto">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 
                       focus:ring-emerald-500 focus:border-transparent transition-all duration-300
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 font-roboto">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 
                       focus:ring-emerald-500 focus:border-transparent transition-all duration-300
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 font-roboto">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 
                     focus:ring-emerald-500 focus:border-transparent transition-all duration-300
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="What's this about?"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 font-roboto">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 
                     focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Share your thoughts, ideas, or concerns..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                   text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 
                   transform hover:scale-105 transition-all duration-300 shadow-lg 
                   hover:shadow-emerald-500/25 font-montserrat dark:from-emerald-500 dark:to-teal-500
                   dark:hover:from-emerald-600 dark:hover:to-teal-600"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
