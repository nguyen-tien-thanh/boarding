import { MessagePattern } from '@nestjs/microservices';

/**
 * Decorator that automatically generates a RabbitMQ message pattern for RPC methods
 * based on the controller class name and method name.
 *
 * The pattern format is: `{lowercaseClassName}.{methodName}`
 *
 * Example: For a method `findAll()` in `HouseController`
 *
 * The pattern will be `house.findAll`
 */

export function AutoRpcPattern(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const className = target.constructor.name.replace(/Controller$/, '');
    const methodName = String(propertyKey);
    const pattern = `${className.charAt(0).toLowerCase()}${className.slice(1)}.${methodName}`;

    MessagePattern(pattern)(target, propertyKey, descriptor);
  };
}
