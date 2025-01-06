import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductRequest } from './dto/add-product-request.dto';

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
    return await this.productService.createIndex(indexName);
  }

  @Delete('delete-index/:indexName')
  async deleteIndex(@Param('indexName') indexName: string) {
    return await this.productService.deleteIndex(indexName);
  }

  @Post()
  async addProduct(@Body(ValidationPipe) request: AddProductRequest) {
    console.log(request.title);
  }
}
