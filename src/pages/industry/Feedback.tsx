

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
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Users,
  Calendar,
  Flag,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { 
  mockIndustry, 
  mockStudents, 
  mockApplications, 
  mockInternships, 
  mockFeedback 
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function FeedbackPage() {
  const [currentUser] = useState(mockIndustry[0]);
  const [students, setStudents] = useState(mockStudents);
  const [applications, setApplications] = useState(mockApplications);
  const [internships, setInternships] = useState(mockInternships);
  const [feedback, setFeedback] = useState(mockFeedback);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Get company internships
  const companyInternships = internships.filter(i => i.company === currentUser.companyName);
  
  // Get students with applications to company internships
  const companyStudents = applications
    .filter(app => companyInternships.some(i => i.id === app.internshipId))
    .map(app => {
      const student = students.find(s => s.id === app.studentId);
      const internship = companyInternships.find(i => i.id === app.internshipId);
      const studentFeedback = feedback.filter(f => f.studentId === app.studentId);
      
      return { 
        ...app, 
        student, 
        internship, 
        feedback: studentFeedback
      };
    })
    .filter(item => item.student);

  // Filter feedback
  const filteredFeedback = feedback.filter(fb => {
    const student = companyStudents.find(s => s.studentId === fb.studentId);
    const matchesSearch = student?.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fb.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || fb.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || fb.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  // Calculate stats
  const totalFeedback = filteredFeedback.length;
  const activeFeedback = feedback.filter(f => f.status === 'active').length;
  const resolvedFeedback = feedback.filter(f => f.status === 'resolved').length;
  const highPriorityFeedback = feedback.filter(f => f.priority === 'high').length;

  const handleCreateFeedback = (studentId: string) => {
    setSelectedStudent(studentId);
    setIsCreateDialogOpen(true);
  };

  const handleSubmitFeedback = (feedbackData: any) => {
    // Mock submit feedback
    console.log('Submitting feedback:', feedbackData);
    setIsCreateDialogOpen(false);
  };

  const handleResolveFeedback = (feedbackId: string) => {
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId ? { ...f, status: 'resolved' as const } : f
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'praise': return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'suggestion': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'concern': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'general': return <MessageSquare className="h-4 w-4 text-gray-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'archived': return <Flag className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
              <h1 className="text-3xl font-bold">Feedback Management</h1>
              <p className="text-muted-foreground">
                Send feedback to students and track communication history.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Feedback</DialogTitle>
                  <DialogDescription>
                    Provide feedback to a student about their performance or behavior.
                  </DialogDescription>
                </DialogHeader>
                <FeedbackForm 
                  students={companyStudents}
                  selectedStudent={selectedStudent}
                  onSubmit={handleSubmitFeedback}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  All time feedback
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  Pending resolution
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully resolved
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highPriorityFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
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
                    placeholder="Search feedback by student name, title, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Feedback Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="students">By Student</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredFeedback.map((fb) => {
                const student = companyStudents.find(s => s.studentId === fb.studentId);
                if (!student?.student || !student?.internship) return null;

                return (
                  <Card key={fb.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(fb.type)}
                              <h3 className="font-semibold">{fb.title}</h3>
                            </div>
                            <Badge className={getPriorityColor(fb.priority)}>
                              {fb.priority}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getStatusIcon(fb.status)}
                              {fb.status}
                            </Badge>
                            {fb.isPublic && (
                              <Badge variant="secondary">Public</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            To: {student.student.name} • {student.internship.title}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format(fb.createdAt, 'MMM dd, yyyy • h:mm a')}
                          </p>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">{fb.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {fb.status === 'active' && (
                            <Button 
                              size="sm"
                              onClick={() => handleResolveFeedback(fb.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {filteredFeedback.filter(fb => fb.status === 'active').map((fb) => {
                const student = companyStudents.find(s => s.studentId === fb.studentId);
                if (!student?.student || !student?.internship) return null;

                return (
                  <Card key={fb.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(fb.type)}
                              <h3 className="font-semibold">{fb.title}</h3>
                            </div>
                            <Badge className={getPriorityColor(fb.priority)}>
                              {fb.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            To: {student.student.name} • {student.internship.title}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format(fb.createdAt, 'MMM dd, yyyy • h:mm a')}
                          </p>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">{fb.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleResolveFeedback(fb.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              {companyStudents.map((student) => {
                if (!student.student || !student.internship) return null;

                const studentFeedback = student.feedback;

                return (
                  <Card key={student.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{student.student.name}</h3>
                            <StatusBadge status={student.status} />
                            <Badge variant="outline">
                              {studentFeedback.length} feedback
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {student.internship.title} • {student.student.studentId}
                          </p>

                          {studentFeedback.length > 0 ? (
                            <div className="space-y-3">
                              {studentFeedback.slice(0, 3).map((fb) => (
                                <div key={fb.id} className="p-3 border rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center gap-1">
                                      {getTypeIcon(fb.type)}
                                      <span className="font-medium text-sm">{fb.title}</span>
                                    </div>
                                    <Badge className={getPriorityColor(fb.priority)}>
                                      {fb.priority}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      {getStatusIcon(fb.status)}
                                      {fb.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {format(fb.createdAt, 'MMM dd, yyyy')}
                                  </p>
                                  <p className="text-sm">{fb.message}</p>
                                </div>
                              ))}
                              {studentFeedback.length > 3 && (
                                <p className="text-sm text-muted-foreground text-center">
                                  +{studentFeedback.length - 3} more feedback items
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">No feedback yet</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCreateFeedback(student.studentId)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Send Feedback
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Feedback Form Component
function FeedbackForm({ students, selectedStudent, onSubmit }: {
  students: any[];
  selectedStudent: string;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    studentId: selectedStudent,
    type: 'general',
    title: '',
    message: '',
    isPublic: true,
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fromUserId: '5', // Current industry user
      toUserId: formData.studentId,
      applicationId: students.find(s => s.studentId === formData.studentId)?.id || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student">Student</Label>
        <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.studentId} value={student.studentId}>
                {student.student?.name} - {student.internship?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="praise">Praise</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="concern">Concern</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief title for the feedback"
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Detailed feedback message..."
          rows={4}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="public"
          checked={formData.isPublic}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
        />
        <Label htmlFor="public">Make this feedback public</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSubmit({})}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="h-4 w-4 mr-2" />
          Send Feedback
        </Button>
      </div>
    </form>
  );
}
