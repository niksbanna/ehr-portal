import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto';
import { SettingRepository } from './repositories/setting.repository';

@Injectable()
export class SettingsService {
  constructor(
    private settingRepository: SettingRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    const setting = await this.settingRepository.create(createSettingDto);
    // Invalidate cache for category
    await this.cacheManager.del(`settings:category:${setting.category}`);
    await this.cacheManager.del(`settings:key:${setting.key}`);
    return setting;
  }

  async findAll(page = 1, limit = 10, category?: string, isPublic?: boolean) {
    return this.settingRepository.findAll({ page, limit, category, isPublic });
  }

  async findOne(id: string) {
    const setting = await this.settingRepository.findOne(id);

    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }

    return setting;
  }

  async findByKey(key: string) {
    // Try cache first
    const cacheKey = `settings:key:${key}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const setting = await this.settingRepository.findByKey(key);

    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }

    // Cache the result
    await this.cacheManager.set(cacheKey, setting);

    return setting;
  }

  async findByCategory(category: string) {
    // Try cache first for frequently accessed categories
    const cacheKey = `settings:category:${category}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const settings = await this.settingRepository.findByCategory(category);

    // Cache the result (especially useful for ICD codes, departments, drug lists)
    await this.cacheManager.set(cacheKey, settings);

    return settings;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    try {
      const setting = await this.settingRepository.update(id, updateSettingDto);
      // Invalidate relevant caches
      await this.cacheManager.del(`settings:category:${setting.category}`);
      await this.cacheManager.del(`settings:key:${setting.key}`);
      return setting;
    } catch (error) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const setting = await this.settingRepository.findOne(id);
      if (setting) {
        await this.cacheManager.del(`settings:category:${setting.category}`);
        await this.cacheManager.del(`settings:key:${setting.key}`);
      }
      return await this.settingRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
  }
}
