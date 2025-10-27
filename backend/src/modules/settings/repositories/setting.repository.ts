import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { IRepository } from '../../../common/interfaces/repository.interface';
import { SettingEntity } from '../entities/setting.entity';
import { CreateSettingDto, UpdateSettingDto } from '../dto/setting.dto';

@Injectable()
export class SettingRepository implements IRepository<SettingEntity> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSettingDto): Promise<SettingEntity> {
    return this.prisma.setting.create({
      data,
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    category?: string;
    isPublic?: boolean;
  }): Promise<{ data: SettingEntity[]; pagination?: any }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options?.category) where.category = options.category;
    if (options?.isPublic !== undefined) where.isPublic = options.isPublic;

    const [settings, total] = await Promise.all([
      this.prisma.setting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.setting.count({ where }),
    ]);

    return {
      data: settings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<SettingEntity | null> {
    return this.prisma.setting.findUnique({
      where: { id },
    });
  }

  async findByKey(key: string): Promise<SettingEntity | null> {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async update(id: string, data: UpdateSettingDto): Promise<SettingEntity> {
    return this.prisma.setting.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<SettingEntity> {
    return this.prisma.setting.delete({
      where: { id },
    });
  }

  async findByCategory(category: string): Promise<SettingEntity[]> {
    return this.prisma.setting.findMany({
      where: { category },
      orderBy: { key: 'asc' },
    });
  }
}
