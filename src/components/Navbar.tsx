import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "Courses" },
    { id: "about", label: "About Us" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-100/80 shadow-sm shadow-slate-100/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Logo */}
          <div 
            onClick={() => { setActiveTab("home"); setIsOpen(false); }}
            className="flex items-center cursor-pointer space-x-3 group"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-md shadow-emerald-500/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                OTTC Janakpur
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-0.5 block">
                Technical Training Centre
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "text-emerald-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-emerald-50 border border-emerald-500/10 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setActiveTab("catalog")}
              className="ml-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-sans font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/15 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-950 focus:outline-none p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-2.5 pb-5 space-y-1 shadow-lg"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-3 border-t border-slate-100 mt-3">
              <button
                onClick={() => {
                  setActiveTab("catalog");
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                Explore Courses & Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
