# EHR Portal - Complete Setup Guide

This guide provides detailed instructions for setting up the EHR Portal in different configurations.

## Table of Contents

1. [Quick Start (Mock API)](#quick-start-mock-api)
2. [Full Stack Setup (Frontend + Backend)](#full-stack-setup-frontend--backend)
3. [Environment Configuration](#environment-configuration)
4. [Testing the Application](#testing-the-application)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start (Mock API)

Perfect for frontend development, UI testing, and demos without backend setup.

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/niksbanna/ehr-portal.git
   cd ehr-portal
   npm install
   ```

2. **Configure for Mock Mode**
   ```bash
   cp .env.mock .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - URL: http://localhost:5173
   - Email: `admin@hospital.in`
   - Password: any password (mocked)

### What's Included in Mock Mode

- ✅ Complete UI functionality
- ✅ Simulated API responses
- ✅ Realistic data (5 patients, encounters, bills, etc.)
- ✅ Login/logout flow
- ✅ All CRUD operations (data resets on refresh)
- ✅ No database required
- ✅ No backend setup needed

---

## Full Stack Setup (Frontend + Backend)

For production-like environment with real database persistence.

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 16+ OR Docker & Docker Compose

### Option A: Using Docker (Recommended)

#### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start PostgreSQL with Docker
docker-compose up -d

# Run migrations and seed data
npm run prisma:migrate
npm run prisma:seed

# Start backend server
npm run start:dev
```

Backend will run at: http://localhost:3000
Swagger API docs: http://localhost:3000/api/docs

#### Step 2: Setup Frontend

```bash
# Return to root directory
cd ..

# Install dependencies (if not already done)
npm install

# Configure for backend mode
cp .env.backend .env

# Start frontend server
npm run dev
```

Frontend will run at: http://localhost:5173

#### Step 3: Login

Use one of these credentials:
- **Admin**: `admin@hospital.in` / `password123`
- **Doctor**: `doctor@hospital.in` / `password123`
- **Nurse**: `nurse@hospital.in` / `password123`

### Option B: Using Local PostgreSQL

If you have PostgreSQL installed locally:

1. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE ehr_portal;
   CREATE USER ehr_user WITH PASSWORD 'ehr_password';
   GRANT ALL PRIVILEGES ON DATABASE ehr_portal TO ehr_user;
   \q
   ```

2. **Update Backend .env**
   ```env
   DATABASE_URL="postgresql://ehr_user:ehr_password@localhost:5432/ehr_portal?schema=public"
   ```

3. **Follow Step 1 from Option A** (skip docker-compose)

---

## Environment Configuration

### Frontend (.env)

#### Mock API Mode (.env.mock)
```env
VITE_ENABLE_MSW=true
VITE_API_BASE_URL=
VITE_AUTH_TOKEN_KEY=ehr_auth_token
```

#### Real Backend Mode (.env.backend)
```env
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH_TOKEN_KEY=ehr_auth_token
```

### Backend (backend/.env)

```env
# Database
DATABASE_URL="postgresql://ehr_user:ehr_password@localhost:5432/ehr_portal?schema=public"

# Server
NODE_ENV=development
PORT=3000
API_PREFIX=api

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d

# CORS
CORS_ORIGIN=http://localhost:5173

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs
```

### Switching Modes

To switch from mock to real backend (or vice versa):

1. **Stop the dev server** (Ctrl+C)
2. **Update .env file**
3. **Restart dev server** (`npm run dev`)

---

## Testing the Application

### Verify Full Flow

1. **Login**
   - Navigate to http://localhost:5173
   - Login with credentials

2. **Patient CRUD**
   - Go to Patients page
   - Add new patient
   - Edit existing patient
   - Delete patient (optional)

3. **Create Encounter**
   - Go to Encounters page
   - Create new encounter
   - Add vital signs and diagnosis

4. **Lab Orders**
   - Go to Lab Results page
   - Order new lab test
   - Update test results

5. **Billing**
   - Go to Billing page
   - View invoices
   - Process payment

6. **Audit Log**
   - Go to Audit Log page
   - Verify all actions are logged

### Check Console Logs

**Mock Mode:**
```
[LOG] MSW enabled - using mock API
[MSW] Mocking enabled
```

**Backend Mode:**
```
[LOG] MSW disabled - using real backend API
Application is running on: http://localhost:3000
```

---

## Troubleshooting

### Frontend Issues

**Problem: "MSW enabled" but want real backend**
- Solution: Check `.env` has `VITE_ENABLE_MSW=false`
- Restart dev server after changing

**Problem: API calls failing**
- Solution: Verify `VITE_API_BASE_URL=http://localhost:3000` in `.env`
- Check backend is running on port 3000

**Problem: CORS errors**
- Solution: Verify backend `.env` has `CORS_ORIGIN=http://localhost:5173`
- Restart backend after changing

### Backend Issues

**Problem: Database connection failed**
- Solution: Check PostgreSQL is running
- Verify DATABASE_URL in `backend/.env`
- Test connection: `psql postgresql://ehr_user:ehr_password@localhost:5432/ehr_portal`

**Problem: Port 3000 already in use**
- Solution: Change PORT in `backend/.env`
- Update `VITE_API_BASE_URL` in frontend `.env`

**Problem: Prisma errors**
- Solution: Regenerate client: `npm run prisma:generate`
- Reset database: `npm run prisma:migrate reset`

### Common Issues

**Problem: Changes not reflecting**
- Solution: Clear browser cache
- Delete `node_modules` and reinstall
- Check file is saved

**Problem: Login not working**
- Solution: Check console for errors
- Verify credentials are correct
- Clear localStorage: `localStorage.clear()`

---

## Repository Structure

```
ehr-portal/
├── .env                    # Frontend environment (copy from .env.mock or .env.backend)
├── .env.mock              # Template for mock mode
├── .env.backend           # Template for backend mode
├── .env.example           # Original template
├── src/
│   ├── config/
│   │   └── api.config.ts  # API configuration
│   ├── api/
│   │   └── hooks/         # React Query hooks
│   ├── hooks/
│   │   └── useAuth.tsx    # Authentication
│   └── main.tsx           # Entry point (MSW initialization)
├── backend/
│   ├── .env               # Backend environment (copy from .env.example)
│   ├── .env.example       # Backend template
│   ├── src/               # NestJS source
│   ├── prisma/            # Database schema & migrations
│   └── docker-compose.yml # PostgreSQL container
└── README.md              # Main documentation
```

---

## Next Steps

- Review [API Documentation](./API_DOCUMENTATION.md)
- Check [Backend Integration Guide](./BACKEND_INTEGRATION.md)
- Explore [Security Features](./SECURITY_ACCESSIBILITY.md)
- Read [Performance Guide](./PERFORMANCE.md)

---

## Need Help?

- Check the [README](./README.md)
- Review [Documentation](./docs/)
- Open an [Issue](https://github.com/niksbanna/ehr-portal/issues)
