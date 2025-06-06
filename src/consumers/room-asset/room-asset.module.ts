import { Module } from '@nestjs/common';
import { RoomAssetService } from './room-asset.service';
import { RoomAssetController } from './room-asset.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [RoomAssetController],
  providers: [RoomAssetService, PrismaService],
  exports: [RoomAssetService],
})
export class RoomAssetModule {}
