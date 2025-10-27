import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LabStatus } from '@prisma/client';
import { EncounterType } from '@prisma/client';

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

export class LabReportDto extends DateRangeDto {
  @ApiPropertyOptional({ enum: LabStatus })
  @IsOptional()
  @IsEnum(LabStatus)
  status?: LabStatus;
}

export class EncounterReportDto extends DateRangeDto {
  @ApiPropertyOptional({ enum: EncounterType })
  @IsOptional()
  @IsEnum(EncounterType)
  type?: EncounterType;
}
