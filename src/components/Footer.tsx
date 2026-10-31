import React from "react";
import { MapPin, Phone, Mail, Clock, GraduationCap, ChevronRight, MessageSquare, Zap } from "lucide-react";
import { motion } from "motion/react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const links = [
    { id: "home", label: "Home Page" },
    { id: "catalog", label: "Course Catalog" },
    { id: "about", label: "About Institute" },
    { id: "contact", label: "Contact & Location" },
    { id: "admin", label: "Staff Inquiry Panel" },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "#020408",
        borderTop: "1px solid rgba(0, 212, 255, 0.08)",
      }}
    >
      {/* Animated top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{
            background: "linear-gradient(90deg, transparent, #00d4ff, transparent, #a855f7, transparent)",
            backgroundSize: "300% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Background glow blobs */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,102,255,0.04) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-14">

          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "rgba(0, 212, 255, 0.1)",
                  border: "1px solid rgba(0, 212, 255, 0.3)",
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)",
                }}
              >
                <GraduationCap className="h-5 w-5" style={{ color: "#00d4ff" }} />
              </div>
              <div>
                <span
                  className="font-display font-bold text-lg tracking-wider block"
                  style={{ color: "#00d4ff", textShadow: "0 0 15px rgba(0,212,255,0.6)" }}
                >
                  OTTC
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "#7c8ba1" }}>
                  Janakpur
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "#7c8ba1" }}>
              Established in 2050 B.S., Onida Technical Training Centre is Nepal's leading vocational institute,
              empowering youth through 30+ years of practical tech skills.
            </p>

            <div
              className="inline-block font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(0, 212, 255, 0.05)",
                border: "1px solid rgba(0, 212, 255, 0.15)",
                color: "#00d4ff",
              }}
            >
              Regd No. 2050-B.S. · Govt of Nepal
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-display font-bold text-xs uppercase tracking-widest mb-6"
              style={{ color: "#e2e8f0" }}
            >
              Navigation
            </h3>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className="flex items-center text-xs font-mono transition-all duration-200 group cursor-pointer"
                    style={{ color: "#7c8ba1" }}
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 mr-2 transition-all duration-200 group-hover:translate-x-1"
                      style={{ color: "#64748b" }}
                    />
                    <span className="group-hover:text-cyan-400 transition-colors duration-200">
                      {link.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3
              className="font-display font-bold text-xs uppercase tracking-widest mb-6"
              style={{ color: "#e2e8f0" }}
            >
              Hours
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#00d4ff" }} />
                <div>
                  <p className="font-semibold text-xs mb-0.5" style={{ color: "#94a3b8" }}>Sunday – Friday</p>
                  <p className="font-mono text-[10px]" style={{ color: "#7c8ba1" }}>06:00 AM – 06:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#64748b" }} />
                <div>
                  <p className="font-semibold text-xs mb-0.5" style={{ color: "#94a3b8" }}>Saturday</p>
                  <p className="font-mono text-[10px]" style={{ color: "#64748b" }}>Weekly Holiday (Closed)</p>
                </div>
              </li>
              <li>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(52, 211, 153, 0.08)",
                    border: "1px solid rgba(52, 211, 153, 0.2)",
                    color: "#34d399",
                  }}
                >
                  <Zap className="h-3 w-3 inline mr-1" />
                  New Batches Every Month
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="font-display font-bold text-xs uppercase tracking-widest mb-6"
              style={{ color: "#e2e8f0" }}
            >
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#00d4ff" }} />
                <span className="text-xs leading-relaxed" style={{ color: "#7c8ba1" }}>
                  Janakpurdham-8, Near Murali Chowk, (Toward Vishwakarma Chowk), Dhanusha, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" style={{ color: "#00d4ff" }} />
                <a href="tel:+9779804853916" className="font-mono text-xs hover:text-cyan-400 transition-colors" style={{ color: "#7c8ba1" }}>+977-9804853916</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 shrink-0" style={{ color: "#00d4ff" }} />
                <a href="https://wa.me/9779844135708" target="_blank" rel="noreferrer" className="font-mono text-xs hover:text-cyan-400 transition-colors" style={{ color: "#7c8ba1" }}>+977-9844135708 (WhatsApp)</a>
              </li>
              <li className="flex items-center gap-3 min-w-0">
                <Mail className="h-4 w-4 shrink-0" style={{ color: "#00d4ff" }} />
                <a href="mailto:mrshailenderakumarjha@gmail.com" className="font-mono text-[11px] truncate hover:text-cyan-400 transition-colors" style={{ color: "#7c8ba1" }}>
                  mrshailenderakumarjha@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#64748b" }}>
            © 2026 Onida Technical Training Centre (OTTC). All Rights Reserved.
          </p>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-wider" style={{ color: "#64748b" }}>
            <span>ISO 9001:2015 Certified</span>
            <span style={{ color: "#00d4ff" }}>Janakpurdham, Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
