import { Course } from "./types";

export const COURSES: Course[] = [
  {
    id: "electrician",
    name: "Electrician",
    category: "Electrical",
    duration: "3 Months",
    fee: 15000,
    admissionFee: 2000,
    eligibility: "Class 8 Pass or above",
    certificate: "Government-aligned OTTC Vocational Certification",
    practicalPercentage: 80,
    classTiming: "07:00 AM - 09:00 AM (Morning) or 11:00 AM - 01:00 PM (Midday)",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    shortDescription: "Master house wiring, industrial systems, single and three-phase motor rewinding, and safety procedures.",
    detailedDescription: "The Professional Electrician Course at OTTC Janakpur is designed to turn beginners into highly competent, safety-conscious electrical technicians. Students spend 80% of their class time working in our fully-equipped electrical lab, performing practical mock setups, testing circuits, and learning troubleshooting methods that meet both national and international industrial standards.",
    syllabus: [
      "Introduction to Electricity & Tools",
      "Electrical Safety Standards & First Aid",
      "Domestic House Wiring Circuits (Series & Parallel)",
      "Industrial Wiring & Distribution Boards",
      "Earthing Systems (Pipe & Plate Earthing)",
      "Single-Phase & Three-Phase Motors",
      "Electrical Measuring Instruments (Multimeter, Megger)",
      "Fault Diagnosis & Appliance Maintenance"
    ],
    careerOpportunities: [
      "Domestic/Residential Electrician",
      "Industrial Maintenance Technician",
      "Electrical Sales Representative",
      "Gulf/Overseas Electrical Operator",
      "Independent Electrical Contractor"
    ],
    popular: true,
    level: "Beginner"
  },
  {
    id: "mobile-repair",
    name: "Mobile Repairing",
    category: "Mobile Repair",
    duration: "3 Months",
    fee: 20000,
    admissionFee: 1500,
    eligibility: "Class 8 Pass or above",
    certificate: "OTTC Mobile Hardware & Software Specialist Certificate",
    practicalPercentage: 85,
    classTiming: "10:00 AM - 12:00 PM (Day) or 02:00 PM - 04:00 PM (Afternoon)",
    image: "/assets/mobile-repair.png",
    shortDescription: "Learn professional mobile hardware diagnostics, micro-soldering, IC reballing, and software flashing.",
    detailedDescription: "This intensive, hand-on program is perfect for aspiring technicians wanting to tap into the massive mobile device service industry. We cover everything from absolute basics of current and voltage to highly complex IC diagnostics, screen laminated replacements, and firmware/software flashing for Android and Apple iOS devices.",
    syllabus: [
      "Basics of Electronics & Mobile Circuit Board (PCB)",
      "Handling Repair Tools (SMD Rework Station, Soldering Iron)",
      "Disassembling & Assembling various smartphones",
      "Hardware Troubleshooting (Charging, Speaker, Display, Network)",
      "Micro-soldering techniques & IC Reballing",
      "Mobile Software Flashing, Unlocking, and FRP bypass",
      "Android OS diagnostic routines",
      "iPhone hardware fundamentals & safe disassembling"
    ],
    careerOpportunities: [
      "Certified Smartphone Repair Technician",
      "Mobile Service Center Manager",
      "Independent Repair Shop Owner",
      "E-waste Recycling & Reclamation Specialist",
      "Retail Device Diagnostics Associate"
    ],
    popular: true,
    level: "Beginner"
  },
  {
    id: "ac-refrigeration",
    name: "AC & Refrigeration",
    category: "AC & Refrigeration",
    duration: "3 Months",
    fee: 20000,
    admissionFee: 2500,
    eligibility: "Class 10 Pass preferred",
    certificate: "OTTC Refrigeration and Air Conditioning Expert Certificate",
    practicalPercentage: 75,
    classTiming: "08:00 AM - 10:00 AM (Morning) or 03:00 PM - 05:00 PM (Late Afternoon)",
    image: "/assets/ac-refrigeration.png",
    shortDescription: "Learn AC installation, refrigerator mechanics, gas charging, copper tube brazing, and PCB card testing.",
    detailedDescription: "With global warming making climate control systems essential, our HVAC (Heating, Ventilation, and Air Conditioning) course is highly sought-after. Students learn the complete thermodynamic cycle of refrigeration, gain direct practice with split and window AC systems, charging eco-friendly refrigerants, brazing copper tubes, and diagnosing control PCBs.",
    syllabus: [
      "Fundamentals of Refrigeration & Air Conditioning",
      "Tools, Equipment, and Safety measures",
      "Copper Tube Brazing, Flaring, and Swaging",
      "Compressor Mechanism, Motors, and Relays",
      "Refrigerator Systems & Freezer repair",
      "Split and Window AC Installation Procedures",
      "Vacuuming, Leak Testing, and Gas Charging (R22, R134a, R410a)",
      "HVAC Control PCB Diagnostic & Circuit repair"
    ],
    careerOpportunities: [
      "HVAC Maintenance Technician",
      "AC Installation Contractor",
      "Refrigerator Repair Expert",
      "Commercial Building Maintenance Engineer",
      "Gulf Countries Service Specialist (High Demand)"
    ],
    popular: true,
    level: "Advanced"
  },
  {
    id: "electronics",
    name: "Electronics Repairing",
    category: "Electronics",
    duration: "3 Months",
    fee: 50000,
    admissionFee: 2000,
    eligibility: "Class 8 Pass or above",
    certificate: "OTTC Applied Industrial Electronics Certificate",
    practicalPercentage: 80,
    classTiming: "01:00 PM - 03:00 PM (Afternoon)",
    image: "/assets/electronics-repair.png",
    shortDescription: "Master circuit design, soldering, diagnostics, and repairs of LED TVs, Inverters, and power supplies.",
    detailedDescription: "Electronics Repairing at OTTC gives you deep knowledge of electronic components and their functional circuits. Our training is highly practical, guiding students through real assembly, PCB design, repairing high-power inverters, modern LED/Smart TVs, induction cooktops, and high-frequency power adapters.",
    syllabus: [
      "Active & Passive Electronic Components (Resistors, Capacitors, Transistors, Diodes)",
      "Soldering & Desoldering Components safely",
      "Understanding Circuit Diagrams & Schematic reading",
      "Power Supply Units (Linear & SMPS)",
      "Inverter & UPS Charging/Output System repairs",
      "Modern LED/Smart TV Core Board diagnostics",
      "Induction Cooker & Home Appliance electronics",
      "Microcontroller circuit basics & PCB fabrication"
    ],
    careerOpportunities: [
      "Consumer Electronics Service Bench Technician",
      "Inverter & Power Electronics Repair Specialist",
      "Lab Assistant in Educational Institutions",
      "Assembly Line Quality Control Inspector",
      "Self-employed Home Appliance Repair Service"
    ],
    popular: false,
    level: "Advanced"
  },
  {
    id: "plumber",
    name: "Professional Plumbing",
    category: "Plumber",
    duration: "2 Months",
    fee: 18000,
    admissionFee: 1000,
    eligibility: "Literate (Basic reading & writing)",
    certificate: "OTTC Professional Plumber Vocational License Certification",
    practicalPercentage: 90,
    classTiming: "07:00 AM - 09:00 AM (Morning Only)",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=600",
    shortDescription: "Get hand-on training on pipe fitting, drainage installation, sanitary fittings, and leakage detection.",
    detailedDescription: "Plumbing is a vital skill in modern civil construction and home services. Our 2-month course teaches students pipe bending, threading, fusion welding of PPR pipes, drain pipe systems, bathroom and kitchen sanitary wares setup, and the logic of high-pressure water pumps and roof-top tanks.",
    syllabus: [
      "Plumbing Safety, Hand Tools, and Power Equipment",
      "Types of Pipes (GI, PVC, PPR, CPVC) & joint methods",
      "Pipe Threading, Bending, and PPR Hot Fusion Welding",
      "Water Supply Layout (Overhead Tank & Pump connections)",
      "Drainage & Sewage Pipe System installation",
      "Sanitary Fixtures Setup (Commodes, Washbasins, Sinks, Showers)",
      "Modern Water Pump operation & pressure regulators",
      "Leakage detection, maintenance, and waterproofing tips"
    ],
    careerOpportunities: [
      "Construction Site Plumber",
      "Residential Maintenance Plumber",
      "Hotel & Hospital Facility Maintenance Plumber",
      "Plumbing Supply Store Technical Consultant",
      "Self-employed Plumbing Service Operator"
    ],
    popular: false,
    level: "Beginner"
  },
  {
    id: "driving",
    name: "Vehicle Driving & Maintenance",
    category: "Driving",
    duration: "1 Month",
    fee: 22000,
    admissionFee: 1000,
    eligibility: "Age 18+ and medically fit",
    certificate: "OTTC Drivers Training Institute Certificate of Competency",
    practicalPercentage: 95,
    classTiming: "Flexible hourly slots between 06:00 AM and 05:00 PM (Choose your own slot)",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600",
    shortDescription: "Learn safe four-wheeler driving, traffic signs, mechanical troubleshooting, and license preparations.",
    detailedDescription: "OTTC Driving school provides a comprehensive learning experience that combines intense behind-the-wheel driving hours with mechanical class lectures. Students learn vehicle physics, traffic laws, and basic maintenance like changing tires, checking oil, engine cooling issues, and driving in difficult Nepalese mountain terrains.",
    syllabus: [
      "Pre-driving cockpit adjustments and controls layout",
      "Steering control, clutch balance, and smooth gear shifting",
      "Parallel parking, L-reverse, and uphill starting checks",
      "Traffic rules, signals, highway signs, and defensive driving",
      "Basic engine mechanics (Coolant, Lubrication, Spark plugs, Battery)",
      "Emergency tire changing, fuse replacement, and basic servicing",
      "Simulated license trial exam preparation",
      "First aid and emergency accident response"
    ],
    careerOpportunities: [
      "Professional Driver (Private, Corporate, Embassy)",
      "Tourist vehicle/cab Operator",
      "Fleet logistics driver",
      "Driver Trainer in Driving Schools",
      "Delivery and Courier Specialist"
    ],
    popular: true,
    level: "Beginner"
  },
  {
    id: "house-wiring",
    name: "Electrical House Wiring",
    category: "House Wiring",
    duration: "2 Months",
    fee: 20000,
    admissionFee: 1000,
    eligibility: "Class 8 Pass or above",
    certificate: "OTTC Residential Wireman Expert Certificate",
    practicalPercentage: 90,
    classTiming: "11:00 AM - 01:00 PM (Midday)",
    image: "/assets/house-wiring.png",
    shortDescription: "Specialized training focused purely on residential building electrical layouts and circuit design.",
    detailedDescription: "This course is a subset of the electrician course, optimized for students wanting to specialize strictly in home wiring. It focuses on residential single-phase systems, blueprint layouts, safe drilling, metal/PVC conduit runs, switchboard wiring, sub-meters installation, and inverter system calculations.",
    syllabus: [
      "Safe handling of hand tools and heavy duty drills",
      "Reading construction wiring blueprints and layout markings",
      "Conduit pipe installation in walls and ceilings (Concealed Wiring)",
      "Wire pulling & core insulation sizing",
      "Switchboard and Power Socket modular wiring",
      "MCB, RCCB, and distribution box connections",
      "Home inverter backup systems & batteries maintenance",
      "Earthing and lightning protection for residential homes"
    ],
    careerOpportunities: [
      "Residential Wireman Specialist",
      "Independent Housing Electrician",
      "Smart Home Automation Installer",
      "Maintenance staff for schools and colleges",
      "Contract-based building wireman"
    ],
    popular: false,
    level: "Beginner"
  },
  {
    id: "electrical-supervisor",
    name: "Electrical Supervisor",
    category: "Electrical Supervisor",
    duration: "4 Months",
    fee: 25000,
    admissionFee: 2500,
    eligibility: "1 year experience in electricity or Intermediate Degree",
    certificate: "OTTC Certified Electrical Supervisor Credentials",
    practicalPercentage: 65,
    classTiming: "04:00 PM - 06:00 PM (Evening Only)",
    image: "/assets/electrical-supervisor.png",
    shortDescription: "Advance your career. Learn industrial panel design, construction estimating, safety auditing, and team leadership.",
    detailedDescription: "For experienced electricians or engineering students looking to transition into supervisor roles. This course focuses on planning electrical systems for major buildings, understanding code regulations, safety checks, calculating cable sizes, sizing transformers, drawing circuit plans, and managing site safety.",
    syllabus: [
      "National Electrical Code (NEC) regulations of Nepal & India",
      "Site safety inspection checklist & audit processes",
      "Designing complex industrial control panels",
      "Estimation of materials and billing for major construction sites",
      "Substations, Transformers, and Generator synchronizations",
      "Sizing cables, busbars, and protection breakers",
      "Drawing layouts using basic CAD software structures",
      "Supervisory leadership, project timelines, and team management"
    ],
    careerOpportunities: [
      "Electrical Site Supervisor",
      "Construction Safety Auditor",
      "Estimation & Billing Specialist",
      "Electrical Store Inventory & Quality Manager",
      "Industrial Panel Fabrication Lead"
    ],
    popular: false,
    level: "Advanced"
  }
];

export const GALLERY_ITEMS = [
  { id: "g1", category: "Electrical Lab", title: "Students installing house wiring board", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" },
  { id: "g2", category: "Mobile Repair", title: "Micro-soldering under microscope", image: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600" },
  { id: "g3", category: "Electronics Lab", title: "SMPS circuit board troubleshooting", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600" },
  { id: "g4", category: "AC Workshop", title: "Split AC installation practice", image: "https://images.unsplash.com/photo-1621905252507-b354bc25eeac?auto=format&fit=crop&q=80&w=600" },
  { id: "g5", category: "Plumbing", title: "PPR hot fusion pipe welding", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=600" },
  { id: "g6", category: "Student Activities", title: "Safety induction batch group", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600" },
  { id: "g7", category: "Electrical Lab", title: "Motor winding practical room", image: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=600" },
  { id: "g8", category: "Student Activities", title: "Certificate distribution ceremony", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" }
];

export const FAQS = [
  {
    question: "How do I apply for a course?",
    answer: "You can apply online by clicking the 'Apply Now' button on any course page and filling out the brief inquiry/registration form, or by interacting with our admissions chatbot. Our team will contact you within 24 hours to schedule your start date."
  },
  {
    question: "Is certification provided upon completion?",
    answer: "Yes, every graduate who completes the practical training requirements and passes the final trade test receives a professional OTTC Vocational Competency Certificate aligned with technical training guidelines in Nepal."
  },
  {
    question: "Are practical classes included, and what is the percentage?",
    answer: "Our core training values dictate that technical skills are learned by doing. Thus, all our engineering/mechanics courses feature 75% to 95% practical hands-on workshop training, using industry-standard tools and equipment."
  },
  {
    question: "Can absolute beginners join these courses?",
    answer: "Absolutely. Most of our training classes (such as Electrician, Plumber, Mobile Repair, and Driving) are structured specifically for beginners. We start from absolute zero, ensuring everyone gets comfortable with safety, tools, and basic science before advancing."
  },
  {
    question: "Is hostel accommodation available for outside students?",
    answer: "While we do not run our own hostel building, we maintain verified partnerships with several safe, affordable student hostels and PG housing units situated within a 5-minute walking distance of Murali Chowk and Vishwakarma Chowk in Janakpur."
  },
  {
    question: "What documents are required for admission?",
    answer: "To finalize your admission at the OTTC office, please bring: 1) A copy of your citizenship ID or national identity card, 2) Two passport-sized photographs, 3) The basic admission fee, and 4) Your completed registration copy."
  }
];

export const API_BASE = (import.meta.env.VITE_API_URL as string) || "";
