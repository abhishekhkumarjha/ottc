import React, { useState } from "react";
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, MessageSquare
} from "lucide-react";
import { COURSES, API_BASE } from "../coursesData";

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
    if (!formData.name || !formData.phone || !formData.courseId) {
      setError("Please fill in all mandatory fields (Name, Phone, and Interested Course).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_BASE + "/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        courseId: "electrician",
        contactTime: "Morning (07:00 AM - 11:00 AM)",
        message: ""
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div className="text-center space-y-3">
        <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-semibold">Get In Touch</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">Contact Admissions</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-sans text-sm">
          Have questions about fees, eligibility, or hostel accommodation? Reach out directly or drop an inquiry form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info grid - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="font-display font-bold text-xl text-slate-900">Institute Office Info</h2>
            
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg mt-0.5 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm leading-tight">Physical Address</h4>
                  <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                    Janakpurdham-8, near Murali Chowk, <br />
                    (On the road toward Vishwakarma Chowk), Dhanusha, Nepal
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm leading-tight">Primary Mobile</h4>
                  <p className="font-mono text-xs text-gray-500 mt-1 leading-tight">+977-9804853916</p>
                </div>
              </div>

              {/* Mobile / WhatsApp */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm leading-tight">Secondary & WhatsApp</h4>
                  <p className="font-mono text-xs text-gray-500 mt-1 leading-tight">+977-9844135708</p>
                  
                  {/* WhatsApp Direct */}
                  <a 
                    href="https://wa.me/9779844135708?text=Hello%20OTTC%20Janakpur!%20I%20am%20interested%20in%20admissions." 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans font-semibold text-[11px] px-3 py-1.5 rounded-md transition-colors"
                  >
                    <span>Send WhatsApp Message</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm leading-tight">Admissions Email</h4>
                  <p className="font-mono text-xs text-gray-500 mt-1 leading-tight">mrshailenderakumarjha@gmail.com</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm leading-tight">Office Business Hours</h4>
                  <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                    Sunday to Friday: 06:00 AM – 06:00 PM <br />
                    Saturday: Weekly Holiday (Closed)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Embedding styled Google Maps Container */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-72 relative">
            <iframe 
              title="OTTC Janakpur Murali Chowk Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14371.498326756286!2d85.92248552140049!3d26.719662361665427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec12fe3ba767ef%3A0xc6bf8f88ef0500bf!2sMurali%20Chowk%2C%20Janakpur!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
              allowFullScreen={false} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-mono px-2.5 py-1.5 rounded shadow border border-slate-800">
              Murali Chowk, Janakpurdham, Nepal
            </div>
          </div>
        </div>

        {/* Contact Form Container - 7 cols */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-slate-900">Online Inquiry Form</h2>
              <p className="font-sans text-xs text-gray-400">Fill your details below, and our admissions team will contact you to verify your batch allocation.</p>
            </div>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-4 py-12 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="font-display font-bold text-xl">Inquiry Submitted Successfully!</h3>
                <p className="font-sans text-xs sm:text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Thank you for choosing OTTC. Our Admissions Counselor will review your parameters and phone you at the requested preferred contact time.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-medium text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 px-4 py-3 rounded-lg flex items-center text-xs space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-sans mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Grid row for Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 font-sans mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +977-9804853916"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 font-sans mb-1.5">
                      Email Address <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. student@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Grid row for Course interest & Call time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Interested Course */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 font-sans mb-1.5">
                      Interested Course <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      {COURSES.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred contact time */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 font-sans mb-1.5">
                      Preferred Call Time
                    </label>
                    <select
                      value={formData.contactTime}
                      onChange={(e) => setFormData({ ...formData, contactTime: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="Morning (07:00 AM - 11:00 AM)">Morning (07:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                      <option value="Evening (04:00 PM - 06:00 PM)">Evening (04:00 PM - 06:00 PM)</option>
                      <option value="Anytime">Anytime during business hours</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-sans mb-1.5">
                    Your Message / Specific Inquiries
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter any additional queries about classes, batch dates, or hostels..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow shadow-emerald-600/10 hover:scale-[1.01] cursor-pointer"
                >
                  {loading ? (
                    <span className="animate-pulse">Submitting Registration...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Admissions Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
