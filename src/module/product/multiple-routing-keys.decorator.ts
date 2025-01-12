import { EventPattern } from '@nestjs/microservices';

export function ListenToMultipleRoutingKeys(routingKeys: string[]) {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    routingKeys.forEach((routingKey) => {
      EventPattern(routingKey)(target, key, descriptor);
    });
  };
}
