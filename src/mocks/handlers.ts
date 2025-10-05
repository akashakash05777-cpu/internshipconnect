import { http, HttpResponse } from 'msw';
import { 
  mockStudents, 
  mockStaff, 
  mockIndustry, 
  mockAdmin, 
  mockInternships, 
  mockApplications, 
  mockLogbookEntries, 
  mockMous, 
  mockNotifications,
  mockDashboardStats 
} from '@/lib/mock-data';

export const handlers = [
  // Auth endpoints
  http.get('/api/auth/me', () => {
    return HttpResponse.json(mockStudents[0]);
  }),

  // Dashboard stats
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json(mockDashboardStats);
  }),

  // Users endpoints
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    
    if (role === 'student') return HttpResponse.json(mockStudents);
    if (role === 'staff') return HttpResponse.json(mockStaff);
    if (role === 'industry') return HttpResponse.json(mockIndustry);
    if (role === 'admin') return HttpResponse.json(mockAdmin);
    
    return HttpResponse.json([...mockStudents, ...mockStaff, ...mockIndustry, ...mockAdmin]);
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = [...mockStudents, ...mockStaff, ...mockIndustry, ...mockAdmin]
      .find(u => u.id === params.id);
    
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(user);
  }),

  // Internships endpoints
  http.get('/api/internships', () => {
    return HttpResponse.json(mockInternships);
  }),

  http.get('/api/internships/:id', ({ params }) => {
    const internship = mockInternships.find(i => i.id === params.id);
    
    if (!internship) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(internship);
  }),

  http.post('/api/internships', async ({ request }) => {
    const newInternship = await request.json();
    const internship = {
      id: (mockInternships.length + 1).toString(),
      ...(newInternship as object),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockInternships.push(internship);
    return HttpResponse.json(internship, { status: 201 });
  }),

  // Applications endpoints
  http.get('/api/applications', ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const internshipId = url.searchParams.get('internshipId');
    
    let filteredApplications = mockApplications;
    
    if (studentId) {
      filteredApplications = filteredApplications.filter(a => a.studentId === studentId);
    }
    
    if (internshipId) {
      filteredApplications = filteredApplications.filter(a => a.internshipId === internshipId);
    }
    
    return HttpResponse.json(filteredApplications);
  }),

  http.post('/api/applications', async ({ request }) => {
    const newApplication = await request.json();
    const application = {
      id: (mockApplications.length + 1).toString(),
      ...(newApplication as object),
      appliedAt: new Date(),
    };
    
    mockApplications.push(application);
    return HttpResponse.json(application, { status: 201 });
  }),

  http.patch('/api/applications/:id', async ({ params, request }) => {
    const updates = await request.json();
    const index = mockApplications.findIndex(a => a.id === params.id);
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockApplications[index] = { ...mockApplications[index], ...(updates as object) };
    return HttpResponse.json(mockApplications[index]);
  }),

  // Logbook endpoints
  http.get('/api/logbook', ({ request }) => {
    const url = new URL(request.url);
    const applicationId = url.searchParams.get('applicationId');
    
    let entries = mockLogbookEntries;
    if (applicationId) {
      entries = entries.filter(e => e.applicationId === applicationId);
    }
    
    return HttpResponse.json(entries);
  }),

  http.post('/api/logbook', async ({ request }) => {
    const newEntry = await request.json();
    const entry = {
      id: (mockLogbookEntries.length + 1).toString(),
      ...(newEntry as object),
      createdAt: new Date(),
    };
    
    mockLogbookEntries.push(entry);
    return HttpResponse.json(entry, { status: 201 });
  }),

  // MoU endpoints
  http.get('/api/mous', () => {
    return HttpResponse.json(mockMous);
  }),

  http.get('/api/mous/:id', ({ params }) => {
    const mou = mockMous.find(m => m.id === params.id);
    
    if (!mou) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(mou);
  }),

  http.post('/api/mous', async ({ request }) => {
    const newMou = await request.json();
    const mou = {
      id: (mockMous.length + 1).toString(),
      ...(newMou as object),
      version: 1,
      versionHistory: [{
        version: 1,
        changes: 'Initial MoU creation',
        updatedBy: 'System',
        updatedAt: new Date(),
      }],
      signatures: {
        industry: { signed: false },
        college: { signed: false },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockMous.push(mou);
    return HttpResponse.json(mou, { status: 201 });
  }),

  http.patch('/api/mous/:id', async ({ params, request }) => {
    const updates = await request.json();
    const index = mockMous.findIndex(m => m.id === params.id);
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockMous[index] = { ...mockMous[index], ...(updates as object) };
    return HttpResponse.json(mockMous[index]);
  }),

  // Notifications endpoints
  http.get('/api/notifications', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    let notifications = mockNotifications;
    if (userId) {
      notifications = notifications.filter(n => n.userId === userId);
    }
    
    return HttpResponse.json(notifications);
  }),

  http.patch('/api/notifications/:id/read', ({ params }) => {
    const notification = mockNotifications.find(n => n.id === params.id);
    
    if (!notification) {
      return new HttpResponse(null, { status: 404 });
    }
    
    notification.read = true;
    return HttpResponse.json(notification);
  }),
];


