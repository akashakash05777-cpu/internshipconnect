

import { useState, useEffect, memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Calendar,
  Building2,
  Users,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Save
} from 'lucide-react';
import { mockAdmin, mockMous } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoU } from '@/types';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Import MoUForm directly for now (can be lazy loaded later)
import MoUForm from './MoUForm';

export default function MoURegistry() {
  const [currentUser] = useState(mockAdmin[0]);
  const [mous, setMous] = useState<MoU[]>(mockMous);
  const [filteredMous, setFilteredMous] = useState<MoU[]>(mous);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMou, setEditingMou] = useState<string | null>(null);
  const [viewingMou, setViewingMou] = useState<string | null>(null);

  // Filter MoUs based on search and status
  useEffect(() => {
    let filtered = mous;

    if (searchQuery) {
      filtered = filtered.filter(mou =>
        mou.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mou.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(mou => mou.status === statusFilter);
    }

    setFilteredMous(filtered);
  }, [mous, searchQuery, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending_signatures':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expiring':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'terminated':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateMou = useCallback(() => {
    setEditingMou(null);
    setIsCreateDialogOpen(true);
  }, []);

  const handleEditMou = useCallback((mouId: string) => {
    setEditingMou(mouId);
    setIsCreateDialogOpen(true);
  }, []);

  const handleViewMou = useCallback((mouId: string) => {
    setViewingMou(mouId);
  }, []);

  const handleDeleteMou = useCallback((mouId: string) => {
    setMous(prev => prev.filter(m => m.id !== mouId));
  }, []);

  const handleSubmitMou = useCallback((mouData: any) => {
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
        status: 'draft' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        signatures: {
          industry: { signed: false, signedAt: null, signedBy: '' },
          college: { signed: false, signedAt: null, signedBy: '' }
        }
      };
      setMous(prev => [...prev, newMou]);
    }
    setIsCreateDialogOpen(false);
    setEditingMou(null);
  }, [editingMou]);

  const columns: Column<MoU>[] = useMemo(() => [
    {
      key: 'title',
      header: 'MoU Title',
      render: (value, row) => (
        <div>
          <h4 className="font-medium">{value}</h4>
          <p className="text-sm text-muted-foreground">{row.companyName}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(value)}
          <StatusBadge status={value} />
        </div>
      ),
    },
    {
      key: 'internshipType',
      header: 'Type',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: 'startDate',
      header: 'Duration',
      render: (_, row) => {
        const daysUntilExpiry = getDaysUntilExpiry(row.endDate);
        return (
          <div>
            <p className="text-sm">{format(row.startDate, 'MMM dd, yyyy')}</p>
            <p className="text-sm text-muted-foreground">
              to {format(row.endDate, 'MMM dd, yyyy')}
            </p>
            {row.status === 'active' && daysUntilExpiry <= 30 && (
              <Badge variant="destructive" className="text-xs mt-1">
                Expires in {daysUntilExpiry} days
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'credits',
      header: 'Credits',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Award className="h-3 w-3" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'slots',
      header: 'Slots',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'signatures',
      header: 'Signatures',
      render: (_, row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            {row.signatures.industry.signed ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span>Industry</span>
          </div>
          <div className="flex items-center gap-1">
            {row.signatures.college.signed ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span>College</span>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewMou(row.id)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditMou(row.id)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteMou(row.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          {row.pdfUrl && (
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
  ], [handleViewMou, handleEditMou, handleDeleteMou]);

  const statusCounts = useMemo(() => {
    const counts = {
      active: 0,
      pending_signatures: 0,
      expiring: 0,
      terminated: 0,
      draft: 0,
    };

    mous.forEach(mou => {
      if (mou.status === 'active') {
        const daysUntilExpiry = getDaysUntilExpiry(mou.endDate);
        if (daysUntilExpiry <= 30) {
          counts.expiring++;
        } else {
          counts.active++;
        }
      } else {
        counts[mou.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [mous]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        userRole="admin"
        userName={currentUser.name}
        userEmail={currentUser.email}
      >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">MoU Registry</h1>
            <p className="text-muted-foreground">
              Manage Memorandums of Understanding with industry partners
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateMou}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New MoU
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
                      : 'Fill in the details to create a new Memorandum of Understanding.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <MoUForm 
                  mou={editingMou ? mous.find(m => m.id === editingMou) || null : null}
                  onSubmit={handleSubmitMou}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{statusCounts.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{statusCounts.pending_signatures}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiring</p>
                  <p className="text-2xl font-bold">{statusCounts.expiring}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold">{statusCounts.draft}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terminated</p>
                  <p className="text-2xl font-bold">{statusCounts.terminated}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Search and filter MoUs by status and other criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search MoUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_signatures">Pending Signatures</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="justify-start">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MoU Table */}
        <DataTable
          data={filteredMous}
          columns={columns}
          title="MoU Registry"
          searchable={false}
          filterable={false}
          exportable={true}
          emptyMessage="No MoUs found. Create your first MoU to get started."
        />

        {/* Expiring MoUs Alert */}
        {statusCounts.expiring > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-5 w-5" />
                Expiring MoUs Alert
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                {statusCounts.expiring} MoU(s) will expire within 30 days. Please review and renew them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-orange-300 text-orange-800 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-900">
                View Expiring MoUs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

