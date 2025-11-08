export interface PersonalInfo {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
  gpa?: string;
  honors?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  role?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface GeneratedCV {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
}

export interface CVMetadata {
  model: string;
  generatedAt: Date;
  enhancedAt?: Date;
  optimizedAt?: Date;
  targetRole?: string;
  targetIndustry?: string;
  focusAreas?: string[];
  version?: number;
}

export interface AIResponse {
  content: GeneratedCV | any;
  metadata: CVMetadata;
}

