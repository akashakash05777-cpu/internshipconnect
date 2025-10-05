

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Award,
  Target,
  BarChart3
} from 'lucide-react';
import { 
  mockIndustry, 
  mockStudents, 
  mockApplications, 
  mockInternships, 
  mockEvaluations, 
  mockPerformanceMetrics, 
  mockFeedback, 
  mockStudentProgress 
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function StudentsPage() {
  const [currentUser] = useState(mockIndustry[0]);
  const [students, setStudents] = useState(mockStudents);
  const [applications, setApplications] = useState(mockApplications);
  const [internships, setInternships] = useState(mockInternships);
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);
  const [feedback, setFeedback] = useState(mockFeedback);
  const [studentProgress, setStudentProgress] = useState(mockStudentProgress);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Get company internships
  const companyInternships = internships.filter(i => i.company === currentUser.companyName);
  
  // Get students with applications to company internships
  const companyStudents = applications
    .filter(app => companyInternships.some(i => i.id === app.internshipId))
    .map(app => {
      const student = students.find(s => s.id === app.studentId);
      const internship = companyInternships.find(i => i.id === app.internshipId);
      const progress = studentProgress.find(p => p.applicationId === app.id);
      const studentEvaluations = evaluations.filter(e => e.studentId === app.studentId);
      const studentFeedback = feedback.filter(f => f.studentId === app.studentId);
      const studentMetrics = performanceMetrics.filter(m => m.studentId === app.studentId);
      
      return { 
        ...app, 
        student, 
        internship, 
        progress,
        evaluations: studentEvaluations,
        feedback: studentFeedback,
        metrics: studentMetrics
      };
    })
    .filter(item => item.student);

  // Filter students based on search and status
  const filteredStudents = companyStudents.filter(item => {
    const matchesSearch = item.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.student?.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.internship?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate overall stats
  const totalStudents = companyStudents.length;
  const activeStudents = companyStudents.filter(s => s.status === 'ongoing').length;
  const completedStudents = companyStudents.filter(s => s.status === 'completed').length;
  const averageRating = evaluations.length > 0 
    ? evaluations.reduce((sum, e) => sum + e.overallRating, 0) / evaluations.length 
    : 0;

  const handleViewProfile = (studentId: string) => {
    console.log('Viewing student profile:', studentId);
  };

  const handleSendFeedback = (studentId: string) => {
    console.log('Sending feedback to student:', studentId);
  };

  const handleEvaluateStudent = (studentId: string) => {
    console.log('Evaluating student:', studentId);
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadgeVariant = (rating: number) => {
    if (rating >= 8) return 'default';
    if (rating >= 6) return 'secondary';
    return 'destructive';
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
              <h1 className="text-3xl font-bold">Student Management</h1>
              <p className="text-muted-foreground">
                Manage and track your internship students' progress and performance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {totalStudents} Total Students
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {activeStudents} Active
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  All time students
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Currently working
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 10
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
                    placeholder="Search students by name, ID, or internship..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {filteredStudents.map((item) => {
                if (!item.student || !item.internship) return null;

                const latestEvaluation = item.evaluations[item.evaluations.length - 1];
                const progress = item.progress;

                return (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{item.student.name}</h3>
                              <StatusBadge status={item.status} />
                              {latestEvaluation && (
                                <Badge variant={getPerformanceBadgeVariant(latestEvaluation.overallRating)}>
                                  {latestEvaluation.overallRating}/10
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.student.studentId} • {item.student.department} • Year {item.student.year}
                            </p>
                            <p className="text-sm font-medium mb-2">{item.internship.title}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>CGPA: {item.student.cgpa}</span>
                              <span>Skills: {item.student.skills.slice(0, 3).join(', ')}</span>
                              <span>Started: {item.startedAt ? format(item.startedAt, 'MMM dd, yyyy') : 'Not started'}</span>
                            </div>
                            {progress && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{progress.completionPercentage}%</span>
                                </div>
                                <Progress value={progress.completionPercentage} className="h-2" />
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <span>Week {progress.currentWeek}/{progress.totalWeeks}</span>
                                  <span>{progress.tasksCompleted}/{progress.totalTasks} tasks</span>
                                  <span>{progress.hoursLogged}h logged</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(item.studentId)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendFeedback(item.studentId)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEvaluateStudent(item.studentId)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Evaluate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {filteredStudents.map((item) => {
                if (!item.student || !item.internship) return null;

                const latestEvaluation = item.evaluations[item.evaluations.length - 1];
                const studentMetrics = item.metrics;

                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.student.name}</CardTitle>
                          <CardDescription>{item.internship.title}</CardDescription>
                        </div>
                        {latestEvaluation && (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getPerformanceColor(latestEvaluation.overallRating)}`}>
                              {latestEvaluation.overallRating}/10
                            </div>
                            <p className="text-sm text-muted-foreground">Overall Rating</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {latestEvaluation ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold">{latestEvaluation.technicalSkills.score}</div>
                              <p className="text-xs text-muted-foreground">Technical</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{latestEvaluation.communicationSkills.score}</div>
                              <p className="text-xs text-muted-foreground">Communication</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{latestEvaluation.problemSolving.score}</div>
                              <p className="text-xs text-muted-foreground">Problem Solving</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{latestEvaluation.teamwork.score}</div>
                              <p className="text-xs text-muted-foreground">Teamwork</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{latestEvaluation.punctuality.score}</div>
                              <p className="text-xs text-muted-foreground">Punctuality</p>
                            </div>
                          </div>
                          
                          {studentMetrics.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Performance Metrics</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {studentMetrics.map((metric) => (
                                  <div key={metric.id} className="text-center p-3 border rounded-lg">
                                    <div className="text-lg font-semibold">
                                      {metric.value}/{metric.maxValue}
                                    </div>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {metric.metricType.replace('_', ' ')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="font-medium">Strengths</h4>
                            <div className="flex flex-wrap gap-1">
                              {latestEvaluation.strengths.map((strength, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {latestEvaluation.areasForImprovement.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Areas for Improvement</h4>
                              <div className="flex flex-wrap gap-1">
                                {latestEvaluation.areasForImprovement.map((area, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="font-semibold mb-2">No evaluations yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Evaluate this student to track their performance.
                          </p>
                          <Button onClick={() => handleEvaluateStudent(item.studentId)}>
                            <Star className="h-4 w-4 mr-2" />
                            Start Evaluation
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              {filteredStudents.map((item) => {
                if (!item.student || !item.internship || !item.progress) return null;

                const progress = item.progress;

                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.student.name}</CardTitle>
                          <CardDescription>{item.internship.title}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{progress.completionPercentage}%</div>
                          <p className="text-sm text-muted-foreground">Complete</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span>{progress.completionPercentage}%</span>
                          </div>
                          <Progress value={progress.completionPercentage} className="h-3" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-semibold">{progress.currentWeek}</div>
                            <p className="text-xs text-muted-foreground">Current Week</p>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-semibold">{progress.tasksCompleted}</div>
                            <p className="text-xs text-muted-foreground">Tasks Done</p>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-semibold">{progress.hoursLogged}</div>
                            <p className="text-xs text-muted-foreground">Hours Logged</p>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-lg font-semibold">
                              {Math.round((progress.hoursLogged / progress.expectedHours) * 100)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Hours Target</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Milestones</h4>
                          <div className="space-y-2">
                            {progress.milestones.map((milestone) => (
                              <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-medium">{milestone.title}</h5>
                                    <Badge 
                                      variant={
                                        milestone.status === 'completed' ? 'default' :
                                        milestone.status === 'in_progress' ? 'secondary' :
                                        milestone.status === 'overdue' ? 'destructive' : 'outline'
                                      }
                                      className="text-xs"
                                    >
                                      {milestone.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Target: {format(milestone.targetDate, 'MMM dd, yyyy')}
                                    {milestone.completedDate && (
                                      <span> • Completed: {format(milestone.completedDate, 'MMM dd, yyyy')}</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
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
