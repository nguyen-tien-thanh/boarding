import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class ResourceMemberDto {
  @IsString()
  @IsNotEmpty()
  resource: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  resourceId?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId: number;
}

export class CreateResourceMemberDto extends ResourceMemberDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  createdBy: number;
}

export class UpdateResourceMemberDto extends PartialType(ResourceMemberDto) {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  updatedBy: number;
}
