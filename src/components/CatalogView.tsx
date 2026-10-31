import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COURSES, API_BASE } from "../coursesData";
import {
  Search, SlidersHorizontal, Clock, BookOpen,
  Award, Flame, Calendar, Wallet, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, X, Check, GraduationCap
} from "lucide-react";
import TiltCard from "./TiltCard";
import { useModal, isValidPhone, friendlyError, postJSON } from "../hooks";

interface CatalogViewProps {
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string | null) => void;
}

const emptyForm = (courseId: string) => ({
  name: "",
  phone: "",
  email: "",
  courseId,
  contactTime: "Morning (07:00 AM - 11:00 AM)",
  message: ""
});

const categories = ["All", ...Array.from(new Set(COURSES.map(c => c.category)))];
const levels = ["All", "Beginner", "Advanced"];
const durations = ["All", ...Array.from(new Set(COURSES.map(c => c.duration))).sort((a, b) => parseInt(a) - parseInt(b))];

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <span className="field-label">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
            style={value === opt
              ? { background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.5)", color: "#67e8f9" }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CatalogView({ selectedCourseId, onSelectCourse }: CatalogViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeDuration, setActiveDuration] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Apply Form State
  const [applyForm, setApplyForm] = useState(() => emptyForm(selectedCourseId || COURSES[0]?.id || ""));
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [applyError, setApplyError] = useState<string | null>(null);

  // Keep the form's course in sync with the course being viewed
  useEffect(() => {
    setApplyForm(prev => ({ ...prev, courseId: selectedCourseId || COURSES[0]?.id || "" }));
  }, [selectedCourseId]);

  const closeModal = useCallback(() => {
    setShowApplyModal(false);
    setApplySuccess(false);
    setApplyError(null);
  }, []);
  useModal(showApplyModal, closeModal);

  // Filter logic
  const query = searchTerm.trim().toLowerCase();
  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = !query ||
      course.name.toLowerCase().includes(query) ||
      course.shortDescription.toLowerCase().includes(query) ||
      course.syllabus.some(s => s.toLowerCase().includes(query));
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesLevel = activeLevel === "All" || course.level === activeLevel;
    const matchesDuration = activeDuration === "All" || course.duration === activeDuration;
    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });
  const filtersActive = activeCategory !== "All" || activeLevel !== "All" || activeDuration !== "All" || !!query;
  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setActiveLevel("All");
    setActiveDuration("All");
  };

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || null;

  // Related courses: same category first, then others, excluding current
  const relatedCourses = selectedCourse
    ? [
        ...COURSES.filter(c => c.category === selectedCourse.category && c.id !== selectedCourse.id),
        ...COURSES.filter(c => c.category !== selectedCourse.category && c.popular),
      ].slice(0, 2)
    : [];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name.trim() || !applyForm.phone.trim() || !applyForm.courseId) {
      setApplyError("Please fill in Name, Phone, and select a Course.");
      return;
    }
    if (!isValidPhone(applyForm.phone)) {
      setApplyError("Please enter a valid phone number (e.g. +977-98XXXXXXXX).");
      return;
    }

    setApplyLoading(true);
    setApplyError(null);
    try {
      await postJSON(API_BASE + "/api/inquiries", applyForm);
      setSubmittedName(applyForm.name.trim());
      setApplySuccess(true);
      setApplyForm(emptyForm(selectedCourseId || COURSES[0]?.id || ""));
    } catch (err) {
      setApplyError(friendlyError(err));
    } finally {
      setApplyLoading(false);
    }
  };

  const openApply = (courseId: string) => {
    if (courseId !== selectedCourseId) onSelectCourse(courseId);
    setApplySuccess(false);
    setApplyError(null);
    setShowApplyModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 w-full text-left">

      <AnimatePresence mode="wait">
      {/* 1. If a Course is Selected, Show Dynamic Detail View */}
      {selectedCourse ? (
        <motion.div
          key={`detail-${selectedCourse.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-10"
        >
          {/* Back button */}
          <button
            onClick={() => onSelectCourse(null)}
            className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors group cursor-pointer hover:text-cyan-300"
            style={{ color: "#00d4ff" }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Course Catalog
          </button>

          {/* Banner Hero */}
          <motion.div
            initial={{ opacity: 0, rotateX: 12, scale: 0.97 }}
            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200, border: "1px solid rgba(0,212,255,0.15)" }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <motion.img
              src={selectedCourse.image}
              alt={selectedCourse.name}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="w-full h-72 sm:h-88 object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(2,4,8,0.95) 10%, rgba(2,4,8,0.55) 55%, rgba(2,4,8,0.2) 100%)" }} />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 space-y-4">
              <span
                className="inline-block text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg font-bold tracking-wider"
                style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.4)", color: "#67e8f9" }}
              >
                {selectedCourse.category} · {selectedCourse.level}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ color: "#f8fafc" }}>
                {selectedCourse.name}
              </h1>
              <p className="font-sans text-xs sm:text-sm max-w-2xl leading-relaxed" style={{ color: "#cbd5e1" }}>
                {selectedCourse.shortDescription}
              </p>
            </div>
          </motion.div>

          {/* Core Info Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Duration", value: selectedCourse.duration, icon: Clock, color: "#22d3ee" },
              { label: "Tuition Fee", value: `Rs. ${selectedCourse.fee.toLocaleString()}`, icon: Wallet, color: "#818cf8" },
              { label: "Eligibility", value: selectedCourse.eligibility, icon: BookOpen, color: "#f59e0b" },
              { label: "Practicals", value: `${selectedCourse.practicalPercentage}% Hands-On`, icon: Award, color: "#34d399" },
              { label: "Admission Fee", value: `Rs. ${selectedCourse.admissionFee.toLocaleString()}`, icon: Calendar, color: "#f472b6" }
            ].map((badge, idx) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20, rotateY: -25 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 0.15 + idx * 0.06, duration: 0.5 }}
                style={{ transformPerspective: 800 }}
                className={idx === 4 ? "col-span-2 md:col-span-1" : ""}
              >
                <TiltCard max={12} className="glass-card p-5 rounded-2xl text-center flex flex-col items-center justify-center">
                  <div className="p-2 rounded-xl mb-3" style={{ background: `${badge.color}15`, border: `1px solid ${badge.color}30` }}>
                    <badge.icon className="h-5 w-5" style={{ color: badge.color }} />
                  </div>
                  <span className="block text-[10px] uppercase font-mono font-semibold tracking-wider" style={{ color: "#7c8ba1" }}>{badge.label}</span>
                  <span className="font-sans font-bold text-xs sm:text-sm mt-1.5 block" style={{ color: "#f1f5f9" }}>
                    {badge.value}
                  </span>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Syllabus and Details - 7 cols */}
            <div className="lg:col-span-7 space-y-8">
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="font-display font-bold text-lg pb-2" style={{ color: "#f1f5f9", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Course Overview</h3>
                <p className="font-sans text-xs sm:text-sm leading-relaxed" style={{ color: "#a8b5c8" }}>
                  {selectedCourse.detailedDescription}
                </p>
                <div className="pt-3">
                  <h4 className="field-label">Class Timings</h4>
                  <p className="font-sans text-xs px-4 py-2.5 rounded-xl w-fit font-semibold" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#6ee7b7" }}>
                    {selectedCourse.classTiming}
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <BookOpen className="h-5 w-5" style={{ color: "#00d4ff" }} />
                  <h3 className="font-display font-bold text-lg" style={{ color: "#f1f5f9" }}>Course Curriculum / Syllabus</h3>
                </div>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2.5">
                  {selectedCourse.syllabus.map((topic, i) => (
                    <motion.li
                      key={topic}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3"
                    >
                      <span className="rounded-full w-6 h-6 shrink-0 flex items-center justify-center font-mono text-[10px] font-bold" style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "#67e8f9" }}>
                        {i + 1}
                      </span>
                      <span className="font-sans text-xs sm:text-sm leading-snug pt-0.5" style={{ color: "#cbd5e1" }}>{topic}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right column Career Paths and apply trigger - 5 cols */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <div
                className="rounded-3xl p-6 md:p-8 space-y-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0,102,255,0.18) 0%, rgba(124,58,237,0.14) 100%)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  boxShadow: "0 0 40px rgba(0,102,255,0.12)",
                }}
              >
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,212,255,0.15)" }} />
                <GraduationCap className="h-9 w-9 relative" style={{ color: "#00d4ff" }} />
                <h3 className="font-display font-bold text-xl leading-tight relative" style={{ color: "#f8fafc" }}>Ready to enroll in {selectedCourse.name}?</h3>
                <p className="font-sans text-xs leading-relaxed relative" style={{ color: "#a8b5c8" }}>
                  Fill our fast-track admission inquiry. Our counselors will call you to finalize your batch slot and guide you through the required documents.
                </p>
                <motion.button
                  id="catalog-apply-btn"
                  onClick={() => openApply(selectedCourse.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full btn-solid-cyan py-4 rounded-xl text-xs cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  Apply Online <ArrowRight className="h-4 w-4" />
                </motion.button>
                <div className="relative text-[10px] font-mono text-center uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                  Certification: {selectedCourse.certificate}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <Flame className="h-5 w-5" style={{ color: "#fb923c" }} />
                  <h3 className="font-display font-bold text-base" style={{ color: "#f1f5f9" }}>Career Opportunities</h3>
                </div>
                <p className="font-sans text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                  Possible professional jobs and career paths upon completing {selectedCourse.name} training:
                </p>
                <ul className="space-y-3 pt-2">
                  {selectedCourse.careerOpportunities.map((job) => (
                    <li key={job} className="flex items-center gap-3 text-xs font-sans font-medium" style={{ color: "#cbd5e1" }}>
                      <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#34d399" }} />
                      <span>{job}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Courses Section */}
          {relatedCourses.length > 0 && (
            <div className="space-y-6 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="font-display font-bold text-xl" style={{ color: "#f1f5f9" }}>You May Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedCourses.map((rc) => (
                  <TiltCard
                    key={rc.id}
                    max={6}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectCourse(rc.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") onSelectCourse(rc.id); }}
                    className="glass-card rounded-2xl p-5 flex items-start gap-4 cursor-pointer group focus-ring"
                  >
                    <img
                      src={rc.image}
                      alt={rc.name}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-display font-bold text-sm leading-snug transition-colors group-hover:text-cyan-300" style={{ color: "#f1f5f9" }}>
                        {rc.name}
                      </h4>
                      <p className="font-sans text-xs" style={{ color: "#94a3b8" }}>
                        {rc.duration} &bull; {rc.level} &bull; Rs. {rc.fee.toLocaleString()}
                      </p>
                      <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider mt-1.5" style={{ color: "#00d4ff" }}>
                        Learn More <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        /* 2. CATALOG DIRECTORY VIEW */
        <motion.div
          key="directory"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-10 text-left"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="section-eyebrow" style={{ color: "#00d4ff" }}>OTTC Trade Catalog</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight" style={{ color: "#f1f5f9" }}>
              Technical <span className="text-gradient-cyan">Course Catalog</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              Discover professional practical programs. Search, filter by category, duration and level, and register online.
            </p>
          </div>

          {/* Search and filter controls bar */}
          <div className="glass-card rounded-3xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#64748b" }} />
                <input
                  type="search"
                  aria-label="Search courses"
                  placeholder="Search courses (e.g., electrician, AC, plumbing, wiring...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full input-dark rounded-2xl pl-11 pr-10 py-3 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md cursor-pointer hover:text-white"
                    style={{ color: "#64748b" }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className="px-5 py-3 rounded-2xl font-mono text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                style={showFilters
                  ? { background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.4)", color: "#67e8f9" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {filtersActive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00d4ff" }} />}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <FilterGroup label="Category" options={categories} value={activeCategory} onChange={setActiveCategory} />
                    <FilterGroup label="Course Level" options={levels} value={activeLevel} onChange={setActiveLevel} />
                    <FilterGroup label="Duration" options={durations} value={activeDuration} onChange={setActiveDuration} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between font-mono text-xs" style={{ color: "#7c8ba1" }}>
            <span aria-live="polite">Showing {filteredCourses.length} of {COURSES.length} courses</span>
            {filtersActive && (
              <button onClick={resetFilters} className="cursor-pointer hover:text-cyan-300 transition-colors" style={{ color: "#00d4ff" }}>
                Reset filters
              </button>
            )}
          </div>

          {/* Catalog grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 30, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, delay: Math.min(i, 6) * 0.05 }}
                  style={{ transformPerspective: 1000 }}
                >
                  <TiltCard max={7} className="glass-card rounded-3xl overflow-hidden flex flex-col group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        style={{ filter: "brightness(0.85) saturate(0.95)" }}
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,1) 0%, transparent 55%)" }} />
                      {course.popular && (
                        <div className="absolute top-3 right-3 font-mono font-bold text-[9px] uppercase px-2.5 py-1.5 rounded-lg tracking-wider flex items-center gap-1" style={{ background: "rgba(245,158,11,0.9)", color: "#1c1003" }}>
                          <Flame className="h-3 w-3" /> Popular
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase px-2.5 py-1 rounded-lg" style={{ background: "rgba(2,4,8,0.75)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", backdropFilter: "blur(6px)" }}>
                        {course.duration}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-display font-bold text-base sm:text-lg leading-tight" style={{ color: "#f1f5f9" }}>
                          {course.name}
                        </h3>
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg shrink-0" style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#67e8f9" }}>
                          Rs. {course.fee.toLocaleString()}
                        </span>
                      </div>

                      <p className="font-sans text-xs leading-relaxed flex-grow" style={{ color: "#94a3b8" }}>
                        {course.shortDescription}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div>
                          <span className="block font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>Practicals</span>
                          <span className="font-bold" style={{ color: "#34d399" }}>{course.practicalPercentage}% Hands-On</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>Eligibility</span>
                          <span className="truncate block font-semibold" style={{ color: "#cbd5e1" }} title={course.eligibility}>{course.eligibility}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => onSelectCourse(course.id)}
                          className="flex-1 font-semibold text-xs py-3 rounded-xl text-center transition-colors cursor-pointer hover:bg-white/10"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => openApply(course.id)}
                          className="flex-1 btn-solid-cyan text-xs py-3 rounded-xl text-center cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state searching */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16 space-y-4 rounded-3xl max-w-lg mx-auto glass-card">
              <SlidersHorizontal className="h-10 w-10 mx-auto" style={{ color: "#475569" }} />
              <h3 className="font-display font-bold" style={{ color: "#e2e8f0" }}>No Courses Match Filters</h3>
              <p className="font-sans text-xs px-4" style={{ color: "#94a3b8" }}>Try clearing search terms or resetting the filters.</p>
              <button
                onClick={resetFilters}
                className="mt-2 font-sans font-bold text-xs cursor-pointer border-b"
                style={{ color: "#00d4ff", borderColor: "#00d4ff" }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Dynamic Admission Application Registration Modal */}
      <AnimatePresence>
        {showApplyModal && selectedCourse && (
          <motion.div
            key="apply-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(2,4,8,0.8)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="apply-modal-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, rotateX: 12, y: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-left my-auto"
              style={{
                background: "rgba(10,22,40,0.98)",
                border: "1px solid rgba(0,212,255,0.25)",
                boxShadow: "0 0 50px rgba(0,102,255,0.2)",
                transformPerspective: 1000,
              }}
            >
              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-4 right-4 p-1.5 rounded-xl transition-colors cursor-pointer hover:text-white"
                style={{ color: "#94a3b8", background: "rgba(255,255,255,0.05)" }}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 id="apply-modal-title" className="font-display font-bold text-xl" style={{ color: "#f1f5f9" }}>Apply for Admission</h3>
                <p className="font-sans text-xs" style={{ color: "#94a3b8" }}>Course: <strong className="font-semibold" style={{ color: "#67e8f9" }}>{selectedCourse.name}</strong></p>
              </div>

              {applySuccess ? (
                <div className="text-center space-y-4 py-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <CheckCircle2 className="h-16 w-16 mx-auto" style={{ color: "#34d399", filter: "drop-shadow(0 0 15px rgba(52,211,153,0.6))" }} />
                  </motion.div>
                  <h4 className="font-display font-bold text-lg" style={{ color: "#34d399" }}>Application Submitted!</h4>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "#a8b5c8" }}>
                    Thank you, {submittedName || "student"}! Your admission inquiry has been recorded. Our counselor will call you within 24 hours at your preferred time.
                  </p>
                  <button onClick={closeModal} className="w-full btn-neon-cyan py-3 rounded-xl text-xs cursor-pointer">
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4" noValidate>
                  {applyError && (
                    <div role="alert" className="p-3 rounded-xl flex items-center text-xs gap-2" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#fda4af" }}>
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{applyError}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="ap-name" className="field-label">Your Full Name <span style={{ color: "#f43f5e" }}>*</span></label>
                    <input
                      id="ap-name"
                      type="text"
                      required
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Enter your name"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      className="w-full input-dark rounded-xl px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="ap-phone" className="field-label">Mobile Phone Number <span style={{ color: "#f43f5e" }}>*</span></label>
                    <input
                      id="ap-phone"
                      type="tel"
                      required
                      maxLength={20}
                      autoComplete="tel"
                      placeholder="e.g. +977-98XXXXXXXX"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full input-dark rounded-xl px-4 py-3 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="ap-email" className="field-label">Email Address <span style={{ color: "#64748b" }}>(Optional)</span></label>
                    <input
                      id="ap-email"
                      type="email"
                      maxLength={120}
                      autoComplete="email"
                      placeholder="e.g. email@gmail.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full input-dark rounded-xl px-4 py-3 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="ap-time" className="field-label">Preferred Contact Hours</label>
                    <select
                      id="ap-time"
                      value={applyForm.contactTime}
                      onChange={(e) => setApplyForm({ ...applyForm, contactTime: e.target.value })}
                      className="w-full input-dark rounded-xl px-3 py-3 text-sm"
                    >
                      <option value="Morning (07:00 AM - 11:00 AM)">Morning (07:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                      <option value="Evening (04:00 PM - 06:00 PM)">Evening (04:00 PM - 06:00 PM)</option>
                      <option value="Anytime">Anytime during office hours</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ap-msg" className="field-label">Additional details / requests</label>
                    <textarea
                      id="ap-msg"
                      rows={2}
                      maxLength={1000}
                      placeholder="E.g. want hostel support or weekend batch options..."
                      value={applyForm.message}
                      onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                      className="w-full input-dark rounded-xl px-4 py-3 text-sm leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="w-full btn-solid-cyan py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : "Confirm Application"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
