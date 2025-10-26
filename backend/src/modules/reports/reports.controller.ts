import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DateRangeDto, LabReportDto, EncounterReportDto } from './dto/report.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('patients')
  @ApiOperation({ summary: 'Get patient report' })
  @ApiResponse({ status: 200, description: 'Patient report retrieved successfully' })
  getPatientReport(@Query() dateRangeDto: DateRangeDto) {
    return this.reportsService.getPatientReport(dateRangeDto.startDate, dateRangeDto.endDate);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiResponse({ status: 200, description: 'Revenue report retrieved successfully' })
  getRevenueReport(@Query() dateRangeDto: DateRangeDto) {
    return this.reportsService.getRevenueReport(dateRangeDto.startDate, dateRangeDto.endDate);
  }

  @Get('labs')
  @ApiOperation({ summary: 'Get lab results report' })
  @ApiResponse({ status: 200, description: 'Lab report retrieved successfully' })
  getLabReport(@Query() labReportDto: LabReportDto) {
    return this.reportsService.getLabReport(
      labReportDto.startDate,
      labReportDto.endDate,
      labReportDto.status,
    );
  }

  @Get('encounters')
  @ApiOperation({ summary: 'Get encounter report' })
  @ApiResponse({ status: 200, description: 'Encounter report retrieved successfully' })
  getEncounterReport(@Query() encounterReportDto: EncounterReportDto) {
    return this.reportsService.getEncounterReport(
      encounterReportDto.startDate,
      encounterReportDto.endDate,
      encounterReportDto.type,
    );
  }
}
