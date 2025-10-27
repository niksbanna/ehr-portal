import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { EncounterEntity } from '../entities/encounter.entity';
import { CreateEncounterDto, UpdateEncounterDto } from '../dto/encounter.dto';

@Injectable()
export class EncounterRepository implements IRepository<EncounterEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEncounterDto): Promise<EncounterEntity> {
    return this.prisma.encounter.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        patient: true,
        doctor: true,
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
  }): Promise<{ data: EncounterEntity[]; pagination: any }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options?.sortBy || 'date';
    const order = options?.order || 'desc';

    const where: any = {};
    if (options?.patientId) where.patientId = options.patientId;
    if (options?.status) where.status = options.status;

    const [encounters, total] = await Promise.all([
      this.prisma.encounter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          patient: true,
          doctor: true,
        },
      }),
      this.prisma.encounter.count({ where }),
    ]);

    return {
      data: encounters,
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

  async findOne(id: string): Promise<EncounterEntity | null> {
    return this.prisma.encounter.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        labResults: true,
        prescriptions: true,
        bills: true,
      },
    });
  }

  async update(id: string, data: UpdateEncounterDto): Promise<EncounterEntity> {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return this.prisma.encounter.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async remove(id: string): Promise<EncounterEntity> {
    return this.prisma.encounter.delete({
      where: { id },
    });
  }

  async findByPatient(patientId: string): Promise<EncounterEntity[]> {
    return this.prisma.encounter.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        doctor: true,
      },
    });
  }
}
