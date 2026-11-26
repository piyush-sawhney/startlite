import { describe, expect, it } from "vitest";
import { getPassStatus } from "./pass-status";

const now = new Date("2026-11-26T12:00:00Z");
const trialEndsAt = new Date("2027-02-24T00:00:00Z");

describe("getPassStatus", () => {
  it("marks a pass with more than 30 days left as good", () => {
    const status = getPassStatus(new Date("2027-01-01T00:00:00Z"), trialEndsAt, now);
    expect(status).toEqual({
      label: "Quarterly pass until 01-Jan-2027",
      tone: "good",
      daysLeft: 36,
    });
  });

  it("warns when a pass expires within 30 days", () => {
    const status = getPassStatus(new Date("2026-12-10T00:00:00Z"), trialEndsAt, now);
    expect(status).toEqual({
      label: "Quarterly pass ends 10-Dec-2026",
      tone: "soon",
      daysLeft: 14,
    });
  });

  it("marks an expired pass", () => {
    const status = getPassStatus(new Date("2026-11-20T00:00:00Z"), trialEndsAt, now);
    expect(status.tone).toBe("expired");
    expect(status.label).toBe("Quarterly pass expired 20-Nov-2026");
  });

  it("uses the trial date before activation", () => {
    const status = getPassStatus(null, new Date("2026-12-20T00:00:00Z"), now);
    expect(status).toEqual({
      label: "3-month trial ends 20-Dec-2026",
      tone: "soon",
      daysLeft: 24,
    });
  });
});
