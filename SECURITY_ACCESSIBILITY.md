# Security and Accessibility Implementation

This document outlines the security and accessibility features implemented in the EHR Portal application.

## Security Features

### 1. Content Security Policy (CSP)

A CSP meta tag has been added to `index.html` to prevent XSS attacks:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
/>
```

**Key protections:**

- Only allows scripts, styles, and resources from the same origin
- Prevents clickjacking with `frame-ancestors 'none'`
- Restricts form submissions to same origin

### 2. Secure Token Handling

**Location:** `src/hooks/useAuth.tsx`

**Current Implementation:**

- Tokens are currently stored in localStorage for demonstration purposes
- Comprehensive TODO comments outline production requirements

**Production TODO:**

```typescript
/**
 * TODO: Replace localStorage with HttpOnly cookies for production
 * HttpOnly cookies prevent XSS attacks by making tokens inaccessible to JavaScript
 *
 * Production implementation should:
 * 1. Set tokens in HttpOnly cookies on the server
 * 2. Use SameSite=Strict for CSRF protection
 * 3. Set Secure flag to ensure HTTPS-only transmission
 * 4. Implement token rotation and short expiration times
 */
```

**Features:**

- Abstracted token storage through `TokenStorage` utility
- Easy to swap implementation for production
- Audit logging on login/logout events

### 3. Text Sanitization

**Location:** `src/utils/sanitize.ts`

**Functions:**

- `sanitizeHtml()`: Escapes HTML special characters
- `sanitizeText()`: Removes HTML tags and escapes content
- `sanitizeRichText()`: Sanitizes rich text while preserving basic formatting
  - Removes `<script>` tags
  - Removes event handlers (onclick, onload, etc.)
  - Removes dangerous protocols (javascript:, data:)
  - Removes dangerous tags (iframe, object, embed)
- `sanitizeUrl()`: Validates and sanitizes URLs

**Usage:**

```typescript
import { sanitizeRichText } from '../utils/sanitize';

// Sanitize SOAP notes before saving
encounterData.soapNotes = {
  subjective: sanitizeRichText(encounterData.soapNotes.subjective),
  objective: sanitizeRichText(encounterData.soapNotes.objective),
  assessment: sanitizeRichText(encounterData.soapNotes.assessment),
  plan: sanitizeRichText(encounterData.soapNotes.plan),
};
```

### 4. Aadhaar Masking

**Location:** `src/schemas/fhir.schema.ts`

**Implementation:**

```typescript
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
}
```

**Usage:** All UI components displaying patient data use the `maskAadhaar()` function to protect sensitive Aadhaar numbers:

- PatientsPage table view
- Patient charts and reports
- All patient detail views

### 5. Audit Logging

**Location:** `src/services/auditLogger.ts`

**Features:**

- Logs all critical operations with metadata:
  - `userId`: User performing the action
  - `userName`: Name of the user
  - `userRole`: Role of the user (for access control auditing)
  - `action`: Type of action (Created, Updated, Deleted, Viewed, Login, Logout)
  - `resource`: Resource type (Patient, Encounter, etc.)
  - `resourceId`: ID of the affected resource
  - `timestamp`: ISO timestamp
  - `ipAddress`: Client IP (placeholder for production)
  - `details`: Additional context

**Logged Events:**

- User authentication (login/logout)
- Patient CRUD operations
- Encounter creation
- Other sensitive data access

**Example:**

```typescript
await logAuditEvent({
  userId: user.id,
  userName: user.name,
  userRole: user.role,
  action: 'Created',
  resource: 'Patient',
  resourceId: newPatient.id,
  details: `Created patient record for ${newPatient.firstName} ${newPatient.lastName}`,
});
```

**Production TODO:** Currently stores in localStorage. In production, should send to backend API endpoint.

### 6. Role-Based Access Control (RBAC)

**Locations:**

- `src/utils/permissions.ts`: Permission definitions
- `src/App.tsx`: Route guards
- `src/components/common/RoleBasedVisibility.tsx`: Component-level visibility

**Features:**

#### Route Guards

Every route checks both authentication AND role permissions:

```typescript
function PrivateRoute({ children, path }: { children: React.ReactNode; path?: string }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role-based access
  if (path && user && !canAccessRoute(user.role, path)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
```

#### Data Visibility Restrictions

Components for restricting sensitive data based on role:

```typescript
// Restrict entire sections
<RestrictedData allowedRoles={['admin', 'doctor']}>
  <SensitivePatientInfo />
</RestrictedData>

// Restrict specific fields
<SensitiveField
  value={patient.aadhaar}
  fieldType="aadhaar"
  allowedRoles={['admin', 'doctor']}
/>

// Role-restricted buttons
<RoleRestrictedButton
  requiredRoles={['admin', 'doctor']}
  onClick={handleEdit}
>
  Edit Patient
</RoleRestrictedButton>
```

## Accessibility Features (WCAG 2.1 AA Compliance)

### 1. ARIA Labels and Roles

**Implementation across all interactive elements:**

```tsx
// Buttons with descriptive labels
<button
  onClick={handleEdit}
  aria-label={`Edit patient ${patient.firstName} ${patient.lastName}`}
  className="..."
>
  <Edit size={18} aria-hidden="true" />
</button>

// Tables with proper structure
<table role="table" aria-label="Patient registry table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">DOB</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>

// Modals/Dialogs
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="patient-modal-title"
>
  <h2 id="patient-modal-title">Add New Patient</h2>
  ...
</div>

// Alerts and notifications
<div role="alert" aria-live="polite">
  Warning: Duplicate patient detected
</div>
```

### 2. Focus Management

**Location:** `src/utils/accessibility.ts`

**FocusTrap Class:**

- Traps keyboard focus within modals/dialogs
- Prevents tabbing outside modal
- Restores focus on close
- Supports Shift+Tab for reverse navigation

**Usage:**

```typescript
const focusTrap = new FocusTrap(modalElement);
focusTrap.activate();
// ... modal is open
focusTrap.deactivate(); // restores focus
```

### 3. Keyboard Navigation

**Features:**

- All interactive elements are keyboard accessible
- Focus indicators with ring styles:
  ```css
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  ```
- Tab order follows visual layout
- Skip to main content (via Layout component)

### 4. Form Validation and Error Messaging

**Accessible form patterns:**

```tsx
<input
  id="email"
  type="email"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>;
{
  errors.email && (
    <p id="email-error" role="alert">
      {errors.email.message}
    </p>
  );
}
```

### 5. Color Contrast

**Utilities:** `src/utils/accessibility.ts` includes:

- `meetsContrastRequirements()`: Check WCAG contrast ratios
- `getContrastRatio()`: Calculate contrast between colors
- Supports both AA and AAA levels

**Application:**

- Primary buttons: Blue 600 (#2563eb) on white meets AA
- Text: Gray 900 (#111827) on white meets AAA
- Dark mode: Automatically adjusted for contrast

### 6. Screen Reader Support

**Features:**

- Semantic HTML structure (header, nav, main, section)
- Alternative text for icons (`aria-hidden="true"` on decorative icons)
- Live regions for dynamic content updates
- Descriptive link text and button labels

**Utility Functions:**

```typescript
// Announce to screen readers
announceToScreenReader('Patient saved successfully', 'polite');

// Generate unique IDs for ARIA relationships
const headingId = generateId('modal-heading');
```

### 7. Loading States and Async Operations

**Accessible loading indicators:**

```tsx
<button
  disabled={loading}
  aria-busy={loading}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## Testing

### Unit Tests

**Sanitization Tests:** `src/test/sanitize.test.ts`

- Tests for HTML escaping
- Script tag removal
- Event handler removal
- URL validation

**Audit Logger Tests:** `src/test/auditLogger.test.ts`

- Event logging verification
- Role tracking in audit logs
- Timestamp validation
- Unique ID generation

**Run tests:**

```bash
npm run test:run
```

### Manual Accessibility Testing

**Tools to use:**

1. **Screen readers:**
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS)

2. **Browser extensions:**
   - axe DevTools
   - WAVE
   - Lighthouse (Chrome DevTools)

3. **Keyboard-only navigation:**
   - Test all functionality without a mouse
   - Verify tab order
   - Check focus indicators

## Production Deployment Checklist

- [ ] Replace localStorage token storage with HttpOnly cookies
- [ ] Implement server-side IP tracking for audit logs
- [ ] Send audit logs to backend API instead of localStorage
- [ ] Configure proper CSP headers at server level
- [ ] Enable HTTPS with HSTS headers
- [ ] Implement rate limiting for API endpoints
- [ ] Set up session timeout and token refresh
- [ ] Configure CORS properly
- [ ] Add request signing/HMAC for API calls
- [ ] Implement proper error handling without exposing sensitive info
- [ ] Add security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Run security audit tools (OWASP ZAP, Burp Suite)
- [ ] Perform penetration testing
- [ ] Set up monitoring for security events
- [ ] Document incident response procedures

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
