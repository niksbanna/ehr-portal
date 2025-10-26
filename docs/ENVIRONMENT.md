# Environment Configuration Guide

This document describes all environment variables used in the EHR Portal application.

## Overview

The application uses environment variables for configuration. These are loaded through Vite's environment variable system, which requires variables to be prefixed with `VITE_`.

## Configuration Files

- `.env.example` - Template with all available variables (committed to git)
- `.env` - Local configuration (not committed to git, create from .env.example)
- `.env.production` - Production-specific overrides (optional)

## Environment Variables

### Application Configuration

| Variable           | Description              | Default           | Required |
| ------------------ | ------------------------ | ----------------- | -------- |
| `VITE_APP_NAME`    | Application display name | `EHR Portal`      | No       |
| `VITE_APP_VERSION` | Application version      | From package.json | No       |

### API Configuration

| Variable            | Description                | Default                     | Required |
| ------------------- | -------------------------- | --------------------------- | -------- |
| `VITE_API_BASE_URL` | Base URL for API calls     | `http://localhost:3000/api` | Yes      |
| `VITE_API_TIMEOUT`  | API request timeout in ms  | `30000`                     | No       |
| `VITE_ENABLE_MSW`   | Enable Mock Service Worker | `true`                      | No       |

**Example:**

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_TIMEOUT=60000
VITE_ENABLE_MSW=false
```

### Authentication

| Variable                    | Description                      | Default            | Required |
| --------------------------- | -------------------------------- | ------------------ | -------- |
| `VITE_AUTH_TOKEN_KEY`       | Local storage key for auth token | `ehr_auth_token`   | No       |
| `VITE_AUTH_SESSION_TIMEOUT` | Session timeout in ms            | `3600000` (1 hour) | No       |

### FHIR Configuration

| Variable               | Description                | Default | Required             |
| ---------------------- | -------------------------- | ------- | -------------------- |
| `VITE_FHIR_SERVER_URL` | FHIR server endpoint       | -       | When using real FHIR |
| `VITE_FHIR_VERSION`    | FHIR specification version | `4.0.1` | No                   |

**Example:**

```bash
VITE_FHIR_SERVER_URL=https://hapi.fhir.org/baseR4
VITE_FHIR_VERSION=4.0.1
```

### Feature Flags

| Variable                   | Description                         | Default | Required |
| -------------------------- | ----------------------------------- | ------- | -------- |
| `VITE_ENABLE_PWA`          | Enable Progressive Web App features | `true`  | No       |
| `VITE_ENABLE_ANALYTICS`    | Enable analytics tracking           | `false` | No       |
| `VITE_ENABLE_OFFLINE_MODE` | Enable offline functionality        | `true`  | No       |

### Internationalization

| Variable                   | Description                                 | Default | Required |
| -------------------------- | ------------------------------------------- | ------- | -------- |
| `VITE_DEFAULT_LANGUAGE`    | Default application language                | `en`    | No       |
| `VITE_SUPPORTED_LANGUAGES` | Comma-separated list of supported languages | `en,hi` | No       |

### Theme

| Variable             | Description                | Default | Required |
| -------------------- | -------------------------- | ------- | -------- |
| `VITE_DEFAULT_THEME` | Default theme (light/dark) | `light` | No       |

### Logging and Monitoring

| Variable                | Description                              | Default | Required |
| ----------------------- | ---------------------------------------- | ------- | -------- |
| `VITE_LOG_LEVEL`        | Logging level (debug, info, warn, error) | `info`  | No       |
| `VITE_ENABLE_AUDIT_LOG` | Enable audit logging                     | `true`  | No       |

### Analytics (Optional)

| Variable                  | Description                   | Default | Required |
| ------------------------- | ----------------------------- | ------- | -------- |
| `VITE_GA_TRACKING_ID`     | Google Analytics tracking ID  | -       | No       |
| `VITE_SENTRY_DSN`         | Sentry DSN for error tracking | -       | No       |
| `VITE_SENTRY_ENVIRONMENT` | Sentry environment name       | -       | No       |

**Example:**

```bash
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
VITE_SENTRY_ENVIRONMENT=production
```

### Security

| Variable              | Description                       | Default | Required        |
| --------------------- | --------------------------------- | ------- | --------------- |
| `VITE_ENCRYPTION_KEY` | Encryption key for sensitive data | -       | Production only |
| `VITE_CSP_ENABLED`    | Enable Content Security Policy    | `true`  | No              |

⚠️ **Warning:** Never commit actual secrets or encryption keys to version control.

### Build Configuration

| Variable               | Description                       | Default | Required |
| ---------------------- | --------------------------------- | ------- | -------- |
| `VITE_BUILD_SOURCEMAP` | Generate sourcemaps in production | `false` | No       |
| `VITE_BUILD_ANALYZE`   | Enable bundle analysis            | `false` | No       |

### Performance

| Variable                             | Description                   | Default | Required |
| ------------------------------------ | ----------------------------- | ------- | -------- |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance monitoring | `true`  | No       |

## Environment-Specific Configuration

### Development (.env)

```bash
VITE_ENABLE_MSW=true
VITE_LOG_LEVEL=debug
VITE_BUILD_SOURCEMAP=true
```

### Production (.env.production)

```bash
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=https://api.production.com
VITE_LOG_LEVEL=error
VITE_BUILD_SOURCEMAP=false
VITE_ENABLE_ANALYTICS=true
```

## Accessing Environment Variables in Code

Environment variables can be accessed in the application using `import.meta.env`:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const enableMSW = import.meta.env.VITE_ENABLE_MSW === 'true';
```

## Security Best Practices

1. **Never commit `.env` files** containing sensitive data to version control
2. **Use different keys** for each environment (dev, staging, production)
3. **Rotate secrets regularly** in production environments
4. **Limit access** to environment variables in production
5. **Use environment variable validation** at application startup

## Validation

Add environment variable validation in your application startup:

```typescript
const requiredEnvVars = ['VITE_API_BASE_URL'];

requiredEnvVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## Docker Configuration

When using Docker, pass environment variables using:

1. Docker Compose:

```yaml
services:
  ehr-portal:
    environment:
      - VITE_API_BASE_URL=https://api.example.com
```

2. Docker run:

```bash
docker run -e VITE_API_BASE_URL=https://api.example.com ehr-portal
```

## Troubleshooting

### Variables Not Loading

1. Ensure variables are prefixed with `VITE_`
2. Restart the development server after changing `.env`
3. Check for syntax errors in `.env` file

### Production Build Issues

1. Verify `.env.production` exists and is properly configured
2. Ensure sensitive data is not exposed in the client bundle
3. Check build logs for warnings about missing variables
