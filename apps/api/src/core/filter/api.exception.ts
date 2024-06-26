/**
 * @ Author: fei.wong
 * @ Create Time: 2024-03-12 10:27:21
 * @ Description:
 * @ Modified by: fei.wong
 * @ Modified time: 2024-06-26 17:53:54
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
  success?: boolean;
  data?: any;
  code?: ErrorMessageKey;
  message: ErrorMessageMapType[ErrorMessageKey] | string;
};

export class ApiException extends HttpException {
  constructor(
    response: ApiErrorResult | string | number,
    statusCode?: HttpStatus,
  ) {
    let result = {} as ApiErrorResult;
    if (typeof response === 'number') {
      result = {
        success: false,
        code: response as ErrorMessageKey,
        message: ErrorMessageMap[response] || '未知Api异常信息',
        data: null,
      };
    } else if (typeof response === 'object') {
      result = response;
    } else {
      result = {
        success: false,
        code: ErrorCode.COMMON,
        message: response,
        data: null,
      };
    }
    super(result, statusCode || HttpStatus.OK);
  }

  public forbidden() {
    throw new ApiException({
      message: ErrorMessageMap[ErrorCode.FORBIDDEN],
      code: ErrorCode.FORBIDDEN,
    });
  }
}
