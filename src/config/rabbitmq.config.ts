import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { IFilter } from 'src/common/decorators';

export interface IPayload<T = any> {
  pattern: string;
  filter?: IFilter;
  payload?: T;
  id?: number;
  correlationId?: string;
  timestamp?: Date;
  source?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export default registerAs('rabbitmq', () => ({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
    queue: process.env.RABBITMQ_QUEUE || 'gateway_requests',
    queueOptions: { durable: true },
    prefetchCount: 1,
    persistent: true,
  },
}));
