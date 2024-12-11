import { generateNumberedOptions, getUniqueKeys } from "./helpers.svelte";
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

describe("GetUniqueKeys", () => {

  it("Returns unique keys from list of objects", () => {
      const list = [
          {Transform: {}, Stabilize: {}, Displace: {}},
          {Motion: {}, Transform:{}, Color:{}}, 
          {Transform: {}, Stabilize: {}, Limit: {}}
      ]
      expect(getUniqueKeys(list)).toStrictEqual(
          ['Transform', 'Stabilize', 'Displace', 'Motion', 'Color', 'Limit']
      );
  });

  it("Is able to compare strings regardless of casing.", () => {
      const list = [
          {TRANSform: {}, Stabilize: {}, Displace: {}},
          {Motion: {}, Transform:{}, COLOR:{}}, 
          {Transform: {}, stabilize: {}, Limit: {}}
      ]
      expect(getUniqueKeys(list)).toStrictEqual(
          ['TRANSform', 'Stabilize', 'Displace', 'Motion', 'COLOR', 'Limit']
      );
  });
  
  it("Returns unique keys from single object", () => {
      const list = {
          Transform: {},
          Stabilize: {}, 
          Displace: {}, 
          Motion: {}, 
          transform:{}, 
          Color:{}, 
          //@ts-expect-error part of test
          transform: {}, 
          //@ts-expect-error part of test
          Stabilize: {},
          Limit: {}
          }
      expect(getUniqueKeys(list)).toStrictEqual(
          ['Transform', 'Stabilize', 'Displace', 'Motion', 'Color', 'Limit']
      );
  });
});
