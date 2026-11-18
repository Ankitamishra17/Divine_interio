"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQ({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = data?.faq || [];

  const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
  const rightFaqs = faqs.filter((_, i) => i % 2 !== 0);

  return (
    <section className="py-16 md:py-20 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="uppercase tracking-[0.3em] text-[#dba343] text-xs mb-4">
            Frequently Asked Questions
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-[#2A1506]">
            Everything You Need To Know
          </h2>

          <div className="w-12 h-px bg-[#dba343] mx-auto mt-6" />
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftFaqs.map((faq) => {
              const originalIndex = faqs.indexOf(faq);

              return (
                <FAQItem
                  key={originalIndex}
                  faq={faq}
                  index={originalIndex}
                  openIndex={openIndex}
                  toggleFAQ={toggleFAQ}
                />
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightFaqs.map((faq) => {
              const originalIndex = faqs.indexOf(faq);

              return (
                <FAQItem
                  key={originalIndex}
                  faq={faq}
                  index={originalIndex}
                  openIndex={openIndex}
                  toggleFAQ={toggleFAQ}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, index, openIndex, toggleFAQ }) {
  const isOpen = openIndex === index;

  return (
    <div className="border border-[#dba343]/15 bg-white overflow-hidden group hover:border-[#dba343]/40 transition-all duration-300">
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full flex items-start justify-between p-5 md:p-6 text-left gap-4"
      >
        {/* Number + Question */}
        <div className="flex items-start gap-4 flex-1">
          <span className="text-[#dba343]/40 text-xs tracking-[0.2em] font-light mt-1">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="font-medium text-[#2A1506] text-[12px] md:text-sm leading-snug group-hover:text-[#dba343] transition-colors">
            {faq.question}
          </span>
        </div>

        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-[#dba343] border-[#dba343]"
              : "border-[#dba343]/30"
          }`}
        >
          {isOpen ? (
            <Minus size={14} className="text-white" />
          ) : (
            <Plus size={14} className="text-[#dba343]" />
          )}
        </div>
      </button>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6 pl-14 text-[#6E6258] text-sm leading-7 border-t border-[#dba343]/10 pt-4">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}