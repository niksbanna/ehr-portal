/**
 * Role-based Data Visibility Component
 * Restricts display of sensitive data based on user role
 */

import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface RestrictedDataProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Wrapper component that only shows children if user has required role
 */
export function RestrictedData({ children, allowedRoles, fallback = '***' }: RestrictedDataProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface SensitiveFieldProps {
  value: string | undefined;
  fieldType: 'aadhaar' | 'phone' | 'email' | 'address' | 'financial';
  allowedRoles?: UserRole[];
}

/**
 * Component to display sensitive fields with role-based visibility
 */
export function SensitiveField({ value, fieldType, allowedRoles }: SensitiveFieldProps) {
  const { user } = useAuth();

  if (!value) return <>N/A</>;

  // Define default allowed roles for each field type
  const defaultRoles: Record<SensitiveFieldProps['fieldType'], UserRole[]> = {
    aadhaar: ['admin', 'doctor'],
    phone: ['admin', 'doctor', 'nurse', 'billing'],
    email: ['admin', 'doctor', 'nurse', 'billing'],
    address: ['admin', 'doctor', 'nurse', 'billing'],
    financial: ['admin', 'billing'],
  };

  const roles = allowedRoles || defaultRoles[fieldType];

  if (!user || !roles.includes(user.role)) {
    return (
      <span className="text-gray-400" aria-label="Restricted data">
        ***
      </span>
    );
  }

  return <>{value}</>;
}

interface ActionButtonProps {
  children: ReactNode;
  requiredRoles: UserRole[];
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Button component that is only enabled for users with required roles
 */
export function RoleRestrictedButton({
  children,
  requiredRoles,
  onClick,
  className = '',
  ariaLabel,
}: ActionButtonProps) {
  const { user } = useAuth();

  const hasPermission = user && requiredRoles.includes(user.role);

  return (
    <button
      onClick={hasPermission ? onClick : undefined}
      disabled={!hasPermission}
      className={`${className} ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={ariaLabel}
      title={hasPermission ? undefined : 'You do not have permission to perform this action'}
    >
      {children}
    </button>
  );
}
