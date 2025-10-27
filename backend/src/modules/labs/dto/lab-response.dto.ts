import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CodeableConceptDto, ReferenceDto } from '../../encounters/dto/encounter-response.dto';

/**
 * FHIR-inspired Quantity type
 */
export class QuantityDto {
  @ApiPropertyOptional({ description: 'Numerical value' })
  value?: number;

  @ApiPropertyOptional({ description: 'Unit representation' })
  unit?: string;

  @ApiPropertyOptional({ description: 'System that defines coded unit form' })
  system?: string;

  @ApiPropertyOptional({ description: 'Coded form of the unit' })
  code?: string;
}

/**
 * FHIR-inspired Reference Range
 */
export class ReferenceRangeDto {
  @ApiPropertyOptional({ description: 'Low Range', type: QuantityDto })
  low?: QuantityDto;

  @ApiPropertyOptional({ description: 'High Range', type: QuantityDto })
  high?: QuantityDto;

  @ApiPropertyOptional({ description: 'Reference range qualifier' })
  type?: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Text based reference range' })
  text?: string;
}

/**
 * FHIR-inspired Observation Component
 */
export class ObservationComponentDto {
  @ApiProperty({ description: 'Type of component observation', type: CodeableConceptDto })
  code: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Actual component result', type: QuantityDto })
  valueQuantity?: QuantityDto;

  @ApiPropertyOptional({ description: 'String value' })
  valueString?: string;

  @ApiPropertyOptional({ description: 'Reference range', type: [ReferenceRangeDto] })
  referenceRange?: ReferenceRangeDto[];
}

/**
 * Response DTO for Lab Result/Observation resource (FHIR-inspired)
 */
export class LabResultResponseDto {
  @ApiProperty({ description: 'Resource type' })
  resourceType: 'Observation';

  @ApiProperty({ description: 'Observation ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Business identifiers' })
  identifier?: string;

  @ApiProperty({
    description: 'Status of the result',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Category of observation (e.g., laboratory, vital-signs)',
    type: [CodeableConceptDto],
  })
  category?: CodeableConceptDto[];

  @ApiProperty({ description: 'Type of observation (test name)', type: CodeableConceptDto })
  code: CodeableConceptDto;

  @ApiProperty({ description: 'Patient reference', type: ReferenceDto })
  subject: ReferenceDto;

  @ApiPropertyOptional({
    description: 'Healthcare event (encounter) reference',
    type: ReferenceDto,
  })
  encounter?: ReferenceDto;

  @ApiPropertyOptional({ description: 'Date/time this observation was made' })
  effectiveDateTime?: string;

  @ApiPropertyOptional({ description: 'Date/time the observation was issued' })
  issued?: string;

  @ApiPropertyOptional({
    description: 'Who is responsible for the observation',
    type: ReferenceDto,
  })
  performer?: ReferenceDto;

  @ApiPropertyOptional({ description: 'Actual result value', type: QuantityDto })
  valueQuantity?: QuantityDto;

  @ApiPropertyOptional({ description: 'String result value' })
  valueString?: string;

  @ApiPropertyOptional({ description: 'Boolean result value' })
  valueBoolean?: boolean;

  @ApiPropertyOptional({ description: 'Coded result value', type: CodeableConceptDto })
  valueCodeableConcept?: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'High, low, normal, etc.', type: CodeableConceptDto })
  interpretation?: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Comments about result' })
  note?: string;

  @ApiPropertyOptional({
    description: 'Provides guide for interpretation',
    type: [ReferenceRangeDto],
  })
  referenceRange?: ReferenceRangeDto[];

  @ApiPropertyOptional({
    description: 'Component observations (for panels)',
    type: [ObservationComponentDto],
  })
  component?: ObservationComponentDto[];

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
