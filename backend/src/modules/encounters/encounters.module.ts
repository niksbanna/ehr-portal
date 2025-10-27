import { Module } from '@nestjs/common';
import { EncountersController } from './encounters.controller';
import { EncountersService } from './encounters.service';
import { EncounterRepository } from './repositories/encounter.repository';

@Module({
  controllers: [EncountersController],
  providers: [EncountersService, EncounterRepository],
  exports: [EncountersService],
})
export class EncountersModule {}
