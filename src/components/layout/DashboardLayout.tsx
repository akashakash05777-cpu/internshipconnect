import { ReactNode, memo } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  notificationCount?: number;
}

export const DashboardLayout = memo(function DashboardLayout({ 
  children, 
  userRole, 
  userName, 
  userEmail, 
  notificationCount = 0 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
        notificationCount={notificationCount}
      />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
});


