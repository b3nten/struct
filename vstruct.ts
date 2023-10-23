import {
  Nullable,
  Optional,
  safeValidate,
  type Schema,
  type SchemaToInferredTypes,
  Union,
  validate,
  createSchema,
} from "./validate.ts";

export { Nullable, Optional, type Schema, type SchemaToInferredTypes, Union };

export type InferVStructType<T extends new (...args: any[]) => any> = T extends
  new (
    ...args: any[]
  ) => infer U ? U
  : never;

export function VStruct<
  S extends Schema,
>(
  schema: S,
  options = { quiet: false },
) {
  return class {
    constructor(input: any) {
      options.quiet ? safeValidate(schema, input) : validate(schema, input);
      // @ts-ignore yah yah whatever
      return toProxy(schema, input, options.quiet);
    }
  } as unknown as new (
    data: SchemaToInferredTypes<S>,
  ) => SchemaToInferredTypes<S>;
}

