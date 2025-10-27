import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { LabsController } from './labs.controller';
import { LabsService } from './labs.service';
import { LabRepository } from './repositories/lab.repository';
import { LabReportProcessor } from './processors/lab-report.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'lab-reports',
    }),
  ],
  controllers: [LabsController],
  providers: [LabsService, LabRepository, LabReportProcessor],
  exports: [LabsService],
})
export class LabsModule {}
