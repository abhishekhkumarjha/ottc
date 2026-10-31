import React from "react";
import { History, Target, Eye, ShieldCheck, Award, GraduationCap, Flame, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function AboutView() {
  const values = [
    { title: "Quality Education", desc: "Highest pedagogy benchmarks, curriculum aligned with active market standards.", icon: Award, color: "#f59e0b" },
    { title: "Practical Learning", desc: "Maximize hands-on circuit building, troubleshooting, and tool operations.", icon: Target, color: "#22d3ee" },
    { title: "Student Success", desc: "Supporting students from base entry skills to trade test evaluations.", icon: Sparkles, color: "#a855f7" },
    { title: "Employment Focus", desc: "Curriculum centered on real job specs for Nepal and Gulf industrial sites.", icon: Flame, color: "#f43f5e" },
    { title: "Integrity & Safety", desc: "Professional honesty, transparent billing, and rigorous safety protocols.", icon: ShieldCheck, color: "#34d399" },
  ];

  const timeline = [
    { year: "2050 B.S.", event: "Founded as Onida Training Centre", desc: "Started with radio, TV circuits & electrical appliances repair" },
    { year: "2060 B.S.", event: "Expanded to AC & HVAC", desc: "Added refrigeration, split AC systems and thermodynamics" },
    { year: "2070 B.S.", event: "Mobile & Electronics Division", desc: "Micro-soldering, smartphone diagnostics and UPS systems" },
    { year: "2080 B.S.", event: "5000+ Graduates Milestone", desc: "Alumni working across Nepal, Qatar, UAE, and Saudi Arabia" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <span className="section-eyebrow" style={{ color: "#00d4ff" }}>Learn About Us</span>
        <h1
          className="font-display font-bold text-3xl sm:text-4xl tracking-wider"
          style={{ color: "#e2e8f0" }}
        >
          Onida Technical{" "}
          <span style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.6)" }}>
            Training Centre
          </span>
        </h1>
        <p className="text-sm max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
          OTTC is Dhanusha District's premium vocational institute, trusted for 30+ years of high-yield trade education.
        </p>
      </motion.div>

      {/* History Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }}
        />
        <div className="space-y-5 relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#00d4ff",
            }}
          >
            <History className="h-3.5 w-3.5" />
            Since 2050 B.S. (1993 A.D.)
          </div>
          <h2 className="font-display font-bold text-2xl" style={{ color: "#e2e8f0" }}>Our Established History</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            Founded in 2050 B.S. as a humble workshop called Onida Training Centre, our initial focus was on radio, television circuits,
            and electrical house appliances repair. Over the decades, we evolved into the fully-fledged Onida Technical Training Centre (OTTC).
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            Over thirty years, we expanded practical workshop facilities to accommodate advanced branches like AC & Refrigeration (HVAC),
            Smart Mobile Diagnostics, Professional Plumbing, and Safety Vehicle Driving, graduating 5000+ certified students working globally.
          </p>
        </div>

        {/* Visual side */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-80" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600"
            alt="OTTC Electrical Workshop"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            style={{ filter: "brightness(0.7) saturate(0.8)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(2,4,8,0.9) 0%, rgba(2,4,8,0.2) 50%, transparent 100%)" }}
          />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#00d4ff" }}>OTTC Central Workshop</span>
            <p className="font-display font-bold text-sm mt-1" style={{ color: "#e2e8f0" }}>Practical Learning Space — Janakpur</p>
          </div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="text-center">
          <span className="section-eyebrow" style={{ color: "#a855f7" }}>Our Journey</span>
          <h2 className="font-display font-bold text-2xl mt-2" style={{ color: "#e2e8f0" }}>Growth Timeline</h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, #00d4ff, #a855f7, transparent)" }}
          />
          <div className="space-y-8 pl-16">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Dot */}
                <div
                  className="absolute -left-[42px] w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    background: "#020408",
                    borderColor: i === timeline.length - 1 ? "#a855f7" : "#00d4ff",
                    boxShadow: `0 0 10px ${i === timeline.length - 1 ? "rgba(168,85,247,0.5)" : "rgba(0,212,255,0.5)"}`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === timeline.length - 1 ? "#a855f7" : "#00d4ff" }} />
                </div>
                <div className="glass-card rounded-xl p-5">
                  <span className="font-mono text-xs" style={{ color: "#00d4ff" }}>{item.year}</span>
                  <h3 className="font-display font-semibold text-sm mt-1 mb-1" style={{ color: "#e2e8f0" }}>{item.event}</h3>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: Target, title: "Our Core Mission", color: "#00d4ff",
            text: "To empower individuals with practical vocational and technical trade skills. We are committed to nurturing highly competent, safety-conscious professionals who can immediately join technical careers, support their families, and contribute to Nepal's civil development.",
          },
          {
            icon: Eye, title: "Our Long-Term Vision", color: "#a855f7",
            text: "To stand as Nepal's premium technical training center, bridging the gap between local talent and global industrial demand. We aim to continually implement digital diagnostic tech and modern green energy HVAC setups so our graduates remain on the cutting edge.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-8 space-y-5 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 rounded-2xl" style={{ background: `radial-gradient(circle at 0% 0%, ${card.color}, transparent)` }} />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
            >
              <card.icon className="h-6 w-6" style={{ color: card.color }} />
            </div>
            <h3 className="font-display font-bold text-lg" style={{ color: "#e2e8f0" }}>{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{card.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Core Values */}
      <section className="space-y-10">
        <div className="text-center">
          <span className="section-eyebrow" style={{ color: "#00d4ff" }}>Guiding Principles</span>
          <h2 className="font-display font-bold text-2xl mt-2" style={{ color: "#e2e8f0" }}>Our Core Values</h2>
          <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "#94a3b8" }}>
            The principles guiding our admissions counselors, trainers, workshop supervisors, and student cohorts every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${v.color}15, transparent 60%)` }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${v.color}15`, border: `1px solid ${v.color}25` }}
              >
                <v.icon className="h-5 w-5" style={{ color: v.color }} />
              </div>
              <h3 className="font-display font-semibold text-sm" style={{ color: "#e2e8f0" }}>{v.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{v.desc}</p>
            </motion.div>
          ))}

          {/* ISO credential card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="rounded-2xl p-6 space-y-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,102,255,0.15) 0%, rgba(124,58,237,0.15) 100%)",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 0 30px rgba(0,102,255,0.1)",
            }}
          >
            <GraduationCap className="h-8 w-8" style={{ color: "#00d4ff", filter: "drop-shadow(0 0 6px rgba(0,212,255,0.6))" }} />
            <div className="space-y-2 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#00d4ff" }}>Globally Aligned</span>
              <p className="font-display font-semibold text-sm" style={{ color: "#e2e8f0" }}>ISO 9001:2015 Audited</p>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                OTTC matches vocational frameworks for smooth Middle East trade certificate endorsements.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: "#34d399" }} />
                <span className="font-mono text-xs" style={{ color: "#34d399" }}>Govt. Registered Since 2050 B.S.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
