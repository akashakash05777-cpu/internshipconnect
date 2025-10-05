import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Briefcase,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  Upload,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { useState, memo, useCallback } from 'react';

interface SidebarProps {
  userRole: UserRole;
  className?: string;
}

const roleBasedNavigation = {
  student: [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'Internships', href: '/student/internships', icon: Briefcase },
    { name: 'Applications', href: '/student/applications', icon: FileText },
    { name: 'Logbook', href: '/student/logbook', icon: BookOpen },
    { name: 'Documents', href: '/student/documents', icon: Upload },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
  ],
  staff: [
    { name: 'Dashboard', href: '/staff/dashboard', icon: Home },
    { name: 'Applications', href: '/staff/applications', icon: FileText },
    { name: 'Students', href: '/staff/students', icon: Users },
    { name: 'Logbooks', href: '/staff/logbooks', icon: BookOpen },
    { name: 'Reports', href: '/staff/reports', icon: BarChart3 },
    { name: 'Notifications', href: '/staff/notifications', icon: Bell },
  ],
  industry: [
    { name: 'Dashboard', href: '/industry/dashboard', icon: Home },
    { name: 'Postings', href: '/industry/postings', icon: Briefcase },
    { name: 'Applications', href: '/industry/applications', icon: FileText },
    { name: 'Students', href: '/industry/students', icon: Users },
    { name: 'Evaluations', href: '/industry/evaluations', icon: BarChart3 },
    { name: 'Feedback', href: '/industry/feedback', icon: MessageSquare },
    { name: 'MoUs', href: '/industry/mous', icon: FileText },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'MoUs', href: '/admin/mous', icon: FileText },
    { name: 'Internships', href: '/admin/internships', icon: Briefcase },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

export const Sidebar = memo(function Sidebar({ userRole, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigation = roleBasedNavigation[userRole] || [];

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold capitalize">{userRole} Portal</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p>InternConnect Platform</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
});


