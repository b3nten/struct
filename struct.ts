export type StructKeys = string | number;
export type StructInput = Record<StructKeys, any>;

export type InferStructType<T extends new (...args: any[]) => any> = T extends
	new (
		...args: any[]
	) => infer U ? U
	: never;

export type RequiredProperties<AllProps, DefaultProps> =
  Exclude<keyof AllProps, keyof DefaultProps> extends never ? never
    : Pick<AllProps, Exclude<keyof AllProps, keyof DefaultProps>>;

export function Struct<AllProps extends StructInput>(defaults?: never): new (
  data: AllProps,
) => AllProps;

export function Struct<AllProps extends StructInput>(defaults: AllProps): new (
  data?: Partial<AllProps>,
) => AllProps;

export function Struct<
  AllProps extends StructInput,
  DefaultProps extends AllProps extends never ? StructInput : Partial<AllProps>,
>(
  defaults: DefaultProps,
): RequiredProperties<AllProps, DefaultProps> extends never ? new (
    data?: Partial<AllProps>,
  ) => AllProps
  : new (
    data:
      & Partial<AllProps>
      & RequiredProperties<AllProps, DefaultProps>,
  ) => AllProps;

export function Struct<
  AllProps extends StructInput,
  DefaultProps extends Partial<AllProps>,
>(
  defaults?: DefaultProps,
) {
  return class {
    constructor(proto: AllProps) {
      Object.assign(this, defaults);
      Object.assign(this, proto);
    }
  };
}