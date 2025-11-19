import { UserRole } from '../types';

export type Permission =
  | 'view_dashboard'
  | 'view_patients'
  | 'create_patient'
  | 'edit_patient'
  | 'delete_patient'
  | 'view_encounters'
  | 'create_encounter'
  | 'edit_encounter'
  | 'view_labs'
  | 'create_lab'
  | 'edit_lab'
  | 'view_prescriptions'
  | 'create_prescription'
  | 'edit_prescription'
  | 'view_billing'
  | 'create_bill'
  | 'edit_bill'
  | 'process_payment'
  | 'view_reports'
  | 'view_settings'
  | 'view_audit_log'
  | 'search_patients';

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'view_dashboard',
    'view_patients',
    'create_patient',
    'edit_patient',
    'delete_patient',
    'view_encounters',
    'create_encounter',
    'edit_encounter',
    'view_labs',
    'create_lab',
    'edit_lab',
    'view_prescriptions',
    'create_prescription',
    'edit_prescription',
    'view_billing',
    'create_bill',
    'edit_bill',
    'process_payment',
    'view_reports',
    'view_settings',
    'view_audit_log',
    'search_patients',
  ],
  doctor: [
    'view_dashboard',
    'view_patients',
    'create_patient',
    'edit_patient',
    'view_encounters',
    'create_encounter',
    'edit_encounter',
    'view_labs',
    'create_lab',
    'view_prescriptions',
    'create_prescription',
    'edit_prescription',
    'view_billing',
    'view_reports',
    'view_settings',
    'search_patients',
  ],
  nurse: [
    'view_dashboard',
    'view_patients',
    'view_encounters',
    'edit_encounter',
    'view_labs',
    'view_prescriptions',
    'view_settings',
    'search_patients',
  ],
  lab_tech: [
    'view_dashboard',
    'view_patients',
    'view_encounters',
    'view_labs',
    'create_lab',
    'edit_lab',
    'view_settings',
    'search_patients',
  ],
  pharmacist: [
    'view_dashboard',
    'view_patients',
    'view_prescriptions',
    'view_settings',
    'search_patients',
  ],
  billing: [
    'view_dashboard',
    'view_patients',
    'view_encounters',
    'view_billing',
    'create_bill',
    'edit_bill',
    'process_payment',
    'view_reports',
    'view_settings',
    'search_patients',
  ],
};

// Check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

// Check if a role can access a specific route
export const canAccessRoute = (role: UserRole, path: string): boolean => {
  const routePermissions: Record<string, Permission> = {
    '/': 'view_dashboard',
    '/patients': 'view_patients',
    '/patient-search': 'search_patients',
    '/encounters': 'view_encounters',
    '/labs': 'view_labs',
    '/prescriptions': 'view_prescriptions',
    '/billing': 'view_billing',
    '/reports': 'view_reports',
    '/settings': 'view_settings',
    '/audit-log': 'view_audit_log',
  };

  const requiredPermission = routePermissions[path];
  if (!requiredPermission) return true; // Allow access to unknown routes

  return hasPermission(role, requiredPermission);
};

// Get navigation items based on role
export const getNavigationItems = (role: UserRole) => {
  const items = [
    {
      path: '/',
      permission: 'view_dashboard' as Permission,
      icon: 'LayoutDashboard',
      label: 'nav.dashboard',
    },
    {
      path: '/patients',
      permission: 'view_patients' as Permission,
      icon: 'Users',
      label: 'nav.patients',
    },
    {
      path: '/patient-search',
      permission: 'search_patients' as Permission,
      icon: 'Search',
      label: 'nav.patientSearch',
    },
    {
      path: '/encounters',
      permission: 'view_encounters' as Permission,
      icon: 'FileText',
      label: 'nav.encounters',
    },
    {
      path: '/labs',
      permission: 'view_labs' as Permission,
      icon: 'FlaskConical',
      label: 'nav.labs',
    },
    {
      path: '/prescriptions',
      permission: 'view_prescriptions' as Permission,
      icon: 'Pill',
      label: 'nav.prescriptions',
    },
    {
      path: '/billing',
      permission: 'view_billing' as Permission,
      icon: 'Receipt',
      label: 'nav.billing',
    },
    {
      path: '/reports',
      permission: 'view_reports' as Permission,
      icon: 'BarChart',
      label: 'nav.reports',
    },
    {
      path: '/settings',
      permission: 'view_settings' as Permission,
      icon: 'Settings',
      label: 'nav.settings',
    },
    {
      path: '/audit-log',
      permission: 'view_audit_log' as Permission,
      icon: 'Shield',
      label: 'nav.auditLog',
    },
  ];

  return items.filter((item) => hasPermission(role, item.permission));
};
