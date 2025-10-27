import { Patient as PrismaPatient, Gender } from '@prisma/client';

export class PatientEntity implements PrismaPatient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email: string;
  aadhaar: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup: string | null;
  allergies: string | null;
  medicalHistory: string | null;
  registrationDate: string;
  createdAt: Date;
  updatedAt: Date;
}
