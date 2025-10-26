/**
 * Application Routes Configuration
 *
 * This file contains the centralized route definitions for the application.
 * Using React Router v7 for routing.
 */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load pages for better code splitting
const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const PatientsPage = lazy(() => import('../pages/PatientsPage'));
const PatientSearchPage = lazy(() => import('../pages/PatientSearchPage'));
const PatientChartPage = lazy(() => import('../pages/PatientChartPage'));
const EncountersPage = lazy(() => import('../pages/EncountersPage'));
const LabsPage = lazy(() => import('../pages/LabsPage'));
const PrescriptionsPage = lazy(() => import('../pages/PrescriptionsPage'));
const BillingPage = lazy(() => import('../pages/BillingPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const AuditLogPage = lazy(() => import('../pages/AuditLogPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

/**
 * Route configuration for the application
 * Paths are organized by feature area
 */
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/patients',
    element: <PatientsPage />,
  },
  {
    path: '/patients/search',
    element: <PatientSearchPage />,
  },
  {
    path: '/patients/:id',
    element: <PatientChartPage />,
  },
  {
    path: '/encounters',
    element: <EncountersPage />,
  },
  {
    path: '/labs',
    element: <LabsPage />,
  },
  {
    path: '/prescriptions',
    element: <PrescriptionsPage />,
  },
  {
    path: '/billing',
    element: <BillingPage />,
  },
  {
    path: '/reports',
    element: <ReportsPage />,
  },
  {
    path: '/audit',
    element: <AuditLogPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
];

export default routes;
