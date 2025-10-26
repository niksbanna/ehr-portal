# Architecture Guide

This document describes the architecture, design patterns, and technical decisions in the EHR Portal.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Directory Structure](#directory-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Performance Optimization](#performance-optimization)
- [Security](#security)

## Overview

The EHR Portal is a modern, single-page application (SPA) built with React and TypeScript. It follows a component-based architecture with clear separation of concerns.

### Key Principles

- **Component-Based**: Modular, reusable components
- **Type Safety**: Full TypeScript implementation
- **Performance**: Code splitting, lazy loading, caching
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Security**: Input sanitization, XSS prevention, audit logging

## Technology Stack

### Core Technologies

- **React 19**: UI library with latest features
- **TypeScript 5.9**: Type-safe development
- **Vite 7**: Fast build tool and dev server
- **TailwindCSS 3**: Utility-first CSS framework

### State Management

- **TanStack Query**: Server state management
- **React Context**: Global UI state (theme, i18n)
- **React Hooks**: Local component state

### Routing

- **React Router v7**: Client-side routing with data loading

### Forms

- **React Hook Form**: Performant form handling
- **Zod**: Schema validation

### Testing

- **Vitest**: Unit and integration testing
- **Playwright**: End-to-end testing
- **Testing Library**: Component testing utilities

### Data Mocking

- **MSW (Mock Service Worker)**: API mocking for development

## Architecture Patterns

### Component Architecture

```
┌─────────────────────────────────────┐
│           App Component             │
│  (Auth, Query, Theme Providers)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Layout Component            │
│      (Sidebar, Navigation)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Page Components             │
│  (Dashboard, Patients, etc.)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Feature Components             │
│   (PatientCard, EncounterForm)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Common Components              │
│    (Button, Input, Modal)           │
└─────────────────────────────────────┘
```

### Layered Architecture

```
┌─────────────────────────────────────┐
│       Presentation Layer            │
│   (Components, Pages, Hooks)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Business Logic Layer          │
│    (Services, Utilities)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Data Layer                  │
│   (API Client, Mock Handlers)       │
└─────────────────────────────────────┘
```

## Directory Structure

```
src/
├── api/                    # API client and schema
│   ├── hooks/             # React Query hooks
│   ├── mocks/             # MSW mock handlers
│   ├── schema/            # API type definitions
│   └── index.ts           # API client
│
├── components/            # React components
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── layout/           # Layout components
│       ├── Layout.tsx
│       └── Sidebar.tsx
│
├── pages/                # Page components (routes)
│   ├── DashboardPage.tsx
│   ├── PatientsPage.tsx
│   └── LoginPage.tsx
│
├── hooks/                # Custom React hooks
│   ├── useAuth.tsx
│   ├── useTheme.ts
│   └── useI18n.ts
│
├── routes/               # Route configuration
│   └── index.tsx
│
├── stores/               # State management
│   └── index.ts
│
├── contexts/             # React contexts
│   ├── ThemeContext.tsx
│   └── I18nContext.tsx
│
├── services/             # Business logic
│   ├── api.ts
│   └── auditLogger.ts
│
├── utils/                # Utility functions
│   ├── sanitize.ts
│   ├── permissions.ts
│   └── accessibility.ts
│
├── types/                # TypeScript types
│   └── index.ts
│
├── schemas/              # Validation schemas
│   └── patient-form.schema.ts
│
├── test/                 # Test files
│   └── setup.ts
│
├── mocks/                # Symlink to api/mocks
├── tests/                # Symlink to test
│
├── i18n/                 # Internationalization
│   └── translations.ts
│
├── data/                 # Static data
│   └── icd10-codes.json
│
├── assets/               # Static assets
│   └── react.svg
│
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## Data Flow

### Server State (API Data)

```
Component → useQuery Hook → API Client → Mock/Real API
                ↓
            Cache (React Query)
                ↓
            Component (Re-render)
```

### Local State (UI State)

```
User Action → Component State → Re-render
```

### Global State (Theme, i18n)

```
User Action → Context Update → Consumer Re-render
```

## State Management

### Server State with React Query

Used for:

- Fetching data from API
- Caching responses
- Background refetching
- Optimistic updates

```typescript
// Example
const { data: patients, isLoading } = useQuery({
  queryKey: ['patients'],
  queryFn: fetchPatients,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### UI State with Context

Used for:

- Theme (light/dark mode)
- Language (i18n)
- Authentication state

```typescript
// Theme Context
const { theme, toggleTheme } = useTheme();

// I18n Context
const { t, language, setLanguage } = useI18n();
```

### Component State with Hooks

Used for:

- Form inputs
- UI toggles
- Local component data

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>(initialData);
```

## Routing

### Route Configuration

Routes are defined in `src/routes/index.tsx`:

```typescript
const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <DashboardPage /> },
  { path: '/patients', element: <PatientsPage /> },
  { path: '/patients/:id', element: <PatientChartPage /> },
];
```

### Protected Routes

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

### Code Splitting

Routes use lazy loading for better performance:

```typescript
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

## API Integration

### API Client Structure

```typescript
// src/api/index.ts
export const api = {
  patients: {
    getAll: () => fetch('/api/patients'),
    getById: (id: string) => fetch(`/api/patients/${id}`),
    create: (data: Patient) =>
      fetch('/api/patients', { method: 'POST', body: JSON.stringify(data) }),
  },
};
```

### Mock Service Worker (Development)

MSW intercepts API calls during development:

```typescript
// src/api/mocks/handlers.ts
export const handlers = [
  http.get('/api/patients', () => {
    return HttpResponse.json(mockPatients);
  }),
];
```

### FHIR Compliance

The API follows FHIR R4 standards for healthcare data:

```typescript
interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: [{ given: string[]; family: string }];
  birthDate: string;
}
```

## Performance Optimization

### Code Splitting

- Lazy loaded routes
- Dynamic imports for large components
- Manual chunks in Vite config

### Caching Strategy

```typescript
// React Query cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});
```

### Memoization

```typescript
// Expensive calculations
const sortedPatients = useMemo(
  () => patients.sort((a, b) => a.name.localeCompare(b.name)),
  [patients]
);

// Callbacks
const handleClick = useCallback((id: string) => navigate(`/patients/${id}`), [navigate]);
```

### Virtual Scrolling

For large lists:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={patients.length}
  itemSize={80}
>
  {({ index, style }) => (
    <PatientRow patient={patients[index]} style={style} />
  )}
</FixedSizeList>
```

### Bundle Optimization

- Tree shaking
- Minification
- Gzip compression
- Manual vendor chunks

## Security

### Input Sanitization

All user inputs are sanitized:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(userInput);
```

### XSS Prevention

- React escapes by default
- No `dangerouslySetInnerHTML` without sanitization
- CSP headers in production

### Authentication

```typescript
// JWT token storage
localStorage.setItem('auth_token', token);

// API authentication
fetch('/api/data', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Audit Logging

All sensitive operations are logged:

```typescript
auditLogger.log({
  action: 'patient.update',
  userId: user.id,
  resourceId: patient.id,
  timestamp: new Date(),
});
```

### RBAC (Role-Based Access Control)

```typescript
function checkPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission);
}
```

## Testing Strategy

### Unit Tests

- Test utilities in isolation
- Test custom hooks
- Test business logic

### Component Tests

- Test user interactions
- Test rendering logic
- Test accessibility

### E2E Tests

- Test critical user flows
- Test authentication
- Test data persistence

### Test Coverage

Target: 80%+ code coverage for:

- Utility functions: 100%
- Services: 90%
- Components: 70%

## Design Patterns

### Container/Presentational Pattern

```typescript
// Container (logic)
function PatientsPageContainer() {
  const { data, isLoading } = useQuery(['patients'], fetchPatients);
  return <PatientsList patients={data} isLoading={isLoading} />;
}

// Presentational (UI)
function PatientsList({ patients, isLoading }: Props) {
  return <div>{/* Render patients */}</div>;
}
```

### Custom Hooks Pattern

```typescript
// Encapsulate reusable logic
function usePatientSearch(initialQuery: string) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const { data } = useQuery(['patients', debouncedQuery], () => searchPatients(debouncedQuery));

  return { results: data, query, setQuery };
}
```

### Compound Components Pattern

```typescript
// Flexible, composable components
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

## Accessibility

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Color contrast compliance

See [SECURITY_ACCESSIBILITY.md](../SECURITY_ACCESSIBILITY.md) for details.

## Internationalization

Support for multiple languages:

```typescript
const { t } = useI18n();

<h1>{t('dashboard.title')}</h1>
```

## Progressive Web App

- Service worker for offline support
- App manifest
- Installable on mobile devices
- Background sync

## Build Process

```
Source Code → TypeScript Compiler → Vite Build → Optimized Bundle
```

Build outputs:

- `dist/assets/` - Hashed static assets
- `dist/index.html` - Entry HTML
- `dist/sw.js` - Service worker

## Deployment Architecture

```
Client Browser
     ↓
CDN / Load Balancer
     ↓
Nginx (Static Assets)
     ↓
API Backend (FHIR Server)
     ↓
Database (PostgreSQL)
```

## Future Enhancements

- Real-time updates with WebSockets
- Advanced analytics dashboard
- Mobile app (React Native)
- Offline-first architecture
- Microservices backend
- GraphQL API integration

## References

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/)
- [React Router](https://reactrouter.com/)
- [FHIR Specification](https://www.hl7.org/fhir/)
