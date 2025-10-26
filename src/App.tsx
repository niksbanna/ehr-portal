import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { useGlobalShortcuts } from './hooks/useKeyboardShortcuts';
import { canAccessRoute } from './utils/permissions';
import PageSkeleton from './components/PageSkeleton';

// Lazy load all page components for code-splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const PatientSearchPage = lazy(() => import('./pages/PatientSearchPage'));
const PatientChartPage = lazy(() => import('./pages/PatientChartPage'));
const EncountersPage = lazy(() => import('./pages/EncountersPage'));
const LabsPage = lazy(() => import('./pages/LabsPage'));
const PrescriptionsPage = lazy(() => import('./pages/PrescriptionsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
  },
});

function PrivateRoute({ children, path }: { children: React.ReactNode; path?: string }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role-based access if path is provided
  if (path && user && !canAccessRoute(user.role, path)) {
    // Redirect to dashboard if user doesn't have permission for this route
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  useGlobalShortcuts();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute path="/">
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute path="/patients">
              <PatientsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-search"
          element={
            <PrivateRoute path="/patient-search">
              <PatientSearchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients/:patientId"
          element={
            <PrivateRoute path="/patients">
              <PatientChartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/encounters"
          element={
            <PrivateRoute path="/encounters">
              <EncountersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/labs"
          element={
            <PrivateRoute path="/labs">
              <LabsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <PrivateRoute path="/prescriptions">
              <PrescriptionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <PrivateRoute path="/billing">
              <BillingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute path="/reports">
              <ReportsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute path="/settings">
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-log"
          element={
            <PrivateRoute path="/audit-log">
              <AuditLogPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
