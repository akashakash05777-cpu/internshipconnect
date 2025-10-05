

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
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Building2
} from 'lucide-react';
import { 
  mockIndustry, 
  mockInternships, 
  mockApplications,
  mockMous
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function PostingsPage() {
  const [currentUser] = useState(mockIndustry[0]);
  const [internships, setInternships] = useState(mockInternships);
  const [applications, setApplications] = useState(mockApplications);
  const [mous, setMous] = useState(mockMous);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPosting, setEditingPosting] = useState<string | null>(null);

  // Get company internships
  const companyInternships = internships.filter(i => i.company === currentUser.companyName);
  
  // Filter internships
  const filteredInternships = companyInternships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || internship.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPostings = companyInternships.length;
  const activePostings = companyInternships.filter(i => i.status === 'active').length;
  const closedPostings = companyInternships.filter(i => i.status === 'closed').length;
  const totalApplications = applications.filter(app => 
    companyInternships.some(i => i.id === app.internshipId)
  ).length;

  const handleCreatePosting = () => {
    setEditingPosting(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditPosting = (postingId: string) => {
    setEditingPosting(postingId);
    setIsCreateDialogOpen(true);
  };

  const handleDeletePosting = (postingId: string) => {
    setInternships(prev => prev.filter(i => i.id !== postingId));
  };

  const handleSubmitPosting = (postingData: any) => {
    if (editingPosting) {
      // Update existing posting
      setInternships(prev => prev.map(i => 
        i.id === editingPosting ? { ...i, ...postingData, updatedAt: new Date() } : i
      ));
    } else {
      // Create new posting
      const newPosting = {
        ...postingData,
        id: Date.now().toString(),
        company: currentUser.companyName,
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setInternships(prev => [...prev, newPosting]);
    }
    setIsCreateDialogOpen(false);
    setEditingPosting(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'closed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getApplicationCount = (internshipId: string) => {
    return applications.filter(app => app.internshipId === internshipId).length;
  };

  const getShortlistedCount = (internshipId: string) => {
    return applications.filter(app => 
      app.internshipId === internshipId && 
      (app.status === 'shortlisted' || app.status === 'ongoing')
    ).length;
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
              <h1 className="text-3xl font-bold">Internship Postings</h1>
              <p className="text-muted-foreground">
                Create and manage internship opportunities for students.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreatePosting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Posting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPosting ? 'Edit Internship Posting' : 'Create New Internship Posting'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPosting 
                      ? 'Update the internship posting details below.'
                      : 'Fill in the details to create a new internship posting.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <PostingForm 
                  posting={editingPosting ? companyInternships.find(i => i.id === editingPosting) : null}
                  mous={mous.filter(m => m.companyName === currentUser.companyName)}
                  onSubmit={handleSubmitPosting}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Postings</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPostings}</div>
                <p className="text-xs text-muted-foreground">
                  All time postings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Postings</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePostings}</div>
                <p className="text-xs text-muted-foreground">
                  Currently open
                </p>
              </CardContent>
            </Card>
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
                <CardTitle className="text-sm font-medium">Closed Postings</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{closedPostings}</div>
                <p className="text-xs text-muted-foreground">
                  No longer accepting
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
                    placeholder="Search postings by title, domain, or location..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Postings List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Postings</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredInternships.map((internship) => {
                const applicationCount = getApplicationCount(internship.id);
                const shortlistedCount = getShortlistedCount(internship.id);

                return (
                  <Card key={internship.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{internship.title}</h3>
                            <Badge className={getStatusColor(internship.status)}>
                              {internship.status}
                            </Badge>
                            {internship.mouId && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                MoU Linked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {internship.domain} • {internship.location}
                          </p>
                          <p className="text-sm mb-4">{internship.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{internship.duration} weeks</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>{internship.credits} credits</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{applicationCount} applications</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span>{shortlistedCount} shortlisted</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Required Skills</h4>
                              <div className="flex flex-wrap gap-1">
                                {internship.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Requirements</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {internship.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Mentor</h4>
                              <p className="text-sm text-muted-foreground">
                                {internship.mentor.name} - {internship.mentor.designation}
                              </p>
                              <p className="text-xs text-muted-foreground">{internship.mentor.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPosting(internship.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePosting(internship.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {filteredInternships.filter(i => i.status === 'active').map((internship) => {
                const applicationCount = getApplicationCount(internship.id);
                const shortlistedCount = getShortlistedCount(internship.id);

                return (
                  <Card key={internship.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{internship.title}</h3>
                            <Badge className="text-green-600 bg-green-50 border-green-200">
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {internship.domain} • {internship.location}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{internship.duration} weeks</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>{internship.credits} credits</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{applicationCount} applications</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span>{shortlistedCount} shortlisted</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPosting(internship.id)}
                          >
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

            <TabsContent value="closed" className="space-y-4">
              {filteredInternships.filter(i => i.status === 'closed').map((internship) => {
                const applicationCount = getApplicationCount(internship.id);
                const shortlistedCount = getShortlistedCount(internship.id);

                return (
                  <Card key={internship.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{internship.title}</h3>
                            <Badge className="text-red-600 bg-red-50 border-red-200">
                              Closed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {internship.domain} • {internship.location}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{internship.duration} weeks</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>{internship.credits} credits</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{applicationCount} applications</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span>{shortlistedCount} shortlisted</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Posting Form Component
function PostingForm({ posting, mous, onSubmit }: {
  posting: any;
  mous: any[];
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: posting?.title || '',
    description: posting?.description || '',
    domain: posting?.domain || '',
    location: posting?.location || '',
    duration: posting?.duration || 12,
    credits: posting?.credits || 4,
    skills: posting?.skills || [],
    requirements: posting?.requirements || [],
    mentor: {
      name: posting?.mentor?.name || '',
      email: posting?.mentor?.email || '',
      designation: posting?.mentor?.designation || ''
    },
    mouId: posting?.mouId || '',
    status: posting?.status || 'active'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Frontend Developer Intern"
            required
          />
        </div>
        <div>
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            value={formData.domain}
            onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
            placeholder="e.g., Web Development"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the internship role and responsibilities..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Remote, Onsite, Hybrid"
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (weeks)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            min="1"
            max="52"
            required
          />
        </div>
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
            min="1"
            max="20"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="mou">MoU (Optional)</Label>
        <Select value={formData.mouId} onValueChange={(value) => setFormData(prev => ({ ...prev, mouId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select MoU" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No MoU</SelectItem>
            {mous.map((mou) => (
              <SelectItem key={mou.id} value={mou.id}>
                {mou.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Required Skills</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>Requirements</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Add a requirement..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            />
            <Button type="button" onClick={addRequirement}>
              Add
            </Button>
          </div>
          <div className="space-y-1">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span className="flex-1">{req}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mentorName">Mentor Name</Label>
          <Input
            id="mentorName"
            value={formData.mentor.name}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              mentor: { ...prev.mentor, name: e.target.value }
            }))}
            placeholder="Mentor's full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="mentorEmail">Mentor Email</Label>
          <Input
            id="mentorEmail"
            type="email"
            value={formData.mentor.email}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              mentor: { ...prev.mentor, email: e.target.value }
            }))}
            placeholder="mentor@company.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="mentorDesignation">Mentor Designation</Label>
          <Input
            id="mentorDesignation"
            value={formData.mentor.designation}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              mentor: { ...prev.mentor, designation: e.target.value }
            }))}
            placeholder="e.g., Senior Developer"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSubmit({})}>
          Cancel
        </Button>
        <Button type="submit">
          {posting ? 'Update Posting' : 'Create Posting'}
        </Button>
      </div>
    </form>
  );
}
