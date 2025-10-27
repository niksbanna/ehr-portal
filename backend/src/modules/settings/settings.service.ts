import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto';
import { SettingRepository } from './repositories/setting.repository';

@Injectable()
export class SettingsService {
  constructor(private settingRepository: SettingRepository) {}

  async create(createSettingDto: CreateSettingDto) {
    return this.settingRepository.create(createSettingDto);
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
    const setting = await this.settingRepository.findByKey(key);

    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }

    return setting;
  }

  async findByCategory(category: string) {
    return this.settingRepository.findByCategory(category);
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    try {
      return await this.settingRepository.update(id, updateSettingDto);
    } catch (error) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.settingRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
  }
}
