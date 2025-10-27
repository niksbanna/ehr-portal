# API Schema Implementation Guide

This document describes the FHIR-inspired API schema implementation for the EHR Portal backend.

## Overview

The API has been enhanced with:
- **FHIR-inspired resource schemas** (Patient, Encounter, Observation/Lab, Invoice/Bill)
- **Structured JSON responses** with metadata
- **Pagination, filtering, and sorting** for all list endpoints
- **Consistent error format** for all API errors

## Response Structure

### Single Resource Response

All single resource endpoints (GET by ID, POST, PUT, DELETE) return:

```json
{
  "data": {
    "resourceType": "Patient|Encounter|Observation|Invoice",
    "id": "...",
    // ... resource fields
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0"
  }
}
```

### Paginated List Response

All list endpoints (GET /patients, /encounters, /labs, /billing) return:

```json
{
  "data": [
    {
      "resourceType": "Patient",
      "id": "...",
      // ... resource fields
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "sorting": {
      "sortBy": "createdAt",
      "order": "desc"
    }
  }
}
```

### Error Response

All errors return a consistent format:

```json
{
  "statusCode": 404,
  "message": "Patient with ID xyz not found",
  "error": "Not Found",
  "path": "/api/patients/xyz",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## API Endpoints

### 1. Patients (`/api/patients`)

#### GET /api/patients
Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in firstName, lastName, email, phone
- `sortBy` (optional): Database field to sort by (e.g., firstName, lastName, createdAt, updatedAt)
- `order` (optional): Sort order - `asc` or `desc` (default: desc)

**Note**: Sorting is performed on the underlying database fields, not on the transformed FHIR structure. Valid sort fields include: firstName, lastName, email, phone, city, state, dateOfBirth, registrationDate, createdAt, updatedAt.

Response: FHIR Patient resource with:
- `resourceType`: "Patient"
- `identifier`: Array of identifiers (AADHAAR)
- `name`: HumanName structure (family, given, text)
- `telecom`: Array of contact points (phone, email)
- `address`: Structured address (line, city, state, postalCode, country)
- `contact`: Emergency contact information
- `gender`, `birthDate`, `bloodGroup`, `allergies`, `medicalHistory`

#### GET /api/patients/:id
Returns single patient resource.

#### POST /api/patients
Creates a new patient. Accepts standard CreatePatientDto.

#### PATCH /api/patients/:id
Updates an existing patient.

#### DELETE /api/patients/:id
Deletes a patient.

### 2. Encounters (`/api/encounters`)

#### GET /api/encounters
Query Parameters:
- `page`, `limit`, `search` (as above)
- `patientId` (optional): Filter by patient ID
- `status` (optional): Filter by status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `sortBy` (optional): Database field to sort by (e.g., date, status, createdAt)
- `order` (optional): Sort order

**Note**: Valid sort fields include: date, status, type, createdAt, updatedAt.

Response: FHIR Encounter resource with:
- `resourceType`: "Encounter"
- `status`: Encounter status
- `class`: Classification (AMB/EMER)
- `type`: Encounter type coding
- `subject`: Reference to Patient
- `participant`: Array of practitioners
- `period`: Start and end time
- `reasonCode`: Chief complaint
- `diagnosis`: Array of diagnoses with ICD-10 codes
- `vitalSigns`: Vital signs object
- `soapNotes`: SOAP notes structure

#### GET /api/encounters/:id
Returns single encounter resource.

#### GET /api/encounters/patient/:patientId
Returns all encounters for a specific patient.

#### POST /api/encounters
Creates a new encounter.

#### PATCH /api/encounters/:id
Updates an encounter.

#### DELETE /api/encounters/:id
Deletes an encounter.

### 3. Labs/Observations (`/api/labs`)

#### GET /api/labs
Query Parameters:
- `page`, `limit` (as above)
- `patientId` (optional): Filter by patient ID
- `status` (optional): Filter by status (PENDING, IN_PROGRESS, COMPLETED)
- `sortBy` (optional): Database field to sort by (e.g., orderedDate, reportDate, status, testName)
- `order` (optional): Sort order

**Note**: Valid sort fields include: orderedDate, reportDate, status, testName, testCategory, createdAt, updatedAt.

Response: FHIR Observation resource with:
- `resourceType`: "Observation"
- `status`: Observation status
- `category`: Laboratory category
- `code`: Test code (LOINC-inspired)
- `subject`: Reference to Patient
- `encounter`: Reference to Encounter (if applicable)
- `effectiveDateTime`: When test was ordered
- `issued`: When results were issued
- `performer`: Reference to ordering practitioner
- `valueQuantity`: Numeric result with unit
- `valueString`: String result
- `interpretation`: Normal/Abnormal interpretation
- `referenceRange`: Normal ranges

#### GET /api/labs/:id
Returns single lab result.

#### GET /api/labs/patient/:patientId
Returns all lab results for a patient.

#### GET /api/labs/encounter/:encounterId
Returns all lab results for an encounter.

#### POST /api/labs
Creates a new lab result.

#### PATCH /api/labs/:id
Updates a lab result.

#### DELETE /api/labs/:id
Deletes a lab result.

### 4. Billing (`/api/billing`)

#### GET /api/billing
Query Parameters:
- `page`, `limit` (as above)
- `patientId` (optional): Filter by patient ID
- `status` (optional): Filter by payment status (PENDING, PAID, CANCELLED)
- `sortBy` (optional): Database field to sort by (e.g., date, total, paymentStatus)
- `order` (optional): Sort order

**Note**: Valid sort fields include: date, total, subtotal, tax, paymentStatus, paymentMethod, createdAt, updatedAt.

Response: FHIR Invoice resource with:
- `resourceType`: "Invoice"
- `status`: Payment status
- `type`: Invoice type
- `subject`: Reference to Patient
- `encounter`: Reference to Encounter (if applicable)
- `date`: Invoice date
- `lineItem`: Array of line items with charges
- `subtotal`, `tax`, `discount`, `totalNet`: Money objects with currency
- `paymentMethod`: Payment method coding
- `note`: Additional notes

#### GET /api/billing/:id
Returns single bill.

#### GET /api/billing/patient/:patientId
Returns all bills for a patient.

#### POST /api/billing
Creates a new bill.

#### PATCH /api/billing/:id
Updates a bill.

#### DELETE /api/billing/:id
Deletes a bill.

## FHIR Alignment

The schemas are loosely based on FHIR R4 resources:

1. **Patient Resource**: Aligns with FHIR Patient
   - Uses HumanName, ContactPoint, Address structures
   - Supports identifiers (AADHAAR)
   - Includes Indian-specific fields

2. **Encounter Resource**: Aligns with FHIR Encounter
   - Uses CodeableConcept for coding
   - Includes Period for time ranges
   - Supports ICD-10 diagnosis codes

3. **Observation Resource**: Aligns with FHIR Observation
   - Used for lab results
   - Supports various value types (Quantity, String, Boolean, CodeableConcept)
   - Includes reference ranges and interpretation

4. **Invoice Resource**: Aligns with FHIR Invoice
   - Used for billing
   - Includes line items and price components
   - Uses Money type for amounts

## Frontend Integration

Frontend should:
1. Parse the `data` field from responses
2. Use `meta.pagination` for pagination UI
3. Handle errors using the consistent error format
4. Send query parameters for filtering and sorting

Example:
```typescript
// Fetch patients with pagination and sorting
const response = await fetch('/api/patients?page=1&limit=10&sortBy=lastName&order=asc');
const json = await response.json();

// Access data
const patients = json.data;

// Access pagination metadata
const { page, total, totalPages, hasNext } = json.meta.pagination;

// Access sorting metadata (if any)
const { sortBy, order } = json.meta.sorting || {};
```

## Migration Notes

- Existing DTOs (CreatePatientDto, etc.) remain unchanged for backward compatibility
- Response transformation happens in the service layer using mappers
- Repositories support new sorting parameters
- All endpoints maintain the same paths and authentication requirements

## Benefits

1. **FHIR Compliance**: Easier integration with FHIR-based systems
2. **Consistent Structure**: Predictable response format across all endpoints
3. **Rich Metadata**: Pagination and sorting info in every response
4. **Extensibility**: Easy to add more FHIR resources or fields
5. **Error Handling**: Consistent error format for better error handling on frontend
6. **Indian Context**: Maintains Indian-specific fields (AADHAAR, INR currency, ICD-10 codes)
