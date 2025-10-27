import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * FHIR-inspired Coding type for coded values
 */
export class CodingDto {
  @ApiPropertyOptional({ description: 'Identity of the terminology system' })
  system?: string;

  @ApiPropertyOptional({ description: 'Version of the system' })
  version?: string;

  @ApiProperty({ description: 'Symbol in syntax defined by the system' })
  code: string;

  @ApiPropertyOptional({ description: 'Representation defined by the system' })
  display?: string;
}

/**
 * FHIR-inspired CodeableConcept type
 */
export class CodeableConceptDto {
  @ApiPropertyOptional({ description: 'Code defined by a terminology system', type: [CodingDto] })
  coding?: CodingDto[];

  @ApiPropertyOptional({ description: 'Plain text representation' })
  text?: string;
}

/**
 * FHIR-inspired Period type
 */
export class PeriodDto {
  @ApiPropertyOptional({ description: 'Start time with inclusive boundary' })
  start?: string;

  @ApiPropertyOptional({ description: 'End time with inclusive boundary' })
  end?: string;
}

/**
 * FHIR-inspired Reference type
 */
export class ReferenceDto {
  @ApiPropertyOptional({ description: 'Literal reference, Relative, internal or absolute URL' })
  reference?: string;

  @ApiPropertyOptional({ description: 'Type the reference refers to' })
  type?: string;

  @ApiPropertyOptional({ description: 'Text alternative for the resource' })
  display?: string;
}

/**
 * FHIR-inspired Participant type for encounters
 */
export class ParticipantDto {
  @ApiPropertyOptional({ description: 'Role of participant', type: CodeableConceptDto })
  type?: CodeableConceptDto;

  @ApiProperty({ description: 'Person participating in the encounter', type: ReferenceDto })
  individual: ReferenceDto;

  @ApiPropertyOptional({ description: 'Period of time during the encounter participant was present', type: PeriodDto })
  period?: PeriodDto;
}

/**
 * FHIR-inspired Diagnosis for encounters
 */
export class DiagnosisDto {
  @ApiProperty({ description: 'Condition diagnosed', type: CodeableConceptDto })
  condition: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Role that this diagnosis has within the encounter' })
  use?: string;

  @ApiPropertyOptional({ description: 'Ranking of the diagnosis' })
  rank?: number;
}

/**
 * Vital signs observation
 */
export class VitalSignsDto {
  @ApiPropertyOptional({ description: 'Blood pressure (systolic/diastolic)' })
  bloodPressure?: string;

  @ApiPropertyOptional({ description: 'Heart rate (bpm)' })
  heartRate?: number;

  @ApiPropertyOptional({ description: 'Respiratory rate (breaths per minute)' })
  respiratoryRate?: number;

  @ApiPropertyOptional({ description: 'Temperature (°C)' })
  temperature?: number;

  @ApiPropertyOptional({ description: 'Oxygen saturation (%)' })
  oxygenSaturation?: number;

  @ApiPropertyOptional({ description: 'Weight (kg)' })
  weight?: number;

  @ApiPropertyOptional({ description: 'Height (cm)' })
  height?: number;
}

/**
 * SOAP notes structure
 */
export class SOAPNotesDto {
  @ApiPropertyOptional({ description: 'Subjective: Patient-reported symptoms' })
  subjective?: string;

  @ApiPropertyOptional({ description: 'Objective: Observed findings and test results' })
  objective?: string;

  @ApiPropertyOptional({ description: 'Assessment: Diagnosis and analysis' })
  assessment?: string;

  @ApiPropertyOptional({ description: 'Plan: Treatment plan and next steps' })
  plan?: string;
}

/**
 * Response DTO for Encounter resource (FHIR-inspired)
 */
export class EncounterResponseDto {
  @ApiProperty({ description: 'Resource type' })
  resourceType: 'Encounter';

  @ApiProperty({ description: 'Encounter ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Identifier for the encounter' })
  identifier?: string;

  @ApiProperty({ description: 'Status of the encounter', enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Classification of encounter', type: CodeableConceptDto })
  class: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Specific type of encounter', type: [CodeableConceptDto] })
  type?: CodeableConceptDto[];

  @ApiProperty({ description: 'Patient reference', type: ReferenceDto })
  subject: ReferenceDto;

  @ApiPropertyOptional({ description: 'Participant in the encounter', type: [ParticipantDto] })
  participant?: ParticipantDto[];

  @ApiProperty({ description: 'Start and end time of the encounter', type: PeriodDto })
  period: PeriodDto;

  @ApiPropertyOptional({ description: 'Reason for encounter' })
  reasonCode?: CodeableConceptDto[];

  @ApiPropertyOptional({ description: 'List of diagnosis relevant to this encounter', type: [DiagnosisDto] })
  diagnosis?: DiagnosisDto[];

  @ApiProperty({ description: 'Chief complaint' })
  chiefComplaint: string;

  @ApiPropertyOptional({ description: 'Clinical notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Vital signs recorded during encounter', type: VitalSignsDto })
  vitalSigns?: VitalSignsDto;

  @ApiPropertyOptional({ description: 'SOAP notes', type: SOAPNotesDto })
  soapNotes?: SOAPNotesDto;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
