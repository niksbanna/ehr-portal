# EHR Portal Backend - API Integration Guide

This guide explains how to integrate the frontend EHR Portal application with the backend API.

## Backend Setup

### Quick Start

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start PostgreSQL and backend using Docker Compose (recommended):
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Backend API on port 3000

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Seed the database with initial data:
```bash
npm run prisma:seed
```

### Manual Setup (without Docker)

If you prefer to run PostgreSQL locally:

1. Install and start PostgreSQL
2. Create database:
```sql
CREATE DATABASE ehr_portal;
CREATE USER ehr_user WITH PASSWORD 'ehr_password';
GRANT ALL PRIVILEGES ON DATABASE ehr_portal TO ehr_user;
```

3. Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

4. Run migrations and start:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

## API Documentation

Once the backend is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Authentication

The backend uses JWT-based authentication. All API endpoints (except auth endpoints) require a valid JWT token.

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@hospital.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@hospital.in",
    "name": "Dr. Rajesh Kumar",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1d"
}
```

### Using the Token

Include the token in the Authorization header for all subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Default Users

The seed script creates these default users (all with password `password123`):

- `admin@hospital.in` - Admin role
- `doctor@hospital.in` - Doctor role
- `nurse@hospital.in` - Nurse role

## Frontend Integration

### Update Frontend API Configuration

Update your frontend API configuration to point to the backend:

**src/services/api.ts** (example):
```typescript
const API_BASE_URL = 'http://localhost:3000/api';

// Add authentication header to all requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Example API call
export const fetchPatients = async (page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/patients?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  return response.json();
};
```

### CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite dev server).

To change this, update the `CORS_ORIGIN` in `.env`:
```
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - List patients (paginated)
- `GET /api/patients/:id` - Get patient
- `POST /api/patients` - Create patient
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?q=query` - Search patients

### Encounters
- `GET /api/encounters` - List encounters
- `GET /api/encounters/:id` - Get encounter
- `POST /api/encounters` - Create encounter
- `PATCH /api/encounters/:id` - Update encounter
- `DELETE /api/encounters/:id` - Delete encounter
- `GET /api/encounters/patient/:patientId` - Get patient encounters

### Lab Results
- `GET /api/labs` - List lab results
- `GET /api/labs/:id` - Get lab result
- `POST /api/labs` - Create lab result
- `PATCH /api/labs/:id` - Update lab result
- `DELETE /api/labs/:id` - Delete lab result
- `GET /api/labs/patient/:patientId` - Get patient labs
- `GET /api/labs/encounter/:encounterId` - Get encounter labs

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `GET /api/prescriptions/:id` - Get prescription
- `POST /api/prescriptions` - Create prescription
- `PATCH /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions
- `GET /api/prescriptions/encounter/:encounterId` - Get encounter prescriptions

### Billing
- `GET /api/billing` - List bills
- `GET /api/billing/:id` - Get bill
- `POST /api/billing` - Create bill
- `PATCH /api/billing/:id` - Update bill
- `DELETE /api/billing/:id` - Delete bill
- `GET /api/billing/patient/:patientId` - Get patient bills

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/patients` - Patient report
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/labs` - Lab report
- `GET /api/reports/encounters` - Encounter report

## Data Models

### Patient
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // DD-MM-YYYY
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  aadhaar?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  registrationDate: string; // DD-MM-YYYY
}
```

### Encounter
```typescript
{
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO datetime
  type: 'CONSULTATION' | 'FOLLOWUP' | 'EMERGENCY';
  chiefComplaint: string;
  diagnosis: string;
  diagnosisCode?: string;
  notes: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    spo2?: number;
    weight?: number;
    height?: number;
  };
  soapNotes?: object;
}
```

### Lab Result
```typescript
{
  id: string;
  patientId: string;
  encounterId?: string;
  testName: string;
  testCategory: string;
  orderedDate: string; // ISO datetime
  reportDate?: string; // ISO datetime
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  results?: string;
  normalRange?: string;
  unit?: string;
  remarks?: string;
  orderedById: string;
}
```

### Prescription
```typescript
{
  id: string;
  patientId: string;
  encounterId: string;
  doctorId: string;
  date: string; // ISO datetime
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions?: string;
  }>;
  instructions?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
}
```

### Bill
```typescript
{
  id: string;
  patientId: string;
  encounterId?: string;
  date: string; // ISO datetime
  items: Array<{
    name: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  notes?: string;
}
```

## Pagination

List endpoints support pagination with query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```
GET /api/patients?page=2&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Database Management

### View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` to view and edit database records.

### Reset Database

```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Create New Migration

After changing `prisma/schema.prisma`:

```bash
cd backend
npm run prisma:migrate
```

## Production Deployment

### Environment Variables

Update these variables for production:

- `DATABASE_URL` - Production PostgreSQL URL
- `JWT_SECRET` - Strong random secret (use `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` - Different strong random secret
- `CORS_ORIGIN` - Production frontend URL
- `NODE_ENV=production`

### Docker Deployment

```bash
cd backend
docker-compose up -d --build
```

### Manual Deployment

```bash
cd backend
npm run build
npm run start:prod
```

## Troubleshooting

### Cannot connect to database

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Verify database exists and credentials are correct

### CORS errors

1. Check `CORS_ORIGIN` matches your frontend URL
2. Ensure frontend sends correct headers
3. Check browser console for specific CORS error

### Authentication errors

1. Verify token is being sent in Authorization header
2. Check token hasn't expired (default: 1 day)
3. Use refresh token endpoint if token expired

## Support

For issues or questions:
1. Check the Swagger documentation at `/api/docs`
2. Review backend logs
3. Check Prisma documentation for database issues
