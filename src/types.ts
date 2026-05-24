export interface StudentInfo {
  name: string;
  age: number | '';
  phone: string;
  email: string;
  school: string;
  gradeLevel: 'Grade 10' | 'Grade 11' | 'Grade 12' | 'University Prep';
  fieldStream: 'Natural Science' | 'Social Science' | 'General';
  targetUniversity: string;
  primaryGoal: string;
  preferredLanguage: 'amh' | 'eng';
  isRegistered: boolean;
  password?: string;
}

export interface University {
  id: string;
  name: string;
  amharicName: string;
  location: string;
  established: string;
  description: string;
  amharicDescription: string;
  worldRank: number;
  nationalRank: number;
  tier: 'VIP Sovereign' | 'Elite Tier-A' | 'Technology Focus';
  departments: string[];
  notableAlumni: string[];
  admissionStats: {
    naturalCutoff: number; // e.g. 380 out of 600 or out of 700
    socialCutoff: number;
    acceptanceRate: string;
  };
  specialFacts: string[];
  bannerGradient: string;
}

export interface MCQQuestion {
  id: string;
  subject: string;
  grade: number;
  question: string;
  questionAmharic?: string;
  options: string[];
  optionsAmharic?: string[];
  answerIndex: number;
  explanation: string;
  explanationAmharic?: string;
  year?: string;
  stream: 'Natural Science' | 'Social Science' | 'Both';
  unitNumber?: number;
  topic?: string;
}

export interface CurriculumUnit {
  id: string;
  subject: string;
  unitNumber: number;
  title: string;
  titleAmharic: string;
  grade: number;
  notes: string;
  notesAmharic: string;
  keyFormulas?: string[];
}

export interface FormulaItem {
  id: string;
  subject: string;
  topic: string;
  name: string;
  formula: string;
  description: string;
}

export interface ExamHistory {
  date: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
}
