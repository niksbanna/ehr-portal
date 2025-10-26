# EHR Portal Backend

Backend API for the Electronic Health Records (EHR) Portal built with NestJS, TypeScript, PostgreSQL, and Prisma ORM.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Patient Management**: Complete CRUD operations for patient records
- **Encounters**: Medical encounter tracking and management
- **Lab Results**: Laboratory test ordering and results management
- **Prescriptions**: Medication prescription management
- **Billing**: Invoice and payment processing
- **Reports**: Dashboard statistics and various reports

## Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.x
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker & Docker Compose

## Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the environment variables in `.env` as needed.

### 3. Database Setup

#### Using Docker Compose (Recommended)

Start PostgreSQL and the backend:

```bash
docker-compose up -d
```

#### Using Local PostgreSQL

Make sure PostgreSQL is running and update the `DATABASE_URL` in `.env`, then:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed
```

### 4. Run the Application

#### Development Mode

```bash
npm run start:dev
```

#### Production Mode

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/api/docs
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Patients
- `GET /api/patients` - List all patients (paginated)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?q=query` - Search patients

### Encounters
- `GET /api/encounters` - List all encounters (paginated)
- `GET /api/encounters/:id` - Get encounter by ID
- `POST /api/encounters` - Create new encounter
- `PATCH /api/encounters/:id` - Update encounter
- `DELETE /api/encounters/:id` - Delete encounter
- `GET /api/encounters/patient/:patientId` - Get patient encounters

### Lab Results
- `GET /api/labs` - List all lab results (paginated)
- `GET /api/labs/:id` - Get lab result by ID
- `POST /api/labs` - Create new lab result
- `PATCH /api/labs/:id` - Update lab result
- `DELETE /api/labs/:id` - Delete lab result
- `GET /api/labs/patient/:patientId` - Get patient labs
- `GET /api/labs/encounter/:encounterId` - Get encounter labs

### Prescriptions
- `GET /api/prescriptions` - List all prescriptions (paginated)
- `GET /api/prescriptions/:id` - Get prescription by ID
- `POST /api/prescriptions` - Create new prescription
- `PATCH /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions
- `GET /api/prescriptions/encounter/:encounterId` - Get encounter prescriptions

### Billing
- `GET /api/billing` - List all bills (paginated)
- `GET /api/billing/:id` - Get bill by ID
- `POST /api/billing` - Create new bill
- `PATCH /api/billing/:id` - Update bill
- `DELETE /api/billing/:id` - Delete bill
- `GET /api/billing/patient/:patientId` - Get patient bills

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/patients` - Get patient report
- `GET /api/reports/revenue` - Get revenue report
- `GET /api/reports/labs` - Get lab results report
- `GET /api/reports/encounters` - Get encounter report

## Project Structure

```
backend/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication module
│   │   ├── patients/     # Patients module
│   │   ├── encounters/   # Encounters module
│   │   ├── labs/         # Lab results module
│   │   ├── prescriptions/# Prescriptions module
│   │   ├── billing/      # Billing module
│   │   └── reports/      # Reports module
│   ├── common/           # Common utilities and services
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── config/           # Configuration files
│   │   └── configuration.ts
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── prisma/
│   └── schema.prisma     # Prisma schema
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker configuration
└── package.json
```

## Database Schema

The application uses Prisma ORM with the following main entities:

- **User**: System users with role-based access
- **Patient**: Patient demographic and medical information
- **Encounter**: Medical encounters/visits
- **LabResult**: Laboratory test results
- **Prescription**: Medication prescriptions
- **Bill**: Billing and payment records

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000

### Access the Application

- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

## Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:prod` - Start in production mode
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Environment Variables

Key environment variables (see `.env.example` for complete list):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRATION` - Access token expiration time
- `PORT` - Application port (default: 3000)
- `CORS_ORIGIN` - Allowed CORS origin

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with class-validator
- CORS protection
- Environment-based configuration

## License

MIT
