import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty({ example: 'hospital_name' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'City General Hospital' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'general' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 'Name of the hospital' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateSettingDto {
  @ApiPropertyOptional({ example: 'hospital_name' })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiPropertyOptional({ example: 'City General Hospital' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional({ example: 'general' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'Name of the hospital' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
