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
// import { ThrottlerException } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';
import { fromZodError } from 'zod-validation-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      // if (exception instanceof ThrottlerException) {
      //   this.catchThrottlerException(exception, host);
      // } else {
      //   this.catchHttpException(exception, host);
      // }
      if (exception instanceof RequestValidationError) {
        this.catchZodException(exception, host);
      } else if (exception instanceof ResponseValidationError) {
        this.catchResponseException(exception, host);
      } else {
        // console.log('http异常', exception);
        this.catchRestException(exception, host);
      }
      if (exception && exception.constructor && exception.constructor.name) {
        console.log(`异常捕获 instance: ${exception.constructor.name}`);
      }
    } else {
      this.catchException(exception, host);
    }
  }

  catchException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(HttpStatus.BAD_REQUEST).send({
      code: -1,
      message: exception.message || exception || '捕获异常',
    });
  }

  catchZodException(exception: RequestValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // console.log('zod错误--', exception);
    const error = exception.body || exception.query || exception.pathParams;
    response.status(HttpStatus.BAD_REQUEST).send({
      code: -1,
      // message: exception.body.errors[0].message,
      message: error
        ? fromZodError(error, { prefix: null }).toString()
        : exception.message,
    });
  }

  catchResponseException(
    exception: ResponseValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(exception.getStatus() || HttpStatus.BAD_REQUEST).send({
      code: -1,
      message: fromZodError(exception.error).toString(),
    });
  }

  catchRestException(exception: TsRestException<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const restResponse = exception.getResponse() as {
      code: number;
      message: string;
    };

    response.status(exception.getStatus() || HttpStatus.BAD_REQUEST).send({
      code: restResponse?.code || -1,
      message: exception.message,
    });
  }

  // catchHttpException(exception: HttpException, host: ArgumentsHost) {
  //   const ctx = host.switchToHttp();
  //   const response = ctx.getResponse();
  //   // const request = ctx.getRequest();
  //   const status = exception.getStatus();
  //   const responseData = exception.getResponse() as ApiErrorResult;

  //   response.status(status).json({
  //     ...(responseData.data ? { data: responseData.data } : {}),
  //     code: responseData.code || ErrorCode.COMMON,
  //     message: responseData.message,
  //     error: exception,
  //   });
  // }

  // catchThrottlerException(exception: HttpException, host: ArgumentsHost) {
  //   // console.log('捕获了异常:', exception);
  //   const ctx = host.switchToHttp();
  //   const response = ctx.getResponse();
  //   const status = exception.getStatus();
  //   // const responseData = exception.getResponse();
  //   response.status(status).json({
  //     code: ErrorCode.COMMON,
  //     message: '短期内请求次数过多，请稍后再试',
  //     error: exception,
  //   });
  // }
}
