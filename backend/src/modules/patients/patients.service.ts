import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PatientRepository } from './repositories/patient.repository';

@Injectable()
export class PatientsService {
  constructor(private patientRepository: PatientRepository) {}

  async create(createPatientDto: CreatePatientDto) {
    return this.patientRepository.create(createPatientDto);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.patientRepository.findAll({ page, limit, search });
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne(id);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    try {
      return await this.patientRepository.update(id, updatePatientDto);
    } catch (error) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.patientRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async search(query: string) {
    return this.patientRepository.search(query);
  }
}
