import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('rabbitmq', () => ({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5673'],
    queue: process.env.RABBITMQ_QUEUE || 'boarding_queue',
    queueOptions: {
      durable: true,
    },
    prefetchCount: 1,
    persistent: true,
  },
}));
