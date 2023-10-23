import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import sum from "../vstruct.ts"

Deno.test("sum test", () => {
  assertEquals(sum(1,2), 3);
});
