import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  const rabbitmqConfig = configService.get('rabbitmq');
  const microservice = await NestFactory.createMicroservice(
    AppModule,
    rabbitmqConfig,
  );

  await microservice.listen();

  console.log('\n -------------------------------------------');
  console.log(` 🚀 ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` 📋 ${process.env.RABBITMQ_URL}`);
  console.log(` 📋 ${process.env.RABBITMQ_QUEUE}`);
  console.log(' -------------------------------------------\n');
}
bootstrap();
