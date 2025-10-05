

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { 
  mockAdmin, 
  mockStudents, 
  mockStaff, 
  mockIndustry, 
  mockInternships, 
  mockApplications, 
  mockMous 
} from '@/lib/mock-data';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

export default function ReportsPage() {
  const [currentUser] = useState(mockAdmin[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate comprehensive statistics
  const totalUsers = mockStudents.length + mockStaff.length + mockIndustry.length + mockAdmin.length;
  const totalStudents = mockStudents.length;
  const totalStaff = mockStaff.length;
  const totalIndustry = mockIndustry.length;
  const totalInternships = mockInternships.length;
  const totalApplications = mockApplications.length;
  const totalMous = mockMous.length;
  const activeMous = mockMous.filter(m => m.status === 'active').length;
  const completedApplications = mockApplications.filter(a => a.status === 'completed').length;
  const successRate = totalApplications > 0 ? (completedApplications / totalApplications) * 100 : 0;

  // User distribution data
  const userDistributionData = [
    { name: 'Students', value: totalStudents, color: '#3b82f6' },
    { name: 'Staff', value: totalStaff, color: '#10b981' },
    { name: 'Industry', value: totalIndustry, color: '#8b5cf6' },
    { name: 'Admins', value: mockAdmin.length, color: '#f59e0b' },
  ];

  // Application status distribution
  const applicationStatusData = [
    { name: 'Applied', value: mockApplications.filter(a => a.status === 'applied').length, color: '#3b82f6' },
    { name: 'Shortlisted', value: mockApplications.filter(a => a.status === 'shortlisted').length, color: '#10b981' },
    { name: 'Ongoing', value: mockApplications.filter(a => a.status === 'ongoing').length, color: '#8b5cf6' },
    { name: 'Completed', value: mockApplications.filter(a => a.status === 'completed').length, color: '#22c55e' },
    { name: 'Rejected', value: mockApplications.filter(a => a.status === 'rejected').length, color: '#ef4444' },
  ];

  // Monthly trends data (mock data for demonstration)
  const monthlyTrendsData = [
    { month: 'Jan', applications: 12, internships: 3, users: 8, mous: 1 },
    { month: 'Feb', applications: 18, internships: 5, users: 12, mous: 2 },
    { month: 'Mar', applications: 25, internships: 7, users: 15, mous: 3 },
    { month: 'Apr', applications: 32, internships: 9, users: 18, mous: 4 },
    { month: 'May', applications: 28, internships: 8, users: 16, mous: 3 },
    { month: 'Jun', applications: 35, internships: 10, users: 20, mous: 5 },
  ];

  // Department-wise applications
  const departmentData = [
    { department: 'Computer Science', applications: 45, completed: 12, successRate: 26.7 },
    { department: 'Information Technology', applications: 32, completed: 8, successRate: 25.0 },
    { department: 'Electronics', applications: 28, completed: 6, successRate: 21.4 },
    { department: 'Mechanical', applications: 22, completed: 4, successRate: 18.2 },
    { department: 'Civil', applications: 18, completed: 3, successRate: 16.7 },
  ];

  // Industry performance
  const industryPerformance = mockIndustry.map(company => {
    const companyInternships = mockInternships.filter(i => i.company === company.companyName);
    const companyApplications = mockApplications.filter(app => 
      companyInternships.some(i => i.id === app.internshipId)
    );
    return {
      company: company.companyName,
      internships: companyInternships.length,
      applications: companyApplications.length,
      completed: companyApplications.filter(app => app.status === 'completed').length,
      successRate: companyApplications.length > 0 
        ? (companyApplications.filter(app => app.status === 'completed').length / companyApplications.length) * 100 
        : 0
    };
  });

  // Top performing students
  const topStudents = mockStudents
    .map(student => {
      const studentApplications = mockApplications.filter(app => app.studentId === student.id);
      const completed = studentApplications.filter(app => app.status === 'completed').length;
      return {
        ...student,
        totalApplications: studentApplications.length,
        completedApplications: completed,
        successRate: studentApplications.length > 0 ? (completed / studentApplications.length) * 100 : 0
      };
    })
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 10);

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    console.log(`Generating ${reportType} report...`);
  };

  const handleExportData = (format: string) => {
    console.log(`Exporting data as ${format}...`);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        userRole="admin"
        userName={currentUser.name}
        userEmail={currentUser.email}
        notificationCount={5}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Generate comprehensive reports and analytics for the platform.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExportData('PDF')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportData('Excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  All platform users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Application completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInternships}</div>
                <p className="text-xs text-muted-foreground">
                  Available positions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active MoUs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMous}</div>
                <p className="text-xs text-muted-foreground">
                  Signed agreements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Report Types */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Reports</TabsTrigger>
              <TabsTrigger value="applications">Application Reports</TabsTrigger>
              <TabsTrigger value="internships">Internship Reports</TabsTrigger>
              <TabsTrigger value="performance">Performance Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* User Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of users by role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={userDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {userDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {userDistributionData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Trends
                    </CardTitle>
                    <CardDescription>
                      Growth trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="internships" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Application Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Application Status
                    </CardTitle>
                    <CardDescription>
                      Distribution of application statuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={applicationStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Department Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Department Performance
                    </CardTitle>
                    <CardDescription>
                      Success rates by department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentData.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{dept.department}</span>
                            <span className="text-sm text-muted-foreground">
                              {dept.completed}/{dept.applications} ({dept.successRate.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${dept.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Analytics Report
                  </CardTitle>
                  <CardDescription>
                    Comprehensive user statistics and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
                        <p className="text-sm text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{totalStaff}</div>
                        <p className="text-sm text-muted-foreground">Staff</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{totalIndustry}</div>
                        <p className="text-sm text-muted-foreground">Industry Partners</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{mockAdmin.length}</div>
                        <p className="text-sm text-muted-foreground">Administrators</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => handleGenerateReport('user-details')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate User Details
                      </Button>
                      <Button variant="outline" onClick={() => handleGenerateReport('user-activity')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Generate Activity Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Application Analytics Report
                  </CardTitle>
                  <CardDescription>
                    Detailed application statistics and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalApplications}</div>
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{mockApplications.filter(a => a.status === 'applied').length}</div>
                        <p className="text-sm text-muted-foreground">Applied</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mockApplications.filter(a => a.status === 'shortlisted').length}</div>
                        <p className="text-sm text-muted-foreground">Shortlisted</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{mockApplications.filter(a => a.status === 'ongoing').length}</div>
                        <p className="text-sm text-muted-foreground">Ongoing</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{completedApplications}</div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => handleGenerateReport('application-summary')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Summary
                      </Button>
                      <Button variant="outline" onClick={() => handleGenerateReport('application-detailed')}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Detailed Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="internships" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Internship Analytics Report
                  </CardTitle>
                  <CardDescription>
                    Internship performance and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalInternships}</div>
                        <p className="text-sm text-muted-foreground">Total Internships</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mockInternships.filter(i => i.status === 'active').length}</div>
                        <p className="text-sm text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{mockInternships.filter(i => i.status === 'inactive').length}</div>
                        <p className="text-sm text-muted-foreground">Inactive</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{mockInternships.filter(i => i.status === 'closed').length}</div>
                        <p className="text-sm text-muted-foreground">Closed</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => handleGenerateReport('internship-performance')}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Generate Performance Report
                      </Button>
                      <Button variant="outline" onClick={() => handleGenerateReport('internship-engagement')}>
                        <Users className="h-4 w-4 mr-2" />
                        Generate Engagement Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Industry Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Industry Performance
                    </CardTitle>
                    <CardDescription>
                      Performance metrics by industry partner
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {industryPerformance.map((company, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{company.company}</h4>
                            <Badge variant="outline">
                              {company.successRate.toFixed(1)}% success
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span>Internships: </span>
                              <span className="font-medium">{company.internships}</span>
                            </div>
                            <div>
                              <span>Applications: </span>
                              <span className="font-medium">{company.applications}</span>
                            </div>
                            <div>
                              <span>Completed: </span>
                              <span className="font-medium">{company.completed}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Top Performing Students
                    </CardTitle>
                    <CardDescription>
                      Students with highest success rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topStudents.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {student.department} • {student.studentId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{student.successRate.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">
                              {student.completedApplications}/{student.totalApplications}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                  <CardDescription>
                    Overall platform performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</div>
                      <p className="text-sm text-muted-foreground">Overall Success Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{totalInternships}</div>
                      <p className="text-sm text-muted-foreground">Total Internships</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{activeMous}</div>
                      <p className="text-sm text-muted-foreground">Active MoUs</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => handleGenerateReport('performance-summary')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Performance Summary
                    </Button>
                    <Button variant="outline" onClick={() => handleGenerateReport('comprehensive')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Comprehensive Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
