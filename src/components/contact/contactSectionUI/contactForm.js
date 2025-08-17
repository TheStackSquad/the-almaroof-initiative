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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 font-montserrat">
        Send a Message
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 font-roboto">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                       focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 font-roboto">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                       focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 font-roboto">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                     focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
            placeholder="What's this about?"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 font-roboto">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                     focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="Share your thoughts, ideas, or concerns..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                   text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 
                   transform hover:scale-105 transition-all duration-300 shadow-lg 
                   hover:shadow-emerald-500/25 font-montserrat"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
