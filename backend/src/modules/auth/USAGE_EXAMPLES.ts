/**
 * Authentication System Usage Examples
 *
 * ⚠️ IMPORTANT: This file contains EXAMPLE CODE for documentation purposes only.
 * These are code snippets showing how to use the authentication system.
 * This code is NOT executed in the application - it serves as a reference guide.
 *
 * For actual implementation, see the controllers in the modules directory.
 * Always use proper DTOs with class-validator for input validation in production.
 */

// ============================================================================
// 1. PROTECTING ENDPOINTS WITH JWT AUTHENTICATION
// ============================================================================

import { Controller, Get, Post, UseGuards, Request, Body, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Example: Basic JWT authentication
 * All endpoints in this controller require a valid JWT token
 */
@Controller('example')
@UseGuards(JwtAuthGuard)
export class BasicAuthExampleController {
  @Get('protected')
  getProtectedData() {
    return { message: 'This endpoint requires authentication' };
  }
}

// ============================================================================
// 2. ROLE-BASED ACCESS CONTROL
// ============================================================================

import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Example: Role-based access control
 * Different endpoints require different roles
 */
@Controller('rbac-example')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RBACExampleController {
  // Only ADMIN can access
  @Post('admin-only')
  @Roles(UserRole.ADMIN)
  adminOnlyEndpoint() {
    return { message: 'Only admins can access this' };
  }

  // ADMIN or DOCTOR can access
  @Post('medical-staff')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  medicalStaffEndpoint() {
    return { message: 'Accessible by admin and doctors' };
  }

  // Multiple roles allowed
  @Post('patient-management')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  patientManagementEndpoint() {
    return { message: 'Accessible by patient care staff' };
  }

  // No @Roles decorator = accessible to all authenticated users
  @Get('public-to-authenticated')
  publicToAuthenticated() {
    return { message: 'Any authenticated user can access' };
  }
}

// ============================================================================
// 3. ACCESSING USER INFORMATION IN ENDPOINTS
// ============================================================================

@Controller('user-info')
@UseGuards(JwtAuthGuard)
export class UserInfoExampleController {
  @Get('current-user')
  getCurrentUser(@Request() req) {
    // User info is attached to request by JwtAuthGuard
    // Available properties: userId, email, role
    return {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @Post('create-with-user')
  @Roles(UserRole.DOCTOR)
  createWithUser(@Request() req, @Body() data: any) {
    // Use current user's info when creating records
    const doctorId = req.user.userId;
    // Note: In production, always validate and sanitize 'data' using DTOs
    // and class-validator before using it
    return {
      ...data,
      createdBy: doctorId,
    };
  }
}

// ============================================================================
// 4. COMBINING GUARDS AT CONTROLLER AND METHOD LEVEL
// ============================================================================

/**
 * Example: Controller-level guards with method-level role restrictions
 */
@Controller('mixed-guards')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply to all endpoints
export class MixedGuardsExampleController {
  // All authenticated users
  @Get('list')
  listItems() {
    return { message: 'All authenticated users can list' };
  }

  // Only specific roles can create
  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createItem() {
    return { message: 'Only admin and doctors can create' };
  }

  // Only admin can delete
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteItem(@Param('id') id: string) {
    return { message: `Only admin can delete item ${id}` };
  }
}

// ============================================================================
// 5. INTEGRATION WITH SERVICES
// ============================================================================

import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Example: Using AuthService in other services
 */
@Injectable()
export class SomeOtherService {
  constructor(private authService: AuthService) {}

  async validateAndGetUser(userId: string) {
    // Use auth service methods
    const user = await this.authService.getProfile(userId);
    return user;
  }
}

// ============================================================================
// 6. TESTING WITH CURL
// ============================================================================

/*
// 1. Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.in",
    "password": "password123"
  }'

// Response contains:
// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
//   "refreshToken": "...",
//   "user": { ... }
// }

// 2. Use token to access protected endpoint
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

// 3. Refresh token when expired
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'

// 4. Logout (blacklist token)
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
*/

// ============================================================================
// 7. ROLE HIERARCHY
// ============================================================================

/**
 * Role Hierarchy and Typical Use Cases:
 *
 * ADMIN:
 *   - Full system access
 *   - Can register new users
 *   - Can access all endpoints
 *   - Typical user: System administrator, Hospital admin
 *
 * DOCTOR:
 *   - Can create/edit prescriptions
 *   - Can create/edit patient records
 *   - Can view/edit encounters
 *   - Can order lab tests
 *   - Typical user: Physicians, Specialists
 *
 * NURSE:
 *   - Can view/edit patient records
 *   - Can record observations (vitals, etc.)
 *   - Can view prescriptions
 *   - Typical user: Registered nurses, Nurse practitioners
 *
 * LAB_TECH:
 *   - Can create/update lab results
 *   - Can view lab orders
 *   - Typical user: Laboratory technicians
 *
 * PHARMACIST:
 *   - Can view prescriptions
 *   - Can manage medication inventory
 *   - Typical user: Pharmacy staff
 *
 * BILLING:
 *   - Can create/manage bills
 *   - Can process payments
 *   - Typical user: Billing department staff
 *
 * RECEPTIONIST:
 *   - Can register patients
 *   - Can schedule appointments
 *   - Can create basic records
 *   - Typical user: Front desk staff
 */

// ============================================================================
// 8. BEST PRACTICES
// ============================================================================

/**
 * BEST PRACTICES FOR USING THE AUTH SYSTEM:
 *
 * 1. Always use HTTPS in production
 * 2. Never log or expose tokens
 * 3. Store tokens securely on client (httpOnly cookies recommended)
 * 4. Implement token refresh before expiration
 * 5. Always validate user roles on backend (never trust client)
 * 6. Use principle of least privilege (minimum required roles)
 * 7. Implement rate limiting on auth endpoints
 * 8. Monitor failed login attempts
 * 9. Rotate JWT secrets regularly
 * 10. Use environment variables for secrets
 */

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

/**
 * Common authentication errors and how to handle them:
 *
 * 401 Unauthorized:
 *   - Token missing or invalid
 *   - Token expired
 *   - Token blacklisted (after logout)
 *   Solution: Re-authenticate or use refresh token
 *
 * 403 Forbidden:
 *   - Valid token but insufficient permissions (wrong role)
 *   - User doesn't have required role for endpoint
 *   Solution: Check role requirements, contact admin for access
 *
 * 400 Bad Request:
 *   - Invalid credentials during login
 *   - Malformed request body
 *   Solution: Check request format and credentials
 */

// ============================================================================
// 10. EXTENDING THE SYSTEM
// ============================================================================

/**
 * How to add new features:
 *
 * 1. Adding a new role:
 *    - Update Prisma schema (UserRole enum)
 *    - Run migration: npx prisma migrate dev
 *    - Update AUTH_DOCUMENTATION.md
 *
 * 2. Adding new permissions:
 *    - Create custom decorators similar to @Roles()
 *    - Create custom guards for complex permission logic
 *    - Combine with existing guards using @UseGuards()
 *
 * 3. Implementing OAuth2:
 *    - Update MockSSOService with real OAuth2 implementation
 *    - Add passport strategies (e.g., passport-google-oauth20)
 *    - Configure provider credentials in .env
 *    - Update SSO endpoints in auth.controller.ts
 *
 * 4. Adding audit logging:
 *    - Create audit interceptor
 *    - Log authentication events (login, logout, register)
 *    - Store in AuditLog model (already in schema)
 */

export {};
