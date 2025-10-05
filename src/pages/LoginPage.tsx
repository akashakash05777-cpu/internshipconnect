import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  Shield,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const demoCredentials = [
  {
    role: 'Admin',
    email: 'admin@university.edu',
    password: 'admin123',
    icon: Shield,
    color: 'bg-orange-500',
    description: 'Manage users, MoUs, and view system analytics',
  },
  {
    role: 'Industry',
    email: 'hr@techcorp.com',
    password: 'industry123',
    icon: Building2,
    color: 'bg-purple-500',
    description: 'Create postings, review applications, and manage interns',
  },
  {
    role: 'Student',
    email: 'john.doe@student.edu',
    password: 'student123',
    icon: GraduationCap,
    color: 'bg-blue-500',
    description: 'Access internship applications, logbook, and progress tracking',
  },
  {
    role: 'Staff',
    email: 'sarah.johnson@staff.edu',
    password: 'staff123',
    icon: Users,
    color: 'bg-green-500',
    description: 'Review applications, monitor students, and provide feedback',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState<typeof demoCredentials[0] | null>(null);
  
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      const roleRoutes = {
        student: '/student/dashboard',
        staff: '/staff/dashboard',
        industry: '/industry/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleRoutes[user.role] || '/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleDemoLogin = async (demo: typeof demoCredentials[0]) => {
    setSelectedDemo(demo);
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
    
    const result = await login(demo.email, demo.password);
    if (!result.success) {
      setError(result.message);
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your InternConnect account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Demo Credentials */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Demo Credentials</h2>
              <p className="text-muted-foreground">
                Try the platform with these demo accounts
              </p>
            </div>
            
            <div className="space-y-4">
              {demoCredentials.map((demo, index) => {
                const Icon = demo.icon;
                const isSelected = selectedDemo?.email === demo.email;
                
                return (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleDemoLogin(demo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${demo.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{demo.role}</h3>
                            <Badge variant="secondary" className="text-xs">
                              Demo
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {demo.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <p><strong>Email:</strong> {demo.email}</p>
                            <p><strong>Password:</strong> {demo.password}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDemoLogin(demo);
                          }}
                          disabled={isLoading}
                        >
                          {isLoading && selectedDemo?.email === demo.email ? 'Signing in...' : 'Login'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                All demo accounts have full access to their respective portals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



