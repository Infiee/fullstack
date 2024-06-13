import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TsRestException } from '@ts-rest/nest';
import { Injectable } from '@nestjs/common';
import ms from 'ms';
import dayjs from 'dayjs';
import { asc, eq, inArray } from 'drizzle-orm';

import { contract, SystemLoginDto } from '@repo/rest-contract';
import { DrizzleService, schema } from '@/shared/database/drizzle.service';
import { SharedService } from '@/shared/shared.service';
import { AppConfigService } from '@/config/app-config.service';
import { RedisCacheService } from '@/shared/cache/redis-cache.service';
import {
  ACCESS_TOKEN_KEY,
  CAPTCHA_IMAGE_KEY,
  PERSIST_SYSTEM_JWT_PAYLOAD_KEY,
  PERSIST_SYSTEM_USER_KEY,
} from '@/common/constants/cache.constant';
import { generateHash, menuToTree } from '@/common/utils';
import { SelectSystemUserResult, comparePassword } from '@repo/drizzle';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly sharedService: SharedService,
    private readonly redis: RedisCacheService,
    private readonly config: AppConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  get db() {
    return this.drizzle.db;
  }

  /** 生成验证码 */
  async generateCaptcha() {
    const captcha = await this.sharedService.generateCaptcha();
    const uuid = await generateHash();

    await this.redis.set(
      `${CAPTCHA_IMAGE_KEY}:${uuid}`,
      captcha.text,
      this.config.get('CAPTCHA_EXPIRESIN'),
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
    if (this.config.isDevEnv()) {
      return { ...result, captcha: captcha.text };
    }
    return result;
  }

  /** 校验验证码 */
  async validateCaptcha(uuid: string, code: string) {
    const text = await this.redis.get<string>(`${CAPTCHA_IMAGE_KEY}:${uuid}`);
    if (!text) {
      throw new TsRestException(contract.systemAuth.getCaptchaImage, {
        status: 400,
        body: { message: '验证码无效' },
      });
    }
    if (code.toLowerCase() !== text.toLowerCase()) {
      throw new TsRestException(contract.systemAuth.getCaptchaImage, {
        status: 400,
        body: { message: '验证码错误' },
      });
    }
    await this.redis.del(`${CAPTCHA_IMAGE_KEY}:${uuid}`);
  }

  /** 登录 */
  async login(dto: SystemLoginDto) {
    const { username, password, uuid, code } = dto;
    const data = await this.userService.findOne('username', username);
    if (data.length === 0) {
      throw new TsRestException(contract.systemAuth.login, {
        status: 400,
        body: { code: -1, message: '未找到该用户' },
      });
    }
    const { password: userPassword, ...user } = data[0];
    const isEqual = await comparePassword(password, userPassword);
    if (!isEqual) {
      throw new TsRestException(contract.systemAuth.login, {
        status: 400,
        body: { code: -1, message: '用户名或密码错误' },
      });
    }
    await this.validateCaptcha(uuid, code);
    const { accessToken } = await this.setToken(user);
    await this.redis.persistSet(`${PERSIST_SYSTEM_USER_KEY}:${user.id}`, user);
    return { accessToken };
  }

  /** jwt生成token */
  async generateToken(user: SelectSystemUserResult, options?: JwtSignOptions) {
    const payload: JWT.Payload = {
      username: user.username,
      id: user.id,
      expireTime: dayjs()
        .add(ms(this.config.get('JWT_EXPIRESIN')), 'ms')
        .unix(),
    };
    return this.jwtService.sign(payload, options);
  }

  /** 设置token */
  async setToken(user: SelectSystemUserResult) {
    const [accessToken] = await Promise.all([
      this.generateToken(user, {
        secret: this.config.get('JWT_SECRET'),
        // TODO: token设置为不过期
        // expiresIn: this.config.get('JWT_EXPIRESIN'),
      }),
    ]);
    // TODO: redis token设置过期时间
    this.redis.set(
      `${ACCESS_TOKEN_KEY}:${user.id}`,
      accessToken,
      ms(this.config.get('JWT_EXPIRESIN')),
    );
    return { accessToken };
  }

  async getInfo() {
    const payload = await this.redis.get<JWT.Payload>(
      `${PERSIST_SYSTEM_JWT_PAYLOAD_KEY}`,
    );
    const user = await this.redis.get<SelectSystemUserResult>(
      `${PERSIST_SYSTEM_USER_KEY}:${payload!.id}`,
    );

    // const userData = (await this.userService.findById(payload.id))[0];
    // const userRoleRelations = await this.db.query.systemUserToRole.findMany({
    //   where: eq(schema.systemUserToRole.userId, user.id),
    // });
    // const roleIds = userRoleRelations.map((i) => i.roleId);
    // const roles = await this.db.query.systemRole.findMany({
    //   where: inArray(schema.systemRole.id, roleIds),
    // });
    // const data = { user: userData, roles };

    // 聚合为一条查询语句，相比上面分次查询效率高一点
    const relationData = await this.db.query.systemUser.findMany({
      where: eq(schema.systemUser.id, user!.id),
      columns: { password: false },
      with: {
        systemUserToRole: {
          orderBy: [asc(schema.systemUserToRole.roleId)],
          columns: {
            // roleId: false,
            userId: false,
          },
          with: {
            systemRole: true,
            // systemRole: {
            //   with: {
            //     systemMenuToRole: {
            //       orderBy: [asc(schema.systemMenuToRole.menuId)],
            //       columns: {
            //         menuId: false,
            //         roleId: false,
            //       },
            //       with: {
            //         systemMenu: true,
            //       },
            //     },
            //   },
            // },
          },
        },
      },
    });
    const { systemUserToRole, ...userData } = relationData[0];
    const roles: string[] = [];
    const permissions: string[] = [];
    systemUserToRole.map((i) => {
      roles.push(i.systemRole.roleKey);
      // i.systemRole.systemMenuToRole.map((j) => {
      //   data.permissions.push(j.systemMenu.permissionKey);
      // });
    });
    return {
      user: userData,
      roles: roles,
      permissions: permissions,
    };
  }

  async getRouters() {
    const payload = await this.redis.get<JWT.Payload>(
      `${PERSIST_SYSTEM_JWT_PAYLOAD_KEY}`,
    );
    const roleRelations = await this.db.query.systemUserToRole.findMany({
      where: eq(schema.systemUserToRole.userId, payload!.id),
    });
    const roleIds = roleRelations.map((i) => i.roleId);
    if (roleIds.length === 0) return [];

    const menuRelations = await this.db.query.systemMenuToRole.findMany({
      where: inArray(schema.systemMenuToRole.roleId, roleIds),
    });
    const menuIds = menuRelations.map((i) => i.menuId);
    const menus = await this.db.query.systemMenu.findMany({
      where: inArray(schema.systemMenu.id, menuIds),
    });

    // const menus = (await this.db.query.systemUserToRole.findMany({
    //   where: eq(schema.systemUserToRole.userId, payload.id),
    //   with: {
    //     systemRole: {
    //       with: {
    //         systemMenuToRole: {
    //           with: {
    //             systemMenu: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // })) as any;
    // return menus as any;

    // const menus = await this.db.query.systemMenu.findMany({
    //   offset: 0,
    // });
    // const menus = await this.db.select().from(schema.systemMenu);

    // menus.map(menu=>{
    //   menu.roles.map(i=>{
    //     i.role
    //   })
    // })
    return menuToTree(menus);
  }
}
