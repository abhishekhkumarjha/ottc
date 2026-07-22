import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Award, ShieldCheck, Users, Briefcase, Zap, 
  Wrench, Sparkles, BookOpen, Clock, ArrowRight, Star,
  MessageSquare, CheckCircle2, X
} from "lucide-react";
import { COURSES, API_BASE } from "../coursesData";
import { Review } from "../types";

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onSelectCourse: (courseId: string) => void;
  openChat: () => void;
}

export default function HomeView({ setActiveTab, onSelectCourse, openChat }: HomeViewProps) {
  // Get 3 popular courses
  const popularCourses = COURSES.filter(c => c.popular).slice(0, 3);

  // Mouse tracking state for 3D Hero Parallax
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 30; // Max tilt 30deg
    const y = ((clientY - top) / height - 0.5) * 30;
    setMouseCoords({ x, y });
  };
  const handleMouseLeave = () => {
    setMouseCoords({ x: 0, y: 0 });
  };

  // Reviews & Feedback State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    courseId: COURSES[0]?.id || "electrician",
    batch: "",
    text: ""
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch(API_BASE + "/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const res = await fetch(API_BASE + "/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit review.");
      }
      setReviewSuccess(true);
      setReviewForm({
        name: "",
        rating: 5,
        courseId: COURSES[0]?.id || "electrician",
        batch: "",
        text: ""
      });
      fetchReviews(); // Refresh list
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };


  // Training categories requested:
  const categoriesList = [
    { courseId: "electrician", title: "Electrician", desc: "House & industrial power wiring setups", icon: Zap, color: "from-amber-400 to-orange-500" },
    { courseId: "mobile-repair", title: "Mobile Repairing", desc: "Diagnostics, micro-soldering, iOS/Android flashing", icon: Sparkles, color: "from-indigo-400 to-purple-500" },
    { courseId: "electronics", title: "Electronics Repairing", desc: "Inverters, UPS systems, SMPS & Smart TVs", icon: BookOpen, color: "from-rose-400 to-red-500" },
    { courseId: "plumber", title: "Professional Plumbing", desc: "Sanitaryware fittings, PPR fusion welding", icon: Wrench, color: "from-cyan-400 to-teal-500" },
    { courseId: "driving", title: "Vehicle Driving & Maintenance", desc: "Safety road driving and engine maintenance", icon: Clock, color: "from-emerald-400 to-teal-500" },
    { courseId: "ac-refrigeration", title: "AC & Refrigeration", desc: "Thermodynamic cycles, split AC gas charging", icon: ShieldCheck, color: "from-sky-400 to-indigo-500" },
    { courseId: "electrical-supervisor", title: "Electrical Supervisor", desc: "Construction estimation & safety audits", icon: Users, color: "from-purple-400 to-pink-500" },
    { courseId: "house-wiring", title: "Electrical House Wiring", desc: "Concealed residential layouts and conduits", icon: Award, color: "from-orange-400 to-amber-500" }
  ];

  const advantages = [
    { title: "30+ Years of Experience", desc: "Established in 2050 B.S., guiding generations of technicians.", icon: Award },
    { title: "80%-95% Practical Training", desc: "Learn by actively working on real industrial setups in labs.", icon: Wrench },
    { title: "Experienced Trainers", desc: "Classes led by certified trade experts with extensive industry field time.", icon: Users },
    { title: "Affordable Fees", desc: "Flexible payment plans and competitive tuition rates for everyone.", icon: ShieldCheck },
    { title: "Job-Oriented Courses", desc: "Syllabus aligned strictly with technical job specifications in Nepal & Gulf.", icon: Briefcase },
    { title: "Industry Standard Equipment", desc: "Gain familiarity with the exact instruments, drills, and tools used on sites.", icon: Zap },
    { title: "Certificate After Completion", desc: "Earn vocational trade certification upon passing final trade evaluations.", icon: Award },
    { title: "Small Batch Sizes", desc: "Limited intake per batch (max 15) to guarantee personal mentor guidance.", icon: Users },
  ];

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden bg-slate-50/20 font-sans">
      
      {/* Background Floating Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 right-1/10 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 lg:py-24 px-4 overflow-hidden rounded-b-[40px] shadow-2xl shadow-slate-950/20">
        {/* Background Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        {/* Decorative Neon Blurs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
          
          {/* Hero Left Content */}
          <div className="space-y-8 text-left max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-mono shadow-inner shadow-emerald-500/5"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
              <span>30+ Years of Vocational Excellence</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-slate-100"
            >
              Learn Practical Skills.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">Build Your Career.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-sm sm:text-base text-slate-350 leading-relaxed max-w-xl"
            >
              Join Onida Technical Training Centre (OTTC) in Janakpurdham. Master high-demand technical trades through 85% to 95% hands-on laboratory training and lock in high-paying job opportunities in Nepal and the Gulf.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => setActiveTab("catalog")}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
              >
                Explore Courses
              </button>
              <button
                onClick={() => {
                  onSelectCourse("electrician"); // Default to electrician for immediate form
                  setActiveTab("catalog");
                }}
                className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-100 font-bold px-8 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer"
              >
                Apply Online
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className="border border-slate-700 hover:bg-white/5 text-slate-300 font-medium px-6 py-3.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Find Us
              </button>
            </motion.div>
          </div>

          {/* Hero Right Content: 3D Interactive Parallax Orbital Scene */}
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:flex items-center justify-center relative perspective-1000 w-full h-[450px]"
          >
            <motion.div
              style={{
                rotateX: -mouseCoords.y,
                rotateY: mouseCoords.x,
                transformStyle: "preserve-3d"
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-[400px] h-[400px] relative flex items-center justify-center preserve-3d"
            >
              {/* Central Glowing Core Globe */}
              <div 
                className="absolute w-28 h-28 bg-emerald-500/15 border border-emerald-500/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)] animate-pulse preserve-3d"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="bg-emerald-600/30 p-3 rounded-2xl border border-emerald-500/40 shadow-inner">
                  <Award className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest mt-2">OTTC</span>
              </div>

              {/* Orbiting Technical Nodes with GPU accelerated rotation keys */}
              <motion.div
                className="absolute w-15 h-15 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:border-emerald-400 transition-colors preserve-3d animate-orbit-1 cursor-pointer"
                style={{ transform: "translateZ(70px)" }}
                whileHover={{ scale: 1.15, z: 90 }}
              >
                <Zap className="h-6 w-6 text-amber-400" title="Electrical Lab" />
              </motion.div>

              <motion.div
                className="absolute w-15 h-15 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:border-emerald-400 transition-colors preserve-3d animate-orbit-2 cursor-pointer"
                style={{ transform: "translateZ(90px)" }}
                whileHover={{ scale: 1.15, z: 110 }}
              >
                <Sparkles className="h-6 w-6 text-indigo-400" title="Mobile Servicing" />
              </motion.div>

              <motion.div
                className="absolute w-15 h-15 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:border-emerald-400 transition-colors preserve-3d animate-orbit-3 cursor-pointer"
                style={{ transform: "translateZ(110px)" }}
                whileHover={{ scale: 1.15, z: 130 }}
              >
                <Wrench className="h-6 w-6 text-blue-400" title="AC & Refrigeration" />
              </motion.div>

              <motion.div
                className="absolute w-15 h-15 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:border-emerald-400 transition-colors preserve-3d animate-orbit-4 cursor-pointer"
                style={{ transform: "translateZ(50px)" }}
                whileHover={{ scale: 1.15, z: 70 }}
              >
                <ShieldCheck className="h-6 w-6 text-emerald-400" title="Quality Supervisor" />
              </motion.div>

              {/* Orbital Path Guides in Perspective */}
              <div 
                className="absolute inset-0 border border-dashed border-emerald-500/10 rounded-full w-full h-full animate-[spin_40s_linear_infinite] preserve-3d pointer-events-none"
                style={{ transform: "translateZ(-20px) rotateX(70deg)" }} 
              />
              <div 
                className="absolute inset-0 border border-dashed border-teal-500/10 rounded-full w-[85%] h-[85%] left-[7.5%] top-[7.5%] animate-[spin_50s_linear_infinite_reverse] preserve-3d pointer-events-none"
                style={{ transform: "translateZ(-40px) rotateX(60deg)" }} 
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. STATS SECTION (Interactive 3D Glass Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "30+", label: "Years Experience", color: "from-emerald-500 to-teal-400", sub: "Since 2050 B.S." },
            { value: "5000+", label: "Graduates Trained", color: "from-blue-500 to-indigo-400", sub: "Employment Success" },
            { value: "10+", label: "Expert Courses", color: "from-amber-400 to-orange-500", sub: "Practical Trades" },
            { value: "90%+", label: "Practical Training", color: "from-purple-500 to-rose-400", sub: "Hands-on Workshops" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
              whileHover={{ y: -8, rotateX: 6, rotateY: -6, z: 15 }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/40 hover:shadow-2xl hover:border-emerald-100/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-center items-center preserve-3d"
            >
              <div 
                className={`font-display font-extrabold text-4xl sm:text-5xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent drop-shadow-sm`}
                style={{ transform: "translateZ(25px)" }}
              >
                {stat.value}
              </div>
              <div 
                className="text-xs font-bold text-slate-800 tracking-tight mt-2.5 font-display"
                style={{ transform: "translateZ(15px)" }}
              >
                {stat.label}
              </div>
              <div 
                className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider"
                style={{ transform: "translateZ(10px)" }}
              >
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE OTTC */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center"
      >
        <div className="space-y-3">
          <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-bold">Unrivaled Technical Pedagogy</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">Why Choose OTTC Janakpur?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            Over three decades of vocational excellence. Our learning frameworks ensure job readiness from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, index) => {
            const IconComponent = adv.icon;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, rotateX: 4, rotateY: 4 }}
                className="bg-white border border-slate-100 p-6 rounded-3xl hover:shadow-2xl hover:border-emerald-100/50 hover:bg-slate-50/10 transition-all group duration-300 flex flex-col items-center justify-between text-center cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl w-fit mx-auto group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug">{adv.title}</h3>
                  <p className="font-sans text-xs text-slate-400 mt-2 leading-relaxed">{adv.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 4. POPULAR COURSES */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-3 text-left">
            <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-bold">Fast-Track Career Launch</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">Our Popular Trade Programs</h2>
            <p className="text-slate-400 text-xs font-sans">Learn trades that guarantee placement across international industrial pipelines.</p>
          </div>
          <button 
            onClick={() => setActiveTab("catalog")}
            className="flex items-center text-emerald-600 font-sans font-bold text-xs tracking-wider uppercase hover:text-emerald-700 transition-colors group shrink-0"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCourses.map((course, i) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[28px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-emerald-100 transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 font-mono font-extrabold text-[9px] uppercase px-3 py-1.5 rounded-lg shadow-md tracking-wider">
                  Popular
                </div>
                <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-white font-mono text-[10px] uppercase font-semibold px-3 py-1 rounded-lg">
                  {course.duration} Duration
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow space-y-4 text-left">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-extrabold text-lg text-slate-900 leading-tight">
                    {course.name}
                  </h3>
                  <span className="font-mono text-emerald-600 font-extrabold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Rs. {course.fee.toLocaleString()}
                  </span>
                </div>

                <p className="font-sans text-xs text-slate-500 leading-relaxed flex-grow">
                  {course.shortDescription}
                </p>

                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-400 py-3 border-y border-slate-50">
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase tracking-wider">Practical:</span>
                    <span className="text-emerald-600 font-bold">{course.practicalPercentage}% Hands-On</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase tracking-wider">Level:</span>
                    <span className="text-slate-600 font-bold">{course.level}</span>
                  </div>
                </div>

                <div className="pt-2 flex space-x-2.5">
                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 font-bold text-xs py-3 rounded-xl text-center transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectCourse(course.id);
                      setActiveTab("catalog");
                      setTimeout(() => {
                        const btn = document.getElementById("catalog-apply-btn");
                        if (btn) btn.click();
                      }, 200);
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-3 rounded-xl text-center transition-colors shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 5. TRAINING CATEGORIES */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-slate-900 text-white py-16 px-6 sm:px-12 rounded-[40px] shadow-2xl relative overflow-hidden border border-slate-800">
          {/* Animated Background blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-12 relative z-10">
            <div className="text-center space-y-3">
              <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider font-bold">Diverse Workshop Classes</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 tracking-tight">Our Core Training Categories</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
                We cover key mechanical and technical trades required in residential building, automobile systems, electronics servicing, and heavy industrial sites.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriesList.map((cat, index) => {
                const IconComponent = cat.icon;
                return (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-950/90 transition-all flex items-start space-x-4 group cursor-pointer text-left"
                    onClick={() => {
                      onSelectCourse(cat.courseId);
                    }}
                  >
                    <div className={`bg-gradient-to-br ${cat.color} text-slate-950 p-3.5 rounded-xl shadow-md group-hover:rotate-12 transition-transform`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-200 text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. STUDENT SUCCESS (TESTIMONIALS & REVIEWS) */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        id="reviews-section"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-3 text-left md:max-w-xl">
            <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-bold">Student Feedback</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">Verified Student Reviews</h2>
            <p className="text-slate-550 text-xs sm:text-sm">
              Read real, unedited feedback from our alumni, or share your own technical training experience to help future students.
            </p>
          </div>
          <button
            onClick={() => {
              setReviewSuccess(false);
              setReviewError(null);
              setShowReviewModal(true);
            }}
            className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-950 text-white px-5 py-3 rounded-xl font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-md shrink-0 self-start md:self-end cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {loadingReviews ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-slate-400 text-xs font-mono mt-3">Loading student reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl py-14 text-center max-w-lg mx-auto space-y-4">
            <p className="text-slate-450 font-sans text-xs">No student reviews have been posted yet.</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-emerald-600 font-sans font-bold text-xs hover:underline cursor-pointer"
            >
              Be the first to share your feedback!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((t, i) => {
              const courseName = COURSES.find(c => c.id === t.courseId)?.name || t.courseId;
              const initials = t.name ? t.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "OT";
              
              const colors = [
                "bg-emerald-500 text-slate-950",
                "bg-blue-500 text-white",
                "bg-indigo-500 text-white",
                "bg-amber-500 text-slate-950",
                "bg-teal-500 text-slate-950",
                "bg-purple-500 text-white"
              ];
              const colorIdx = (t.name || "").charCodeAt(0) % colors.length;
              const avatarColor = colors[colorIdx];
 
              return (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 border border-slate-100 rounded-3xl shadow-xl shadow-slate-150/20 hover:shadow-2xl hover:border-emerald-50 transition-all flex flex-col justify-between relative text-left cursor-pointer"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex space-x-1 text-amber-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current text-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
 
                    {/* Quote text */}
                    <p className="font-sans text-xs sm:text-sm italic text-slate-650 leading-relaxed mb-6">
                      "{t.text}"
                    </p>
                  </div>
 
                  {/* Student Bio */}
                  <div className="flex items-center space-x-3.5 pt-4 border-t border-slate-50 mt-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs ${avatarColor} shrink-0`}>
                      {initials}
                    </div>
                    <div className="text-left">
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-none">{t.name}</h4>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold mt-1.5 block">
                        {courseName}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                        Batch {t.batch || "Recent"} • {new Date(t.createdAt).toLocaleDateString(undefined, {month: "short", year: "numeric"})}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 6B. WRITE A REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex justify-between items-center">
                <div className="space-y-1 text-left">
                  <h3 className="font-display font-extrabold text-lg leading-none">Write a Student Review</h3>
                  <p className="text-[10px] text-emerald-100 font-sans">Share your training feedback & rating with our community</p>
                </div>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {reviewSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex items-center justify-center bg-emerald-50 text-emerald-500 p-3.5 rounded-full animate-bounce">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-slate-900">Review Submitted Successfully!</h4>
                    <p className="font-sans text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Thank you for sharing your valuable training experience. Your review is now live on our platform and community board!
                    </p>
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setReviewSuccess(false);
                      }}
                      className="bg-slate-900 hover:bg-slate-950 text-white font-sans font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                    {reviewError && (
                      <div className="bg-red-50 border border-red-100 text-red-700 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
                        <span className="font-medium">{reviewError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sanjay Kumar Shah"
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Batch input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1">Batch Year / Info *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2080 B.S."
                          value={reviewForm.batch}
                          onChange={(e) => setReviewForm({ ...reviewForm, batch: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Course Selection */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1">Your Trade Course *</label>
                        <select
                          required
                          value={reviewForm.courseId}
                          onChange={(e) => setReviewForm({ ...reviewForm, courseId: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
                        >
                          {COURSES.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Interactive Rating Selection */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1">Rating (1 to 5 Stars) *</label>
                        <div className="flex items-center space-x-1.5 h-[42px] pl-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="text-amber-400 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                            >
                              <Star 
                                className={`h-6 w-6 ${star <= reviewForm.rating ? "fill-current text-amber-400" : "text-slate-350"}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1">Your Review / Experience *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the practical workshops, trainers, lab facilities, and how this vocational training helped you..."
                        value={reviewForm.text}
                        onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-md"
                      >
                        {submittingReview ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit My Review</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.section>


      {/* 7. CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-[36px] p-8 md:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Master Practical Tech Skills & Secure Your Career?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            New training batches start on the 1st of every month. Register your enrollment inquiry today. No prior academic background required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab("catalog")}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-[0.98]"
            >
              Apply Online Now
            </button>
            <button
              onClick={openChat}
              className="w-full sm:w-auto bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98]"
            >
              Chat with Admissions Bot
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
