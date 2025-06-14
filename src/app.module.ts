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
import { ResourceMemberModule } from './consumers/resource-member/resource-member.module';
import rabbitmqConfig from './config/rabbitmq.config';
import { APP_FILTER } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RpcExceptionFilter } from './common/filters';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

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
    ResourceMemberModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
  ],
})
export class AppModule {}
