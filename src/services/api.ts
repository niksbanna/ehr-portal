import { Patient, Encounter, LabResult, Prescription, Bill, DashboardStats, User } from '../types/index';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'admin@hospital.in',
  name: 'Dr. Rajesh Kumar',
  role: 'doctor',
};

// Seeded patient data
const mockPatients: Patient[] = [
  {
    id: 'P001',
    firstName: 'Amit',
    lastName: 'Sharma',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    phone: '+91 98765 43210',
    email: 'amit.sharma@email.com',
    address: '123 MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    emergencyContact: 'Priya Sharma',
    emergencyPhone: '+91 98765 43211',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    medicalHistory: 'Hypertension',
    registrationDate: '2024-01-15',
  },
  {
    id: 'P002',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    phone: '+91 98765 43212',
    email: 'priya.patel@email.com',
    address: '456 Commercial Street',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    emergencyContact: 'Rahul Patel',
    emergencyPhone: '+91 98765 43213',
    bloodGroup: 'A+',
    allergies: 'None',
    medicalHistory: 'None',
    registrationDate: '2024-02-10',
  },
  {
    id: 'P003',
    firstName: 'Suresh',
    lastName: 'Kumar',
    dateOfBirth: '1978-12-05',
    gender: 'male',
    phone: '+91 98765 43214',
    email: 'suresh.kumar@email.com',
    address: '789 Park Street',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    emergencyContact: 'Kavita Kumar',
    emergencyPhone: '+91 98765 43215',
    bloodGroup: 'B+',
    allergies: 'Sulfa drugs',
    medicalHistory: 'Diabetes Type 2',
    registrationDate: '2024-03-05',
  },
];

// Seeded encounter data
const mockEncounters: Encounter[] = [
  {
    id: 'E001',
    patientId: 'P001',
    patientName: 'Amit Sharma',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-25T09:00:00',
    type: 'consultation',
    chiefComplaint: 'Fever and headache',
    diagnosis: 'Viral fever',
    notes: 'Prescribed rest and medications',
    status: 'completed',
    vitalSigns: {
      temperature: 101.5,
      bloodPressure: '130/85',
      heartRate: 88,
      respiratoryRate: 18,
      spo2: 98,
      weight: 75,
      height: 175,
    },
  },
  {
    id: 'E002',
    patientId: 'P002',
    patientName: 'Priya Patel',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-25T10:30:00',
    type: 'followup',
    chiefComplaint: 'Follow-up for diabetes management',
    diagnosis: 'Diabetes Type 2 - controlled',
    notes: 'Continue current medication',
    status: 'completed',
    vitalSigns: {
      temperature: 98.6,
      bloodPressure: '120/80',
      heartRate: 72,
      respiratoryRate: 16,
      spo2: 99,
      weight: 62,
      height: 165,
    },
  },
  {
    id: 'E003',
    patientId: 'P003',
    patientName: 'Suresh Kumar',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-25T14:00:00',
    type: 'consultation',
    chiefComplaint: 'Chest pain',
    diagnosis: 'Under investigation',
    notes: 'ECG ordered, awaiting results',
    status: 'in-progress',
    vitalSigns: {
      temperature: 98.4,
      bloodPressure: '145/95',
      heartRate: 95,
      respiratoryRate: 20,
      spo2: 97,
      weight: 82,
      height: 172,
    },
  },
];

// Seeded lab results data
const mockLabResults: LabResult[] = [
  {
    id: 'L001',
    patientId: 'P001',
    patientName: 'Amit Sharma',
    encounterId: 'E001',
    testName: 'Complete Blood Count',
    testCategory: 'Hematology',
    orderedDate: '2024-10-25T09:00:00',
    reportDate: '2024-10-25T15:00:00',
    status: 'completed',
    results: 'WBC: 11000/mm³, RBC: 5.2 million/mm³, Platelets: 250000/mm³',
    normalRange: 'WBC: 4000-11000, RBC: 4.5-5.5, Platelets: 150000-450000',
    unit: 'per mm³',
    remarks: 'Slightly elevated WBC indicating infection',
    orderedBy: 'Dr. Rajesh Kumar',
  },
  {
    id: 'L002',
    patientId: 'P002',
    patientName: 'Priya Patel',
    encounterId: 'E002',
    testName: 'Fasting Blood Sugar',
    testCategory: 'Biochemistry',
    orderedDate: '2024-10-25T10:30:00',
    reportDate: '2024-10-25T16:00:00',
    status: 'completed',
    results: '110 mg/dL',
    normalRange: '70-100 mg/dL',
    unit: 'mg/dL',
    remarks: 'Slightly elevated, continue monitoring',
    orderedBy: 'Dr. Rajesh Kumar',
  },
  {
    id: 'L003',
    patientId: 'P003',
    patientName: 'Suresh Kumar',
    encounterId: 'E003',
    testName: 'ECG',
    testCategory: 'Cardiology',
    orderedDate: '2024-10-25T14:00:00',
    status: 'pending',
    orderedBy: 'Dr. Rajesh Kumar',
  },
];

// Seeded prescription data
const mockPrescriptions: Prescription[] = [
  {
    id: 'Rx001',
    patientId: 'P001',
    patientName: 'Amit Sharma',
    encounterId: 'E001',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-25T09:30:00',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '5 days',
        route: 'Oral',
        instructions: 'Take after meals',
      },
      {
        name: 'Azithromycin',
        dosage: '500mg',
        frequency: 'Once daily',
        duration: '3 days',
        route: 'Oral',
        instructions: 'Take before breakfast',
      },
    ],
    instructions: 'Rest adequately, drink plenty of fluids',
    status: 'active',
  },
  {
    id: 'Rx002',
    patientId: 'P002',
    patientName: 'Priya Patel',
    encounterId: 'E002',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-25T10:45:00',
    medications: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: '2 times daily',
        duration: '30 days',
        route: 'Oral',
        instructions: 'Take with meals',
      },
    ],
    instructions: 'Continue diet control and regular exercise',
    status: 'active',
  },
];

// Seeded billing data
const mockBills: Bill[] = [
  {
    id: 'B001',
    patientId: 'P001',
    patientName: 'Amit Sharma',
    encounterId: 'E001',
    date: '2024-10-25T09:30:00',
    items: [
      { description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 },
      { description: 'Complete Blood Count', quantity: 1, unitPrice: 300, total: 300 },
      { description: 'Medications', quantity: 1, unitPrice: 250, total: 250 },
    ],
    subtotal: 1050,
    tax: 189,
    discount: 0,
    total: 1239,
    status: 'paid',
    paymentMethod: 'UPI',
    paidAmount: 1239,
  },
  {
    id: 'B002',
    patientId: 'P002',
    patientName: 'Priya Patel',
    encounterId: 'E002',
    date: '2024-10-25T10:45:00',
    items: [
      { description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 },
      { description: 'Fasting Blood Sugar Test', quantity: 1, unitPrice: 200, total: 200 },
    ],
    subtotal: 700,
    tax: 126,
    discount: 50,
    total: 776,
    status: 'paid',
    paymentMethod: 'Card',
    paidAmount: 776,
  },
  {
    id: 'B003',
    patientId: 'P003',
    patientName: 'Suresh Kumar',
    encounterId: 'E003',
    date: '2024-10-25T14:00:00',
    items: [
      { description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 },
      { description: 'ECG Test', quantity: 1, unitPrice: 400, total: 400 },
    ],
    subtotal: 900,
    tax: 162,
    discount: 0,
    total: 1062,
    status: 'pending',
  },
];

// Mock API class
class MockAPI {
  private delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

  // Authentication
  async login(email: string, password: string): Promise<User> {
    await this.delay();
    if (email && password) {
      return mockUser;
    }
    throw new Error('Invalid credentials');
  }

  async logout(): Promise<void> {
    await this.delay();
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem('auth_token');
    return token ? mockUser : null;
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    await this.delay();
    return [...mockPatients];
  }

  async getPatient(id: string): Promise<Patient> {
    await this.delay();
    const patient = mockPatients.find(p => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return patient;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> {
    await this.delay();
    const newPatient: Patient = {
      ...patient,
      id: `P${String(mockPatients.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    mockPatients.push(newPatient);
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    await this.delay();
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    mockPatients[index] = { ...mockPatients[index], ...updates };
    return mockPatients[index];
  }

  async deletePatient(id: string): Promise<void> {
    await this.delay();
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    mockPatients.splice(index, 1);
  }

  // Encounters
  async getEncounters(): Promise<Encounter[]> {
    await this.delay();
    return [...mockEncounters];
  }

  async getEncounter(id: string): Promise<Encounter> {
    await this.delay();
    const encounter = mockEncounters.find(e => e.id === id);
    if (!encounter) throw new Error('Encounter not found');
    return encounter;
  }

  async createEncounter(encounter: Omit<Encounter, 'id'>): Promise<Encounter> {
    await this.delay();
    const newEncounter: Encounter = {
      ...encounter,
      id: `E${String(mockEncounters.length + 1).padStart(3, '0')}`,
    };
    mockEncounters.push(newEncounter);
    return newEncounter;
  }

  async updateEncounter(id: string, updates: Partial<Encounter>): Promise<Encounter> {
    await this.delay();
    const index = mockEncounters.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Encounter not found');
    mockEncounters[index] = { ...mockEncounters[index], ...updates };
    return mockEncounters[index];
  }

  // Lab Results
  async getLabResults(): Promise<LabResult[]> {
    await this.delay();
    return [...mockLabResults];
  }

  async getLabResult(id: string): Promise<LabResult> {
    await this.delay();
    const result = mockLabResults.find(l => l.id === id);
    if (!result) throw new Error('Lab result not found');
    return result;
  }

  async createLabResult(result: Omit<LabResult, 'id'>): Promise<LabResult> {
    await this.delay();
    const newResult: LabResult = {
      ...result,
      id: `L${String(mockLabResults.length + 1).padStart(3, '0')}`,
    };
    mockLabResults.push(newResult);
    return newResult;
  }

  async updateLabResult(id: string, updates: Partial<LabResult>): Promise<LabResult> {
    await this.delay();
    const index = mockLabResults.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lab result not found');
    mockLabResults[index] = { ...mockLabResults[index], ...updates };
    return mockLabResults[index];
  }

  // Prescriptions
  async getPrescriptions(): Promise<Prescription[]> {
    await this.delay();
    return [...mockPrescriptions];
  }

  async getPrescription(id: string): Promise<Prescription> {
    await this.delay();
    const prescription = mockPrescriptions.find(p => p.id === id);
    if (!prescription) throw new Error('Prescription not found');
    return prescription;
  }

  async createPrescription(prescription: Omit<Prescription, 'id'>): Promise<Prescription> {
    await this.delay();
    const newPrescription: Prescription = {
      ...prescription,
      id: `Rx${String(mockPrescriptions.length + 1).padStart(3, '0')}`,
    };
    mockPrescriptions.push(newPrescription);
    return newPrescription;
  }

  // Billing
  async getBills(): Promise<Bill[]> {
    await this.delay();
    return [...mockBills];
  }

  async getBill(id: string): Promise<Bill> {
    await this.delay();
    const bill = mockBills.find(b => b.id === id);
    if (!bill) throw new Error('Bill not found');
    return bill;
  }

  async createBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
    await this.delay();
    const newBill: Bill = {
      ...bill,
      id: `B${String(mockBills.length + 1).padStart(3, '0')}`,
    };
    mockBills.push(newBill);
    return newBill;
  }

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill> {
    await this.delay();
    const index = mockBills.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bill not found');
    mockBills[index] = { ...mockBills[index], ...updates };
    return mockBills[index];
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();
    return {
      totalPatients: mockPatients.length,
      todayAppointments: mockEncounters.filter(e => 
        new Date(e.date).toDateString() === new Date().toDateString()
      ).length,
      pendingLabs: mockLabResults.filter(l => l.status === 'pending').length,
      totalRevenue: mockBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0),
      recentEncounters: mockEncounters.slice(-5).reverse(),
      recentPatients: mockPatients.slice(-5).reverse(),
    };
  }
}

export const api = new MockAPI();
