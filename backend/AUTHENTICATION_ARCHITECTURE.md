# Authentication System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EHR Portal Backend                          │
│                     JWT Authentication System                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATION                            │
│  (Frontend: React, Mobile App, or Third-party Integration)           │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS Request
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         AUTH CONTROLLER                               │
│  POST /auth/login                                                     │
│  POST /auth/register (Admin Only)                                    │
│  POST /auth/refresh                                                   │
│  POST /auth/logout                                                    │
│  GET  /auth/me                                                        │
│  GET  /auth/sso/:provider (OAuth2 Placeholder)                       │
│  POST /auth/sso/callback (OAuth2 Placeholder)                        │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         AUTH SERVICE                                  │
│  • validateUser()                                                     │
│  • login()                                                            │
│  • register()                                                         │
│  • refreshToken()                                                     │
│  • logout()                                                           │
│  • getProfile()                                                       │
└──────────────────────────────────────────────────────────────────────┘
         │                          │                        │
         │                          │                        │
         ▼                          ▼                        ▼
┌──────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ USER REPOSITORY  │  │ JWT SERVICE          │  │ BCRYPT               │
│ • findByEmail()  │  │ • sign()             │  │ • hash()             │
│ • findOne()      │  │ • verify()           │  │ • compare()          │
│ • create()       │  │ • decode()           │  │                      │
└──────────────────┘  └──────────────────────┘  └──────────────────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐  ┌──────────────────────────────────────────┐
│ PRISMA CLIENT    │  │ TOKEN BLACKLIST SERVICE                  │
│ PostgreSQL DB    │  │ • addToBlacklist()                       │
│                  │  │ • isBlacklisted()                        │
│ Users Table      │  │ • cleanupExpiredTokens()                 │
└──────────────────┘  └──────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────┐
│                         PROTECTED ENDPOINTS                           │
│  (Patients, Billing, Prescriptions, Labs, etc.)                      │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
              ┌─────────────────┐   ┌─────────────────┐
              │ JWT AUTH GUARD  │   │  ROLES GUARD    │
              │                 │   │                 │
              │ • Extract token │   │ • Check roles   │
              │ • Verify token  │   │ • Allow/Deny    │
              │ • Check blacklist│   │                 │
              └─────────────────┘   └─────────────────┘
                         │                     │
                         └──────────┬──────────┘
                                    ▼
                           ┌─────────────────┐
                           │ PASSPORT JWT    │
                           │ STRATEGY        │
                           │                 │
                           │ • Validate      │
                           │ • Attach user   │
                           └─────────────────┘
```

## Authentication Flow

### 1. Login Flow
```
User/Client
    │
    │ 1. POST /auth/login
    │    { email, password }
    ▼
AuthController
    │
    │ 2. Call AuthService.login()
    ▼
AuthService
    │
    │ 3. validateUser(email, password)
    ▼
UserRepository
    │
    │ 4. findByEmail(email)
    ▼
Database
    │
    │ 5. Return user data
    ▼
AuthService
    │
    │ 6. bcrypt.compare(password, hashedPassword)
    ▼
bcrypt
    │
    │ 7. Password valid
    ▼
AuthService
    │
    │ 8. Generate JWT token
    │    jwtService.sign({ email, sub: id, role })
    │
    │ 9. Generate refresh token
    │    jwtService.sign(..., refreshSecret, 7d)
    ▼
Client
    │
    │ 10. Receive tokens + user data
    │     Store tokens securely
    └─────────────────────────────────────
```

### 2. Protected Endpoint Access Flow
```
Client
    │
    │ 1. GET /patients
    │    Authorization: Bearer <token>
    ▼
JwtAuthGuard
    │
    │ 2. Extract token from header
    ▼
JwtStrategy
    │
    │ 3. Verify token signature
    │    jwtService.verify(token)
    ▼
TokenBlacklistService
    │
    │ 4. Check if token is blacklisted
    │    isBlacklisted(token)
    │
    │ 5. Token valid and not blacklisted
    ▼
JwtStrategy
    │
    │ 6. Decode token payload
    │    { userId, email, role }
    │
    │ 7. Attach user to request
    ▼
RolesGuard (if applied)
    │
    │ 8. Check user role against @Roles()
    │    requiredRoles.includes(user.role)
    │
    │ 9. Role matches
    ▼
Controller/Handler
    │
    │ 10. Execute business logic
    │     Access req.user for user info
    ▼
Client
    │
    │ 11. Receive response
    └─────────────────────────────────────
```

### 3. Logout Flow
```
Client
    │
    │ 1. POST /auth/logout
    │    Authorization: Bearer <token>
    ▼
AuthController
    │
    │ 2. Extract token from header
    ▼
AuthService
    │
    │ 3. Decode token to get expiry
    │    jwtService.decode(token)
    ▼
TokenBlacklistService
    │
    │ 4. Add token to blacklist
    │    addToBlacklist(token, expiryTime)
    │
    │ 5. Schedule cleanup after expiry
    ▼
Client
    │
    │ 6. Receive success message
    │    Token is now invalid
    │    Remove token from storage
    └─────────────────────────────────────
```

### 4. Register Flow (Admin Only)
```
Admin Client
    │
    │ 1. POST /auth/register
    │    Authorization: Bearer <admin-token>
    │    { email, password, name, role }
    ▼
JwtAuthGuard
    │
    │ 2. Verify admin token
    ▼
RolesGuard
    │
    │ 3. Check if user has ADMIN role
    │    @Roles(UserRole.ADMIN)
    │
    │ 4. Admin role confirmed
    ▼
AuthController
    │
    │ 5. Call AuthService.register()
    ▼
AuthService
    │
    │ 6. Hash password
    │    bcrypt.hash(password, 10)
    ▼
UserRepository
    │
    │ 7. Create user in database
    │    prisma.user.create({ ... })
    ▼
Database
    │
    │ 8. User created
    ▼
Client
    │
    │ 9. Receive new user data
    │    (password excluded)
    └─────────────────────────────────────
```

## Role-Based Access Control

### Role Hierarchy
```
┌─────────────────────────────────────────────────────────────┐
│                        ADMIN                                 │
│  • Full system access                                        │
│  • Can register new users                                    │
│  • Can access all endpoints                                  │
└─────────────────────────────────────────────────────────────┘
        │
        ├──┬──┬──┬──┬──┐
        │  │  │  │  │  │
        ▼  ▼  ▼  ▼  ▼  ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐
│ DOCTOR │ │ NURSE  │ │LAB_TECH │ │PHARMACIST│ │ BILLING │ │RECEPTION │
├────────┤ ├────────┤ ├─────────┤ ├──────────┤ ├─────────┤ ├──────────┤
│• Rx    │ │• Obs   │ │• Labs   │ │• View Rx │ │• Bills  │ │• Patients│
│• Diag  │ │• Vitals│ │• Results│ │• Meds    │ │• Payment│ │• Schedule│
└────────┘ └────────┘ └─────────┘ └──────────┘ └─────────┘ └──────────┘
```

### Access Matrix

| Endpoint              | ADMIN | DOCTOR | NURSE | LAB_TECH | PHARMACIST | BILLING | RECEPTION |
|-----------------------|-------|--------|-------|----------|------------|---------|-----------|
| Register User         | ✅    | ❌     | ❌    | ❌       | ❌         | ❌      | ❌        |
| Create Patient        | ✅    | ✅     | ✅    | ❌       | ❌         | ❌      | ✅        |
| View Patient          | ✅    | ✅     | ✅    | ✅       | ✅         | ✅      | ✅        |
| Create Prescription   | ✅    | ✅     | ❌    | ❌       | ❌         | ❌      | ❌        |
| View Prescription     | ✅    | ✅     | ✅    | ❌       | ✅         | ❌      | ❌        |
| Create Lab Result     | ✅    | ✅     | ❌    | ✅       | ❌         | ❌      | ❌        |
| View Lab Result       | ✅    | ✅     | ✅    | ✅       | ❌         | ❌      | ❌        |
| Create Bill           | ✅    | ❌     | ❌    | ❌       | ❌         | ✅      | ✅        |
| View Bill             | ✅    | ✅     | ❌    | ❌       | ❌         | ✅      | ✅        |

## Token Structure

### Access Token (JWT)
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "email": "doctor@hospital.in",
    "sub": "uuid-user-id",
    "role": "DOCTOR",
    "iat": 1234567890,
    "exp": 1234654290
  },
  "signature": "..."
}
```

**Expiration**: 1 day (configurable via JWT_EXPIRATION)

### Refresh Token (JWT)
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "email": "doctor@hospital.in",
    "sub": "uuid-user-id",
    "role": "DOCTOR",
    "iat": 1234567890,
    "exp": 1235172690
  },
  "signature": "..."
}
```

**Expiration**: 7 days (configurable via JWT_REFRESH_EXPIRATION)

## Security Layers

```
┌─────────────────────────────────────────────┐
│         Layer 1: HTTPS/TLS                  │
│  • Encrypted transport                      │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Layer 2: JWT Validation             │
│  • Signature verification                   │
│  • Expiration check                         │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Layer 3: Token Blacklist            │
│  • Check if token revoked                   │
│  • Prevent logout token reuse               │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Layer 4: Role Authorization         │
│  • Verify user role                         │
│  • Match against @Roles()                   │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Layer 5: Business Logic             │
│  • Execute authorized request               │
└─────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Client  │◄────►│   Auth   │◄────►│  Token   │◄────►│  Redis   │
│          │      │ Service  │      │ Blacklist│      │  (Future)│
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                       │
                       │
                       ▼
                  ┌──────────┐
                  │   User   │
                  │Repository│
                  └──────────┘
                       │
                       ▼
                  ┌──────────┐
                  │ Prisma   │
                  │ Client   │
                  └──────────┘
                       │
                       ▼
                  ┌──────────┐
                  │PostgreSQL│
                  │ Database │
                  └──────────┘
```

## File Organization

```
backend/src/modules/auth/
│
├── controllers/
│   └── auth.controller.ts          # HTTP endpoints
│
├── services/
│   ├── auth.service.ts              # Core auth logic
│   ├── token-blacklist.service.ts   # Token revocation
│   └── mock-sso.service.ts          # OAuth2 placeholder
│
├── guards/
│   ├── jwt-auth.guard.ts            # JWT validation
│   ├── roles.guard.ts               # Role checking
│   └── index.ts                     # Exports
│
├── decorators/
│   ├── roles.decorator.ts           # @Roles() decorator
│   └── index.ts                     # Exports
│
├── strategies/
│   ├── jwt.strategy.ts              # JWT passport strategy
│   └── local.strategy.ts            # Local passport strategy
│
├── repositories/
│   └── user.repository.ts           # Database operations
│
├── dto/
│   └── auth.dto.ts                  # Data transfer objects
│
├── entities/
│   └── user.entity.ts               # User entity
│
├── auth.module.ts                   # Module definition
├── USAGE_EXAMPLES.ts                # Code examples
└── README.md                        # Documentation
```

## Future Enhancements

### OAuth2/SSO Integration
```
┌──────────────┐
│   Client     │
└──────────────┘
       │
       │ 1. Initiate SSO
       ▼
┌──────────────┐
│ Auth Service │
└──────────────┘
       │
       │ 2. Redirect to provider
       ▼
┌──────────────┐
│   Google/    │
│   Azure AD/  │
│   Okta       │
└──────────────┘
       │
       │ 3. User authenticates
       │ 4. Callback with code
       ▼
┌──────────────┐
│ Auth Service │
└──────────────┘
       │
       │ 5. Exchange code for token
       │ 6. Get user profile
       │ 7. Create/sync local user
       │ 8. Generate JWT tokens
       ▼
┌──────────────┐
│   Client     │
└──────────────┘
```

### Redis Integration for Token Blacklist
```
┌──────────────┐
│ Auth Service │
└──────────────┘
       │
       │ Logout request
       ▼
┌──────────────┐
│    Redis     │
│   Blacklist  │
│              │
│ SET token    │
│ EXPIRE 1d    │
└──────────────┘
       │
       │ Auth check
       ▼
┌──────────────┐
│ JWT Strategy │
└──────────────┘
       │
       │ Check blacklist
       ▼
┌──────────────┐
│    Redis     │
│   EXISTS     │
└──────────────┘
```

## Performance Considerations

1. **Token Blacklist**: In-memory (current) → Redis (production)
2. **Database Queries**: Indexed email field for fast lookups
3. **Password Hashing**: bcrypt with 10 rounds (balanced)
4. **Token Expiration**: Short-lived access tokens (1d)
5. **Caching**: Consider caching user data with Redis

## Monitoring & Logging

### Events to Log
- ✅ User login attempts (success/failure)
- ✅ Token refresh requests
- ✅ Logout events
- ✅ User registration (admin actions)
- ✅ Failed authorization attempts
- ✅ Token blacklist operations

### Metrics to Track
- Login success rate
- Token refresh frequency
- Average session duration
- Failed authentication attempts
- Role-based access patterns
- Token blacklist size

## Conclusion

This authentication system provides:
- ✅ Secure, industry-standard JWT authentication
- ✅ Fine-grained role-based access control
- ✅ Token revocation capability
- ✅ Future-ready OAuth2 integration
- ✅ Comprehensive documentation
- ✅ Production-ready architecture

Ready for deployment with recommended enhancements for scale! 🚀
