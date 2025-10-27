import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockPrismaContext = (): MockPrismaContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

export const prisma = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prisma);
});
