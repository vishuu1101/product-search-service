import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);

  const configService = app.get(ConfigService);
  const rabbitMQURL = configService.get<string>('RABBITMQ_URL');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMQURL],
        queue: 'product-search-service',
        queueOptions: { durable: true },
      },
    });

  await microservice.listen();
  console.log('RabbitMQ microservice is listening...');
}
bootstrap();
