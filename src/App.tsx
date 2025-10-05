import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Import pages
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';

// Student pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentInternships from '@/pages/student/Internships';
import StudentApplications from '@/pages/student/Applications';
import StudentLogbook from '@/pages/student/Logbook';

// Staff pages
import StaffDashboard from '@/pages/staff/Dashboard';

// Industry pages
import IndustryDashboard from '@/pages/industry/Dashboard';
import IndustryApplications from '@/pages/industry/Applications';
import IndustryEvaluations from '@/pages/industry/Evaluations';
import IndustryFeedback from '@/pages/industry/Feedback';
import IndustryMous from '@/pages/industry/Mous';
import IndustryPostings from '@/pages/industry/Postings';
import IndustryStudents from '@/pages/industry/Students';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminAnalytics from '@/pages/admin/Analytics';
import AdminApplications from '@/pages/admin/Applications';
import AdminInternships from '@/pages/admin/Internships';
import AdminMous from '@/pages/admin/Mous';
import AdminMouCreate from '@/pages/admin/MouCreate';
import AdminReports from '@/pages/admin/Reports';
import AdminSettings from '@/pages/admin/Settings';
import AdminUsers from '@/pages/admin/Users';

function App() {
  useEffect(() => {
    // Enable MSW in development
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/msw').then(({ enableMocking }) => {
        enableMocking();
      });
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/internships" element={<StudentInternships />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/logbook" element={<StudentLogbook />} />

            {/* Staff routes */}
            <Route path="/staff/dashboard" element={<StaffDashboard />} />

            {/* Industry routes */}
            <Route path="/industry/dashboard" element={<IndustryDashboard />} />
            <Route path="/industry/applications" element={<IndustryApplications />} />
            <Route path="/industry/evaluations" element={<IndustryEvaluations />} />
            <Route path="/industry/feedback" element={<IndustryFeedback />} />
            <Route path="/industry/mous" element={<IndustryMous />} />
            <Route path="/industry/postings" element={<IndustryPostings />} />
            <Route path="/industry/students" element={<IndustryStudents />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/internships" element={<AdminInternships />} />
            <Route path="/admin/mous" element={<AdminMous />} />
            <Route path="/admin/mous/create" element={<AdminMouCreate />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/users" element={<AdminUsers />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
