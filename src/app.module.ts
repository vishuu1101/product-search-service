import { Module } from '@nestjs/common';
import { ProductModule } from './module/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from './module/elasticsearch/elasticsearch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    ProductModule,
    ElasticsearchModule,
  ],
})
export class AppModule {}
