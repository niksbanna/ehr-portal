import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * FHIR-inspired Identifier type
 */
export class IdentifierDto {
  @ApiPropertyOptional({ description: 'Use of identifier (e.g., official, secondary)' })
  use?: string;

  @ApiPropertyOptional({ description: 'Type of identifier (e.g., MRN, AADHAAR)' })
  type?: string;

  @ApiPropertyOptional({ description: 'The namespace for the identifier value' })
  system?: string;

  @ApiProperty({ description: 'The value that is unique' })
  value: string;
}

/**
 * FHIR-inspired Telecom/ContactPoint type
 */
export class ContactPointDto {
  @ApiProperty({ description: 'Contact point system', enum: ['phone', 'email', 'other'] })
  system: 'phone' | 'email' | 'other';

  @ApiProperty({ description: 'The actual contact point details' })
  value: string;

  @ApiPropertyOptional({ description: 'Use of contact point', enum: ['home', 'work', 'mobile'] })
  use?: 'home' | 'work' | 'mobile';
}

/**
 * FHIR-inspired Address type
 */
export class AddressDto {
  @ApiPropertyOptional({ description: 'Use of address', enum: ['home', 'work', 'billing'] })
  use?: 'home' | 'work' | 'billing';

  @ApiPropertyOptional({ description: 'Address type', enum: ['postal', 'physical'] })
  type?: 'postal' | 'physical';

  @ApiProperty({ description: 'Street address' })
  line: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'State' })
  state: string;

  @ApiProperty({ description: 'Postal code' })
  postalCode: string;

  @ApiPropertyOptional({ description: 'Country' })
  country?: string;
}

/**
 * FHIR-inspired HumanName type
 */
export class HumanNameDto {
  @ApiPropertyOptional({ description: 'Use of name', enum: ['official', 'usual', 'nickname'] })
  use?: 'official' | 'usual' | 'nickname';

  @ApiProperty({ description: 'Family name (surname)' })
  family: string;

  @ApiProperty({ description: 'Given names', type: [String] })
  given: string[];

  @ApiPropertyOptional({ description: 'Full name as text' })
  text?: string;
}

/**
 * FHIR-inspired Contact type for emergency contacts
 */
export class ContactDto {
  @ApiProperty({ description: 'Relationship to patient' })
  relationship: string;

  @ApiProperty({ description: 'Name of contact person' })
  name: string;

  @ApiProperty({ description: 'Contact phone number' })
  telecom: ContactPointDto;
}

/**
 * Response DTO for Patient resource (FHIR-inspired)
 */
export class PatientResponseDto {
  @ApiProperty({ description: 'Resource type' })
  resourceType: 'Patient';

  @ApiProperty({ description: 'Patient ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Identifiers for the patient', type: [IdentifierDto] })
  identifier?: IdentifierDto[];

  @ApiPropertyOptional({ description: 'Patient active status' })
  active?: boolean;

  @ApiProperty({ description: 'Patient name', type: HumanNameDto })
  name: HumanNameDto;

  @ApiPropertyOptional({ description: 'Contact points', type: [ContactPointDto] })
  telecom?: ContactPointDto[];

  @ApiProperty({ description: 'Gender', enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: string;

  @ApiProperty({ description: 'Date of birth (DD-MM-YYYY)' })
  birthDate: string;

  @ApiPropertyOptional({ description: 'Address', type: AddressDto })
  address?: AddressDto;

  @ApiPropertyOptional({ description: 'Emergency contact', type: ContactDto })
  contact?: ContactDto;

  @ApiPropertyOptional({ description: 'Blood group' })
  bloodGroup?: string;

  @ApiPropertyOptional({ description: 'Allergies' })
  allergies?: string;

  @ApiPropertyOptional({ description: 'Medical history' })
  medicalHistory?: string;

  @ApiProperty({ description: 'Registration date (DD-MM-YYYY)' })
  registrationDate: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
