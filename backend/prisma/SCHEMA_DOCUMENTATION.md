# Prisma Schema Documentation

## Overview

This document describes the PostgreSQL database schema for the EHR Portal application, with a focus on Indian healthcare constraints and requirements.

## Schema Models

### 1. **User**
System users with role-based access control.

**Fields:**
- `id`: Unique identifier (UUID)
- `email`: Unique email address
- `password`: Hashed password
- `name`: Full name
- `role`: User role (enum: ADMIN, DOCTOR, NURSE, LAB_TECH, PHARMACIST, BILLING, RECEPTIONIST)
- `createdAt`, `updatedAt`: Timestamps

**Relations:**
- Has many: Encounters, Prescriptions, LabResults, Observations, Medications, AuditLogs

### 2. **Patient**
Patient demographic and medical information with Indian data constraints.

**Fields:**
- `id`: Unique identifier (UUID)
- `firstName`, `lastName`: Patient name
- `dateOfBirth`: Format DD-MM-YYYY (stored as String)
- `gender`: Enum (MALE, FEMALE, OTHER)
- `phone`: Format +91XXXXXXXXXX (10-digit Indian mobile)
- `email`: Email address
- `aadhaar`: **UNIQUE**, masked format XXXX-XXXX-XXXX (last 4 digits visible)
- `address`, `city`, `state`: Address components
- `pincode`: 6-digit Indian postal code
- `emergencyContact`, `emergencyPhone`: Emergency contact details (phone in +91 format)
- `bloodGroup`: Blood type (e.g., A+, B-, O+)
- `allergies`: Known allergies
- `medicalHistory`: Previous medical conditions
- `registrationDate`: Format DD-MM-YYYY
- `createdAt`, `updatedAt`: Timestamps

**Indian Constraints:**
- Aadhaar numbers are unique and masked for privacy
- Phone numbers follow +91 format
- Dates stored in DD-MM-YYYY format
- Pincodes are 6-digit Indian postal codes

**Relations:**
- Has many: Encounters, LabResults, Prescriptions, Medications, Bills, Observations

### 3. **Encounter**
Medical encounters/visits between patients and doctors.

**Fields:**
- `id`: Unique identifier (UUID)
- `patientId`: Foreign key to Patient
- `doctorId`: Foreign key to User
- `date`: Encounter date/time
- `type`: Enum (CONSULTATION, FOLLOWUP, EMERGENCY)
- `chiefComplaint`: Primary complaint
- `diagnosis`: Diagnosis description
- `diagnosisCode`: ICD-10 or other diagnosis codes
- `notes`: Clinical notes
- `status`: Enum (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `vitalSigns`: JSON object with vital signs data
- `soapNotes`: JSON object for SOAP notes
- `createdAt`, `updatedAt`: Timestamps

**Relations:**
- Belongs to: Patient, User (doctor)
- Has many: LabResults, Prescriptions, Medications, Bills, Observations

### 4. **Observation**
Clinical observations including vital signs, lab tests, and physical exams.

**Fields:**
- `id`: Unique identifier (UUID)
- `patientId`: Foreign key to Patient
- `encounterId`: Optional foreign key to Encounter
- `recordedById`: Foreign key to User
- `date`: Observation date/time
- `type`: Enum (VITAL_SIGN, LABORATORY, IMAGING, PROCEDURE, PHYSICAL_EXAM, SOCIAL_HISTORY)
- `category`: Category (e.g., "vital-signs", "physical-exam")
- `code`: LOINC or SNOMED code
- `display`: Human-readable name
- `value`: JSON object with observation value
- `unit`: Unit of measurement
- `interpretation`: e.g., "normal", "high", "low"
- `notes`: Additional notes
- `status`: Enum (REGISTERED, PRELIMINARY, FINAL, AMENDED, CANCELLED)
- `createdAt`, `updatedAt`: Timestamps

**Relations:**
- Belongs to: Patient, Encounter (optional), User (recorder)

### 5. **LabResult**
Laboratory test results.

**Fields:**
- `id`: Unique identifier (UUID)
- `patientId`: Foreign key to Patient
- `encounterId`: Optional foreign key to Encounter
- `testName`: Name of the test
- `testCategory`: Category (e.g., "Blood Test", "Urine Test")
- `orderedDate`: When test was ordered
- `reportDate`: When results were reported
- `status`: Enum (PENDING, IN_PROGRESS, COMPLETED)
- `results`: Test results
- `normalRange`: Normal range for the test
- `unit`: Unit of measurement
- `remarks`: Additional remarks
- `orderedById`: Foreign key to User
- `createdAt`, `updatedAt`: Timestamps

**Relations:**
- Belongs to: Patient, Encounter (optional), User (orderer)

### 6. **Medication**
Medication records for patients.

**Fields:**
- `id`: Unique identifier (UUID)
- `patientId`: Foreign key to Patient
- `encounterId`: Optional foreign key to Encounter
- `name`: Medication name
- `genericName`: Generic name
- `brandName`: Brand name
- `dosage`: Dosage (e.g., "500mg")
- `form`: Form (e.g., "tablet", "syrup")
- `route`: Route (e.g., "oral", "IV")
- `frequency`: Frequency (e.g., "twice daily")
- `duration`: Duration (e.g., "7 days")
- `quantity`: Number of units
- `instructions`: Special instructions
- `indication`: Reason for medication
- `startDate`, `endDate`: Start and end dates
- `status`: Enum (ACTIVE, COMPLETED, DISCONTINUED, ON_HOLD, CANCELLED)
- `pricePerUnit`: Price per unit in INR
- `totalCost`: Total cost in INR
- `prescribedById`: Foreign key to User
- `notes`: Additional notes
- `createdAt`, `updatedAt`: Timestamps

**Indian Constraints:**
- Prices stored in INR (Indian Rupees)

**Relations:**
- Belongs to: Patient, Encounter (optional), User (prescriber)

### 7. **Prescription**
Prescription records (legacy format for compatibility).

**Fields:**
- `id`: Unique identifier (UUID)
- `patientId`: Foreign key to Patient
- `encounterId`: Foreign key to Encounter
- `doctorId`: Foreign key to User
- `date`: Prescription date
- `medications`: JSON array of medication objects
- `instructions`: General instructions
- `status`: Enum (ACTIVE, COMPLETED, DISCONTINUED)
- `createdAt`, `updatedAt`: Timestamps

**Relations:**
- Belongs to: Patient, Encounter, User (doctor)

### 8. **Bill**
Billing and payment records.

**Fields:**
- `id`: Unique identifier (UUID)
- `patientId`: Foreign key to Patient
- `encounterId`: Optional foreign key to Encounter
- `date`: Bill date
- `items`: JSON array of billing items
- `subtotal`: Subtotal amount in INR
- `tax`: Tax amount in INR (GST)
- `discount`: Discount amount in INR
- `total`: Total amount in INR
- `currency`: Currency code (default: "INR")
- `paymentMethod`: Enum (CASH, CARD, UPI, NET_BANKING, CHEQUE)
- `paymentStatus`: Enum (PENDING, PAID, CANCELLED)
- `notes`: Additional notes
- `createdAt`, `updatedAt`: Timestamps

**Indian Constraints:**
- Currency defaults to INR
- Includes Indian payment methods (UPI, NET_BANKING)
- Tax calculations support GST

**Relations:**
- Belongs to: Patient, Encounter (optional)

### 9. **Role**
Role definitions with permissions.

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Unique role name (e.g., "ADMIN", "DOCTOR")
- `displayName`: Human-readable name
- `description`: Role description
- `permissions`: JSON array of permission strings
- `isActive`: Active status
- `createdAt`, `updatedAt`: Timestamps

### 10. **AuditLog**
Audit trail for system activities.

**Fields:**
- `id`: Unique identifier (UUID)
- `userId`: Optional foreign key to User
- `action`: Action type (e.g., "CREATE", "UPDATE", "DELETE", "LOGIN")
- `entity`: Entity name (e.g., "Patient", "Encounter")
- `entityId`: ID of affected entity
- `changes`: JSON object with before/after values
- `ipAddress`: User's IP address
- `userAgent`: User's browser/client info
- `timestamp`: When action occurred
- `status`: Status (e.g., "SUCCESS", "FAILURE")
- `errorMessage`: Error message if failed

**Indexes:**
- `userId`, `entity`, `timestamp` for efficient querying

**Relations:**
- Belongs to: User (optional)

### 11. **Setting**
System configuration settings.

**Fields:**
- `id`: Unique identifier (UUID)
- `key`: Unique setting key
- `value`: Setting value
- `category`: Setting category
- `description`: Setting description
- `isPublic`: Whether setting is public
- `createdAt`, `updatedAt`: Timestamps

## Indian Data Constraints Summary

1. **Aadhaar Numbers**: 
   - Unique constraint enforced
   - Stored in masked format: XXXX-XXXX-XXXX (last 4 digits)
   - Privacy-compliant storage

2. **Phone Numbers**:
   - Format: +91XXXXXXXXXX
   - 10-digit Indian mobile numbers
   - International format with country code

3. **Dates**:
   - Stored as strings in DD-MM-YYYY format
   - Includes: dateOfBirth, registrationDate

4. **Currency**:
   - All monetary values in INR (Indian Rupees)
   - Bills include currency field defaulting to "INR"
   - Medication pricing in INR

5. **Postal Codes**:
   - 6-digit Indian pincodes

6. **Payment Methods**:
   - Includes Indian-specific methods: UPI, NET_BANKING
   - Traditional methods: CASH, CARD, CHEQUE

7. **Tax Calculations**:
   - Support for GST (Goods and Services Tax)
   - Tax field in billing for GST amounts

## Migrations

### 20251026060700_init
Initial schema with basic models.

### 20251027032740_add_indian_constraints_and_new_models
Added:
- Observation model with FHIR-like structure
- Medication model (separate from Prescription)
- Role model for permissions
- AuditLog model for audit trail
- RECEPTIONIST role to UserRole enum
- NET_BANKING and CHEQUE to PaymentMethod enum
- Unique constraint on Patient.aadhaar
- Currency field to Bill model (default: INR)

## Seed Data

The seed script (`prisma/seed.ts`) creates:
- 7 users with different roles (ADMIN, DOCTOR, NURSE, LAB_TECH, PHARMACIST, BILLING, RECEPTIONIST)
- 2 roles with permissions
- 50 demo patients with realistic Indian data:
  - Indian names and cities
  - Valid phone numbers (+91 format)
  - Masked Aadhaar numbers
  - Indian addresses with proper pincodes
- 30 encounters with medical scenarios
- 30 observations (vital signs)
- 10 lab results
- 15 medications with INR pricing
- 15 prescriptions
- 30 bills with INR currency and Indian payment methods
- 2 audit log entries

## Usage

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Run Migrations
```bash
npm run prisma:migrate
```

### Seed Database
```bash
npm run prisma:seed
```

### Open Prisma Studio
```bash
npm run prisma:studio
```

## Compliance Notes

- **Data Privacy**: Aadhaar numbers are masked to comply with privacy regulations
- **Audit Trail**: All system activities are logged in AuditLog table
- **Role-Based Access**: Permissions managed through Role model
- **Data Integrity**: Foreign key constraints ensure referential integrity
- **Cascade Deletes**: Patient data cascades when patient is deleted
