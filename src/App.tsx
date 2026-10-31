import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import CatalogView from "./components/CatalogView";
import ContactView from "./components/ContactView";
import FAQSection from "./components/FAQSection";
import ChatbotWidget from "./components/ChatbotWidget";
import { COURSES } from "./coursesData";
import { openChat } from "./hooks";

// Staff-only page, so keep it out of the public bundle
const AdminPortal = lazy(() => import("./components/AdminPortal"));

// Generated once per page load so stars don't jump around on every re-render
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

// Animated particle star component
const StarField = React.memo(function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.id % 3 === 0 ? "#00d4ff" : star.id % 3 === 1 ? "#a855f7" : "#ffffff",
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Large glow orbs */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)",
          top: "-100px",
          left: "-100px",
          animation: "float-y 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)",
          bottom: "10%",
          right: "-50px",
          animation: "float-y 15s ease-in-out infinite",
          animationDelay: "-7s",
        }}
      />
    </div>
  );
});

// ── Hash routing: #/, #/courses, #/courses/<id>, #/about, #/contact
const TAB_PATHS: Record<string, string> = {
  home: "",
  catalog: "courses",
  about: "about",
  contact: "contact",
};

function parseHash(): { tab: string; courseId: string | null } {
  const [section = "", id] = window.location.hash.replace(/^#\/?/, "").split("/");
  const tab = Object.keys(TAB_PATHS).find((t) => TAB_PATHS[t] === section) || "home";
  const courseId = tab === "catalog" && id && COURSES.some((c) => c.id === id) ? id : null;
  return { tab, courseId };
}

function buildHash(tab: string, courseId: string | null = null) {
  const base = TAB_PATHS[tab] ?? "";
  return "#/" + base + (tab === "catalog" && courseId ? `/${courseId}` : "");
}

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const activeTab = route.tab;
  const selectedCourseId = route.courseId;

  const isAdminPath = window.location.pathname === "/admin" || window.location.pathname === "/admin/";

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((tab: string, courseId: string | null = null) => {
    if (tab === "admin") {
      window.location.href = "/admin";
      return;
    }
    const next = buildHash(tab, courseId);
    if (window.location.hash === next) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = next;
    }
  }, []);

  const setActiveTab = useCallback((tab: string) => navigate(tab), [navigate]);
  const handleSelectCourse = useCallback((courseId: string | null) => navigate("catalog", courseId), [navigate]);

  const renderActiveView = () => {
    switch (activeTab) {
      case "catalog":
        return (
          <motion.div key="catalog" {...pageTransition}>
            <CatalogView selectedCourseId={selectedCourseId} onSelectCourse={handleSelectCourse} />
          </motion.div>
        );
      case "about":
        return (
          <motion.div key="about" {...pageTransition}>
            <AboutView />
          </motion.div>
        );
      case "contact":
        return (
          <motion.div key="contact" {...pageTransition}>
            <ContactView />
            <div className="divider-neon my-8" />
            <FAQSection />
          </motion.div>
        );
      default:
        return (
          <motion.div key="home" {...pageTransition}>
            <HomeView setActiveTab={setActiveTab} onSelectCourse={handleSelectCourse} openChat={openChat} />
            <div className="divider-neon my-8" />
            <FAQSection />
          </motion.div>
        );
    }
  };

  if (isAdminPath) {
    return (
      <div className="min-h-screen cyber-grid antialiased flex flex-col">
        <Suspense fallback={<div className="flex-grow flex items-center justify-center font-mono text-xs" style={{ color: "#94a3b8" }}>Loading staff portal…</div>}>
          <AdminPortal />
        </Suspense>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col antialiased cyber-grid relative"
      style={{ color: "#e2e8f0" }}
    >
      <StarField />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-grow relative">
          <AnimatePresence mode="wait">{renderActiveView()}</AnimatePresence>
        </main>
        <Footer setActiveTab={setActiveTab} />
      </div>
      <ChatbotWidget />
    </div>
  );
}
