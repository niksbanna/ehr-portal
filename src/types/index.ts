export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  registrationDate: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  type: 'consultation' | 'followup' | 'emergency';
  chiefComplaint: string;
  diagnosis: string;
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
  date: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'partially-paid' | 'cancelled';
  paymentMethod?: string;
  paidAmount?: number;
}

export interface BillItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingLabs: number;
  totalRevenue: number;
  recentEncounters: Encounter[];
  recentPatients: Patient[];
}
