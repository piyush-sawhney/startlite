import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { businesses, pendingOrders } from "@/db/schema";
import { clientIp, apiData, apiError, readJson } from "@/lib/api";
import { whatsappLink } from "@/lib/bill";
import { serverEnv } from "@/lib/env";
import { newPendingCode } from "@/lib/pending-code";
import { priceLines } from "@/lib/pending";
import { rateLimit } from "@/lib/rate-limit";
import { reviewUrl, storefrontStatus } from "@/lib/shop";
import { formatAmount } from "@/lib/money";

const lineSchema = z.object({
  itemId: z.string().min(1),
  optionId: z.string().min(1).nullable().optional(),
  extraIds: z.array(z.string().min(1)).max(20).optional(),
  quantity: z.string().regex(/^\d+(\.\d{1,2})?$/),
  note: z.string().max(200).nullable().optional(),
});

const schema = z.object({
  handle: z.string().min(1).max(64),
  buyerName: z.string().min(2).max(80),
  buyerPhone: z.string().min(10).max(20),
  note: z.string().max(500).nullable().optional(),
  neededBy: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  timeSlot: z.enum(["Morning", "Afternoon", "Evening"]).nullable().optional(),
  lines: z.array(lineSchema).min(1).max(50),
  turnstileToken: z.string().nullable().optional(),
});

async function verifyTurnstile(token: string | null | undefined, ip: string) {
  const secret = serverEnv.turnstileSecret;
  if (!secret) return true;
  if (!token) return false;

  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  const payload = (await response.json()) as { success?: boolean };
  return payload.success === true;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`order:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return apiError("RATE_LIMITED", "Too many tries. Wait a minute.", [
      { retryAfter: limit.retryAfter },
    ]);
  }

  const raw = await readJson(request);
  const size = JSON.stringify(raw ?? "").length;
  if (size > 32 * 1024) {
    return apiError("PAYLOAD_TOO_LARGE", "This order is too large to send.");
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      "Check your name, phone, and items.",
      parsed.error.issues,
    );
  }

  const body = parsed.data;
  const phone = body.buyerPhone.replace(/\D/g, "").slice(-10);
  if (phone.length !== 10) {
    return apiError("VALIDATION_FAILED", "Enter a 10-digit phone number.");
  }

  const [shop] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.handle, body.handle))
    .limit(1);

  if (!shop) return apiError("NOT_FOUND", "Shop not found.");
  if (storefrontStatus(shop) !== "live") {
    return apiError("PASS_EXPIRED", "This shop is not taking orders right now.");
  }

  const shopLimit = rateLimit(`order-shop:${shop.id}`, 20, 60 * 60_000);
  if (!shopLimit.ok) {
    return apiError("RATE_LIMITED", "This shop is getting a lot of orders. Try later.");
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return apiError("TURNSTILE_FAILED", "The check did not pass. Try again.");
  }

  const priced = await priceLines(shop.id, body.lines);
  if (!priced.ok) {
    return apiError(priced.code, priced.message);
  }

  const ipHash = createHash("sha256")
    .update(`${serverEnv.ipHashSecret}:${ip}`)
    .digest("hex");

  let code = newPendingCode();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const [taken] = await db
      .select({ id: pendingOrders.id })
      .from(pendingOrders)
      .where(eq(pendingOrders.code, code))
      .limit(1);
    if (!taken) break;
    code = newPendingCode();
  }

  const snapshotLines = priced.cart.lines.map((line) => ({
    itemId: line.itemId,
    itemName: line.itemName,
    optionId: line.optionId,
    optionName: line.optionName,
    extraIds: line.extraIds,
    extraNames: line.extraNames,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    lineTotal: line.lineTotal,
    unitLabel: line.unitLabel,
  }));

  await db.insert(pendingOrders).values({
    businessId: shop.id,
    code,
    buyerName: body.buyerName.trim(),
    buyerPhone: phone,
    neededBy: body.neededBy ?? undefined,
    timeSlot: body.timeSlot ?? null,
    note: body.note?.trim() || null,
    lines: snapshotLines,
    revenueSubtotal: priced.cart.revenueSubtotal,
    grandTotal: priced.cart.grandTotal,
    ipHash,
  });

  const link = reviewUrl(code);
  const itemCount = snapshotLines.reduce(
    (total, line) => total + Number(line.quantity),
    0,
  );
  const message = [
    `New order from ${body.buyerName.trim()}`,
    `${itemCount} item${itemCount === 1 ? "" : "s"} · ${formatAmount(priced.cart.grandTotal)}`,
    link,
  ].join("\n");

  return apiData(
    {
      code,
      reviewUrl: link,
      whatsappUrl: whatsappLink(shop.whatsappNumber, message),
      message,
      total: priced.cart.grandTotal,
    },
    201,
  );
}
