import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { AssetCondition } from '@prisma/client';

export class AssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsEnum(AssetCondition)
  condition: AssetCondition;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  value: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateAssetDto extends AssetDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateAssetDto extends PartialType(AssetDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
