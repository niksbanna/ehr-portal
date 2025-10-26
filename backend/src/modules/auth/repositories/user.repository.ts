import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IRepository<UserEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<UserEntity> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<{ data: UserEntity[] }> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { data: users };
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: any): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<UserEntity> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
