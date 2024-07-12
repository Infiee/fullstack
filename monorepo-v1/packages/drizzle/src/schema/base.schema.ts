import { integer, smallint, text, timestamp } from 'drizzle-orm/pg-core';
import { SystemStatusEnum } from '../enum';

export const baseDateColumns = {
  createTime: timestamp('create_time', { precision: 3 }).notNull().defaultNow(),
  updateTime: timestamp('update_time', { precision: 3 })
    .notNull()
    .$onUpdateFn(() => new Date()),

  // TODO: 以时间戳的方式
  // createTime: integer('create_time')
  //   .notNull()
  //   .default(sql`extract(epoch from now())`),
  // updateTime: integer('update_time')
  //   .notNull()
  //   .default(sql`extract(epoch from now())`)
  //   .$onUpdateFn(() => sql`extract(epoch from now())`),
};

export const baseStatusColumns = {
  // status: text('status', { enum: SystemStatusEnum }).notNull(),
  status: smallint("status").notNull(),
};
