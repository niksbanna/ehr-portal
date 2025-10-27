import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../dto/response.dto';

/**
 * Global exception filter to ensure consistent error response format
 * Handles different types of errors and maps them to appropriate HTTP status codes
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      // Handle Prisma errors
      if (exception.name === 'PrismaClientKnownRequestError') {
        const prismaError = exception as any;
        status = this.handlePrismaError(prismaError);
        message = this.getPrismaErrorMessage(prismaError);
        error = 'Database Error';
      } 
      // Handle validation errors
      else if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        error = 'Validation Error';
      }
      // Handle JWT errors
      else if (exception.name === 'JsonWebTokenError' || exception.name === 'TokenExpiredError') {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message;
        error = 'Authentication Error';
      }
      // Handle other known errors
      else {
        message = exception.message;
        error = exception.name;
      }
    }

    // Log errors for monitoring (exclude 4xx client errors from error logs)
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
      );
    }

    const errorResponse = new ErrorResponse(
      status,
      message,
      error,
      request.url,
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Map Prisma error codes to HTTP status codes
   */
  private handlePrismaError(error: any): number {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return HttpStatus.CONFLICT;
      case 'P2025': // Record not found
        return HttpStatus.NOT_FOUND;
      case 'P2003': // Foreign key constraint violation
        return HttpStatus.BAD_REQUEST;
      case 'P2014': // Invalid ID
        return HttpStatus.BAD_REQUEST;
      case 'P2021': // Table does not exist
      case 'P2022': // Column does not exist
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get user-friendly error messages for Prisma errors
   */
  private getPrismaErrorMessage(error: any): string {
    switch (error.code) {
      case 'P2002':
        return `A record with this ${error.meta?.target?.[0] || 'field'} already exists`;
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Invalid reference: related record does not exist';
      case 'P2014':
        return 'Invalid ID provided';
      default:
        return 'Database operation failed';
    }
  }
}
