import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDecimal,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum HouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export class CreateHouseDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsUUID()
  ownerId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  totalArea: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  totalRooms: number;

  @IsOptional()
  @IsEnum(HouseStatus)
  status?: HouseStatus;
}

export class UpdateHouseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  totalArea?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  totalRooms?: number;

  @IsOptional()
  @IsEnum(HouseStatus)
  status?: HouseStatus;
}
