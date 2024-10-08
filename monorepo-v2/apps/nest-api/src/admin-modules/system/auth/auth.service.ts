import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import ms from 'ms';
import dayjs from 'dayjs';
import { asc, eq, sql } from 'drizzle-orm';

import {
  SystemLoginDto,
  SelectSystemUserResult,
  SystemStatusEnum,
} from '@repo/shared';
import { SharedService } from '@/shared/shared.service';
import { AppConfigService } from '@/config/app-config.service';
import { RedisCacheService } from '@/shared/cache/redis-cache.service';
import { generateHash, menuToTree } from '@/common/utils';
import { SystemUserService } from '../user/user.service';
import { comparePassword } from '@/common/utils/password';
import { ApiException } from '@/core/filter/api-exception';
import { ErrorCode } from '@/common/constants/err-code.constant';
import { FastifyRequest } from 'fastify';
import { ADMIN_PERMISSION } from '@/common/constants/admin.constant';
import { DB_CLIENT, DrizzleDB, schemas } from '@/shared/drizzle/drizzle.module';
import { RedisKeys, getCacheExipre } from '@/common/constants/redis.constant';

@Injectable()
export class SystemAuthService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: DrizzleDB,
    private readonly sharedService: SharedService,
    private readonly redis: RedisCacheService,
    private readonly config: AppConfigService,
    private readonly userService: SystemUserService,
    private readonly jwtService: JwtService,
  ) {}

  /** 生成验证码 */
  async generateCaptcha() {
    const captcha = await this.sharedService.generateCaptcha();
    const uuid = generateHash();

    await this.redis.set(
      `${RedisKeys.SYS_CAPTCHA_KEY}:${uuid}`,
      captcha.text,
      this.config.get('CAPTCHA_EXPIRE'),
    );
    const result = {
      // img: svgToMiniDataURI(captcha.data),
      img:
        'data:image/svg+xml;base64,' +
        Buffer.from(captcha.data).toString('base64'),
      // img: captcha.data,
      uuid,
    };
    // TODO: 开发环境：返回结果
    if (this.config.isDevEnv) {
      return { ...result, captcha: captcha.text };
    }
    return result;
  }

  /** 校验验证码 */
  async validateCaptcha(uuid: string, code: string) {
    const text = await this.redis.get<string>(
      `${RedisKeys.SYS_CAPTCHA_KEY}:${uuid}`,
    );
    if (!text) throw new ApiException(ErrorCode.CAPTCHA_IN_VALID);
    if (code.toLowerCase() !== text.toLowerCase()) {
      throw new ApiException(ErrorCode.CAPTCHA_ERROR);
    }
    await this.redis.del(`${RedisKeys.SYS_CAPTCHA_KEY}:${uuid}`);
  }

  /** 登录 */
  async login(dto: SystemLoginDto, clientInfo: any) {
    const { username, password, uuid, code } = dto;
    const data = await this.userService.findOne('username', username);
    if (data.length === 0) throw new ApiException(ErrorCode.USER_NOT_FOUND);

    const { password: userPassword, ...user } = data[0];
    const isEqual = await comparePassword(password, userPassword);
    if (!isEqual) throw new ApiException(ErrorCode.USER_PASSWORD_ERROR);
    if (user.status === SystemStatusEnum['DISABLED']) {
      throw new ApiException(ErrorCode.USER_DISABLED);
    }

    await this.validateCaptcha(uuid, code);
    const uid = generateHash();
    const token = await this.setToken(user, uid);
    const metaData = {
      meta: { ...clientInfo },
      ...user,
    };
    // TODO: 单用户单端登录
    // await this.redis.persistSet(`${CacheEnum.PERSIST_SYSTEM_USER_KEY}:${user.id}`, user);
    // TODO: 单用户多端登录
    // await this.redis.persistSet(
    //   `${CacheEnum.PERSIST_SYSTEM_USER_KEY}:${user.id}`,
    //   metaData,
    // );
    this.redis.set(
      `${RedisKeys.SYS_USER_KEY}:${user.id}`,
      metaData,
      getCacheExipre('SYS_USER_KEY'),
    );

    const roles = await this.userService.getRoles(user.id);
    const { avatar, nickname } = user;
    return { ...token, roles, username, avatar, nickname };
  }

  /** jwt生成token */
  async generateToken(payload: JWT.Payload, options?: JwtSignOptions) {
    // const payload: JWT.Payload = {
    //   username: payload.username,
    //   id: payload.id,
    //   expireTime: dayjs()
    //     .add(ms(this.config.get('JWT_EXPIRESIN')), 'ms')
    //     .unix(),
    // };
    return this.jwtService.sign(payload, options);
  }

  /** 刷新token */
  async refreshToken(refreshToken: string) {
    const payload: JWT.Payload = await this.jwtService.verify(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    // 获取缓存的token
    const cacheRefreshToken = await this.redis.get<string>(
      `${RedisKeys.SYS_REFRESH_TOKEN_KEY}:${payload.id}`,
    );
    if (refreshToken !== cacheRefreshToken) {
      throw new UnauthorizedException('refreshToken已失效,请重新登录');
    }
    const user = await this.redis.get<SelectSystemUserResult>(
      `${RedisKeys.SYS_USER_KEY}:${payload.id}`,
    );
    if (!user) throw new ApiException('redis用户不存在');
    const uid = await generateHash();
    return this.setToken(user, uid);
  }

  /** TODO: 设置双token */
  async setToken(user: SelectSystemUserResult, uuid: string) {
    const payload: JWT.Payload = { id: user.id, uuid };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRESIN'),
      }),
      this.generateToken(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRESIN'),
      }),
    ]);
    const expires = this.jwtService.decode<JWT.VerifyPayload>(accessToken);
    console.log('decode expires--', expires);
    this.redis.set(
      `${RedisKeys.SYS_ACCESS_TOKEN_KEY}:${user.id}:${uuid}`,
      accessToken,
      ms(this.config.get('JWT_EXPIRESIN')),
    );
    this.redis.set(
      `${RedisKeys.SYS_REFRESH_TOKEN_KEY}:${user.id}:${uuid}`,
      refreshToken,
      ms(this.config.get('JWT_REFRESH_EXPIRESIN')),
    );
    return {
      accessToken,
      refreshToken,
      expires: dayjs.unix(expires.exp).valueOf(),
    };
  }

  /** TODO: 设置单token */
  // async setSingleToken(user: SelectSystemUserResult) {
  //   const accessToken = await this.generateToken(user, {
  //     secret: this.config.get('JWT_SECRET'),
  //     // TODO: token设置为不过期
  //     // expiresIn: this.config.get('JWT_EXPIRESIN'),
  //   });
  //   this.redis.set(
  //     `${ACCESS_TOKEN_KEY}:${user.id}`,
  //     accessToken,
  //     ms(this.config.get('JWT_EXPIRESIN')),
  //   );
  //   return { accessToken };
  // }

  /** 获取用户信息 */
  async getInfo(req: FastifyRequest) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('未获取到user信息,请重新登录');

    // 聚合为一条查询语句，相比分次查询效率高一点
    const [user, relationData] = await Promise.all([
      this.db.query.systemUser.findMany({
        where: eq(schemas.systemUser.id, userId),
        columns: { password: false },
      }),
      this.db.query.systemUserToRole.findMany({
        where: eq(schemas.systemUserToRole.userId, userId),
        columns: {},
        with: {
          systemRole: {
            with: {
              systemMenuToRole: {
                orderBy: [asc(schemas.systemMenuToRole.menuId)],
                columns: {},
                with: { systemMenu: true },
              },
            },
          },
        },
      }),
    ]);
    const { roles, permissions } = relationData.reduce<{
      roles: string[];
      permissions: string[];
    }>(
      (acc, item) => {
        acc.roles.push(item.systemRole.code);
        item.systemRole.systemMenuToRole.forEach((menuToRole) => {
          if (menuToRole.systemMenu.auths) {
            acc.permissions.push(menuToRole.systemMenu.auths);
          }
        });
        return acc;
      },
      { roles: [], permissions: [] },
    );

    return {
      user: user[0],
      roles: roles,
      permissions: this.sharedService.isAdmin(userId)
        ? [ADMIN_PERMISSION]
        : permissions,
    };
  }

  // async getInfo(req: FastifyRequest) {
  //   const userId = req.user?.id;
  //   if (!userId) throw new UnauthorizedException('未获取到user信息,请重新登录');

  //   // 聚合为一条查询语句，相比分次查询效率高一点
  //   const relationData = await this.db.query.systemUser.findMany({
  //     where: eq(schemas.systemUser.id, userId),
  //     columns: { password: false },
  //     with: {
  //       dept: true,
  //       systemUserToRole: {
  //         orderBy: [asc(schemas.systemUserToRole.roleId)],
  //         columns: {},
  //         with: {
  //           systemRole: {
  //             with: {
  //               systemMenuToRole: {
  //                 orderBy: [asc(schemas.systemMenuToRole.menuId)],
  //                 columns: {},
  //                 with: { systemMenu: true },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   const { systemUserToRole, ...user } = relationData[0];
  //   const { roles, permissions } = systemUserToRole.reduce<{
  //     roles: string[];
  //     permissions: string[];
  //   }>(
  //     (acc, item) => {
  //       acc.roles.push(item.systemRole.code);
  //       item.systemRole.systemMenuToRole.forEach((menuToRole) => {
  //         if (menuToRole.systemMenu.auths) {
  //           acc.permissions.push(menuToRole.systemMenu.auths);
  //         }
  //       });
  //       return acc;
  //     },
  //     { roles: [], permissions: [] },
  //   );
  //   return {
  //     user: user,
  //     roles: roles,
  //     permissions: this.sharedService.isAdmin(userId)
  //       ? [ADMIN_PERMISSION]
  //       : permissions,
  //   };
  // }

  /** 获取路由信息 */
  async getRouters(req: FastifyRequest) {
    if (!req.user) {
      throw new ApiException('获取req用户信息不存在');
    }
    const userId = req.user.id;
    // 管理员
    const isAdmin = this.sharedService.isAdmin(userId);
    // TODO：权限判断 - 管理员 - 获取所有菜单
    if (isAdmin) {
      const menus = await this.db.query.systemMenu.findMany({
        // orderBy: [asc(schemas.systemMenu.parentId), asc(schemas.systemMenu.rank)],
        orderBy: sql`${schemas.systemMenu.parentId} asc nulls first,${schemas.systemMenu.rank} asc`,
      });
      return menuToTree(menus);
    }
    // 非管理员
    const relationData = await this.db.query.systemUserToRole.findMany({
      where: eq(schemas.systemUserToRole.userId, userId),
      columns: {},
      with: {
        systemRole: {
          columns: {},
          with: {
            systemMenuToRole: {
              columns: {},
              with: { systemMenu: true },
            },
          },
        },
      },
    });
    const menus = relationData.flatMap((menu) =>
      menu.systemRole.systemMenuToRole.map((role) => role.systemMenu),
    );
    return menuToTree(menus);
  }
}
