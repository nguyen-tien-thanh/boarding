import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Connect microservice
  const rabbitmqConfig = configService.get('rabbitmq');
  app.connectMicroservice(rabbitmqConfig);

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
