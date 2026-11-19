import { describe, expect, it } from "vitest";
import { isPendingCode, newPendingCode } from "./pending-code";

describe("pending codes", () => {
  it("makes 10 characters from the Crockford alphabet", () => {
    for (let index = 0; index < 100; index += 1) {
      const code = newPendingCode();
      expect(code).toHaveLength(10);
      expect(isPendingCode(code)).toBe(true);
    }
  });

  it("rejects look-alike letters and wrong lengths", () => {
    expect(isPendingCode("ABCDEFGHIJ")).toBe(false);
    expect(isPendingCode("ABCDEFGHIK")).toBe(false);
    expect(isPendingCode("0123456789")).toBe(true);
    expect(isPendingCode("012345678")).toBe(false);
    expect(isPendingCode("01234567890")).toBe(false);
  });
});
