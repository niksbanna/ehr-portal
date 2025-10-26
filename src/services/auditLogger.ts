/**
 * Audit Logging Service
 * Logs user actions with metadata (userId, role, timestamp)
 * TODO: In production, this should send logs to a backend API
 */

import { AuditLogEntry } from '../types';

interface AuditLogParams {
  userId: string;
  userName: string;
  userRole: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Viewed' | 'Login' | 'Logout';
  resource: string;
  resourceId: string;
  details?: string;
}

/**
 * Logs an audit event
 * Currently stores in localStorage, but should send to backend API in production
 */
export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  const auditEntry: AuditLogEntry = {
    id: `A${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: params.userId,
    userName: params.userName,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    timestamp: new Date().toISOString(),
    details: params.details,
    ipAddress: await getClientIp(),
  };

  // Add user role to details for enhanced tracking
  if (auditEntry.details) {
    auditEntry.details = `[Role: ${params.userRole}] ${auditEntry.details}`;
  } else {
    auditEntry.details = `[Role: ${params.userRole}]`;
  }

  // Store in localStorage (temporary solution)
  // TODO: Replace with API call to backend audit service
  const existingLogs = getAuditLogs();
  existingLogs.unshift(auditEntry);

  // Keep only last 1000 entries in localStorage
  const trimmedLogs = existingLogs.slice(0, 1000);
  localStorage.setItem('auditLogs', JSON.stringify(trimmedLogs));

  // In production, send to backend:
  // await fetch('/api/audit/log', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //   },
  //   body: JSON.stringify(auditEntry),
  // });
}

/**
 * Retrieves audit logs from localStorage
 * TODO: Replace with API call in production
 */
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const logs = localStorage.getItem('auditLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Failed to retrieve audit logs', error);
    return [];
  }
}

/**
 * Gets the client IP address
 * In production, this should be done server-side
 */
async function getClientIp(): Promise<string> {
  // TODO: Get real IP from backend
  // For now, return a placeholder
  return 'N/A';
}
