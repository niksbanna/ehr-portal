/**
 * MSW Handlers - Mock Service Worker request handlers
 */

import { http, HttpResponse, delay } from 'msw';
import {
  generatePatients,
  generateEncounters,
  generateLabResults,
  generatePrescriptions,
  icd10CodesData,
  drugsData,
} from './generators';
import { Patient, Encounter, LabResult, Prescription, User } from '../../types/index';
import { Drug, ICD10Code } from '../schema';

// Initialize mock data
const mockPatients = generatePatients(50);
const mockEncounters = generateEncounters(200, mockPatients);
const mockLabResults = generateLabResults(500, mockPatients, mockEncounters);
const mockPrescriptions = generatePrescriptions(mockEncounters);
const mockDrugs: Drug[] = drugsData;
const mockICD10Codes: ICD10Code[] = icd10CodesData;

// Mock users with role-based access
const mockUsers: User[] = [
  { id: '1', email: 'admin@hospital.in', name: 'Dr. Rajesh Kumar', role: 'admin' },
  { id: '2', email: 'doctor@hospital.in', name: 'Dr. Priya Sharma', role: 'doctor' },
  { id: '3', email: 'nurse@hospital.in', name: 'Nurse Anjali Singh', role: 'nurse' },
  { id: '4', email: 'lab@hospital.in', name: 'Lab Tech Ramesh Patel', role: 'lab_tech' },
  { id: '5', email: 'pharmacist@hospital.in', name: 'Pharmacist Sunil Kumar', role: 'pharmacist' },
  { id: '6', email: 'billing@hospital.in', name: 'Billing Staff Meera Joshi', role: 'billing' },
];

// Store tokens (in-memory)
const activeTokens = new Map<string, User>();

// Simulate realistic delays
function getRealisticDelay(): number {
  // 80% of requests: 100-500ms
  // 15% of requests: 500-1500ms
  // 5% of requests: 1500-3000ms
  const random = Math.random();
  if (random < 0.8) {
    return Math.random() * 400 + 100;
  } else if (random < 0.95) {
    return Math.random() * 1000 + 500;
  } else {
    return Math.random() * 1500 + 1500;
  }
}

// Simulate error rates (2% error rate)
function shouldSimulateError(): boolean {
  return Math.random() < 0.02;
}

// Helper to paginate data
function paginate<T>(data: T[], page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: offset + limit < data.length,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
}

// Helper to get user from token
function getUserFromToken(authHeader: string | null): User | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return activeTokens.get(token) || null;
}

// Auth handlers
export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(getRealisticDelay());

    if (shouldSimulateError()) {
      return HttpResponse.json(
        {
          error: 'ServiceUnavailable',
          message: 'Service temporarily unavailable',
          statusCode: 503,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);

    if (!user || !body.password) {
      return HttpResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid credentials',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Generate token (simple mock token based on user id and timestamp)
    const token = `mock_token_${user.id}_${Date.now()}`;
    const refreshToken = `mock_refresh_${user.id}_${Date.now()}`;
    activeTokens.set(token, user);

    return HttpResponse.json({
      data: {
        user,
        token,
        refreshToken,
        expiresIn: 3600,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await delay(getRealisticDelay());
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      activeTokens.delete(token);
    }
    return HttpResponse.json({
      data: { message: 'Logged out successfully' },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(getRealisticDelay());
    const user = getUserFromToken(request.headers.get('Authorization'));
    if (!user) {
      return HttpResponse.json(
        {
          error: 'Unauthorized',
          message: 'Not authenticated',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      data: user,
      timestamp: new Date().toISOString(),
    });
  }),
];

// Patient handlers
export const patientHandlers = [
  http.get('/api/patients', async ({ request }) => {
    await delay(getRealisticDelay());

    if (shouldSimulateError()) {
      return HttpResponse.json(
        {
          error: 'InternalServerError',
          message: 'Failed to fetch patients',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    let filteredPatients = mockPatients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = mockPatients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower) ||
          p.phone.includes(search)
      );
    }

    return HttpResponse.json(paginate(filteredPatients, page, limit));
  }),

  http.get('/api/patients/:id', async ({ params }) => {
    await delay(getRealisticDelay());
    const patient = mockPatients.find((p) => p.id === params.id);
    if (!patient) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Patient not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: patient,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/patients', async ({ request }) => {
    await delay(getRealisticDelay());
    const body = (await request.json()) as Omit<Patient, 'id' | 'registrationDate'>;
    const newPatient: Patient = {
      ...body,
      id: `P${String(mockPatients.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
    };
    mockPatients.push(newPatient);
    return HttpResponse.json(
      {
        data: newPatient,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.put('/api/patients/:id', async ({ params, request }) => {
    await delay(getRealisticDelay());
    const index = mockPatients.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Patient not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    const updates = (await request.json()) as Partial<Patient>;
    mockPatients[index] = { ...mockPatients[index], ...updates };
    return HttpResponse.json({
      data: mockPatients[index],
      timestamp: new Date().toISOString(),
    });
  }),

  http.delete('/api/patients/:id', async ({ params }) => {
    await delay(getRealisticDelay());
    const index = mockPatients.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Patient not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    mockPatients.splice(index, 1);
    return HttpResponse.json({
      data: { message: 'Patient deleted successfully' },
      timestamp: new Date().toISOString(),
    });
  }),
];

// Encounter handlers
export const encounterHandlers = [
  http.get('/api/encounters', async ({ request }) => {
    await delay(getRealisticDelay());

    if (shouldSimulateError()) {
      return HttpResponse.json(
        {
          error: 'InternalServerError',
          message: 'Failed to fetch encounters',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const patientId = url.searchParams.get('patientId');
    const status = url.searchParams.get('status');

    let filteredEncounters = mockEncounters;
    if (patientId) {
      filteredEncounters = filteredEncounters.filter((e) => e.patientId === patientId);
    }
    if (status) {
      filteredEncounters = filteredEncounters.filter((e) => e.status === status);
    }

    return HttpResponse.json(paginate(filteredEncounters, page, limit));
  }),

  http.get('/api/encounters/:id', async ({ params }) => {
    await delay(getRealisticDelay());
    const encounter = mockEncounters.find((e) => e.id === params.id);
    if (!encounter) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Encounter not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: encounter,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/encounters', async ({ request }) => {
    await delay(getRealisticDelay());
    const body = (await request.json()) as Omit<Encounter, 'id'>;
    const newEncounter: Encounter = {
      ...body,
      id: `E${String(mockEncounters.length + 1).padStart(3, '0')}`,
    };
    mockEncounters.unshift(newEncounter);
    return HttpResponse.json(
      {
        data: newEncounter,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.put('/api/encounters/:id', async ({ params, request }) => {
    await delay(getRealisticDelay());
    const index = mockEncounters.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Encounter not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    const updates = (await request.json()) as Partial<Encounter>;
    mockEncounters[index] = { ...mockEncounters[index], ...updates };
    return HttpResponse.json({
      data: mockEncounters[index],
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/patients/:patientId/encounters', async ({ params, request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const patientEncounters = mockEncounters.filter((e) => e.patientId === params.patientId);
    return HttpResponse.json(paginate(patientEncounters, page, limit));
  }),
];

// Lab result handlers
export const labHandlers = [
  http.get('/api/labs', async ({ request }) => {
    await delay(getRealisticDelay());

    if (shouldSimulateError()) {
      return HttpResponse.json(
        {
          error: 'InternalServerError',
          message: 'Failed to fetch lab results',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const patientId = url.searchParams.get('patientId');
    const status = url.searchParams.get('status');

    let filteredLabs = mockLabResults;
    if (patientId) {
      filteredLabs = filteredLabs.filter((l) => l.patientId === patientId);
    }
    if (status) {
      filteredLabs = filteredLabs.filter((l) => l.status === status);
    }

    return HttpResponse.json(paginate(filteredLabs, page, limit));
  }),

  http.get('/api/labs/:id', async ({ params }) => {
    await delay(getRealisticDelay());
    const lab = mockLabResults.find((l) => l.id === params.id);
    if (!lab) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Lab result not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: lab,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/labs', async ({ request }) => {
    await delay(getRealisticDelay());
    const body = (await request.json()) as Omit<LabResult, 'id'>;
    const newLab: LabResult = {
      ...body,
      id: `L${String(mockLabResults.length + 1).padStart(3, '0')}`,
    };
    mockLabResults.unshift(newLab);
    return HttpResponse.json(
      {
        data: newLab,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.put('/api/labs/:id', async ({ params, request }) => {
    await delay(getRealisticDelay());
    const index = mockLabResults.findIndex((l) => l.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Lab result not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    const updates = (await request.json()) as Partial<LabResult>;
    mockLabResults[index] = { ...mockLabResults[index], ...updates };
    return HttpResponse.json({
      data: mockLabResults[index],
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/patients/:patientId/labs', async ({ params, request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const patientLabs = mockLabResults.filter((l) => l.patientId === params.patientId);
    return HttpResponse.json(paginate(patientLabs, page, limit));
  }),

  http.get('/api/encounters/:encounterId/labs', async ({ params }) => {
    await delay(getRealisticDelay());
    const encounterLabs = mockLabResults.filter((l) => l.encounterId === params.encounterId);
    return HttpResponse.json({
      data: encounterLabs,
      timestamp: new Date().toISOString(),
    });
  }),
];

// Prescription handlers
export const prescriptionHandlers = [
  http.get('/api/prescriptions', async ({ request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const patientId = url.searchParams.get('patientId');

    let filteredPrescriptions = mockPrescriptions;
    if (patientId) {
      filteredPrescriptions = filteredPrescriptions.filter((p) => p.patientId === patientId);
    }

    return HttpResponse.json(paginate(filteredPrescriptions, page, limit));
  }),

  http.get('/api/prescriptions/:id', async ({ params }) => {
    await delay(getRealisticDelay());
    const prescription = mockPrescriptions.find((p) => p.id === params.id);
    if (!prescription) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Prescription not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: prescription,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/prescriptions', async ({ request }) => {
    await delay(getRealisticDelay());
    const body = (await request.json()) as Omit<Prescription, 'id'>;
    const newPrescription: Prescription = {
      ...body,
      id: `Rx${String(mockPrescriptions.length + 1).padStart(3, '0')}`,
    };
    mockPrescriptions.push(newPrescription);
    return HttpResponse.json(
      {
        data: newPrescription,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.get('/api/patients/:patientId/prescriptions', async ({ params, request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const patientPrescriptions = mockPrescriptions.filter((p) => p.patientId === params.patientId);
    return HttpResponse.json(paginate(patientPrescriptions, page, limit));
  }),

  http.get('/api/encounters/:encounterId/prescriptions', async ({ params }) => {
    await delay(getRealisticDelay());
    const encounterPrescriptions = mockPrescriptions.filter(
      (p) => p.encounterId === params.encounterId
    );
    return HttpResponse.json({
      data: encounterPrescriptions,
      timestamp: new Date().toISOString(),
    });
  }),
];

// Drug handlers
export const drugHandlers = [
  http.get('/api/drugs', async ({ request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    let filteredDrugs = mockDrugs;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDrugs = mockDrugs.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.genericName.toLowerCase().includes(searchLower)
      );
    }

    return HttpResponse.json(paginate(filteredDrugs, page, limit));
  }),

  http.get('/api/drugs/:id', async ({ params }) => {
    await delay(getRealisticDelay());
    const drug = mockDrugs.find((d) => d.id === params.id);
    if (!drug) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'Drug not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: drug,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/drugs/search', async ({ request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const queryLower = query.toLowerCase();
    const results = mockDrugs
      .filter(
        (d) =>
          d.name.toLowerCase().includes(queryLower) ||
          d.genericName.toLowerCase().includes(queryLower)
      )
      .slice(0, 20);
    return HttpResponse.json({
      data: results,
      timestamp: new Date().toISOString(),
    });
  }),
];

// ICD-10 handlers
export const icd10Handlers = [
  http.get('/api/icd10', async ({ request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    let filteredCodes = mockICD10Codes;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCodes = mockICD10Codes.filter(
        (c) =>
          c.code.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    return HttpResponse.json(paginate(filteredCodes, page, limit));
  }),

  http.get('/api/icd10/:code', async ({ params }) => {
    await delay(getRealisticDelay());
    const code = mockICD10Codes.find((c) => c.code === params.code);
    if (!code) {
      return HttpResponse.json(
        {
          error: 'NotFound',
          message: 'ICD-10 code not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: code,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/icd10/search', async ({ request }) => {
    await delay(getRealisticDelay());
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const queryLower = query.toLowerCase();
    const results = mockICD10Codes
      .filter(
        (c) =>
          c.code.toLowerCase().includes(queryLower) ||
          c.description.toLowerCase().includes(queryLower)
      )
      .slice(0, 20);
    return HttpResponse.json({
      data: results,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/icd10/categories', async () => {
    await delay(getRealisticDelay());
    const categories = [...new Set(mockICD10Codes.map((c) => c.category))];
    return HttpResponse.json({
      data: categories,
      timestamp: new Date().toISOString(),
    });
  }),
];

// Export all handlers
export const handlers = [
  ...authHandlers,
  ...patientHandlers,
  ...encounterHandlers,
  ...labHandlers,
  ...prescriptionHandlers,
  ...drugHandlers,
  ...icd10Handlers,
];
