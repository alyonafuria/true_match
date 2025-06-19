
export type UserRole = 'job_seeker' | 'employer' | 'verifier';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  responsibilities?: string[];
  qualifications?: string[];
  requiredSkills: string[];
  salaryRange?: string;
  postedDate: string;
  status?: 'open' | 'closed';
  fitPercentage?: number; // For job seeker view
  applicantsCount?: number; // For employer view
}

export interface Application {
  id: string;
  job: Job;
  appliedDate: string;
  status: 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Rejected' | 'Withdrawn';
  fitPercentage: number;
}

export interface ParsedExperience {
  title: string;
  company: string;
  dates: string;
  description?: string;
  verified?: boolean;
}

export interface ParsedEducation {
  degree: string;
  institution: string;
  dates: string;
  verified?: boolean;
}

export interface ParsedInfo {
  contact: string;
  experience: ParsedExperience[];
  education: ParsedEducation[];
}

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  cvUrl?: string;
  parsedInfo: ParsedInfo;
  skills: Array<{ name: string; verified?: boolean }>;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
}

export interface Payment {
  id: string;
  jobPostId: string;
  jobTitle: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
  method?: string;
}

export interface VerificationClaim {
  id: string;
  candidateName: string;
  candidateId: string;
  claimType: 'Experience' | 'Education' | 'Skill';
  details: string; // e.g., "Software Engineer at Google, 2020-2022"
  company?: string; // If applicable for experience
  title?: string; // If applicable for experience
  dates?: string; // If applicable
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
