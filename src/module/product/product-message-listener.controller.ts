import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller()
export class ProductMessageListenerController {
  constructor(private readonly productService: ProductService) {}

  @EventPattern('product-info.vector-embed.successful')
  async handleProductInfoVectorEmbedMessage(
    @Payload() data: any,
    @Ctx() ctx: RmqContext,
  ) {
    await this.productService.addProduct('product_info', data);
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    channel.ack(originalMessage);
  }
}
