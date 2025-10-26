import { describe, it, expect, beforeEach } from 'vitest';
import { logAuditEvent, getAuditLogs } from '../services/auditLogger';

describe('Audit Logger', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should log audit events', async () => {
    await logAuditEvent({
      userId: 'user1',
      userName: 'John Doe',
      userRole: 'admin',
      action: 'Created',
      resource: 'Patient',
      resourceId: 'P001',
      details: 'Created patient record',
    });

    const logs = getAuditLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].userId).toBe('user1');
    expect(logs[0].userName).toBe('John Doe');
    expect(logs[0].action).toBe('Created');
    expect(logs[0].resource).toBe('Patient');
    expect(logs[0].resourceId).toBe('P001');
  });

  it('should include user role in details', async () => {
    await logAuditEvent({
      userId: 'user1',
      userName: 'Jane Smith',
      userRole: 'doctor',
      action: 'Updated',
      resource: 'Encounter',
      resourceId: 'E001',
      details: 'Updated encounter status',
    });

    const logs = getAuditLogs();
    expect(logs[0].details).toContain('[Role: doctor]');
    expect(logs[0].details).toContain('Updated encounter status');
  });

  it('should add role to details even without existing details', async () => {
    await logAuditEvent({
      userId: 'user1',
      userName: 'Test User',
      userRole: 'nurse',
      action: 'Viewed',
      resource: 'Patient',
      resourceId: 'P001',
    });

    const logs = getAuditLogs();
    expect(logs[0].details).toBe('[Role: nurse]');
  });

  it('should store multiple audit events', async () => {
    await logAuditEvent({
      userId: 'user1',
      userName: 'User One',
      userRole: 'admin',
      action: 'Created',
      resource: 'Patient',
      resourceId: 'P001',
    });

    await logAuditEvent({
      userId: 'user2',
      userName: 'User Two',
      userRole: 'doctor',
      action: 'Updated',
      resource: 'Patient',
      resourceId: 'P001',
    });

    const logs = getAuditLogs();
    expect(logs).toHaveLength(2);
    expect(logs[0].userId).toBe('user2'); // Most recent first
    expect(logs[1].userId).toBe('user1');
  });

  it('should generate unique IDs for each log entry', async () => {
    await logAuditEvent({
      userId: 'user1',
      userName: 'User One',
      userRole: 'admin',
      action: 'Created',
      resource: 'Patient',
      resourceId: 'P001',
    });

    await logAuditEvent({
      userId: 'user1',
      userName: 'User One',
      userRole: 'admin',
      action: 'Created',
      resource: 'Patient',
      resourceId: 'P002',
    });

    const logs = getAuditLogs();
    expect(logs[0].id).not.toBe(logs[1].id);
  });

  it('should include timestamp for each log entry', async () => {
    await logAuditEvent({
      userId: 'user1',
      userName: 'User One',
      userRole: 'admin',
      action: 'Created',
      resource: 'Patient',
      resourceId: 'P001',
    });

    const logs = getAuditLogs();
    expect(logs[0].timestamp).toBeDefined();
    expect(new Date(logs[0].timestamp).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
