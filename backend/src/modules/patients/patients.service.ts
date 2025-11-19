import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PatientRepository } from './repositories/patient.repository';
import { PatientMapper } from './mappers/patient.mapper';
import { ApiResponse, PaginatedResponse } from '../../common/dto/response.dto';

@Injectable()
export class PatientsService {
  constructor(private patientRepository: PatientRepository) {}

  async create(createPatientDto: CreatePatientDto) {
    const patient = await this.patientRepository.create(createPatientDto);
    const responseDto = PatientMapper.toResponseDto(patient);
    return new ApiResponse(responseDto);
  }

  async findAll(page = 1, limit = 10, search?: string, sortBy?: string, order?: 'asc' | 'desc') {
    const result = await this.patientRepository.findAll({ page, limit, search, sortBy, order });
    const responseDtos = PatientMapper.toResponseDtoArray(result.data);
    return new PaginatedResponse(
      responseDtos,
      result.pagination,
      sortBy ? { sortBy, order } : undefined,
    );
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne(id);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const responseDto = PatientMapper.toResponseDto(patient);
    return new ApiResponse(responseDto);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    try {
      const patient = await this.patientRepository.update(id, updatePatientDto);
      const responseDto = PatientMapper.toResponseDto(patient);
      return new ApiResponse(responseDto);
    } catch (_error) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const patient = await this.patientRepository.remove(id);
      const responseDto = PatientMapper.toResponseDto(patient);
      return new ApiResponse(responseDto);
    } catch (_error) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async search(query: string) {
    const patients = await this.patientRepository.search(query);
    const responseDtos = PatientMapper.toResponseDtoArray(patients);
    return new ApiResponse(responseDtos);
  }
}
