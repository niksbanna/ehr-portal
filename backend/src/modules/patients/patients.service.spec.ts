import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientRepository } from './repositories/patient.repository';
import { Gender } from '@prisma/client';
import { TestDataFactory } from '../../../test/utils/test-data.factory';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: PatientRepository;

  const mockPatientRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: PatientRepository,
          useValue: mockPatientRepository,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get<PatientRepository>(PatientRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const createPatientDto = TestDataFactory.createPatientData();
      const expectedPatient = {
        id: 'uuid-1',
        ...createPatientDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPatientRepository.create.mockResolvedValue(expectedPatient);

      const result = await service.create(createPatientDto);

      expect(repository.create).toHaveBeenCalledWith(createPatientDto);
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it('should handle patient creation with minimal data', async () => {
      const minimalData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '01-01-1990',
        gender: Gender.MALE,
        phone: '+919876543210',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        emergencyContact: 'Jane Doe',
        emergencyPhone: '+919876543211',
        registrationDate: '01-01-2024',
      };

      const expectedPatient = {
        id: 'uuid-1',
        ...minimalData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPatientRepository.create.mockResolvedValue(expectedPatient);

      const result = await service.create(minimalData);

      expect(repository.create).toHaveBeenCalledWith(minimalData);
      expect(result.data).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated list of patients', async () => {
      const mockPatients = [
        { id: 'uuid-1', ...TestDataFactory.createPatientData() },
        { id: 'uuid-2', ...TestDataFactory.createPatientData() },
      ];

      const mockResult = {
        data: mockPatients,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockPatientRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10);

      expect(repository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        sortBy: undefined,
        order: undefined,
      });
      expect(result.data).toHaveLength(2);
      expect(result.meta.pagination).toBeDefined();
      expect(result.meta.pagination.total).toBe(2);
    });

    it('should support search functionality', async () => {
      const searchTerm = 'John';
      const mockPatients = [{ id: 'uuid-1', ...TestDataFactory.createPatientData() }];

      const mockResult = {
        data: mockPatients,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockPatientRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10, searchTerm);

      expect(repository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: searchTerm,
        sortBy: undefined,
        order: undefined,
      });
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      const patientId = 'uuid-1';
      const mockPatient = {
        id: patientId,
        ...TestDataFactory.createPatientData(),
      };

      mockPatientRepository.findOne.mockResolvedValue(mockPatient);

      const result = await service.findOne(patientId);

      expect(repository.findOne).toHaveBeenCalledWith(patientId);
      expect(result.data.id).toBe(patientId);
    });

    it('should throw NotFoundException when patient not found', async () => {
      const patientId = 'non-existent-id';
      mockPatientRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(patientId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(patientId);
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const patientId = 'uuid-1';
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedPatient = {
        id: patientId,
        ...TestDataFactory.createPatientData(),
        ...updateData,
      };

      mockPatientRepository.update.mockResolvedValue(updatedPatient);

      const result = await service.update(patientId, updateData);

      expect(repository.update).toHaveBeenCalledWith(patientId, updateData);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBeDefined();
      expect(result.data.name.given[0]).toBe('Updated');
      expect(result.data.name.family).toBe('Name');
    });

    it('should throw NotFoundException when updating non-existent patient', async () => {
      const patientId = 'non-existent-id';
      const updateData = { firstName: 'Updated' };

      mockPatientRepository.update.mockRejectedValue(new Error('Not found'));

      await expect(service.update(patientId, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a patient', async () => {
      const patientId = 'uuid-1';
      const mockPatient = {
        id: patientId,
        ...TestDataFactory.createPatientData(),
      };

      mockPatientRepository.remove.mockResolvedValue(mockPatient);

      const result = await service.remove(patientId);

      expect(repository.remove).toHaveBeenCalledWith(patientId);
      expect(result.data.id).toBe(patientId);
    });

    it('should throw NotFoundException when deleting non-existent patient', async () => {
      const patientId = 'non-existent-id';

      mockPatientRepository.remove.mockRejectedValue(new Error('Not found'));

      await expect(service.remove(patientId)).rejects.toThrow(NotFoundException);
    });
  });
});
