import { Module } from '@nestjs/common';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionRepository } from './repositories/prescription.repository';

@Module({
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService, PrescriptionRepository],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
