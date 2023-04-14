import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { AppLogger } from './app.logger';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: AppLogger,
  ) {}

  formatErrors(errors) {
    const object = {};
    for (const err of errors) {
      object[err.property] = {};
      if (err.children && err.children.length) {
        object[err.property].children = this.formatErrors(err.children);
      }
      if (err.constraints) {
        if (typeof err.constraints === 'object') {
          object[err.property].constraints = Object.values(err.constraints);
        } else {
          object[err.property].constraints = err.constraints;
        }
      }
    }
    return object;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception);
    this.logger.error(JSON.stringify(exception));
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus: number;
    let responseBody: any = {};
    if (exception instanceof UnprocessableEntityException) {
      httpStatus = exception.getStatus();
      responseBody = exception.getResponse();
      const errors = responseBody.errors || [];
      responseBody.errors = this.formatErrors(errors);
      responseBody.error = 'Unprocessable Entity';
      responseBody.message = exception.message || 'Invalid data';
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody.message = exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    responseBody.status = httpStatus;
    responseBody.timestamp = new Date().toISOString();
    responseBody.path = httpAdapter.getRequestUrl(ctx.getRequest());
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
