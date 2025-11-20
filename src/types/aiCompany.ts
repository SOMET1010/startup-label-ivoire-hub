export interface Milestone {
  year: number;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
  bio: string;
}

export interface Project {
  title: string;
  description: string;
  year: number;
  client: string;
  technologies: string[];
  image: string;
  results: string;
}

export interface Contact {
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface KeyStats {
  revenue?: string;
  growth: string;
  projectsCompleted: number;
}

export interface AICompany {
  id: number;
  name: string;
  logo: string;
  description: string;
  sector: string;
  specialization: string;
  founded: number;
  location: string;
  coordinates: { lat: number; lng: number };
  employees: string;
  website: string;
  isLabeled: boolean;
  services: string[];
  history?: {
    story: string;
    milestones: Milestone[];
  };
  team?: TeamMember[];
  projects?: Project[];
  contact?: Contact;
  certifications?: string[];
  partners?: string[];
  keyStats?: KeyStats;
}
