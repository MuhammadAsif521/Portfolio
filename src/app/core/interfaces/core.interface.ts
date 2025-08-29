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
// projects-page interfaces
export interface Project {
  title: string;
  description: string;
  features: string[];
  tags: string[];
  category: 'mobile' | 'web' | 'backend' | 'fullstack';
  categoryIcon: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  status: 'completed' | 'ongoing' | 'planning';
  date: string;
}