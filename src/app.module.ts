import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/prisma.config';
import { AssetModule } from './consumers/asset/asset.module';
import { QRCodeModule } from './consumers/qr-code/qr-code.module';
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
    HouseModule,
    ImageModule,
    MaintenanceModule,
    QRCodeModule,
    RoomAssetModule,
    RoomModule,
    TenantContractModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
