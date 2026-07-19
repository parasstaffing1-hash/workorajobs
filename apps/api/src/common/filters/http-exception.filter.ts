import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        message,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getStatus(exception: unknown) {
    if (exception instanceof HttpException) return exception.getStatus();
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === "P2002"
    ) {
      return HttpStatus.CONFLICT;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === "string") return response;
      if (
        typeof response === "object" &&
        response !== null &&
        "message" in response
      ) {
        const message = (response as { message: string | string[] }).message;
        return Array.isArray(message) ? message.join(", ") : message;
      }
      return exception.message;
    }

    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === "P2002"
    ) {
      return "A record with that unique value already exists.";
    }

    return "Internal server error";
  }
}
