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

  console.log(
    `🚀 Boarding microservice running on port ${process.env.PORT ?? 3000}`,
  );
  console.log(`📨 Connected to RabbitMQ: ${rabbitmqConfig.options.urls[0]}`);
  console.log(`📋 Queue: ${rabbitmqConfig.options.queue}`);
}
bootstrap();
