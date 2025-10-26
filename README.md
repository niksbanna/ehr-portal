# EHR Portal - Electronic Health Records System

A comprehensive Electronic Health Records (EHR) web application built with React, TypeScript, and Vite for Indian hospitals.

## Features

- **Authentication System**: Secure login/logout functionality
- **Dashboard**: Overview with key metrics and recent activity
  - Total patients count
  - Today's appointments
  - Pending lab results
  - Total revenue tracking
- **Patient Registry**: Complete patient management
  - Add, edit, and delete patients
  - Comprehensive patient information including demographics, contact details, emergency contacts, and medical history
- **Encounters**: Patient visit tracking
  - Visit records with vital signs
  - Diagnosis and treatment notes
  - Status tracking (scheduled, in-progress, completed, cancelled)
- **Lab Results**: Laboratory test management
  - Test ordering and tracking
  - Results with normal ranges
  - Multiple test categories
- **Prescriptions**: Medication management
  - Multi-medication prescriptions
  - Dosage, frequency, and duration tracking
  - Patient-specific instructions
- **Billing**: Invoice and payment processing
  - Detailed itemized bills
  - Tax calculations (18% GST)
  - Multiple payment methods (UPI, Card, Cash)
  - Payment status tracking

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3
- **Routing**: React Router v7
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Framework**: NestJS 10 with TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 16+ (for backend, or use Docker)

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/niksbanna/ehr-portal.git
cd ehr-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

See the detailed [Backend Integration Guide](BACKEND_INTEGRATION.md) for complete setup instructions.

**Quick Start:**

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start with Docker (PostgreSQL + Backend):
```bash
docker-compose up -d
```

4. Run migrations and seed:
```bash
npm run prisma:migrate
npm run prisma:seed
```

The backend API will be available at `http://localhost:3000`
API Documentation (Swagger): `http://localhost:3000/api/docs`

### Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

The build output will be in the `dist` directory.

### Running the Production Build

**Frontend:**
```bash
npm run preview
```

## Demo Credentials

### Frontend (Mock API)
- **Email**: admin@hospital.in
- **Password**: any password (authentication is mocked in frontend-only mode)

### Backend API
- **Email**: admin@hospital.in, doctor@hospital.in, or nurse@hospital.in
- **Password**: password123

## Seeded Data

The backend database comes with pre-seeded data including:
- 3 users (admin, doctor, nurse)
- 2 patients with complete medical records
- 1 encounter
- 1 lab result
- 1 prescription
- 1 billing record

## Project Structure

### Frontend
```
src/
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Sidebar, Layout)
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── PatientsPage.tsx
│   ├── EncountersPage.tsx
│   ├── LabsPage.tsx
│   ├── PrescriptionsPage.tsx
│   └── BillingPage.tsx
├── services/           # API and business logic
│   └── api.ts         # Mock API with seeded data
├── hooks/              # Custom React hooks
│   └── useAuth.tsx    # Authentication hook
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Backend
```
backend/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication (JWT)
│   │   ├── patients/     # Patient management
│   │   ├── encounters/   # Medical encounters
│   │   ├── labs/         # Lab results
│   │   ├── prescriptions/# Prescriptions
│   │   ├── billing/      # Billing & payments
│   │   └── reports/      # Reports & analytics
│   ├── common/           # Shared services (Prisma)
│   ├── config/           # Configuration
│   ├── app.module.ts     # Root module
│   └── main.ts           # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
├── .env.example          # Environment template
├── docker-compose.yml    # Docker setup
└── Dockerfile            # Container config
```

See [Backend README](backend/README.md) and [Backend Integration Guide](BACKEND_INTEGRATION.md) for more details.

## Indian Hospital Specific Features

- **Indian Currency**: All amounts in ₹ (INR)
- **GST Compliance**: 18% GST on medical services
- **Indian Demographics**: State, city, pincode fields
- **Phone Format**: Indian mobile number format (+91)
- **Blood Groups**: Common Indian blood group tracking
- **Payment Methods**: UPI, Card, and Cash options

## API Options

The application supports two modes:

### 1. Mock API (Default)
The frontend includes a mock API with simulated delays to mimic real-world API behavior. All data is stored in memory and resets on page refresh. Perfect for frontend development and testing.

### 2. Backend API
A complete NestJS backend with PostgreSQL database is available in the `/backend` directory. See [Backend Integration Guide](BACKEND_INTEGRATION.md) for setup instructions.

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `cd backend && npm run start:dev` - Start backend in dev mode
- `cd backend && npm run build` - Build backend
- `cd backend && npm run prisma:studio` - Open Prisma Studio

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Screenshots

### Login Page
![Login](https://github.com/user-attachments/assets/5fa10008-da4c-4a9d-be89-40e0a2681a31)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/05dcb68f-322c-4c13-998f-29d11601ef02)

### Patients Registry
![Patients](https://github.com/user-attachments/assets/cbcafaf4-c43f-42e5-a043-65852fb956b0)

### Billing
![Billing](https://github.com/user-attachments/assets/ff74b147-b18b-4876-8b28-d41bd083b7da)

## License

MIT

## Author

Created for Indian Hospital Management Systems
