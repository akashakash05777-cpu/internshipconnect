

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
  Plus, 
  Eye, 
  Edit, 
  Download,
  Calendar,
  Building2,
  Users,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileSignature,
  ExternalLink
} from 'lucide-react';
import { 
  mockIndustry, 
  mockMous
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

export default function MoUsPage() {
  const [currentUser] = useState(mockIndustry[0]);
  const [mous, setMous] = useState(mockMous);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMou, setEditingMou] = useState<string | null>(null);

  // Get company MoUs
  const companyMous = mous.filter(m => m.companyName === currentUser.companyName);
  
  // Filter MoUs
  const filteredMous = companyMous.filter(mou => {
    const matchesSearch = mou.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mou.scopeOfWork.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || mou.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalMous = companyMous.length;
  const activeMous = companyMous.filter(m => m.status === 'active').length;
  const pendingMous = companyMous.filter(m => m.status === 'pending_signatures').length;
  const expiringMous = companyMous.filter(m => m.status === 'expiring').length;

  const handleCreateMou = () => {
    setEditingMou(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditMou = (mouId: string) => {
    setEditingMou(mouId);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteMou = (mouId: string) => {
    setMous(prev => prev.filter(m => m.id !== mouId));
  };

  const handleSubmitMou = (mouData: any) => {
    if (editingMou) {
      // Update existing MoU
      setMous(prev => prev.map(m => 
        m.id === editingMou ? { ...m, ...mouData, updatedAt: new Date() } : m
      ));
    } else {
      // Create new MoU
      const newMou = {
        ...mouData,
        id: Date.now().toString(),
        companyName: currentUser.companyName,
        status: 'draft' as const,
        version: 1,
        versionHistory: [{
          version: 1,
          changes: 'Initial MoU creation',
          updatedBy: currentUser.name,
          updatedAt: new Date()
        }],
        signatures: {
          industry: { signed: false },
          college: { signed: false }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setMous(prev => [...prev, newMou]);
    }
    setIsCreateDialogOpen(false);
    setEditingMou(null);
  };

  const handleSignMou = (mouId: string) => {
    setMous(prev => prev.map(m => 
      m.id === mouId 
        ? { 
            ...m, 
            signatures: {
              ...m.signatures,
              industry: {
                signed: true,
                signedAt: new Date(),
                signedBy: currentUser.name
              }
            },
            status: m.signatures.college.signed ? 'active' : 'pending_signatures',
            updatedAt: new Date()
          }
        : m
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending_signatures': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'expiring': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'terminated': return 'text-red-600 bg-red-50 border-red-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending_signatures': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'expiring': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'terminated': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isExpiringSoon = (endDate: Date) => {
    const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
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
              <h1 className="text-3xl font-bold">Memorandum of Understanding (MoUs)</h1>
              <p className="text-muted-foreground">
                Manage MoUs with educational institutions for internship programs.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateMou}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create MoU
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMou ? 'Edit MoU' : 'Create New MoU'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMou 
                      ? 'Update the MoU details below.'
                      : 'Fill in the details to create a new MoU with an educational institution.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <MoUForm 
                  mou={editingMou ? companyMous.find(m => m.id === editingMou) : null}
                  onSubmit={handleSubmitMou}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total MoUs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMous}</div>
                <p className="text-xs text-muted-foreground">
                  All time MoUs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active MoUs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMous}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingMous}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting signatures
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiringMous}</div>
                <p className="text-xs text-muted-foreground">
                  Within 30 days
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
                    placeholder="Search MoUs by title or scope of work..."
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_signatures">Pending Signatures</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* MoUs List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All MoUs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expiring">Expiring</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredMous.map((mou) => {
                const isExpiring = isExpiringSoon(mou.endDate);
                const industrySigned = mou.signatures.industry.signed;
                const collegeSigned = mou.signatures.college.signed;

                return (
                  <Card key={mou.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{mou.title}</h3>
                            <Badge className={getStatusColor(mou.status)}>
                              {mou.status.replace('_', ' ')}
                            </Badge>
                            {isExpiring && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Expiring Soon
                              </Badge>
                            )}
                            <Badge variant="outline">v{mou.version}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {mou.scopeOfWork}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Start: {format(mou.startDate, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>End: {format(mou.endDate, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>{mou.credits} credits</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{mou.slots} slots</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Mentor Details</h4>
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm font-medium">{mou.mentorDetails.name}</p>
                                <p className="text-sm text-muted-foreground">{mou.mentorDetails.designation}</p>
                                <p className="text-sm text-muted-foreground">{mou.mentorDetails.email}</p>
                                <p className="text-sm text-muted-foreground">{mou.mentorDetails.phone}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm mb-2">Signatures</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  {industrySigned ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                  )}
                                  <span className="text-sm">
                                    Industry: {industrySigned ? 'Signed' : 'Pending'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {collegeSigned ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                  )}
                                  <span className="text-sm">
                                    College: {collegeSigned ? 'Signed' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                              {industrySigned && mou.signatures.industry.signedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Signed by {mou.signatures.industry.signedBy} on {format(mou.signatures.industry.signedAt, 'MMM dd, yyyy')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {mou.pdfUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          )}
                          {!industrySigned && (
                            <Button 
                              size="sm"
                              onClick={() => handleSignMou(mou.id)}
                            >
                              <FileSignature className="h-4 w-4 mr-1" />
                              Sign
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditMou(mou.id)}
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

            <TabsContent value="active" className="space-y-4">
              {filteredMous.filter(m => m.status === 'active').map((mou) => {
                const isExpiring = isExpiringSoon(mou.endDate);

                return (
                  <Card key={mou.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{mou.title}</h3>
                            <Badge className="text-green-600 bg-green-50 border-green-200">
                              Active
                            </Badge>
                            {isExpiring && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Expiring Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {mou.scopeOfWork}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Ends: {format(mou.endDate, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span>{mou.credits} credits</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{mou.slots} slots</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{mou.internshipType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {mou.pdfUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filteredMous.filter(m => m.status === 'pending_signatures').map((mou) => {
                const industrySigned = mou.signatures.industry.signed;
                const collegeSigned = mou.signatures.college.signed;

                return (
                  <Card key={mou.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{mou.title}</h3>
                            <Badge className="text-yellow-600 bg-yellow-50 border-yellow-200">
                              Pending Signatures
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {mou.scopeOfWork}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {industrySigned ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="text-sm">
                                Industry: {industrySigned ? 'Signed' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {collegeSigned ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="text-sm">
                                College: {collegeSigned ? 'Signed' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!industrySigned && (
                            <Button 
                              size="sm"
                              onClick={() => handleSignMou(mou.id)}
                            >
                              <FileSignature className="h-4 w-4 mr-1" />
                              Sign
                            </Button>
                          )}
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

            <TabsContent value="expiring" className="space-y-4">
              {filteredMous.filter(m => isExpiringSoon(m.endDate)).map((mou) => {
                return (
                  <Card key={mou.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{mou.title}</h3>
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {mou.scopeOfWork}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span>Expires on {format(mou.endDate, 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Renew
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

// MoU Form Component
function MoUForm({ mou, onSubmit }: {
  mou: any;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: mou?.title || '',
    scopeOfWork: mou?.scopeOfWork || '',
    internshipType: mou?.internshipType || 'remote',
    startDate: mou?.startDate ? format(mou.startDate, 'yyyy-MM-dd') : '',
    endDate: mou?.endDate ? format(mou.endDate, 'yyyy-MM-dd') : '',
    credits: mou?.credits || 4,
    slots: mou?.slots || 10,
    mentorDetails: {
      name: mou?.mentorDetails?.name || '',
      email: mou?.mentorDetails?.email || '',
      designation: mou?.mentorDetails?.designation || '',
      phone: mou?.mentorDetails?.phone || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mouData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    };
    onSubmit(mouData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">MoU Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., TechCorp Solutions - Web Development Internship Program"
          required
        />
      </div>

      <div>
        <Label htmlFor="scopeOfWork">Scope of Work</Label>
        <Textarea
          id="scopeOfWork"
          value={formData.scopeOfWork}
          onChange={(e) => setFormData(prev => ({ ...prev, scopeOfWork: e.target.value }))}
          placeholder="Describe the scope of work and internship program details..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="internshipType">Internship Type</Label>
          <Select value={formData.internshipType} onValueChange={(value) => setFormData(prev => ({ ...prev, internshipType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="slots">Number of Slots</Label>
          <Input
            id="slots"
            type="number"
            value={formData.slots}
            onChange={(e) => setFormData(prev => ({ ...prev, slots: parseInt(e.target.value) }))}
            min="1"
            max="100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
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

      <div className="space-y-4">
        <h4 className="font-medium">Mentor Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mentorName">Mentor Name</Label>
            <Input
              id="mentorName"
              value={formData.mentorDetails.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                mentorDetails: { ...prev.mentorDetails, name: e.target.value }
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
              value={formData.mentorDetails.email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                mentorDetails: { ...prev.mentorDetails, email: e.target.value }
              }))}
              placeholder="mentor@company.com"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mentorDesignation">Mentor Designation</Label>
            <Input
              id="mentorDesignation"
              value={formData.mentorDetails.designation}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                mentorDetails: { ...prev.mentorDetails, designation: e.target.value }
              }))}
              placeholder="e.g., Senior Developer"
              required
            />
          </div>
          <div>
            <Label htmlFor="mentorPhone">Mentor Phone</Label>
            <Input
              id="mentorPhone"
              value={formData.mentorDetails.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                mentorDetails: { ...prev.mentorDetails, phone: e.target.value }
              }))}
              placeholder="+1-555-0123"
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
          {mou ? 'Update MoU' : 'Create MoU'}
        </Button>
      </div>
    </form>
  );
}
