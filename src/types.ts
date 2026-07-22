export interface Course {
  id: string;
  name: string;
  category: string;
  duration: string;
  fee: number;
  admissionFee: number;
  eligibility: string;
  certificate: string;
  practicalPercentage: number;
  classTiming: string;
  image: string;
  shortDescription: string;
  detailedDescription: string;
  syllabus: string[];
  careerOpportunities: string[];
  popular: boolean;
  level: "Beginner" | "Advanced";
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  courseId: string;
  contactTime: string;
  message: string;
  status: "Pending" | "Contacted" | "Completed";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isLeadForm?: boolean;
}

export interface Review {
  id: string;
  name: string;
  courseId: string;
  rating: number;
  text: string;
  batch: string;
  createdAt: string;
}

