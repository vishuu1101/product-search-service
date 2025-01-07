import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { ProductMessageListenerController } from './product-message-listener.controller';

@Module({
  imports: [ElasticsearchModule],

  providers: [ProductService],
  controllers: [ProductController, ProductMessageListenerController],
})
export class ProductModule {}
