<div align="center">
<br />

![Struct](.github/banner.jpg)

<h3>Struct 🧬</h3>

#### Typescript struct factories and validation

[![Npm package yearly downloads](https://badgen.net/npm/dy/express)](https://npmjs.com/package/express)
[![GitHub stars](https://img.shields.io/github/stars/freeCodeCamp/freeCodeCamp.svg?style=social&label=Star&maxAge=2592000)](https://github.com/freeCodeCamp/freeCodeCamp)
[![NuGet stable version](https://badgen.net/nuget/v/newtonsoft.json)](https://nuget.org/packages/newtonsoft.json)

*Struct is a Typescript utility library for defining and instantiating typed and prefilled Structs, as well as validating and asserting objects and primitives.
</div>

## Usage

### Struct

Structs are factories for objects. You can instantiate a struct by either providing a type for an empty struct, the default values for a defaulted struct, or a type for the struct and default values for a partially pre-instantiated struct.

#### Basic usage

Structs with complete default values can infer their type from the provided defaults.
```typescript
const Vec2 = Struct({ x: 0, y: 0 }); // Creates a struct factory with default values

const position = new Vec2(); // { x: 0, y: 0}
```
#### Empty Structs

A struct with no default values should be provided a type signature.
```typescript
type Vec3 = {x: number, y: number, z: number};

const Vec3 = Struct<Vec3>();

const position = new Vec3({
	x: 1,
	y: 5,
	z: 2
}); // Must provide all required fields.
```
#### Partial defaults

For partial default values you must provide a type for both the entire struct and the default values `<StructType, DefaultStructValues>`. This is due to a limitation of Typescript regarding partial generics.
```typescript
type Momentum = Vec3 & {velocity: number};

const Momentum = Struct<
	Momentum, // typeof struct
	{velocity: number} // typeof defaults
>({velocity: 0}); // default values

const m = new Momentum({
	x: 2,
	y: 3,
	z: 2 
	// velocity not required for instantiation
}); // { x: 2, y: 3, z: 2, velocity: 0 }
```
#### InferStructType

If you have a Struct, you can infer it's type using the `InferStructType` utility type.
```typescript
const Euler = Struct({x: 0, y: 0, z: 0, order: "XYZ"});

type Euler = InferStructType<Euler>; // { x: number, y: number, z: number, order: string }
```

#### RequiredProperties

You can infer the required properties of a struct from the struct type and default property type.
```typescript
type Texture = {
	x: number,
	y: number,
	repeat: number,
	data: Uint8Array
};

type TextureDefaults = { x: number, y: number, repeat: number };

type RequiredTextureProps = RequiredProperties<
	Texture, TextureDefaults
>; // { data: Uint8Array }

const Texture = Struct<Texture, RequiredTextureProps>({
	x: 0, y: 0, repeat: 0
});

const tex = new Texture({
	data: textureData
});
```

### Validated Struct (VStruct)

Validated Structs work similarly to Structs, but use a schema defined with regular Javascript and are validated on creation an  property assignment.

#### Basic 
```typescript
const Vec2 = VStruct({
	x: Number,
	y: Number
});
const pos = new Vec2({
	x: 0, y: 2
}); // { x: 0, y: 2}
```

#### Advanced
```typescript
const User = VStruct({
	id: Number,
	name: String,
	roles: Array(Number),
	address: {
		street: Optional(String),
		country: Union(Country, Number)
	},
	info: Any,
	isAdmin: Optional(Nullable(Boolean)),
	data: Unknown,
	nonUserProperty: Never,
});

const user = new User(possibleUser); // throws if invalid user;
user.address = "123 American St"; // throws
```

#### Types
```typescript
String: string
Number: number
Boolean: boolean
BigInt: bigint
Symbol: symbol
Date:  DateConstructor
Object: ObjectConstructor
Function: FunctionConstructor
Map: MapConstructor
Set: SetConstructor
WeakMap: WeakMapConstructor
WeakSet: WeakSetConstructor
ArrayBuffer: ArrayBufferConstructor
DataView: DataViewConstructor
Int8Array: Int8ArrayConstructor
Uint8Array: Uint8ArrayConstructor
Uint8ClampedArray: Uint8ClampedArrayConstructor
Int16Array: Int16ArrayConstructor
Uint16Array: Uint16ArrayConstructor
Int32Array: Int32ArrayConstructor
Uint32Array: Uint32ArrayConstructor
Float32Array: Float32ArrayConstructor
Float64Array: Float64ArrayConstructor;
undefined: undefined
null: null
```

#### Utility Types

```typescript
Union(Number, String): number | string
Nullable(Function): Function | null
Optional(String): string?
Any: any
Unknown: unknown
Never: never
```

#### InferVStructType

If you have a VStruct, you can infer it's type using the `InferVStructType` utility type.
```typescript
const Light = VStruct({
	position: {
		x: Number, y: Number, z: Number,
	},
	intensity: Optional(Nullable(Number))
});

type Light = InferVStructType<Light>; 
// { position: { x: number, y: number, z: number}, intensity?: number | null | undefined }
```