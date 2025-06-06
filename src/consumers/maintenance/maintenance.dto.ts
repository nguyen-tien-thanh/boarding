import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { MaintenancePriority, MaintenanceStatus } from '@prisma/client';

export class MaintenanceDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  roomId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  reportedBy: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  assignedTo?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(MaintenancePriority)
  priority: MaintenancePriority;

  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  cost?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  completedAt?: Date;
}

export class CreateMaintenanceDto extends MaintenanceDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateMaintenanceDto extends PartialType(MaintenanceDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
