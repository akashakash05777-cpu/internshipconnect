

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  Clock, 
  Award, 
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { mockStaff, mockApplications, mockStudents, mockInternships, mockLogbookEntries } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function StaffDashboard() {
  const [currentUser] = useState(mockStaff[0]);
  const [applications, setApplications] = useState(mockApplications);
  const [students, setStudents] = useState(mockStudents);
  const [internships, setInternships] = useState(mockInternships);
  const [logbookEntries, setLogbookEntries] = useState(mockLogbookEntries);

  // Calculate stats
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'applied').length;
  const ongoingApplications = applications.filter(app => app.status === 'ongoing').length;
  const completedApplications = applications.filter(app => app.status === 'completed').length;

  // Get recent applications that need review
  const pendingReviewApplications = applications
    .filter(app => app.status === 'applied')
    .slice(0, 5);

  // Get students with ongoing internships
  const studentsWithOngoingInternships = applications
    .filter(app => app.status === 'ongoing')
    .map(app => {
      const student = students.find(s => s.id === app.studentId);
      const internship = internships.find(i => i.id === app.internshipId);
      return { ...app, student, internship };
    });

  // Get recent logbook entries
  const recentLogbookEntries = logbookEntries.slice(0, 3);

  const handleApproveApplication = (applicationId: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'shortlisted' as const, shortlistedAt: new Date() }
        : app
    ));
  };

  const handleRejectApplication = (applicationId: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected' as const }
        : app
    ));
  };

  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <DashboardLayout
        userRole="staff"
        userName={currentUser.name}
        userEmail={currentUser.email}
        notificationCount={3}
      >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
            <p className="text-muted-foreground">
              Here's an overview of student applications and internship progress.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {currentUser.department}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {currentUser.designation}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="All time applications"
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 8, label: "from last week", isPositive: true }}
          />
          <StatsCard
            title="Pending Review"
            value={pendingApplications}
            description="Need your attention"
            icon={<AlertCircle className="h-4 w-4" />}
            badge={{ text: "Action Required", variant: "destructive" }}
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
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Applications Pending Review
                </CardTitle>
                <CardDescription>
                  Review and approve student internship applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviewApplications.length > 0 ? (
                  pendingReviewApplications.map((application) => {
                    const student = students.find(s => s.id === application.studentId);
                    const internship = internships.find(i => i.id === application.internshipId);
                    
                    if (!student || !internship) return null;

                    return (
                      <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {student.studentId} • {student.department}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">{internship.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {internship.company} • {internship.credits} credits
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Applied: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                            <span>CGPA: {student.cgpa}</span>
                            <span>Year: {student.year}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveApplication(application.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectApplication(application.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="font-semibold mb-2">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">
                      No applications pending review at the moment.
                    </p>
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
                  Review Applications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Monitor Logbooks
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Student Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Recent Logbook Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Logbook Entries</CardTitle>
                <CardDescription>
                  Latest student logbook submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentLogbookEntries.map((entry) => {
                  const application = applications.find(app => app.id === entry.applicationId);
                  const student = application ? students.find(s => s.id === application.studentId) : null;
                  
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{student?.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(entry.date, 'MMM dd, yyyy')} • {entry.hours} hours
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    </div>
                  );
                })}
                {recentLogbookEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent entries
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Students with Ongoing Internships */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students with Ongoing Internships
            </CardTitle>
            <CardDescription>
              Monitor progress of students currently in internships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentsWithOngoingInternships.map((item) => {
                if (!item.student || !item.internship) return null;

                const studentLogbookEntries = logbookEntries.filter(
                  entry => entry.applicationId === item.id
                );
                const totalHours = studentLogbookEntries.reduce((sum, entry) => sum + entry.hours, 0);
                const progressPercentage = Math.min((totalHours / (item.internship.duration * 40)) * 100, 100);

                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{item.student.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.student.studentId} • {item.student.department}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.internship.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.internship.company}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{totalHours} / {item.internship.duration * 40} hours</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {studentLogbookEntries.length} entries
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {studentsWithOngoingInternships.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No ongoing internships</h3>
                  <p className="text-sm text-muted-foreground">
                    No students are currently in active internships.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
