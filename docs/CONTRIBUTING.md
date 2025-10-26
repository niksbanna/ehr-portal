# Contributing Guide

Thank you for considering contributing to the EHR Portal! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ehr-portal.git
cd ehr-portal
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

See the [Setup Guide](./SETUP.md) for detailed instructions.

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

## Development Process

### 1. Make Your Changes

- Follow the [Coding Standards](#coding-standards)
- Write clear, self-documenting code
- Add comments for complex logic
- Update tests as needed

### 2. Test Your Changes

```bash
# Run linter
npm run lint

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Check formatting
npm run format:check
```

### 3. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add patient search functionality"
```

Commit message format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks
- `perf`: Performance improvements

Examples:

```
feat(patients): add search by medical record number
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
refactor(components): simplify PatientForm logic
test(utils): add tests for sanitize function
```

## Submitting Changes

### 1. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:
   - Clear title
   - Description of changes
   - Related issues
   - Screenshots (if UI changes)
   - Testing performed

### 3. PR Review Process

- Address review comments promptly
- Keep the PR focused and small
- Maintain a clean commit history
- Ensure CI checks pass

### 4. After Approval

Once approved, a maintainer will merge your PR.

## Coding Standards

### TypeScript

```typescript
// Use explicit types
function calculateAge(birthDate: Date): number {
  // Implementation
}

// Avoid 'any' type
const data: PatientData = fetchData(); // ✓
const data: any = fetchData(); // ✗

// Use interfaces for objects
interface Patient {
  id: string;
  name: string;
  age: number;
}
```

### React Components

```typescript
// Functional components with TypeScript
interface PatientCardProps {
  patient: Patient;
  onEdit: (id: string) => void;
}

export function PatientCard({ patient, onEdit }: PatientCardProps) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// Use hooks appropriately
const [patients, setPatients] = useState<Patient[]>([]);
const { data, isLoading } = useQuery(['patients'], fetchPatients);
```

### File Organization

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── api/               # API client and types
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── contexts/          # React contexts
└── services/          # Business logic
```

### Naming Conventions

- **Components**: PascalCase (`PatientCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.tsx`)
- **Utilities**: camelCase (`sanitize.ts`)
- **Types/Interfaces**: PascalCase (`Patient`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Use template literals for string interpolation
- Prefer `const` over `let`
- Use arrow functions for callbacks

```typescript
// Good
const patientName = `${patient.firstName} ${patient.lastName}`;
const filteredPatients = patients.filter((p) => p.age > 18);

// Avoid
var patientName = patient.firstName + ' ' + patient.lastName;
const filteredPatients = patients.filter(function (p) {
  return p.age > 18;
});
```

### ESLint and Prettier

Code is automatically formatted and linted:

```bash
# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

Pre-commit hooks will run automatically via Husky.

## Testing

### Unit Tests

Write tests for:

- Utility functions
- Custom hooks
- Business logic

```typescript
// Example test
import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('should remove script tags', () => {
    const input = '<script>alert("xss")</script>Hello';
    expect(sanitizeInput(input)).toBe('Hello');
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { PatientCard } from './PatientCard';

describe('PatientCard', () => {
  it('should render patient name', () => {
    const patient = { id: '1', name: 'John Doe', age: 30 };
    render(<PatientCard patient={patient} onEdit={() => {}} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### E2E Tests

Write E2E tests for critical user flows:

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'admin@hospital.in');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
});
```

### Test Coverage

- Aim for at least 80% code coverage
- All new features must include tests
- Bug fixes should include regression tests

## Documentation

### Code Documentation

```typescript
/**
 * Calculates the patient's age from their birth date
 * @param birthDate - The patient's date of birth
 * @returns The age in years
 */
function calculateAge(birthDate: Date): number {
  // Implementation
}
```

### API Documentation

Update API docs when adding/modifying endpoints.

### README Updates

Update README.md when:

- Adding new features
- Changing setup process
- Modifying dependencies

### Inline Comments

```typescript
// Good: Explain WHY, not WHAT
// Using debounce to prevent excessive API calls during typing
const debouncedSearch = useDeBounce(searchTerm, 500);

// Bad: Obvious comments
// Set name to firstName
const name = firstName;
```

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the style guide
- [ ] Tests are added/updated and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] CI checks pass
- [ ] Changes are tested locally

## Questions?

- Check existing [Issues](https://github.com/niksbanna/ehr-portal/issues)
- Read the [Setup Guide](./SETUP.md)
- Contact maintainers

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing! 🎉
