import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { maskSensitiveData } from '../utils/data-masking.util';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    // Only log mutations (POST, PATCH, PUT, DELETE)
    const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
    
    if (!isMutation) {
      return next.handle();
    }

    // Extract IP address
    const ipAddress = 
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip;

    // Extract user agent
    const userAgent = request.headers['user-agent'];

    // Determine entity and action from URL and method
    const { entity, entityId, action } = this.extractEntityInfo(url, method);

    // Mask sensitive data in request body
    const maskedBody = maskSensitiveData(body);

    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        // Log successful operation
        this.createAuditLog({
          userId: user?.id || null,
          userRole: user?.role || null,
          action,
          entity,
          entityId,
          changes: maskedBody,
          ipAddress,
          userAgent,
          status: 'SUCCESS',
        }).catch((error) => {
          console.error('Failed to create audit log:', error);
        });
      }),
      catchError((error) => {
        // Log failed operation
        this.createAuditLog({
          userId: user?.id || null,
          userRole: user?.role || null,
          action,
          entity,
          entityId,
          changes: maskedBody,
          ipAddress,
          userAgent,
          status: 'FAILURE',
          errorMessage: error.message || 'Unknown error',
        }).catch((logError) => {
          console.error('Failed to create audit log:', logError);
        });
        throw error;
      }),
    );
  }

  private extractEntityInfo(url: string, method: string): {
    entity: string;
    entityId: string | null;
    action: string;
  } {
    // Remove /api prefix and query parameters
    const cleanUrl = url.replace(/^\/api\//, '').split('?')[0];
    const segments = cleanUrl.split('/').filter(Boolean);

    // Default values
    let entity = 'Unknown';
    let entityId: string | null = null;
    let action = method;

    if (segments.length > 0) {
      // First segment is usually the entity (e.g., 'patients', 'encounters')
      entity = segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace(/-/g, '');
      
      // If there's a second segment and it looks like an ID (UUID or number), it's the entityId
      if (segments.length > 1 && this.looksLikeId(segments[1])) {
        entityId = segments[1];
      }
      
      // Map HTTP methods to actions
      if (method === 'POST') {
        action = 'CREATE';
      } else if (method === 'PATCH' || method === 'PUT') {
        action = 'UPDATE';
      } else if (method === 'DELETE') {
        action = 'DELETE';
      }
    }

    return { entity, entityId, action };
  }

  private looksLikeId(segment: string): boolean {
    // Check if it looks like a UUID or numeric ID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const numericRegex = /^\d+$/;
    return uuidRegex.test(segment) || numericRegex.test(segment);
  }

  private async createAuditLog(data: {
    userId: string | null;
    userRole: UserRole | null;
    action: string;
    entity: string;
    entityId: string | null;
    changes: any;
    ipAddress: string;
    userAgent: string;
    status: string;
    errorMessage?: string;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        userRole: data.userRole,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        changes: data.changes,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status,
        errorMessage: data.errorMessage,
      },
    });
  }
}
