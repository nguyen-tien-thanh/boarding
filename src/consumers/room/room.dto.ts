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
import { RoomStatus } from '@prisma/client';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  area: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  baseRent: number;

  @IsEnum(RoomStatus)
  status: RoomStatus;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  houseId: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateRoomDto extends RoomDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateRoomDto extends PartialType(RoomDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
