import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto/prescription.dto';
import { PrescriptionRepository } from './repositories/prescription.repository';

@Injectable()
export class PrescriptionsService {
  constructor(private prescriptionRepository: PrescriptionRepository) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionRepository.create(createPrescriptionDto);
  }

  async findAll(page = 1, limit = 10, patientId?: string) {
    return this.prescriptionRepository.findAll({ page, limit, patientId });
  }

  async findOne(id: string) {
    const prescription = await this.prescriptionRepository.findOne(id);

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return prescription;
  }

  async findByPatient(patientId: string) {
    return this.prescriptionRepository.findByPatient(patientId);
  }

  async findByEncounter(encounterId: string) {
    return this.prescriptionRepository.findByPatient(encounterId);
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    try {
      return await this.prescriptionRepository.update(id, updatePrescriptionDto);
    } catch (error) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prescriptionRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }
}
