

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Award, 
  Users,
  Briefcase,
  Eye,
  FileText
} from 'lucide-react';
import { mockStudents, mockInternships } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Internship } from '@/types';
import { format } from 'date-fns';

export default function StudentInternships() {
  const [currentUser] = useState(mockStudents[0]);
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(internships);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Get unique domains and locations for filters
  const domains = Array.from(new Set(internships.map(i => i.domain)));
  const locations = Array.from(new Set(internships.map(i => i.location)));

  // Filter internships based on search and filters
  useEffect(() => {
    let filtered = internships;

    if (searchQuery) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(internship => internship.domain === domainFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(internship => internship.location === locationFilter);
    }

    setFilteredInternships(filtered);
  }, [internships, searchQuery, domainFilter, locationFilter]);

  const handleApply = (internshipId: string) => {
    // Mock application submission
    console.log('Applying to internship:', internshipId);
    // In a real app, this would make an API call
  };

  const columns: Column<Internship>[] = [
    {
      key: 'title',
      header: 'Position',
      render: (value, row) => (
        <div>
          <h4 className="font-medium">{value}</h4>
          <p className="text-sm text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      key: 'domain',
      header: 'Domain',
      render: (value) => (
        <Badge variant="secondary">{value}</Badge>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (value) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className="text-sm">{value} weeks</span>
        </div>
      ),
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
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleApply(row.id)}
            disabled={row.status !== 'active'}
          >
            <FileText className="h-3 w-3 mr-1" />
            Apply
          </Button>
        </div>
      ),
    },
  ];

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
            <h1 className="text-3xl font-bold">Available Internships</h1>
            <p className="text-muted-foreground">
              Browse and apply to internship opportunities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {filteredInternships.length} positions available
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Narrow down your search to find the perfect internship
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search internships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {domains.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="justify-start">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Internships Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{internship.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {internship.company}
                    </CardDescription>
                  </div>
                  <StatusBadge status={internship.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {internship.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{internship.duration} weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-muted-foreground" />
                    <span>{internship.credits} credits</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{internship.domain}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Mentor</h4>
                    <p className="text-sm text-muted-foreground">
                      {internship.mentor.name} - {internship.mentor.designation}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Required Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {internship.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{internship.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleApply(internship.id)}
                    disabled={internship.status !== 'active'}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No internships found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setDomainFilter('all');
                setLocationFilter('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
