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

- Node.js 18+ 
- npm or yarn

### Installation

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

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Running the Production Build

```bash
npm run preview
```

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
