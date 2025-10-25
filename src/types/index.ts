export type UserRole = 'admin' | 'doctor' | 'nurse' | 'lab_tech' | 'pharmacist' | 'billing';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // DD-MM-YYYY format
  gender: 'male' | 'female' | 'other';
  phone: string; // +91 format
  email: string;
  aadhaar?: string; // 12-digit Aadhaar number (will be masked in display)
  address: string;
  city: string;
  state: string;
  pincode: string; // 6-digit Indian pincode
  emergencyContact: string;
  emergencyPhone: string; // +91 format
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  registrationDate: string; // DD-MM-YYYY format
}

export interface Encounter {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // ISO format for internal use
  type: 'consultation' | 'followup' | 'emergency';
  chiefComplaint: string;
  diagnosis: string;
  diagnosisCode?: string; // ICD-10 code
  notes: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    spo2?: number;
    weight?: number;
    height?: number;
  };
}

export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  encounterId?: string;
  testName: string;
  testCategory: string;
  orderedDate: string;
  reportDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  results?: string;
  normalRange?: string;
  unit?: string;
  remarks?: string;
  orderedBy: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  encounterId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: Medication[];
  instructions?: string;
  status: 'active' | 'completed' | 'discontinued';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions?: string;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  encounterId?: string;
  date: string; // DD-MM-YYYY format
  items: BillItem[];
  subtotal: number; // in INR
  tax: number; // in INR
  discount: number; // in INR
  total: number; // in INR
  status: 'pending' | 'paid' | 'partially-paid' | 'cancelled';
  paymentMethod?: string;
  paidAmount?: number; // in INR
}

export interface BillItem {
  description: string;
  quantity: number;
  unitPrice: number; // in INR
  total: number; // in INR
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingLabs: number;
  totalRevenue: number;
  recentEncounters: Encounter[];
  recentPatients: Patient[];
}

// SOAP Notes for Encounter Form
export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

// Settings
export interface Settings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dateFormat: 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
}

// Offline Sync Queue
export interface SyncQueueItem {
  id: string;
  type: 'encounter' | 'lab' | 'prescription' | 'bill';
  action: 'create' | 'update' | 'delete';
  data: unknown;
  timestamp: string;
  synced: boolean;
  error?: string;
}
