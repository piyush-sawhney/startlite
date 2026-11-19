export type ShopStatus = "live" | "paused" | "disabled";

export function storefrontStatus(business: {
  passExpiresAt: Date | null;
  trialEndsAt: Date;
  disabledAt: Date | null;
}): ShopStatus {
  if (business.disabledAt) return "disabled";
  const now = Date.now();
  const pass = business.passExpiresAt?.getTime() ?? 0;
  return pass > now || business.trialEndsAt.getTime() > now ? "live" : "paused";
}

export function isShopLive(business: Parameters<typeof storefrontStatus>[0]) {
  return storefrontStatus(business) === "live";
}

const RESERVED = new Set([
  "admin",
  "api",
  "app",
  "b",
  "login",
  "logout",
  "o",
  "onboarding",
  "media",
  "signup",
  "start",
  "support",
  "terms",
  "privacy",
  "help",
]);

export function slugifyHandle(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function validateHandle(input: string): string | null {
  if (input.length < 3 || input.length > 32) return "Use 3 to 32 characters.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input)) {
    return "Use lowercase letters, numbers, and single hyphens.";
  }
  if (RESERVED.has(input)) return "That link is reserved.";
  return null;
}

export function shopDomain(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://startlite.in";
  return base.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function shopUrl(handle: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://startlite.in";
  return `${base.replace(/\/$/, "")}/b/${handle}`;
}

export function displayShopLink(handle: string): string {
  return `${shopDomain()}/b/${handle}`;
}

export function reviewUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/o/${code}`;
}
