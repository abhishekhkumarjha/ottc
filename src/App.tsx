import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import CatalogView from "./components/CatalogView";
import GalleryView from "./components/GalleryView";
import ContactView from "./components/ContactView";
import FAQSection from "./components/FAQSection";
import ChatbotWidget from "./components/ChatbotWidget";
import AdminPortal from "./components/AdminPortal";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Check if current URL path is admin
  const isAdminPath = window.location.pathname === "/admin" || window.location.pathname === "/admin/";

  // Helper to change courses and switch to catalog tab
  const handleSelectCourse = (courseId: string | null) => {
    setSelectedCourseId(courseId);
    setActiveTab("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to trigger chatbot open
  const handleOpenChat = () => {
    // Look for chatbot button and click it to toggle
    const chatbotBtn = document.querySelector(".fixed.bottom-6.right-6") as HTMLButtonElement;
    if (chatbotBtn) {
      chatbotBtn.click();
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <HomeView 
              setActiveTab={setActiveTab} 
              onSelectCourse={handleSelectCourse} 
              openChat={handleOpenChat}
            />
            <div className="border-t border-gray-100 pt-10">
              <FAQSection />
            </div>
          </motion.div>
        );
      case "catalog":
        return (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CatalogView 
              selectedCourseId={selectedCourseId} 
              onSelectCourse={setSelectedCourseId}
            />
          </motion.div>
        );
      case "about":
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AboutView />
          </motion.div>
        );
      case "gallery":
        return (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <GalleryView />
          </motion.div>
        );
      case "contact":
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <ContactView />
            <div className="border-t border-gray-100 pt-10">
              <FAQSection />
            </div>
          </motion.div>
        );
      default:
        return <div></div>;
    }
  };

  // If on admin path, render AdminPortal directly to achieve complete isolation
  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-slate-50 text-gray-800 antialiased selection:bg-rose-500/10 selection:text-rose-800 flex flex-col">
        <AdminPortal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40 text-gray-800 antialiased selection:bg-emerald-500/10 selection:text-emerald-800">
      
      {/* Dynamic Header */}
      <Navbar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />

      {/* Main Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderActiveView()}
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      <Footer setActiveTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />

      {/* Floating virtual assistant chatbot */}
      <ChatbotWidget />
    </div>
  );
}
