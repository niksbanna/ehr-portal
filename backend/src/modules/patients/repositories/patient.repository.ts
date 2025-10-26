import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { PatientEntity } from '../entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';

@Injectable()
export class PatientRepository implements IRepository<PatientEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePatientDto): Promise<PatientEntity> {
    return this.prisma.patient.create({
      data,
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: PatientEntity[]; pagination: any }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where = options?.search
      ? {
          OR: [
            { firstName: { contains: options.search, mode: 'insensitive' as const } },
            { lastName: { contains: options.search, mode: 'insensitive' as const } },
            { email: { contains: options.search, mode: 'insensitive' as const } },
            { phone: { contains: options.search } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
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

  async findOne(id: string): Promise<PatientEntity | null> {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        encounters: true,
        labResults: true,
        prescriptions: true,
        bills: true,
      },
    });
  }

  async update(id: string, data: UpdatePatientDto): Promise<PatientEntity> {
    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<PatientEntity> {
    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async search(query: string): Promise<PatientEntity[]> {
    return this.prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      },
      take: 20,
    });
  }
}
