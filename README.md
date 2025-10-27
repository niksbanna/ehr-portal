# EHR Portal - Electronic Health Records System

[![Frontend CI](https://github.com/niksbanna/ehr-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/niksbanna/ehr-portal/actions/workflows/ci.yml)
[![Backend CI/CD](https://github.com/niksbanna/ehr-portal/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/niksbanna/ehr-portal/actions/workflows/backend-ci.yml)

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
- **Reports & Analytics**: Visual data representation with charts
  - Revenue distribution (Pie chart)
  - Patient gender distribution (Pie chart)
  - Encounter status distribution (Bar chart)
  - Lab test status distribution (Bar chart)
  - Date range filtering for reports
  - Export functionality for all reports
- **Internationalization**: Complete Hindi and English language support
  - Real-time language toggle
  - All UI elements translated
  - Seamless language switching

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

```bash
git clone https://github.com/niksbanna/ehr-portal.git
cd ehr-portal
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` file to configure your environment (see [Environment Variables](#environment-variables) section).

4. **Start the development server:**

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

The production build will be in the `dist/` directory.

3. **Preview the build locally:**

**Frontend:**
```bash
npm run preview
```

### Docker Deployment

#### Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access the application at `http://localhost:3000`

#### Using Docker CLI

```bash
# Build image
docker build -t ehr-portal:latest .

# Run container
docker run -d -p 3000:80 --name ehr-portal ehr-portal:latest

# Check health
curl http://localhost:3000/health
```

### Deployment Platforms

#### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel

```bash
vercel --prod
```

#### AWS / GCP / Azure

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed cloud deployment instructions.

For comprehensive deployment guides, see:

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Docker Setup Guide](./docs/DOCKER.md)
- [Environment Configuration](./docs/ENVIRONMENT.md)

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
ehr-portal/
├── API_DOCUMENTATION.md          # API endpoints documentation
├── Dockerfile                    # Docker build configuration
├── FHIR_IMPLEMENTATION.md        # FHIR compliance details
├── IMPLEMENTATION_SUMMARY.md     # Implementation summary
├── PERFORMANCE.md                # Performance optimization guide
├── README.md                     # This file
├── SECURITY_ACCESSIBILITY.md     # Security & accessibility features
├── docker-compose.yml            # Docker Compose orchestration
├── docs/                         # Comprehensive documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── CONTRIBUTING.md           # Contributing guidelines
│   ├── DEPLOYMENT.md             # Deployment instructions
│   ├── DOCKER.md                 # Docker setup guide
│   ├── ENVIRONMENT.md            # Environment variables reference
│   ├── README.md                 # Documentation index
│   └── SETUP.md                  # Setup guide
├── e2e/                          # End-to-end tests
│   └── app.spec.ts               # E2E test suite
├── eslint.config.js              # ESLint configuration (modern)
├── index.html                    # HTML entry point
├── nginx.conf                    # Nginx server configuration
├── package-lock.json             # NPM lock file
├── package.json                  # NPM dependencies & scripts
├── playwright.config.ts          # Playwright E2E configuration
├── postcss.config.js             # PostCSS configuration
├── public/                       # Public static assets
│   ├── manifest.json             # PWA manifest
│   ├── mockServiceWorker.js      # MSW service worker
│   └── vite.svg                  # Vite logo
├── src/                          # Source code
│   ├── App.tsx                   # Main application component
│   ├── api/                      # API client and mocks
│   │   ├── hooks/                # React Query custom hooks
│   │   ├── index.ts              # API exports
│   │   ├── mocks/                # Mock Service Worker handlers
│   │   └── schema/               # API type definitions
│   ├── assets/                   # Static assets
│   │   └── react.svg             # React logo
│   ├── components/               # Reusable UI components
│   │   ├── PageSkeleton.tsx      # Loading skeleton
│   │   ├── common/               # Common components
│   │   └── layout/               # Layout components
│   ├── contexts/                 # React contexts
│   │   ├── I18nContext.tsx       # Internationalization context
│   │   └── ThemeContext.tsx      # Theme management context
│   ├── data/                     # Static data
│   │   └── icd10-codes.json      # ICD-10 diagnosis codes
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.tsx           # Authentication hook
│   │   ├── useI18n.ts            # i18n hook
│   │   ├── useKeyboardShortcuts.ts  # Keyboard shortcuts hook
│   │   ├── useOptimisticUpdate.ts   # Optimistic update hook
│   │   └── useTheme.ts           # Theme hook
│   ├── i18n/                     # Internationalization
│   │   └── translations.ts       # English & Hindi translations
│   ├── index.css                 # Global styles
│   ├── main.tsx                  # Application entry point
│   ├── mocks -> api/mocks        # Symlink to API mocks
│   ├── pages/                    # Page components
│   │   ├── AuditLogPage.tsx      # Audit log page
│   │   ├── BillingPage.tsx       # Billing & invoices page
│   │   ├── DashboardPage.tsx     # Dashboard page
│   │   ├── EncountersPage.tsx    # Patient encounters page
│   │   ├── LabsPage.tsx          # Lab results page
│   │   ├── LoginPage.tsx         # Login page
│   │   ├── PatientChartPage.tsx  # Patient chart page
│   │   ├── PatientSearchPage.tsx # Patient search page
│   │   ├── PatientsPage.tsx      # Patient registry page
│   │   ├── PrescriptionsPage.tsx # Prescriptions page
│   │   ├── ReportsPage.tsx       # Reports & charts page
│   │   └── SettingsPage.tsx      # Settings page
│   ├── routes/                   # Route configuration
│   │   └── index.tsx             # Routes definition
│   ├── schemas/                  # Validation schemas
│   │   ├── fhir.schema.ts        # FHIR resource schemas
│   │   └── patient-form.schema.ts # Patient form validation
│   ├── services/                 # Business logic services
│   │   ├── api.ts                # API service layer
│   │   └── auditLogger.ts        # Audit logging service
│   ├── stores/                   # State management
│   │   └── index.ts              # Store exports
│   ├── test/                     # Unit tests
│   │   ├── App.test.tsx          # App component tests
│   │   ├── PageSkeleton.test.tsx # Skeleton tests
│   │   ├── auditLogger.test.ts   # Audit logger tests
│   │   ├── sanitize.test.ts      # Sanitization tests
│   │   ├── setup.ts              # Test setup
│   │   └── useOptimisticUpdate.test.tsx # Hook tests
│   ├── tests -> test             # Symlink to test
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Type exports
│   └── utils/                    # Utility functions
│       ├── accessibility.ts      # Accessibility helpers
│       ├── duplicate-detection.ts # Duplicate detection
│       ├── permissions.ts        # Permission checks
│       └── sanitize.ts           # Input sanitization
├── tailwind.config.cjs           # Tailwind CSS config (CommonJS)
├── tailwind.config.js            # Tailwind CSS config (ES Module)
├── tsconfig.app.json             # TypeScript app config
├── tsconfig.json                 # TypeScript base config
├── tsconfig.node.json            # TypeScript Node config
├── vite.config.ts                # Vite build configuration
└── vitest.config.ts              # Vitest test configuration
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
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run E2E tests

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **TypeScript** for type safety
- **Vitest** for unit testing
- **Playwright** for E2E testing

Pre-commit hooks automatically run linting and formatting on staged files.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Setup Guide](./docs/SETUP.md)** - Detailed setup instructions
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Environment Configuration](./docs/ENVIRONMENT.md)** - Environment variables reference
- **[Docker Setup](./docs/DOCKER.md)** - Docker and Docker Compose guide
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute
- **[API Documentation](./API_DOCUMENTATION.md)** - API endpoints and usage
- **[FHIR Implementation](./FHIR_IMPLEMENTATION.md)** - FHIR compliance details
- **[Security & Accessibility](./SECURITY_ACCESSIBILITY.md)** - Security and accessibility features
- **[Performance Guide](./PERFORMANCE.md)** - Performance optimization

## Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Coding standards
- Testing requirements
- Pull request process

## CI/CD

This project uses GitHub Actions for continuous integration:

### Workflows

- **Lint**: ESLint and Prettier checks
- **Test**: Unit and integration tests with coverage
- **Build**: Production build verification
- **E2E**: End-to-end testing with Playwright
- **Docker**: Docker image build and test

All checks must pass before merging pull requests.

## Configuration Files

### Build & Development

- `vite.config.ts` - Vite configuration (build tool)
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.cjs` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Code Quality

- `eslint.config.js` - ESLint configuration (modern flat config)
- `.eslintrc` - ESLint configuration (legacy format)
- `.prettierrc` - Prettier configuration

### Testing

- `vitest.config.ts` - Vitest unit test configuration
- `playwright.config.ts` - Playwright E2E test configuration

### Docker

- `Dockerfile` - Docker image build configuration
- `docker-compose.yml` - Docker Compose orchestration
- `nginx.conf` - Nginx server configuration

### Environment

- `.env.example` - Example environment variables template
- `.env` - Local environment variables (not committed)

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
