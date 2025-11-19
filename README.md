# EHR Portal 🏥

[![Frontend CI](https://github.com/niksbanna/ehr-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/niksbanna/ehr-portal/actions/workflows/ci.yml)
[![Backend CI/CD](https://github.com/niksbanna/ehr-portal/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/niksbanna/ehr-portal/actions/workflows/backend-ci.yml)

A modern Electronic Health Records (EHR) system built for Indian hospitals. Manage patients, appointments, lab results, prescriptions, and billing with ease.

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based login system
- 👥 **Patient Management** - Complete patient registry with medical history
- 📋 **Encounters & Visits** - Track patient visits and vital signs
- 🧪 **Lab Results** - Order tests and manage results
- 💊 **Prescriptions** - Digital prescription management
- 💰 **Billing & Payments** - Invoice generation with GST (UPI/Card/Cash)
- 📊 **Reports & Analytics** - Visual dashboards and data export
- 🌏 **Bilingual** - Full English & Hindi support
- 🇮🇳 **India-Ready** - INR currency, GST compliance, Indian phone formats

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16+ (or Docker)

### Option 1: Try It Out (Mock Mode - No Backend Needed)

```bash
# Clone and install
git clone https://github.com/niksbanna/ehr-portal.git
cd ehr-portal
npm install

# Start in mock mode
cp .env.mock .env
npm run dev
```

Visit `http://localhost:5173` and login with:
- Email: `admin@hospital.in`
- Password: any password

### Option 2: Full Setup (With Backend)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
docker-compose up -d              # Start PostgreSQL
npm run prisma:migrate            # Setup database
npm run prisma:seed               # Add demo data
npm run start:dev                 # Start backend
```

**Frontend:**
```bash
cd ..
npm install
cp .env.backend .env
npm run dev
```

Login credentials:
- Admin: `admin@hospital.in` / `password123`
- Doctor: `doctor@hospital.in` / `password123`
- Nurse: `nurse@hospital.in` / `password123`

## 🛠️ Tech Stack

**Frontend:** React 19, TypeScript, Vite, TailwindCSS, React Query, React Router  
**Backend:** NestJS, PostgreSQL, Prisma, JWT Authentication  
**Testing:** Vitest, Playwright, ESLint, Prettier

## 📖 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed installation steps
- **[API Documentation](./API_DOCUMENTATION.md)** - API endpoints reference
- **[Architecture](./docs/ARCHITECTURE.md)** - System design patterns
- **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute
- **[Deployment](./docs/DEPLOYMENT.md)** - Production deployment guide

## 📸 Screenshots

<details>
<summary>View Screenshots</summary>

### Login Page
![Login](https://github.com/user-attachments/assets/5fa10008-da4c-4a9d-be89-40e0a2681a31)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/05dcb68f-322c-4c13-998f-29d11601ef02)

### Patients Registry
![Patients](https://github.com/user-attachments/assets/cbcafaf4-c43f-42e5-a043-65852fb956b0)

### Billing
![Billing](https://github.com/user-attachments/assets/ff74b147-b18b-4876-8b28-d41bd083b7da)

</details>

## 🤝 Contributing

Contributions are welcome! Please check our [Contributing Guide](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 👨‍💻 Author

Built for Indian Hospital Management Systems

---

For detailed setup instructions and advanced configuration, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
