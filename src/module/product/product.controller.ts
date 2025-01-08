import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchRequest } from './dto/document-by-vector-request';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('hello')
  hello() {
    return { success: true, message: 'Hello' };
  }

  @Get('indices/list')
  async listIndices() {
    return await this.productService.listIndices();
  }

  @Put('create-index/:indexName')
  async createIndex(@Param('indexName') indexName: string) {
    await this.productService.createIndex(indexName);
    return { message: 'Success' };
  }

  @Delete('delete-index/:indexName')
  async deleteIndex(@Param('indexName') indexName: string) {
    return await this.productService.deleteIndex(indexName);
  }

  @Post('search')
  async getDocumentByVector(@Body() request: SearchRequest) {
    return await this.productService.search('product_info', request.searchText);
  }
}
