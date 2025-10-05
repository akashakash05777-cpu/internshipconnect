

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
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Building2,
  Calendar,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Award,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  mockAdmin, 
  mockApplications, 
  mockStudents, 
  mockInternships,
  mockIndustry
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function ApplicationsPage() {
  const [currentUser] = useState(mockAdmin[0]);
  const [applications, setApplications] = useState(mockApplications);
  const [students, setStudents] = useState(mockStudents);
  const [internships, setInternships] = useState(mockInternships);
  const [industry, setIndustry] = useState(mockIndustry);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInternship, setSelectedInternship] = useState<string>('all');
  const [viewingApplication, setViewingApplication] = useState<string | null>(null);

  // Filter applications
  const filteredApplications = applications.filter(application => {
    const student = students.find(s => s.id === application.studentId);
    const internship = internships.find(i => i.id === application.internshipId);
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
    const matchesInternship = selectedInternship === 'all' || application.internshipId === selectedInternship;
    
    return matchesSearch && matchesStatus && matchesInternship;
  });

  // Calculate stats
  const totalApplications = applications.length;
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const ongoingCount = applications.filter(a => a.status === 'ongoing').length;
  const completedCount = applications.filter(a => a.status === 'completed').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  const handleViewApplication = (applicationId: string) => {
    setViewingApplication(applicationId);
  };

  const handleUpdateStatus = (applicationId: string, newStatus: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus as any, updatedAt: new Date() } : app
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ongoing': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'completed': return <Award className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shortlisted': return 'text-green-600 bg-green-50 border-green-200';
      case 'ongoing': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
              <h1 className="text-3xl font-bold">Application Management</h1>
              <p className="text-muted-foreground">
                Manage and track all internship applications across the platform.
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
                <CardTitle className="text-sm font-medium">Applied</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appliedCount}</div>
                <p className="text-xs text-muted-foreground">
                  Pending review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shortlistedCount}</div>
                <p className="text-xs text-muted-foreground">
                  Selected candidates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ongoingCount}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully finished
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
                    placeholder="Search applications by student name, internship, or ID..."
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
                    {internships.map((internship) => (
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
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredApplications.map((application) => {
                const student = students.find(s => s.id === application.studentId);
                const internship = internships.find(i => i.id === application.internshipId);
                const company = industry.find(c => c.companyName === internship?.company);

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name}</h3>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {student?.studentId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Applied for: {internship?.title} at {company?.companyName}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Applied: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{internship?.domain}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>CGPA: {student?.cgpa}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{student?.department}</span>
                            </div>
                          </div>

                          {application.coverLetter && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm mb-1">Cover Letter</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Skills</h4>
                              <div className="flex flex-wrap gap-1">
                                {student?.skills?.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
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
                            View
                          </Button>
                          <Select value={application.status} onValueChange={(value) => handleUpdateStatus(application.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="applied">Applied</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="applied" className="space-y-4">
              {filteredApplications.filter(a => a.status === 'applied').map((application) => {
                const student = students.find(s => s.id === application.studentId);
                const internship = internships.find(i => i.id === application.internshipId);
                const company = industry.find(c => c.companyName === internship?.company);

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name}</h3>
                            <Badge className="text-blue-600 bg-blue-50 border-blue-200">
                              Applied
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {student?.studentId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Applied for: {internship?.title} at {company?.companyName}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Applied: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>CGPA: {student?.cgpa}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{student?.department}</span>
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
                            Review
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(application.id, 'shortlisted')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Shortlist
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
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
              {filteredApplications.filter(a => a.status === 'shortlisted').map((application) => {
                const student = students.find(s => s.id === application.studentId);
                const internship = internships.find(i => i.id === application.internshipId);
                const company = industry.find(c => c.companyName === internship?.company);

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name}</h3>
                            <Badge className="text-green-600 bg-green-50 border-green-200">
                              Shortlisted
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {student?.studentId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Shortlisted for: {internship?.title} at {company?.companyName}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Applied: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>CGPA: {student?.cgpa}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{student?.department}</span>
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
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(application.id, 'ongoing')}
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="ongoing" className="space-y-4">
              {filteredApplications.filter(a => a.status === 'ongoing').map((application) => {
                const student = students.find(s => s.id === application.studentId);
                const internship = internships.find(i => i.id === application.internshipId);
                const company = industry.find(c => c.companyName === internship?.company);

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name}</h3>
                            <Badge className="text-purple-600 bg-purple-50 border-purple-200">
                              Ongoing
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {student?.studentId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Currently interning at: {company?.companyName}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Started: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>CGPA: {student?.cgpa}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{student?.department}</span>
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
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(application.id, 'completed')}
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
              {filteredApplications.filter(a => a.status === 'completed').map((application) => {
                const student = students.find(s => s.id === application.studentId);
                const internship = internships.find(i => i.id === application.internshipId);
                const company = industry.find(c => c.companyName === internship?.company);

                return (
                  <Card key={application.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name}</h3>
                            <Badge className="text-green-600 bg-green-50 border-green-200">
                              Completed
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {student?.studentId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Completed internship at: {company?.companyName}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Completed: {format(application.appliedAt, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>CGPA: {student?.cgpa}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{student?.department}</span>
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>

          {/* Application Detail Dialog */}
          <Dialog open={!!viewingApplication} onOpenChange={() => setViewingApplication(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Complete information about this internship application
                </DialogDescription>
              </DialogHeader>
              {viewingApplication && (
                <ApplicationDetail 
                  application={applications.find(a => a.id === viewingApplication)}
                  student={students.find(s => s.id === applications.find(a => a.id === viewingApplication)?.studentId)}
                  internship={internships.find(i => i.id === applications.find(a => a.id === viewingApplication)?.internshipId)}
                  company={industry.find(c => c.companyName === internships.find(i => i.id === applications.find(a => a.id === viewingApplication)?.internshipId)?.company)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Application Detail Component
function ApplicationDetail({ application, student, internship, company }: {
  application: any;
  student: any;
  internship: any;
  company: any;
}) {
  if (!application || !student || !internship) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm">{student.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Student ID</Label>
              <p className="text-sm">{student.studentId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm">{student.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Department</Label>
              <p className="text-sm">{student.department}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Year</Label>
              <p className="text-sm">Year {student.year}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">CGPA</Label>
              <p className="text-sm">{student.cgpa}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Internship Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Title</Label>
              <p className="text-sm">{internship.title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Company</Label>
              <p className="text-sm">{company?.companyName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Domain</Label>
              <p className="text-sm">{internship.domain}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Duration</Label>
              <p className="text-sm">{internship.duration} weeks</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Credits</Label>
              <p className="text-sm">{internship.credits}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Location</Label>
              <p className="text-sm">{internship.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <div className="mt-1">
              <StatusBadge status={application.status} />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Applied Date</Label>
            <p className="text-sm">{format(application.appliedAt, 'MMMM dd, yyyy')}</p>
          </div>
          {application.coverLetter && (
            <div>
              <Label className="text-sm font-medium">Cover Letter</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>
          )}
          {student.skills && student.skills.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Skills</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {student.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
