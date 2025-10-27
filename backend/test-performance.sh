#!/bin/bash

# Manual Testing Script for Performance Enhancements
# This script helps verify the implemented features

echo "=================================="
echo "Backend Performance Testing Guide"
echo "=================================="
echo ""

# Check if backend is running
check_backend() {
    echo "1. Checking if backend is running..."
    if curl -s http://localhost:3000/api/docs > /dev/null; then
        echo "   ✓ Backend is running on http://localhost:3000"
        return 0
    else
        echo "   ✗ Backend is not running"
        echo "   Please start the backend with: npm run start:dev"
        return 1
    fi
}

# Test cache endpoints
test_cache() {
    echo ""
    echo "2. Testing Cache Endpoints (requires authentication)"
    echo "   The following endpoints use caching:"
    echo "   - GET /api/settings/icd-codes"
    echo "   - GET /api/settings/departments"
    echo "   - GET /api/settings/drugs"
    echo "   - GET /api/settings/category/:category"
    echo ""
    echo "   Manual test:"
    echo "   1. Get an auth token by logging in"
    echo "   2. Make the same request twice"
    echo "   3. Check logs - second request should be faster (cache hit)"
    echo ""
    echo "   Example:"
    echo '   TOKEN="your-jwt-token"'
    echo '   curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/settings/icd-codes'
}

# Test pagination
test_pagination() {
    echo ""
    echo "3. Testing Pagination"
    echo "   All major endpoints support pagination:"
    echo "   - GET /api/labs?page=1&limit=10"
    echo "   - GET /api/prescriptions?page=1&limit=10"
    echo "   - GET /api/patients?page=1&limit=10"
    echo "   - GET /api/encounters?page=1&limit=10"
    echo "   - GET /api/settings?page=1&limit=10"
    echo ""
    echo "   Response includes pagination metadata:"
    echo '   {"data": [...], "meta": {"pagination": {"page": 1, "limit": 10, "total": 50, ...}}}'
}

# Test queue
test_queue() {
    echo ""
    echo "4. Testing Background Queue (Lab Reports)"
    echo "   When creating or updating lab results, jobs are queued:"
    echo "   - POST /api/labs (creates lab result + queues report generation)"
    echo "   - PATCH /api/labs/:id with status=COMPLETED (queues report generation)"
    echo ""
    echo "   Check server logs for:"
    echo "   - 'Processing lab report generation for lab result: {id}'"
    echo "   - 'Successfully generated report for lab result: {id}'"
    echo ""
    echo "   Note: If Redis is not available, you'll see a warning:"
    echo "   - 'Failed to queue lab report generation: ...'"
    echo "   - The API will still work, jobs just won't be queued"
}

# Test error handling
test_error_handling() {
    echo ""
    echo "5. Testing Enhanced Error Handling"
    echo "   Test different error scenarios:"
    echo ""
    echo "   404 Not Found:"
    echo '   curl http://localhost:3000/api/labs/invalid-id'
    echo ""
    echo "   Expected response:"
    echo '   {"statusCode": 404, "message": "...", "error": "Not Found", "path": "/api/labs/invalid-id", "timestamp": "..."}'
    echo ""
    echo "   400 Bad Request (validation error):"
    echo '   curl -X POST -H "Content-Type: application/json" -d "{}" http://localhost:3000/api/labs'
    echo ""
    echo "   401 Unauthorized (no token):"
    echo '   curl http://localhost:3000/api/labs'
}

# Check Redis connection
check_redis() {
    echo ""
    echo "6. Checking Redis Connection (Optional)"
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping > /dev/null 2>&1; then
            echo "   ✓ Redis is running and accessible"
            echo "   Cache will use Redis for better performance"
        else
            echo "   ✗ Redis is not running"
            echo "   Cache will fall back to in-memory storage"
            echo ""
            echo "   To start Redis:"
            echo "   docker run -d -p 6379:6379 redis:alpine"
        fi
    else
        echo "   redis-cli not found, skipping Redis check"
        echo "   If Redis is not running, cache will use in-memory fallback"
    fi
}

# Main execution
main() {
    check_backend
    test_cache
    test_pagination
    test_queue
    test_error_handling
    check_redis
    
    echo ""
    echo "=================================="
    echo "Testing Guide Complete"
    echo "=================================="
    echo ""
    echo "For detailed documentation, see:"
    echo "  backend/PERFORMANCE_ENHANCEMENTS.md"
    echo ""
}

main
