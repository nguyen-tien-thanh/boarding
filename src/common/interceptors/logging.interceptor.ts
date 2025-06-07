import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Log');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();

    if (contextType === 'rpc') return this.handleRpcCall(context, next);

    return next.handle();
  }

  private handleRpcCall(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const rpcContext = context.switchToRpc();
    const handler = context.getHandler();
    const className = context.getClass().name;
    const methodName = handler.name;

    const data = rpcContext.getData();

    const reqId = this.generateRequestId();
    this.logger.log(
      `[${reqId}] ${className}.${methodName}: ${JSON.stringify(data)}`,
    );

    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const time = Date.now() - startTime;
        this.logger.debug(
          `[${reqId}] ${className}.${methodName}: ${JSON.stringify(response)} \x1b[33m+${time}ms\x1b[0m`,
        );
      }),
      catchError((error) => {
        const time = Date.now() - startTime;
        this.logger.error(
          `[${reqId}] ${className}.${methodName}: ${error.message} (${time}ms)`,
        );
        this.logger.debug(
          `[${reqId}] ${className}.${methodName}: ${JSON.stringify(error)}`,
        );

        return throwError(() => error);
      }),
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
