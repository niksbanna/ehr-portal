import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateEncounterDto, UpdateEncounterDto } from './dto/encounter.dto';

@Injectable()
export class EncountersService {
  constructor(private prisma: PrismaService) {}

  async create(createEncounterDto: CreateEncounterDto) {
    return this.prisma.encounter.create({
      data: {
        ...createEncounterDto,
        date: new Date(createEncounterDto.date),
      },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const [encounters, total] = await Promise.all([
      this.prisma.encounter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
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

  async findOne(id: string) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        labResults: true,
        prescriptions: true,
        bills: true,
      },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    return encounter;
  }

  async findByPatient(patientId: string) {
    return this.prisma.encounter.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        doctor: true,
      },
    });
  }

  async update(id: string, updateEncounterDto: UpdateEncounterDto) {
    try {
      const data: any = { ...updateEncounterDto };
      if (updateEncounterDto.date) {
        data.date = new Date(updateEncounterDto.date);
      }

      return await this.prisma.encounter.update({
        where: { id },
        data,
        include: {
          patient: true,
          doctor: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.encounter.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }
  }
}
