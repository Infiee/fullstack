import { customAlphabet, nanoid } from 'nanoid';
// V4 不支持commonjs
// https://github.com/ai/nanoid#readme
// 查看重复率 https://zelark.github.io/nano-id-cc/

/**
 * 生成随机Hash
 * 包含数字、小写字母
 * @param size 长度
 * @param prefix 前缀
 * @returns string 不保证长度满足
 */
export function generateHash(size = 16, prefix?: string): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, size);
  if (prefix) return `${prefix}${nanoid()}`;
  return nanoid();
}

/**
 * 生成随机字符串
 * 包含数字、大小写字母、下划线、横杠
 * @param size 长度
 * @param prefix 前缀
 * @returns string 不保证长度满足
 */
export function generateString(size: number, prefix?: string): string {
  if (prefix) return `${prefix}${nanoid(size)}`;
  return nanoid(size);
}

/**
 * 随机数 纯数字0-9
 * @param size 长度
 * @returns number
 */
export function generateNumber(size: number): number {
  let result = '';
  for (let i = 0; i < size; i++) {
    const digit = Math.floor(Math.random() * 10);
    result += digit.toString();
  }
  return parseInt(result);
}

/**
 * @description: 生成随机数
 * @param {number} length
 * @param {*} placeholder
 * @return {*}
 */
export function generateRandomValue(
  length: number,
  placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
): string {
  const customNanoid = customAlphabet(placeholder, length);
  return customNanoid();
}
