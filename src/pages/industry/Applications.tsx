

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Calendar,
  MapPin,
  Award,
  GraduationCap,
  Building2,
  Star,
  MessageSquare,
  Download,
  User,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  mockIndustry, 
  mockStudents, 
  mockApplications, 
  mockInternships 
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function ApplicationsPage() {
  const [currentUser] = useState(mockIndustry[0]);
  const [students, setStudents] = useState(mockStudents);
  const [applications, setApplications] = useState(mockApplications);
  const [internships, setInternships] = useState(mockInternships);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInternship, setSelectedInternship] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Get company internships
  const companyInternships = internships.filter(i => i.company === currentUser.companyName);
  
  // Get applications for company internships
  const companyApplications = applications
    .filter(app => companyInternships.some(i => i.id === app.internshipId))
    .map(app => {
      const student = students.find(s => s.id === app.studentId);
      const internship = companyInternships.find(i => i.id === app.internshipId);
      
      return { 
        ...app, 
        student, 
        internship
      };
    })
    .filter(item => item.student && item.internship);

  // Filter applications
  const filteredApplications = companyApplications.filter(app => {
    const matchesSearch = app.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student?.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.internship?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student?.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesInternship = selectedInternship === 'all' || app.internshipId === selectedInternship;
    
    return matchesSearch && matchesStatus && matchesInternship;
  });

  // Calculate stats
  const totalApplications = companyApplications.length;
  const pendingApplications = companyApplications.filter(app => app.status === 'applied').length;
  const shortlistedApplications = companyApplications.filter(app => app.status === 'shortlisted').length;
  const ongoingApplications = companyApplications.filter(app => app.status === 'ongoing').length;
  const completedApplications = companyApplications.filter(app => app.status === 'completed').length;
  const rejectedApplications = companyApplications.filter(app => app.status === 'rejected').length;

  const handleViewApplication = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setIsDetailsDialogOpen(true);
  };

  const handleApplicationAction = (applicationId: string, action: 'approve' | 'reject' | 'shortlist' | 'start' | 'complete') => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        switch (action) {
          case 'approve':
            return { 
              ...app, 
              status: 'shortlisted' as const,
              shortlistedAt: new Date()
            };
          case 'reject':
            return { 
              ...app, 
              status: 'rejected' as const
            };
          case 'shortlist':
            return { 
              ...app, 
              status: 'shortlisted' as const,
              shortlistedAt: new Date()
            };
          case 'start':
            return { 
              ...app, 
              status: 'ongoing' as const,
              startedAt: new Date()
            };
          case 'complete':
            return { 
              ...app, 
              status: 'completed' as const,
              completedAt: new Date()
            };
          default:
            return app;
        }
      }
      return app;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shortlisted': return 'text-green-600 bg-green-50 border-green-200';
      case 'ongoing': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ongoing': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'completed': return <Award className="h-4 w-4 text-gray-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActionButtons = (application: any) => {
    const buttons = [];
    
    switch (application.status) {
      case 'applied':
        buttons.push(
          <Button
            key="approve"
            size="sm"
            onClick={() => handleApplicationAction(application.id, 'approve')}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>,
          <Button
            key="reject"
            variant="outline"
            size="sm"
            onClick={() => handleApplicationAction(application.id, 'reject')}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        );
        break;
      case 'shortlisted':
        buttons.push(
          <Button
            key="start"
            size="sm"
            onClick={() => handleApplicationAction(application.id, 'start')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Start Internship
          </Button>
        );
        break;
      case 'ongoing':
        buttons.push(
          <Button
            key="complete"
            size="sm"
            onClick={() => handleApplicationAction(application.id, 'complete')}
          >
            <Award className="h-4 w-4 mr-1" />
            Complete
          </Button>
        );
        break;
    }
    
    return buttons;
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Applications</h1>
              <p className="text-muted-foreground">
                Review and manage student applications for your internship postings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  All time applications
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shortlistedApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Approved candidates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ongoingApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Currently working
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search applications by student name, ID, or internship..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedInternship} onValueChange={setSelectedInternship}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Internship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Internships</SelectItem>
                    {companyInternships.map((internship) => (
                      <SelectItem key={internship.id} value={internship.id}>
                        {internship.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredApplications.map((application) => {
                if (!application.student || !application.internship) return null;

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{application.student.name}</h3>
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(application.status)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {application.student.studentId} • {application.student.department} • Year {application.student.year}
                            </p>
                            <p className="text-sm font-medium mb-2">{application.internship.title}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span>CGPA: {application.student.cgpa}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Applied: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{application.internship.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{application.internship.duration} weeks</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {application.student.skills.slice(0, 4).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {application.student.skills.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{application.student.skills.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {getActionButtons(application)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filteredApplications.filter(app => app.status === 'applied').map((application) => {
                if (!application.student || !application.internship) return null;

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{application.student.name}</h3>
                              <Badge className="text-blue-600 bg-blue-50 border-blue-200">
                                Pending Review
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {application.student.studentId} • {application.student.department}
                            </p>
                            <p className="text-sm font-medium mb-2">{application.internship.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Applied: {format(application.appliedAt, 'MMM dd, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplicationAction(application.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplicationAction(application.id, 'reject')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              {filteredApplications.filter(app => app.status === 'shortlisted').map((application) => {
                if (!application.student || !application.internship) return null;

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{application.student.name}</h3>
                              <Badge className="text-green-600 bg-green-50 border-green-200">
                                Shortlisted
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {application.student.studentId} • {application.student.department}
                            </p>
                            <p className="text-sm font-medium mb-2">{application.internship.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Shortlisted: {application.shortlistedAt ? format(application.shortlistedAt, 'MMM dd, yyyy') : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplicationAction(application.id, 'start')}
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Start Internship
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="ongoing" className="space-y-4">
              {filteredApplications.filter(app => app.status === 'ongoing').map((application) => {
                if (!application.student || !application.internship) return null;

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{application.student.name}</h3>
                              <Badge className="text-purple-600 bg-purple-50 border-purple-200">
                                Ongoing
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {application.student.studentId} • {application.student.department}
                            </p>
                            <p className="text-sm font-medium mb-2">{application.internship.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Started: {application.startedAt ? format(application.startedAt, 'MMM dd, yyyy') : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplicationAction(application.id, 'complete')}
                          >
                            <Award className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredApplications.filter(app => app.status === 'completed').map((application) => {
                if (!application.student || !application.internship) return null;

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                            <Award className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{application.student.name}</h3>
                              <Badge className="text-gray-600 bg-gray-50 border-gray-200">
                                Completed
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {application.student.studentId} • {application.student.department}
                            </p>
                            <p className="text-sm font-medium mb-2">{application.internship.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed: {application.completedAt ? format(application.completedAt, 'MMM dd, yyyy') : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>

          {/* Application Details Dialog */}
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Complete information about the student application
                </DialogDescription>
              </DialogHeader>
              <ApplicationDetails 
                application={selectedApplication ? companyApplications.find(app => app.id === selectedApplication) : null}
                onAction={handleApplicationAction}
              />
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Application Details Component
function ApplicationDetails({ application, onAction }: {
  application: any;
  onAction: (id: string, action: string) => void;
}) {
  if (!application || !application.student || !application.internship) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">Application not found</h3>
        <p className="text-sm text-muted-foreground">
          The requested application could not be found.
        </p>
      </div>
    );
  }

  const { student, internship } = application;

  return (
    <div className="space-y-6">
      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm">{student.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Student ID</Label>
                <p className="text-sm">{student.studentId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Department</Label>
                <p className="text-sm">{student.department}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Year</Label>
                <p className="text-sm">Year {student.year}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">CGPA</Label>
                <p className="text-sm">{student.cgpa}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {student.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internship Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Internship Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Position</Label>
              <p className="text-sm font-semibold">{internship.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Domain</Label>
                <p className="text-sm">{internship.domain}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm">{internship.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-sm">{internship.duration} weeks</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Credits</Label>
                <p className="text-sm">{internship.credits} credits</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground mt-1">{internship.description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Required Skills</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {internship.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Applied</p>
                <p className="text-xs text-muted-foreground">
                  {format(application.appliedAt, 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            {application.shortlistedAt && (
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Shortlisted</p>
                  <p className="text-xs text-muted-foreground">
                    {format(application.shortlistedAt, 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
            )}
            {application.startedAt && (
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Started</p>
                  <p className="text-xs text-muted-foreground">
                    {format(application.startedAt, 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
            )}
            {application.completedAt && (
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-xs text-muted-foreground">
                    {format(application.completedAt, 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        {application.status === 'applied' && (
          <>
            <Button
              variant="outline"
              onClick={() => onAction(application.id, 'reject')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onAction(application.id, 'approve')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </>
        )}
        {application.status === 'shortlisted' && (
          <Button
            onClick={() => onAction(application.id, 'start')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Start Internship
          </Button>
        )}
        {application.status === 'ongoing' && (
          <Button
            onClick={() => onAction(application.id, 'complete')}
          >
            <Award className="h-4 w-4 mr-2" />
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
