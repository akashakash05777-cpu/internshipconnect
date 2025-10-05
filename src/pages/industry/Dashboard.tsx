

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Award,
  Clock
} from 'lucide-react';
import { mockIndustry, mockInternships, mockApplications, mockStudents } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function IndustryDashboard() {
  const [currentUser] = useState(mockIndustry[0]);
  const [internships, setInternships] = useState(mockInternships);
  const [applications, setApplications] = useState(mockApplications);
  const [students, setStudents] = useState(mockStudents);

  // Get internships for current company
  const companyInternships = internships.filter(i => i.company === currentUser.companyName);
  
  // Calculate stats
  const totalPostings = companyInternships.length;
  const activePostings = companyInternships.filter(i => i.status === 'active').length;
  const totalApplications = applications.filter(app => 
    companyInternships.some(i => i.id === app.internshipId)
  ).length;
  const ongoingInterns = applications.filter(app => 
    app.status === 'ongoing' && companyInternships.some(i => i.id === app.internshipId)
  ).length;

  // Get recent applications for company internships
  const recentApplications = applications
    .filter(app => companyInternships.some(i => i.id === app.internshipId))
    .slice(0, 5);

  // Get students with ongoing internships at this company
  const currentInterns = applications
    .filter(app => 
      app.status === 'ongoing' && 
      companyInternships.some(i => i.id === app.internshipId)
    )
    .map(app => {
      const student = students.find(s => s.id === app.studentId);
      const internship = companyInternships.find(i => i.id === app.internshipId);
      return { ...app, student, internship };
    });

  const handleCreatePosting = () => {
    // Mock create posting
    console.log('Creating new internship posting');
  };

  const handleReviewApplication = (applicationId: string, action: 'approve' | 'reject') => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: action === 'approve' ? 'shortlisted' as const : 'rejected' as const,
            shortlistedAt: action === 'approve' ? new Date() : undefined
          }
        : app
    ));
  };

  return (
    <ProtectedRoute allowedRoles={['industry']}>
      <DashboardLayout
        userRole="industry"
        userName={currentUser.name}
        userEmail={currentUser.email}
        notificationCount={4}
      >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
            <p className="text-muted-foreground">
              Manage your internship program and connect with talented students.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {currentUser.companyName}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {currentUser.industry}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Postings"
            value={activePostings}
            description="Currently open positions"
            icon={<Briefcase className="h-4 w-4" />}
            trend={{ value: 2, label: "new this month", isPositive: true }}
          />
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="All time applications"
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 15, label: "from last week", isPositive: true }}
          />
          <StatsCard
            title="Current Interns"
            value={ongoingInterns}
            description="Currently working"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Postings"
            value={totalPostings}
            description="All time postings"
            icon={<Building2 className="h-4 w-4" />}
            badge={{ text: "Active", variant: "default" }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  Review and manage student applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplications.length > 0 ? (
                  recentApplications.map((application) => {
                    const student = students.find(s => s.id === application.studentId);
                    const internship = companyInternships.find(i => i.id === application.internshipId);
                    
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
                                Applied: {format(application.appliedAt, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>CGPA: {student.cgpa}</span>
                            <span>Year: {student.year}</span>
                            <span>Skills: {student.skills.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={application.status} />
                          {application.status === 'applied' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleReviewApplication(application.id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReviewApplication(application.id, 'reject')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No applications yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create internship postings to start receiving applications.
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
                <Button className="w-full justify-start" onClick={handleCreatePosting}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Posting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Applications
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/industry/students">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Students
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/industry/evaluations">
                    <Award className="mr-2 h-4 w-4" />
                    Evaluations
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Current Interns */}
            <Card>
              <CardHeader>
                <CardTitle>Current Interns</CardTitle>
                <CardDescription>
                  Students currently working with your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentInterns.map((item) => {
                  if (!item.student || !item.internship) return null;

                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.student.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.internship.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started: {item.startedAt ? format(item.startedAt, 'MMM dd') : 'Not started'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  );
                })}
                {currentInterns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No current interns
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Internship Postings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Your Internship Postings
                </CardTitle>
                <CardDescription>
                  Manage your active and inactive internship positions
                </CardDescription>
              </div>
              <Button onClick={handleCreatePosting}>
                <Plus className="h-4 w-4 mr-2" />
                Create Posting
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyInternships.map((internship) => {
                const internshipApplications = applications.filter(
                  app => app.internshipId === internship.id
                );
                const approvedApplications = internshipApplications.filter(
                  app => app.status === 'shortlisted' || app.status === 'ongoing'
                );

                return (
                  <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{internship.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {internship.domain} • {internship.location}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{internship.duration} weeks • {internship.credits} credits</p>
                          <p>{internshipApplications.length} applications</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Skills:</span>
                          {internship.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {internship.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{internship.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={internship.status} />
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {companyInternships.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No internship postings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first internship posting to start attracting talented students.
                  </p>
                  <Button onClick={handleCreatePosting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Posting
                  </Button>
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
