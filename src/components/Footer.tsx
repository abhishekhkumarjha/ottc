import React from "react";
import { MapPin, Phone, Mail, Clock, GraduationCap, ChevronRight, MessageSquare } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="space-y-5 text-left">
            <div className="flex items-center space-x-2 text-white">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 p-2 rounded-xl shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">OTTC Janakpur</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Established in 2050 B.S., Onida Technical Training Centre is Nepal's leading vocational institute, empowering youth through 30+ years of practical tech skills.
            </p>
            <div className="pt-2">
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-emerald-400 px-3.5 py-2 rounded-xl font-mono tracking-wider">
                Regd No. 2050-B.S. (Govt of Nepal)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-white font-display font-bold text-xs uppercase tracking-widest mb-5">Quick Navigation</h3>
            <ul className="space-y-3 text-xs font-semibold">
              {[
                { id: "home", label: "Home Page" },
                { id: "catalog", label: "Online Course Catalog" },
                { id: "about", label: "About Institute" },
                { id: "gallery", label: "Workshop Gallery" },
                { id: "contact", label: "Contact & Location" },
                { id: "admin", label: "Staff Inquiry Panel" }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className="flex items-center text-slate-400 hover:text-emerald-450 transition-colors duration-200 group text-left cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5 mr-1 text-slate-700 group-hover:text-emerald-400 transition-colors" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div className="text-left">
            <h3 className="text-white font-display font-bold text-xs uppercase tracking-widest mb-5">Admissions & Hours</h3>
            <ul className="space-y-4.5 text-xs">
              <li className="flex items-start">
                <Clock className="h-4.5 w-4.5 mr-3 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Sunday - Friday</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">06:00 AM - 06:00 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-4.5 w-4.5 mr-3 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-400">Saturday</p>
                  <p className="text-[11px] text-slate-600 font-mono mt-0.5">Weekly Holiday (Closed)</p>
                </div>
              </li>
              <li className="flex items-start pt-2">
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider">
                  New Batches Every Month
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="text-left">
            <h3 className="text-white font-display font-bold text-xs uppercase tracking-widest mb-5">Office Location</h3>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start">
                <MapPin className="h-4.5 w-4.5 mr-3 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-350 leading-relaxed font-semibold">
                  Janakpurdham-8, Near Murali Chowk, (Toward Vishwakarma Chowk), Dhanusha, Nepal
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4.5 w-4.5 mr-3 text-emerald-500 shrink-0" />
                <span className="text-slate-350 font-mono font-semibold">+977-9804853916</span>
              </li>
              <li className="flex items-center">
                <MessageSquare className="h-4.5 w-4.5 mr-3 text-emerald-500 shrink-0" />
                <span className="text-slate-350 font-mono font-semibold">+977-9844135708 (WhatsApp)</span>
              </li>
              <li className="flex items-center font-mono">
                <Mail className="h-4.5 w-4.5 mr-3 text-emerald-500 shrink-0" />
                <span className="text-slate-350 text-[11px] truncate">mrshailenderakumarjha@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
          <p>© 2026 Onida Technical Training Centre (OTTC). All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0 font-mono uppercase tracking-wider font-semibold">
            <span>ISO 9001:2015 Certified</span>
            <span className="text-emerald-500 font-bold">Janakpurdham, Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
