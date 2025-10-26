import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateLabResultDto, UpdateLabResultDto } from './dto/lab.dto';

@Injectable()
export class LabsService {
  constructor(private prisma: PrismaService) {}

  async create(createLabResultDto: CreateLabResultDto) {
    const data: any = {
      ...createLabResultDto,
      orderedDate: new Date(createLabResultDto.orderedDate),
    };

    if (createLabResultDto.reportDate) {
      data.reportDate = new Date(createLabResultDto.reportDate);
    }

    return this.prisma.labResult.create({
      data,
      include: {
        patient: true,
        orderedBy: true,
        encounter: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const [labResults, total] = await Promise.all([
      this.prisma.labResult.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderedDate: 'desc' },
        include: {
          patient: true,
          orderedBy: true,
          encounter: true,
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

  async findOne(id: string) {
    const labResult = await this.prisma.labResult.findUnique({
      where: { id },
      include: {
        patient: true,
        orderedBy: true,
        encounter: true,
      },
    });

    if (!labResult) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }

    return labResult;
  }

  async findByPatient(patientId: string) {
    return this.prisma.labResult.findMany({
      where: { patientId },
      orderBy: { orderedDate: 'desc' },
      include: {
        orderedBy: true,
        encounter: true,
      },
    });
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.labResult.findMany({
      where: { encounterId },
      orderBy: { orderedDate: 'desc' },
      include: {
        patient: true,
        orderedBy: true,
      },
    });
  }

  async update(id: string, updateLabResultDto: UpdateLabResultDto) {
    try {
      const data: any = { ...updateLabResultDto };
      if (updateLabResultDto.orderedDate) {
        data.orderedDate = new Date(updateLabResultDto.orderedDate);
      }
      if (updateLabResultDto.reportDate) {
        data.reportDate = new Date(updateLabResultDto.reportDate);
      }

      return await this.prisma.labResult.update({
        where: { id },
        data,
        include: {
          patient: true,
          orderedBy: true,
          encounter: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.labResult.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }
  }
}
