

import { useState, useEffect, memo, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Briefcase, 
  BarChart3, 
  TrendingUp,
  UserPlus,
  Plus,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockAdmin, mockStudents, mockStaff, mockIndustry, mockInternships, mockApplications, mockMous } from '@/lib/mock-data';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [currentUser] = useState(mockAdmin[0]);

  // Memoize expensive calculations
  const stats = useMemo(() => {
    const totalUsers = mockStudents.length + mockStaff.length + mockIndustry.length + mockAdmin.length;
    const totalStudents = mockStudents.length;
    const totalStaff = mockStaff.length;
    const totalIndustry = mockIndustry.length;
    const totalInternships = mockInternships.length;
    const totalApplications = mockApplications.length;
    const totalMous = mockMous.length;
    const activeMous = mockMous.filter(mou => mou.status === 'active').length;

    return {
      totalUsers,
      totalStudents,
      totalStaff,
      totalIndustry,
      totalInternships,
      totalApplications,
      totalMous,
      activeMous
    };
  }, []);

  const { totalUsers, totalStudents, totalStaff, totalIndustry, totalInternships, totalApplications, totalMous, activeMous } = stats;

  // Memoize chart data
  const chartData = useMemo(() => ({
    userDistributionData: [
      { name: 'Students', value: totalStudents, color: '#3b82f6' },
      { name: 'Staff', value: totalStaff, color: '#10b981' },
      { name: 'Industry', value: totalIndustry, color: '#8b5cf6' },
      { name: 'Admin', value: mockAdmin.length, color: '#f59e0b' },
    ],
    internshipStatusData: [
      { name: 'Active', value: mockInternships.filter(i => i.status === 'active').length },
      { name: 'Inactive', value: mockInternships.filter(i => i.status === 'inactive').length },
      { name: 'Closed', value: mockInternships.filter(i => i.status === 'closed').length },
    ],
    applicationStatusData: [
      { name: 'Applied', value: mockApplications.filter(a => a.status === 'applied').length },
      { name: 'Shortlisted', value: mockApplications.filter(a => a.status === 'shortlisted').length },
      { name: 'Ongoing', value: mockApplications.filter(a => a.status === 'ongoing').length },
      { name: 'Completed', value: mockApplications.filter(a => a.status === 'completed').length },
      { name: 'Rejected', value: mockApplications.filter(a => a.status === 'rejected').length },
    ],
    mouStatusData: [
      { name: 'Active', value: mockMous.filter(m => m.status === 'active').length },
      { name: 'Pending', value: mockMous.filter(m => m.status === 'pending_signatures').length },
      { name: 'Draft', value: mockMous.filter(m => m.status === 'draft').length },
      { name: 'Terminated', value: mockMous.filter(m => m.status === 'terminated').length },
    ]
  }), [totalStudents, totalStaff, totalIndustry, totalInternships, totalApplications, totalMous]);

  const { userDistributionData, internshipStatusData, applicationStatusData, mouStatusData } = chartData;

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'user',
      action: 'New student registered',
      user: 'John Doe',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: UserPlus,
      color: 'text-blue-500',
    },
    {
      id: 2,
      type: 'mou',
      action: 'MoU signed',
      user: 'TechCorp Solutions',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      id: 3,
      type: 'application',
      action: 'New application submitted',
      user: 'Jane Smith',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: FileText,
      color: 'text-purple-500',
    },
    {
      id: 4,
      type: 'internship',
      action: 'New internship posted',
      user: 'DataFlow Inc',
      time: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      icon: Briefcase,
      color: 'text-orange-500',
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        userRole="admin"
        userName={currentUser.name}
        userEmail={currentUser.email}
        notificationCount={5}
      >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of the InternConnect internship platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              System Administrator
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            description="All platform users"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, label: "new this month", isPositive: true }}
          />
          <StatsCard
            title="Active Internships"
            value={totalInternships}
            description="Available positions"
            icon={<Briefcase className="h-4 w-4" />}
            trend={{ value: 5, label: "new this week", isPositive: true }}
          />
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="All time applications"
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 25, label: "this month", isPositive: true }}
          />
          <StatsCard
            title="Active MoUs"
            value={activeMous}
            description="Signed agreements"
            icon={<CheckCircle className="h-4 w-4" />}
            badge={{ text: "Active", variant: "default" }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Distribution Chart */}
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
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

          {/* Application Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Status
              </CardTitle>
              <CardDescription>
                Current application statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
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

          {/* MoU Status Chart */}
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
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mouStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest platform activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full bg-muted`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {format(activity.time, 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create MoU
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                View All Applications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-orange-900 rounded-lg">
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  MoU Expiring Soon
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  2 MoUs will expire within 30 days
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-800 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-800">
                Review
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-orange-900 rounded-lg">
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Pending Applications
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  5 applications need staff review
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-800 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-800">
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
