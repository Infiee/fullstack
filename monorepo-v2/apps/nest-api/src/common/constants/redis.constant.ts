import ms from 'ms';

export enum RedisKeys {
  /** Token */
  SYS_ACCESS_TOKEN_KEY = 'sys:access-token',
  SYS_REFRESH_TOKEN_KEY = 'sys:refresh-token',
  /** 持久化用户信息 */
  SYS_USER_KEY = 'sys:user',
  /** 验证码 */
  SYS_CAPTCHA_KEY = 'sys:captcha',
  /** 防重提交 */
  SYS_REPEAT_SUBMIT_KEY = 'sys:repeat-submit',
}

// interface CacheItem {
//   key: RedisKeys;
//   remark: string;
//   expire?: number;
// }

/** 管理台redis缓存 */
export const SYS_CACHE_LIST = [
  {
    key: RedisKeys.SYS_USER_KEY,
    remark: '用户信息',
    expire: ms('1d'),
  },
  {
    key: RedisKeys.SYS_CAPTCHA_KEY,
    remark: '验证码',
  },
  {
    key: RedisKeys.SYS_REPEAT_SUBMIT_KEY,
    remark: '防重提交',
  },
  /** ---- env文件配置 ----- */
  {
    key: RedisKeys.SYS_ACCESS_TOKEN_KEY,
    remark: '用户access token',
  },
  {
    key: RedisKeys.SYS_REFRESH_TOKEN_KEY,
    remark: '用户refresh token',
  },
];

export const getCacheExipre = (key: keyof typeof RedisKeys) =>
  SYS_CACHE_LIST.find((i) => i.key === RedisKeys[key])?.expire;
