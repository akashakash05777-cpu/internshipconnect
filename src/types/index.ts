export type UserRole = 'student' | 'staff' | 'industry' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  department: string;
  year: number;
  cgpa: number;
  skills: string[];
  resume?: string;
  video?: string;
  documents: string[];
}

export interface Staff extends User {
  role: 'staff';
  employeeId: string;
  department: string;
  designation: string;
}

export interface Industry extends User {
  role: 'industry';
  companyName: string;
  industry: string;
  website?: string;
  address: string;
  contactPerson: string;
  phone: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Internship {
  id: string;
  title: string;
  description: string;
  company: string;
  domain: string;
  location: string;
  duration: number; // in weeks
  credits: number;
  skills: string[];
  requirements: string[];
  mentor: {
    name: string;
    email: string;
    designation: string;
  };
  status: 'active' | 'inactive' | 'closed';
  mouId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'ongoing' | 'completed';
  appliedAt: Date;
  shortlistedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  feedback?: string;
  rating?: number;
  coverLetter?: string;
}

export interface LogbookEntry {
  id: string;
  applicationId: string;
  date: Date;
  hours: number;
  description: string;
  skillsLearned: string[];
  challenges: string;
  nextWeekPlan: string;
  createdAt: Date;
}

export interface MoU {
  id: string;
  title: string;
  companyName: string;
  scopeOfWork: string;
  internshipType: 'onsite' | 'remote' | 'hybrid';
  startDate: Date;
  endDate: Date;
  credits: number;
  mentorDetails: {
    name: string;
    email: string;
    designation: string;
    phone: string;
  };
  slots: number;
  status: 'draft' | 'pending_signatures' | 'active' | 'expiring' | 'terminated';
  pdfUrl?: string;
  signatures: {
    industry: {
      signed: boolean;
      signedAt?: Date;
      signedBy?: string;
    };
    college: {
      signed: boolean;
      signedAt?: Date;
      signedBy?: string;
    };
  };
  version: number;
  versionHistory: MoUVersion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MoUVersion {
  version: number;
  changes: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalInternships: number;
  activeApplications: number;
  completedInternships: number;
  totalCredits: number;
  activeMous: number;
  pendingApplications: number;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  studentId: string;
  internshipId: string;
  evaluatorId: string; // Industry user ID
  evaluationType: 'midterm' | 'final' | 'weekly' | 'monthly';
  evaluationDate: Date;
  technicalSkills: {
    score: number; // 1-10
    comments: string;
  };
  communicationSkills: {
    score: number; // 1-10
    comments: string;
  };
  problemSolving: {
    score: number; // 1-10
    comments: string;
  };
  teamwork: {
    score: number; // 1-10
    comments: string;
  };
  punctuality: {
    score: number; // 1-10
    comments: string;
  };
  overallRating: number; // 1-10
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string;
  isRecommended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceMetric {
  id: string;
  applicationId: string;
  studentId: string;
  metricType: 'attendance' | 'task_completion' | 'quality' | 'initiative' | 'learning';
  value: number;
  maxValue: number;
  description: string;
  recordedAt: Date;
  recordedBy: string;
}

export interface Feedback {
  id: string;
  applicationId: string;
  studentId: string;
  fromUserId: string;
  toUserId: string;
  type: 'praise' | 'suggestion' | 'concern' | 'general';
  title: string;
  message: string;
  isPublic: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  id: string;
  applicationId: string;
  studentId: string;
  internshipId: string;
  currentWeek: number;
  totalWeeks: number;
  completionPercentage: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursLogged: number;
  expectedHours: number;
  lastActivity: Date;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}


