# Product

> Part of the StartLite docs. Start at [README](README.md).

- StartLite serves shops that run on WhatsApp.
- The buyer needs no account and no app.
- The merchant needs no training and no accountant.
- The app works before login. Login only saves and syncs.

## Frictionless first

Frictionless use is the core product rule. Every surface starts in the
workspace, not behind a signup wall.

- Opening `/` enters the workspace. It is not a marketing page.
- A signed-out merchant can add a catalog, record a sale, log a payment, see
  customers, log an expense, check cash left, and copy a bill.
- Every write saves on the phone immediately. The network never blocks a sale.
- The account adds three things: a public store link, cross-device sync, and a
  saved copy of the work. It also adds the PNG receipt and order handoff.
- Clearing browser data deletes unsaved guest work. The save prompt says so in
  plain words.
- A buyer never needs an account on any surface.

Guest money is exact. The phone uses integer paise. When the work moves into a
shop, the server recomputes every total from the lines.

## Problem

A micro-business in India sells through WhatsApp. It has no website, no billing
system, and no reliable record of who owes money. Existing tools either do
accounting only or a website only. Neither fits a shop that runs inside a chat.

## Users

| Persona | Context | Needs |
|---|---|---|
| **Merchant** | One to three people. Budget Android phone. Patchy 4G. WhatsApp is the shop. No accounting training. | Publish prices, track orders, record payments, send a bill, know today's numbers. |
| **Buyer** | Arrives from a WhatsApp status or a Google search. No app, no account. | See prices, choose options, send an order in under a minute. |

## Jobs to be done

1. Publish a price list without building a website.
2. Turn a chat into a tracked order.
3. Remember who owes money and how much.
4. Send a bill that looks professional.
5. Know today's sales, money received, and money pending.
6. Move paper dues into the app without retyping every bill.
7. Export records at tax time.

## Positioning

| Alternative | Gap StartLite fills |
|---|---|
| Khatabook, OkCredit | Ledger only. No public storefront and no order flow. |
| Shopify, Dukaan | Web-first and paid. Too heavy for a WhatsApp shop. |
| WhatsApp Business catalogue | No public URL, no ledger, no bills. |
| Spreadsheets | No storefront and no reminders. |

## Business model

| Item | Value |
|---|---|
| Trial | 90 days, full features |
| Price | ₹111 + 18% GST = **₹130.98 per quarter** |
| Collection | Manual activation in the owner admin during v1 |
| Renewal | Prepaid, 90 days per activation, no AutoPay mandate |
| On expiry | The public storefront pauses. The merchant keeps login and full data export. |
| Tax | StartLite is GST-registered. The invoice carries GSTIN and SAC 998314. |
| Buyer payments | Direct buyer-to-merchant UPI or bank transfer. StartLite never holds funds. |

The price is set for volume, not for margin per shop. The math lives in
[economics.md](economics.md#unit-economics).

## Distribution

Every storefront, bill, and receipt ends with one line:

> ⚡ Run a business on WhatsApp? Get your free digital store at StartLite.in

No paid WhatsApp API. No referral fee. No ads.

## Guardrails

Do not build any of the following.

1. Merchant GST, e-invoicing, HSN codes, GSTR-1, or input tax credit.
2. Warehouse, FIFO, or batch inventory. Use an availability toggle and an optional slot counter.
3. Paid WhatsApp Business API, Twilio, Interakt, Wati, or an in-app chat.
4. Buyer accounts, buyer OTPs, or buyer passwords.
5. Payment aggregation, escrow, or a nodal account.
6. Multiple staff accounts or multiple branches in v1. One owner per shop.
7. Floating-point money math.
8. Offline write queue or background sync. Guest mode is a local workspace, not a sync queue. It never claims a server write or reconciles later.
9. Native mobile apps or app store listings in v1.
10. Field-level column encryption in v1. Use RLS and disk encryption.
11. Charts, graphs, or dashboards in v1. Show numbers and lists.
12. A second public URL per shop. One handle, one storefront.

## Capability map

The capability map is the full v1 feature surface. Each row names the merchant
value and the document that specifies it.

| # | Primitive | Merchant value | Specified in |
|---|---|---|---|
| 1 | Payment stack | A UPI QR for the bill total, copy UPI ID, copy amount, open-app link, optional bank details. On the bill only. | [architecture](architecture.md#payment-stack) |
| 2 | Options | A size or option sets the price. An extra adds a delta or scopes stock. | [data-model](data-model.md#catalog) |
| 3 | Three price modes | `fixed`, `starting_from`, `quote` | [data-model](data-model.md#catalog) |
| 4 | Running tabs | Add items, apply an extra or discount, set a progress note, convert a quote to an order | [data-model](data-model.md#order-lifecycle) |
| 5 | Reconciliation | Instalments, TDS, deposits, reimbursements | [data-model](data-model.md#money) |
| 6 | Order handoff | The buyer's cart is saved on the server. The merchant accepts it from a short link. | [architecture](architecture.md#order-handoff) |
| 7 | Item prompt and media flag | One optional question per item, and an optional request for a photo in chat | [data-model](data-model.md#catalog) |
| 8 | Store switches | Notice banner, time slots, advance policy, address placeholder, privacy mode, buyer phone rule, buyer memory | [architecture](architecture.md#store-settings) |
| 9 | Bills and outputs | A text bill by default. A PNG receipt, status card, and flyer on demand. Repeat bill and reminder. | [design-system](design-system.md#canvas-outputs) |
| 10 | Expenses and cash left | Log an expense. See money received minus expenses. | [data-model](data-model.md#money) |
| 11 | Paper migration | Walk-in sale, quick sale with a free-text amount, and a previous due | [data-model](data-model.md#order-sources) |
| 12 | Guest workspace | The full daily loop before login. Data stays on the phone and imports into the shop after signup. | [architecture](architecture.md#guest-workspace) |

## Surfaces

| Surface | Route | Users |
|---|---|---|
| Workspace | `/` | Signed-out merchant. The app opens ready. |
| Public storefront | `/b/{handle}` | Buyers, no login |
| Login and signup | `/login` | Merchant, optional |
| Onboarding | `/onboarding` | Merchant after signup |
| Merchant app | `/app/*` | Merchant, 5 tabs |
| Order link | `/o/{code}` | Merchant, login required |
| Owner admin | `/admin/*` | Platform owner only |

The five tabs are **Home**, **Sales**, **Customers**, the pack noun, and
**More**. The pack noun is Menu, Items, or Services. The rules live in
[merchant-language.md](merchant-language.md#tab-labels).

## Simplicity budget

| Surface | Budget |
|---|---|
| First use | 0 signup fields. The workspace opens ready. |
| Onboarding | 4 screens and 6 fields |
| Walk-in sale | 3 taps to save |
| Buyer checkout | 2 required inputs and 1 optional note |
| New item | 3 fields to publish |
| Home | 3 numbers above the fold |
| Bill | 1 tap to send |
| Save guest work | 1 sign-in, then the existing onboarding |
| Any new feature | Removes a field, or stays hidden |

## Feature filter

A feature ships only if it does one of these.

1. It removes a field from a daily flow.
2. It removes a support call.
3. It stays hidden until the merchant asks for it.

If it does none, it waits. The filter protects the simplicity budget.

## UX principles

1. **No login wall.** The app opens in the workspace. Login saves and syncs.
2. **Fewest taps.** Every frequent action has a one- or two-tap path.
3. **Fast first, motion second.** Speed wins when the two conflict.
4. **Calm and premium.** Neutral surfaces, one accent, generous spacing.
5. **One primary action per screen.** Secondary actions stay quiet.
6. **Never block a sale on the network.** Acknowledge the write, then confirm it.
7. **Say the period.** Every number states Today, This month, or All.

## Success metrics

| Metric | Target |
|---|---|
| First sale before signup | 50% of new visitors |
| Guest work saved after a first sale | 25% within 7 days |
| Store live after signup | Under 10 minutes |
| First order within 7 days | 40% of new merchants |
| Weekly active merchants | 35% of signups |
| Pending amount collected within 30 days | 60% |
| Trial to paid conversion | 15% |
| Export used at least once | 20% of merchants |
| Checkout finished in under 60 seconds | 80% |
| Order accepted within 24 hours | 80% |
| Support tickets per 100 merchants per month | Under 5 |

## Scope boundary

V1 ships the capability map, the five surfaces, and the payment model above.

V1 excludes native apps, offline writes, field-level encryption, automated
billing, merchant GST, multiple users per shop, multiple branches, buyer
accounts, custom domains, and charts. Anything outside this boundary needs a
decision in [decisions.md](decisions.md) before work starts.
