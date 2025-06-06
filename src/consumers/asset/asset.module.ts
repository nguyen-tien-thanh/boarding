import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [AssetController],
  providers: [AssetService, PrismaService],
  exports: [AssetService],
})
export class AssetModule {}
