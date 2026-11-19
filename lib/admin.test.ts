import { describe, expect, it } from "vitest";
import { calculateNewPassExpiry, formatInvoiceNumber } from "./admin";

describe("calculateNewPassExpiry", () => {
  const now = new Date("2026-11-19T12:00:00Z");

  it("extends from active pass expiry if pass is in future", () => {
    const passExpiresAt = new Date("2026-12-01T12:00:00Z");
    const trialEndsAt = new Date("2026-11-25T12:00:00Z");

    const result = calculateNewPassExpiry(passExpiresAt, trialEndsAt, 90, now);
    const expected = new Date(passExpiresAt.getTime() + 90 * 864e5);
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it("extends from trial end date if trial is active and pass is null", () => {
    const passExpiresAt = null;
    const trialEndsAt = new Date("2026-12-15T12:00:00Z");

    const result = calculateNewPassExpiry(passExpiresAt, trialEndsAt, 90, now);
    const expected = new Date(trialEndsAt.getTime() + 90 * 864e5);
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it("extends from now if trial and pass are both expired", () => {
    const passExpiresAt = new Date("2026-10-01T12:00:00Z");
    const trialEndsAt = new Date("2026-09-01T12:00:00Z");

    const result = calculateNewPassExpiry(passExpiresAt, trialEndsAt, 90, now);
    const expected = new Date(now.getTime() + 90 * 864e5);
    expect(result.toISOString()).toBe(expected.toISOString());
  });
});

describe("formatInvoiceNumber", () => {
  it("formats correctly with standard prefix and padded serial", () => {
    expect(formatInvoiceNumber("SL", 1)).toBe("SL-0001");
    expect(formatInvoiceNumber("SL", 42)).toBe("SL-0042");
    expect(formatInvoiceNumber("SL", 1005)).toBe("SL-1005");
  });

  it("falls back to SL if prefix is empty", () => {
    expect(formatInvoiceNumber("", 5)).toBe("SL-0005");
  });
});
