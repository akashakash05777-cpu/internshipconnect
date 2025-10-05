

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Briefcase, 
  FileText, 
  Award,
  Calendar,
  Download,
  Filter,
  PieChart,
  Activity,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2
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
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

export default function AnalyticsPage() {
  const [currentUser] = useState(mockAdmin[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  // Calculate comprehensive analytics
  const totalUsers = mockStudents.length + mockStaff.length + mockIndustry.length + mockAdmin.length;
  const totalInternships = mockInternships.length;
  const totalApplications = mockApplications.length;
  const totalMous = mockMous.length;
  const activeMous = mockMous.filter(m => m.status === 'active').length;
  const completedApplications = mockApplications.filter(a => a.status === 'completed').length;
  const ongoingApplications = mockApplications.filter(a => a.status === 'ongoing').length;
  const successRate = totalApplications > 0 ? (completedApplications / totalApplications) * 100 : 0;

  // User distribution data
  const userDistributionData = [
    { name: 'Students', value: mockStudents.length, color: '#3b82f6' },
    { name: 'Staff', value: mockStaff.length, color: '#10b981' },
    { name: 'Industry', value: mockIndustry.length, color: '#8b5cf6' },
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

  // Internship status data
  const internshipStatusData = [
    { name: 'Active', value: mockInternships.filter(i => i.status === 'active').length },
    { name: 'Inactive', value: mockInternships.filter(i => i.status === 'inactive').length },
    { name: 'Closed', value: mockInternships.filter(i => i.status === 'closed').length },
  ];

  // MoU status data
  const mouStatusData = [
    { name: 'Active', value: mockMous.filter(m => m.status === 'active').length },
    { name: 'Pending', value: mockMous.filter(m => m.status === 'pending_signatures').length },
    { name: 'Draft', value: mockMous.filter(m => m.status === 'draft').length },
    { name: 'Terminated', value: mockMous.filter(m => m.status === 'terminated').length },
  ];

  // Monthly trends data (mock data for demonstration)
  const monthlyTrendsData = [
    { month: 'Jan', applications: 12, internships: 3, users: 8 },
    { month: 'Feb', applications: 18, internships: 5, users: 12 },
    { month: 'Mar', applications: 25, internships: 7, users: 15 },
    { month: 'Apr', applications: 32, internships: 9, users: 18 },
    { month: 'May', applications: 28, internships: 8, users: 16 },
    { month: 'Jun', applications: 35, internships: 10, users: 20 },
  ];

  // Department-wise applications
  const departmentData = [
    { department: 'Computer Science', applications: 45, completed: 12 },
    { department: 'Information Technology', applications: 32, completed: 8 },
    { department: 'Electronics', applications: 28, completed: 6 },
    { department: 'Mechanical', applications: 22, completed: 4 },
    { department: 'Civil', applications: 18, completed: 3 },
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
    .slice(0, 5);

  const handleExportData = () => {
    console.log('Exporting analytics data...');
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
              <h1 className="text-3xl font-bold">Analytics & Reports</h1>
              <p className="text-muted-foreground">
                Comprehensive analytics and insights for the InternConnect platform.
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
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
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
                <Target className="h-4 w-4 text-muted-foreground" />
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

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="internships">Internships</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* User Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      User Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of users by role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
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
                      </RechartsPieChart>
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
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* User Growth */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Growth
                    </CardTitle>
                    <CardDescription>
                      User registration trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* User Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      User Activity
                    </CardTitle>
                    <CardDescription>
                      Recent user activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Active Users</span>
                        </div>
                        <span className="font-semibold">{totalUsers - 2}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">New This Month</span>
                        </div>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Total Registrations</span>
                        </div>
                        <span className="font-semibold">{totalUsers}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
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

                {/* Department-wise Applications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Department Performance
                    </CardTitle>
                    <CardDescription>
                      Applications by department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentData.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{dept.department}</span>
                            <span className="text-sm text-muted-foreground">
                              {dept.completed}/{dept.applications} completed
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(dept.completed / dept.applications) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="internships" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Internship Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Internship Status
                    </CardTitle>
                    <CardDescription>
                      Distribution of internship statuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={internshipStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* MoU Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      MoU Status
                    </CardTitle>
                    <CardDescription>
                      Memorandum of Understanding status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mouStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
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
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
