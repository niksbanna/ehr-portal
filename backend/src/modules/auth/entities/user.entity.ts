import { User as PrismaUser, UserRole } from '@prisma/client';

export class UserEntity implements PrismaUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
