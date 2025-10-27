import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientRepository } from './repositories/patient.repository';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PatientRepository],
  exports: [PatientsService],
})
export class PatientsModule {}
