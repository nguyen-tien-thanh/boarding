import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import { RpcExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const rabbitmqConfig = configService.get('rabbitmq');
  const microservice = app.connectMicroservice(rabbitmqConfig);

  // microservice.useGlobalFilters(new RpcExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log('\n -------------------------------------------');
  console.log(` 🚀 ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` 🌐 ${process.env.DATABASE_URL}`);
  console.log(` 📋 ${process.env.RABBITMQ_URL}`);
  console.log(` 📋 ${process.env.RABBITMQ_QUEUE}`);
  console.log(' -------------------------------------------\n');
}
bootstrap();
