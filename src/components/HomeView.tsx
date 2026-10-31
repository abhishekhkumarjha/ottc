import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from "motion/react";
import {
  Award, ShieldCheck, Users, Briefcase, Zap,
  Wrench, Sparkles, BookOpen, Clock, ArrowRight, Star,
  MessageSquare, CheckCircle2, X, ChevronRight, GraduationCap, Bot
} from "lucide-react";
import { COURSES, API_BASE } from "../coursesData";
import { Review } from "../types";
import { useModal } from "../hooks";
import TiltCard from "./TiltCard";

// three.js is ~150 KB gzipped, so the 3D scene loads in its own chunk after first paint
const Hero3D = lazy(() => import("./Hero3D"));

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onSelectCourse: (courseId: string) => void;
  openChat: () => void;
}

// ─── CSS orbit fallback (shown while 3D loads, or if WebGL is unavailable) ──
function OrbitFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[180, 260, 340].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1px dashed ${i === 1 ? "#a855f744" : "#00d4ff44"}`,
            animation: `spin-${i === 1 ? "reverse" : "slow"} ${20 + i * 10}s linear infinite`,
          }}
        />
      ))}
      <div
        className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
        style={{
          background: "radial-gradient(circle, rgba(0,102,255,0.3) 0%, rgba(0,212,255,0.1) 60%, transparent 100%)",
          border: "1px solid rgba(0, 212, 255, 0.5)",
          boxShadow: "0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(0,212,255,0.15)",
        }}
      >
        <GraduationCap className="h-10 w-10" style={{ color: "#00d4ff" }} />
        <span className="text-[9px] font-display font-bold tracking-widest mt-1" style={{ color: "#00d4ff" }}>OTTC</span>
      </div>
    </div>
  );
}

// ─── Number that counts up when scrolled into view ──────────────────────────
function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = prefix + Math.round(v).toLocaleString() + suffix; },
    });
    return () => controls.stop();
  }, [inView, to, suffix, prefix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const categoriesList = [
  { courseId: "electrician", title: "Electrician", desc: "House & industrial power wiring", icon: Zap, color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { courseId: "mobile-repair", title: "Mobile Repairing", desc: "Diagnostics, micro-soldering, flashing", icon: Sparkles, color: "#818cf8", glow: "rgba(129,140,248,0.3)" },
  { courseId: "electronics", title: "Electronics Repair", desc: "Inverters, UPS, SMPS & Smart TVs", icon: BookOpen, color: "#f43f5e", glow: "rgba(244,63,94,0.3)" },
  { courseId: "plumber", title: "Plumbing", desc: "Sanitaryware & PPR fusion welding", icon: Wrench, color: "#22d3ee", glow: "rgba(34,211,238,0.3)" },
  { courseId: "driving", title: "Vehicle Driving", desc: "Safety driving & engine maintenance", icon: Clock, color: "#34d399", glow: "rgba(52,211,153,0.3)" },
  { courseId: "ac-refrigeration", title: "AC & Refrigeration", desc: "HVAC thermodynamics & gas charging", icon: ShieldCheck, color: "#38bdf8", glow: "rgba(56,189,248,0.3)" },
  { courseId: "electrical-supervisor", title: "Electrical Supervisor", desc: "Construction estimation & safety audits", icon: Users, color: "#c084fc", glow: "rgba(192,132,252,0.3)" },
  { courseId: "house-wiring", title: "House Wiring", desc: "Concealed residential layouts", icon: Award, color: "#fb923c", glow: "rgba(251,146,60,0.3)" },
];

const advantages = [
  { title: "30+ Years Experience", desc: "Established in 2050 B.S., guiding generations of technicians.", icon: Award, color: "#f59e0b" },
  { title: "Up to 95% Practical", desc: "Learn by working on real industrial setups in our labs.", icon: Wrench, color: "#22d3ee" },
  { title: "Expert Trainers", desc: "Certified trade experts with extensive industry field experience.", icon: Users, color: "#818cf8" },
  { title: "Affordable Fees", desc: "Flexible payment plans and competitive tuition for everyone.", icon: ShieldCheck, color: "#34d399" },
  { title: "Job-Oriented", desc: "Syllabus aligned with technical job specs in Nepal & Gulf.", icon: Briefcase, color: "#f43f5e" },
  { title: "Pro Equipment", desc: "Use the exact instruments and tools found on real job sites.", icon: Zap, color: "#fb923c" },
  { title: "Certified Credentials", desc: "Earn vocational trade certification upon passing evaluations.", icon: Award, color: "#c084fc" },
  { title: "Small Batch Sizes", desc: "Max 15 students per batch for personalized mentoring.", icon: Users, color: "#38bdf8" },
];

const maxPractical = Math.max(...COURSES.map((c) => c.practicalPercentage));
const stats = [
  { value: 30, suffix: "+", label: "Years Experience", sub: "Since 2050 B.S.", color: "#22d3ee", glow: "rgba(34,211,238,0.4)" },
  { value: 5000, suffix: "+", label: "Graduates Trained", sub: "Employment Success", color: "#818cf8", glow: "rgba(129,140,248,0.4)" },
  { value: COURSES.length, suffix: "", label: "Trade Courses", sub: "Practical Trades", color: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
  { value: maxPractical, suffix: "%", label: "Hands-on Training", sub: "Up to, in workshops", color: "#34d399", glow: "rgba(52,211,153,0.4)" },
];

const emptyReview = () => ({ name: "", rating: 5, courseId: COURSES[0]?.id || "electrician", batch: "", text: "" });

export default function HomeView({ setActiveTab, onSelectCourse, openChat }: HomeViewProps) {
  const popularCourses = COURSES.filter(c => c.popular).slice(0, 3);
  const heroRef = useRef<HTMLElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const handleUnsupported = useCallback(() => setWebglFailed(true), []);

  // Hero content drifts and fades slightly as you scroll past it
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroSceneY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState(emptyReview);

  const closeReviewModal = useCallback(() => {
    setShowReviewModal(false);
    setReviewSuccess(false);
    setReviewError(null);
  }, []);
  useModal(showReviewModal, closeReviewModal);

  const fetchReviews = async () => {
    try {
      const res = await fetch(API_BASE + "/api/reviews");
      if (res.ok) setReviews(await res.json());
    } catch (e) { console.error(e); } finally { setLoadingReviews(false); }
  };
  useEffect(() => { fetchReviews(); }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      setReviewError("Please enter your name and review.");
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const res = await fetch(API_BASE + "/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Could not submit your review. Please try again.");
      }
      setReviewSuccess(true);
      setReviewForm(emptyReview());
      fetchReviews();
    } catch (err: any) {
      setReviewError(err.message === "Failed to fetch" ? "Cannot reach the server. Please check your connection." : err.message);
    } finally { setSubmittingReview(false); }
  };

  return (
    <div className="space-y-0 pb-20 relative overflow-hidden">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center py-20 px-4 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,102,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(124,58,237,0.08) 0%, transparent 60%), #020408",
        }}
      >
        {/* Perspective grid floor */}
        <div className="hero-floor" aria-hidden="true" />

        {/* 3D scene: full-bleed backdrop on mobile, right half on desktop */}
        <motion.div
          style={{ y: heroSceneY, opacity: heroOpacity }}
          className="absolute inset-0 lg:left-[45%] opacity-50 lg:opacity-100"
        >
          {webglFailed ? (
            <OrbitFallback />
          ) : (
            <Suspense fallback={<OrbitFallback />}>
              <Hero3D className="absolute inset-0" onUnsupported={handleUnsupported} />
            </Suspense>
          )}
        </motion.div>

        {/* Fade the scene into the text column for legibility */}
        <div
          className="absolute inset-0 pointer-events-none lg:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(2,4,8,0.2), rgba(2,4,8,0.75))" }}
        />

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 sm:px-6 lg:px-8"
        >
          {/* Left – Text Content */}
          <div className="space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-xs"
              style={{
                background: "rgba(0, 212, 255, 0.08)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                color: "#00d4ff",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>30+ Years of Vocational Excellence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight"
              style={{ color: "#f1f5f9" }}
            >
              Learn{" "}
              <span className="text-gradient-cyan">Practical</span>
              <br />
              Skills.{" "}
              <span className="text-gradient-violet">Build Your Career.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ color: "#a8b5c8", lineHeight: 1.8 }}
              className="text-sm sm:text-base max-w-xl"
            >
              Join Onida Technical Training Centre (OTTC) in Janakpurdham. Master high-demand technical trades through
              hands-on workshop training and get job-ready for careers in Nepal and the Gulf.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={() => setActiveTab("catalog")}
                className="btn-solid-cyan px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-4 w-4" />
                Explore Courses
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("contact")}
                className="btn-neon-cyan px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Apply Online
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
              <motion.button
                onClick={openChat}
                className="px-6 py-3.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-widest cursor-pointer transition-colors duration-300 flex items-center gap-2 hover:text-slate-200"
                style={{ color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Bot className="h-4 w-4" />
                Ask AI Counselor
              </motion.button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 font-mono text-[11px]"
              style={{ color: "#7c8ba1" }}
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#34d399" }} /> Govt. registered</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#34d399" }} /> New batches monthly</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#34d399" }} /> Max 15 per batch</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "#64748b" }}>Scroll</span>
          <div className="w-5 h-8 rounded-full border flex justify-center pt-1.5" style={{ borderColor: "rgba(148,163,184,0.3)" }}>
            <motion.div
              className="w-1 h-1.5 rounded-full"
              style={{ background: "#00d4ff" }}
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── 2. STATS ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, rotateX: -25 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 800 }}
            >
              <TiltCard max={8} className="glass-card rounded-2xl p-5 sm:p-6 text-center overflow-hidden corner-accent">
                <div className="absolute inset-0 opacity-10 rounded-2xl" style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}, transparent 70%)` }} />
                <div
                  className="font-display font-bold text-3xl sm:text-5xl mb-2 relative"
                  style={{ color: stat.color, textShadow: `0 0 24px ${stat.glow}`, transform: "translateZ(30px)" }}
                >
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-semibold text-sm mb-1 relative" style={{ color: "#e2e8f0" }}>{stat.label}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest relative" style={{ color: "#7c8ba1" }}>{stat.sub}</div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider-neon mx-auto max-w-4xl" />

      {/* ── 3. COURSES CATALOG PREVIEW ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-eyebrow" style={{ color: "#00d4ff" }}>Training Programs</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 mb-4" style={{ color: "#f1f5f9" }}>
            Our Course Catalog
          </h2>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            Industry-aligned vocational programs with extensive practical lab time, taught by certified experts.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriesList.map((cat, i) => (
            <motion.div
              key={cat.courseId}
              initial={{ opacity: 0, y: 30, rotateY: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 900 }}
            >
              <TiltCard
                role="button"
                tabIndex={0}
                onClick={() => onSelectCourse(cat.courseId)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectCourse(cat.courseId); } }}
                className="glass-card rounded-2xl p-5 text-left cursor-pointer overflow-hidden group focus-ring"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${cat.glow}, transparent 60%)` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 relative"
                  style={{
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    boxShadow: `0 0 15px ${cat.glow}`,
                    transform: "translateZ(40px)",
                  }}
                >
                  <cat.icon className="h-5 w-5 relative z-10" style={{ color: cat.color }} />
                </div>
                <div className="font-display font-semibold text-xs sm:text-sm mb-1 relative" style={{ color: "#f1f5f9", transform: "translateZ(25px)" }}>
                  {cat.title}
                </div>
                <div className="font-sans text-[11px] leading-relaxed relative" style={{ color: "#94a3b8", transform: "translateZ(15px)" }}>
                  {cat.desc}
                </div>
                <ChevronRight
                  className="absolute bottom-4 right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: cat.color }}
                />
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <motion.button
            onClick={() => setActiveTab("catalog")}
            className="btn-neon-cyan px-8 py-3.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </section>

      <div className="divider-neon-purple mx-auto max-w-4xl" />

      {/* ── 4. WHY OTTC ─────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%), #050b12",
        }}
      >
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-eyebrow" style={{ color: "#a855f7" }}>Why Choose Us</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 mb-4" style={{ color: "#f1f5f9" }}>
              The OTTC <span className="text-gradient-violet">Advantage</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 30, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 900 }}
              >
                <TiltCard max={7} className="glass-card rounded-2xl p-6 overflow-hidden group">
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ background: adv.color }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${adv.color}15`, border: `1px solid ${adv.color}30`, transform: "translateZ(30px)" }}
                  >
                    <adv.icon className="h-5 w-5" style={{ color: adv.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-2" style={{ color: "#f1f5f9" }}>
                    {adv.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                    {adv.desc}
                  </p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-neon mx-auto max-w-4xl" />

      {/* ── 5. FEATURED COURSES ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-eyebrow" style={{ color: "#00d4ff" }}>Popular Programs</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3" style={{ color: "#f1f5f9" }}>
            Featured Courses
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                role="button"
                tabIndex={0}
                onClick={() => onSelectCourse(course.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectCourse(course.id); } }}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col focus-ring"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    style={{ filter: "brightness(0.8) saturate(0.9)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,1) 0%, transparent 60%)" }} />
                  <span
                    className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md"
                    style={{ background: "rgba(2,4,8,0.75)", border: "1px solid rgba(0,212,255,0.25)", color: "#7dd3fc", backdropFilter: "blur(6px)" }}
                  >
                    {course.duration}
                  </span>
                </div>

                <div className="p-6 pt-2 space-y-4 flex-grow flex flex-col">
                  <h3 className="font-display font-bold text-base" style={{ color: "#f1f5f9", transform: "translateZ(20px)" }}>
                    {course.name}
                  </h3>
                  <p className="text-xs leading-relaxed flex-grow" style={{ color: "#94a3b8" }}>
                    {course.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="font-display font-bold text-sm" style={{ color: "#e2e8f0" }}>
                      Rs. {course.fee.toLocaleString()}
                    </span>
                    <span className="font-mono text-[11px] flex items-center gap-1 transition-transform group-hover:translate-x-1" style={{ color: "#34d399" }}>
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider-neon-purple mx-auto max-w-4xl" />

      {/* ── 6. REVIEWS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative" style={{ background: "#050b12" }}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4"
          >
            <div className="text-center sm:text-left">
              <span className="section-eyebrow" style={{ color: "#a855f7" }}>Student Testimonials</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mt-2" style={{ color: "#f1f5f9" }}>
                Student Reviews
              </h2>
            </div>
            <motion.button
              onClick={() => setShowReviewModal(true)}
              className="btn-neon-purple px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="h-4 w-4" />
              Write a Review
            </motion.button>
          </motion.div>

          {loadingReviews ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-4 rounded mb-3" style={{ background: "rgba(255,255,255,0.06)", width: "60%" }} />
                  <div className="h-3 rounded mb-2" style={{ background: "rgba(255,255,255,0.04)", width: "100%" }} />
                  <div className="h-3 rounded" style={{ background: "rgba(255,255,255,0.04)", width: "80%" }} />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: "#a855f7" }} />
              <p className="font-mono text-sm" style={{ color: "#94a3b8" }}>No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.slice(0, 6).map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex" aria-label={`${review.rating} out of 5 stars`}>
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          className="h-3.5 w-3.5"
                          style={{
                            color: s < review.rating ? "#f59e0b" : "#334155",
                            fill: s < review.rating ? "#f59e0b" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: "#64748b" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed flex-grow" style={{ color: "#a8b5c8" }}>
                    "{review.text}"
                  </p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} className="pt-3">
                    <p className="font-display font-semibold text-xs" style={{ color: "#f1f5f9" }}>{review.name}</p>
                    <p className="font-mono text-[10px] mt-0.5" style={{ color: "#7c8ba1" }}>
                      {COURSES.find(c => c.id === review.courseId)?.name || review.courseId}
                      {review.batch ? ` · ${review.batch}` : ""}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 7. CTA SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, rotateX: 25, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden corner-accent"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,102,255,0.14) 0%, rgba(124,58,237,0.08) 50%, rgba(10,22,40,0.9) 100%)",
              border: "1px solid rgba(0,212,255,0.18)",
              boxShadow: "0 0 80px rgba(0,102,255,0.1), 0 0 40px rgba(124,58,237,0.05)",
            }}
          >
            <div className="absolute inset-0 cyber-grid opacity-30 rounded-3xl" />
            <div className="relative space-y-6">
              <span className="section-eyebrow" style={{ color: "#00d4ff" }}>Start Your Journey Today</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "#f1f5f9" }}>
                Ready to <span className="text-gradient-cyan">Transform</span> Your Future?
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
                Enroll in one of Nepal's most trusted vocational training centres. New batches start every month.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <motion.button
                  onClick={() => setActiveTab("catalog")}
                  className="btn-solid-cyan px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="h-4 w-4" />
                  Explore Courses
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("contact")}
                  className="btn-neon-cyan px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── REVIEW MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            key="review-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(2,4,8,0.8)", backdropFilter: "blur(8px)" }}
            onClick={closeReviewModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-modal-title"
              initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-full max-w-lg rounded-2xl p-6 sm:p-8 relative my-auto"
              style={{
                background: "rgba(10,22,40,0.98)",
                border: "1px solid rgba(168,85,247,0.3)",
                boxShadow: "0 0 40px rgba(168,85,247,0.2)",
                transformPerspective: 1000,
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={closeReviewModal}
                aria-label="Close"
                className="absolute top-4 right-4 p-1.5 rounded-lg cursor-pointer transition-colors hover:text-slate-200"
                style={{ color: "#94a3b8", background: "rgba(255,255,255,0.05)" }}
              >
                <X className="h-4 w-4" />
              </button>

              {reviewSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto" style={{ color: "#34d399", filter: "drop-shadow(0 0 15px rgba(52,211,153,0.6))" }} />
                  <h3 className="font-display font-bold text-xl" style={{ color: "#34d399" }}>Review Submitted!</h3>
                  <p className="text-sm" style={{ color: "#94a3b8" }}>Thank you for sharing your experience.</p>
                  <button onClick={closeReviewModal} className="btn-neon-cyan px-6 py-2.5 rounded-xl text-xs cursor-pointer">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <h3 id="review-modal-title" className="font-display font-bold text-xl mb-1" style={{ color: "#f1f5f9" }}>Write a Review</h3>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Share your learning experience at OTTC</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rv-name" className="field-label">Name *</label>
                      <input
                        id="rv-name"
                        type="text"
                        required
                        maxLength={80}
                        className="w-full input-dark px-3 py-2.5 rounded-lg text-sm"
                        value={reviewForm.name}
                        onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="rv-batch" className="field-label">Batch Year</label>
                      <input
                        id="rv-batch"
                        type="text"
                        maxLength={30}
                        className="w-full input-dark px-3 py-2.5 rounded-lg text-sm"
                        value={reviewForm.batch}
                        onChange={e => setReviewForm(f => ({ ...f, batch: e.target.value }))}
                        placeholder="e.g. 2081 B.S."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rv-course" className="field-label">Course</label>
                    <select
                      id="rv-course"
                      className="w-full input-dark px-3 py-2.5 rounded-lg text-sm"
                      value={reviewForm.courseId}
                      onChange={e => setReviewForm(f => ({ ...f, courseId: e.target.value }))}
                    >
                      {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <span className="field-label">Rating</span>
                    <div className="flex gap-2" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={reviewForm.rating === n}
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                          onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className="h-7 w-7"
                            style={{
                              color: n <= reviewForm.rating ? "#f59e0b" : "#334155",
                              fill: n <= reviewForm.rating ? "#f59e0b" : "transparent",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rv-text" className="field-label">Your Review *</label>
                    <textarea
                      id="rv-text"
                      required
                      rows={4}
                      maxLength={1000}
                      className="w-full input-dark px-3 py-2.5 rounded-lg text-sm resize-none"
                      value={reviewForm.text}
                      onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                      placeholder="Share your experience..."
                    />
                  </div>

                  {reviewError && (
                    <div role="alert" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#fb7185" }}>
                      <X className="h-4 w-4 shrink-0" />
                      {reviewError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full btn-solid-cyan py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Review
                      </>
                    )}
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
