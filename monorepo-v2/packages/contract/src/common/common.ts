import { SystemOrderByEnum, SystemStatusEnum } from "./enum";
import { ZodNumber, ZodTypeAny, z } from "zod";

/** api result */
export const apiResultSchema = <T extends ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string(),
    code: z.number().optional(),
  });
};
export type ApiResultType = z.infer<ReturnType<typeof apiResultSchema<any>>>;

/** 路由元数据 */
export type RouterMetadata = {
  openApiTags: string[];
};

/** 分页 */
export const basePaginationSchema = z.object({
  pageNum: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

/** 排序 */
export const baseSortSchema = z.object({
  sortBy: z.string().optional(),
  orderBy: z.nativeEnum(SystemOrderByEnum).optional(),
});

/** 状态 */
export const baseStatusSchema = z.object({
  // status: z.enum(SystemStatusEnum).nullish(),
  // status: z.nativeEnum(SystemStatusEnum).optional(),
  status: z.preprocess((val) => {
    if (typeof val === "string") {
      // 尝试将字符串转换为数字
      const num = Number(val);
      return isNaN(num) ? val : num;
    }
    return val;
  }, z.nativeEnum(SystemStatusEnum).optional()),
});

/** 分页加排序 */
export const basePaginationAndSortSchema =
  basePaginationSchema.merge(baseSortSchema);

/** 日期 */
export const baseSchema = z.object({
  createTime: z.string().datetime().optional(),
  updateTime: z.string().datetime().optional(),
  // TODO: number时间戳格式
  // createTime: z.number().optional(),
  // updateTime: z.number().optional(),
});

/** 自定义数字字符串校验 */
export function numericString(schema: ZodNumber) {
  return z.preprocess((val) => {
    if (typeof val === "string") {
      return parseInt(val, 10);
    } else if (typeof val === "number") {
      return val;
    } else {
      return undefined;
    }
  }, schema);
}

export type BasePagination = z.infer<typeof basePaginationSchema>;
export type BaseSort = z.infer<typeof baseSortSchema>;
export type BasePaginationAndSort = z.infer<typeof basePaginationAndSortSchema>;
