import { assertThrows } from "https://deno.land/std/assert/mod.ts";
import { Any, Optional, Union, validate } from "../validate.ts";


Deno.test("validate::number", () => {
  validate(Number, 1);
});

Deno.test("validate::number::error", () => {
  assertThrows(() => validate(Number, "string"));
});

Deno.test("validate::string", () => {
  validate(String, "string");
});

Deno.test("validate::string::error", () => {
  assertThrows(() => validate(String, 1));
});

Deno.test("validate::boolean", () => {
  validate(Boolean, true);
});

Deno.test("validate::boolean::error", () => {
  assertThrows(() => validate(Boolean, 1));
});

Deno.test("validate::object", () => {
  validate(Object, {});
});

Deno.test("validate::object::error", () => {
  assertThrows(() => validate(Object, 1));
});

Deno.test("validate::object::array", () => {
  validate(Object, [])
});

Deno.test("validate::array", () => {
  validate(Array(Any), []);
});

Deno.test("validate::array::error", () => {
  assertThrows(() => validate(Array(Any), {}));
});

Deno.test("validate::null", () => {
  validate(null, null);
});

Deno.test("validate::null::error", () => {
  assertThrows(() => validate(null, undefined));
});

Deno.test("validate::undefined", () => {
  validate(undefined, undefined);
});

Deno.test("validate::undefined::error", () => {
  assertThrows(() => validate(undefined, null));
});

Deno.test("validate:bigint", () => {
  validate(BigInt, 1n);
});

Deno.test("validate::bigint::error", () => {
  assertThrows(() => validate(BigInt, 1));
});

Deno.test("validate::symbol", () => {
  validate(Symbol, Symbol("symbol"));
});

Deno.test("validate::symbol::error", () => {
  assertThrows(() => validate(Symbol, "symbol"));
});

Deno.test("validate::function", () => {
  validate(Function, () => {});
});

Deno.test("validate::function::error", () => {
  assertThrows(() => validate(Function, {}));
});

Deno.test("validate::date", () => {
  validate(Date, new Date());
});

Deno.test("validate::date::error", () => {
  assertThrows(() => validate(Date, {}));
});

Deno.test("validate::any", () => {
  validate(Any, {});
  validate(Any, []);
  validate(Any, 1);
  validate(Any, "string");
  validate(Any, true);
  validate(Any, null);
  validate(Any, undefined);
});

Deno.test("validate::union", () => {
  validate(Union(Number, String), 1);
  validate(Union(Number,String), "string");
});

Deno.test("validate::union::error", () => {
  assertThrows(() => validate(Union(Number, String), true));
});

Deno.test("validate::optional", () => {
  validate(Optional(Number), undefined);
  validate(Optional(String), undefined);
});

Deno.test("validate::optional::error", () => {
  assertThrows(() => validate(Optional(Number), "string"));
});

Deno.test("validate::optional::union", () => {
  validate(Optional(Union(Number, String)), undefined);
  validate(Optional(Union(Number, String)), 1);
  validate(Optional(Union(Number, String)), "string");
});

Deno.test("validate::optional::union::error", () => {
  assertThrows(() => validate(Optional(Union(Number, String)), true));
});

Deno.test("validate::schema1", () => {
  validate(
    {
      name: String,
      age: Number,
      isCool: Boolean,
      friends: Array(String),
      location: {
        lat: Number,
        lng: Number,
      },
    },
    {
      name: "John",
      age: 21,
      isCool: true,
      friends: ["Jane", "Jake"],
      location: {
        lat: 1.1,
        lng: 1.2,
      },
    },
  );
});

Deno.test("validate::schema1::error", () => {
  assertThrows(() =>
    validate(
      {
        name: String,
        age: Number,
        isCool: Boolean,
        friends: Array(String),
        location: {
          lat: Number,
          lng: Number,
        },
      },
      {
        name: "John",
        age: 21,
        isCool: true,
        friends: ["Jane", "Jake"],
        location: {
          lat: 1.1,
          lng: "1.2",
        },
      },
    )
  );
});