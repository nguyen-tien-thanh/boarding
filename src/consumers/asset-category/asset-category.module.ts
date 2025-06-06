import { Module } from '@nestjs/common';
import { AssetCategoryService } from './asset-category.service';
import { AssetCategoryController } from './asset-category.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [AssetCategoryController],
  providers: [AssetCategoryService, PrismaService],
  exports: [AssetCategoryService],
})
export class AssetCategoryModule {}
