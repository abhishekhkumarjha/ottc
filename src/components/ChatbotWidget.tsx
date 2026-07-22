import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw, User, Calendar, Check, GraduationCap } from "lucide-react";
import { ChatMessage } from "../types";
import { COURSES, API_BASE } from "../coursesData";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init_1",
      sender: "bot",
      text: "Namaste! Welcome to Onida Technical Training Centre (OTTC), Janakpur. 🌸\n\nI am your Virtual Admissions Assistant. Ask me anything about our technical courses, fees, duration, class timings, or location. I can also help you choose the right course for jobs abroad (e.g. Gulf) or register an enrollment inquiry!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInChatForm, setShowInChatForm] = useState(false);

  // In-chat Form State
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    courseId: "electrician",
    contactTime: "Morning (07:00 AM - 11:00 AM)",
    message: ""
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showInChatForm, leadSuccess]);

  // Handle standard message submission
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now().toString(36),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Exclude initial greeting and select relevant history for context
      const contextHistory = messages.slice(-8).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: contextHistory
        })
      });

      if (!response.ok) {
        throw new Error("Chat server error");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: "b_" + Date.now().toString(36),
        sender: "bot",
        text: data.text || "I am processing. Please ask another question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Friendly local fallback answer
      const localReply = getLocalBackupReply(textToSend);
      const botMsg: ChatMessage = {
        id: "b_" + Date.now().toString(36),
        sender: "bot",
        text: localReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Local helper in case backend has connectivity issues
  const getLocalBackupReply = (msg: string): string => {
    const text = msg.toLowerCase();
    if (text.includes("fee") || text.includes("price") || text.includes("cost") || text.includes("how much")) {
      return "Tuition fees for our trade courses range from Rs. 8,000 (Driving) to Rs. 20,000 (AC & Refrigeration). Admission fees are extra. Would you like to fill the Admissions Inquiry Form right here in the chat to enroll?";
    }
    if (text.includes("where") || text.includes("location") || text.includes("address")) {
      return "Onida Technical Training Centre (OTTC) is in Janakpurdham-8, near Murali Chowk, on the road leading to Vishwakarma Chowk. We are open Sunday-Friday, 6 AM to 6 PM. Come visit our labs!";
    }
    if (text.includes("apply") || text.includes("admission") || text.includes("enroll")) {
      return "You can apply right now! Please click the 'Submit Inquiry Form' option or leave your Name and Phone Number, and our Admissions Counselor will contact you directly.";
    }
    return "I am OTTC's Virtual admissions bot. That sounds interesting! Please provide your name and phone number here, or click 'Submit Inquiry Form' to register. Our counselor will contact you shortly.";
  };

  // Submit the lead from inside the chatbot widget
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      alert("Name and Phone are required.");
      return;
    }

    setLeadSubmitting(true);
    try {
      const res = await fetch(API_BASE + "/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm)
      });

      if (!res.ok) throw new Error("Submission failed");

      setLeadSuccess(true);
      setShowInChatForm(false);
      
      // Append success indicator message in chat
      setMessages(prev => [
        ...prev,
        {
          id: "sys_1",
          sender: "bot",
          text: `✅ Admissions Lead Logged!\n\nThank you, ${leadForm.name}! Your inquiry for the ${COURSES.find(c => c.id === leadForm.courseId)?.name || leadForm.courseId} course is registered in our Staff Dashboard. Our representative will call you at ${leadForm.contactTime}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      alert("Could not register inquiry. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  // Starter suggestion questions
  const starters = [
    { label: "💰 View Course Fees", query: "Can you list the fees for all courses?" },
    { label: "✈️ Gulf Job Careers", query: "Which courses are best for technical jobs in the Gulf?" },
    { label: "📝 How do I apply?", query: "Explain the complete step-by-step admission process" },
    { label: "📍 Where are you located?", query: "What is your physical address and opening hours?" }
  ];

  return (
    <>
      {/* 1. Floating Toggle Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all group border border-emerald-500/20 active:scale-95"
        title="Chat with OTTC AI Admissions Counselor"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-rose-500 w-3 h-3 rounded-full animate-ping"></span>
        )}
      </button>

      {/* 2. Chat Dialogue Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 bg-white rounded-3xl border border-slate-100 shadow-2xl w-[92vw] sm:w-[410px] h-[550px] max-h-[80vh] flex flex-col overflow-hidden text-left"
          >
            
            {/* Header */}
            <div className="bg-slate-950 text-white p-4.5 flex justify-between items-center shrink-0 border-b border-slate-900">
              <div className="flex items-center space-x-3">
                <div className="relative bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                  <GraduationCap className="h-5 w-5" />
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-950 animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xs sm:text-sm text-slate-100">OTTC Admissions AI</h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase block mt-0.5">Virtual Counselor • Online</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShowInChatForm(!showInChatForm);
                    setLeadSuccess(false);
                  }}
                  className={`text-[9px] font-sans font-extrabold uppercase tracking-wider px-3 py-2 rounded-lg border cursor-pointer transition-colors ${showInChatForm ? "bg-emerald-500 text-slate-950 border-emerald-400" : "bg-slate-900 text-slate-300 hover:text-white border-slate-800"}`}
                >
                  Inquiry Form
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages / In-Chat Form Body */}
            <div 
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/20 relative"
            >
              {showInChatForm ? (
                /* Inline Lead Registration Form */
                <form onSubmit={handleLeadSubmit} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3.5 animate-in zoom-in-95 duration-200">
                  <div className="border-b border-slate-50 pb-2">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">Direct Admission Inquiry</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Provide details below to log this interest in our admin panel.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Sanjay Kumar Shah"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="E.g. +977-9804853916"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Course</label>
                      <select
                        value={leadForm.courseId}
                        onChange={(e) => setLeadForm({ ...leadForm, courseId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-[11px] focus:bg-white focus:outline-none transition-all font-sans"
                      >
                        {COURSES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Time Preference</label>
                      <select
                        value={leadForm.contactTime}
                        onChange={(e) => setLeadForm({ ...leadForm, contactTime: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-[11px] focus:bg-white focus:outline-none transition-all font-sans"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                    >
                      {leadSubmitting ? "Submitting..." : "Submit Inquiry"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowInChatForm(false)}
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel Form
                    </button>
                  </div>
                </form>
              ) : (
                /* Regular Message List with spring reveals */
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
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          m.sender === "user"
                            ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md shadow-emerald-600/10"
                            : "bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-sm"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: m.text
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br />")
                        }}
                      />
                      <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </motion.div>
                  ))}

                  {/* AI Thinking indicator */}
                  {loading && (
                    <div className="flex space-x-1.5 items-center bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none w-fit shadow-sm animate-pulse">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick starter question chips */}
            {!showInChatForm && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
                {starters.map((st, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSendMessage(st.query)}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-slate-200 text-slate-650 hover:text-emerald-700 hover:border-emerald-250 px-2.5 py-1.5 rounded-xl text-[10px] font-bold tracking-tight transition-colors cursor-pointer text-left shrink-0 shadow-sm"
                  >
                    {st.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Send Input Bar */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2 shrink-0">
              <input
                type="text"
                disabled={showInChatForm}
                placeholder={showInChatForm ? "Please complete the form..." : "Ask OTTC Admissions counselor..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(input);
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={showInChatForm || !input.trim()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-2.5 rounded-xl cursor-pointer shadow-md shadow-emerald-650/15 transition-colors disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
