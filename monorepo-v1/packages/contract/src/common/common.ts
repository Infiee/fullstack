import { SystemOrderByEnum, SystemStatusEnum } from "@repo/drizzle";
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

/** 基础分页参数 */
export const BasePaginationSchema = z.object({
  pageNum: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});
/** 基础排序参数 */
export const BaseSortSchema = z.object({
  sortBy: z.string().optional(),
  orderBy: z.nativeEnum(SystemOrderByEnum).optional(),
});
/** 基础状态参数 */
export const BaseStatusSchema = z.object({
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
/** 基础分页加排序schema */
export const basePaginationAndSortSchema =
  BasePaginationSchema.merge(BaseSortSchema);

/** 日期 */
export const baseSchema = z.object({
  createTime: z.date().optional(),
  updateTime: z.date().optional(),
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

export type BasePagination = z.infer<typeof BasePaginationSchema>;
export type BaseSort = z.infer<typeof BaseSortSchema>;
export type BasePaginationAndSort = z.infer<typeof basePaginationAndSortSchema>;
