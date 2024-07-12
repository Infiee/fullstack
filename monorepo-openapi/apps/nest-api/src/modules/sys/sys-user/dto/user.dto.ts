import * as v from 'valibot';

export const LoginSchema = v.object({
  username: v.pipe(v.string(), v.minLength(1)),
  password: v.pipe(v.string(), v.minLength(1)),
});

export type LoginInput = v.InferInput<typeof LoginSchema>;

export const LoginDto = createValibotDto(LoginSchema);

export function createValibotDto<
  TInput,
  TOutput,
  TIssue extends v.BaseIssue<unknown>,
>(schema: v.BaseSchema<TInput, TOutput, TIssue>) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    public static create(input: unknown) {
      return v.parse(this.schema, input);
    }
  }

  return AugmentedZodDto as unknown as v.BaseSchema<TInput, TOutput, TIssue>;
}
