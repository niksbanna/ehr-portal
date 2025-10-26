import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { PrescriptionEntity } from '../entities/prescription.entity';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../dto/prescription.dto';

@Injectable()
export class PrescriptionRepository implements IRepository<PrescriptionEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePrescriptionDto): Promise<PrescriptionEntity> {
    return this.prisma.prescription.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        patient: true,
        doctor: true,
        encounter: true,
      },
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    patientId?: string;
    status?: string;
  }): Promise<{ data: PrescriptionEntity[]; pagination: any }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options?.patientId) where.patientId = options.patientId;
    if (options?.status) where.status = options.status;

    const [prescriptions, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          patient: true,
          doctor: true,
          encounter: true,
        },
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return {
      data: prescriptions,
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

  async findOne(id: string): Promise<PrescriptionEntity | null> {
    return this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        encounter: true,
      },
    });
  }

  async update(id: string, data: UpdatePrescriptionDto): Promise<PrescriptionEntity> {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return this.prisma.prescription.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
        encounter: true,
      },
    });
  }

  async remove(id: string): Promise<PrescriptionEntity> {
    return this.prisma.prescription.delete({
      where: { id },
    });
  }

  async findByPatient(patientId: string): Promise<PrescriptionEntity[]> {
    return this.prisma.prescription.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        doctor: true,
        encounter: true,
      },
    });
  }
}
