# FHIR-like Schema Implementation with Indian Localization

This document describes the FHIR-like schema implementation with Indian hospital context, including Aadhaar masking, mobile number validation, date formatting, currency handling, and ICD-10 diagnosis codes.

## Features Implemented

### 1. FHIR-like Schemas with Zod Validation

Located in `src/schemas/fhir.schema.ts`, this file contains:

- **Patient Schema**: FHIR-compliant patient resource with Indian-specific fields
  - Aadhaar number validation (12 digits)
  - Indian mobile number validation (+91 format)
  - DD-MM-YYYY date format
  - Address with 6-digit pincode validation
  
- **Encounter Schema**: Medical encounters with ICD-10 diagnosis codes
  - Validates ICD-10 code format (e.g., J06.9, E11.9)
  - Supports vital signs tracking
  
- **Observation Schema**: Lab results and vital signs
  - Supports various data types (quantity, string, boolean, codeable concept)
  - Reference ranges for normal values
  
- **Medication & MedicationRequest Schemas**: Prescription management
  - Dosage instructions with timing
  - Route of administration
  
- **Invoice Schema**: Billing with INR currency enforcement
  - All amounts in INR
  - Line items with pricing breakdown
  - Tax and discount support

### 2. Validation Utilities

The following utility functions are provided:

```typescript
// Aadhaar masking
maskAadhaar("123456789012") // Returns "XXXX-XXXX-9012"

// Mobile number formatting
formatIndianMobile("9876543210") // Returns "+91 98765 43210"

// Date formatting
formatToDDMMYYYY(new Date()) // Returns "25-10-2024"
parseDDMMYYYY("25-10-2024") // Returns Date object

// Currency formatting
formatINR(1274.40) // Returns "₹1,274.40"
```

### 3. Form Validation Schema

Located in `src/schemas/patient-form.schema.ts`:

- **PatientFormSchema**: Simplified form validation for UI
  - Validates all Indian-specific formats
  - Integrates with React Hook Form via Zod resolver
  - Includes common ICD-10 codes list

### 4. Patient Duplicate Detection

Located in `src/utils/duplicate-detection.ts`:

The duplicate detection system checks for potential duplicate patients based on:
- Same name (first + last)
- Same date of birth
- Same mobile number

Features:
- `isPotentialDuplicate()`: Exact match detection
- `findDuplicatePatients()`: Find duplicates in patient list
- `calculateDuplicateScore()`: Fuzzy matching with confidence score
- `findPotentialDuplicatesWithScore()`: Advanced duplicate detection with threshold

### 5. Mock Data Updates

All mock data in `src/services/api.ts` has been updated with realistic Indian hospital data:

**Patients:**
- 5 sample patients from different Indian cities
- Realistic Aadhaar numbers (masked in display)
- +91 mobile numbers
- DD-MM-YYYY birth dates
- Indian addresses with 6-digit pincodes

**Encounters:**
- 5 sample encounters with ICD-10 diagnosis codes
- Realistic chief complaints and diagnoses
- Vital signs tracking

**Billing:**
- 5 sample bills with INR amounts
- Realistic Indian hospital charges
- 18% GST calculation
- Payment methods: UPI, Card, Insurance

### 6. ICD-10 Diagnosis Codes

Located in `src/data/icd10-codes.json`:

A comprehensive JSON file with 47 common ICD-10 codes used in Indian hospitals, categorized by:
- Infectious Diseases
- Respiratory
- Endocrine
- Cardiovascular
- Gastrointestinal
- Symptoms
- Musculoskeletal
- Genitourinary
- Dermatology
- Ophthalmology
- ENT
- Neurology
- Follow-up
- Preventive
- Obstetrics
- Mental Health

### 7. UI Updates

**Patient Form (PatientsPage.tsx):**
- Integrated Zod validation with React Hook Form
- DD-MM-YYYY date input
- Aadhaar number field with masking hint
- +91 mobile number validation
- 6-digit pincode validation
- Duplicate patient warning dialog

**Patient Table:**
- Displays masked Aadhaar (XXXX-XXXX-9012)
- Formatted mobile numbers
- DD-MM-YYYY dates

**Billing Page:**
- INR currency formatting using `formatINR()`
- DD-MM-YYYY date display
- 18% GST calculation

**Dashboard:**
- INR revenue display using `formatINR()`

## Type Definitions

Updated `src/types/index.ts` with:

```typescript
interface Patient {
  // ... existing fields
  aadhaar?: string; // 12-digit Aadhaar number
  dateOfBirth: string; // DD-MM-YYYY format
  phone: string; // +91 format
  registrationDate: string; // DD-MM-YYYY format
}

interface Encounter {
  // ... existing fields
  diagnosisCode?: string; // ICD-10 code
}

interface Bill {
  // ... existing fields
  date: string; // DD-MM-YYYY format
  // All amounts in INR
}
```

## Validation Examples

### Patient Form Validation

```typescript
import { PatientFormSchema } from './schemas/patient-form.schema';

// Valid data
const patientData = {
  firstName: "Amit",
  lastName: "Sharma",
  dateOfBirth: "15-05-1985",
  gender: "male",
  phone: "+919876543210",
  email: "amit@example.com",
  aadhaar: "123456789012",
  address: "123, MG Road",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400058",
  emergencyContact: "Priya Sharma",
  emergencyPhone: "+919876543211"
};

// Validate
const result = PatientFormSchema.safeParse(patientData);
```

### Duplicate Detection

```typescript
import { findDuplicatePatients } from './utils/duplicate-detection';

const newPatient = {
  firstName: "Amit",
  lastName: "Sharma",
  dateOfBirth: "15-05-1985",
  phone: "+919876543210",
  // ... other fields
};

const duplicates = findDuplicatePatients(newPatient, existingPatients);
if (duplicates.length > 0) {
  // Show warning to user
}
```

## Dependencies Added

- `zod`: ^3.x - Schema validation
- `@hookform/resolvers`: ^3.x - React Hook Form + Zod integration

## Compliance

This implementation follows:
- **FHIR R4 Standards**: Resource structures align with HL7 FHIR specifications
- **Indian Standards**:
  - UIDAI Aadhaar format
  - Indian mobile number format (+91)
  - Indian Standard Time (IST)
  - GST tax calculation (18%)
  - ICD-10 diagnosis coding
  
## Testing

The implementation has been validated through:
1. ✅ TypeScript compilation
2. ✅ Build process (Vite)
3. ✅ Linter checks
4. ✅ Dev server startup
5. ✅ Schema validation tests

## Usage in Application

### Adding a New Patient with Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PatientFormSchema } from './schemas/patient-form.schema';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(PatientFormSchema),
});

const onSubmit = (data) => {
  // data is validated and phone numbers are normalized
  api.createPatient(data);
};
```

### Displaying Patient Information

```typescript
import { maskAadhaar, formatIndianMobile } from './schemas/fhir.schema';

// Display
<td>{maskAadhaar(patient.aadhaar)}</td>
<td>{formatIndianMobile(patient.phone)}</td>
<td>{patient.dateOfBirth}</td> // Already in DD-MM-YYYY
```

### Displaying Billing Amounts

```typescript
import { formatINR } from './schemas/fhir.schema';

<td>{formatINR(bill.total)}</td> // ₹1,274.40
```

## Future Enhancements

1. Add more ICD-10 codes with search/autocomplete
2. Implement FHIR REST API endpoints
3. Add FHIR Bundle support for batch operations
4. Integrate with ABDM (Ayushman Bharat Digital Mission)
5. Add HL7 FHIR validation library
6. Support multiple languages (Hindi, regional languages)
7. Add consent management (as per DPDP Act)
