import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller()
export class ProductMessageListenerController {
  @EventPattern('product-info.vector-embed.successful')
  async handleProductInfoVectorEmbedMessage(data: any) {
    console.log('Received message1:', data);
  }

  @EventPattern('*')
  async all(@Payload() a: any, @Ctx() context: RmqContext) {
    console.log(a);
    console.log(context);
    console.log('Received message2:', a);
  }
}
