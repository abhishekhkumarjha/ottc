import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { DatabaseSync } from "node:sqlite";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite database
const dbPath = process.env.DB_PATH || path.join(process.cwd(), "ottc.db");
const db = new DatabaseSync(dbPath);

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    courseId TEXT NOT NULL,
    contactTime TEXT,
    message TEXT,
    status TEXT DEFAULT 'Pending',
    createdAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    courseId TEXT NOT NULL,
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    batch TEXT,
    createdAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    adminId TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    FOREIGN KEY(adminId) REFERENCES admins(id)
  );
`);

// Migrate legacy JSON data to SQLite tables (if exist)
const INQUIRIES_JSON = path.join(process.cwd(), "inquiries.json");
const REVIEWS_JSON = path.join(process.cwd(), "reviews.json");

function migrateData() {
  // Migrate Inquiries
  if (fs.existsSync(INQUIRIES_JSON)) {
    try {
      const data = fs.readFileSync(INQUIRIES_JSON, "utf-8");
      const inquiries = JSON.parse(data);
      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO inquiries (id, name, phone, email, courseId, contactTime, message, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const inq of inquiries) {
        insertStmt.run(
          inq.id,
          inq.name,
          inq.phone,
          inq.email || "",
          inq.courseId,
          inq.contactTime || "Anytime",
          inq.message || "",
          inq.status || "Pending",
          inq.createdAt || new Date().toISOString()
        );
      }
      console.log(`[Database Migration] Migrated ${inquiries.length} inquiries from JSON to SQLite.`);
      fs.renameSync(INQUIRIES_JSON, path.join(process.cwd(), "inquiries.json.bak"));
    } catch (err) {
      console.error("Failed to migrate inquiries:", err);
    }
  }

  // Migrate Reviews
  if (fs.existsSync(REVIEWS_JSON)) {
    try {
      const data = fs.readFileSync(REVIEWS_JSON, "utf-8");
      const reviews = JSON.parse(data);
      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO reviews (id, name, courseId, rating, text, batch, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const rev of reviews) {
        insertStmt.run(
          rev.id,
          rev.name,
          rev.courseId,
          Number(rev.rating),
          rev.text,
          rev.batch || "Recent Graduate",
          rev.createdAt || new Date().toISOString()
        );
      }
      console.log(`[Database Migration] Migrated ${reviews.length} reviews from JSON to SQLite.`);
      fs.renameSync(REVIEWS_JSON, path.join(process.cwd(), "reviews.json.bak"));
    } catch (err) {
      console.error("Failed to migrate reviews:", err);
    }
  } else {
    // Seed default reviews if reviews table is empty
    const countRow = db.prepare("SELECT count(*) as cnt FROM reviews").get() as any;
    if (countRow.cnt === 0) {
      const initialReviews = [
        {
          id: "rev_1",
          name: "Sanjay Kumar Shah",
          courseId: "electrician",
          rating: 5,
          text: "Completing the Electrician course at OTTC changed my life. Within a month, I got selected for an industrial maintenance team in Doha, Qatar. The practical knowledge we got in the lab was exactly what is used in real factories.",
          batch: "2078 B.S.",
          createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: "rev_2",
          name: "Aarati Kumari Mahato",
          courseId: "mobile-repairing",
          rating: 5,
          text: "As a woman, I was hesitant to join technical training, but the trainers at OTTC were incredibly supportive. I now run my own successful mobile repair center near Shivachowk, Janakpurdham, earning a great independent living.",
          batch: "2080 B.S.",
          createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: "rev_3",
          name: "Ramesh Thapa",
          courseId: "ac-refrigeration",
          rating: 5,
          text: "The AC & Refrigeration course is extremely comprehensive. I learned refrigeration gas charging, copper brazing, and even PCB circuit board testing. I was immediately hired by a major AC dealer in Kathmandu.",
          batch: "2079 B.S.",
          createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
        }
      ];
      const insertStmt = db.prepare(`
        INSERT INTO reviews (id, name, courseId, rating, text, batch, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const rev of initialReviews) {
        insertStmt.run(rev.id, rev.name, rev.courseId, rev.rating, rev.text, rev.batch, rev.createdAt);
      }
      console.log("[Database Seeding] Seeded initial reviews.");
    }
  }
}

// Seed admin user
function seedAdmin() {
  const countRow = db.prepare("SELECT count(*) as cnt FROM admins").get() as any;
  if (countRow.cnt === 0) {
    const adminId = "admin_" + Date.now().toString(36);
    const username = "admin";
    const password = "ottc123";
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    db.prepare(`
      INSERT INTO admins (id, username, passwordHash, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(adminId, username, hash, new Date().toISOString());
    console.log(`[Database Seeding] Admin account created. Username: ${username}, Password: ${password}`);
  }
}

migrateData();
seedAdmin();

// Admin Authentication Middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No session token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token) as any;

    if (!session) {
      return res.status(401).json({ error: "Access denied. Invalid session token." });
    }

    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
      return res.status(401).json({ error: "Access denied. Session expired." });
    }

    (req as any).adminId = session.adminId;
    next();
  } catch (err: any) {
    return res.status(500).json({ error: "Authentication check failed internally." });
  }
}



// Lazy initializer for Gemini client
let geminiClient: any = null;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to rule-based chatbot responses.");
      return null;
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Core training center data for AI prompt grounding
const INSTITUTION_PROMPT_GUIDELINES = `
You are the Virtual Admission Counselor and AI Assistant for Onida Technical Training Centre (OTTC), located in Janakpurdham-8, near Murali Chowk (on the road toward Vishwakarma Chowk), Janakpur, Nepal.
Established in 2050 B.S., OTTC has over 30 years of excellence in providing practical technical and vocational skills.

CORE FEATURES & STRENGTHS:
- 30+ Years of Experience in training technical professionals.
- Over 5000+ students trained successfully.
- 75% to 95% Practical training in fully-equipped modern workshops.
- Industry standard equipment and experienced technical trainers.
- Certification provided after successful completion of trade tests.
- Small batch sizes for dedicated individual focus.
- High success rate for students seeking jobs in Nepal and Gulf countries (Saudi Arabia, Qatar, UAE, Oman, etc.) or starting independent businesses.

COURSE CATALOG DETAILS:
1. Electrician Course (Popular)
   - Duration: 3 Months
   - Fee: Tuition Rs. 15,000 (Admission Fee: Rs. 2,000 extra)
   - Eligibility: Class 8 Pass or above
   - Practical: 80% practical classes
   - Timings: 07:00 AM - 09:00 AM (Morning) or 11:00 AM - 01:00 PM (Midday)
   - Syllabus: Tool safety, domestic wiring, industrial panels, single & three-phase motors, grounding (earthing), and repairs.
   - Careers: House electrician, industrial technician, Gulf operator.

2. Mobile Repairing Course (Popular)
   - Duration: 3 Months
   - Fee: Tuition Rs. 20,000 (Admission Fee: Rs. 1,500 extra)
   - Eligibility: Class 8 Pass or above
   - Practical: 85% practical classes
   - Timings: 10:00 AM - 12:00 PM or 02:00 PM - 04:00 PM
   - Syllabus: Electronic PCB diagnostics, micro-soldering, IC reballing, screen lamination, Android and iPhone hardware/software flashing.
   - Careers: Smartphone technician, shop owner.

3. AC & Refrigeration Course (HVAC - Popular)
   - Duration: 3 Months
   - Fee: Tuition Rs. 20,000 (Admission Fee: Rs. 2,500 extra)
   - Eligibility: Class 10 Pass preferred
   - Practical: 75% practical classes
   - Timings: 08:00 AM - 10:00 AM or 03:00 PM - 05:00 PM
   - Syllabus: Heat cycle, copper tube brazing, gas charging (R22, R134a, R410a), leak tests, installation, control board PCB diagnostics.
   - Careers: AC technician, commercial maintenance, extreme high-demand Gulf careers.

4. Electronics Repairing Course
   - Duration: 3 Months
   - Fee: Tuition Rs. 50,000 (Admission Fee: Rs. 2,000 extra)
   - Eligibility: Class 8 Pass or above
   - Practical: 80% practical classes
   - Timings: 01:00 PM - 03:00 PM
   - Syllabus: Circuit schematics, active/passive components, power supplies (SMPS), inverter & UPS systems, LED/Smart TV board repair.
   - Careers: Bench technician, inverter specialist, home appliance repairing.

5. Professional Plumbing Course
   - Duration: 2 Months
   - Fee: Tuition Rs. 18,000 (Admission Fee: Rs. 1,000 extra)
   - Eligibility: Literate (basic reading/writing)
   - Practical: 90% practical classes
   - Timings: 07:00 AM - 09:00 AM (Morning)
   - Syllabus: Jointing methods, copper/PPR hot fusion, water tanks/pump alignments, sewer drainage, sanitary fixtures (commode, washbasin).
   - Careers: Plumbing contractor, building plumber.

6. Vehicle Driving & Maintenance (Popular)
   - Duration: 1 Month
   - Fee: Tuition Rs. 22,000 (Admission Fee: Rs. 1,000 extra)
   - Eligibility: Age 18+ and physically fit
   - Practical: 95% practical hours
   - Timings: Flexible hourly slots between 06:00 AM and 05:00 PM
   - Syllabus: Steering control, slope trials, reverse parking, Nepalese traffic signs, engine maintenance (oil, battery, coolant), tire replacement.
   - Careers: Professional driver, tourism cab operator, fleet technician.

7. Electrical House Wiring Course
   - Duration: 2 Months
   - Fee: Tuition Rs. 20,000 (Admission Fee: Rs. 1,000 extra)
   - Eligibility: Class 8 Pass or above
   - Practical: 90% practical classes
   - Timings: 11:00 AM - 01:00 PM
   - Syllabus: Focuses specifically on house wiring, conduit laying, wire pulling, switchboard planning, sub-meter circuits, and emergency backups.
   - Careers: Domestic wireman, residential contract installer.

8. Electrical Supervisor Course
   - Duration: 4 Months
   - Fee: Tuition Rs. 25,000 (Admission Fee: Rs. 2,500 extra)
   - Eligibility: 1 year experience in electricity or Intermediate degree
   - Practical: 65% practical classes
   - Timings: 04:00 PM - 06:00 PM (Evening)
   - Syllabus: National Electrical Code guidelines, load calculations, 3-phase estimations, industrial transformer alignments, safety audits.
   - Careers: Site supervisor, safety auditor, materials estimator.

ADMISSION GUIDANCE & PROCESS:
Explain these steps when asked how to enroll:
1. Choose a course from our catalog.
2. Fill out our online inquiry form (you can do this right now in our chat or on our website).
3. Submit your details.
4. Our admission officer will phone you.
5. Visit the OTTC campus near Murali Chowk to review labs.
6. Bring required documents (Citizenship/ID, 2 photos) and pay the basic admission fee.
7. Start your training batch.

REQUIRED DOCUMENTS:
- Citizenship card copy, Passport-size photographs (2 copies), Contact number, and basic personal information.

LOCATION & CONTACT:
- Address: Janakpurdham-8, near Murali Chowk, on the road toward Vishwakarma Chowk, Dhanusha, Nepal.
- Opening Hours: Sunday to Friday, 6:00 AM - 6:00 PM. (Closed on Saturdays).
- Phone: +977-41-523123, +977-9854023456 (Mobile & WhatsApp support)
- Email: admissions@onidatechnical.edu.np

CHATBOT INSTRUCTIONS:
1. Be warm, polite, professional, and clear. Speak with authority as OTTC's counselor.
2. If the user asks about course recommendations for Gulf jobs, recommend: Electrician, AC & Refrigeration, and Electrical Supervisor as they have immense salary and hiring rates in the Middle East.
3. If asked to compare courses (e.g. Mobile Repair vs Electronics), compare their fees, durations (both 3 months), depth of software vs hardware, and job focus.
4. Keep answers brief, scannable, and formatted in neat Markdown with bullets where helpful.
5. If you do not know something or cannot answer confidently, say exactly:
   "I don't have enough information to answer that accurately. Would you like me to connect you with our admission team? Please leave your name and phone number, and we'll contact you shortly."
`;

// API: Admin Authentication Router
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    if (admin.passwordHash !== hash) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours expiry

    db.prepare("INSERT INTO sessions (token, adminId, expiresAt) VALUES (?, ?, ?)")
      .run(token, admin.id, expiresAt);

    res.json({ token, username: admin.username });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to process login." });
  }
});

app.post("/api/admin/logout", requireAdminAuth, (req, res) => {
  const authHeader = req.headers.authorization!;
  const token = authHeader.split(" ")[1];
  try {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to logout session." });
  }
});

app.get("/api/admin/check-session", requireAdminAuth, (req, res) => {
  const adminId = (req as any).adminId;
  try {
    const admin = db.prepare("SELECT username FROM admins WHERE id = ?").get(adminId) as any;
    res.json({ valid: true, username: admin?.username });
  } catch (err: any) {
    res.status(500).json({ error: "Session validation failed." });
  }
});

// API: Student Inquiries Handlers
app.get("/api/inquiries", requireAdminAuth, (req, res) => {
  try {
    const list = db.prepare("SELECT * FROM inquiries ORDER BY createdAt DESC").all();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to retrieve inquiries." });
  }
});

app.post("/api/inquiries", (req, res) => {
  const { name, phone, email, courseId, contactTime, message } = req.body;
  
  if (!name || !phone || !courseId) {
    return res.status(400).json({ error: "Name, phone, and course selection are required fields." });
  }

  try {
    const newInquiry = {
      id: "inq_" + Date.now().toString(36),
      name,
      phone,
      email: email || "",
      courseId,
      contactTime: contactTime || "Anytime",
      message: message || "No extra message provided.",
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    db.prepare(`
      INSERT INTO inquiries (id, name, phone, email, courseId, contactTime, message, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newInquiry.id,
      newInquiry.name,
      newInquiry.phone,
      newInquiry.email,
      newInquiry.courseId,
      newInquiry.contactTime,
      newInquiry.message,
      newInquiry.status,
      newInquiry.createdAt
    );

    res.status(201).json(newInquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to submit inquiry." });
  }
});

app.put("/api/inquiries/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status value is required." });
  }

  try {
    const stmt = db.prepare("UPDATE inquiries SET status = ? WHERE id = ?");
    const info = stmt.run(status, id) as any;

    if (info.changes === 0) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    const updated = db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update inquiry." });
  }
});

app.delete("/api/inquiries/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare("DELETE FROM inquiries WHERE id = ?");
    const info = stmt.run(id) as any;

    if (info.changes === 0) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    res.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete inquiry." });
  }
});

// API: Student Reviews & Feedback Handlers
app.get("/api/reviews", (req, res) => {
  try {
    const list = db.prepare("SELECT * FROM reviews ORDER BY createdAt DESC").all();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to retrieve reviews." });
  }
});

app.post("/api/reviews", (req, res) => {
  const { name, rating, text, courseId, batch } = req.body;

  if (!name || !rating || !text || !courseId) {
    return res.status(400).json({ error: "Name, rating, course selection, and review text are required fields." });
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: "Rating must be a number between 1 and 5." });
  }

  try {
    const newReview = {
      id: "rev_" + Date.now().toString(36),
      name,
      courseId,
      rating: numericRating,
      text,
      batch: batch || "Recent Graduate",
      createdAt: new Date().toISOString()
    };

    db.prepare(`
      INSERT INTO reviews (id, name, courseId, rating, text, batch, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newReview.id,
      newReview.name,
      newReview.courseId,
      newReview.rating,
      newReview.text,
      newReview.batch,
      newReview.createdAt
    );

    res.status(201).json(newReview);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to submit review." });
  }
});

app.delete("/api/reviews/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare("DELETE FROM reviews WHERE id = ?");
    const info = stmt.run(id) as any;

    if (info.changes === 0) {
      return res.status(404).json({ error: "Review not found." });
    }

    res.json({ success: true, message: "Review deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete review." });
  }
});


// API: Chatbot AI Router
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const client = getGeminiClient();

  // Rule-based offline backup if API Key is not set or client fails
  if (!client) {
    const reply = getFallbackResponse(message);
    return res.json({ text: reply });
  }

  try {
    // Format conversation history for Gemini API
    // Gemini 3.5-flash format expects string contents or structured conversation context.
    const formattedHistory = (history || []).map((msg: any) => {
      return {
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      };
    });

    // Add current user message
    formattedHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Use generateContent with system instruction
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: INSTITUTION_PROMPT_GUIDELINES,
        temperature: 0.7,
      },
    });

    const botText = response.text || "I am here to help. Could you repeat that, please?";
    return res.json({ text: botText });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    // Fall back to offline router on transient errors too
    const fallbackText = getFallbackResponse(message);
    return res.json({ text: fallbackText });
  }
});

// Simple regex matching for offline backup
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  if (/\b(hi|hello|namaste)\b/.test(msg)) {
    return `Namaste! Welcome to Onida Technical Training Centre (OTTC), Janakpur. I am your Virtual Admissions Assistant. How can I help you today? You can ask about our courses, fees, durations, location, or request to submit an admission inquiry.`;
  }
  if (msg.includes("fee") || msg.includes("price") || msg.includes("cost") || msg.includes("much")) {
    return `We offer several highly affordable practical training courses at OTTC Janakpur:
- **AC & Refrigeration**: Rs. 20,000 (3 Months)
- **Electrical Supervisor**: Rs. 25,000 (4 Months)
- **Electrician**: Rs. 15,000 (3 Months)
- **Electronics Repairing**: Rs. 50,000 (3 Months)
- **Mobile Repairing**: Rs. 20,000 (3 Months)
- **Professional Plumbing**: Rs. 18,000 (2 Months)
- **Electrical House Wiring**: Rs. 20,000 (2 Months)
- **Vehicle Driving**: Rs. 22,000 (1 Month)

*Please note: Each course has a small additional admission fee ranging from Rs. 1,000 to Rs. 2,500.* You can fill the inquiry form right here to enroll!`;
  }
  if (msg.includes("where") || msg.includes("location") || msg.includes("locate") || msg.includes("address") || msg.includes("map")) {
    return `We are conveniently located in **Janakpurdham-8, near Murali Chowk**, on the road leading towards Vishwakarma Chowk, Dhanusha, Nepal. You can visit us Sunday to Friday, from 6:00 AM to 6:00 PM. We are closed on Saturdays. Call us at +977-41-523123 or WhatsApp +977-9854023456!`;
  }
  if (msg.includes("phone") || msg.includes("contact") || msg.includes("call") || msg.includes("number") || msg.includes("whatsapp")) {
    return `You can reach Onida Technical Training Centre (OTTC) via:
- **Phone**: +977-41-523123
- **Mobile/WhatsApp**: +977-9854023456
- **Email**: admissions@onidatechnical.edu.np
- **Address**: Near Murali Chowk, Janakpurdham-8, Nepal.

Would you like to leave your name and phone number so our representative can call you directly?`;
  }
  if (msg.includes("apply") || msg.includes("admission") || msg.includes("enroll") || msg.includes("join") || msg.includes("process") || msg.includes("register")) {
    return `Enrolling is simple:
1. Choose a technical course (e.g., Electrician, Mobile Repair, AC Tech).
2. Click **Apply Now** on our Course Catalog, or leave your details in this chat.
3. Our staff will call you to confirm your batch.
4. Visit the center near Murali Chowk with your Citizenship/ID copy and 2 passport photos to lock in your seat!`;
  }
  if (msg.includes("wiring") || msg.includes("electrician") || msg.includes("electricity") || msg.includes("supervisor")) {
    return `We have outstanding electrical courses!
- **Electrician (3 Months)**: Comprehensive house & industrial setups (Fee: Rs. 15,000).
- **Electrical House Wiring (2 Months)**: Focused purely on building cabling layouts (Fee: Rs. 20,000).
- **Electrical Supervisor (4 Months)**: Industrial panel designing & estimations for experienced students (Fee: Rs. 25,000).

All setups are 80-90% hands-on in our labs. Which one interests you?`;
  }
  if (msg.includes("mobile") || msg.includes("phone repair") || msg.includes("iphone") || msg.includes("android")) {
    return `Our **Mobile Repairing course** is a 3-month high-impact program costing Rs. 20,000. It covers electronics basics, micro-soldering, chip reballing, screen repairs, and flashing firmware for Android & iPhone. 85% of classes are hands-on work with real devices!`;
  }
  if (msg.includes("gulf") || msg.includes("abroad") || msg.includes("job") || msg.includes("dubai") || msg.includes("saudi") || msg.includes("qatar")) {
    return `For students seeking high-paying technical jobs in Gulf countries like Qatar, Saudi Arabia, and UAE, we highly recommend:
1. **AC & Refrigeration (HVAC)**: Extremely high demand and high salaries.
2. **Electrician**: Industrial cable and panel routing operators are heavily recruited.
3. **Electrical Supervisor**: Perfect if you already have some background.
4. **Professional Plumbing**: Constantly hired on large housing developments.

We provide a globally recognized OTTC vocational certificate that simplifies trade visa clearances!`;
  }

  return `I don't have enough information to answer that accurately. Would you like me to connect you with our admission team? Please leave your name and phone number, and we'll contact you shortly. You can also use the "Apply Now" button on the course cards!`;
}

// Full-stack Vite server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OTTC Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
