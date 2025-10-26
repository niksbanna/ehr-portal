import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async create(createBillDto: CreateBillDto) {
    return this.prisma.bill.create({
      data: {
        ...createBillDto,
        date: new Date(createBillDto.date),
        discount: createBillDto.discount || 0,
      },
      include: {
        patient: true,
        encounter: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.paymentStatus = status;

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

  async findOne(id: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { id },
      include: {
        patient: true,
        encounter: true,
      },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }

    return bill;
  }

  async findByPatient(patientId: string) {
    return this.prisma.bill.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        encounter: true,
      },
    });
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    try {
      const data: any = { ...updateBillDto };
      if (updateBillDto.date) {
        data.date = new Date(updateBillDto.date);
      }

      return await this.prisma.bill.update({
        where: { id },
        data,
        include: {
          patient: true,
          encounter: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.bill.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }
}
