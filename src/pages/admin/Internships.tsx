

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
  Building2,
  FileText,
  TrendingUp,
  Download
} from 'lucide-react';
import { 
  mockAdmin, 
  mockInternships, 
  mockApplications,
  mockIndustry
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function InternshipsPage() {
  const [currentUser] = useState(mockAdmin[0]);
  const [internships, setInternships] = useState(mockInternships);
  const [applications, setApplications] = useState(mockApplications);
  const [industry, setIndustry] = useState(mockIndustry);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<string | null>(null);

  // Filter internships
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || internship.status === selectedStatus;
    const matchesCompany = selectedCompany === 'all' || internship.company === selectedCompany;
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  // Calculate stats
  const totalInternships = internships.length;
  const activeInternships = internships.filter(i => i.status === 'active').length;
  const inactiveInternships = internships.filter(i => i.status === 'inactive').length;
  const closedInternships = internships.filter(i => i.status === 'closed').length;
  const totalApplications = applications.length;
  const averageApplications = totalInternships > 0 ? Math.round(totalApplications / totalInternships) : 0;

  const handleCreateInternship = () => {
    setEditingInternship(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditInternship = (internshipId: string) => {
    setEditingInternship(internshipId);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteInternship = (internshipId: string) => {
    setInternships(prev => prev.filter(i => i.id !== internshipId));
  };

  const handleSubmitInternship = (internshipData: any) => {
    if (editingInternship) {
      // Update existing internship
      setInternships(prev => prev.map(i => 
        i.id === editingInternship ? { ...i, ...internshipData, updatedAt: new Date() } : i
      ));
    } else {
      // Create new internship
      const newInternship = {
        ...internshipData,
        id: Date.now().toString(),
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setInternships(prev => [...prev, newInternship]);
    }
    setIsCreateDialogOpen(false);
    setEditingInternship(null);
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
              <h1 className="text-3xl font-bold">Internship Management</h1>
              <p className="text-muted-foreground">
                Manage all internship postings across the platform.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreateInternship}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Internship
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingInternship ? 'Edit Internship' : 'Create New Internship'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingInternship 
                        ? 'Update the internship details below.'
                        : 'Fill in the details to create a new internship posting.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <InternshipForm 
                    internship={editingInternship ? internships.find(i => i.id === editingInternship) : null}
                    industry={industry}
                    onSubmit={handleSubmitInternship}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInternships}</div>
                <p className="text-xs text-muted-foreground">
                  All time postings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeInternships}</div>
                <p className="text-xs text-muted-foreground">
                  Currently open
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveInternships}</div>
                <p className="text-xs text-muted-foreground">
                  Temporarily closed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Closed</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{closedInternships}</div>
                <p className="text-xs text-muted-foreground">
                  No longer accepting
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Applications</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Per internship
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
                    placeholder="Search internships by title, domain, or company..."
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
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {industry.map((company) => (
                      <SelectItem key={company.id} value={company.companyName}>
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Internships List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Internships</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {internship.company}
                            </Badge>
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
                            onClick={() => handleEditInternship(internship.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteInternship(internship.id)}
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
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {internship.company}
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
                            onClick={() => handleEditInternship(internship.id)}
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

            <TabsContent value="inactive" className="space-y-4">
              {filteredInternships.filter(i => i.status === 'inactive').map((internship) => {
                const applicationCount = getApplicationCount(internship.id);
                const shortlistedCount = getShortlistedCount(internship.id);

                return (
                  <Card key={internship.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{internship.title}</h3>
                            <Badge className="text-yellow-600 bg-yellow-50 border-yellow-200">
                              Inactive
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {internship.company}
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
                            onClick={() => handleEditInternship(internship.id)}
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
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {internship.company}
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

// Internship Form Component
function InternshipForm({ internship, industry, onSubmit }: {
  internship: any;
  industry: any[];
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: internship?.title || '',
    description: internship?.description || '',
    company: internship?.company || '',
    domain: internship?.domain || '',
    location: internship?.location || '',
    duration: internship?.duration || 12,
    credits: internship?.credits || 4,
    skills: internship?.skills || [],
    requirements: internship?.requirements || [],
    mentor: {
      name: internship?.mentor?.name || '',
      email: internship?.mentor?.email || '',
      designation: internship?.mentor?.designation || ''
    },
    status: internship?.status || 'active'
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
          <Label htmlFor="company">Company</Label>
          <Select value={formData.company} onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {industry.map((company) => (
                <SelectItem key={company.id} value={company.companyName}>
                  {company.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            value={formData.domain}
            onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
            placeholder="e.g., Web Development"
            required
          />
        </div>
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
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="space-y-4">
        <h4 className="font-medium">Mentor Details</h4>
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
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSubmit({})}>
          Cancel
        </Button>
        <Button type="submit">
          {internship ? 'Update Internship' : 'Create Internship'}
        </Button>
      </div>
    </form>
  );
}
