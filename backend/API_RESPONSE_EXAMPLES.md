# API Response Examples

This document provides concrete examples of the API responses for each resource type.

## 1. Patient Resource Examples

### GET /api/patients/:id - Single Patient Response

```json
{
  "data": {
    "resourceType": "Patient",
    "id": "clm9x8y7z0000abc123def456",
    "identifier": [
      {
        "use": "official",
        "type": "AADHAAR",
        "system": "https://uidai.gov.in",
        "value": "123456789012"
      }
    ],
    "active": true,
    "name": {
      "use": "official",
      "family": "Sharma",
      "given": ["Amit"],
      "text": "Amit Sharma"
    },
    "telecom": [
      {
        "system": "phone",
        "value": "+919876543210",
        "use": "mobile"
      },
      {
        "system": "email",
        "value": "amit.sharma@example.com",
        "use": "home"
      }
    ],
    "gender": "MALE",
    "birthDate": "15-06-1985",
    "address": {
      "use": "home",
      "type": "physical",
      "line": "123, MG Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400058",
      "country": "India"
    },
    "contact": {
      "relationship": "Emergency Contact",
      "name": "Priya Sharma",
      "telecom": {
        "system": "phone",
        "value": "+919876543211",
        "use": "mobile"
      }
    },
    "bloodGroup": "O+",
    "allergies": "Penicillin",
    "medicalHistory": "Hypertension",
    "registrationDate": "01-01-2024",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-15T15:45:30.123Z",
    "version": "1.0"
  }
}
```

### GET /api/patients - Paginated Patient List

```json
{
  "data": [
    {
      "resourceType": "Patient",
      "id": "clm9x8y7z0000abc123def456",
      "identifier": [
        {
          "use": "official",
          "type": "AADHAAR",
          "system": "https://uidai.gov.in",
          "value": "123456789012"
        }
      ],
      "active": true,
      "name": {
        "use": "official",
        "family": "Sharma",
        "given": ["Amit"],
        "text": "Amit Sharma"
      },
      "telecom": [
        {
          "system": "phone",
          "value": "+919876543210",
          "use": "mobile"
        },
        {
          "system": "email",
          "value": "amit.sharma@example.com",
          "use": "home"
        }
      ],
      "gender": "MALE",
      "birthDate": "15-06-1985",
      "address": {
        "use": "home",
        "type": "physical",
        "line": "123, MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400058",
        "country": "India"
      },
      "contact": {
        "relationship": "Emergency Contact",
        "name": "Priya Sharma",
        "telecom": {
          "system": "phone",
          "value": "+919876543211",
          "use": "mobile"
        }
      },
      "bloodGroup": "O+",
      "allergies": "Penicillin",
      "medicalHistory": "Hypertension",
      "registrationDate": "01-01-2024",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-15T14:30:00.000Z"
    }
    // ... more patients
  ],
  "meta": {
    "timestamp": "2024-01-15T15:45:30.123Z",
    "version": "1.0",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "sorting": {
      "sortBy": "lastName",
      "order": "asc"
    }
  }
}
```

## 2. Encounter Resource Examples

### GET /api/encounters/:id - Single Encounter Response

```json
{
  "data": {
    "resourceType": "Encounter",
    "id": "enc123abc456def",
    "status": "COMPLETED",
    "class": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "Ambulatory"
        }
      ],
      "text": "CONSULTATION"
    },
    "type": [
      {
        "coding": [
          {
            "code": "CONSULTATION",
            "display": "CONSULTATION"
          }
        ],
        "text": "CONSULTATION"
      }
    ],
    "subject": {
      "reference": "Patient/clm9x8y7z0000abc123def456",
      "type": "Patient",
      "display": "Amit Sharma"
    },
    "participant": [
      {
        "type": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "PPRF",
              "display": "Primary Performer"
            }
          ],
          "text": "Primary Care Physician"
        },
        "individual": {
          "reference": "Practitioner/doc789xyz",
          "type": "Practitioner",
          "display": "Dr. Rajesh Kumar"
        }
      }
    ],
    "period": {
      "start": "2024-01-15T09:00:00.000Z",
      "end": "2024-01-15T09:30:00.000Z"
    },
    "reasonCode": [
      {
        "text": "Fever and cough for 3 days"
      }
    ],
    "diagnosis": [
      {
        "condition": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/sid/icd-10",
              "code": "J06.9",
              "display": "Acute upper respiratory infection"
            }
          ],
          "text": "Acute upper respiratory infection"
        },
        "use": "AD",
        "rank": 1
      }
    ],
    "chiefComplaint": "Fever and cough for 3 days",
    "notes": "Patient advised rest and medication",
    "vitalSigns": {
      "bloodPressure": "120/80",
      "heartRate": 75,
      "temperature": 98.6,
      "respiratoryRate": 16,
      "oxygenSaturation": 98
    },
    "soapNotes": {
      "subjective": "Patient complains of fever and cough",
      "objective": "Temperature 98.6°F, throat redness observed",
      "assessment": "Acute upper respiratory infection",
      "plan": "Prescribed antibiotics and cough syrup"
    },
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T09:30:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-15T15:45:30.123Z",
    "version": "1.0"
  }
}
```

## 3. Observation (Lab Result) Resource Examples

### GET /api/labs/:id - Single Lab Result Response

```json
{
  "data": {
    "resourceType": "Observation",
    "id": "lab456def789ghi",
    "status": "COMPLETED",
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "laboratory",
            "display": "Laboratory"
          }
        ],
        "text": "Hematology"
      }
    ],
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "COMPLETE_BLOOD_COUNT",
          "display": "Complete Blood Count"
        }
      ],
      "text": "Complete Blood Count"
    },
    "subject": {
      "reference": "Patient/clm9x8y7z0000abc123def456",
      "type": "Patient",
      "display": "Amit Sharma"
    },
    "encounter": {
      "reference": "Encounter/enc123abc456def",
      "type": "Encounter"
    },
    "effectiveDateTime": "2024-01-15T10:00:00.000Z",
    "issued": "2024-01-15T14:00:00.000Z",
    "performer": {
      "reference": "Practitioner/doc789xyz",
      "type": "Practitioner",
      "display": "Dr. Rajesh Kumar"
    },
    "valueQuantity": {
      "value": 14.5,
      "unit": "g/dL"
    },
    "interpretation": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "N",
          "display": "Normal"
        }
      ],
      "text": "Normal"
    },
    "note": "All parameters within normal limits",
    "referenceRange": [
      {
        "text": "13.0-17.0 g/dL"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-15T15:45:30.123Z",
    "version": "1.0"
  }
}
```

## 4. Invoice (Billing) Resource Examples

### GET /api/billing/:id - Single Bill Response

```json
{
  "data": {
    "resourceType": "Invoice",
    "id": "bill789ghi012jkl",
    "status": "PAID",
    "type": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/invoice-type",
          "code": "invoice",
          "display": "Invoice"
        }
      ],
      "text": "Medical Invoice"
    },
    "subject": {
      "reference": "Patient/clm9x8y7z0000abc123def456",
      "type": "Patient",
      "display": "Amit Sharma"
    },
    "encounter": {
      "reference": "Encounter/enc123abc456def",
      "type": "Encounter"
    },
    "date": "2024-01-15",
    "lineItem": [
      {
        "sequence": 1,
        "chargeItemCodeableConcept": {
          "text": "Consultation Fee"
        },
        "net": {
          "value": 500,
          "currency": "INR"
        }
      },
      {
        "sequence": 2,
        "chargeItemCodeableConcept": {
          "text": "Lab Tests"
        },
        "net": {
          "value": 1200,
          "currency": "INR"
        }
      }
    ],
    "subtotal": {
      "value": 1700,
      "currency": "INR"
    },
    "tax": {
      "value": 306,
      "currency": "INR"
    },
    "discount": {
      "value": 100,
      "currency": "INR"
    },
    "totalNet": {
      "value": 1906,
      "currency": "INR"
    },
    "paymentMethod": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/payment-type",
          "code": "CARD",
          "display": "CARD"
        }
      ],
      "text": "CARD"
    },
    "note": "Payment received in full",
    "createdAt": "2024-01-15T09:30:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-15T15:45:30.123Z",
    "version": "1.0"
  }
}
```

## 5. Error Response Examples

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Patient with ID xyz not found",
  "error": "Not Found",
  "path": "/api/patients/xyz",
  "timestamp": "2024-01-15T15:45:30.123Z"
}
```

### 400 Bad Request (Validation Error)

```json
{
  "statusCode": 400,
  "message": [
    "firstName must be a string",
    "email must be a valid email"
  ],
  "error": "Bad Request",
  "path": "/api/patients",
  "timestamp": "2024-01-15T15:45:30.123Z"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "path": "/api/patients",
  "timestamp": "2024-01-15T15:45:30.123Z"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "path": "/api/patients",
  "timestamp": "2024-01-15T15:45:30.123Z"
}
```

## Query Examples

### Pagination
```
GET /api/patients?page=2&limit=20
```

### Sorting
```
GET /api/patients?sortBy=firstName&order=asc
```
Note: Sorting is done on database fields (firstName, lastName, createdAt, etc.), not on the transformed FHIR structure.

### Filtering
```
GET /api/encounters?patientId=clm9x8y7z0000abc123def456&status=COMPLETED
```

### Combined
```
GET /api/labs?patientId=clm9x8y7z0000abc123def456&status=COMPLETED&sortBy=orderedDate&order=desc&page=1&limit=10
```

### Search
```
GET /api/patients?search=sharma
```
