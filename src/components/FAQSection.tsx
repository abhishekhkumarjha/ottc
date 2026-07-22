import React, { useState } from "react";
import { FAQS } from "../coursesData";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight">Admissions FAQ</h2>
        <p className="text-gray-500 font-sans text-xs sm:text-sm">
          Quickly read our verified responses about technical trade courses, licenses, certificates, and logistics support.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-emerald-100 transition-all duration-300"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex justify-between items-center space-x-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span className="font-display font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className={`h-4.5 w-4.5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-emerald-600" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-gray-50 bg-gray-50/20 animate-in slide-in-from-top-2 duration-200">
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed pt-3 sm:pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
