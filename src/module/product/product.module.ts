import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ElasticsearchClientModule } from '../elasticsearch/elasticsearch.module';
import { ProductMessageListenerController } from './product-message-listener.controller';
import { HttpClientModule } from '../httpclient/httpclient.module';

@Module({
  imports: [ElasticsearchClientModule, HttpClientModule],
  providers: [ProductService],
  controllers: [ProductController, ProductMessageListenerController],
})
export class ProductModule {}
