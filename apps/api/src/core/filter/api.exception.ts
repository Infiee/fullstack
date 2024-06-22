/**
 * @ Author: fei.wong
 * @ Create Time: 2024-03-12 10:27:21
 * @ Description:
 * @ Modified by: fei.wong
 * @ Modified time: 2024-06-17 18:29:57
 *
 * 用法：
 * throw new ApiException(ErrorCode.CAPTCHA_IN_VALID);
 * throw new ApiException("自定义消息");
 * throw new ApiException({code: ErrorCode.CAPTCHA_IN_VALID, message: "自定义消息"});
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ErrorCode,
  ErrorMessageMap,
  ErrorMessageKey,
  ErrorMessageMapType,
} from '@/common/constants/err-code.constants';

export type ApiErrorResult = {
  data?: any;
  code?: ErrorMessageKey;
  message: ErrorMessageMapType[ErrorMessageKey] | string;
};

export class ApiException extends HttpException {
  constructor(response: ApiErrorResult | string, statusCode?: HttpStatus) {
    let result = response as ApiErrorResult;
    if (typeof response === 'string') {
      if (ErrorMessageMap[response]) {
        result = {
          code: response as ErrorMessageKey,
          message: ErrorMessageMap[response],
        };
      } else {
        result = {
          code: ErrorCode.COMMON,
          message: response,
        };
      }
    }
    super(result, statusCode || HttpStatus.OK);
  }

  forbidden() {
    throw new ApiException({
      message: ErrorMessageMap[ErrorCode.FORBIDDEN],
      code: ErrorCode.FORBIDDEN,
    });
  }
}
