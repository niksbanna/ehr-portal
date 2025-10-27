import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEncounterDto, UpdateEncounterDto } from './dto/encounter.dto';
import { EncounterRepository } from './repositories/encounter.repository';

@Injectable()
export class EncountersService {
  constructor(private encounterRepository: EncounterRepository) {}

  async create(createEncounterDto: CreateEncounterDto) {
    return this.encounterRepository.create(createEncounterDto);
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string) {
    return this.encounterRepository.findAll({ page, limit, patientId, status });
  }

  async findOne(id: string) {
    const encounter = await this.encounterRepository.findOne(id);

    if (!encounter) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    return encounter;
  }

  async findByPatient(patientId: string) {
    return this.encounterRepository.findByPatient(patientId);
  }

  async update(id: string, updateEncounterDto: UpdateEncounterDto) {
    try {
      return await this.encounterRepository.update(id, updateEncounterDto);
    } catch (error) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.encounterRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }
  }
}
