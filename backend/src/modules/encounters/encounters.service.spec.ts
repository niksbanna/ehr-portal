import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EncountersService } from './encounters.service';
import { EncounterRepository } from './repositories/encounter.repository';
import { EncounterType, EncounterStatus } from '@prisma/client';
import { TestDataFactory } from '../../../test/utils/test-data.factory';

describe('EncountersService', () => {
  let service: EncountersService;
  let repository: EncounterRepository;

  const mockEncounterRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPatient: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncountersService,
        {
          provide: EncounterRepository,
          useValue: mockEncounterRepository,
        },
      ],
    }).compile();

    service = module.get<EncountersService>(EncountersService);
    repository = module.get<EncounterRepository>(EncounterRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new encounter', async () => {
      const patientId = 'patient-1';
      const doctorId = 'doctor-1';
      const createEncounterDto = TestDataFactory.createEncounterData(patientId, doctorId);

      const expectedEncounter = {
        id: 'encounter-1',
        ...createEncounterDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEncounterRepository.create.mockResolvedValue(expectedEncounter);

      const result = await service.create(createEncounterDto);

      expect(repository.create).toHaveBeenCalledWith(createEncounterDto);
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it('should create encounter with different types', async () => {
      const patientId = 'patient-1';
      const doctorId = 'doctor-1';

      for (const type of [
        EncounterType.CONSULTATION,
        EncounterType.FOLLOWUP,
        EncounterType.EMERGENCY,
      ]) {
        const createEncounterDto = TestDataFactory.createEncounterData(patientId, doctorId, {
          type,
        });

        const expectedEncounter = {
          id: `encounter-${type}`,
          ...createEncounterDto,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockEncounterRepository.create.mockResolvedValue(expectedEncounter);

        const result = await service.create(createEncounterDto);

        expect(result.data).toBeDefined();
        jest.clearAllMocks();
      }
    });
  });

  describe('findAll', () => {
    it('should return paginated list of encounters', async () => {
      const mockEncounters = [
        {
          id: 'encounter-1',
          ...TestDataFactory.createEncounterData('patient-1', 'doctor-1'),
        },
        {
          id: 'encounter-2',
          ...TestDataFactory.createEncounterData('patient-2', 'doctor-1'),
        },
      ];

      const mockResult = {
        data: mockEncounters,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockEncounterRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10);

      expect(repository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        patientId: undefined,
        status: undefined,
        sortBy: undefined,
        order: undefined,
      });
      expect(result.data).toHaveLength(2);
    });

    it('should filter encounters by patient', async () => {
      const patientId = 'patient-1';
      const mockEncounters = [
        {
          id: 'encounter-1',
          ...TestDataFactory.createEncounterData(patientId, 'doctor-1'),
        },
      ];

      const mockResult = {
        data: mockEncounters,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockEncounterRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10, patientId);

      expect(repository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        patientId,
        status: undefined,
        sortBy: undefined,
        order: undefined,
      });
      expect(result.data).toHaveLength(1);
    });

    it('should filter encounters by status', async () => {
      const status = EncounterStatus.COMPLETED;
      const mockEncounters = [
        {
          id: 'encounter-1',
          ...TestDataFactory.createEncounterData('patient-1', 'doctor-1', { status }),
        },
      ];

      const mockResult = {
        data: mockEncounters,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockEncounterRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10, undefined, status);

      expect(repository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        patientId: undefined,
        status,
        sortBy: undefined,
        order: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return an encounter by id', async () => {
      const encounterId = 'encounter-1';
      const mockEncounter = {
        id: encounterId,
        ...TestDataFactory.createEncounterData('patient-1', 'doctor-1'),
      };

      mockEncounterRepository.findOne.mockResolvedValue(mockEncounter);

      const result = await service.findOne(encounterId);

      expect(repository.findOne).toHaveBeenCalledWith(encounterId);
      expect(result.data.id).toBe(encounterId);
    });

    it('should throw NotFoundException when encounter not found', async () => {
      const encounterId = 'non-existent-id';
      mockEncounterRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(encounterId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(encounterId);
    });
  });

  describe('findByPatient', () => {
    it('should return all encounters for a patient', async () => {
      const patientId = 'patient-1';
      const mockEncounters = [
        {
          id: 'encounter-1',
          ...TestDataFactory.createEncounterData(patientId, 'doctor-1'),
        },
        {
          id: 'encounter-2',
          ...TestDataFactory.createEncounterData(patientId, 'doctor-2'),
        },
      ];

      mockEncounterRepository.findByPatient.mockResolvedValue(mockEncounters);

      const result = await service.findByPatient(patientId);

      expect(repository.findByPatient).toHaveBeenCalledWith(patientId);
      expect(result.data).toHaveLength(2);
    });

    it('should return empty array when patient has no encounters', async () => {
      const patientId = 'patient-with-no-encounters';
      mockEncounterRepository.findByPatient.mockResolvedValue([]);

      const result = await service.findByPatient(patientId);

      expect(result.data).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update an encounter', async () => {
      const encounterId = 'encounter-1';
      const updateData = {
        status: EncounterStatus.COMPLETED,
        diagnosis: 'Updated diagnosis',
      };

      const updatedEncounter = {
        id: encounterId,
        ...TestDataFactory.createEncounterData('patient-1', 'doctor-1'),
        ...updateData,
      };

      mockEncounterRepository.update.mockResolvedValue(updatedEncounter);

      const result = await service.update(encounterId, updateData);

      expect(repository.update).toHaveBeenCalledWith(encounterId, updateData);
      expect(result.data.status).toBe(EncounterStatus.COMPLETED);
    });

    it('should throw NotFoundException when updating non-existent encounter', async () => {
      const encounterId = 'non-existent-id';
      const updateData = { status: EncounterStatus.COMPLETED };

      mockEncounterRepository.update.mockRejectedValue(new Error('Not found'));

      await expect(service.update(encounterId, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an encounter', async () => {
      const encounterId = 'encounter-1';
      const mockEncounter = {
        id: encounterId,
        ...TestDataFactory.createEncounterData('patient-1', 'doctor-1'),
      };

      mockEncounterRepository.remove.mockResolvedValue(mockEncounter);

      const result = await service.remove(encounterId);

      expect(repository.remove).toHaveBeenCalledWith(encounterId);
      expect(result.data.id).toBe(encounterId);
    });

    it('should throw NotFoundException when deleting non-existent encounter', async () => {
      const encounterId = 'non-existent-id';

      mockEncounterRepository.remove.mockRejectedValue(new Error('Not found'));

      await expect(service.remove(encounterId)).rejects.toThrow(NotFoundException);
    });
  });
});
