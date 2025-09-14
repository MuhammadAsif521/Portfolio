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
// Api service
export interface Project {
  _id: string;
  title: string;
  type: string;
  status: 'completed' | 'in-progress' | 'planned';
  members: number;
  clientname: string;
  liveUrl?: string;
  codeUrl?: string;
  framework: string[];
  from: string;
  to?: string;
  availibillty: string[];
  availibilltyUrls: string[];
  technologies: string[];
  description: string;
  role: string[];
  keyfeatures: string[];
  Images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  notificationSent: boolean;
  source: 'website' | 'mobile' | 'api';
  timestamp: string | Date; 
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}