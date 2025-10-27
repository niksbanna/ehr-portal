import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEncounterDto, UpdateEncounterDto } from './dto/encounter.dto';
import { EncounterRepository } from './repositories/encounter.repository';
import { EncounterMapper } from './mappers/encounter.mapper';
import { ApiResponse, PaginatedResponse } from '../../common/dto/response.dto';

@Injectable()
export class EncountersService {
  constructor(private encounterRepository: EncounterRepository) {}

  async create(createEncounterDto: CreateEncounterDto) {
    const encounter = await this.encounterRepository.create(createEncounterDto);
    const responseDto = EncounterMapper.toResponseDto(encounter);
    return new ApiResponse(responseDto);
  }

  async findAll(
    page = 1,
    limit = 10,
    patientId?: string,
    status?: string,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const result = await this.encounterRepository.findAll({
      page,
      limit,
      patientId,
      status,
      sortBy,
      order,
    });
    const responseDtos = EncounterMapper.toResponseDtoArray(result.data);
    return new PaginatedResponse(
      responseDtos,
      result.pagination,
      sortBy ? { sortBy, order } : undefined,
    );
  }

  async findOne(id: string) {
    const encounter = await this.encounterRepository.findOne(id);

    if (!encounter) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    const responseDto = EncounterMapper.toResponseDto(encounter);
    return new ApiResponse(responseDto);
  }

  async findByPatient(patientId: string) {
    const encounters = await this.encounterRepository.findByPatient(patientId);
    const responseDtos = EncounterMapper.toResponseDtoArray(encounters);
    return new ApiResponse(responseDtos);
  }

  async update(id: string, updateEncounterDto: UpdateEncounterDto) {
    try {
      const encounter = await this.encounterRepository.update(id, updateEncounterDto);
      const responseDto = EncounterMapper.toResponseDto(encounter);
      return new ApiResponse(responseDto);
    } catch (error) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const encounter = await this.encounterRepository.remove(id);
      const responseDto = EncounterMapper.toResponseDto(encounter);
      return new ApiResponse(responseDto);
    } catch (error) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }
  }
}
