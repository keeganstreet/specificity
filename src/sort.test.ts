import { jest, describe, expect, test } from "@jest/globals";
import { compare, compareDesc } from "./sort";

describe("compare", () => {
  test("should return a negative value if A is smaller in the first argument, even if B is bigger in the first argument", () => {
    const result = compare({ A: 1, B: 1000, C: 0 }, { A: 2, B: 1, C: 0 });
    expect(result).toBeLessThan(0);
  });

  test("should return a positive value if A is greater in the first argument, even if B is bigger in the second argument", () => {
    const result = compare({ A: 2, B: 1, C: 0 }, { A: 1, B: 1000, C: 0 });
    expect(result).toBeGreaterThan(0);
  });

  test("should return a negative value if B is smaller in the first argument, even if C is bigger in the first argument", () => {
    const result = compare({ A: 1, B: 1, C: 1000 }, { A: 1, B: 2, C: 1 });
    expect(result).toBeLessThan(0);
  });

  test("should return a positive value if B is greater in the first argument, even if C is bigger in the second argument", () => {
    const result = compare({ A: 1, B: 2, C: 1 }, { A: 1, B: 1, C: 1000 });
    expect(result).toBeGreaterThan(0);
  });

  test("should return a negative value if C is smaller in the first argument", () => {
    const result = compare({ A: 1, B: 1, C: 2 }, { A: 1, B: 1, C: 3 });
    expect(result).toBeLessThan(0);
  });

  test("should return a positive value if C is greater in the first argument", () => {
    const result = compare({ A: 1, B: 1, C: 3 }, { A: 1, B: 1, C: 2 });
    expect(result).toBeGreaterThan(0);
  });

  test("should return 0 if all properties are equal", () => {
    const result = compare({ A: 1, B: 2, C: 3 }, { A: 1, B: 2, C: 3 });
    expect(result).toBe(0);
  });
});

describe("compareDesc", () => {
  test("should return a positive value if A is smaller in the first argument, even if B is bigger in the first argument", () => {
    const result = compareDesc({ A: 1, B: 1000, C: 0 }, { A: 2, B: 1, C: 0 });
    expect(result).toBeGreaterThan(0);
  });

  test("should return a negative value if A is greater in the first argument, even if B is bigger in the second argument", () => {
    const result = compareDesc({ A: 2, B: 1, C: 0 }, { A: 1, B: 1000, C: 0 });
    expect(result).toBeLessThan(0);
  });

  test("should return a positive value if B is smaller in the first argument, even if C is bigger in the first argument", () => {
    const result = compareDesc({ A: 1, B: 1, C: 1000 }, { A: 1, B: 2, C: 1 });
    expect(result).toBeGreaterThan(0);
  });

  test("should return a negative value if B is greater in the first argument, even if C is bigger in the second argument", () => {
    const result = compareDesc({ A: 1, B: 2, C: 1 }, { A: 1, B: 1, C: 1000 });
    expect(result).toBeLessThan(0);
  });

  test("should return a positive value if C is smaller in the first argument", () => {
    const result = compareDesc({ A: 1, B: 1, C: 2 }, { A: 1, B: 1, C: 3 });
    expect(result).toBeGreaterThan(0);
  });

  test("should return a negative value if C is greater in the first argument", () => {
    const result = compareDesc({ A: 1, B: 1, C: 3 }, { A: 1, B: 1, C: 2 });
    expect(result).toBeLessThan(0);
  });

  test("should return 0 if all properties are equal", () => {
    const result = compareDesc({ A: 1, B: 2, C: 3 }, { A: 1, B: 2, C: 3 });
    expect(result).toBe(0);
  });
});
