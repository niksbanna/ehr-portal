import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EncounterType {
  CONSULTATION = 'CONSULTATION',
  FOLLOWUP = 'FOLLOWUP',
  EMERGENCY = 'EMERGENCY',
}

export enum EncounterStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateEncounterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ enum: EncounterType })
  @IsEnum(EncounterType)
  type: EncounterType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chiefComplaint: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  diagnosisCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiPropertyOptional({ enum: EncounterStatus })
  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  vitalSigns?: any;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  soapNotes?: any;
}

export class UpdateEncounterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  doctorId?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ enum: EncounterType })
  @IsEnum(EncounterType)
  @IsOptional()
  type?: EncounterType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chiefComplaint?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  diagnosisCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ enum: EncounterStatus })
  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  vitalSigns?: any;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  soapNotes?: any;
}
