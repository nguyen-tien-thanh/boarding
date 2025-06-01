// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Node Env
    NODE_ENV?: 'development' | 'production';

    // Database
    DATABASE_URL: string;

    // RabbitMQ
    RABBITMQ_URL: string;
    RABBITMQ_QUEUE: string;
  }
}
