import { describe, expect, it } from "vitest";
import { PACKS } from "@/lib/packs";
import { DEV_BUSINESSES, PACK_SEED_PROFILES } from "./dev-seed-data";

describe("development seed data", () => {
  it("has at least 20 businesses", () => {
    expect(DEV_BUSINESSES.length).toBeGreaterThanOrEqual(20);
  });

  it("covers every category pack", () => {
    const seededPacks = new Set(DEV_BUSINESSES.map((shop) => shop.pack));
    for (const pack of PACKS) {
      expect(seededPacks.has(pack.id), `missing pack ${pack.id}`).toBe(true);
    }
  });

  it("has a profile for every seeded pack", () => {
    for (const shop of DEV_BUSINESSES) {
      expect(
        PACK_SEED_PROFILES[shop.pack],
        `missing profile for ${shop.pack}`,
      ).toBeDefined();
    }
  });

  it("uses unique handles and emails", () => {
    const handles = DEV_BUSINESSES.map((shop) => shop.handle);
    const emails = DEV_BUSINESSES.map((shop) => shop.email);
    expect(new Set(handles).size).toBe(handles.length);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it("keeps handles valid for the storefront URL", () => {
    for (const shop of DEV_BUSINESSES) {
      expect(shop.handle).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(shop.handle.length).toBeGreaterThanOrEqual(3);
      expect(shop.handle.length).toBeLessThanOrEqual(32);
    }
  });
});
