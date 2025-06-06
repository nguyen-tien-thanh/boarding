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
import { ContractStatus } from '@prisma/client';

export class TenantContractDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  tenantId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  roomId: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monthlyRent: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  deposit: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsEnum(ContractStatus)
  status: ContractStatus;

  @IsOptional()
  @IsString()
  terms?: string;
}

export class CreateTenantContractDto extends TenantContractDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateTenantContractDto extends PartialType(TenantContractDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
