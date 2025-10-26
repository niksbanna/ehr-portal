import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { BillingRepository } from './repositories/billing.repository';

@Injectable()
export class BillingService {
  constructor(private billingRepository: BillingRepository) {}

  async create(createBillDto: CreateBillDto) {
    return this.billingRepository.create(createBillDto);
  }

  async findAll(page = 1, limit = 10, patientId?: string, status?: string) {
    return this.billingRepository.findAll({ page, limit, patientId, status });
  }

  async findOne(id: string) {
    const bill = await this.billingRepository.findOne(id);

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }

    return bill;
  }

  async findByPatient(patientId: string) {
    return this.billingRepository.findByPatient(patientId);
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    try {
      return await this.billingRepository.update(id, updateBillDto);
    } catch (error) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.billingRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }
}
