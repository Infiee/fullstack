export class ApiResult<T> {
  success: boolean;
  message: string;
  data: T;

  constructor(success = true, data: T, message = '') {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message: string = '成功'): ApiResult<T> {
    return new ApiResult(true, data, message);
  }

  static fail<T>(data: T, message: string = '失败'): ApiResult<T> {
    return new ApiResult(false, data, message);
  }
}
