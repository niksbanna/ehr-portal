import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingRepository } from './repositories/setting.repository';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, SettingRepository],
  exports: [SettingsService],
})
export class SettingsModule {}
