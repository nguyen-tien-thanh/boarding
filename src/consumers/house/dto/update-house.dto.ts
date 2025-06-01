import { PartialType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './create-house.dto';
import { IsInt, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { HouseStatus } from '@prisma/client';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;

  @IsOptional()
  @IsEnum(HouseStatus)
  status?: HouseStatus;
}
