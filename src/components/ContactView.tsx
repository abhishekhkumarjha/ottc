import React, { useState } from "react";
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, MessageSquare
} from "lucide-react";
import { COURSES, API_BASE } from "../coursesData";
import { motion, AnimatePresence } from "motion/react";
import { isValidPhone, friendlyError, postJSON } from "../hooks";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    courseId: "electrician",
    contactTime: "Morning (07:00 AM - 11:00 AM)",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.courseId) {
      setError("Please fill in all mandatory fields (Name, Phone, and Interested Course).");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError("Please enter a valid phone number (e.g. +977-98XXXXXXXX).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await postJSON(API_BASE + "/api/inquiries", formData);
      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", courseId: "electrician", contactTime: "Morning (07:00 AM - 11:00 AM)", message: "" });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: MapPin, label: "Physical Address", color: "#00d4ff",
      content: "Janakpurdham-8, near Murali Chowk,\n(On the road toward Vishwakarma Chowk), Dhanusha, Nepal",
    },
    {
      icon: Phone, label: "Primary Mobile", color: "#34d399",
      content: "+977-9804853916",
      action: { href: "tel:+9779804853916", label: "Call Now" },
    },
    {
      icon: MessageSquare, label: "Secondary & WhatsApp", color: "#a855f7",
      content: "+977-9844135708",
      action: {
        href: "https://wa.me/9779844135708?text=Hello%20OTTC%20Janakpur!%20I%20am%20interested%20in%20admissions.",
        label: "Send WhatsApp Message",
      },
    },
    {
      icon: Mail, label: "Admissions Email", color: "#f59e0b",
      content: "mrshailenderakumarjha@gmail.com",
      action: { href: "mailto:mrshailenderakumarjha@gmail.com?subject=Admission%20Inquiry", label: "Send Email" },
    },
    {
      icon: Clock, label: "Office Hours", color: "#22d3ee",
      content: "Sunday – Friday: 06:00 AM – 06:00 PM\nSaturday: Weekly Holiday (Closed)",
    },
  ];

  const inputClass = "w-full input-dark px-4 py-3 rounded-xl text-sm";
  const labelClass = "block font-mono text-xs uppercase tracking-wider mb-2";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <span className="section-eyebrow" style={{ color: "#00d4ff" }}>Get In Touch</span>
        <h1
          className="font-display font-bold text-3xl sm:text-4xl"
          style={{ color: "#e2e8f0" }}
        >
          Contact{" "}
          <span style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.6)" }}>
            Admissions
          </span>
        </h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
          Have questions about fees, eligibility, or batch dates? Reach out directly or fill the inquiry form below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-7 space-y-6"
          >
            <h2 className="font-display font-bold text-lg" style={{ color: "#e2e8f0" }}>
              Institute Office Info
            </h2>

            <div className="space-y-5">
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-xs mb-1" style={{ color: "#e2e8f0" }}>
                      {item.label}
                    </h4>
                    <p className="font-mono text-xs leading-relaxed whitespace-pre-line break-words" style={{ color: "#94a3b8" }}>
                      {item.content}
                    </p>
                    {item.action && (
                      <a
                        href={item.action.href}
                        {...(item.action.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all hover:brightness-125"
                        style={{
                          background: `${item.color}1a`,
                          border: `1px solid ${item.color}4d`,
                          color: item.color,
                        }}
                      >
                        <item.icon className="h-3 w-3" />
                        {item.action.label}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden relative h-64"
            style={{ border: "1px solid rgba(0,212,255,0.15)" }}
          >
            <iframe
              title="OTTC Janakpur Murali Chowk Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14371.498326756286!2d85.92248552140049!3d26.719662361665427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec12fe3ba767ef%3A0xc6bf8f88ef0500bf!2sMurali%20Chowk%2C%20Janakpur!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              className="w-full h-full border-0"
              style={{ filter: "invert(90%) hue-rotate(180deg) brightness(0.85)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div
              className="absolute top-3 left-3 font-mono text-[10px] px-2.5 py-1.5 rounded-lg"
              style={{
                background: "rgba(2,4,8,0.85)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "#00d4ff",
                backdropFilter: "blur(8px)",
              }}
            >
              📍 Murali Chowk, Janakpurdham, Nepal
            </div>
          </motion.div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-7 space-y-6"
          >
            <div>
              <h2 className="font-display font-bold text-lg" style={{ color: "#e2e8f0" }}>
                Online Inquiry Form
              </h2>
              <p className="text-xs mt-1" style={{ color: "#7c8ba1" }}>
                Fill your details and our admissions team will contact you to confirm batch allocation.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12 space-y-5"
                >
                  <CheckCircle2
                    className="h-16 w-16 mx-auto"
                    style={{ color: "#34d399", filter: "drop-shadow(0 0 20px rgba(52,211,153,0.6))" }}
                  />
                  <h3 className="font-display font-bold text-xl" style={{ color: "#34d399" }}>
                    Inquiry Submitted!
                  </h3>
                  <p className="text-sm max-w-md mx-auto" style={{ color: "#94a3b8" }}>
                    Thank you for choosing OTTC. Our Admissions Counselor will review your details and contact you at your preferred time.
                  </p>
                  <motion.button
                    onClick={() => setSuccess(false)}
                    className="btn-neon-cyan px-6 py-2.5 rounded-xl text-xs cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Another Inquiry
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                      style={{
                        background: "rgba(244,63,94,0.1)",
                        border: "1px solid rgba(244,63,94,0.3)",
                        color: "#f43f5e",
                      }}
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {/* Name */}
                  <div>
                    <label className={labelClass} style={{ color: "#94a3b8" }}>
                      Full Name <span style={{ color: "#f43f5e" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} style={{ color: "#94a3b8" }}>
                        Phone <span style={{ color: "#f43f5e" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+977-9804853916"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputClass + " font-mono"}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={{ color: "#94a3b8" }}>
                        Email <span style={{ color: "#7c8ba1" }}>(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="student@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputClass + " font-mono"}
                      />
                    </div>
                  </div>

                  {/* Course & Call Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} style={{ color: "#94a3b8" }}>
                        Interested Course <span style={{ color: "#f43f5e" }}>*</span>
                      </label>
                      <select
                        value={formData.courseId}
                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                        className={inputClass}
                        style={{
                          background: "rgba(5, 11, 18, 0.8)",
                          border: "1px solid rgba(0, 212, 255, 0.15)",
                          color: "#e2e8f0",
                        }}
                      >
                        {COURSES.map((course) => (
                          <option key={course.id} value={course.id} style={{ background: "#0a1628" }}>
                            {course.name} ({course.duration})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} style={{ color: "#94a3b8" }}>
                        Preferred Call Time
                      </label>
                      <select
                        value={formData.contactTime}
                        onChange={(e) => setFormData({ ...formData, contactTime: e.target.value })}
                        className={inputClass}
                        style={{
                          background: "rgba(5, 11, 18, 0.8)",
                          border: "1px solid rgba(0, 212, 255, 0.15)",
                          color: "#e2e8f0",
                        }}
                      >
                        <option value="Morning (07:00 AM - 11:00 AM)" style={{ background: "#0a1628" }}>Morning (07:00 AM - 11:00 AM)</option>
                        <option value="Afternoon (12:00 PM - 04:00 PM)" style={{ background: "#0a1628" }}>Afternoon (12:00 PM - 04:00 PM)</option>
                        <option value="Evening (04:00 PM - 06:00 PM)" style={{ background: "#0a1628" }}>Evening (04:00 PM - 06:00 PM)</option>
                        <option value="Anytime" style={{ background: "#0a1628" }}>Anytime during business hours</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClass} style={{ color: "#94a3b8" }}>
                      Message / Specific Inquiries
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter any questions about classes, batch dates, hostel accommodation..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={inputClass + " resize-none"}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-solid-cyan py-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Admissions Inquiry
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
