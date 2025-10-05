

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  FileText,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { mockStudents, mockApplications, mockInternships, mockLogbookEntries } from '@/lib/mock-data';
import { LogbookEntry } from '@/types';
import { format } from 'date-fns';

export default function StudentLogbook() {
  const [currentUser] = useState(mockStudents[0]);
  const [entries, setEntries] = useState<LogbookEntry[]>(mockLogbookEntries);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: 8,
    description: '',
    skillsLearned: '',
    challenges: '',
    nextWeekPlan: '',
  });

  // Get ongoing application
  const ongoingApplication = mockApplications.find(app => 
    app.studentId === currentUser.id && app.status === 'ongoing'
  );
  const ongoingInternship = ongoingApplication 
    ? mockInternships.find(i => i.id === ongoingApplication.internshipId)
    : null;

  // Get logbook entries for ongoing application
  const userEntries = entries.filter(entry => 
    entry.applicationId === ongoingApplication?.id
  );

  const handleAddEntry = () => {
    if (!ongoingApplication) return;

    const entry: LogbookEntry = {
      id: (entries.length + 1).toString(),
      applicationId: ongoingApplication.id,
      date: new Date(newEntry.date),
      hours: newEntry.hours,
      description: newEntry.description,
      skillsLearned: newEntry.skillsLearned.split(',').map(s => s.trim()),
      challenges: newEntry.challenges,
      nextWeekPlan: newEntry.nextWeekPlan,
      createdAt: new Date(),
    };

    setEntries([...entries, entry]);
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: 8,
      description: '',
      skillsLearned: '',
      challenges: '',
      nextWeekPlan: '',
    });
    setIsAddingEntry(false);
  };

  const handleEditEntry = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setNewEntry({
        date: format(entry.date, 'yyyy-MM-dd'),
        hours: entry.hours,
        description: entry.description,
        skillsLearned: entry.skillsLearned.join(', '),
        challenges: entry.challenges,
        nextWeekPlan: entry.nextWeekPlan,
      });
      setEditingEntry(entryId);
      setIsAddingEntry(true);
    }
  };

  const handleUpdateEntry = () => {
    if (!editingEntry) return;

    const updatedEntries = entries.map(entry => {
      if (entry.id === editingEntry) {
        return {
          ...entry,
          date: new Date(newEntry.date),
          hours: newEntry.hours,
          description: newEntry.description,
          skillsLearned: newEntry.skillsLearned.split(',').map(s => s.trim()),
          challenges: newEntry.challenges,
          nextWeekPlan: newEntry.nextWeekPlan,
        };
      }
      return entry;
    });

    setEntries(updatedEntries);
    setEditingEntry(null);
    setIsAddingEntry(false);
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: 8,
      description: '',
      skillsLearned: '',
      challenges: '',
      nextWeekPlan: '',
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const totalHours = userEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalEntries = userEntries.length;

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
            <h1 className="text-3xl font-bold">NEP Logbook</h1>
            <p className="text-muted-foreground">
              Maintain your internship logbook as per NEP guidelines
            </p>
          </div>
          {ongoingApplication && (
            <Button onClick={() => setIsAddingEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          )}
        </div>

        {/* Current Internship Info */}
        {ongoingInternship ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Internship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold">{ongoingInternship.title}</h3>
                  <p className="text-sm text-muted-foreground">{ongoingInternship.company}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalHours}</p>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalEntries}</p>
                    <p className="text-sm text-muted-foreground">Entries</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">NEP Compliant</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ongoingInternship.credits} credits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Ongoing Internship</h3>
              <p className="text-muted-foreground mb-4">
                You need an ongoing internship to maintain a logbook.
              </p>
              <Button>
                Browse Internships
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Entry Form */}
        {isAddingEntry && ongoingApplication && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingEntry ? 'Edit Logbook Entry' : 'Add New Logbook Entry'}
              </CardTitle>
              <CardDescription>
                Record your daily activities and learning progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hours">Hours Worked</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    max="12"
                    value={newEntry.hours}
                    onChange={(e) => setNewEntry({ ...newEntry, hours: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Work Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you worked on today..."
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills Learned</Label>
                <Input
                  id="skills"
                  placeholder="React, TypeScript, Git (comma-separated)"
                  value={newEntry.skillsLearned}
                  onChange={(e) => setNewEntry({ ...newEntry, skillsLearned: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="challenges">Challenges Faced</Label>
                <Textarea
                  id="challenges"
                  placeholder="Describe any challenges you encountered..."
                  value={newEntry.challenges}
                  onChange={(e) => setNewEntry({ ...newEntry, challenges: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="nextWeek">Next Week Plan</Label>
                <Textarea
                  id="nextWeek"
                  placeholder="What do you plan to work on next week?"
                  value={newEntry.nextWeekPlan}
                  onChange={(e) => setNewEntry({ ...newEntry, nextWeekPlan: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                  disabled={!newEntry.description.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingEntry ? 'Update Entry' : 'Add Entry'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingEntry(false);
                    setEditingEntry(null);
                    setNewEntry({
                      date: format(new Date(), 'yyyy-MM-dd'),
                      hours: 8,
                      description: '',
                      skillsLearned: '',
                      challenges: '',
                      nextWeekPlan: '',
                    });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logbook Entries */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Logbook Entries</h2>
          
          {userEntries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start documenting your internship journey by adding your first entry.
                </p>
                <Button onClick={() => setIsAddingEntry(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {format(entry.date, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">
                            {entry.hours} hours
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEntry(entry.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Work Description</h4>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </div>

                    {entry.skillsLearned.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills Learned</h4>
                        <div className="flex flex-wrap gap-1">
                          {entry.skillsLearned.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.challenges && (
                      <div>
                        <h4 className="font-medium mb-2">Challenges</h4>
                        <p className="text-sm text-muted-foreground">{entry.challenges}</p>
                      </div>
                    )}

                    {entry.nextWeekPlan && (
                      <div>
                        <h4 className="font-medium mb-2">Next Week Plan</h4>
                        <p className="text-sm text-muted-foreground">{entry.nextWeekPlan}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
