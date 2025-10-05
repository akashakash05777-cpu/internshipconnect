import { 
  User, 
  Student, 
  Staff, 
  Industry, 
  Admin, 
  Internship, 
  Application, 
  LogbookEntry, 
  MoU, 
  Notification,
  DashboardStats,
  Evaluation,
  PerformanceMetric,
  Feedback,
  StudentProgress,
  Milestone
} from '@/types';

// Mock Users
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@student.edu',
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science',
    year: 3,
    cgpa: 8.5,
    skills: ['React', 'Node.js', 'Python', 'MongoDB'],
    documents: ['resume.pdf', 'transcript.pdf'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    role: 'student',
    studentId: 'STU002',
    department: 'Information Technology',
    year: 2,
    cgpa: 9.2,
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    documents: ['resume.pdf'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const mockStaff: Staff[] = [
  {
    id: '3',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@staff.edu',
    role: 'staff',
    employeeId: 'EMP001',
    department: 'Computer Science',
    designation: 'Professor',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@staff.edu',
    role: 'staff',
    employeeId: 'EMP002',
    department: 'Information Technology',
    designation: 'Associate Professor',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const mockIndustry: Industry[] = [
  {
    id: '5',
    name: 'TechCorp Solutions',
    email: 'hr@techcorp.com',
    role: 'industry',
    companyName: 'TechCorp Solutions',
    industry: 'Technology',
    website: 'https://techcorp.com',
    address: '123 Tech Street, Silicon Valley, CA',
    contactPerson: 'Alice Johnson',
    phone: '+1-555-0123',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '6',
    name: 'DataFlow Inc',
    email: 'internships@dataflow.com',
    role: 'industry',
    companyName: 'DataFlow Inc',
    industry: 'Data Analytics',
    website: 'https://dataflow.com',
    address: '456 Data Avenue, New York, NY',
    contactPerson: 'Bob Wilson',
    phone: '+1-555-0456',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const mockAdmin: Admin[] = [
  {
    id: '7',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    permissions: ['manage_users', 'manage_mous', 'view_analytics'],
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Internships
export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    description: 'Work on React-based web applications and learn modern frontend development practices.',
    company: 'TechCorp Solutions',
    domain: 'Web Development',
    location: 'Remote',
    duration: 12,
    credits: 4,
    skills: ['React', 'TypeScript', 'CSS', 'Git'],
    requirements: ['Basic knowledge of JavaScript', 'Understanding of web development concepts'],
    mentor: {
      name: 'Alice Johnson',
      email: 'alice@techcorp.com',
      designation: 'Senior Frontend Developer',
    },
    status: 'active',
    mouId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Data Science Intern',
    description: 'Analyze large datasets and build machine learning models for business insights.',
    company: 'DataFlow Inc',
    domain: 'Data Science',
    location: 'Onsite',
    duration: 16,
    credits: 6,
    skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
    requirements: ['Python programming', 'Statistics knowledge', 'SQL basics'],
    mentor: {
      name: 'Bob Wilson',
      email: 'bob@dataflow.com',
      designation: 'Lead Data Scientist',
    },
    status: 'active',
    mouId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: '1',
    studentId: '1',
    internshipId: '1',
    status: 'ongoing',
    appliedAt: new Date('2024-01-10'),
    shortlistedAt: new Date('2024-01-15'),
    startedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    studentId: '2',
    internshipId: '2',
    status: 'applied',
    appliedAt: new Date('2024-01-12'),
  },
];

// Mock Logbook Entries
export const mockLogbookEntries: LogbookEntry[] = [
  {
    id: '1',
    applicationId: '1',
    date: new Date('2024-01-22'),
    hours: 8,
    description: 'Set up development environment and reviewed project requirements. Started working on the main dashboard component.',
    skillsLearned: ['React Hooks', 'TypeScript interfaces'],
    challenges: 'Understanding the existing codebase structure',
    nextWeekPlan: 'Complete the dashboard layout and implement user authentication',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '2',
    applicationId: '1',
    date: new Date('2024-01-29'),
    hours: 8,
    description: 'Implemented user authentication and started working on the profile management feature.',
    skillsLearned: ['JWT authentication', 'Context API'],
    challenges: 'Integrating with the backend API',
    nextWeekPlan: 'Complete profile management and start on internship application module',
    createdAt: new Date('2024-01-29'),
  },
];

// Mock MoUs
export const mockMous: MoU[] = [
  {
    id: '1',
    title: 'TechCorp Solutions - Web Development Internship Program',
    companyName: 'TechCorp Solutions',
    scopeOfWork: 'Frontend and backend web development internships for computer science students',
    internshipType: 'remote',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    credits: 4,
    mentorDetails: {
      name: 'Alice Johnson',
      email: 'alice@techcorp.com',
      designation: 'Senior Frontend Developer',
      phone: '+1-555-0123',
    },
    slots: 10,
    status: 'active',
    pdfUrl: '/mous/mou-techcorp-2024.pdf',
    signatures: {
      industry: {
        signed: true,
        signedAt: new Date('2023-12-15'),
        signedBy: 'Alice Johnson',
      },
      college: {
        signed: true,
        signedAt: new Date('2023-12-20'),
        signedBy: 'Dr. Sarah Johnson',
      },
    },
    version: 1,
    versionHistory: [
      {
        version: 1,
        changes: 'Initial MoU creation',
        updatedBy: 'Dr. Sarah Johnson',
        updatedAt: new Date('2023-12-15'),
      },
    ],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: '2',
    title: 'DataFlow Inc - Data Science Internship Program',
    companyName: 'DataFlow Inc',
    scopeOfWork: 'Data science and analytics internships for IT and CS students',
    internshipType: 'onsite',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    credits: 6,
    mentorDetails: {
      name: 'Bob Wilson',
      email: 'bob@dataflow.com',
      designation: 'Lead Data Scientist',
      phone: '+1-555-0456',
    },
    slots: 5,
    status: 'active',
    pdfUrl: '/mous/mou-dataflow-2024.pdf',
    signatures: {
      industry: {
        signed: true,
        signedAt: new Date('2023-12-10'),
        signedBy: 'Bob Wilson',
      },
      college: {
        signed: true,
        signedAt: new Date('2023-12-18'),
        signedBy: 'Prof. Michael Brown',
      },
    },
    version: 1,
    versionHistory: [
      {
        version: 1,
        changes: 'Initial MoU creation',
        updatedBy: 'Prof. Michael Brown',
        updatedAt: new Date('2023-12-10'),
      },
    ],
    createdAt: new Date('2023-12-10'),
    updatedAt: new Date('2023-12-18'),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Application Shortlisted',
    message: 'Your application for Frontend Developer Intern at TechCorp Solutions has been shortlisted.',
    type: 'success',
    read: false,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '1',
    title: 'Logbook Reminder',
    message: 'Please submit your weekly logbook entry for the ongoing internship.',
    type: 'warning',
    read: false,
    createdAt: new Date('2024-01-28'),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalInternships: 15,
  activeApplications: 8,
  completedInternships: 12,
  totalCredits: 48,
  activeMous: 3,
  pendingApplications: 5,
};

// Helper function to get user by role
export const getUsersByRole = (role: string) => {
  switch (role) {
    case 'student':
      return mockStudents;
    case 'staff':
      return mockStaff;
    case 'industry':
      return mockIndustry;
    case 'admin':
      return mockAdmin;
    default:
      return [];
  }
};

// Mock Evaluations
export const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    applicationId: '1',
    studentId: '1',
    internshipId: '1',
    evaluatorId: '5',
    evaluationType: 'midterm',
    evaluationDate: new Date('2024-02-15'),
    technicalSkills: {
      score: 8,
      comments: 'Strong understanding of React concepts and good coding practices.'
    },
    communicationSkills: {
      score: 7,
      comments: 'Good communication but could be more proactive in asking questions.'
    },
    problemSolving: {
      score: 8,
      comments: 'Excellent problem-solving approach and debugging skills.'
    },
    teamwork: {
      score: 9,
      comments: 'Great team player, always willing to help colleagues.'
    },
    punctuality: {
      score: 9,
      comments: 'Always on time and meets deadlines consistently.'
    },
    overallRating: 8.2,
    strengths: ['Technical skills', 'Teamwork', 'Punctuality'],
    areasForImprovement: ['Communication', 'Proactive questioning'],
    recommendations: 'Continue current trajectory, focus on improving communication skills.',
    isRecommended: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    applicationId: '1',
    studentId: '1',
    internshipId: '1',
    evaluatorId: '5',
    evaluationType: 'final',
    evaluationDate: new Date('2024-03-15'),
    technicalSkills: {
      score: 9,
      comments: 'Significant improvement in technical skills, now leading complex features.'
    },
    communicationSkills: {
      score: 8,
      comments: 'Much more confident in communication and asking questions.'
    },
    problemSolving: {
      score: 9,
      comments: 'Excellent problem-solving skills, can handle complex challenges independently.'
    },
    teamwork: {
      score: 9,
      comments: 'Outstanding team player and mentor to other interns.'
    },
    punctuality: {
      score: 10,
      comments: 'Perfect attendance and always exceeds expectations on deadlines.'
    },
    overallRating: 9.0,
    strengths: ['Technical expertise', 'Leadership', 'Mentoring', 'Reliability'],
    areasForImprovement: [],
    recommendations: 'Highly recommend for full-time position. Exceptional intern.',
    isRecommended: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
];

// Mock Performance Metrics
export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: '1',
    applicationId: '1',
    studentId: '1',
    metricType: 'attendance',
    value: 95,
    maxValue: 100,
    description: 'Attendance percentage for the month',
    recordedAt: new Date('2024-02-01'),
    recordedBy: '5',
  },
  {
    id: '2',
    applicationId: '1',
    studentId: '1',
    metricType: 'task_completion',
    value: 12,
    maxValue: 15,
    description: 'Tasks completed this month',
    recordedAt: new Date('2024-02-01'),
    recordedBy: '5',
  },
  {
    id: '3',
    applicationId: '1',
    studentId: '1',
    metricType: 'quality',
    value: 8.5,
    maxValue: 10,
    description: 'Average quality score for completed tasks',
    recordedAt: new Date('2024-02-01'),
    recordedBy: '5',
  },
];

// Mock Feedback
export const mockFeedback: Feedback[] = [
  {
    id: '1',
    applicationId: '1',
    studentId: '1',
    fromUserId: '5',
    toUserId: '1',
    type: 'praise',
    title: 'Excellent work on the dashboard feature',
    message: 'Great job implementing the dashboard with clean code and good user experience. Keep up the excellent work!',
    isPublic: true,
    priority: 'medium',
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '2',
    applicationId: '1',
    studentId: '1',
    fromUserId: '5',
    toUserId: '1',
    type: 'suggestion',
    title: 'Consider using TypeScript interfaces',
    message: 'For better code maintainability, consider defining TypeScript interfaces for your data structures.',
    isPublic: true,
    priority: 'low',
    status: 'active',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
  },
];

// Mock Student Progress
export const mockStudentProgress: StudentProgress[] = [
  {
    id: '1',
    applicationId: '1',
    studentId: '1',
    internshipId: '1',
    currentWeek: 8,
    totalWeeks: 12,
    completionPercentage: 67,
    tasksCompleted: 24,
    totalTasks: 36,
    hoursLogged: 320,
    expectedHours: 480,
    lastActivity: new Date('2024-02-28'),
    milestones: [
      {
        id: '1',
        title: 'Complete onboarding',
        description: 'Complete company onboarding and setup development environment',
        targetDate: new Date('2024-01-25'),
        completedDate: new Date('2024-01-23'),
        status: 'completed',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Build authentication system',
        description: 'Implement user authentication and authorization',
        targetDate: new Date('2024-02-15'),
        completedDate: new Date('2024-02-12'),
        status: 'completed',
        priority: 'high',
      },
      {
        id: '3',
        title: 'Complete dashboard module',
        description: 'Build the main dashboard with all required features',
        targetDate: new Date('2024-03-01'),
        status: 'in_progress',
        priority: 'high',
      },
      {
        id: '4',
        title: 'Implement reporting features',
        description: 'Add comprehensive reporting and analytics features',
        targetDate: new Date('2024-03-15'),
        status: 'pending',
        priority: 'medium',
      },
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-28'),
  },
];

// Helper function to get current user (mock authentication)
export const getCurrentUser = (): User => {
  // In a real app, this would come from authentication context
  return mockStudents[0];
};


