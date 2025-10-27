# Authentication System Documentation

## Overview
This EHR Portal implements a comprehensive JWT-based authentication system with bcrypt password hashing, role-based access control (RBAC), and a placeholder for future OAuth2/SSO integration.

## Features

### ✅ Implemented Features
1. **JWT-based Authentication**: Secure token-based authentication using JSON Web Tokens
2. **Bcrypt Password Hashing**: Passwords are hashed with bcrypt (salt rounds: 10)
3. **Refresh Tokens**: Long-lived refresh tokens for seamless re-authentication
4. **Token Blacklisting**: Logout functionality with token revocation
5. **Role-Based Access Control**: Fine-grained access control using roles and guards
6. **Custom Decorators**: `@Roles()` decorator for easy role-based authorization
7. **OAuth2/SSO Placeholder**: Mock service ready for future OAuth2 integration

### 🎯 User Roles
The system supports the following roles (defined in Prisma schema):
- `ADMIN` - Full system access, can register new users
- `DOCTOR` - Can create prescriptions, view/edit patient records
- `NURSE` - Can view/edit patient records, create observations
- `LAB_TECH` - Can create/update lab results
- `PHARMACIST` - Can view prescriptions, manage medications
- `BILLING` - Can create/manage bills
- `RECEPTIONIST` - Can manage patient registration and basic operations

## API Endpoints

### Authentication Endpoints

#### 1. Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "admin@hospital.in",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@hospital.in",
    "name": "Admin User",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1d"
}
```

#### 2. Register (Admin Only)
```
POST /auth/register
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "email": "doctor@hospital.in",
  "password": "secure_password",
  "name": "Dr. Rajesh Kumar",
  "role": "DOCTOR"
}
```
**Note:** Only users with ADMIN role can register new users.

#### 3. Refresh Token
```
POST /auth/refresh
```
**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1d"
}
```

#### 4. Logout
```
POST /auth/logout
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Logout successful"
}
```
**Note:** Blacklists the current token, preventing further use.

#### 5. Get Current User Profile
```
GET /auth/me
Authorization: Bearer <token>
```
**Response:**
```json
{
  "id": "uuid",
  "email": "doctor@hospital.in",
  "name": "Dr. Rajesh Kumar",
  "role": "DOCTOR",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 6. SSO Endpoints (OAuth2 Placeholder)
```
GET /auth/sso/:provider
POST /auth/sso/callback
```
**Note:** These are placeholders for future OAuth2 integration with providers like Google, Azure AD, Okta, etc.

## Usage Examples

### Protecting Routes with JWT

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
```

### Role-Based Access Control

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  
  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createPrescription() {
    // Only ADMIN and DOCTOR can create prescriptions
    return { message: 'Prescription created' };
  }
}
```

### Multiple Guards

```typescript
// Apply JWT authentication at controller level
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  
  // Allow multiple roles
  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  createPatient() {
    // Accessible to ADMIN, DOCTOR, NURSE, RECEPTIONIST
  }
  
  // No @Roles decorator = accessible to all authenticated users
  @Get()
  getAllPatients() {
    // Any authenticated user can access
  }
}
```

## Implementation Details

### Token Blacklist Service
The `TokenBlacklistService` maintains a blacklist of revoked tokens:
- Stores blacklisted tokens in-memory (use Redis in production for distributed systems)
- Automatically cleans up expired tokens
- Checks tokens on each authenticated request

### Guards

#### JwtAuthGuard
- Validates JWT tokens
- Checks if token is blacklisted
- Attaches user information to request object

#### RolesGuard
- Validates user roles against required roles
- Uses `@Roles()` decorator metadata
- Works in conjunction with `JwtAuthGuard`

### Custom Decorators

#### @Roles(...roles)
```typescript
@Roles(UserRole.ADMIN, UserRole.DOCTOR)
```
- Specifies which roles can access an endpoint
- Can accept multiple roles
- Used with `RolesGuard`

## Security Features

### Password Security
- Bcrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Passwords excluded from API responses

### Token Security
- Access tokens: Short-lived (default: 1 day)
- Refresh tokens: Long-lived (default: 7 days)
- Tokens can be revoked via logout
- Blacklist prevents token reuse after logout

### Environment Variables
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRATION=7d
```

## Future OAuth2/SSO Integration

The system includes a `MockSSOService` that provides placeholders for:
- OAuth2 authorization URL generation
- Token exchange
- Token validation
- User synchronization

To implement OAuth2:
1. Choose provider(s): Google, Azure AD, Okta, etc.
2. Implement `MockSSOService` methods
3. Add OAuth2 strategies (e.g., `passport-google-oauth20`)
4. Configure provider credentials in environment variables
5. Update SSO endpoints in `auth.controller.ts`

## Example Role-Based Endpoints

The following modules demonstrate role-based access control:

### Patients Module
- Create patient: `ADMIN, DOCTOR, NURSE, RECEPTIONIST`
- View patients: All authenticated users

### Billing Module
- Create bill: `ADMIN, BILLING, RECEPTIONIST`

### Prescriptions Module
- Create prescription: `ADMIN, DOCTOR`

### Labs Module
- Create lab result: `ADMIN, DOCTOR, LAB_TECH`

## Testing

### Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.in",
    "password": "password123"
  }'
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Best Practices

1. **Always use HTTPS in production** to prevent token interception
2. **Rotate JWT secrets regularly** in production environments
3. **Use Redis or database for token blacklist** in production (instead of in-memory)
4. **Implement rate limiting** on authentication endpoints
5. **Monitor failed login attempts** for security threats
6. **Use strong password policies** (minimum length, complexity)
7. **Implement account lockout** after multiple failed attempts
8. **Add audit logging** for authentication events
9. **Regularly update dependencies** to patch security vulnerabilities
10. **Use environment-specific secrets** (never commit secrets to git)

## Troubleshooting

### Token Expired Error
- Use refresh token to get a new access token
- Re-login if refresh token also expired

### Unauthorized Error
- Ensure token is included in Authorization header
- Check token format: `Bearer <token>`
- Verify token hasn't been revoked/blacklisted

### Forbidden Error (403)
- User doesn't have required role
- Check endpoint's `@Roles()` decorator
- Verify user's role in database

## Migration Notes

If migrating from an existing auth system:
1. Hash all existing passwords with bcrypt
2. Update user records with role assignments
3. Invalidate all old tokens
4. Force users to re-login with new credentials
