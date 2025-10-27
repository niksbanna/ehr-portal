import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto/prescription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create a new prescription (Doctor only)' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prescriptions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.prescriptionsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      patientId,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all prescriptions for a patient' })
  @ApiResponse({ status: 200, description: 'Patient prescriptions retrieved successfully' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.prescriptionsService.findByPatient(patientId);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all prescriptions for an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter prescriptions retrieved successfully' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.prescriptionsService.findByEncounter(encounterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(id);
  }
}
