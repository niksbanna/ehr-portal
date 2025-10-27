import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PatientsModule } from '../../src/modules/patients/patients.module';
import { PrismaService } from '../../src/common/prisma.service';
import { TestDataFactory } from '../utils/test-data.factory';
import { Gender } from '@prisma/client';

describe('Patients Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Mock PrismaService
  const mockPrismaService = {
    patient: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PatientsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /patients', () => {
    it('should create a new patient', async () => {
      const createPatientDto = TestDataFactory.createPatientData();
      const createdPatient = {
        id: 'patient-1',
        ...createPatientDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.patient.create.mockResolvedValue(createdPatient);

      const response = await request(app.getHttpServer())
        .post('/patients')
        .send(createPatientDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        firstName: 'John',
        // Missing required fields
      };

      await request(app.getHttpServer()).post('/patients').send(invalidData).expect(400);
    });

    it('should validate email format', async () => {
      const invalidData = TestDataFactory.createPatientData({
        email: 'invalid-email',
      });

      await request(app.getHttpServer()).post('/patients').send(invalidData).expect(400);
    });
  });

  describe('GET /patients', () => {
    it('should return paginated list of patients', async () => {
      const mockPatients = [
        {
          id: 'patient-1',
          ...TestDataFactory.createPatientData(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'patient-2',
          ...TestDataFactory.createPatientData(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.patient.findMany.mockResolvedValue(mockPatients);
      mockPrismaService.patient.count.mockResolvedValue(2);

      const response = await request(app.getHttpServer())
        .get('/patients')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    it('should support search by name', async () => {
      const searchTerm = 'John';
      const mockPatients = [
        {
          id: 'patient-1',
          ...TestDataFactory.createPatientData({ firstName: 'John' }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.patient.findMany.mockResolvedValue(mockPatients);
      mockPrismaService.patient.count.mockResolvedValue(1);

      const response = await request(app.getHttpServer())
        .get('/patients')
        .query({ search: searchTerm })
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /patients/:id', () => {
    it('should return a patient by id', async () => {
      const patientId = 'patient-1';
      const mockPatient = {
        id: patientId,
        ...TestDataFactory.createPatientData(),
        createdAt: new Date(),
        updatedAt: new Date(),
        encounters: [],
        labResults: [],
        prescriptions: [],
        bills: [],
      };

      mockPrismaService.patient.findUnique.mockResolvedValue(mockPatient);

      const response = await request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(patientId);
    });

    it('should return 404 when patient not found', async () => {
      const patientId = 'non-existent-id';
      mockPrismaService.patient.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer()).get(`/patients/${patientId}`).expect(404);
    });
  });

  describe('PATCH /patients/:id', () => {
    it('should update a patient', async () => {
      const patientId = 'patient-1';
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedPatient = {
        id: patientId,
        ...TestDataFactory.createPatientData(),
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.patient.update.mockResolvedValue(updatedPatient);

      const response = await request(app.getHttpServer())
        .patch(`/patients/${patientId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it('should return 404 when updating non-existent patient', async () => {
      const patientId = 'non-existent-id';
      const updateData = { firstName: 'Updated' };

      mockPrismaService.patient.update.mockRejectedValue(new Error('Not found'));

      await request(app.getHttpServer())
        .patch(`/patients/${patientId}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /patients/:id', () => {
    it('should delete a patient', async () => {
      const patientId = 'patient-1';
      const mockPatient = {
        id: patientId,
        ...TestDataFactory.createPatientData(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.patient.delete.mockResolvedValue(mockPatient);

      const response = await request(app.getHttpServer())
        .delete(`/patients/${patientId}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it('should return 404 when deleting non-existent patient', async () => {
      const patientId = 'non-existent-id';

      mockPrismaService.patient.delete.mockRejectedValue(new Error('Not found'));

      await request(app.getHttpServer()).delete(`/patients/${patientId}`).expect(404);
    });
  });

  describe('Complete Patient Flow', () => {
    it('should create, retrieve, update, and delete a patient', async () => {
      const createPatientDto = TestDataFactory.createPatientData();
      let patientId: string;

      // Create patient
      const createdPatient = {
        id: 'patient-flow-1',
        ...createPatientDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.patient.create.mockResolvedValue(createdPatient);

      const createResponse = await request(app.getHttpServer())
        .post('/patients')
        .send(createPatientDto)
        .expect(201);

      expect(createResponse.body.data).toBeDefined();
      patientId = createdPatient.id;

      // Retrieve patient
      mockPrismaService.patient.findUnique.mockResolvedValue({
        ...createdPatient,
        encounters: [],
        labResults: [],
        prescriptions: [],
        bills: [],
      });

      const getResponse = await request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(200);

      expect(getResponse.body.data.id).toBe(patientId);

      // Update patient
      const updateData = { firstName: 'Updated' };
      mockPrismaService.patient.update.mockResolvedValue({
        ...createdPatient,
        ...updateData,
      });

      const updateResponse = await request(app.getHttpServer())
        .patch(`/patients/${patientId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.data).toBeDefined();

      // Delete patient
      mockPrismaService.patient.delete.mockResolvedValue(createdPatient);

      await request(app.getHttpServer()).delete(`/patients/${patientId}`).expect(200);
    });
  });
});
