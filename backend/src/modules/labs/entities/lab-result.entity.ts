import { LabResult as PrismaLabResult, LabStatus } from '@prisma/client';

export class LabResultEntity implements PrismaLabResult {
  id: string;
  patientId: string;
  encounterId: string | null;
  testName: string;
  testCategory: string;
  orderedDate: Date;
  reportDate: Date | null;
  status: LabStatus;
  results: string | null;
  normalRange: string | null;
  unit: string | null;
  remarks: string | null;
  orderedById: string;
  createdAt: Date;
  updatedAt: Date;
}
