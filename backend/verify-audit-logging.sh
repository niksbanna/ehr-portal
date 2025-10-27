#!/bin/bash

# Audit Logging Verification Script
# This script demonstrates the audit logging functionality

echo "==================================="
echo "EHR Portal - Audit Logging Verification"
echo "==================================="
echo ""

# Check if backend is built
echo "1. Checking if backend is built..."
if [ -d "./dist" ]; then
    echo "✅ Backend is built"
else
    echo "❌ Backend not built. Run: npm run build"
    exit 1
fi

# Check for key files
echo ""
echo "2. Verifying audit logging files..."
files=(
    "dist/common/interceptors/audit-log.interceptor.js"
    "dist/common/utils/data-masking.util.js"
    "dist/modules/audit/audit.controller.js"
    "dist/modules/audit/audit.service.js"
    "dist/modules/audit/audit.module.js"
)

all_present=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        all_present=false
    fi
done

if [ "$all_present" = false ]; then
    echo ""
    echo "❌ Some files are missing. Please rebuild."
    exit 1
fi

echo ""
echo "3. Checking Prisma schema for userRole field..."
if grep -q "userRole.*UserRole" prisma/schema.prisma; then
    echo "✅ userRole field exists in AuditLog model"
else
    echo "❌ userRole field missing in AuditLog model"
    exit 1
fi

echo ""
echo "4. Checking for helmet dependency..."
if grep -q '"helmet"' package.json; then
    echo "✅ helmet package installed"
else
    echo "❌ helmet package not found"
    exit 1
fi

echo ""
echo "5. Verifying main.ts configuration..."
if grep -q "helmet()" src/main.ts; then
    echo "✅ helmet middleware configured"
else
    echo "❌ helmet middleware not configured"
    exit 1
fi

if grep -q "enableCors" src/main.ts; then
    echo "✅ CORS configured"
else
    echo "❌ CORS not configured"
    exit 1
fi

echo ""
echo "6. Verifying app.module.ts..."
if grep -q "APP_INTERCEPTOR" src/app.module.ts; then
    echo "✅ Global interceptor registered"
else
    echo "❌ Global interceptor not registered"
    exit 1
fi

if grep -q "AuditModule" src/app.module.ts; then
    echo "✅ AuditModule imported"
else
    echo "❌ AuditModule not imported"
    exit 1
fi

echo ""
echo "==================================="
echo "✅ All audit logging components verified!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Start the backend: npm run start:dev"
echo "2. Apply migration: npm run prisma:migrate"
echo "3. Test by making mutations (POST/PATCH/PUT/DELETE)"
echo "4. Check audit logs: GET /api/audit (as admin)"
echo ""
echo "Documentation: See AUDIT_LOGGING.md"
