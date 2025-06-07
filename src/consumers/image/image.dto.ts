import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { EntityType } from '@prisma/client';

export class CreateImageDto {
  @IsString()
  imageUrl: string;

  @IsEnum(EntityType)
  entityType: EntityType;

  @IsNumber()
  entityId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateImageDto {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
