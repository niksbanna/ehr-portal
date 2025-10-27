import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultDto, UpdateLabResultDto } from './dto/lab.dto';
import { LabRepository } from './repositories/lab.repository';
import { LabResultMapper } from './mappers/lab-result.mapper';
import { ApiResponse, PaginatedResponse } from '../../common/dto/response.dto';

@Injectable()
export class LabsService {
  constructor(private labRepository: LabRepository) {}

  async create(createLabResultDto: CreateLabResultDto) {
    const labResult = await this.labRepository.create(createLabResultDto);
    const responseDto = LabResultMapper.toResponseDto(labResult);
    return new ApiResponse(responseDto);
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string, sortBy?: string, order?: 'asc' | 'desc') {
    const result = await this.labRepository.findAll({ page, limit, patientId, status, sortBy, order });
    const responseDtos = LabResultMapper.toResponseDtoArray(result.data);
    return new PaginatedResponse(
      responseDtos,
      result.pagination,
      sortBy ? { sortBy, order } : undefined,
    );
  }

  async findOne(id: string) {
    const labResult = await this.labRepository.findOne(id);

    if (!labResult) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }

    const responseDto = LabResultMapper.toResponseDto(labResult);
    return new ApiResponse(responseDto);
  }

  async findByPatient(patientId: string) {
    const labResults = await this.labRepository.findByPatient(patientId);
    const responseDtos = LabResultMapper.toResponseDtoArray(labResults);
    return new ApiResponse(responseDtos);
  }

  async findByEncounter(encounterId: string) {
    const labResults = await this.labRepository.findByPatient(encounterId);
    const responseDtos = LabResultMapper.toResponseDtoArray(labResults);
    return new ApiResponse(responseDtos);
  }

  async update(id: string, updateLabResultDto: UpdateLabResultDto) {
    try {
      const labResult = await this.labRepository.update(id, updateLabResultDto);
      const responseDto = LabResultMapper.toResponseDto(labResult);
      return new ApiResponse(responseDto);
    } catch (error) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const labResult = await this.labRepository.remove(id);
      const responseDto = LabResultMapper.toResponseDto(labResult);
      return new ApiResponse(responseDto);
    } catch (error) {
      throw new NotFoundException(`Lab result with ID ${id} not found`);
    }
  }
}
