import { PatientEntity } from '../entities/patient.entity';
import { 
  PatientResponseDto, 
  HumanNameDto, 
  ContactPointDto, 
  AddressDto, 
  ContactDto,
  IdentifierDto 
} from '../dto/patient-response.dto';

/**
 * Transforms a Patient entity to FHIR-inspired response DTO
 */
export class PatientMapper {
  static toResponseDto(patient: any): PatientResponseDto {
    const name: HumanNameDto = {
      use: 'official',
      family: patient.lastName,
      given: [patient.firstName],
      text: `${patient.firstName} ${patient.lastName}`,
    };

    const telecom: ContactPointDto[] = [
      {
        system: 'phone',
        value: patient.phone,
        use: 'mobile',
      },
      {
        system: 'email',
        value: patient.email,
        use: 'home',
      },
    ];

    const address: AddressDto = {
      use: 'home',
      type: 'physical',
      line: patient.address,
      city: patient.city,
      state: patient.state,
      postalCode: patient.pincode,
      country: 'India',
    };

    const contact: ContactDto = {
      relationship: 'Emergency Contact',
      name: patient.emergencyContact,
      telecom: {
        system: 'phone',
        value: patient.emergencyPhone,
        use: 'mobile',
      },
    };

    const identifiers: IdentifierDto[] = [];
    if (patient.aadhaar) {
      identifiers.push({
        use: 'official',
        type: 'AADHAAR',
        system: 'https://uidai.gov.in',
        value: patient.aadhaar,
      });
    }

    return {
      resourceType: 'Patient',
      id: patient.id,
      identifier: identifiers.length > 0 ? identifiers : undefined,
      active: true,
      name,
      telecom,
      gender: patient.gender,
      birthDate: patient.dateOfBirth,
      address,
      contact,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      medicalHistory: patient.medicalHistory,
      registrationDate: patient.registrationDate,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }

  static toResponseDtoArray(patients: any[]): PatientResponseDto[] {
    return patients.map((patient) => this.toResponseDto(patient));
  }
}
