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
import { EncountersService } from './encounters.service';
import { CreateEncounterDto, UpdateEncounterDto } from './dto/encounter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Encounters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('encounters')
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new encounter' })
  @ApiResponse({ status: 201, description: 'Encounter created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createEncounterDto: CreateEncounterDto) {
    return this.encountersService.create(createEncounterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all encounters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by (e.g., date, status)',
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Encounters retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.encountersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      patientId,
      status,
      sortBy,
      order,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all encounters for a patient' })
  @ApiResponse({ status: 200, description: 'Patient encounters retrieved successfully' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.encountersService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an encounter by ID' })
  @ApiResponse({ status: 200, description: 'Encounter retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Encounter not found' })
  findOne(@Param('id') id: string) {
    return this.encountersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter updated successfully' })
  @ApiResponse({ status: 404, description: 'Encounter not found' })
  update(@Param('id') id: string, @Body() updateEncounterDto: UpdateEncounterDto) {
    return this.encountersService.update(id, updateEncounterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Encounter not found' })
  remove(@Param('id') id: string) {
    return this.encountersService.remove(id);
  }
}
