# Backend Performance Enhancements Documentation

This document describes the performance enhancements implemented in the EHR Portal backend.

## Overview

The following enhancements have been implemented:
1. **Caching with Redis/In-memory fallback** for frequent reads (ICD-10 codes, drug lists, departments)
2. **Pagination** for heavy queries (already implemented, verified)
3. **Background queue (BullMQ)** for lab report generation simulation
4. **Enhanced error handling** middleware with consistent JSON output and proper HTTP codes

## 1. Caching Implementation

### Architecture

The caching system is implemented with a **graceful fallback strategy**:
- **Primary**: Redis cache for production environments
- **Fallback**: In-memory cache when Redis is unavailable

### Files Added/Modified

- `src/common/cache/cache.module.ts` - Global cache module with Redis/in-memory fallback
- `src/modules/settings/settings.service.ts` - Enhanced with caching for categories and keys
- `src/modules/settings/settings.controller.ts` - Added specialized endpoints

### Configuration

Environment variables in `.env`:
```bash
# Redis Configuration (optional - falls back to in-memory if not available)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache Configuration
CACHE_TTL=3600  # Time-to-live in seconds (1 hour)
CACHE_MAX=100   # Maximum number of cached items
```

### Cached Endpoints

The following data is cached automatically:

1. **ICD-10 Codes**: `GET /api/settings/icd-codes`
2. **Departments**: `GET /api/settings/departments`
3. **Drug List**: `GET /api/settings/drugs`
4. **Settings by Category**: `GET /api/settings/category/:category`
5. **Settings by Key**: `GET /api/settings/key/:key`

### Cache Invalidation

Cache is automatically invalidated when:
- A setting is created (`POST /api/settings`)
- A setting is updated (`PUT /api/settings/:id`)
- A setting is deleted (`DELETE /api/settings/:id`)

### Usage Example

```typescript
// The service automatically handles caching
// First request - fetches from database and caches
const icdCodes = await settingsService.findByCategory('icd-10-codes');

// Subsequent requests - served from cache (within TTL)
const icdCodes2 = await settingsService.findByCategory('icd-10-codes');
```

## 2. Pagination

### Implementation Status

Pagination is **already implemented** in all major modules:

- ✅ **Labs Module**: `GET /api/labs?page=1&limit=10`
- ✅ **Prescriptions Module**: `GET /api/prescriptions?page=1&limit=10`
- ✅ **Patients Module**: Implemented in repository layer
- ✅ **Encounters Module**: Implemented in repository layer
- ✅ **Settings Module**: `GET /api/settings?page=1&limit=10`

### Pagination Parameters

All paginated endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Field to sort by (varies by module)
- `order` - Sort order: `asc` or `desc`

### Response Format

```json
{
  "data": [...],
  "meta": {
    "timestamp": "2025-10-27T06:28:57.626Z",
    "version": "1.0",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 3. Background Queue (BullMQ)

### Architecture

Lab report generation is processed asynchronously using BullMQ:
- Jobs are queued when lab results are created or completed
- Processing happens in the background
- Graceful fallback if Redis is unavailable

### Files Added/Modified

- `src/common/queue/queue.module.ts` - Queue configuration module
- `src/modules/labs/processors/lab-report.processor.ts` - Lab report processor
- `src/modules/labs/labs.module.ts` - Integrated queue
- `src/modules/labs/labs.service.ts` - Queue job creation

### Queue Configuration

The queue uses Redis connection with the following settings:
- **Retry Strategy**: 3 attempts with exponential backoff
- **Initial Delay**: 5 seconds
- **Queue Name**: `lab-reports`
- **Job Type**: `generate-report`

### When Jobs Are Queued

1. **On Lab Result Creation**: When `POST /api/labs` is called
2. **On Status Update to COMPLETED**: When `PATCH /api/labs/:id` sets status to COMPLETED

### Job Processing

The processor simulates real-world report generation:
- Simulated processing time: 2-5 seconds
- Logs progress for monitoring
- In production, would:
  - Generate PDF report
  - Store in cloud storage (S3, Azure Blob)
  - Update database with report URL
  - Send notifications to doctors/patients

### Graceful Degradation

If Redis is not available:
- The application continues to work
- Jobs are not queued (logged as warning)
- Manual report generation can be triggered later

## 4. Enhanced Error Handling

### Architecture

The global exception filter provides consistent error responses across all endpoints.

### Files Modified

- `src/common/filters/http-exception.filter.ts` - Enhanced error handling

### Features

1. **Consistent JSON Error Format**
   ```json
   {
     "statusCode": 404,
     "message": "Lab result with ID abc123 not found",
     "error": "Not Found",
     "path": "/api/labs/abc123",
     "timestamp": "2025-10-27T06:28:57.626Z"
   }
   ```

2. **Proper HTTP Status Codes**
   - `400 Bad Request` - Validation errors, invalid IDs
   - `401 Unauthorized` - Authentication failures
   - `404 Not Found` - Resource not found
   - `409 Conflict` - Unique constraint violations
   - `500 Internal Server Error` - Server errors

3. **Prisma Error Mapping**
   - `P2002` → `409 Conflict` (Unique constraint violation)
   - `P2025` → `404 Not Found` (Record not found)
   - `P2003` → `400 Bad Request` (Foreign key violation)
   - `P2014` → `400 Bad Request` (Invalid ID)

4. **Enhanced Logging**
   - Error logs for 5xx errors (with stack traces)
   - Warning logs for 4xx errors
   - Request context included in logs

### Error Types Handled

- HTTP Exceptions (NestJS)
- Prisma Database Errors
- Validation Errors
- JWT Authentication Errors
- General Errors

## Testing

### Manual Testing

1. **Test Caching (without Redis)**:
   ```bash
   # Start the server
   npm run start:dev
   
   # Make first request (cache miss)
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/settings/icd-codes
   
   # Make second request (cache hit - faster)
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/settings/icd-codes
   ```

2. **Test Pagination**:
   ```bash
   curl -H "Authorization: Bearer <token>" "http://localhost:3000/api/labs?page=1&limit=5"
   ```

3. **Test Queue** (check logs):
   ```bash
   # Create a lab result
   curl -X POST -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"patientId":"...", "testName":"Blood Test", ...}' \
     http://localhost:3000/api/labs
   
   # Check logs for queue processing messages
   ```

4. **Test Error Handling**:
   ```bash
   # Test 404 error
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/labs/invalid-id
   
   # Test validation error
   curl -X POST -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{}' \
     http://localhost:3000/api/labs
   ```

### With Redis

To test with Redis running:

```bash
# Start Redis using Docker
docker run -d -p 6379:6379 redis:alpine

# Or use docker-compose if available
docker-compose up -d redis
```

## Performance Benefits

### Caching
- **Reduced Database Load**: Frequent reads served from cache
- **Faster Response Times**: In-memory/Redis much faster than database
- **Scalability**: Can handle more concurrent requests

### Pagination
- **Memory Efficiency**: Only requested page loaded into memory
- **Network Efficiency**: Smaller payloads transmitted
- **Client Performance**: Easier to render smaller datasets

### Background Queue
- **Improved Response Times**: API responds immediately, processing happens async
- **Resource Management**: Heavy operations don't block API requests
- **Retry Mechanism**: Automatic retry on failures
- **Scalability**: Can add multiple workers to process jobs

### Enhanced Error Handling
- **Better Debugging**: Consistent error format with context
- **Client Experience**: Proper HTTP codes enable better error handling
- **Monitoring**: Structured logging for error tracking

## Production Considerations

1. **Redis Setup**: Use Redis Cluster or Redis Sentinel for high availability
2. **Cache TTL**: Adjust based on data update frequency
3. **Queue Workers**: Scale workers based on job volume
4. **Monitoring**: Set up alerts for queue failures and cache hit rates
5. **Error Tracking**: Integrate with Sentry or similar services

## Migration Notes

No database migrations required - all changes are backward compatible.

## Security Considerations

- All endpoints maintain existing authentication/authorization
- Cache doesn't expose sensitive data outside current security context
- Queue processing logs don't include PHI (Protected Health Information)
- Error responses don't leak sensitive implementation details
