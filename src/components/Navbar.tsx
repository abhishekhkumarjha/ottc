import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Menu, X, Zap } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "Courses" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-dark shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
      style={{
        borderBottom: scrolled ? "1px solid rgba(0, 212, 255, 0.1)" : "1px solid transparent",
      }}
    >
      {/* Animated top border line */}
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
          <motion.div
            className="h-full w-full"
            style={{
              background: "linear-gradient(90deg, transparent, #00d4ff, transparent, #7c3aed, transparent)",
              backgroundSize: "300% 100%",
            }}
            animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            onClick={() => { setActiveTab("home"); setIsOpen(false); }}
            className="flex items-center cursor-pointer space-x-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div
                className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white p-2 rounded-lg"
                style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" }}
              >
                <GraduationCap className="h-5 w-5" />
              </div>
              <div
                className="absolute inset-0 rounded-lg animate-pulse-neon"
                style={{ border: "1px solid rgba(0,212,255,0.4)" }}
              />
            </div>
            <div>
              <span
                className="font-display font-bold text-base tracking-wider block leading-none"
                style={{
                  color: "#00d4ff",
                  textShadow: "0 0 20px rgba(0,212,255,0.6)",
                }}
              >
                OTTC
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5 block" style={{ color: "#94a3b8" }}>
                Janakpur
              </span>
            </div>
          </motion.div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? "page" : undefined}
                className="relative px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer"
                style={{
                  color: activeTab === item.id ? "#00d4ff" : "#475569",
                }}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{
                      background: "rgba(0, 212, 255, 0.08)",
                      border: "1px solid rgba(0, 212, 255, 0.3)",
                      boxShadow: "0 0 15px rgba(0, 212, 255, 0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className="relative z-10 transition-all duration-300"
                  style={{
                    textShadow: activeTab === item.id ? "0 0 10px rgba(0,212,255,0.8)" : "none",
                  }}
                >
                  {item.label}
                </span>
                {activeTab !== item.id && (
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(0, 212, 255, 0.04)" }}
                  />
                )}
              </button>
            ))}

            <motion.button
              onClick={() => setActiveTab("catalog")}
              className="ml-3 btn-solid-cyan px-5 py-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-3.5 w-3.5" />
              Enroll Now
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden p-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              color: "#00d4ff",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              background: "rgba(0, 212, 255, 0.05)",
            }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(2, 4, 8, 0.95)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(0, 212, 255, 0.1)",
            }}
          >
            <div className="px-4 pt-3 pb-5 space-y-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
                  style={{
                    color: activeTab === item.id ? "#00d4ff" : "#475569",
                    background: activeTab === item.id ? "rgba(0, 212, 255, 0.08)" : "transparent",
                    border: activeTab === item.id ? "1px solid rgba(0, 212, 255, 0.2)" : "1px solid transparent",
                  }}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="pt-3" style={{ borderTop: "1px solid rgba(0, 212, 255, 0.1)" }}>
                <button
                  onClick={() => { setActiveTab("catalog"); setIsOpen(false); }}
                  className="w-full btn-solid-cyan py-3 rounded-lg font-mono text-xs tracking-widest cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Enroll Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
