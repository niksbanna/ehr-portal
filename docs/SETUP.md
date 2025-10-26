# Setup Guide

This guide will help you set up the EHR Portal for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (comes with Node.js)
- **Git** for version control
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/niksbanna/ehr-portal.git
cd ehr-portal
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the environment variables according to your needs. Key variables include:

```bash
# Enable Mock Service Worker for development
VITE_ENABLE_MSW=true

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

For a complete list of environment variables, see the [Environment Configuration Guide](./ENVIRONMENT.md).

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Development Workflow

### Running Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist` directory.

## IDE Setup

### Visual Studio Code

Recommended extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

Add these settings to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, you can change it in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3001, // Change to your preferred port
  },
  // ... rest of config
});
```

### Node Modules Issues

If you encounter issues with node_modules:

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Build Errors

Clear the build cache:

```bash
# Remove dist directory
rm -rf dist

# Rebuild
npm run build
```

## Mock Data

The application comes with pre-seeded mock data for development:

- 3 patients with complete medical records
- 3 encounters (patient visits)
- 3 lab results
- 2 prescriptions
- 3 billing records

Mock data is defined in `src/api/mocks/generators.ts`.

## Demo Credentials

For the mock authentication system:

- **Email**: admin@hospital.in
- **Password**: any password (authentication is mocked)

## Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md) to understand the codebase
- Check out [API Documentation](../API_DOCUMENTATION.md) for API details
- See [Contributing Guide](./CONTRIBUTING.md) to contribute to the project
