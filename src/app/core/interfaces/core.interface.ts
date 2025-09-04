import { Timestamp } from "@angular/fire/firestore";

// skills-page interfaces
export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
  level: number;
}

export interface Tool {
  name: string;
  icon: string;
}
// about-page interfaces
export interface Certification {
  title: string;
  issuer: string;
  year: string;
  icon: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface TimelineItem {
  title: string;
  date: string;
  description: string;
}
// footer-component interfaces
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
// firebase service
export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin';
}

export interface Projects {
  id: string;
  title: string;
  type: string;
  status: string;
  members: number;
  clientname:string;
  liveUrl?: string;
  codeUrl?: string;
  framework: string[];
  from: string;
  to?: string;
  availibillty: string[];
  'availibillty-urls': string[];
  technologies: string[];
  description: string;
  role: string[];
  keyfeatures: string[];
  Images: string[]; // URLs of the uploaded images
  createdAt: Date | Timestamp | null;
  updatedAt: Date | Timestamp | null;
}

export interface Message {
  id: string; // The Firestore document ID
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  timestamp: Date;
}