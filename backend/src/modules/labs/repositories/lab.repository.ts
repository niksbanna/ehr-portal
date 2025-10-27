import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { LabResultEntity } from '../entities/lab-result.entity';
import { CreateLabResultDto, UpdateLabResultDto } from '../dto/lab.dto';

@Injectable()
export class LabRepository implements IRepository<LabResultEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLabResultDto): Promise<LabResultEntity> {
    return this.prisma.labResult.create({
      data: {
        ...data,
        orderedDate: new Date(data.orderedDate),
        reportDate: data.reportDate ? new Date(data.reportDate) : null,
      },
      include: {
        patient: true,
        orderedBy: true,
      },
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    patientId?: string;
    status?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ data: LabResultEntity[]; pagination: any }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options?.sortBy || 'orderedDate';
    const order = options?.order || 'desc';

    const where: any = {};
    if (options?.patientId) where.patientId = options.patientId;
    if (options?.status) where.status = options.status;

    const [labResults, total] = await Promise.all([
      this.prisma.labResult.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          patient: true,
          orderedBy: true,
        },
      }),
      this.prisma.labResult.count({ where }),
    ]);

    return {
      data: labResults,
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

  async findOne(id: string): Promise<LabResultEntity | null> {
    return this.prisma.labResult.findUnique({
      where: { id },
      include: {
        patient: true,
        encounter: true,
        orderedBy: true,
      },
    });
  }

  async update(id: string, data: UpdateLabResultDto): Promise<LabResultEntity> {
    const updateData: any = { ...data };
    if (data.orderedDate) {
      updateData.orderedDate = new Date(data.orderedDate);
    }
    if (data.reportDate) {
      updateData.reportDate = new Date(data.reportDate);
    }

    return this.prisma.labResult.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        orderedBy: true,
      },
    });
  }

  async remove(id: string): Promise<LabResultEntity> {
    return this.prisma.labResult.delete({
      where: { id },
    });
  }

  async findByPatient(patientId: string): Promise<LabResultEntity[]> {
    return this.prisma.labResult.findMany({
      where: { patientId },
      orderBy: { orderedDate: 'desc' },
      include: {
        orderedBy: true,
      },
    });
  }
}
