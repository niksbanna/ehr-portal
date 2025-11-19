import {
  Patient,
  Encounter,
  LabResult,
  Prescription,
  Bill,
  DashboardStats,
  User,
} from '../types/index';
import { AUTH_TOKEN_KEY } from '../config/api.config';

// Mock user data with different roles
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.in',
    name: 'Dr. Rajesh Kumar',
    role: 'admin',
  },
  {
    id: '2',
    email: 'doctor@hospital.in',
    name: 'Dr. Priya Sharma',
    role: 'doctor',
  },
  {
    id: '3',
    email: 'nurse@hospital.in',
    name: 'Nurse Anjali Singh',
    role: 'nurse',
  },
  {
    id: '4',
    email: 'lab@hospital.in',
    name: 'Lab Tech Ramesh Patel',
    role: 'lab_tech',
  },
  {
    id: '5',
    email: 'pharmacist@hospital.in',
    name: 'Pharmacist Sunil Kumar',
    role: 'pharmacist',
  },
  {
    id: '6',
    email: 'billing@hospital.in',
    name: 'Billing Staff Meera Joshi',
    role: 'billing',
  },
];

// Seeded patient data with realistic Indian hospital data
const mockPatients: Patient[] = [
  {
    id: 'P001',
    firstName: 'Amit',
    lastName: 'Sharma',
    dateOfBirth: '15-05-1985',
    gender: 'male',
    phone: '+919876543210',
    email: 'amit.sharma@email.com',
    aadhaar: '123456789012', // Will be masked as XXXX-XXXX-9012
    address: '123, MG Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058',
    emergencyContact: 'Priya Sharma (Wife)',
    emergencyPhone: '+919876543211',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    medicalHistory: 'Essential Hypertension (controlled)',
    registrationDate: '15-01-2024',
  },
  {
    id: 'P002',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: '22-08-1990',
    gender: 'female',
    phone: '+919876543212',
    email: 'priya.patel@email.com',
    aadhaar: '234567890123',
    address: '456, Indiranagar, 1st Stage',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    emergencyContact: 'Rahul Patel (Husband)',
    emergencyPhone: '+919876543213',
    bloodGroup: 'A+',
    allergies: 'None',
    medicalHistory: 'Type 2 Diabetes Mellitus (on medication)',
    registrationDate: '10-02-2024',
  },
  {
    id: 'P003',
    firstName: 'Suresh',
    lastName: 'Kumar',
    dateOfBirth: '05-12-1978',
    gender: 'male',
    phone: '+919876543214',
    email: 'suresh.kumar@email.com',
    aadhaar: '345678901234',
    address: '789, Connaught Place, Central Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    emergencyContact: 'Kavita Kumar (Wife)',
    emergencyPhone: '+919876543215',
    bloodGroup: 'B+',
    allergies: 'Sulfa drugs',
    medicalHistory: 'Type 2 Diabetes, Dyslipidemia',
    registrationDate: '05-03-2024',
  },
  {
    id: 'P004',
    firstName: 'Lakshmi',
    lastName: 'Rao',
    dateOfBirth: '10-03-1995',
    gender: 'female',
    phone: '+919876543216',
    email: 'lakshmi.rao@email.com',
    aadhaar: '456789012345',
    address: '12, T Nagar, Near Pondy Bazaar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    emergencyContact: 'Venkat Rao (Father)',
    emergencyPhone: '+919876543217',
    bloodGroup: 'AB+',
    allergies: 'Dust, Pollen',
    medicalHistory: 'Asthma (well controlled)',
    registrationDate: '20-04-2024',
  },
  {
    id: 'P005',
    firstName: 'Mohammed',
    lastName: 'Khan',
    dateOfBirth: '18-07-1982',
    gender: 'male',
    phone: '+919876543218',
    email: 'mohammed.khan@email.com',
    aadhaar: '567890123456',
    address: '34, Old City, Charminar Area',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500002',
    emergencyContact: 'Ayesha Khan (Wife)',
    emergencyPhone: '+919876543219',
    bloodGroup: 'O-',
    allergies: 'None',
    medicalHistory: 'Coronary Artery Disease, Post-CABG',
    registrationDate: '12-05-2024',
  },
];

// Seeded encounter data with ICD-10 diagnosis codes
const mockEncounters: Encounter[] = [
  {
    id: 'E001',
    patientId: 'P001',
    patientName: 'Amit Sharma',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-25T09:00:00',
    type: 'consultation',
    chiefComplaint: 'Fever and headache for 3 days',
    diagnosis: 'Acute upper respiratory infection',
    diagnosisCode: 'J06.9',
    notes: 'Prescribed antipyretics and rest. Advised to return if symptoms worsen.',
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
    diagnosis: 'Type 2 diabetes mellitus without complications',
    diagnosisCode: 'E11.9',
    notes: 'HbA1c: 6.8%. Blood sugar well controlled. Continue current medication.',
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
    type: 'emergency',
    chiefComplaint: 'Chest pain and breathlessness',
    diagnosis: 'Atherosclerotic heart disease - under investigation',
    diagnosisCode: 'I25.1',
    notes: 'ECG shows ST changes. Troponin ordered. Referred to cardiology.',
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
  {
    id: 'E004',
    patientId: 'P004',
    patientName: 'Lakshmi Rao',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-24T11:00:00',
    type: 'consultation',
    chiefComplaint: 'Cough and wheezing',
    diagnosis: 'Acute exacerbation of asthma',
    diagnosisCode: 'J45.9',
    notes: 'Nebulization given. Inhaler technique reviewed. Advised to avoid triggers.',
    status: 'completed',
    vitalSigns: {
      temperature: 98.2,
      bloodPressure: '118/76',
      heartRate: 85,
      respiratoryRate: 22,
      spo2: 95,
      weight: 58,
      height: 162,
    },
  },
  {
    id: 'E005',
    patientId: 'P005',
    patientName: 'Mohammed Khan',
    doctorId: '1',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-10-23T15:30:00',
    type: 'followup',
    chiefComplaint: 'Post-CABG follow-up',
    diagnosis: 'Post-surgical follow-up, recovering well',
    diagnosisCode: 'Z48.8',
    notes: 'Wound healing well. Continue cardiac rehabilitation. Echo shows good LV function.',
    status: 'completed',
    vitalSigns: {
      temperature: 98.0,
      bloodPressure: '125/78',
      heartRate: 68,
      respiratoryRate: 14,
      spo2: 98,
      weight: 78,
      height: 170,
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

// Seeded billing data with INR currency
const mockBills: Bill[] = [
  {
    id: 'B001',
    patientId: 'P001',
    patientName: 'Amit Sharma',
    encounterId: 'E001',
    date: '25-10-2024',
    items: [
      {
        description: 'Consultation Fee - General Physician',
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
      { description: 'Complete Blood Count (CBC)', quantity: 1, unitPrice: 350, total: 350 },
      { description: 'Paracetamol 500mg (Strip of 10)', quantity: 2, unitPrice: 25, total: 50 },
      { description: 'Azithromycin 500mg (Strip of 3)', quantity: 1, unitPrice: 180, total: 180 },
    ],
    subtotal: 1080,
    tax: 194.4, // 18% GST
    discount: 0,
    total: 1274.4,
    status: 'paid',
    paymentMethod: 'UPI',
    paidAmount: 1274.4,
  },
  {
    id: 'B002',
    patientId: 'P002',
    patientName: 'Priya Patel',
    encounterId: 'E002',
    date: '25-10-2024',
    items: [
      { description: 'Consultation Fee - Diabetologist', quantity: 1, unitPrice: 800, total: 800 },
      { description: 'HbA1c Test', quantity: 1, unitPrice: 450, total: 450 },
      { description: 'Fasting Blood Sugar Test', quantity: 1, unitPrice: 100, total: 100 },
      { description: 'Metformin 500mg (30 tablets)', quantity: 1, unitPrice: 120, total: 120 },
    ],
    subtotal: 1470,
    tax: 264.6, // 18% GST
    discount: 100, // Senior citizen discount
    total: 1634.6,
    status: 'paid',
    paymentMethod: 'Card',
    paidAmount: 1634.6,
  },
  {
    id: 'B003',
    patientId: 'P003',
    patientName: 'Suresh Kumar',
    encounterId: 'E003',
    date: '25-10-2024',
    items: [
      { description: 'Emergency Consultation Fee', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'ECG (12-lead)', quantity: 1, unitPrice: 350, total: 350 },
      { description: 'Troponin-I Test', quantity: 1, unitPrice: 800, total: 800 },
      { description: 'Emergency Care Package', quantity: 1, unitPrice: 1500, total: 1500 },
    ],
    subtotal: 3850,
    tax: 693, // 18% GST
    discount: 0,
    total: 4543,
    status: 'pending',
  },
  {
    id: 'B004',
    patientId: 'P004',
    patientName: 'Lakshmi Rao',
    encounterId: 'E004',
    date: '24-10-2024',
    items: [
      { description: 'Consultation Fee - Pulmonologist', quantity: 1, unitPrice: 700, total: 700 },
      { description: 'Nebulization', quantity: 1, unitPrice: 200, total: 200 },
      { description: 'Salbutamol Inhaler', quantity: 1, unitPrice: 250, total: 250 },
      { description: 'Peak Flow Meter', quantity: 1, unitPrice: 450, total: 450 },
    ],
    subtotal: 1600,
    tax: 288, // 18% GST
    discount: 50,
    total: 1838,
    status: 'paid',
    paymentMethod: 'UPI',
    paidAmount: 1838,
  },
  {
    id: 'B005',
    patientId: 'P005',
    patientName: 'Mohammed Khan',
    encounterId: 'E005',
    date: '23-10-2024',
    items: [
      {
        description: 'Cardiology Follow-up Consultation',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      },
      { description: '2D Echocardiography', quantity: 1, unitPrice: 1800, total: 1800 },
      { description: 'Aspirin 75mg (30 tablets)', quantity: 1, unitPrice: 45, total: 45 },
      { description: 'Atorvastatin 20mg (30 tablets)', quantity: 1, unitPrice: 180, total: 180 },
    ],
    subtotal: 3025,
    tax: 544.5, // 18% GST
    discount: 200, // Insurance coverage
    total: 3369.5,
    status: 'paid',
    paymentMethod: 'Insurance',
    paidAmount: 3369.5,
  },
];

// Mock API class
class MockAPI {
  private delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));
  private currentUser: User | null = null;

  // Authentication
  async login(email: string, password: string): Promise<User> {
    await this.delay();
    if (email && password) {
      // Find user by email or use default admin
      const user = mockUsers.find((u) => u.email === email) || mockUsers[0];
      this.currentUser = user;
      localStorage.setItem('current_user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  }

  async logout(): Promise<void> {
    await this.delay();
    this.currentUser = null;
    localStorage.removeItem('current_user');
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    if (this.currentUser) return this.currentUser;

    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      return this.currentUser;
    }

    return mockUsers[0]; // Default to admin
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    await this.delay();
    return [...mockPatients];
  }

  async getPatient(id: string): Promise<Patient> {
    await this.delay();
    const patient = mockPatients.find((p) => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return patient;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> {
    await this.delay();
    // Format registration date as DD-MM-YYYY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const registrationDate = `${day}-${month}-${year}`;

    const newPatient: Patient = {
      ...patient,
      id: `P${String(mockPatients.length + 1).padStart(3, '0')}`,
      registrationDate,
    };
    mockPatients.push(newPatient);
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    await this.delay();
    const index = mockPatients.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    mockPatients[index] = { ...mockPatients[index], ...updates };
    return mockPatients[index];
  }

  async deletePatient(id: string): Promise<void> {
    await this.delay();
    const index = mockPatients.findIndex((p) => p.id === id);
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
    const encounter = mockEncounters.find((e) => e.id === id);
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
    const index = mockEncounters.findIndex((e) => e.id === id);
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
    const result = mockLabResults.find((l) => l.id === id);
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
    const index = mockLabResults.findIndex((l) => l.id === id);
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
    const prescription = mockPrescriptions.find((p) => p.id === id);
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
    const bill = mockBills.find((b) => b.id === id);
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
    const index = mockBills.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Bill not found');
    mockBills[index] = { ...mockBills[index], ...updates };
    return mockBills[index];
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();
    return {
      totalPatients: mockPatients.length,
      todayAppointments: mockEncounters.filter(
        (e) => new Date(e.date).toDateString() === new Date().toDateString()
      ).length,
      pendingLabs: mockLabResults.filter((l) => l.status === 'pending').length,
      totalRevenue: mockBills
        .filter((b) => b.status === 'paid')
        .reduce((sum, b) => sum + b.total, 0),
      recentEncounters: mockEncounters.slice(-5).reverse(),
      recentPatients: mockPatients.slice(-5).reverse(),
    };
  }
}

export const api = new MockAPI();
