import { Module } from '@nestjs/common';
import { ProductModule } from './module/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchClientModule } from './module/elasticsearch/elasticsearch.module';
import { RabbitmqModule } from './module/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    ProductModule,
    ElasticsearchClientModule,
    RabbitmqModule,
  ],
})
export class AppModule {}
