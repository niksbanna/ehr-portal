import { LabResultEntity } from '../entities/lab-result.entity';
import {
  LabResultResponseDto,
  QuantityDto,
  ReferenceRangeDto,
} from '../dto/lab-response.dto';
import { CodeableConceptDto, ReferenceDto } from '../../encounters/dto/encounter-response.dto';

/**
 * Transforms a Lab Result entity to FHIR-inspired Observation response DTO
 */
export class LabResultMapper {
  static toResponseDto(labResult: any): LabResultResponseDto {
    const category: CodeableConceptDto[] = [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'laboratory',
            display: 'Laboratory',
          },
        ],
        text: labResult.testCategory,
      },
    ];

    const code: CodeableConceptDto = {
      coding: [
        {
          system: 'http://loinc.org',
          code: labResult.testName.toUpperCase().replace(/\s+/g, '_'),
          display: labResult.testName,
        },
      ],
      text: labResult.testName,
    };

    const subject: ReferenceDto = {
      reference: `Patient/${labResult.patientId}`,
      type: 'Patient',
      display: labResult.patient
        ? `${labResult.patient.firstName} ${labResult.patient.lastName}`
        : undefined,
    };

    const encounter: ReferenceDto | undefined = labResult.encounterId
      ? {
          reference: `Encounter/${labResult.encounterId}`,
          type: 'Encounter',
        }
      : undefined;

    const performer: ReferenceDto | undefined = labResult.orderedById
      ? {
          reference: `Practitioner/${labResult.orderedById}`,
          type: 'Practitioner',
          display: labResult.orderedBy
            ? `Dr. ${labResult.orderedBy.firstName} ${labResult.orderedBy.lastName}`
            : undefined,
        }
      : undefined;

    // Try to parse numeric value
    let valueQuantity: QuantityDto | undefined;
    let valueString: string | undefined;
    
    if (labResult.results) {
      const numericValue = parseFloat(labResult.results);
      if (!isNaN(numericValue)) {
        valueQuantity = {
          value: numericValue,
          unit: labResult.unit || undefined,
        };
      } else {
        valueString = labResult.results;
      }
    }

    const referenceRange: ReferenceRangeDto[] | undefined = labResult.normalRange
      ? [
          {
            text: labResult.normalRange,
          },
        ]
      : undefined;

    // Determine interpretation based on result vs normal range
    let interpretation: CodeableConceptDto | undefined;
    if (labResult.results && labResult.normalRange) {
      // Simple interpretation - you can enhance this with actual range comparison
      interpretation = {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: 'N',
            display: 'Normal',
          },
        ],
        text: 'Normal',
      };
    }

    return {
      resourceType: 'Observation',
      id: labResult.id,
      status: labResult.status,
      category,
      code,
      subject,
      encounter,
      effectiveDateTime: labResult.orderedDate.toISOString(),
      issued: labResult.reportDate?.toISOString(),
      performer,
      valueQuantity,
      valueString,
      interpretation,
      note: labResult.remarks,
      referenceRange,
      createdAt: labResult.createdAt,
      updatedAt: labResult.updatedAt,
    };
  }

  static toResponseDtoArray(labResults: any[]): LabResultResponseDto[] {
    return labResults.map((labResult) => this.toResponseDto(labResult));
  }
}
