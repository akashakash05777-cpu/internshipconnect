import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoU } from '@/types';

interface MoUFormProps {
  mou?: MoU | null;
  onSubmit: (mouData: Partial<MoU>) => void;
}

export default function MoUForm({ mou, onSubmit }: MoUFormProps) {
  const [formData, setFormData] = useState({
    title: mou?.title || '',
    companyName: mou?.companyName || '',
    industry: '',
    website: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    scopeOfWork: mou?.scopeOfWork || '',
    internshipType: mou?.internshipType || '',
    startDate: mou?.startDate ? mou.startDate.toISOString().split('T')[0] : '',
    endDate: mou?.endDate ? mou.endDate.toISOString().split('T')[0] : '',
    credits: mou?.credits || 4,
    slots: mou?.slots || 10,
    mentorName: mou?.mentorDetails?.name || '',
    mentorEmail: mou?.mentorDetails?.email || '',
    mentorDesignation: mou?.mentorDetails?.designation || '',
    mentorPhone: mou?.mentorDetails?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      companyName: formData.companyName,
      scopeOfWork: formData.scopeOfWork,
      internshipType: formData.internshipType as 'onsite' | 'remote' | 'hybrid',
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      credits: formData.credits,
      slots: formData.slots,
      mentorDetails: {
        name: formData.mentorName,
        email: formData.mentorEmail,
        designation: formData.mentorDesignation,
        phone: formData.mentorPhone,
      },
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">MoU Title *</Label>
            <Input
              id="title"
              placeholder="e.g., TechCorp Solutions - Web Development Internship Program"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="e.g., TechCorp Solutions"
              value={formData.companyName}
              onChange={(e) => updateFormData('companyName', e.target.value)}
              required
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
          <div>
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              placeholder="e.g., John Smith"
              value={formData.contactPerson}
              onChange={(e) => updateFormData('contactPerson', e.target.value)}
              required
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
              required
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1-555-0123"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="scopeOfWork">Scope of Work *</Label>
            <Textarea
              id="scopeOfWork"
              placeholder="Describe the scope of work for the internship program..."
              value={formData.scopeOfWork}
              onChange={(e) => updateFormData('scopeOfWork', e.target.value)}
              rows={4}
              required
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
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData('startDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData('endDate', e.target.value)}
              required
            />
          </div>
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
              required
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
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="mentorName">Mentor Name *</Label>
            <Input
              id="mentorName"
              placeholder="e.g., Alice Johnson"
              value={formData.mentorName}
              onChange={(e) => updateFormData('mentorName', e.target.value)}
              required
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
              required
            />
          </div>
          <div>
            <Label htmlFor="mentorDesignation">Designation *</Label>
            <Input
              id="mentorDesignation"
              placeholder="e.g., Senior Software Engineer"
              value={formData.mentorDesignation}
              onChange={(e) => updateFormData('mentorDesignation', e.target.value)}
              required
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          {mou ? 'Update MoU' : 'Create MoU'}
        </Button>
      </div>
    </form>
  );
}
