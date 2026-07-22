import React, { useState, useEffect } from "react";
import { Inquiry, Review } from "../types";
import { COURSES } from "../coursesData";
import { 
  Users, CheckCircle, Clock, Trash2, Mail, Phone, Calendar, 
  Search, ShieldCheck, Lock, AlertCircle, TrendingUp, Info,
  Star, MessageSquare
} from "lucide-react";

export default function AdminPortal() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<"leads" | "reviews">("leads");
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Secure admin authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Session expired handler
  const handleSessionExpired = () => {
    localStorage.removeItem("ottc_admin_token");
    setIsAuthorized(false);
    setAdminUser("");
    setAuthError("Your session has expired. Please sign in again.");
  };

  // Fetch inquiries from server (Protected)
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ottc_admin_token");
      if (!token) {
        handleSessionExpired();
        return;
      }

      const res = await fetch("/api/inquiries", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) throw new Error("Could not retrieve inquiries.");
      const data = await res.json();
      setInquiries(data);
    } catch (err: any) {
      setError(err.message || "Failed to sync with admissions database.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews from server (Public GET, but supports loading indicator)
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Could not retrieve student reviews.");
      const data = await res.json();
      setReviews(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Delete review helper (Protected)
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this student review feedback?")) return;
    try {
      const token = localStorage.getItem("ottc_admin_token");
      if (!token) {
        handleSessionExpired();
        return;
      }

      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) throw new Error("Failed to delete review.");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Check active session on mount
  useEffect(() => {
    const checkActiveSession = async () => {
      const token = localStorage.getItem("ottc_admin_token");
      if (!token) {
        setLoading(false);
        setLoadingReviews(false);
        return;
      }
      try {
        const res = await fetch("/api/admin/check-session", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.username);
          setIsAuthorized(true);
        } else {
          localStorage.removeItem("ottc_admin_token");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };
    checkActiveSession();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchInquiries();
      fetchReviews();
    }
  }, [isAuthorized]);

  // Handle true backend authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      localStorage.setItem("ottc_admin_token", data.token);
      setAdminUser(data.username);
      setIsAuthorized(true);
    } catch (err: any) {
      setAuthError(err.message || "Failed to connect to authentication server.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle secure logout
  const handleLogout = async () => {
    const token = localStorage.getItem("ottc_admin_token");
    if (token) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Logout request to server failed:", err);
      }
    }
    localStorage.removeItem("ottc_admin_token");
    setIsAuthorized(false);
    setAdminUser("");
    setUsername("");
    setPassword("");
  };

  // Update Status in Server (Protected)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("ottc_admin_token");
      if (!token) {
        handleSessionExpired();
        return;
      }

      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) throw new Error("Could not update inquiry.");
      
      // Update local state instantly
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus as any } : inq));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Delete Inquiry from Server (Protected)
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this admissions lead?")) return;

    try {
      const token = localStorage.getItem("ottc_admin_token");
      if (!token) {
        handleSessionExpired();
        return;
      }

      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) throw new Error("Failed to delete inquiry.");

      // Remove from local state instantly
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Filter & Search logic
  const filteredInquiries = inquiries.filter(inq => {
    const course = COURSES.find(c => c.id === inq.courseId);
    const courseName = course ? course.name : inq.courseId;

    const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inq.phone.includes(searchTerm) ||
                          courseName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level metrics
  const totalLeads = inquiries.length;
  const pendingLeads = inquiries.filter(i => i.status === "Pending").length;
  const contactedLeads = inquiries.filter(i => i.status === "Contacted").length;
  const completedLeads = inquiries.filter(i => i.status === "Completed").length;

  // Determine most requested course
  const courseCounts = inquiries.reduce((acc: any, cur) => {
    acc[cur.courseId] = (acc[cur.courseId] || 0) + 1;
    return acc;
  }, {});
  let popularCourseId = "";
  let maxCount = 0;
  Object.keys(courseCounts).forEach(key => {
    if (courseCounts[key] > maxCount) {
      maxCount = courseCounts[key];
      popularCourseId = key;
    }
  });
  const popularCourseName = COURSES.find(c => c.id === popularCourseId)?.name || "N/A";

  // Lock screen if not authorized (Render premium fullscreen login form)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Ambient decorative blur gradients */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
          <div className="space-y-2">
            <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl w-fit mx-auto border border-rose-500/20 shadow-lg shadow-rose-500/5 animate-pulse">
              <Lock className="h-7 w-7" />
            </div>
            
            <h2 className="font-display font-extrabold text-2xl text-slate-100 tracking-tight pt-3">Staff Portal Login</h2>
            <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Authorized personnel only. Please sign in to access the admissions leads and student reviews database.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase pl-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-rose-500/50 focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase pl-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-rose-500/50 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-semibold py-3.5 rounded-xl text-xs transition-all duration-200 shadow-lg shadow-rose-600/20 cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              {loggingIn ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60 flex items-start space-x-3 text-left text-[11px] text-slate-400 leading-relaxed font-sans">
            <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Use Username <strong className="text-slate-100 font-mono">admin</strong> and Password <strong className="text-rose-400 font-mono">ottc123</strong> to unlock the admissions leads dashboard.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-in fade-in duration-300 w-full">
      
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1 text-left">
          <span className="text-xs text-rose-600 font-mono uppercase tracking-wider font-semibold">OTTC Back-Office (Signed in as: {adminUser})</span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">Staff Admissions Dashboard</h1>
          <p className="text-xs text-gray-400 font-sans">Real-time database pipeline of inbound student registration leads and community reviews.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 font-sans font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Lock Dashboard / Logout
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-gray-100 flex space-x-6">
        <button
          onClick={() => { setActiveTab("leads"); setSearchTerm(""); }}
          className={`pb-3 text-sm font-semibold tracking-tight font-display border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === "leads" 
              ? "border-emerald-600 text-emerald-600 font-bold" 
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Admissions Leads ({inquiries.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("reviews"); setSearchTerm(""); }}
          className={`pb-3 text-sm font-semibold tracking-tight font-display border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === "reviews" 
              ? "border-emerald-600 text-emerald-600 font-bold" 
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Student Reviews ({reviews.length})</span>
        </button>
      </div>

      {activeTab === "leads" ? (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-left">
              <span className="block text-[10px] uppercase font-mono text-gray-400">Total Inquiries</span>
              <span className="block text-3xl font-extrabold text-slate-900 font-display mt-2">{totalLeads}</span>
              <span className="text-[10px] text-gray-400 font-sans">Active Leads</span>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-left">
              <span className="block text-[10px] uppercase font-mono text-gray-400">Pending Follow-up</span>
              <span className="block text-3xl font-extrabold text-amber-600 font-display mt-2">{pendingLeads}</span>
              <span className="text-[10px] text-amber-500 font-mono">Need Phone Calls</span>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-left">
              <span className="block text-[10px] uppercase font-mono text-gray-400">In Contact</span>
              <span className="block text-3xl font-extrabold text-indigo-600 font-display mt-2">{contactedLeads}</span>
              <span className="text-[10px] text-indigo-500 font-mono">In Negotiation</span>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-left">
              <span className="block text-[10px] uppercase font-mono text-gray-400">Enrolled/Completed</span>
              <span className="block text-3xl font-extrabold text-emerald-600 font-display mt-2">{completedLeads}</span>
              <span className="text-[10px] text-emerald-500 font-mono">Fees Settled</span>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm col-span-2 lg:col-span-1 text-left">
              <span className="block text-[10px] uppercase font-mono text-gray-400">Top Selected Course</span>
              <span className="block text-base font-extrabold text-slate-800 font-display mt-2.5 truncate">{popularCourseName}</span>
              <span className="text-[10px] text-emerald-600 font-mono flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-0.5 shrink-0" />
                {maxCount} Requests
              </span>
            </div>
          </div>

          {/* Directory filtering controls */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-3">
            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, phone, or interested course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Status filters */}
            <div className="flex gap-1.5 shrink-0">
              {["All", "Pending", "Contacted", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-xl font-sans text-xs font-semibold cursor-pointer transition-colors ${statusFilter === status ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Table / List */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="text-center py-20 space-y-2">
                <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-gray-400 font-mono">Syncing Admissions database...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-20 space-y-2">
                <Users className="h-10 w-10 text-gray-300 mx-auto" />
                <h3 className="font-display font-semibold text-gray-700">No Admissions Leads Found</h3>
                <p className="text-gray-400 font-sans text-xs">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-5">Student / Date</th>
                      <th className="py-4 px-5">Inquiry Details</th>
                      <th className="py-4 px-5">Call Preference</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {filteredInquiries.map((inq) => {
                      const course = COURSES.find(c => c.id === inq.courseId);
                      const courseName = course ? course.name : inq.courseId;
                      
                      return (
                        <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                          {/* Student Info */}
                          <td className="py-4.5 px-5 space-y-1 text-left">
                            <span className="font-display font-bold text-slate-900 text-sm block">{inq.name}</span>
                            <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 font-mono">
                              <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <span>{inq.phone}</span>
                            </div>
                            {inq.email && (
                              <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 font-mono">
                                <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span>{inq.email}</span>
                              </div>
                            )}
                            <span className="text-[10px] text-gray-400 font-mono block pt-1">
                              Received: {new Date(inq.createdAt).toLocaleDateString()} {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Course / Message */}
                          <td className="py-4.5 px-5 space-y-1.5 max-w-xs sm:max-w-md text-left">
                            <span className="inline-flex items-center bg-emerald-50 text-emerald-800 font-sans font-semibold text-[10px] px-2.5 py-1 rounded">
                              {courseName}
                            </span>
                            <p className="font-sans text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                              {inq.message}
                            </p>
                          </td>

                          {/* Contact pref */}
                          <td className="py-4.5 px-5 text-left">
                            <div className="flex items-center space-x-1.5 text-gray-600 font-sans">
                              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                              <span className="font-medium text-[11px]">{inq.contactTime}</span>
                            </div>
                          </td>

                          {/* Status select dropdown */}
                          <td className="py-4.5 px-5 text-left">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border-0 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-500/10 ${
                                inq.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 font-semibold"
                                  : inq.status === "Contacted"
                                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                                  : "bg-emerald-50 text-emerald-700 font-semibold"
                              }`}
                            >
                              <option value="Pending">Pending Call</option>
                              <option value="Contacted">In Contact</option>
                              <option value="Completed">Completed / Enrolled</option>
                            </select>
                          </td>

                          {/* Trash Delete */}
                          <td className="py-4.5 px-5 text-right">
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 p-2 rounded-lg cursor-pointer transition-colors"
                              title="Delete inquiry record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Reviews Search controls */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews by student name, trade course, or feedback keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none transition-colors font-sans"
              />
            </div>
          </div>

          {/* Reviews Table / List */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {loadingReviews ? (
              <div className="text-center py-20 space-y-2">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-gray-400 font-mono">Syncing Reviews database...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 space-y-2">
                <MessageSquare className="h-10 w-10 text-gray-300 mx-auto" />
                <h3 className="font-display font-semibold text-gray-700">No Student Reviews Found</h3>
                <p className="text-gray-400 font-sans text-xs">When students submit feedback, it will appear here instantly for administrative review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-5">Student / Batch</th>
                      <th className="py-4 px-5">Trade Course</th>
                      <th className="py-4 px-5">Rating</th>
                      <th className="py-4 px-5">Review Content</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {reviews
                      .filter(r => {
                        const course = COURSES.find(c => c.id === r.courseId);
                        const courseName = course ? course.name : r.courseId;
                        return r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               r.text.toLowerCase().includes(searchTerm.toLowerCase());
                      })
                      .map((rev) => {
                        const course = COURSES.find(c => c.id === rev.courseId);
                        const courseName = course ? course.name : rev.courseId;
                        return (
                          <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                            {/* Student Info */}
                            <td className="py-4.5 px-5 space-y-1 text-left">
                              <span className="font-display font-bold text-slate-900 text-sm block">{rev.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono block">
                                Batch: {rev.batch || "Recent"}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono block pt-0.5">
                                Submitted: {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </td>

                            {/* Course */}
                            <td className="py-4.5 px-5 text-left">
                              <span className="inline-flex items-center bg-emerald-50 text-emerald-800 font-sans font-semibold text-[10px] px-2.5 py-1 rounded">
                                {courseName}
                              </span>
                            </td>

                            {/* Stars */}
                            <td className="py-4.5 px-5 text-left">
                              <div className="flex space-x-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current text-amber-400" : "text-gray-200"}`} />
                                ))}
                              </div>
                            </td>

                            {/* Message text */}
                            <td className="py-4.5 px-5 max-w-xs sm:max-w-md text-left">
                              <p className="font-sans text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                                "{rev.text}"
                              </p>
                            </td>

                            {/* Actions */}
                            <td className="py-4.5 px-5 text-right">
                              <button
                                onClick={() => handleDeleteReview(rev.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 p-2 rounded-lg cursor-pointer transition-colors"
                                title="Delete student review"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
