"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import type { PublicItem } from "@/lib/queries";
import {
  addPaise,
  formatPaise,
  fromPaise,
  multiplyPaise,
  toPaise,
} from "@/lib/paise";
import { cn } from "@/lib/cn";

export type ShopView = {
  handle: string;
  name: string;
  tagline: string | null;
  locality: string | null;
  notice: string | null;
  enableTimeSlots: boolean;
  advancePolicyText: string | null;
  addressPlaceholder: string;
  showBankDetails: boolean;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankIfsc: string | null;
  whatsappNumber?: string;
  appUrl?: string;
};

type CartLine = {
  key: string;
  itemId: string;
  optionId: string | null;
  extraIds: string[];
  quantity: string;
  note: string;
};

type Sheet =
  | { kind: "item"; itemId: string }
  | { kind: "cart" }
  | { kind: "checkout" }
  | { kind: "success"; message: string; whatsappUrl: string; code: string }
  | null;

const MEMORY_KEY = "startlite_buyer_v1";

function todayString() {
  return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
}

function tomorrowString() {
  return new Date(Date.now() + 5.5 * 3600_000 + 864e5)
    .toISOString()
    .slice(0, 10);
}

function quantityText(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function isSimple(item: PublicItem) {
  return (
    item.options.length === 0 &&
    item.extras.length === 0 &&
    !item.customerPrompt
  );
}

export function Storefront({
  shop,
  items,
}: {
  shop: ShopView;
  items: PublicItem[];
}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [draftOption, setDraftOption] = useState<string | null>(null);
  const [draftExtras, setDraftExtras] = useState<string[]>([]);
  const [draftQuantity, setDraftQuantity] = useState("1");
  const [draftNote, setDraftNote] = useState("");
  const [filter, setFilter] = useState<"all" | "product" | "service">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [neededBy, setNeededBy] = useState<"today" | "tomorrow" | "pick">(
    "today",
  );
  const [pickDate, setPickDate] = useState(tomorrowString());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [remembered, setRemembered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const domain = (
    shop.appUrl ||
    (typeof window !== "undefined" && window.location.host
      ? window.location.host
      : "startlite.in")
  )
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const displayLink = `${domain}/b/${shop.handle}`;
  const fullShareUrl =
    typeof window !== "undefined" && window.location.href
      ? window.location.href
      : `${(shop.appUrl || "https://startlite.in").replace(/\/$/, "")}/b/${shop.handle}`;

  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  const productCount = items.filter(
    (item) => item.itemType !== "service",
  ).length;
  const serviceCount = items.filter(
    (item) => item.itemType === "service",
  ).length;
  const showFilters = productCount > 0 && serviceCount > 0;

  const filteredByType =
    filter === "all"
      ? items
      : items.filter((item) =>
          filter === "service"
            ? item.itemType === "service"
            : item.itemType !== "service",
        );

  const query = searchQuery.trim().toLowerCase();
  const visibleItems = query
    ? filteredByType.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
          item.unitLabel.toLowerCase().includes(query)
        );
      })
    : filteredByType;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MEMORY_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        name?: string;
        phone?: string;
        note?: string;
      };
      if (saved.name) setName(saved.name);
      if (saved.phone) setPhone(saved.phone);
      if (saved.note) setNote(saved.note);
      setRemembered(Boolean(saved.name || saved.phone));
    } catch {
      // A broken saved value is ignored.
    }
  }, []);

  function unitPaise(item: PublicItem, optionId: string | null, extraIds: string[]) {
    const option = item.options.find((entry) => entry.id === optionId);
    const base =
      item.priceMode === "quote" ? "0" : option?.price ?? item.basePrice;
    const extras = item.extras.filter((extra) => extraIds.includes(extra.id));
    return addPaise(base, ...extras.map((extra) => extra.priceDelta));
  }

  function lineTotal(line: CartLine) {
    const item = itemById.get(line.itemId);
    if (!item) return 0;
    return multiplyPaise(
      line.quantity || "0",
      fromPaise(unitPaise(item, line.optionId, line.extraIds)),
    );
  }

  const cartTotal = cart.reduce((total, line) => total + lineTotal(line), 0);
  const cartCount = cart.reduce(
    (total, line) => total + Number(line.quantity || 0),
    0,
  );

  function simpleLine(item: PublicItem) {
    return cart.find(
      (line) =>
        line.itemId === item.id &&
        line.optionId === null &&
        line.extraIds.length === 0 &&
        !line.note,
    );
  }

  function changeSimple(item: PublicItem, delta: number) {
    setCart((current) => {
      const index = current.findIndex(
        (line) =>
          line.itemId === item.id &&
          line.optionId === null &&
          line.extraIds.length === 0 &&
          !line.note,
      );

      if (index === -1) {
        if (delta <= 0) return current;
        return [
          ...current,
          {
            key: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            itemId: item.id,
            optionId: null,
            extraIds: [],
            quantity: String(delta),
            note: "",
          },
        ];
      }

      const next = Number(current[index].quantity) + delta;
      if (!Number.isFinite(next) || next <= 0) {
        return current.filter((_, position) => position !== index);
      }
      return current.map((line, position) =>
        position === index ? { ...line, quantity: String(next) } : line,
      );
    });
  }

  function openItem(item: PublicItem) {
    if (!item.isAvailable) return;
    if (isSimple(item)) {
      changeSimple(item, 1);
      return;
    }
    setDraftOption(
      item.options.find((option) => option.isAvailable)?.id ?? null,
    );
    setDraftExtras([]);
    setDraftQuantity("1");
    setDraftNote("");
    setSheet({ kind: "item", itemId: item.id });
  }

  function addToCart(
    item: PublicItem,
    optionId: string | null,
    extraIds: string[],
    quantity: string,
    lineNote: string,
  ) {
    setCart((current) => [
      ...current,
      {
        key: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        itemId: item.id,
        optionId,
        extraIds,
        quantity,
        note: lineNote,
      },
    ]);
    setSheet(null);
  }

  function changeLine(key: string, delta: number) {
    setCart((current) =>
      current.flatMap((line) => {
        if (line.key !== key) return [line];
        const next = Number(line.quantity) + delta;
        if (!Number.isFinite(next) || next <= 0) return [];
        return [{ ...line, quantity: String(next) }];
      }),
    );
  }

  function removeLine(key: string) {
    setCart((current) => current.filter((line) => line.key !== key));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copy is optional. The address bar still shows the link.
    }
  }

  async function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (cleanPhone.length !== 10) {
      setError("Enter a 10-digit phone number.");
      return;
    }

    setBusy(true);
    const response = await fetch("/api/v1/public/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        handle: shop.handle,
        buyerName: name.trim(),
        buyerPhone: cleanPhone,
        note: note.trim() || null,
        neededBy:
          neededBy === "today"
            ? todayString()
            : neededBy === "tomorrow"
              ? tomorrowString()
              : pickDate,
        timeSlot,
        lines: cart.map((line) => ({
          itemId: line.itemId,
          optionId: line.optionId,
          extraIds: line.extraIds,
          quantity: line.quantity,
          note: line.note || null,
        })),
      }),
    });
    setBusy(false);

    if (!response.ok) {
      setError("Order not sent. Check your connection and try again.");
      return;
    }

    const payload = await response.json();
    try {
      window.localStorage.setItem(
        MEMORY_KEY,
        JSON.stringify({ name: name.trim(), phone: cleanPhone, note: note.trim() }),
      );
    } catch {
      // Storage is optional.
    }

    setCart([]);
    setSheet({
      kind: "success",
      message: payload.data.message,
      whatsappUrl: payload.data.whatsappUrl,
      code: payload.data.code,
    });
  }

  const draftItem =
    sheet?.kind === "item" ? itemById.get(sheet.itemId) ?? null : null;
  const draftTotal = draftItem
    ? multiplyPaise(
        draftQuantity || "0",
        fromPaise(unitPaise(draftItem, draftOption, draftExtras)),
      )
    : 0;

  const cartLines = (
    <div className="space-y-3">
      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-canvas/60 px-4 py-6 text-center">
          <ShoppingBag className="mx-auto h-5 w-5 text-ink-subtle" />
          <p className="mt-2 text-sm font-medium">Your order is empty</p>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Add an item and it will appear here.
          </p>
        </div>
      ) : (
        cart.map((line) => {
          const item = itemById.get(line.itemId);
          if (!item) return null;
          const option = item.options.find(
            (entry) => entry.id === line.optionId,
          );
          const extras = item.extras.filter((entry) =>
            line.extraIds.includes(entry.id),
          );
          const detail = [option?.name, ...extras.map((entry) => entry.name)]
            .filter(Boolean)
            .join(" · ");

          return (
            <div
              key={line.key}
              className="rounded-2xl border border-line bg-surface p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5">{item.name}</p>
                  {detail || line.note ? (
                    <p className="mt-0.5 text-xs leading-5 text-ink-muted">
                      {detail}
                      {detail && line.note ? " · " : ""}
                      {line.note}
                    </p>
                  ) : null}
                </div>
                <p className="tnum shrink-0 text-sm font-semibold">
                  {formatPaise(lineTotal(line))}
                </p>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Less ${item.name}`}
                    onClick={() => changeLine(line.key, -1)}
                    className="grid h-8 w-8 place-items-center rounded-2xl border border-line bg-surface text-ink transition active:bg-muted"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="tnum w-6 text-center text-sm font-semibold">
                    {quantityText(line.quantity)}
                  </span>
                  <button
                    type="button"
                    aria-label={`More ${item.name}`}
                    onClick={() => changeLine(line.key, 1)}
                    className="grid h-8 w-8 place-items-center rounded-2xl border border-line bg-surface text-ink transition active:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.key)}
                  className="text-xs font-medium text-ink-subtle transition hover:text-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const orderPanel = (
    <div className="rounded-3xl border border-line bg-surface p-4 shadow-[0_8px_24px_rgb(20_18_15/0.06)]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">Your order</h2>
        <span className="text-xs text-ink-muted">
          {cartCount} item{cartCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-3 max-h-[46vh] overflow-y-auto pr-0.5">
        {cartLines}
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
        <span className="text-sm text-ink-muted">Total</span>
        <span className="tnum text-2xl font-semibold tracking-tight">
          {formatPaise(cartTotal)}
        </span>
      </div>

      <button
        type="button"
        disabled={cart.length === 0}
        onClick={() => setSheet({ kind: "checkout" })}
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-[15px] font-semibold text-white transition active:bg-accent-strong disabled:opacity-45"
      >
        Checkout <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-2 text-center text-[11px] leading-5 text-ink-subtle">
        No account. No payment now. The shop confirms your order first.
      </p>
    </div>
  );

  return (
    <main className="min-h-dvh bg-canvas pb-28 lg:pb-16">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-sm">
              <Store className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-ink">
                {shop.name}
              </span>
              <span className="block truncate text-[11px] font-medium text-ink-muted sm:hidden">
                {displayLink}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden max-w-[320px] truncate rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-muted sm:block">
              {displayLink}
            </span>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-muted transition hover:bg-muted active:bg-muted"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy link"}
            </button>
            {cartCount > 0 ? (
              <button
                type="button"
                onClick={() => setSheet({ kind: "cart" })}
                className="hidden items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-accent-strong sm:inline-flex"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{cartCount}</span>
                <span>·</span>
                <span className="tnum">{formatPaise(cartTotal)}</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pt-4 lg:px-8 lg:pt-7">
        <section className="relative overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-br from-accent-soft/80 via-surface to-canvas p-5 shadow-[0_1px_3px_rgb(20_18_15/0.04)] lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Accepting orders
                </span>
                {shop.locality ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-line/80 bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink-muted">
                    <MapPin className="h-3 w-3 text-ink-subtle" />
                    {shop.locality}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full border border-line/80 bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink-muted">
                  <ShieldCheck className="h-3 w-3 text-accent" />
                  Verified store
                </span>
              </div>

              <h1 className="mt-3.5 text-[32px] font-bold leading-[1.1] tracking-tight text-ink lg:text-[42px]">
                {shop.name}
              </h1>

              {shop.tagline ? (
                <p className="mt-2 max-w-[54ch] text-[15px] leading-6 text-ink-muted lg:text-base">
                  {shop.tagline}
                </p>
              ) : (
                <p className="mt-2 max-w-[54ch] text-[15px] leading-6 text-ink-muted">
                  Browse our catalog, check prices, and send your order directly on WhatsApp. No account needed.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 pt-1">
                {shop.whatsappNumber ? (
                  <a
                    href={`https://wa.me/91${shop.whatsappNumber.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                      `Namaste ${shop.name}! I am browsing your store on ${displayLink}.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#20ba5a] active:bg-[#1da851]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat on WhatsApp
                  </a>
                ) : null}
                <p className="text-xs font-medium text-ink-subtle">
                  {items.length} item{items.length === 1 ? "" : "s"} · Direct WhatsApp confirmation
                </p>
              </div>
            </div>

            <ol className="hidden gap-2.5 rounded-2xl border border-line/70 bg-surface/80 p-4 shadow-sm backdrop-blur lg:grid">
              {[
                ["1", "Select items", "Browse menu and customize options"],
                ["2", "Send on WhatsApp", "Instant order message sent to shop"],
                ["3", "Pay after confirmation", "UPI & cash payment when ready"],
              ].map(([step, title, desc]) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">
                    {step}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-xs text-ink-muted">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {shop.notice ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-sm text-ink">
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-warning" />
              <p className="leading-5">{shop.notice}</p>
            </div>
          ) : null}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <section className="min-w-0">
            {/* Search and Category Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items, flavors, services..."
                  className="block min-h-11 w-full rounded-2xl border border-line bg-surface pl-10 pr-9 text-[14px] text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-semibold tracking-tight text-ink">
                    {filter === "service" ? "Services" : "Menu"}
                  </h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
                    {visibleItems.length}
                  </span>
                </div>

                {showFilters ? (
                  <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
                    {(
                      [
                        ["all", "All", items.length],
                        ["product", "Products", productCount],
                        ["service", "Services", serviceCount],
                      ] as const
                    ).map(([value, label, count]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFilter(value)}
                        className={cn(
                          "min-h-7 rounded-full px-2.5 text-xs font-semibold transition",
                          filter === value
                            ? "bg-ink text-white shadow-sm"
                            : "text-ink-muted hover:bg-muted",
                        )}
                      >
                        {label} <span className="opacity-60">{count}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface px-5 py-12 text-center md:col-span-2">
                  <p className="font-semibold text-ink">Catalog being updated</p>
                  <p className="mt-1 text-sm text-ink-muted">The shop will post new items shortly.</p>
                </div>
              ) : visibleItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface px-5 py-10 text-center md:col-span-2">
                  <p className="font-semibold text-ink">No items match &quot;{searchQuery}&quot;</p>
                  <p className="mt-1 text-sm text-ink-muted">Try searching for something else or clear the filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                    className="mt-3 inline-flex min-h-9 items-center rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink hover:bg-muted"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                visibleItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    quantity={Number(simpleLine(item)?.quantity ?? 0)}
                    onAdd={() => openItem(item)}
                    onChange={(delta) => changeSimple(item, delta)}
                  />
                ))
              )}
            </div>

            <footer className="mt-12 border-t border-line/60 pt-8 pb-10 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider text-ink-subtle uppercase">
                  Powered by StartLite
                </span>
                <p className="max-w-md text-xs text-ink-muted">
                  Digital catalog and cash-flow ledger for independent businesses.
                </p>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs font-medium text-ink-muted">
                  <a href="/terms" className="hover:text-accent transition">Terms</a>
                  <span>·</span>
                  <a href="/privacy" className="hover:text-accent transition">Privacy</a>
                  <span>·</span>
                  <a href="/refund" className="hover:text-accent transition">Refunds</a>
                </div>
              </div>
            </footer>
          </section>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            {orderPanel}

            {shop.advancePolicyText ? (
              <p className="mt-3 rounded-2xl border border-accent/20 bg-accent-soft px-4 py-3 text-xs leading-5 text-accent-strong">
                {shop.advancePolicyText}
              </p>
            ) : null}
          </aside>
        </div>
      </div>

      {cart.length > 0 && sheet === null ? (
        <div className="fixed inset-x-0 bottom-0 z-20 lg:hidden">
          <div className="safe-bottom border-t border-line/80 bg-surface/95 px-4 py-3 backdrop-blur">
            <button
              type="button"
              onClick={() => setSheet({ kind: "cart" })}
              className="flex min-h-13 w-full items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3 text-white shadow-[0_8px_24px_rgb(20_18_15/0.18)] transition active:bg-accent-strong"
            >
              <span className="flex items-center gap-2.5">
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white/20 px-1.5 text-xs font-semibold">
                  {cartCount}
                </span>
                <span className="tnum text-[15px] font-semibold">
                  {formatPaise(cartTotal)}
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                View cart <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {sheet ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
          onClick={() => setSheet(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="safe-bottom max-h-[90dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl border border-line/70 bg-surface p-5 shadow-[0_16px_48px_rgb(20_18_15/0.18)] sm:max-h-[86dvh] sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            {sheet.kind === "item" && draftItem ? (
              <ItemSheet
                item={draftItem}
                optionId={draftOption}
                setOptionId={setDraftOption}
                extraIds={draftExtras}
                toggleExtra={(extraId) => {
                  const extra = draftItem.extras.find(
                    (entry) => entry.id === extraId,
                  );
                  if (!extra) return;
                  if (!extra.isMultiSelect) {
                    setDraftExtras(
                      draftExtras.includes(extraId) ? [] : [extraId],
                    );
                    return;
                  }
                  setDraftExtras((current) =>
                    current.includes(extraId)
                      ? current.filter((id) => id !== extraId)
                      : [...current, extraId],
                  );
                }}
                quantity={draftQuantity}
                setQuantity={setDraftQuantity}
                note={draftNote}
                setNote={setDraftNote}
                total={draftTotal}
                onAdd={() =>
                  addToCart(
                    draftItem,
                    draftOption,
                    draftExtras,
                    draftQuantity,
                    draftNote,
                  )
                }
                onClose={() => setSheet(null)}
              />
            ) : null}

            {sheet.kind === "cart" ? (
              <div>
                <SheetTitle
                  title="Your cart"
                  subtitle={`${cartCount} item${cartCount === 1 ? "" : "s"}`}
                  onClose={() => setSheet(null)}
                />
                <div className="mt-4">{cartLines}</div>
                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="text-sm text-ink-muted">Total</span>
                  <span className="tnum text-2xl font-semibold">
                    {formatPaise(cartTotal)}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-4 min-h-12 w-full rounded-xl bg-accent text-[15px] font-semibold text-white transition active:bg-accent-strong"
                  onClick={() => setSheet({ kind: "checkout" })}
                >
                  Checkout
                </button>
                <button
                  type="button"
                  className="mt-2 min-h-11 w-full rounded-xl border border-line bg-surface text-sm font-medium"
                  onClick={() => setSheet(null)}
                >
                  Add more items
                </button>
              </div>
            ) : null}

            {sheet.kind === "checkout" ? (
              <form onSubmit={submitOrder}>
                <SheetTitle
                  title="Checkout"
                  subtitle="No account. No payment now."
                  onClose={() => setSheet(null)}
                />
                <div className="mt-4 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[13px] font-medium text-ink-muted">
                        Your name
                      </label>
                      <input
                        className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-[15px]"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[13px] font-medium text-ink-muted">
                        Phone
                      </label>
                      <input
                        className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-[15px]"
                        inputMode="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-ink-muted">
                      Note (optional)
                    </label>
                    <input
                      className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-[15px]"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder={shop.addressPlaceholder}
                    />
                  </div>

                  {remembered ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-accent"
                      onClick={() => {
                        setName("");
                        setPhone("");
                        setNote("");
                        setRemembered(false);
                        try {
                          window.localStorage.removeItem(MEMORY_KEY);
                        } catch {
                          // Storage is optional.
                        }
                      }}
                    >
                      Remembered from last time · Clear
                    </button>
                  ) : null}

                  <div>
                    <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">
                      Needed by
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          ["today", "Today"],
                          ["tomorrow", "Tomorrow"],
                          ["pick", "Pick date"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNeededBy(value)}
                          className={cn(
                            "min-h-10 rounded-xl border px-2 text-[13px] font-semibold transition",
                            neededBy === value
                              ? "border-accent bg-accent-soft text-accent-strong"
                              : "border-line bg-surface text-ink-muted",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {neededBy === "pick" ? (
                      <input
                        type="date"
                        className="mt-2 block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-[15px]"
                        value={pickDate}
                        min={todayString()}
                        onChange={(event) => setPickDate(event.target.value)}
                      />
                    ) : null}
                  </div>

                  {shop.enableTimeSlots ? (
                    <div>
                      <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">
                        Time (optional)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Morning", "Afternoon", "Evening"].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() =>
                              setTimeSlot(timeSlot === slot ? null : slot)
                            }
                            className={cn(
                              "min-h-10 rounded-xl border px-2 text-[13px] font-semibold transition",
                              timeSlot === slot
                                ? "border-accent bg-accent-soft text-accent-strong"
                                : "border-line bg-surface text-ink-muted",
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {shop.advancePolicyText ? (
                    <p className="rounded-xl bg-accent-soft px-3 py-2 text-xs leading-5 text-accent-strong">
                      {shop.advancePolicyText}
                    </p>
                  ) : null}

                  {error ? (
                    <p className="text-sm text-danger" aria-live="polite">
                      {error}
                    </p>
                  ) : null}

                  <div className="flex items-baseline justify-between border-t border-line pt-3">
                    <span className="text-sm text-ink-muted">Total</span>
                    <span className="tnum text-xl font-semibold">
                      {formatPaise(cartTotal)}
                    </span>
                  </div>

                  <button
                    className="min-h-12 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[15px] font-semibold text-white transition active:bg-[#1da851] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    disabled={busy}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {busy ? "Preparing order…" : "Send on WhatsApp"}
                  </button>
                  <p className="text-center text-[11px] leading-5 text-ink-subtle">
                    The shop confirms your order first. Pay after confirmation.
                  </p>
                </div>
              </form>
            ) : null}

            {sheet.kind === "success" ? (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="mt-3.5 text-center text-2xl font-bold tracking-tight text-ink">
                  Order placed!
                </h2>
                <p className="mt-1 text-center text-sm text-ink-muted">
                  Order Code: <span className="font-semibold text-ink">#{sheet.code}</span>
                </p>
                <div className="mt-4 rounded-2xl border border-line bg-muted/50 p-3.5 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                    WhatsApp Message Preview
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-5 text-ink">
                    {sheet.message}
                  </pre>
                </div>
                <a
                  href={sheet.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#20ba5a] active:bg-[#1da851]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Send Order on WhatsApp
                </a>
                <button
                  type="button"
                  className="mt-2.5 min-h-11 w-full rounded-xl border border-line bg-surface text-sm font-medium transition hover:bg-muted"
                  onClick={() => setSheet(null)}
                >
                  Back to store
                </button>
                <p className="mt-3 text-center text-[11px] leading-5 text-ink-subtle">
                  Tap above to send this order to the shop on WhatsApp. The shop will confirm and provide payment details.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ItemCard({
  item,
  quantity,
  onAdd,
  onChange,
}: {
  item: PublicItem;
  quantity: number;
  onAdd: () => void;
  onChange: (delta: number) => void;
}) {
  const isService = item.itemType === "service";
  const price =
    item.priceMode === "quote"
      ? "Ask for price"
      : item.priceMode === "starting_from"
        ? `From ${formatPaise(toPaise(item.basePrice))}`
        : formatPaise(toPaise(item.basePrice));

  return (
    <article
      className={cn(
        "group flex gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-[0_1px_2px_rgb(20_18_15/0.05)] transition",
        item.isAvailable
          ? "hover:border-line hover:shadow-[0_8px_24px_rgb(20_18_15/0.07)]"
          : "opacity-60",
      )}
    >
      {item.imageKey ? (
        <img
          src={`/media/${item.imageKey}`}
          alt=""
          className="h-[88px] w-[88px] shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div
          className={cn(
            "grid h-[88px] w-[88px] shrink-0 place-items-center rounded-xl text-2xl font-semibold",
            isService
              ? "bg-info/10 text-info"
              : "bg-accent-soft text-accent-strong",
          )}
        >
          {item.name.slice(0, 1)}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
              isService
                ? "bg-info/10 text-info"
                : "bg-muted text-ink-muted",
            )}
          >
            {isService ? "Service" : "Product"}
          </span>
          {item.options.length > 0 || item.extras.length > 0 ? (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-strong">
              Customisable
            </span>
          ) : null}
          <span className="truncate text-[11px] text-ink-subtle">
            {item.unitLabel}
          </span>
        </div>

        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-5 text-ink">
          {item.name}
        </h3>

        {item.subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-ink-muted">
            {item.subtitle}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="tnum text-[15px] font-semibold text-ink">
            {price}
            {item.priceMode === "fixed" ? (
              <span className="text-[11px] font-normal text-ink-subtle">
                {" "}
                / {item.unitLabel}
              </span>
            ) : null}
          </p>

          {!item.isAvailable ? (
            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-ink-subtle">
              Sold out
            </span>
          ) : isSimple(item) ? (
            quantity > 0 ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-accent/25 bg-accent-soft p-1">
                <button
                  type="button"
                  aria-label={`Less ${item.name}`}
                  onClick={() => onChange(-1)}
                  className="grid h-7 w-7 place-items-center rounded-md bg-surface text-accent-strong"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="tnum min-w-5 text-center text-xs font-semibold text-accent-strong">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={`More ${item.name}`}
                  onClick={() => onChange(1)}
                  className="grid h-7 w-7 place-items-center rounded-md bg-accent text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex min-h-8 items-center gap-1 rounded-lg bg-accent-soft px-3 text-xs font-semibold text-accent-strong transition active:bg-accent active:text-white"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex min-h-8 items-center gap-1 rounded-lg bg-accent-soft px-3 text-xs font-semibold text-accent-strong transition active:bg-accent active:text-white"
            >
              Customise <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function SheetTitle({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="grid h-9 w-9 place-items-center rounded-full bg-muted text-ink-muted transition active:bg-line"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ItemSheet({
  item,
  optionId,
  setOptionId,
  extraIds,
  toggleExtra,
  quantity,
  setQuantity,
  note,
  setNote,
  total,
  onAdd,
  onClose,
}: {
  item: PublicItem;
  optionId: string | null;
  setOptionId: (value: string) => void;
  extraIds: string[];
  toggleExtra: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  total: number;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <SheetTitle
        title={item.name}
        subtitle={item.subtitle ?? undefined}
        onClose={onClose}
      />
      <div className="mt-3 flex gap-3">
        {item.imageKey ? (
          <img
            src={`/media/${item.imageKey}`}
            alt=""
            className="h-24 w-24 rounded-xl object-cover"
          />
        ) : (
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-accent-soft text-2xl font-semibold text-accent-strong">
            {item.name.slice(0, 1)}
          </div>
        )}
        <p className="text-sm leading-6 text-ink-muted">
          {item.priceMode === "quote"
            ? "The shop will send you a price."
            : item.priceMode === "starting_from"
              ? `Starting from ${formatPaise(toPaise(item.basePrice))}.`
              : `${formatPaise(toPaise(item.basePrice))} per ${item.unitLabel}.`}
        </p>
      </div>

      {item.options.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-medium text-ink-muted">Option</p>
          <div className="space-y-2">
            {item.options.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-between rounded-xl border px-3 transition",
                  optionId === option.id
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                  !option.isAvailable && "opacity-50",
                )}
              >
                <span className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="option"
                    checked={optionId === option.id}
                    onChange={() => setOptionId(option.id)}
                    disabled={!option.isAvailable}
                  />
                  {option.name}
                </span>
                <span className="tnum text-sm">
                  {formatPaise(toPaise(option.price))}
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {item.extras.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-medium text-ink-muted">Extras</p>
          <div className="space-y-2">
            {item.extras.map((extra) => (
              <label
                key={extra.id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-between rounded-xl border px-3 transition",
                  extraIds.includes(extra.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                  !extra.isAvailable && "opacity-50",
                )}
              >
                <span className="flex items-center gap-2 text-sm">
                  <input
                    type={extra.isMultiSelect ? "checkbox" : "radio"}
                    name={extra.isMultiSelect ? undefined : "extra"}
                    checked={extraIds.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                    disabled={!extra.isAvailable}
                  />
                  {extra.name}
                </span>
                {Number(extra.priceDelta) !== 0 ? (
                  <span className="tnum text-sm">
                    {Number(extra.priceDelta) > 0 ? "+" : "−"}
                    {formatPaise(Math.abs(toPaise(extra.priceDelta)))}
                  </span>
                ) : null}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {item.customerPrompt ? (
        <div className="mt-4">
          <label className="mb-1 block text-[13px] font-medium text-ink-muted">
            {item.customerPrompt}
          </label>
          <input
            className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-[15px]"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Less"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface"
            onClick={() =>
              setQuantity(String(Math.max(0.5, Number(quantity) - 1)))
            }
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            className="h-10 w-12 rounded-xl border border-line text-center text-sm"
            inputMode="decimal"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-label="Quantity"
          />
          <button
            type="button"
            aria-label="More"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface"
            onClick={() => setQuantity(String(Number(quantity) + 1))}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="tnum text-xl font-semibold">{formatPaise(total)}</p>
      </div>

      <button
        type="button"
        className="mt-4 min-h-12 w-full rounded-xl bg-accent text-[15px] font-semibold text-white transition active:bg-accent-strong"
        onClick={onAdd}
      >
        Add · {formatPaise(total)}
      </button>
    </div>
  );
}
