import { EncounterEntity } from '../entities/encounter.entity';
import {
  EncounterResponseDto,
  CodeableConceptDto,
  ReferenceDto,
  ParticipantDto,
  DiagnosisDto,
  PeriodDto,
  VitalSignsDto,
  SOAPNotesDto,
} from '../dto/encounter-response.dto';

/**
 * Transforms an Encounter entity to FHIR-inspired response DTO
 */
export class EncounterMapper {
  static toResponseDto(encounter: any): EncounterResponseDto {
    const encounterClass: CodeableConceptDto = {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: encounter.type === 'EMERGENCY' ? 'EMER' : 'AMB',
          display: encounter.type === 'EMERGENCY' ? 'Emergency' : 'Ambulatory',
        },
      ],
      text: encounter.type,
    };

    const encounterType: CodeableConceptDto[] = [
      {
        coding: [
          {
            code: encounter.type,
            display: encounter.type,
          },
        ],
        text: encounter.type,
      },
    ];

    const subject: ReferenceDto = {
      reference: `Patient/${encounter.patientId}`,
      type: 'Patient',
      display: encounter.patient
        ? `${encounter.patient.firstName} ${encounter.patient.lastName}`
        : undefined,
    };

    const participant: ParticipantDto[] = [
      {
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
              code: 'PPRF',
              display: 'Primary Performer',
            },
          ],
          text: 'Primary Care Physician',
        },
        individual: {
          reference: `Practitioner/${encounter.doctorId}`,
          type: 'Practitioner',
          display: encounter.doctor
            ? `Dr. ${encounter.doctor.firstName} ${encounter.doctor.lastName}`
            : undefined,
        },
      },
    ];

    const period: PeriodDto = {
      start: encounter.date.toISOString(),
      end: encounter.status === 'COMPLETED' ? encounter.updatedAt?.toISOString() : undefined,
    };

    const diagnosis: DiagnosisDto[] = [];
    if (encounter.diagnosis) {
      diagnosis.push({
        condition: {
          coding: encounter.diagnosisCode
            ? [
                {
                  system: 'http://hl7.org/fhir/sid/icd-10',
                  code: encounter.diagnosisCode,
                  display: encounter.diagnosis,
                },
              ]
            : undefined,
          text: encounter.diagnosis,
        },
        use: 'AD', // Admission diagnosis
        rank: 1,
      });
    }

    const reasonCode: CodeableConceptDto[] = [
      {
        text: encounter.chiefComplaint,
      },
    ];

    return {
      resourceType: 'Encounter',
      id: encounter.id,
      status: encounter.status,
      class: encounterClass,
      type: encounterType,
      subject,
      participant,
      period,
      reasonCode,
      diagnosis: diagnosis.length > 0 ? diagnosis : undefined,
      chiefComplaint: encounter.chiefComplaint,
      notes: encounter.notes,
      vitalSigns: encounter.vitalSigns as VitalSignsDto,
      soapNotes: encounter.soapNotes as SOAPNotesDto,
      createdAt: encounter.createdAt,
      updatedAt: encounter.updatedAt,
    };
  }

  static toResponseDtoArray(encounters: any[]): EncounterResponseDto[] {
    return encounters.map((encounter) => this.toResponseDto(encounter));
  }
}
