import { VStruct } from "./vstruct.ts";

const IS_UNION = Symbol("is_union");
const IS_OPTIONAL = Symbol("is_optional");
const IS_NULLABLE = Symbol("is_nullable");
const IS_ANY = Symbol("is_any");
const IS_UNKNOWN = Symbol("is_unknown");
const IS_NEVER = Symbol("is_never");

type Nullable<T> = {
  [IS_NULLABLE]: true;
  type: T;
};

type Optional<T> = {
  [IS_OPTIONAL]: true;
  type: T;
};

type Union<T extends any[]> = {
  [IS_UNION]: true;
  types: T;
};

type Any = {
  [IS_ANY]: true;
};

type Unknown = {
  [IS_UNKNOWN]: true;
};

type Never = {
  [IS_NEVER]: true;
};

export type SchemaPrimitives =
  | string
  | number
  | boolean
  | bigint
  | undefined
  | null
  | symbol;

type SchemaTypeConstructors =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | DateConstructor
  | ObjectConstructor
  | FunctionConstructor
  | MapConstructor
  | SetConstructor
  | WeakMapConstructor
  | WeakSetConstructor
  | ArrayBufferConstructor
  | DataViewConstructor
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

export type Schema =
  | {
    [key: string | number]:
      | SchemaPrimitives
      | SchemaTypeConstructors
      | Schema
      | Schema[];
  }
  | SchemaPrimitives
  | SchemaTypeConstructors
  | Schema[];

type OptionalKeys<T> = {
  [K in keyof T]: T[K] extends Optional<any> ? K
    : T[K] extends Never ? K : never;
}[keyof T];

type NonOptional<T> = Exclude<keyof T, OptionalKeys<T>>;

export type SchemaToInferredTypes<T> = T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : T extends BooleanConstructor ? boolean
  : T extends Nullable<infer U>
    ? SchemaToInferredTypes<U> | null | undefined | void
  : T extends Optional<infer U> ? SchemaToInferredTypes<U>
  : T extends Union<infer U> ? SchemaToInferredTypes<U[number]>
  : T extends Any ? any
  : T extends Unknown ? unknown
  : T extends Never ? never
  : T extends Array<infer U> ? SchemaToInferredTypes<U>[]
  : T extends Record<string | number | symbol, any> ? MapSchemaTypes<T>
  : T;

type MapSchemaTypes<T extends Schema> =
  & {
    [K in NonOptional<T>]: SchemaToInferredTypes<T[K]>;
  }
  & {
    [K in OptionalKeys<T>]?: SchemaToInferredTypes<T[K]>;
  };

export type InferSchemaType<T extends Schema> = MapSchemaTypes<T>;

const proxyCache = new WeakMap();
export function createDeepOnChangeProxy<T>(
  target: T,
  schema: Schema,
  quiet = false,
) {
  //@ts-ignore
  return new Proxy(target, {
    get(target, property) {
      //@ts-ignore
      const item = target[property];
      if (item && typeof item === "object") {
        if (proxyCache.has(item)) return proxyCache.get(item);
        //@ts-ignore
        const proxy = createDeepOnChangeProxy(item, schema[property]);
        proxyCache.set(item, proxy);
        return proxy;
      }
      return item;
    },
    set(target, property, newValue) {
      try {
        //@ts-ignore
        validate(schema[property], newValue);
      } catch {
        return quiet;
      }
      //@ts-ignore
      target[property] = newValue;
      return true;
    },
  });
}

const schemaConstructorMap = {
  String: (input: unknown) => typeof input === "string",
  Number: (input: unknown) => typeof input === "number",
  Boolean: (input: unknown) => typeof input === "boolean",
  BigInt: (input: unknown) => typeof input === "bigint",
  Symbol: (input: unknown) => typeof input === "symbol",
  Date: (input: unknown) => input instanceof Date,
  Object: (input: unknown) => typeof input === "object",
  Function: (input: unknown) => typeof input === "function",
  Map: (input: unknown) => input instanceof Map,
  Set: (input: unknown) => input instanceof Set,
  WeakMap: (input: unknown) => input instanceof WeakMap,
  WeakSet: (input: unknown) => input instanceof WeakSet,
  ArrayBuffer: (input: unknown) => input instanceof ArrayBuffer,
  DataView: (input: unknown) => input instanceof DataView,
  Int8Array: (input: unknown) => input instanceof Int8Array,
  Uint8Array: (input: unknown) => input instanceof Uint8Array,
  Uint8ClampedArray: (input: unknown) => input instanceof Uint8ClampedArray,
  Int16Array: (input: unknown) => input instanceof Int16Array,
  Uint16Array: (input: unknown) => input instanceof Uint16Array,
  Int32Array: (input: unknown) => input instanceof Int32Array,
  Uint32Array: (input: unknown) => input instanceof Uint32Array,
  Float32Array: (input: unknown) => input instanceof Float32Array,
  Float64Array: (input: unknown) => input instanceof Float64Array,
};

export function createSchema<T extends Schema>(schema: T): T {
  return schema;
}

export function isSchemaPrimitive(input: unknown): input is SchemaPrimitives {
  return typeof input === "string" || typeof input === "number" ||
    typeof input === "boolean" || typeof input === "bigint";
}

export function isNull(input: unknown): input is null {
  return input === null;
}

export function isFunction(input: unknown): input is Function {
  return typeof input === "function";
}

function isNullableHelper(input: unknown): input is Nullable<unknown> {
  return typeof input === "object" && input !== null && IS_NULLABLE in input;
}

function isOptionalHelper(input: unknown): input is Optional<unknown> {
  return typeof input === "object" && input !== null && IS_OPTIONAL in input;
}

function isUnionHelper(input: unknown): input is Union<unknown[]> {
  return typeof input === "object" && input !== null && IS_UNION in input;
}

export function isAny(input: unknown): input is Any {
  return typeof input === "object" && input !== null && IS_ANY in input;
}

export function isUnknown(input: unknown): input is Unknown {
  return typeof input === "object" && input !== null && IS_UNKNOWN in input;
}

export function isNever(input: unknown): input is Never {
  return typeof input === "object" && input !== null && IS_NEVER in input;
}

export function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

export function isObject(input: unknown): input is object {
  return typeof input === "object" && input !== null;
}

export function Nullable<T>(type: T) {
  return {
    [IS_NULLABLE]: true,
    type,
  } as Nullable<T>;
}

export function Optional<T>(type: T) {
  return {
    [IS_OPTIONAL]: true,
    type,
  } as Optional<T>;
}

export function Union<T extends any[]>(...types: T) {
  return {
    [IS_UNION]: true,
    types,
  } as Union<T>;
}

export const Any: Any = {
  [IS_ANY]: true,
};

export const Unknown: Unknown = {
  [IS_UNKNOWN]: true,
};

export const Never: Never = {
  [IS_NEVER]: true,
};

export function validate<T>(schema: Schema, input: T) {
  function validateImpl(schema: unknown, input: unknown) {
    if (typeof schema === "undefined" && typeof input !== "undefined") {
      throw new Error(
        `Validation error: Expected undefined but got ${typeof input}`,
      );
    }
    if (isNull(schema)) {
      if (!isNull(input)) {
        throw new Error(
          `Validation error: Expected null but got ${typeof input}`,
        );
      }
      return;
    }
    if (isFunction(schema)) {
      // @ts-ignore yah yah whatever
      if (!schemaConstructorMap[schema.name]?.(input)) {
        throw new Error(
          `Validation error: Expected ${schema.name} but got ${typeof input}`,
        );
      }
      return;
    }
    if (isArray(schema)) {
      if (!isArray(input)) {
        throw new Error(
          `Validation error: Expected array but got ${typeof input}`,
        );
      }
      if (input.length === 0) return;
      for (const item of input) {
        validateImpl(schema[0], item);
      }
      return;
    }
    if (isObject(schema)) {
      if (isNullableHelper(schema)) {
        if (typeof input === "undefined") {
          throw new Error(
            `Validation error: Expected ${schema.type} but got undefined`,
          );
        }
        if (input !== null) {
          validateImpl(schema.type, input);
        }
        return;
      }
      if (isOptionalHelper(schema)) {
        input && validateImpl(schema.type, input);
        return;
      }
      if (isUnionHelper(schema)) {
        let found = false;
        for (const type of schema.types) {
          try {
            validateImpl(type, input);
            found = true;
            break;
          } catch {}
        }
        if (!found) {
          throw new Error(
            `Validation error: Expected ${
              schema.types.map((t) => t).join(", ")
            } but got ${typeof input}`,
          );
        }
        return;
      }
      if (isAny(schema)) return;
      if (isUnknown(schema)) return;
      if (isNever(schema)) {
        throw new Error("Validation error: Expected never but got something");
      }
      for (const [key, value] of Object.entries(schema)) {
        // @ts-ignore key now exists in input
        validateImpl(value, input[key]);
      }
      return;
    }
    if (isSchemaPrimitive(schema)) {
      if (typeof input !== typeof schema) {
        throw new Error(
          `Validation error: Expected ${typeof schema} but got ${typeof input}`,
        );
      }
      return;
    }
  }
  validateImpl(schema, input);
  return input;
}

export function safeValidate<T extends object>(schema: Schema, input: T) {
  try {
    return validate(schema, input);
  } catch {
    return null;
  }
}

export function schemaToProxy(schema: Schema, input: unknown, quiet = false) {
  return createDeepOnChangeProxy(input, schema, quiet);
}
