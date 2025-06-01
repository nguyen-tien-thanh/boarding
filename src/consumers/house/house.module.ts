import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [HouseController],
  providers: [HouseService, PrismaService],
  exports: [HouseService],
})
export class HouseModule {}
