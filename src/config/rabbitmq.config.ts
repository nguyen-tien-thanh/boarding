import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('rabbitmq', () => ({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
    queue: process.env.RABBITMQ_QUEUE || 'gateway_requests',
    queueOptions: {
      durable: true,
    },
    prefetchCount: 1,
    persistent: true,
  },
}));
