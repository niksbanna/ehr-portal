import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export enum LabStatusFilter {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class LabReportDto extends DateRangeDto {
  @ApiPropertyOptional({ enum: LabStatusFilter })
  @IsOptional()
  @IsEnum(LabStatusFilter)
  status?: LabStatusFilter;
}

export enum EncounterTypeFilter {
  CONSULTATION = 'CONSULTATION',
  FOLLOWUP = 'FOLLOWUP',
  EMERGENCY = 'EMERGENCY',
}

export class EncounterReportDto extends DateRangeDto {
  @ApiPropertyOptional({ enum: EncounterTypeFilter })
  @IsOptional()
  @IsEnum(EncounterTypeFilter)
  type?: EncounterTypeFilter;
}
