import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { BillingRepository } from './repositories/billing.repository';
import { BillMapper } from './mappers/bill.mapper';
import { ApiResponse, PaginatedResponse } from '../../common/dto/response.dto';

@Injectable()
export class BillingService {
  constructor(private billingRepository: BillingRepository) {}

  async create(createBillDto: CreateBillDto) {
    const bill = await this.billingRepository.create(createBillDto);
    const responseDto = BillMapper.toResponseDto(bill);
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
    const result = await this.billingRepository.findAll({
      page,
      limit,
      patientId,
      status,
      sortBy,
      order,
    });
    const responseDtos = BillMapper.toResponseDtoArray(result.data);
    return new PaginatedResponse(
      responseDtos,
      result.pagination,
      sortBy ? { sortBy, order } : undefined,
    );
  }

  async findOne(id: string) {
    const bill = await this.billingRepository.findOne(id);

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }

    const responseDto = BillMapper.toResponseDto(bill);
    return new ApiResponse(responseDto);
  }

  async findByPatient(patientId: string) {
    const bills = await this.billingRepository.findByPatient(patientId);
    const responseDtos = BillMapper.toResponseDtoArray(bills);
    return new ApiResponse(responseDtos);
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    try {
      const bill = await this.billingRepository.update(id, updateBillDto);
      const responseDto = BillMapper.toResponseDto(bill);
      return new ApiResponse(responseDto);
    } catch (_error) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const bill = await this.billingRepository.remove(id);
      const responseDto = BillMapper.toResponseDto(bill);
      return new ApiResponse(responseDto);
    } catch (_error) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }
}
