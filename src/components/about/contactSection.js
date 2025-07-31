//src/app/about/contactSection.js

"use client";

import React, { useState } from "react";
import { useSlideIn, useFadeIn } from "../../animation/aboutAnimate";

export default function ContactSection() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [formRef, formStyle] = useSlideIn("left", 400);
  const [infoRef, infoStyle] = useSlideIn("right", 600);

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
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "📘",
      handle: "@kehinde.oloyedeal",
      color: "hover:text-blue-600",
    },
    {
      name: "TikTok",
      icon: "🎵",
      handle: "@kehinde.oloyedeal",
      color: "hover:text-pink-600",
    },
    {
      name: "Instagram",
      icon: "📷",
      handle: "@kehinde.oloyedeal",
      color: "hover:text-purple-600",
    },
    {
      name: "Twitter",
      icon: "🐦",
      handle: "@kehinde_almaroof",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Get In Touch
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            Your voice matters. Reach out to share your ideas, concerns, or
            suggestions for our community
          </p>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div ref={formRef} style={formStyle}>
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-500">
              <h3
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
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
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
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
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
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
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
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
                           hover:shadow-emerald-500/25"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div ref={infoRef} style={infoStyle} className="space-y-8">
            {/* Office Information */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg">
              <h3
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Office Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🏛️</div>
                  <div>
                    <h4
                      className="font-bold text-gray-800 mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Office Address
                    </h4>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      Oshodi-Isolo Local Government Secretariat
                      <br />
                      Lagos State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h4
                      className="font-bold text-gray-800 mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Office Hours
                    </h4>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      Monday - Friday: 8:00 AM - 4:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Connect on Social Media
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-xl bg-gray-50 
                                 hover:bg-gray-100 cursor-pointer transform hover:scale-105 
                                 transition-all duration-300 ${social.color}`}
                  >
                    <div className="text-2xl">{social.icon}</div>
                    <div>
                      <h4
                        className="font-bold text-gray-800"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {social.name}
                      </h4>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Roboto, serif" }}
                      >
                        {social.handle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
              <h3
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Need Immediate Assistance?
              </h3>
              <p
                className="text-emerald-100 mb-6"
                style={{ fontFamily: "Roboto, serif" }}
              >
                For urgent matters affecting our community, don&apos;t hesitate to
                reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-full 
                                 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Emergency Contact
                </button>
                <button
                  className="px-6 py-3 border-2 border-white text-white hover:bg-white 
                                 hover:text-emerald-700 font-bold rounded-full transform 
                                 hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}