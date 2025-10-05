import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect authenticated users to their dashboard
        const roleRoutes = {
          student: '/student/dashboard',
          staff: '/staff/dashboard',
          industry: '/industry/dashboard',
          admin: '/admin/dashboard',
        };
        navigate(roleRoutes[user.role] || '/login');
      } else {
        // Redirect unauthenticated users to login
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

