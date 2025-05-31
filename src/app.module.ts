import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaService } from './config/prisma.config';
import { AssetModule } from './consumers/asset/asset.module';
import { QrCodeModule } from './consumers/qr-code/qr-code.module';
import { MaintenanceModule } from './consumers/maintenance/maintenance.module';
import { HouseModule } from './consumers/house/house.module';
import { RoomModule } from './consumers/room/room.module';
import { RoomAssetModule } from './consumers/room-asset/room-asset.module';
import { ImageModule } from './consumers/image/image.module';
import { AssetCategoryModule } from './consumers/asset-category/asset-category.module';
import { TenantContractModule } from './consumers/tenant-contract/tenant-contract.module';
import rabbitmqConfig from './config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig],
    }),
    AssetCategoryModule,
    AssetModule,
    AssetCategoryModule,
    HouseModule,
    ImageModule,
    MaintenanceModule,
    QrCodeModule,
    RoomAssetModule,
    RoomModule,
    TenantContractModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
