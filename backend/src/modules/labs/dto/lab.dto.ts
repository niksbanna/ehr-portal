import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LabStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateLabResultDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  encounterId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testCategory: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  orderedDate: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @ApiPropertyOptional({ enum: LabStatus })
  @IsEnum(LabStatus)
  @IsOptional()
  status?: LabStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  results?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  normalRange?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderedById: string;
}

export class UpdateLabResultDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  encounterId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  testName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  testCategory?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  orderedDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @ApiPropertyOptional({ enum: LabStatus })
  @IsEnum(LabStatus)
  @IsOptional()
  status?: LabStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  results?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  normalRange?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderedById?: string;
}
