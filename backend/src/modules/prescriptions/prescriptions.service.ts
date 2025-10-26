import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto/prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    return this.prisma.prescription.create({
      data: {
        ...createPrescriptionDto,
        date: new Date(createPrescriptionDto.date),
      },
      include: {
        patient: true,
        doctor: true,
        encounter: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, patientId?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (patientId) where.patientId = patientId;

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

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        encounter: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return prescription;
  }

  async findByPatient(patientId: string) {
    return this.prisma.prescription.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      include: {
        doctor: true,
        encounter: true,
      },
    });
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.prescription.findMany({
      where: { encounterId },
      orderBy: { date: 'desc' },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    try {
      const data: any = { ...updatePrescriptionDto };
      if (updatePrescriptionDto.date) {
        data.date = new Date(updatePrescriptionDto.date);
      }

      return await this.prisma.prescription.update({
        where: { id },
        data,
        include: {
          patient: true,
          doctor: true,
          encounter: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.prescription.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }
}
