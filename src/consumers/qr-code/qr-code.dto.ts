import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class QRCodeDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  houseId: number;

  @IsString()
  @IsNotEmpty()
  qrData: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  isActive: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiresAt?: Date;
}

export class CreateQRCodeDto extends QRCodeDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateQRCodeDto extends PartialType(QRCodeDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
