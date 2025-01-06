import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [ElasticsearchModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
