import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, AlertCircle, GraduationCap } from "lucide-react";
import { ChatMessage } from "../types";
import { COURSES, API_BASE } from "../coursesData";
import { OPEN_CHAT_EVENT, isValidPhone, friendlyError, postJSON } from "../hooks";

let msgCounter = 0;
const nextId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${++msgCounter}`;
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const GREETING_ID = "init_1";

// Escape HTML first, then apply a tiny safe subset of Markdown (bold, bullets, line breaks)
function renderMarkdown(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-*] /gm, "• ")
    .replace(/\n/g, "<br />");
}

// Offline answers built from the real course data so they never go stale
function getLocalBackupReply(msg: string): string {
  const text = msg.toLowerCase();
  if (/fee|price|cost|how much/.test(text)) {
    const list = COURSES.map(c => `- **${c.name}**: Rs. ${c.fee.toLocaleString()} (${c.duration})`).join("\n");
    return `Here are our current tuition fees:\n${list}\n\nA small admission fee (Rs. 1,000 – 2,500) applies separately. Tap **Inquiry Form** above to enroll!`;
  }
  if (/where|location|address|map/.test(text)) {
    return "Onida Technical Training Centre (OTTC) is in **Janakpurdham-8, near Murali Chowk**, on the road leading to Vishwakarma Chowk. We are open Sunday–Friday, 6 AM to 6 PM. Come visit our labs!";
  }
  if (/phone|contact|call|whatsapp|number/.test(text)) {
    return "You can reach us at:\n- **Phone**: +977-9804853916\n- **WhatsApp**: +977-9844135708\n- **Email**: mrshailenderakumarjha@gmail.com";
  }
  if (/apply|admission|enroll|join|register/.test(text)) {
    return "Enrolling is simple:\n1. Choose a course\n2. Tap **Inquiry Form** above and leave your name & phone\n3. Our counselor will call you\n4. Visit the centre with your Citizenship/ID copy and 2 passport photos";
  }
  if (/gulf|abroad|dubai|saudi|qatar|job/.test(text)) {
    return "For Gulf jobs we recommend **AC & Refrigeration**, **Electrician**, and **Electrical Supervisor** — all in very high demand in Qatar, Saudi Arabia and the UAE.";
  }
  return "I couldn't reach our AI service just now. Please tap **Inquiry Form** above to leave your details, or call us at +977-9804853916 — our counselor will help you directly.";
}

const emptyLead = () => ({
  name: "",
  phone: "",
  email: "",
  courseId: COURSES[0]?.id || "electrician",
  contactTime: "Anytime",
  message: "Submitted via chatbot"
});

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: GREETING_ID,
      sender: "bot",
      text: "Namaste! Welcome to Onida Technical Training Centre (OTTC), Janakpur. 🙏\n\nI am your Virtual Admissions Assistant. Ask me anything about our technical courses, fees, duration, class timings, or location. I can also help you choose the right course for jobs abroad (e.g. Gulf) or register an enrollment inquiry!",
      timestamp: now()
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInChatForm, setShowInChatForm] = useState(false);

  const [leadForm, setLeadForm] = useState(emptyLead);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Allow other parts of the site to open the chat
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, open);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, open);
  }, []);

  useEffect(() => {
    if (isOpen && !showInChatForm) inputRef.current?.focus();
  }, [isOpen, showInChatForm]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showInChatForm]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: nextId("u"), sender: "user", text, timestamp: now() };
    // Send recent context, minus the canned greeting (the model already knows its role)
    const contextHistory = messages
      .filter(m => m.id !== GREETING_ID)
      .slice(-8)
      .map(m => ({ sender: m.sender, text: m.text }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let reply: string;
    try {
      const data = await postJSON<{ text?: string }>(API_BASE + "/api/chat", { message: text, history: contextHistory });
      reply = data.text || getLocalBackupReply(text);
    } catch {
      reply = getLocalBackupReply(text);
    }
    setMessages(prev => [...prev, { id: nextId("b"), sender: "bot", text: reply, timestamp: now() }]);
    setLoading(false);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      setLeadError("Name and phone are required.");
      return;
    }
    if (!isValidPhone(leadForm.phone)) {
      setLeadError("Please enter a valid phone number.");
      return;
    }

    setLeadSubmitting(true);
    setLeadError(null);
    try {
      await postJSON(API_BASE + "/api/inquiries", leadForm);
      const courseName = COURSES.find(c => c.id === leadForm.courseId)?.name || leadForm.courseId;
      setMessages(prev => [
        ...prev,
        {
          id: nextId("sys"),
          sender: "bot",
          text: `✅ **Inquiry registered!**\n\nThank you, ${leadForm.name.trim()}! Your inquiry for the **${courseName}** course has been sent to our admissions team. We'll call you at ${leadForm.phone.trim()} (${leadForm.contactTime.toLowerCase()}).`,
          timestamp: now()
        }
      ]);
      setLeadForm(emptyLead());
      setShowInChatForm(false);
    } catch (err) {
      setLeadError(friendlyError(err));
    } finally {
      setLeadSubmitting(false);
    }
  };

  const starters = [
    { label: "💰 Course Fees", query: "Can you list the fees for all courses?" },
    { label: "✈️ Gulf Careers", query: "Which courses are best for technical jobs in the Gulf?" },
    { label: "📝 How to apply?", query: "Explain the complete step-by-step admission process" },
    { label: "📍 Location", query: "What is your physical address and opening hours?" }
  ];

  const leadInput = "w-full input-dark rounded-xl px-3.5 py-2.5 text-xs";

  return (
    <>
      {/* 1. Floating Toggle Icon Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 text-white p-4 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #00d4ff, #0066ff)",
          boxShadow: "0 8px 30px rgba(0,102,255,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset",
        }}
        aria-label={isOpen ? "Close admissions chat" : "Chat with OTTC admissions counselor"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-[#020408]" />
          </span>
        )}
      </motion.button>

      {/* 2. Chat Dialogue Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="OTTC admissions chat"
            initial={{ opacity: 0, y: 30, scale: 0.92, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-3 sm:right-6 z-50 rounded-3xl w-[calc(100vw-1.5rem)] sm:w-[400px] h-[560px] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden text-left"
            style={{
              background: "rgba(7,15,28,0.97)",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,102,255,0.15)",
              backdropFilter: "blur(20px)",
              transformOrigin: "bottom right",
              transformPerspective: 1000,
            }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(135deg, rgba(0,102,255,0.15), rgba(124,58,237,0.1))" }}>
              <div className="flex items-center gap-3">
                <div className="relative p-2.5 rounded-xl" style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
                  <GraduationCap className="h-5 w-5" />
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#34d399", border: "2px solid #070f1c" }} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm" style={{ color: "#f1f5f9" }}>OTTC Admissions AI</h3>
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase block mt-0.5" style={{ color: "#34d399" }}>Virtual Counselor • Online</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowInChatForm(!showInChatForm); setLeadError(null); }}
                  aria-pressed={showInChatForm}
                  className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-colors"
                  style={showInChatForm
                    ? { background: "#00d4ff", color: "#020408", border: "1px solid #00d4ff" }
                    : { background: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Inquiry Form
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="p-1.5 rounded-xl transition-colors cursor-pointer hover:bg-white/10"
                  style={{ color: "#94a3b8" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages / In-Chat Form Body */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 relative" aria-live="polite">
              {showInChatForm ? (
                <motion.form
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleLeadSubmit}
                  noValidate
                  className="p-5 rounded-2xl space-y-3.5 glass-card"
                >
                  <div className="pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <h4 className="font-display font-bold text-sm" style={{ color: "#f1f5f9" }}>Direct Admission Inquiry</h4>
                    <p className="text-[11px] mt-0.5" style={{ color: "#94a3b8" }}>Leave your details and our admissions team will call you.</p>
                  </div>

                  {leadError && (
                    <div role="alert" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#fda4af" }}>
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {leadError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="cb-name" className="field-label">Name *</label>
                    <input id="cb-name" type="text" required maxLength={80} autoComplete="name" placeholder="Your full name"
                      value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className={leadInput} />
                  </div>

                  <div>
                    <label htmlFor="cb-phone" className="field-label">Phone Number *</label>
                    <input id="cb-phone" type="tel" required maxLength={20} autoComplete="tel" placeholder="+977-98XXXXXXXX"
                      value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className={leadInput + " font-mono"} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="cb-course" className="field-label">Course</label>
                      <select id="cb-course" value={leadForm.courseId} onChange={(e) => setLeadForm({ ...leadForm, courseId: e.target.value })}
                        className="w-full input-dark rounded-xl px-2.5 py-2.5 text-[11px]">
                        {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cb-time" className="field-label">Call Time</label>
                      <select id="cb-time" value={leadForm.contactTime} onChange={(e) => setLeadForm({ ...leadForm, contactTime: e.target.value })}
                        className="w-full input-dark rounded-xl px-2.5 py-2.5 text-[11px]">
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button type="submit" disabled={leadSubmitting}
                      className="w-full btn-solid-cyan py-3 rounded-xl text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      {leadSubmitting ? "Submitting..." : "Submit Inquiry"}
                    </button>
                    <button type="button" onClick={() => setShowInChatForm(false)}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#cbd5e1" }}>
                      Back to Chat
                    </button>
                  </div>
                </motion.form>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className={`flex flex-col max-w-[85%] ${m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed break-words ${m.sender === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                        style={m.sender === "user"
                          ? { background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", boxShadow: "0 4px 15px rgba(37,99,235,0.3)" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
                      />
                      <span className="text-[9px] font-mono mt-1 px-1" style={{ color: "#64748b" }}>
                        {m.timestamp}
                      </span>
                    </motion.div>
                  ))}

                  {loading && (
                    <div className="flex gap-1.5 items-center px-4 py-3 rounded-2xl rounded-bl-sm w-fit" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} aria-label="Assistant is typing">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#00d4ff" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.15s]" style={{ background: "#00d4ff" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.3s]" style={{ background: "#00d4ff" }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick starter question chips */}
            {!showInChatForm && (
              <div className="px-3 py-2 flex gap-1.5 overflow-x-auto shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {starters.map((st) => (
                  <button
                    key={st.label}
                    onClick={() => handleSendMessage(st.query)}
                    disabled={loading}
                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-40 hover:border-cyan-400/50 hover:text-cyan-200"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}

            {/* Send Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
              className="p-3 flex items-center gap-2 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <input
                ref={inputRef}
                type="text"
                aria-label="Type your question"
                disabled={showInChatForm}
                maxLength={500}
                placeholder={showInChatForm ? "Please complete the form above..." : "Ask about courses, fees, timings..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 input-dark rounded-xl px-4 py-2.5 text-xs disabled:opacity-50"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={showInChatForm || !input.trim() || loading}
                className="btn-solid-cyan p-2.5 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
