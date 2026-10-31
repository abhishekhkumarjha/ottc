import React, { useState } from "react";
import { FAQS } from "../coursesData";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggleIndex = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-3"
      >
        <span className="section-eyebrow" style={{ color: "#a855f7" }}>Got Questions?</span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "#e2e8f0" }}>Admissions FAQ</h2>
        <p className="text-xs sm:text-sm max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
          Verified responses about technical trade courses, licenses, certificates, and logistics support.
        </p>
      </motion.div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl overflow-hidden"
              style={{
                border: isOpen ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.05)",
                background: isOpen ? "rgba(168,85,247,0.05)" : "rgba(10,22,40,0.6)",
                boxShadow: isOpen ? "0 0 20px rgba(168,85,247,0.08)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex justify-between items-center gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className="h-4 w-4 shrink-0"
                    style={{ color: isOpen ? "#a855f7" : "#334155" }}
                  />
                  <span
                    className="font-display font-semibold text-xs sm:text-sm leading-snug"
                    style={{ color: isOpen ? "#e2e8f0" : "#64748b" }}
                  >
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown
                    className="h-4 w-4 shrink-0"
                    style={{ color: isOpen ? "#a855f7" : "#334155" }}
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0"
                      style={{ borderTop: "1px solid rgba(168,85,247,0.1)" }}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed pt-4" style={{ color: "#94a3b8" }}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
