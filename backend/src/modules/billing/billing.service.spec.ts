import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingRepository } from './repositories/billing.repository';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { TestDataFactory } from '../../../test/utils/test-data.factory';

describe('BillingService', () => {
  let service: BillingService;
  let repository: BillingRepository;

  const mockBillingRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPatient: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const toEntityFormat = (data: any) => ({
    ...data,
    date: new Date(data.date),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: BillingRepository,
          useValue: mockBillingRepository,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    repository = module.get<BillingRepository>(BillingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bill', async () => {
      const patientId = 'patient-1';
      const encounterId = 'encounter-1';
      const billData = TestDataFactory.createBillData(patientId, encounterId);
      const expectedBill = { id: 'bill-1', ...toEntityFormat(billData) };

      mockBillingRepository.create.mockResolvedValue(expectedBill);

      const result = await service.create(billData);

      expect(repository.create).toHaveBeenCalledWith(billData);
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it('should calculate bill totals correctly', async () => {
      const patientId = 'patient-1';
      const encounterId = 'encounter-1';
      const items = [
        { name: 'Consultation', quantity: 1, rate: 1000 },
        { name: 'Lab Test', quantity: 2, rate: 500 },
      ];
      const subtotal = 2000;
      const tax = subtotal * 0.18;
      const total = subtotal + tax;

      const billData = TestDataFactory.createBillData(patientId, encounterId, {
        items,
        subtotal,
        tax,
        total,
      });
      const expectedBill = { id: 'bill-1', ...toEntityFormat(billData) };

      mockBillingRepository.create.mockResolvedValue(expectedBill);

      const result = await service.create(billData);

      expect(result.data.totalNet.value).toBe(total);
      expect(result.data.subtotal.value).toBe(subtotal);
      expect(result.data.tax.value).toBe(tax);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of bills', async () => {
      const mockBills = [
        {
          id: 'bill-1',
          ...toEntityFormat(TestDataFactory.createBillData('patient-1', 'encounter-1')),
        },
        {
          id: 'bill-2',
          ...toEntityFormat(TestDataFactory.createBillData('patient-2', 'encounter-2')),
        },
      ];

      const mockResult = {
        data: mockBills,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockBillingRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a bill by id', async () => {
      const billId = 'bill-1';
      const mockBill = {
        id: billId,
        ...toEntityFormat(TestDataFactory.createBillData('patient-1', 'encounter-1')),
      };

      mockBillingRepository.findOne.mockResolvedValue(mockBill);

      const result = await service.findOne(billId);

      expect(repository.findOne).toHaveBeenCalledWith(billId);
      expect(result.data.id).toBe(billId);
    });

    it('should throw NotFoundException when bill not found', async () => {
      const billId = 'non-existent-id';
      mockBillingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(billId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a bill', async () => {
      const billId = 'bill-1';
      const updateData = {
        paymentStatus: PaymentStatus.PAID,
        notes: 'Payment received',
      };

      const billData = TestDataFactory.createBillData('patient-1', 'encounter-1');
      const updatedBill = { id: billId, ...toEntityFormat(billData), ...updateData };

      mockBillingRepository.update.mockResolvedValue(updatedBill);

      const result = await service.update(billId, updateData);

      expect(repository.update).toHaveBeenCalledWith(billId, updateData);
      expect(result.data.status).toBe(PaymentStatus.PAID);
    });

    it('should throw NotFoundException when updating non-existent bill', async () => {
      const billId = 'non-existent-id';
      const updateData = { paymentStatus: PaymentStatus.PAID };

      mockBillingRepository.update.mockRejectedValue(new Error('Not found'));

      await expect(service.update(billId, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a bill', async () => {
      const billId = 'bill-1';
      const mockBill = {
        id: billId,
        ...toEntityFormat(TestDataFactory.createBillData('patient-1', 'encounter-1')),
      };

      mockBillingRepository.remove.mockResolvedValue(mockBill);

      const result = await service.remove(billId);

      expect(repository.remove).toHaveBeenCalledWith(billId);
      expect(result.data.id).toBe(billId);
    });

    it('should throw NotFoundException when deleting non-existent bill', async () => {
      const billId = 'non-existent-id';

      mockBillingRepository.remove.mockRejectedValue(new Error('Not found'));

      await expect(service.remove(billId)).rejects.toThrow(NotFoundException);
    });
  });
});
