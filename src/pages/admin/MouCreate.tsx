

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  Building2, 
  Calendar, 
  Award, 
  Users,
  Upload,
  Save,
  Send
} from 'lucide-react';
import { mockAdmin } from '@/lib/mock-data';

const steps = [
  { id: 1, title: 'Basic Information', description: 'MoU title and company details' },
  { id: 2, title: 'Scope & Type', description: 'Define internship scope and type' },
  { id: 3, title: 'Duration & Credits', description: 'Set timeline and credit allocation' },
  { id: 4, title: 'Mentor Details', description: 'Assign mentor and contact information' },
  { id: 5, title: 'Review & Submit', description: 'Review all details and submit' },
];

export default function CreateMoU() {
  const navigate = useNavigate();
  const [currentUser] = useState(mockAdmin[0]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    companyName: '',
    industry: '',
    website: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    
    // Step 2: Scope & Type
    scopeOfWork: '',
    internshipType: '',
    
    // Step 3: Duration & Credits
    startDate: '',
    endDate: '',
    credits: 0,
    slots: 0,
    
    // Step 4: Mentor Details
    mentorName: '',
    mentorEmail: '',
    mentorDesignation: '',
    mentorPhone: '',
    
    // Step 5: Additional
    pdfFile: null as File | null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Mock submission
    console.log('Creating MoU with data:', formData);
    navigate('/admin/mous');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.companyName && formData.contactPerson && formData.email;
      case 2:
        return formData.scopeOfWork && formData.internshipType;
      case 3:
        return formData.startDate && formData.endDate && formData.credits > 0 && formData.slots > 0;
      case 4:
        return formData.mentorName && formData.mentorEmail && formData.mentorDesignation;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New MoU</h1>
              <p className="text-muted-foreground">
                Set up a new Memorandum of Understanding with an industry partner
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step.id < currentStep 
                        ? 'bg-green-500 text-white' 
                        : step.id === currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Building2 className="h-5 w-5" />}
              {currentStep === 2 && <FileText className="h-5 w-5" />}
              {currentStep === 3 && <Calendar className="h-5 w-5" />}
              {currentStep === 4 && <Users className="h-5 w-5" />}
              {currentStep === 5 && <Check className="h-5 w-5" />}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">MoU Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., TechCorp Solutions - Web Development Internship Program"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g., TechCorp Solutions"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., Technology, Healthcare, Finance"
                      value={formData.industry}
                      onChange={(e) => updateFormData('industry', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://company.com"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Company Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete company address"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      placeholder="e.g., John Smith"
                      value={formData.contactPerson}
                      onChange={(e) => updateFormData('contactPerson', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1-555-0123"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Scope & Type */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="scopeOfWork">Scope of Work *</Label>
                  <Textarea
                    id="scopeOfWork"
                    placeholder="Describe the scope of work for the internship program..."
                    value={formData.scopeOfWork}
                    onChange={(e) => updateFormData('scopeOfWork', e.target.value)}
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="internshipType">Internship Type *</Label>
                  <Select value={formData.internshipType} onValueChange={(value) => updateFormData('internshipType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select internship type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Duration & Credits */}
            {currentStep === 3 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData('endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credits">NEP Credits *</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="12"
                      placeholder="4"
                      value={formData.credits}
                      onChange={(e) => updateFormData('credits', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slots">Available Slots *</Label>
                    <Input
                      id="slots"
                      type="number"
                      min="1"
                      placeholder="10"
                      value={formData.slots}
                      onChange={(e) => updateFormData('slots', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Mentor Details */}
            {currentStep === 4 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mentorName">Mentor Name *</Label>
                    <Input
                      id="mentorName"
                      placeholder="e.g., Alice Johnson"
                      value={formData.mentorName}
                      onChange={(e) => updateFormData('mentorName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mentorEmail">Mentor Email *</Label>
                    <Input
                      id="mentorEmail"
                      type="email"
                      placeholder="mentor@company.com"
                      value={formData.mentorEmail}
                      onChange={(e) => updateFormData('mentorEmail', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mentorDesignation">Designation *</Label>
                    <Input
                      id="mentorDesignation"
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.mentorDesignation}
                      onChange={(e) => updateFormData('mentorDesignation', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mentorPhone">Mentor Phone</Label>
                    <Input
                      id="mentorPhone"
                      placeholder="+1-555-0123"
                      value={formData.mentorPhone}
                      onChange={(e) => updateFormData('mentorPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Title:</span> {formData.title}
                      </div>
                      <div>
                        <span className="font-medium">Company:</span> {formData.companyName}
                      </div>
                      <div>
                        <span className="font-medium">Industry:</span> {formData.industry}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span> {formData.contactPerson}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {formData.email}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Internship Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Type:</span> 
                        <Badge variant="outline" className="ml-2 capitalize">
                          {formData.internshipType}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {formData.startDate} to {formData.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Credits:</span> {formData.credits}
                      </div>
                      <div>
                        <span className="font-medium">Slots:</span> {formData.slots}
                      </div>
                      <div>
                        <span className="font-medium">Mentor:</span> {formData.mentorName}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label htmlFor="pdfFile">Upload MoU Document (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      id="pdfFile"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => updateFormData('pdfFile', e.target.files?.[0] || null)}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentStep === steps.length ? (
                  <>
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button onClick={handleSubmit}>
                      <Send className="h-4 w-4 mr-2" />
                      Create MoU
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
