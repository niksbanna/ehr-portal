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
import { BillingService } from './billing.service';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({ status: 201, description: 'Bill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBillDto: CreateBillDto) {
    return this.billingService.create(createBillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bills' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Bills retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
  ) {
    return this.billingService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      patientId,
      status,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all bills for a patient' })
  @ApiResponse({ status: 200, description: 'Patient bills retrieved successfully' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.billingService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bill by ID' })
  @ApiResponse({ status: 200, description: 'Bill retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bill' })
  @ApiResponse({ status: 200, description: 'Bill updated successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billingService.update(id, updateBillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill' })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  remove(@Param('id') id: string) {
    return this.billingService.remove(id);
  }
}
