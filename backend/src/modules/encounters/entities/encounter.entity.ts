import { Encounter as PrismaEncounter, EncounterType, EncounterStatus } from '@prisma/client';

export class EncounterEntity implements PrismaEncounter {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  type: EncounterType;
  chiefComplaint: string;
  diagnosis: string;
  diagnosisCode: string | null;
  notes: string;
  status: EncounterStatus;
  vitalSigns: any;
  soapNotes: any;
  createdAt: Date;
  updatedAt: Date;
}
