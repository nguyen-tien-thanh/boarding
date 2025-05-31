import { Module } from '@nestjs/common';
import { RoomAssetService } from './room-asset.service';
import { RoomAssetController } from './room-asset.controller';

@Module({
  controllers: [RoomAssetController],
  providers: [RoomAssetService],
})
export class RoomAssetModule {}
