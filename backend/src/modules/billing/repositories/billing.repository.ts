import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { BillEntity } from '../entities/bill.entity';
import { CreateBillDto, UpdateBillDto } from '../dto/bill.dto';

@Injectable()
export class BillingRepository implements IRepository<BillEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBillDto): Promise<BillEntity> {
    return this.prisma.bill.create({
      data: {
        ...data,
        date: new Date(data.date),
        discount: data.discount || 0,
      },
      include: {
        patient: true,
        encounter: true,
      },
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    patientId?: string;
    status?: string;
  }): Promise<{ data: BillEntity[]; pagination: any }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options?.patientId) where.patientId = options.patientId;
    if (options?.status) where.paymentStatus = options.status;

    const [bills, total] = await Promise.all([
      this.prisma.bill.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          patient: true,
          encounter: true,
        },
      }),
      this.prisma.bill.count({ where }),
    ]);

    return {
      data: bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<BillEntity | null> {
    return this.prisma.bill.findUnique({
      where: { id },
      include: {
        patient: true,
        encounter: true,
      },
    });
  }

  async update(id: string, data: UpdateBillDto): Promise<BillEntity> {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return this.prisma.bill.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        encounter: true,
      },
    });
  }

  async remove(id: string): Promise<BillEntity> {
    return this.prisma.bill.delete({
      where: { id },
    });
  }

  async findByPatient(patientId: string): Promise<BillEntity[]> {
    return this.prisma.bill.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        encounter: true,
      },
    });
  }
}
