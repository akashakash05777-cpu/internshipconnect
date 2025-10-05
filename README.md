# InternConnect - React Application

A comprehensive internship management platform built with React, TypeScript, and Vite.

## Features

### 🎓 Student Portal
- **Dashboard**: Overview of applications, progress tracking, and upcoming deadlines
- **Internship Browser**: Search and filter available internships by domain, location, and credits
- **Application Management**: Track application status and history
- **NEP Logbook**: Maintain internship logbook as per NEP guidelines
- **Document Upload**: Upload resume, video, and other required documents

### 👨‍🏫 Staff Portal
- **Application Review**: Approve/reject student internship applications
- **Student Monitoring**: Track student progress and logbook entries
- **Feedback System**: Provide feedback and mark completion
- **Reports**: Generate evaluation reports and analytics

### 🏢 Industry Portal
- **Posting Management**: Create and manage internship postings
- **Application Review**: Review and shortlist student applications
- **Student Assignment**: Assign mentors and track intern progress
- **Evaluation**: Provide feedback and evaluation at internship completion

### ⚙️ Admin Portal
- **User Management**: Manage students, staff, and industry users
- **MoU Management**: Create, track, and manage Memorandums of Understanding
- **Analytics**: Comprehensive platform analytics and reporting
- **System Settings**: Configure platform settings and permissions

### 📋 MoU Module
- **Registry**: List all MoUs with filters (Active, Pending, Expired, Draft)
- **Creation Wizard**: Step-by-step MoU creation with all required details
- **Digital Signatures**: Mock e-signature flow for industry and college
- **Lifecycle Management**: Track MoU status from Draft to Terminated
- **Version History**: Maintain audit trail and version control

## Technology Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom components
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Mock API**: MSW (Mock Service Worker)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interconnect-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login Credentials

The platform includes demo accounts for all user roles. You can use any of these credentials to explore the platform:

#### 🎓 Student Account
- **Email**: `john.doe@student.edu`
- **Password**: `student123`
- **Features**: Apply to internships, track progress, maintain logbook

#### 👨‍🏫 Staff Account  
- **Email**: `sarah.johnson@staff.edu`
- **Password**: `staff123`
- **Features**: Review applications, monitor students, provide feedback

#### 🏢 Industry Account
- **Email**: `hr@techcorp.com`
- **Password**: `industry123`
- **Features**: Create postings, review applications, manage interns

#### ⚙️ Admin Account
- **Email**: `admin@university.edu`
- **Password**: `admin123`
- **Features**: Manage users, MoUs, view analytics

### How to Login

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click on any role card or go to `/login`
3. Use any of the demo credentials above
4. You'll be automatically redirected to the appropriate dashboard

## Project Structure

```
src/
├── pages/                 # Page components organized by role
│   ├── student/          # Student portal pages
│   ├── staff/            # Staff portal pages
│   ├── industry/         # Industry portal pages
│   └── admin/            # Admin portal pages
├── components/           # Reusable components
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   ├── ui/              # UI components
│   ├── auth/            # Authentication components
│   └── providers/       # Context providers
├── contexts/            # React Context providers
├── lib/                 # Utility functions and mock data
├── mocks/               # MSW mock API handlers
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Dark mode support
- Accessible components following WCAG guidelines
- Smooth animations and transitions

### 🔐 Role-Based Access
- Four distinct user roles with appropriate permissions
- Role-based navigation and feature access
- Secure routing and data access

### 📊 Analytics & Reporting
- Interactive charts and graphs
- Real-time statistics and metrics
- Export functionality for reports
- Comprehensive dashboard views

### 📱 Mobile-First Design
- Responsive layout that adapts to all screen sizes
- Touch-friendly interface
- Optimized for mobile devices

### 🌙 Dark Mode
- System preference detection
- Manual theme toggle
- Consistent theming across all components

## Mock Data

The application uses MSW (Mock Service Worker) to provide realistic mock data for:
- User profiles and authentication
- Internship postings and applications
- MoU management and signatures
- Logbook entries and progress tracking
- Notifications and system alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.