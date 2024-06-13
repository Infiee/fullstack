import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/zh-CN/zod.json";

export function setErrorMap() {
  i18next.init({
    lng: "zh-CN",
    resources: {
      "zh-CN": { zod: translation },
    },
  });
  z.setErrorMap(zodI18nMap);
}

// import { z } from "zod";
// export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
//   console.log('issue--',issue)
//   console.log('ctx--',ctx)
//   if (issue.code === z.ZodIssueCode.invalid_type) {
//     if (issue.expected === "string") {
//       return { message: "bad type!" };
//     }
//   }
//   if (issue.code === z.ZodIssueCode.custom) {
//     return { message: `less-than-${(issue.params || {}).minimum}` };
//   }
//   return { message: ctx.defaultError };
// };
// z.setErrorMap(customErrorMap)
