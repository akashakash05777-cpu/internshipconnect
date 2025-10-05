

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
  Star, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  mockIndustry, 
  mockStudents, 
  mockApplications, 
  mockInternships, 
  mockEvaluations, 
  mockPerformanceMetrics 
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function EvaluationsPage() {
  const [currentUser] = useState(mockIndustry[0]);
  const [students, setStudents] = useState(mockStudents);
  const [applications, setApplications] = useState(mockApplications);
  const [internships, setInternships] = useState(mockInternships);
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
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
      const studentEvaluations = evaluations.filter(e => e.studentId === app.studentId);
      const studentMetrics = performanceMetrics.filter(m => m.studentId === app.studentId);
      
      return { 
        ...app, 
        student, 
        internship, 
        evaluations: studentEvaluations,
        metrics: studentMetrics
      };
    })
    .filter(item => item.student);

  // Filter evaluations
  const filteredEvaluations = evaluations.filter(evaluation => {
    const student = companyStudents.find(s => s.studentId === evaluation.studentId);
    const matchesSearch = student?.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student?.internship?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || evaluation.evaluationType === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalEvaluations = filteredEvaluations.length;
  const averageRating = evaluations.length > 0 
    ? evaluations.reduce((sum, e) => sum + e.overallRating, 0) / evaluations.length 
    : 0;
  const recommendedCount = evaluations.filter(e => e.isRecommended).length;
  const recentEvaluations = evaluations
    .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime())
    .slice(0, 5);

  const handleCreateEvaluation = (studentId: string) => {
    setSelectedStudent(studentId);
    setIsCreateDialogOpen(true);
  };

  const handleSubmitEvaluation = (evaluationData: any) => {
    // Mock submit evaluation
    console.log('Submitting evaluation:', evaluationData);
    setIsCreateDialogOpen(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadgeVariant = (rating: number) => {
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
              <h1 className="text-3xl font-bold">Student Evaluations</h1>
              <p className="text-muted-foreground">
                Evaluate student performance and track their progress throughout the internship.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Evaluation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Evaluation</DialogTitle>
                  <DialogDescription>
                    Evaluate a student's performance across different criteria.
                  </DialogDescription>
                </DialogHeader>
                <EvaluationForm 
                  students={companyStudents}
                  selectedStudent={selectedStudent}
                  onSubmit={handleSubmitEvaluation}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEvaluations}</div>
                <p className="text-xs text-muted-foreground">
                  All time evaluations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 10
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommended</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recommendedCount}</div>
                <p className="text-xs text-muted-foreground">
                  Students recommended
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {evaluations.filter(e => 
                    new Date(e.evaluationDate).getMonth() === new Date().getMonth()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Evaluations this month
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
                    placeholder="Search evaluations by student name or internship..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Evaluation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="midterm">Midterm</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Evaluations List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Evaluations</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="students">By Student</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredEvaluations.map((evaluation) => {
                const student = companyStudents.find(s => s.studentId === evaluation.studentId);
                if (!student?.student || !student?.internship) return null;

                return (
                  <Card key={evaluation.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{student.student.name}</h3>
                            <Badge variant="outline">{evaluation.evaluationType}</Badge>
                            <Badge variant={getRatingBadgeVariant(evaluation.overallRating)}>
                              {evaluation.overallRating}/10
                            </Badge>
                            {evaluation.isRecommended && (
                              <Badge variant="default">
                                <Award className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {student.internship.title} • {student.student.studentId}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Evaluated on {format(evaluation.evaluationDate, 'MMM dd, yyyy')}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold">{evaluation.technicalSkills.score}</div>
                              <p className="text-xs text-muted-foreground">Technical</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{evaluation.communicationSkills.score}</div>
                              <p className="text-xs text-muted-foreground">Communication</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{evaluation.problemSolving.score}</div>
                              <p className="text-xs text-muted-foreground">Problem Solving</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{evaluation.teamwork.score}</div>
                              <p className="text-xs text-muted-foreground">Teamwork</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{evaluation.punctuality.score}</div>
                              <p className="text-xs text-muted-foreground">Punctuality</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Strengths</h4>
                              <div className="flex flex-wrap gap-1">
                                {evaluation.strengths.map((strength, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {evaluation.areasForImprovement.length > 0 && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Areas for Improvement</h4>
                                <div className="flex flex-wrap gap-1">
                                  {evaluation.areasForImprovement.map((area, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {recentEvaluations.map((evaluation) => {
                const student = companyStudents.find(s => s.studentId === evaluation.studentId);
                if (!student?.student || !student?.internship) return null;

                return (
                  <Card key={evaluation.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{student.student.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {student.internship.title} • {evaluation.evaluationType}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getRatingColor(evaluation.overallRating)}`}>
                            {evaluation.overallRating}/10
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(evaluation.evaluationDate, 'MMM dd, yyyy')}
                          </p>
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

                const studentEvaluations = student.evaluations;
                const latestEvaluation = studentEvaluations[studentEvaluations.length - 1];

                return (
                  <Card key={student.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{student.student.name}</h3>
                            <StatusBadge status={student.status} />
                            {latestEvaluation && (
                              <Badge variant={getRatingBadgeVariant(latestEvaluation.overallRating)}>
                                {latestEvaluation.overallRating}/10
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {student.internship.title} • {student.student.studentId}
                          </p>

                          {studentEvaluations.length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">
                                  {studentEvaluations.length} evaluation{studentEvaluations.length > 1 ? 's' : ''}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  Latest: {format(studentEvaluations[studentEvaluations.length - 1].evaluationDate, 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {studentEvaluations.map((evaluation, index) => (
                                  <div key={evaluation.id} className="text-center p-2 border rounded">
                                    <div className="text-sm font-semibold">{evaluation.overallRating}</div>
                                    <p className="text-xs text-muted-foreground">{evaluation.evaluationType}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">No evaluations yet</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCreateEvaluation(student.studentId)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Evaluate
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

// Evaluation Form Component
function EvaluationForm({ students, selectedStudent, onSubmit }: {
  students: any[];
  selectedStudent: string;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    studentId: selectedStudent,
    evaluationType: 'weekly',
    technicalSkills: { score: 5, comments: '' },
    communicationSkills: { score: 5, comments: '' },
    problemSolving: { score: 5, comments: '' },
    teamwork: { score: 5, comments: '' },
    punctuality: { score: 5, comments: '' },
    strengths: [] as string[],
    areasForImprovement: [] as string[],
    recommendations: '',
    isRecommended: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const overallRating = (
      formData.technicalSkills.score +
      formData.communicationSkills.score +
      formData.problemSolving.score +
      formData.teamwork.score +
      formData.punctuality.score
    ) / 5;

    onSubmit({
      ...formData,
      overallRating: Math.round(overallRating * 10) / 10,
      evaluationDate: new Date(),
      evaluatorId: '5', // Current industry user
      applicationId: students.find(s => s.studentId === formData.studentId)?.id || '',
      internshipId: students.find(s => s.studentId === formData.studentId)?.internshipId || ''
    });
  };

  const handleScoreChange = (category: string, score: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev] as any, score }
    }));
  };

  const handleCommentsChange = (category: string, comments: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev] as any, comments }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="type">Evaluation Type</Label>
          <Select value={formData.evaluationType} onValueChange={(value) => setFormData(prev => ({ ...prev, evaluationType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="midterm">Midterm</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {['technicalSkills', 'communicationSkills', 'problemSolving', 'teamwork', 'punctuality'].map((category) => (
          <div key={category} className="space-y-2">
            <Label className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm w-20">Score:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={formData[category as keyof typeof formData].score}
                onChange={(e) => handleScoreChange(category, parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-8">{formData[category as keyof typeof formData].score}</span>
            </div>
            <Textarea
              placeholder={`Comments for ${category.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}...`}
              value={formData[category as keyof typeof formData].comments}
              onChange={(e) => handleCommentsChange(category, e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="recommended"
          checked={formData.isRecommended}
          onChange={(e) => setFormData(prev => ({ ...prev, isRecommended: e.target.checked }))}
        />
        <Label htmlFor="recommended">Recommend this student</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSubmit({})}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Evaluation
        </Button>
      </div>
    </form>
  );
}
