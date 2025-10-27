import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultDto, UpdateLabResultDto } from './dto/lab.dto';
import { LabRepository } from './repositories/lab.repository';

@Injectable()
export class LabsService {
  constructor(private labRepository: LabRepository) {}

  async create(createLabResultDto: CreateLabResultDto) {
    return this.labRepository.create(createLabResultDto);
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string) {
    return this.labRepository.findAll({ page, limit, patientId, status });
  }

  async findOne(id: string) {
    const labResult = await this.labRepository.findOne(id);

    if (!labResult) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }

    return labResult;
  }

  async findByPatient(patientId: string) {
    return this.labRepository.findByPatient(patientId);
  }

  async findByEncounter(encounterId: string) {
    return this.labRepository.findByPatient(encounterId);
  }

  async update(id: string, updateLabResultDto: UpdateLabResultDto) {
    try {
      return await this.labRepository.update(id, updateLabResultDto);
    } catch (error) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.labRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }
  }
}
