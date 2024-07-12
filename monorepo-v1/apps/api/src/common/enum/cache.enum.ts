export enum CacheEnum {
  /** token */
  ACCESS_TOKEN_KEY = 'access_token',
  REFRESH_TOKEN_KEY = 'refresh_token',

  /** 持久化 */
  PERSIST_SYSTEM_USER_KEY = 'persist:system_user',
  PERSIST_SYSTEM_USER_LOGIN_KEY = 'persist:system_user_login',

  /** 重复提交 */
  REPEAT_SUBMIT_KEY = 'repeat-submit',

  /** 验证码 */
  CAPTCHA_IMAGE_KEY = 'captcha:img',
}
