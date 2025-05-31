import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './config/prisma.config';
import { BoardingConsumer } from './consumers/boarding.consumer';
import { BoardingService } from './services/boarding.service';
import rabbitmqConfig from './config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig],
    }),
  ],
  controllers: [AppController, BoardingConsumer],
  providers: [AppService, PrismaService, BoardingService],
})
export class AppModule {}
