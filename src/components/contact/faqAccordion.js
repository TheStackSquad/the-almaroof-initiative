// src/components/contact/FAQAccordion.js
"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { faqVariants, iconVariants } from "@/animation/faqAnimate";

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I find my ward information?",
      answer:
        "Visit the Office of the Electoral Officer at the Local Government Secretariat. Contact: 0803-XXX-XXXX, Room 12, Block B.",
    },
    {
      question: "Where can I get information about ongoing projects?",
      answer:
        "The Ministry of Works maintains project records. Contact: 0805-XXX-XXXX or visit Project Monitoring Unit, 2nd Floor, Secretariat.",
    },
    {
      question: "How do I report a security concern?",
      answer:
        "Contact the Local Government Security Committee: 0807-XXX-XXXX (24/7) or visit the Security Office near the main gate.",
    },
    {
      question: "Where do I obtain business permits?",
      answer:
        "Business permits are issued by the Revenue Department. Visit Room 5, Finance Block with your business registration documents.",
    },
    {
      question: "How do I apply for certificates (birth, death, etc.)?",
      answer:
        "Vital registrations are handled by the Health Department. Visit the Records Office with required documents (ID, proof of event).",
    },
    {
      question: "Where can I complain about public utilities?",
      answer:
        "Public Works Department handles utilities complaints. Call: 0809-XXX-XXXX or visit Utilities Desk at the Secretariat.",
    },
  ];

  return (
    <div className="mt-12  mb-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Local Government FAQs
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200 dark:border-gray-700 pb-4"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {faq.question}
              </h3>
              <motion.div
                animate={activeIndex === index ? "open" : "closed"}
                variants={iconVariants}
              >
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              </motion.div>
            </button>

            <motion.div
              initial="closed"
              animate={activeIndex === index ? "open" : "closed"}
              variants={faqVariants}
              className="overflow-hidden"
            >
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
