import { util, ZodErrorMap, ZodIssueCode, ZodParsedType } from 'zod';

export const zodErrorMap: ZodErrorMap = (issue, _ctx) => {
  let message: string;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        // message = '必填项';
        message = `类型${issue.expected},接收到${issue.received}`;
      } else {
        message = `类型${issue.expected},接收到${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `无效的字面值,预期 ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer,
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `对象中存在无法识别的键: ${util.joinValues(issue.keys, ',')}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `无效输入`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `无效的判别值,预期 ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `无效的枚举值,预期 ${util.joinValues(
        issue.options,
      )},实际接收到 '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `无效的函数参数`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `无效的函数返回类型`;
      break;
    case ZodIssueCode.invalid_date:
      message = `无效的日期`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `无效输入: 必须包含 "${issue.validation.includes}"`;

          if (typeof issue.validation.position === 'number') {
            message = `${message} 在大于或等于 ${issue.validation.position} 的一个或多个位置`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `无效输入: 必须以 "${issue.validation.startsWith}" 开头`;
        } else if ('endsWith' in issue.validation) {
          message = `无效输入: 必须以 "${issue.validation.endsWith}" 结尾`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== 'regex') {
        message = `无效的 ${issue.validation}`;
      } else {
        message = '无效';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `数组必须包含 ${
          issue.exact ? '恰好' : issue.inclusive ? `至少` : `多于`
        } ${issue.minimum} 个元素`;
      else if (issue.type === 'string')
        message = `字符串必须包含 ${
          issue.exact ? '恰好' : issue.inclusive ? `至少` : `多于`
        } ${issue.minimum} 个字符`;
      else if (issue.type === 'number')
        message = `数字必须 ${
          issue.exact ? `恰好等于 ` : issue.inclusive ? `大于或等于 ` : `大于 `
        }${issue.minimum}`;
      else if (issue.type === 'date')
        message = `日期必须 ${
          issue.exact ? `恰好等于 ` : issue.inclusive ? `晚于或等于 ` : `晚于 `
        }${new Date(Number(issue.minimum))}`;
      else message = '无效输入';
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `数组必须包含 ${
          issue.exact ? `恰好` : issue.inclusive ? `最多` : `少于`
        } ${issue.maximum} 个元素`;
      else if (issue.type === 'string')
        message = `字符串必须包含 ${
          issue.exact ? `恰好` : issue.inclusive ? `最多` : `少于`
        } ${issue.maximum} 个字符`;
      else if (issue.type === 'number')
        message = `数字必须 ${
          issue.exact ? `恰好等于` : issue.inclusive ? `小于或等于` : `小于`
        } ${issue.maximum}`;
      else if (issue.type === 'bigint')
        message = `BigInt 必须 ${
          issue.exact ? `恰好等于` : issue.inclusive ? `小于或等于` : `小于`
        } ${issue.maximum}`;
      else if (issue.type === 'date')
        message = `日期必须 ${
          issue.exact ? `恰好等于` : issue.inclusive ? `早于或等于` : `早于`
        } ${new Date(Number(issue.maximum))}`;
      else message = '无效输入';
      break;
    case ZodIssueCode.custom:
      message = `无效输入`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `交叉类型结果无法合并`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `数字必须是 ${issue.multipleOf} 的倍数`;
      break;
    case ZodIssueCode.not_finite:
      message = '数字必须是有限的';
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
