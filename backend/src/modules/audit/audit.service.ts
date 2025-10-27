import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: GetAuditLogsDto) {
    const {
      userId,
      userRole,
      entity,
      action,
      status,
      page = 1,
      limit = 50,
      order = 'desc',
    } = query;

    // Build where clause
    const where: any = {};
    if (userId) where.userId = userId;
    if (userRole) where.userRole = userRole;
    if (entity) where.entity = entity;
    if (action) where.action = action;
    if (status) where.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch audit logs with user information
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          timestamp: order,
        },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
