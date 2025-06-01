import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHouseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalArea: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  totalRooms: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}
