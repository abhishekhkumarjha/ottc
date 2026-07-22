import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COURSES, API_BASE } from "../coursesData";
import { Course } from "../types";
import { 
  Search, SlidersHorizontal, Clock, BookOpen, User, 
  Award, Flame, Calendar, DollarSign, ArrowRight, CheckCircle2, AlertCircle, X, Check, GraduationCap
} from "lucide-react";

interface CatalogViewProps {
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string | null) => void;
}

export default function CatalogView({ selectedCourseId, onSelectCourse }: CatalogViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeDuration, setActiveDuration] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Apply Form State
  const [applyForm, setApplyForm] = useState({
    name: "",
    phone: "",
    email: "",
    courseId: "",
    contactTime: "Morning (07:00 AM - 11:00 AM)",
    message: ""
  });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Sync modal state course selection when course selected
  useEffect(() => {
    if (selectedCourseId) {
      setApplyForm(prev => ({ ...prev, courseId: selectedCourseId }));
    } else {
      setApplyForm(prev => ({ ...prev, courseId: COURSES[0]?.id || "" }));
    }
  }, [selectedCourseId]);

  // Extract metadata lists
  const categories = ["All", ...Array.from(new Set(COURSES.map(c => c.category)))];
  const levels = ["All", "Beginner", "Advanced"];
  const durations = ["All", "1 Month", "2 Months", "3 Months", "4 Months"];

  // Filter logic
  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.syllabus.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesLevel = activeLevel === "All" || course.level === activeLevel;
    const matchesDuration = activeDuration === "All" || course.duration === activeDuration;

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || null;

  // Get related courses (exclude current course)
  const relatedCourses = selectedCourse 
    ? COURSES.filter(c => c.category === selectedCourse.category && c.id !== selectedCourse.id).slice(0, 2)
    : [];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.phone || !applyForm.courseId) {
      setApplyError("Please fill in Name, Phone, and select a Course.");
      return;
    }

    setApplyLoading(true);
    setApplyError(null);

    try {
      const res = await fetch(API_BASE + "/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applyForm)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application.");
      }

      setApplySuccess(true);
      setApplyForm({
        name: "",
        phone: "",
        email: "",
        courseId: selectedCourseId || COURSES[0]?.id || "",
        contactTime: "Morning (07:00 AM - 11:00 AM)",
        message: ""
      });
    } catch (err: any) {
      setApplyError(err.message || "Something went wrong.");
    } finally {
      setApplyLoading(false);
    }
  };

  // Stagger variants for rendering card list
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 16 } 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 animate-in fade-in duration-300 w-full text-left">
      
      {/* 1. If a Course is Selected, Show Dynamic Detail View */}
      {selectedCourse ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-300">
          {/* Back button */}
          <button
            onClick={() => onSelectCourse(null)}
            className="flex items-center text-xs font-bold uppercase text-emerald-600 hover:text-emerald-700 tracking-wider transition-colors group cursor-pointer"
          >
            <span className="mr-2">&larr;</span> Back to Course Catalog
          </button>

          {/* Banner Hero */}
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-100/50">
            <div className="absolute inset-0 bg-slate-950/70 z-10"></div>
            <img 
              src={selectedCourse.image} 
              alt={selectedCourse.name} 
              className="w-full h-88 object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 z-25 p-6 md:p-10 text-white space-y-4">
              <span className="text-[9px] font-mono uppercase bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg font-extrabold tracking-wider">
                {selectedCourse.category}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                {selectedCourse.name}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {selectedCourse.shortDescription}
              </p>
            </div>
          </div>

          {/* Core Info Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: "Duration", value: selectedCourse.duration, icon: Clock },
              { label: "Tuition Fee", value: `Rs. ${selectedCourse.fee.toLocaleString()}`, icon: DollarSign },
              { label: "Eligibility", value: selectedCourse.eligibility, icon: BookOpen },
              { label: "Practicals", value: `${selectedCourse.practicalPercentage}% Hands-On`, icon: Award, highlight: true },
              { label: "Admission Fee", value: `Rs. ${selectedCourse.admissionFee.toLocaleString()}`, icon: Calendar }
            ].map((badge, idx) => {
              const BadgeIcon = badge.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl mb-3">
                    <BadgeIcon className="h-5 w-5" />
                  </div>
                  <span className="block text-[9px] uppercase font-mono text-slate-400 font-semibold tracking-wider">{badge.label}</span>
                  <span className={`font-sans font-extrabold text-xs sm:text-sm mt-1.5 block ${badge.highlight ? "text-emerald-600" : "text-slate-800"}`}>
                    {badge.value}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Syllabus and Details - 7 cols */}
            <div className="lg:col-span-7 space-y-8">
              {/* Detailed Description */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-100/35">
                <h3 className="font-display font-extrabold text-lg text-slate-900 border-b border-slate-50 pb-2">Course Overview</h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedCourse.detailedDescription}
                </p>
                <div className="pt-3">
                  <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">Class Timings:</h4>
                  <p className="font-sans text-xs text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl mt-1.5 w-fit font-semibold">
                    {selectedCourse.classTiming}
                  </p>
                </div>
              </div>

              {/* Course Curriculum Syllabus */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-100/35">
                <div className="flex items-center space-x-2.5 border-b border-slate-50 pb-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-display font-extrabold text-lg text-slate-900">Course Curriculum / Syllabus</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2.5">
                  {selectedCourse.syllabus.map((topic, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="bg-emerald-50 text-emerald-600 rounded-full p-1.5 mt-0.5 shrink-0 shadow-sm border border-emerald-100">
                        <Check className="h-3 w-3 text-emerald-600 font-bold" />
                      </div>
                      <span className="font-sans text-xs sm:text-sm text-slate-700 leading-snug">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column Career Paths and apply trigger - 5 cols */}
            <div className="lg:col-span-5 space-y-8">
              {/* Apply Card */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <GraduationCap className="h-9 w-9 text-emerald-400" />
                <h3 className="font-display font-extrabold text-xl leading-tight">Ready to enroll in {selectedCourse.name}?</h3>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  Click below to fill our fast-track admission inquiry. Our counselors will call you to finalize your batch slot and guide you through required files.
                </p>
                <button
                  id="catalog-apply-btn"
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer text-center block"
                >
                  Apply Online
                </button>
                <div className="text-[9px] text-slate-400 font-mono text-center uppercase tracking-wider">
                  Certification: {selectedCourse.certificate}
                </div>
              </div>

              {/* Career opportunities */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-100/35">
                <div className="flex items-center space-x-2 border-b border-slate-50 pb-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <h3 className="font-display font-extrabold text-base text-slate-900">Career Opportunities</h3>
                </div>
                <p className="font-sans text-xs text-slate-550 leading-relaxed">
                  Possible professional jobs and career paths upon completing {selectedCourse.name} training:
                </p>
                <div className="space-y-3 pt-2">
                  {selectedCourse.careerOpportunities.map((job, i) => (
                    <div key={i} className="flex items-center space-x-3 text-xs text-slate-700 font-sans font-semibold">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></div>
                      <span>{job}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Courses Section */}
          {relatedCourses.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <h3 className="font-display font-extrabold text-xl text-slate-900">Related Training Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedCourses.map((rc) => (
                  <motion.div 
                    key={rc.id}
                    onClick={() => onSelectCourse(rc.id)}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-lg cursor-pointer transition-all group"
                  >
                    <img 
                      src={rc.image} 
                      alt={rc.name} 
                      className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-display font-extrabold text-slate-900 text-sm leading-snug group-hover:text-emerald-600 transition-colors">
                        {rc.name}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 font-medium">
                        {rc.duration} &bull; {rc.level}
                      </p>
                      <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider mt-1.5">
                        Learn More <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 2. CATALOG DIRECTORY VIEW */
        <div className="space-y-10 text-left">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-bold">OTTC Trade Catalog</span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">Technical Course Catalog</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
              Discover professional practical programs. Search, filter by duration, fee, and level, and register online.
            </p>
          </div>

          {/* Search and filter controls bar */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/35 p-4.5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses (e.g., electrician, AC, plumbing, wire...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              {/* Toggle filter trigger */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-3 rounded-2xl border font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-colors cursor-pointer ${showFilters ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter drawer panels */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4.5 border-t border-slate-100 overflow-hidden"
                >
                  {/* Category filters */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">Category</span>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${activeCategory === cat ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level filters */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">Course Level</span>
                    <div className="flex flex-wrap gap-1.5">
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setActiveLevel(lvl)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${activeLevel === lvl ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration filters */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">Duration</span>
                    <div className="flex flex-wrap gap-1.5">
                      {durations.map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setActiveDuration(dur)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${activeDuration === dur ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Catalog grid */}
          <motion.div 
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div 
                key={course.id}
                variants={cardVariants}
                whileHover={{ y: -8, rotateX: 3, rotateY: -3, z: 10 }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white rounded-[28px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-emerald-100 transition-all flex flex-col group preserve-3d cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60"></div>
                  {course.popular && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-mono font-extrabold text-[8px] uppercase px-2.5 py-1.5 rounded-lg shadow tracking-wider">
                      Popular
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 rounded-lg">
                    {course.duration}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                      {course.name}
                    </h3>
                    <span className="font-mono text-emerald-600 font-extrabold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                      Rs. {course.fee.toLocaleString()}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-slate-500 leading-relaxed flex-grow">
                    {course.shortDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400 py-2 border-y border-slate-55">
                    <div>
                      <span className="block text-slate-500 font-semibold uppercase tracking-wider">Practicals:</span>
                      <span className="text-emerald-600 font-bold">{course.practicalPercentage}% Hands-On</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-semibold uppercase tracking-wider">Eligibility:</span>
                      <span className="truncate block font-semibold text-slate-650">{course.eligibility}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex space-x-2">
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 font-bold text-xs py-3 rounded-xl text-center transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        onSelectCourse(course.id);
                        setTimeout(() => setShowApplyModal(true), 150);
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-3 rounded-xl text-center transition-colors shadow-md shadow-emerald-600/10 cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty state searching */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16 space-y-4 bg-slate-50/50 rounded-[28px] border border-slate-100 max-w-lg mx-auto">
              <SlidersHorizontal className="h-10 w-10 text-slate-350 mx-auto" />
              <h3 className="font-display font-extrabold text-slate-700">No Courses Match Filters</h3>
              <p className="text-slate-400 font-sans text-xs px-4">Try clearing search terms or resetting the duration parameters.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                  setActiveLevel("All");
                  setActiveDuration("All");
                }}
                className="mt-2 text-emerald-600 hover:text-emerald-700 font-sans font-bold text-xs border-b border-emerald-600 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Admission Application Registration Modal */}
      <AnimatePresence>
        {showApplyModal && selectedCourse && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full border border-slate-100 shadow-2xl p-6 sm:p-8 space-y-6 text-left"
            >
              <button
                onClick={() => { setShowApplyModal(false); setApplySuccess(false); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-xl text-slate-900">Apply for Admission</h3>
                <p className="font-sans text-xs text-slate-400">Course: <strong className="text-emerald-600 font-semibold">{selectedCourse.name}</strong></p>
              </div>

              {applySuccess ? (
                <div className="text-center space-y-4 py-6">
                  <div className="bg-emerald-50 text-emerald-500 p-3.5 rounded-full w-fit mx-auto border border-emerald-100 shadow-inner animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-slate-900">Application Submitted!</h4>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Thank you, {applyForm.name || "student"}! Your admissions inquiry has been recorded. Our counselor will call you within 24 hours at your preferred time.
                  </p>
                  <button
                    onClick={() => { setShowApplyModal(false); setApplySuccess(false); }}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-sans font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {applyError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl flex items-center text-xs space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{applyError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1">
                      Mobile Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +977-98540XXXXX"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1">
                      Email Address <span className="text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. email@gmail.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    />
                  </div>

                  {/* Call hours selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1">
                      Preferred Contact Hours
                    </label>
                    <select
                      value={applyForm.contactTime}
                      onChange={(e) => setApplyForm({ ...applyForm, contactTime: e.target.value })}
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-sans"
                    >
                      <option value="Morning (07:00 AM - 11:00 AM)">Morning (07:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                      <option value="Evening (04:00 PM - 06:00 PM)">Evening (04:00 PM - 06:00 PM)</option>
                      <option value="Anytime">Anytime during office hours</option>
                    </select>
                  </div>

                  {/* Extra message */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1">
                      Additional details / requests
                    </label>
                    <textarea
                      rows={2}
                      placeholder="E.g. want hostel support or weekend batch options..."
                      value={applyForm.message}
                      onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                  >
                    {applyLoading ? "Submitting Inquiry..." : "Confirm Application"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
