import path from 'node:path';

// 依赖来源 https://gitee.com/lionsoul/ip2region
// https://www.npmjs.com/package/@types/node-ip2region
// https://github.com/lionsoul2014/ip2region/tree/master/binding/nodejs

// 读取xdb工具包
import { loadContentFromFile, newWithBuffer } from './binding';
// 指定ip2region数据文件路径
const dbPath = path.join(process.cwd(), 'data', 'ip2region.xdb');
// 读取文件Buffer缓存
const ip2regionBuffer = loadContentFromFile(dbPath);
// 检索实例
const searcher = newWithBuffer(ip2regionBuffer);
// 网络地址(内网)
const LOCAT_HOST = '127.0.0.1';

/**
 * 查询IP所在地
 * @param ip ip地址 218.4.167.70
 * @returns 返回结果 国家|区域|省份|城市|ISP
 * {"region":"中国|0|江苏省|苏州市|电信","ioCount":0,"took":326.8}
 */
export async function getRegionSearchByIp(ip: string): Promise<{
  region: string;
  ioCount: number;
  took: number;
}> {
  let data = { region: '0|0|0|0|0', ioCount: 0, took: 0 };
  ip = getClientIP(ip);
  if (ip === LOCAT_HOST) {
    data.region = '0|0|0|内网IP|内网IP';
  }
  try {
    data = await searcher.search(ip);
  } catch (e: any) {
    console.error('getRegionSearchByIp err =>', e.message);
  }
  return data;
}

/**
 * 获取地址IP所在地
 * @param ip ip地址 218.4.167.70
 * @returns 返回结果 江苏省 苏州市
 */
export async function getRealAddressByIp(ip: string): Promise<string> {
  ip = getClientIP(ip);
  if (ip === LOCAT_HOST) {
    return '内网IP';
  }
  try {
    const { region } = await searcher.search(ip);
    if (region) {
      const [, , province, city] = region.split('|');
      if (province === '0' && city !== '0') {
        return city;
      }
      return `${province} ${city}`;
    }
  } catch (e: any) {
    console.error('getRealAddressByIp err =>', e.message);
  }
  // 未知IP
  return '未知';
}

/**
 * 处理客户端IP地址显示iPv4
 * @param ip ip地址 ::1
 * @returns 返回结果 iPv4
 */
export function getClientIP(ip: string): string {
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  if (ip === LOCAT_HOST || ip === '::1') {
    return LOCAT_HOST;
  }
  return ip;
}
