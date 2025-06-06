import { IsInt, IsPositive, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { AssetCondition } from '@prisma/client';

export class RoomAssetDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  roomId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  assetId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsEnum(AssetCondition)
  condition: AssetCondition;
}

export class CreateRoomAssetDto extends RoomAssetDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateRoomAssetDto extends PartialType(RoomAssetDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
