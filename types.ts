
export interface Alumnus {
  id: string;
  name: string;
  gradYear: number;
  degree: string;
  industry: string;
  company: string;
  role: string;
  location: string;
  email: string;
  bio: string;
  skills: string[];
  imageUrl: string;
  linkedin: string;
}

export interface Statistics {
  totalAlumni: number;
  employmentRate: number;
  topIndustries: { name: string; value: number }[];
  gradDistribution: { year: number; count: number }[];
}

export type View = 'dashboard' | 'directory' | 'ai-assistant' | 'profile';
