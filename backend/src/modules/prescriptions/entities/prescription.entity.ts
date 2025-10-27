import { Prescription as PrismaPrescription, PrescriptionStatus } from '@prisma/client';

export class PrescriptionEntity implements PrismaPrescription {
  id: string;
  patientId: string;
  encounterId: string;
  doctorId: string;
  date: Date;
  medications: any;
  instructions: string | null;
  status: PrescriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}
