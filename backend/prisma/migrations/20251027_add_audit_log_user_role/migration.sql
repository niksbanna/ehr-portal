-- AlterTable: Add userRole field to audit_logs table
ALTER TABLE "audit_logs" ADD COLUMN "userRole" "UserRole";
