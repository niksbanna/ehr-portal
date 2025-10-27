import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalPatients, totalEncounters, pendingLabs, totalRevenue, todayEncounters] =
      await Promise.all([
        this.prisma.patient.count(),
        this.prisma.encounter.count(),
        this.prisma.labResult.count({ where: { status: 'PENDING' } }),
        this.prisma.bill.aggregate({
          _sum: { total: true },
          where: { paymentStatus: 'PAID' },
        }),
        this.prisma.encounter.count({
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
      ]);

    return {
      totalPatients,
      totalEncounters,
      pendingLabs,
      totalRevenue: totalRevenue._sum.total || 0,
      todayEncounters,
    };
  }

  async getPatientReport(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate || endDate) {
      where.registrationDate = {};
      if (startDate) where.registrationDate.gte = startDate;
      if (endDate) where.registrationDate.lte = endDate;
    }

    const patients = await this.prisma.patient.findMany({
      where,
      include: {
        _count: {
          select: {
            encounters: true,
            labResults: true,
            prescriptions: true,
            bills: true,
          },
        },
      },
    });

    return {
      total: patients.length,
      patients,
    };
  }

  async getRevenueReport(startDate?: string, endDate?: string) {
    const where: any = { paymentStatus: 'PAID' };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const bills = await this.prisma.bill.findMany({
      where,
      include: {
        patient: true,
        encounter: true,
      },
      orderBy: { date: 'desc' },
    });

    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    const totalTax = bills.reduce((sum, bill) => sum + bill.tax, 0);
    const totalDiscount = bills.reduce((sum, bill) => sum + bill.discount, 0);

    return {
      total: bills.length,
      totalRevenue,
      totalTax,
      totalDiscount,
      bills,
    };
  }

  async getLabReport(startDate?: string, endDate?: string, status?: string) {
    const where: any = {};

    if (status) where.status = status;

    if (startDate || endDate) {
      where.orderedDate = {};
      if (startDate) where.orderedDate.gte = new Date(startDate);
      if (endDate) where.orderedDate.lte = new Date(endDate);
    }

    const labs = await this.prisma.labResult.findMany({
      where,
      include: {
        patient: true,
        orderedBy: true,
        encounter: true,
      },
      orderBy: { orderedDate: 'desc' },
    });

    const statusCounts = await this.prisma.labResult.groupBy({
      by: ['status'],
      _count: true,
      where: startDate || endDate ? where : undefined,
    });

    return {
      total: labs.length,
      statusCounts,
      labs,
    };
  }

  async getEncounterReport(startDate?: string, endDate?: string, type?: string) {
    const where: any = {};

    if (type) where.type = type;

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const encounters = await this.prisma.encounter.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { date: 'desc' },
    });

    const typeCounts = await this.prisma.encounter.groupBy({
      by: ['type'],
      _count: true,
      where: startDate || endDate ? where : undefined,
    });

    const statusCounts = await this.prisma.encounter.groupBy({
      by: ['status'],
      _count: true,
      where: startDate || endDate ? where : undefined,
    });

    return {
      total: encounters.length,
      typeCounts,
      statusCounts,
      encounters,
    };
  }
}
