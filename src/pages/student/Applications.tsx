

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Award,
  Eye,
  Download,
  MessageSquare
} from 'lucide-react';
import { mockStudents, mockApplications, mockInternships } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Application } from '@/types';
import { format } from 'date-fns';

export default function StudentApplications() {
  const [currentUser] = useState(mockStudents[0]);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  // Get applications for current user
  const userApplications = applications.filter(app => app.studentId === currentUser.id);

  const getApplicationWithInternship = (application: Application) => {
    const internship = mockInternships.find(i => i.id === application.internshipId);
    return { ...application, internship };
  };

  const columns: Column<Application>[] = [
    {
      key: 'internship.title',
      header: 'Position',
      render: (_, row) => {
        const internship = mockInternships.find(i => i.id === row.internshipId);
        return (
          <div>
            <h4 className="font-medium">{internship?.title}</h4>
            <p className="text-sm text-muted-foreground">{internship?.company}</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'appliedAt',
      header: 'Applied Date',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span className="text-sm">{format(value, 'MMM dd, yyyy')}</span>
        </div>
      ),
    },
    {
      key: 'internship.credits',
      header: 'Credits',
      render: (_, row) => {
        const internship = mockInternships.find(i => i.id === row.internshipId);
        return (
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            <span className="text-sm">{internship?.credits || 0}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3" />
          </Button>
          {row.status === 'completed' && (
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const getStatusCounts = () => {
    const counts = {
      applied: 0,
      shortlisted: 0,
      ongoing: 0,
      completed: 0,
      rejected: 0,
    };

    userApplications.forEach(app => {
      counts[app.status as keyof typeof counts]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <DashboardLayout
        userRole="student"
        userName={currentUser.name}
        userEmail={currentUser.email}
      >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground">
              Track the status of your internship applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {userApplications.length} total applications
            </Badge>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applied</p>
                  <p className="text-2xl font-bold">{statusCounts.applied}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                  <p className="text-2xl font-bold">{statusCounts.shortlisted}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ongoing</p>
                  <p className="text-2xl font-bold">{statusCounts.ongoing}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{statusCounts.completed}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{statusCounts.rejected}</p>
                </div>
                <FileText className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <DataTable
          data={userApplications}
          columns={columns}
          title="Application History"
          searchable={true}
          filterable={true}
          exportable={true}
          emptyMessage="No applications found. Start applying to internships!"
        />

        {/* Application Details Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {userApplications.map((application) => {
            const internship = mockInternships.find(i => i.id === application.internshipId);
            if (!internship) return null;

            return (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{internship.title}</CardTitle>
                      <CardDescription>{internship.company}</CardDescription>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Applied:</span>
                      <p className="font-medium">
                        {format(application.appliedAt, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Credits:</span>
                      <p className="font-medium">{internship.credits}</p>
                    </div>
                    {application.shortlistedAt && (
                      <div>
                        <span className="text-muted-foreground">Shortlisted:</span>
                        <p className="font-medium">
                          {format(application.shortlistedAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                    {application.startedAt && (
                      <div>
                        <span className="text-muted-foreground">Started:</span>
                        <p className="font-medium">
                          {format(application.startedAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>

                  {application.feedback && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Feedback</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {application.feedback}
                      </p>
                    </div>
                  )}

                  {application.rating && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Rating</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`h-4 w-4 rounded-full ${
                              i < application.rating! ? 'bg-yellow-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-sm ml-2">{application.rating}/5</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {application.status === 'ongoing' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact Mentor
                      </Button>
                    )}
                    {application.status === 'completed' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download Certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {userApplications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your internship journey by applying to available positions.
              </p>
              <Button>
                Browse Internships
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
