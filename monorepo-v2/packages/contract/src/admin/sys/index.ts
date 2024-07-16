import { sysAuth } from './sys-auth'
import { sysUser } from './sys-user'
import { sysRole } from './sys-role'
import { sysMenu } from './sys-menu'
import { sysDept } from './sys-dept'

export const sysModule = {
  sysAuth,
  sysUser,
  sysRole,
  sysMenu,
  sysDept,
}

export * from './sys-auth'
export * from './sys-user'
export * from './sys-role'
export * from './sys-menu'
export * from './sys-dept'