import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { mockStudents, mockStaff, mockIndustry, mockAdmin } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for all user roles
const demoCredentials = {
  // Student credentials
  'john.doe@student.edu': { password: 'student123', user: mockStudents[0] },
  'jane.smith@student.edu': { password: 'student123', user: mockStudents[1] },
  
  // Staff credentials
  'sarah.johnson@staff.edu': { password: 'staff123', user: mockStaff[0] },
  'michael.brown@staff.edu': { password: 'staff123', user: mockStaff[1] },
  
  // Industry credentials
  'hr@techcorp.com': { password: 'industry123', user: mockIndustry[0] },
  'internships@dataflow.com': { password: 'industry123', user: mockIndustry[1] },
  
  // Admin credentials
  'admin@university.edu': { password: 'admin123', user: mockAdmin[0] },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const credential = demoCredentials[email as keyof typeof demoCredentials];
    
    if (!credential) {
      setIsLoading(false);
      return { success: false, message: 'User not found' };
    }
    
    if (credential.password !== password) {
      setIsLoading(false);
      return { success: false, message: 'Invalid password' };
    }
    
    setUser(credential.user);
    localStorage.setItem('user', JSON.stringify(credential.user));
    setIsLoading(false);
    
    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


