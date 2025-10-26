import { Module } from '@nestjs/common';
import { LabsController } from './labs.controller';
import { LabsService } from './labs.service';
import { LabRepository } from './repositories/lab.repository';

@Module({
  controllers: [LabsController],
  providers: [LabsService, LabRepository],
  exports: [LabsService],
})
export class LabsModule {}
