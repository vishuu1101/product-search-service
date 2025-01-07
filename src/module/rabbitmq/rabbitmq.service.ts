import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnApplicationShutdown {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.setupBindings();
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`Application shutting down due to signal: ${signal}`);
    if (this.channel) {
      await this.channel.close();
      console.log('RabbitMQ channel closed.');
    }
    if (this.connection) {
      await this.connection.close();
      console.log('RabbitMQ connection closed.');
    }
  }

  private async setupBindings() {
    const exchange = this.configService.get<string>('EXCHANGE');
    const queue = this.configService.get<string>('QUEUE_NAME');
    const routingKey = this.configService.get<string>('ROUTING_KEY');

    // Connect to RabbitMQ
    this.connection = await amqp.connect(
      this.configService.get<string>('RABBITMQ_URL'),
    );
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key
    await this.channel.bindQueue(queue, exchange, routingKey);
  }
}
