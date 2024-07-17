import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  RequestValidationError,
  ResponseValidationError,
  TsRestException,
} from '@ts-rest/nest';
import { FastifyReply } from 'fastify';
import { ApiErrorResult } from './api.exception';
import { TokenExpiredError } from '@nestjs/jwt';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception && exception.constructor && exception.constructor.name) {
      console.log(`异常捕获 instance: ${exception.constructor.name}`);
    }
    if (exception instanceof RequestValidationError) {
      this.requestValidationException(exception, host);
    } else if (exception instanceof ResponseValidationError) {
      this.responseValidationException(exception, host);
    } else if (exception instanceof TokenExpiredError) {
      // 当jwtService.verify 过期的时候
      this.tokenExpiredException(exception, host);
    } else if (exception instanceof HttpException) {
      this.restException(exception, host);
    } else {
      this.catchException(exception, host);
    }
  }

  /** request校验异常 */
  requestValidationException(
    exception: RequestValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const error = exception.body || exception.query || exception.pathParams;
    console.log('error--', error);
    const errMsg = error?.errors
      .map((e) => e.path.join() + e.message)
      .join(' # ');
    response.status(HttpStatus.BAD_REQUEST).send({
      success: false,
      code: -1,
      message: errMsg || exception.message,
    });
  }

  /** rest响应校验异常 */
  responseValidationException(
    exception: ResponseValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const errMsg = exception.error?.errors
      .map((e) => e.path.map((p) => p) + ':' + e.message)
      .join();
    response.status(exception.getStatus() || HttpStatus.BAD_REQUEST).send({
      success: false,
      code: -1,
      message: errMsg || exception.message,
    });
  }

  /** jwt token过期 */
  tokenExpiredException(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(HttpStatus.UNAUTHORIZED).send({
      success: false,
      code: -1,
      message: 'token异常: token已过期,请重新登录' || exception.message,
    });
  }

  /** rest异常 */
  restException(exception: TsRestException<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const restResponse = exception.getResponse() as ApiErrorResult;
    response.status(exception.getStatus() || HttpStatus.BAD_REQUEST).send({
      success: false,
      code: restResponse?.code || -1,
      message: restResponse.message,
    });
  }

  /** 任意异常 */
  catchException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(HttpStatus.BAD_REQUEST).send({
      success: false,
      code: exception.code || -1,
      message: exception.message || exception || '捕获异常',
    });
  }
}
