import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RPC Exception');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();
    const pattern = ctx.getContext()?.pattern || 'Unknown';

    this.logger.error('RPC Exception caught');
    this.logger.error(`Input Data: ${JSON.stringify(data)}`);
    this.logger.error(`Pattern: ${pattern}`);
    this.logger.error(`Error: ${exception.message}`);
    if (exception.stack) this.logger.error(`Stack: ${exception.stack}`);

    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof RpcException) {
      message = exception.message;
      code = 'RPC_ERROR';
    } else if (exception.name === 'PrismaClientKnownRequestError') {
      code = 'DATABASE_ERROR';
      message = this.handlePrismaError(exception);
    } else if (exception.message) {
      message = exception.message;
      code = 'APPLICATION_ERROR';
    }

    this.logger.error(` Code: ${code}`);
    this.logger.error(`Message: ${message}`);

    return throwError(
      () =>
        new RpcException({
          code,
          message,
          timestamp: new Date().toISOString(),
        }),
    );
  }

  private handlePrismaError(error: any): string {
    switch (error.code) {
      case 'P2002':
        return 'Duplicate entry found';
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Foreign key constraint failed';
      default:
        return 'Database operation failed';
    }
  }
}
