

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  FileText, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  BookOpen,
  Upload,
  Bell,
  ArrowRight
} from 'lucide-react';
import { mockStudents, mockApplications, mockInternships, mockLogbookEntries } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const [currentUser] = useState(mockStudents[0]);
  const [applications, setApplications] = useState(mockApplications);
  const [internships, setInternships] = useState(mockInternships);
  const [logbookEntries, setLogbookEntries] = useState(mockLogbookEntries);

  // Calculate stats
  const totalApplications = applications.length;
  const ongoingApplications = applications.filter(app => app.status === 'ongoing').length;
  const completedApplications = applications.filter(app => app.status === 'completed').length;
  const totalCredits = applications
    .filter(app => app.status === 'completed')
    .reduce((sum, app) => {
      const internship = internships.find(i => i.id === app.internshipId);
      return sum + (internship?.credits || 0);
    }, 0);

  // Get recent applications
  const recentApplications = applications.slice(0, 3);

  // Get ongoing internship details
  const ongoingApplication = applications.find(app => app.status === 'ongoing');
  const ongoingInternship = ongoingApplication 
    ? internships.find(i => i.id === ongoingApplication.internshipId)
    : null;

  // Calculate progress for ongoing internship
  const progressPercentage = ongoingApplication ? 65 : 0; // Mock progress

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <DashboardLayout
        userRole="student"
        userName={currentUser.name}
        userEmail={currentUser.email}
        notificationCount={2}
      >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your internships today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {currentUser.department} • Year {currentUser.year}
            </Badge>
            <Badge variant="outline" className="text-sm">
              CGPA: {currentUser.cgpa}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="All time applications"
            icon={<Briefcase className="h-4 w-4" />}
            trend={{ value: 12, label: "from last month", isPositive: true }}
          />
          <StatsCard
            title="Ongoing Internships"
            value={ongoingApplications}
            description="Currently active"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatsCard
            title="Completed"
            value={completedApplications}
            description="Successfully finished"
            icon={<Award className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Credits"
            value={totalCredits}
            description="NEP credits earned"
            icon={<TrendingUp className="h-4 w-4" />}
            badge={{ text: "NEP Compliant", variant: "default" }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Ongoing Internship Progress */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Internship Progress
                </CardTitle>
                <CardDescription>
                  Track your progress in the ongoing internship
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ongoingInternship ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{ongoingInternship.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {ongoingInternship.company} • {ongoingInternship.duration} weeks
                        </p>
                      </div>
                      <StatusBadge status="ongoing" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Started:</span>
                        <p className="font-medium">
                          {ongoingApplication?.startedAt 
                            ? format(ongoingApplication.startedAt, 'MMM dd, yyyy')
                            : 'Not started'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Credits:</span>
                        <p className="font-medium">{ongoingInternship.credits}</p>
                      </div>
                    </div>

                    <Button className="w-full">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Ongoing Internship</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apply to internships to start tracking your progress
                    </p>
                    <Button>
                      Browse Internships
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Apply to Internship
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Update Logbook
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  View Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Your latest internship applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentApplications.map((application) => {
                  const internship = internships.find(i => i.id === application.internshipId);
                  return (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{internship?.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(application.appliedAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                  );
                })}
                {recentApplications.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No applications yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Weekly Logbook Entry</h4>
                  <p className="text-sm text-muted-foreground">Due in 2 days</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mid-term Evaluation</h4>
                  <p className="text-sm text-muted-foreground">Due in 1 week</p>
                </div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
