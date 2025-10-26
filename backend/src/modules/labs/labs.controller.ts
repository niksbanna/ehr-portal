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
import { LabsService } from './labs.service';
import { CreateLabResultDto, UpdateLabResultDto } from './dto/lab.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Lab Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lab result' })
  @ApiResponse({ status: 201, description: 'Lab result created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createLabResultDto: CreateLabResultDto) {
    return this.labsService.create(createLabResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lab results' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lab results retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
  ) {
    return this.labsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      patientId,
      status,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all lab results for a patient' })
  @ApiResponse({ status: 200, description: 'Patient lab results retrieved successfully' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.labsService.findByPatient(patientId);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all lab results for an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter lab results retrieved successfully' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.labsService.findByEncounter(encounterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lab result by ID' })
  @ApiResponse({ status: 200, description: 'Lab result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  findOne(@Param('id') id: string) {
    return this.labsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lab result' })
  @ApiResponse({ status: 200, description: 'Lab result updated successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  update(@Param('id') id: string, @Body() updateLabResultDto: UpdateLabResultDto) {
    return this.labsService.update(id, updateLabResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lab result' })
  @ApiResponse({ status: 200, description: 'Lab result deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  remove(@Param('id') id: string) {
    return this.labsService.remove(id);
  }
}
