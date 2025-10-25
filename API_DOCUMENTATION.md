# API Documentation

This document describes the mock API server implementation using Mock Service Worker (MSW) with OpenAPI-like TypeScript interfaces.

## Overview

The EHR Portal now includes a complete mock API server that simulates realistic backend behavior with:

- **50 patients** - Realistic Indian patient data with proper demographic information
- **200 encounters** - Medical encounters with ICD-10 diagnosis codes
- **500 lab results** - Laboratory test results across various categories
- **15 drugs** - Common medications with pricing and stock information
- **25 ICD-10 codes** - Disease classification codes across multiple categories
- **6 user roles** - Role-based authentication (admin, doctor, nurse, lab_tech, pharmacist, billing)

## Features

### 1. OpenAPI-like TypeScript Schema

All API endpoints are defined with TypeScript interfaces in `src/api/schema/`:

- `common.ts` - Shared types (ApiResponse, PaginatedResponse, etc.)
- `auth.ts` - Authentication endpoints
- `patients.ts` - Patient management endpoints
- `encounters.ts` - Encounter management endpoints
- `labs.ts` - Lab results endpoints
- `prescriptions.ts` - Prescription and drug endpoints
- `icd10.ts` - ICD-10 code endpoints

### 2. Mock Service Worker (MSW)

MSW intercepts network requests in development mode and returns mock data:

- **Realistic delays**: 
  - 80% of requests: 100-500ms
  - 15% of requests: 500-1500ms
  - 5% of requests: 1500-3000ms
- **Error simulation**: 2% random error rate
- **Pagination support**: All list endpoints support page/limit parameters
- **Filtering**: Search and filter capabilities on list endpoints

### 3. React Query Integration

Enhanced React Query setup with:

- **Caching**: 5-minute stale time, 10-minute garbage collection time
- **Retry logic**: Automatic retry on failure (2 attempts)
- **Pagination hooks**: Built-in pagination handling
- **Automatic cache invalidation**: Mutations invalidate relevant queries

### 4. Role-Based Authentication

Mock login system with 6 pre-configured users:

| Email | Role | Name |
|-------|------|------|
| admin@hospital.in | admin | Dr. Rajesh Kumar |
| doctor@hospital.in | doctor | Dr. Priya Sharma |
| nurse@hospital.in | nurse | Nurse Anjali Singh |
| lab@hospital.in | lab_tech | Lab Tech Ramesh Patel |
| pharmacist@hospital.in | pharmacist | Pharmacist Sunil Kumar |
| billing@hospital.in | billing | Billing Staff Meera Joshi |

**Password**: Any password works in development mode

## API Endpoints

### Authentication

```typescript
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Patients

```typescript
GET    /api/patients              // List patients (paginated, filterable)
GET    /api/patients/:id          // Get patient by ID
POST   /api/patients              // Create patient
PUT    /api/patients/:id          // Update patient
DELETE /api/patients/:id          // Delete patient
GET    /api/patients/search       // Search patients
```

### Encounters

```typescript
GET    /api/encounters            // List encounters (paginated, filterable)
GET    /api/encounters/:id        // Get encounter by ID
POST   /api/encounters            // Create encounter
PUT    /api/encounters/:id        // Update encounter
GET    /api/patients/:patientId/encounters  // Get patient encounters
```

### Lab Results

```typescript
GET    /api/labs                  // List lab results (paginated, filterable)
GET    /api/labs/:id              // Get lab result by ID
POST   /api/labs                  // Create lab result
PUT    /api/labs/:id              // Update lab result
GET    /api/patients/:patientId/labs       // Get patient labs
GET    /api/encounters/:encounterId/labs   // Get encounter labs
```

### Prescriptions

```typescript
GET    /api/prescriptions         // List prescriptions (paginated)
GET    /api/prescriptions/:id     // Get prescription by ID
POST   /api/prescriptions         // Create prescription
GET    /api/patients/:patientId/prescriptions     // Get patient prescriptions
GET    /api/encounters/:encounterId/prescriptions // Get encounter prescriptions
```

### Drugs

```typescript
GET    /api/drugs                 // List drugs (paginated, filterable)
GET    /api/drugs/:id             // Get drug by ID
GET    /api/drugs/search          // Search drugs
```

### ICD-10 Codes

```typescript
GET    /api/icd10                 // List ICD-10 codes (paginated)
GET    /api/icd10/:code           // Get ICD-10 code by code
GET    /api/icd10/search          // Search ICD-10 codes
GET    /api/icd10/categories      // Get ICD-10 categories
```

## Using React Query Hooks

### Example: Fetch Patients

```typescript
import { usePatients } from '@/api/hooks';

function PatientsList() {
  const { data, isLoading, error } = usePatients({ 
    page: 1, 
    limit: 10,
    search: 'sharma'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(patient => (
        <div key={patient.id}>{patient.firstName} {patient.lastName}</div>
      ))}
      <div>Total: {data?.pagination.total}</div>
    </div>
  );
}
```

### Example: Create Patient

```typescript
import { useCreatePatient } from '@/api/hooks';

function CreatePatientForm() {
  const createPatient = useCreatePatient();

  const handleSubmit = async (formData) => {
    try {
      const result = await createPatient.mutateAsync(formData);
      console.log('Patient created:', result.data);
    } catch (error) {
      console.error('Failed to create patient:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example: Search Drugs

```typescript
import { useSearchDrugs } from '@/api/hooks';

function DrugSearch() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchDrugs(query);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search drugs..."
      />
      {isLoading && <div>Searching...</div>}
      {data?.data.map(drug => (
        <div key={drug.id}>
          {drug.name} - {drug.genericName} - ₹{drug.price}
        </div>
      ))}
    </div>
  );
}
```

## Response Format

All API responses follow a consistent format:

### Single Resource

```typescript
{
  data: T,
  timestamp: string
}
```

### Paginated Resource

```typescript
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  },
  timestamp: string
}
```

### Error Response

```typescript
{
  error: string,
  message: string,
  statusCode: number,
  timestamp: string
}
```

## Mock Data Generation

Mock data is generated using realistic Indian hospital data:

- **Names**: Common Indian first and last names
- **Locations**: Major Indian cities and states
- **Phone numbers**: +91 format
- **Aadhaar**: Masked format (XXXX-XXXX-9012)
- **Medical data**: Realistic ICD-10 codes, vital signs, medications

## Development

### Enabling/Disabling MSW

MSW is automatically enabled in development mode. To disable it, modify `src/main.tsx`:

```typescript
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  // Comment out or remove these lines to disable MSW
  const { worker } = await import('./api/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}
```

### Adding New Endpoints

1. Define the schema in `src/api/schema/[resource].ts`
2. Create the MSW handler in `src/api/mocks/handlers.ts`
3. Create React Query hooks in `src/api/hooks/index.ts`
4. Export from `src/api/index.ts`

### Testing Errors

MSW simulates a 2% error rate randomly. To test specific error scenarios, modify the handlers in `src/api/mocks/handlers.ts`.

## Production Considerations

In production:

1. MSW will not be loaded (NODE_ENV check in main.tsx)
2. Replace mock endpoints with real API URLs
3. Update fetch calls to point to production backend
4. Configure proper CORS and authentication headers

## Browser DevTools

MSW logs all intercepted requests in the browser console:

```
[MSW] 18:12:17 POST /api/auth/login (200 OK)
  Request: {...}
  Handler: HttpHandler
  Response: {...}
```

This helps with debugging and understanding what data is being sent/received.

## File Structure

```
src/api/
├── schema/              # TypeScript API schema definitions
│   ├── common.ts       # Common types
│   ├── auth.ts         # Auth endpoints
│   ├── patients.ts     # Patient endpoints
│   ├── encounters.ts   # Encounter endpoints
│   ├── labs.ts         # Lab endpoints
│   ├── prescriptions.ts # Prescription/Drug endpoints
│   ├── icd10.ts        # ICD-10 endpoints
│   └── index.ts        # Schema exports
├── mocks/              # MSW mock implementation
│   ├── generators.ts   # Mock data generators
│   ├── handlers.ts     # MSW request handlers
│   ├── browser.ts      # Browser setup
│   └── index.ts        # Mock exports
├── hooks/              # React Query hooks
│   └── index.ts        # All API hooks
└── index.ts            # API module exports
```

## References

- [MSW Documentation](https://mswjs.io/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Documentation](https://www.typescriptlang.org/)
