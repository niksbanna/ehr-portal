# Audit Logging and Security Features

## Overview
This module provides comprehensive audit logging and security features for the EHR Portal backend.

## Features

### 1. Security Headers (Helmet)
- Automatically adds secure HTTP headers to all responses
- Protects against common web vulnerabilities
- Configured in `src/main.ts`

### 2. CORS Configuration
- Restricts access to frontend origin only (configurable via `CORS_ORIGIN` env variable)
- Explicitly defines allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allows credentials and specific headers

### 3. Audit Logging Middleware
Located in `src/common/interceptors/audit-log.interceptor.ts`

**Tracks all mutations (POST, PATCH, PUT, DELETE) and records:**
- User ID
- User Role (at time of action)
- IP Address (supports x-forwarded-for, x-real-ip)
- User Agent
- Timestamp
- Action (CREATE, UPDATE, DELETE)
- Entity (e.g., Patients, Encounters)
- Entity ID (if applicable)
- Request body (with sensitive data masked)
- Status (SUCCESS or FAILURE)
- Error message (for failures)

### 4. Sensitive Data Masking
Located in `src/common/utils/data-masking.util.ts`

**Automatically masks:**
- **Aadhaar numbers**: Shows only last 4 digits (XXXX-XXXX-1234)
- **PAN numbers**: Shows only last 4 characters (XXXXXX234F)

The masking is recursive and works with:
- Nested objects
- Arrays
- Complex JSON structures

### 5. Audit Log API

#### GET /api/audit
Admin-only endpoint to retrieve audit logs.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `userRole` (optional): Filter by user role
- `entity` (optional): Filter by entity type
- `action` (optional): Filter by action (CREATE, UPDATE, DELETE)
- `status` (optional): Filter by status (SUCCESS, FAILURE)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Items per page
- `order` (optional, default: desc): Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userRole": "DOCTOR",
      "action": "CREATE",
      "entity": "Patients",
      "entityId": "uuid",
      "changes": { "masked": "data" },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-10-27T06:00:00.000Z",
      "status": "SUCCESS",
      "errorMessage": null,
      "user": {
        "id": "uuid",
        "name": "Dr. John Doe",
        "email": "john@example.com",
        "role": "DOCTOR"
      }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  }
}
```

#### GET /api/audit/:id
Admin-only endpoint to retrieve a specific audit log by ID.

## Database Schema

### AuditLog Model
```prisma
model AuditLog {
  id          String    @id @default(uuid())
  userId      String?
  user        User?     @relation(fields: [userId], references: [id])
  userRole    UserRole? // Role at the time of action
  action      String    // e.g., "CREATE", "UPDATE", "DELETE"
  entity      String    // e.g., "Patient", "Encounter", "User"
  entityId    String?   // ID of the affected entity
  changes     Json?     // Request body with sensitive data masked
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime  @default(now())
  status      String?   // e.g., "SUCCESS", "FAILURE"
  errorMessage String?

  @@index([userId])
  @@index([entity])
  @@index([timestamp])
  @@map("audit_logs")
}
```

## Usage Examples

### Viewing Audit Logs (Admin)
```bash
# Get all audit logs
curl -H "Authorization: Bearer <admin-token>" http://localhost:3000/api/audit

# Filter by user
curl -H "Authorization: Bearer <admin-token>" http://localhost:3000/api/audit?userId=<user-id>

# Filter by entity and action
curl -H "Authorization: Bearer <admin-token>" http://localhost:3000/api/audit?entity=Patients&action=CREATE

# Filter by status
curl -H "Authorization: Bearer <admin-token>" http://localhost:3000/api/audit?status=FAILURE

# Pagination
curl -H "Authorization: Bearer <admin-token>" http://localhost:3000/api/audit?page=2&limit=100
```

## Configuration

### Environment Variables
```env
# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Add to your .env file
```

## Security Considerations

1. **Admin-Only Access**: Audit logs are only accessible to users with ADMIN role
2. **Sensitive Data**: All Aadhaar and PAN numbers are automatically masked before logging
3. **IP Tracking**: Supports proxy headers (x-forwarded-for, x-real-ip)
4. **CORS**: Strictly enforced to prevent unauthorized origins
5. **Helmet**: Adds security headers to prevent common vulnerabilities

## Migration

To apply the schema changes:
```bash
npm run prisma:migrate
```

Or manually run the migration:
```sql
ALTER TABLE "audit_logs" ADD COLUMN "userRole" "UserRole";
```

## Testing

The audit logging is automatically applied to all mutation endpoints. To test:

1. Make any POST/PATCH/PUT/DELETE request as an authenticated user
2. Check the audit logs via GET /api/audit (as admin)
3. Verify that sensitive data is masked
4. Check that role, IP, and timestamp are recorded

## Maintenance

### Log Retention
Consider implementing log retention policies to prevent unbounded growth:
- Archive old logs to cold storage
- Delete logs older than regulatory retention period
- Monitor database size

### Performance
The audit logging uses asynchronous logging to minimize performance impact. If needed:
- Add additional indexes on frequently queried fields
- Implement batch logging for high-traffic scenarios
- Consider separate database for audit logs
