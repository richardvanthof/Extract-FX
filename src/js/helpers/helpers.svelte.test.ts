import { generateNumberedOptions } from "./helpers.svelte";
import { describe, expect, it } from 'vitest';

describe("generateNumberedOptions", () => {
  it("should return an array of numbered options", () => {
    const result = generateNumberedOptions(3, "VIDEO");
    expect(result).toStrictEqual([
      ["VIDEO 1 ", 1],
      ["VIDEO 2 ", 2],
      ["VIDEO 3 ", 3],
    ]);
  });
});
