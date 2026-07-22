import React from "react";
import { History, Target, Eye, ShieldCheck, Award, GraduationCap, Flame, Sparkles } from "lucide-react";

export default function AboutView() {
  const values = [
    { title: "Quality Education", desc: "Always maintaining the highest pedagogy benchmarks, aligning curriculum with active market standards.", icon: Award },
    { title: "Practical Learning", desc: "Minimizing theory lectures to maximize physical hand-on circuit building, troubleshooting, and tool operations.", icon: Target },
    { title: "Student Success", desc: "Supporting students step-by-step from base entry skills up to trade test evaluations and employment placement.", icon: Sparkles },
    { title: "Employment Focus", desc: "Designing curriculum centered entirely on real vacancy specifications for industrial sites in Nepal and the Gulf.", icon: Flame },
    { title: "Integrity & Safety", desc: "Upholding absolute professional honesty, institutional transparent billing, and rigorous workspace safety protocols.", icon: ShieldCheck }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-16 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="text-center space-y-3">
        <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-semibold">Learn About Us</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">Onida Technical Training Centre</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-sans text-sm md:text-base">
          OTTC is Dhanusha District's premium engineering and mechanics vocational school, trusted for 30+ years of high-yield trade education.
        </p>
      </div>

      {/* History Section */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-mono">
            <History className="h-4 w-4" />
            <span>Since 2050 B.S. (1993 A.D.)</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 tracking-tight">Our Established History</h2>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            Founded in 2050 B.S. as a humble workshop called Onida Training Centre, our initial focus was on radio, television circuits, and electrical house appliances repair. Over the decades, under the visionary leadership of our founders and trainers, we evolved into the fully-fledged Onida Technical Training Centre (OTTC).
          </p>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            Over the last thirty years, Janakpur has seen dramatic growth, and OTTC has grown with it. We expanded our practical workshop facilities to accommodate advanced branches like AC & Refrigeration (HVAC), Smart Mobile Diagnostics, Professional Plumbing, and Safety Vehicle Driving training, graduating over 5000+ certified students who are successfully working globally today.
          </p>
        </div>
        
        {/* Nice visual side graphic */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 shadow-md border border-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600" 
            alt="OTTC Electrical Workshop Laboratory" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400">OTTC Central Workshop</span>
              <p className="font-display font-bold text-base leading-tight">Practical Learning Space in Janakpur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 md:p-8 border border-emerald-100/50 space-y-4">
          <div className="bg-emerald-600 text-white p-3 rounded-xl w-fit">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-gray-900">Our Core Mission</h3>
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
            To empower individuals with practical, hand-on vocational and technical trade skills. We are committed to nurturing highly competent, safety-conscious professionals who can immediately join technical careers, support their families, and contribute to Nepal's civil development.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-teal-50/50 rounded-2xl p-6 md:p-8 border border-teal-100/50 space-y-4">
          <div className="bg-teal-600 text-white p-3 rounded-xl w-fit">
            <Eye className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-gray-900">Our Long-Term Vision</h3>
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
            To stand as Nepal's premium and leading technical training center, bridging the gap between local talent and global industrial demand. We aim to continually implement digital diagnostic tech and modern green energy HVAC setups so our graduates remain on the cutting edge.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-2xl text-gray-900 tracking-tight">Our Core Values</h2>
          <p className="text-gray-500 max-w-lg mx-auto font-sans text-xs sm:text-sm">
            The principles that guide our admissions counselors, trainers, workshop supervisors, and student cohorts every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const IconComponent = v.icon;
            return (
              <div 
                key={i} 
                className="bg-white border border-gray-100 p-5 rounded-xl flex flex-col hover:border-emerald-100 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-gray-50 text-emerald-600 p-2.5 rounded-lg w-fit mb-4 border border-gray-100">
                  <IconComponent className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-sm leading-snug">{v.title}</h3>
                <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
          
          {/* A cool credential card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-xl text-white flex flex-col justify-between border border-slate-800">
            <GraduationCap className="h-8 w-8 text-emerald-400" />
            <div className="space-y-1.5 pt-6">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Global Aligned</span>
              <p className="font-display font-semibold text-sm leading-tight">ISO 9001:2015 Audited</p>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">OTTC matches vocational frameworks for smooth Middle East trade certificate endorsements.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
