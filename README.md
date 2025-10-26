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

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3
- **Routing**: React Router v7
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher (comes with Node.js)
- **Docker** (optional, for containerized deployment)
- **Git** for version control

### Quick Start

1. **Clone the repository:**

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

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run unit tests in watch mode
- `npm run test:run` - Run unit tests once
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run end-to-end tests

## Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env` and configure as needed.

### Core Configuration

```bash
# Application
VITE_APP_NAME=EHR Portal
VITE_APP_VERSION=0.0.0

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Mock Service Worker (for development)
VITE_ENABLE_MSW=true  # Set to 'false' to use real API

# Authentication
VITE_AUTH_TOKEN_KEY=ehr_auth_token
VITE_AUTH_SESSION_TIMEOUT=3600000  # 1 hour in milliseconds
```

### Optional Configuration

```bash
# FHIR Server (when using real API)
VITE_FHIR_SERVER_URL=https://fhir.example.com/api
VITE_FHIR_VERSION=4.0.1

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_OFFLINE_MODE=true

# Internationalization
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,hi

# Theme
VITE_DEFAULT_THEME=light

# Logging
VITE_LOG_LEVEL=info
VITE_ENABLE_AUDIT_LOG=true
```

For a complete list of environment variables, see [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md).

## Deployment

### Building for Production

1. **Install dependencies:**

```bash
npm ci
```

2. **Build the application:**

```bash
npm run build
```

The production build will be in the `dist/` directory.

3. **Preview the build locally:**

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

- **Email**: admin@hospital.in
- **Password**: any password (authentication is mocked)

## Seeded Data

The application comes with pre-seeded mock data including:

- 3 patients with complete medical records
- 3 encounters (patient visits)
- 3 lab results
- 2 prescriptions
- 3 billing records

## Project Structure

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

### Directory Descriptions

- **`src/components/`**: Reusable UI components organized by category
- **`src/pages/`**: Top-level page components mapped to routes
- **`src/hooks/`**: Custom React hooks for shared logic
- **`src/api/`**: API client, types, and mock data
- **`src/routes/`**: Application routing configuration
- **`src/stores/`**: State management stores and contexts
- **`src/mocks/`**: Mock data and MSW handlers
- **`src/tests/`**: Unit and integration tests
- **`docs/`**: Comprehensive project documentation

## Indian Hospital Specific Features

- **Indian Currency**: All amounts in ₹ (INR)
- **GST Compliance**: 18% GST on medical services
- **Indian Demographics**: State, city, pincode fields
- **Phone Format**: Indian mobile number format (+91)
- **Blood Groups**: Common Indian blood group tracking
- **Payment Methods**: UPI, Card, and Cash options

## Mock API

The application uses a mock API with simulated delays to mimic real-world API behavior. All data is stored in memory and resets on page refresh.

## Development

### Available Scripts

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
