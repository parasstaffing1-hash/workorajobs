import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`,
        );
      }),
      catchError((error: unknown) => {
        this.logger.warn(
          `${request.method} ${request.originalUrl} failed after ${Date.now() - startedAt}ms`,
        );
        return throwError(() => error);
      }),
    );
  }
}
