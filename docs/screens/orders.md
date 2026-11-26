# Orders

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md). Visual rules live in [design-system.md](../design-system.md).

Orders is the full order report at `/orders`. It answers one question: which
work and which money need attention in the chosen period. Home answers the same
question for today. Orders covers every date and every status.

The page is a list report. It has no charts and no editable rows. It uses the
[report list anatomy](README.md#report-list-anatomy) shared by all three report
pages.

## Purpose

A merchant opens Orders to review work, find one order, and follow up on money.
The page answers:

- What work is unfinished.
- What money is still due.
- Which orders are paid, cancelled, or declined.

## Arrival and exit

| From | Result |
|---|---|
| Rail or bottom tab | Opens Orders with the saved filters |
| Home, order card | Opens the order sheet in Home, not this page |
| Home, bill link | Opens `/orders/{id}/bill` for a printed or shared bill |
| Add sale | Opens `/orders/new`, then returns to Orders |
| Order row | Opens `/orders/{id}` |
| Details or bill | Back returns to Orders with filters kept in the URL |

The filters live in the URL so a report can be refreshed or shared. A back
navigation keeps them.

## Who sees it

| Visitor | What appears |
|---|---|
| Owner, signed in | Server data. Pill says `Saved` |
| Owner, offline | Last loaded rows. Pill says `Offline`. Writes need a connection |
| Owner, session expired | Sign-in state. No guest fallback |
| Guest on this phone | Local orders. Pill says `Not saved` |
| New venture | Empty state with Add sale |

## Layout

The page uses one column below 1024 px. From 1024 px the collapsible rail
replaces the bottom tabs. The 360 px right column stays empty on report pages.

```text
360 px
┌────────────────────────────┐
│ Orders      3 orders ·     │
│             This month  +  │
├────────────────────────────┤
│ ┌──────────┬──────────┐    │
│ │ Orders   │ To finish│    │
│ │ 12       │ 4        │    │
│ ├──────────┼──────────┤    │
│ │ Due      │ Received │    │
│ └──────────┴──────────┘    │
├────────────────────────────┤
│ Search orders              │
│ All | To finish | Paid     │
│ This month | All           │
├────────────────────────────┤
│ Orders: Total 12   Sort    │
│ ─────────────────────────  │
│ Sana · #SL42               │
│ Needed by: 21-Nov-2026     │
│ 2 items · Status  Paid     │
│              ₹1,000.00     │
│              ₹600.00 due   │
└────────────────────────────┘
```

```text
1200 px
rail │ main column                                      │ right column
     │ Orders  12 orders · This month          Add sale │ empty
     │ ┌────────┬────────┬────────┬────────┐            │
     │ │ Orders │To finish│ Due   │Received│            │
     │ └────────┴────────┴────────┴────────┘            │
     │ [Search orders]  [This month] [All]              │
     │ Orders: Total 12            Sort: Newest         │
     │ row · row · row · row                            │
```

| Zone | Below 768 px | 768 to 1023 px | 1024 px and above |
|---|---|---|---|
| Navigation | Bottom tabs | Bottom tabs | Collapsible rail |
| Page header | 72 px | 72 px | 80 px |
| Summary strip | Two by two grid | Four in a row | Four in a row |
| Filters | Wrapped rows | One row | One row |
| List card | Page flow | Page flow | Page flow, full main width |

## Zones

### Page header

The title is **Orders**. The subtitle states the count and the period, for
example `12 orders · This month`. The filled action is **Add sale**. No second
filled button appears on the page. Empty: the subtitle says `No orders ·
This month`. Hidden: Add sale is hidden for an expired session.

### Summary strip

Four tiles in this order: `Orders`, `To finish`, `Due`, `Received`. Each tile
uses the shared metric anatomy from
[report list anatomy](README.md#report-list-anatomy). Every tile states its
period in the subtitle. `Received` counts payments on orders that are not
cancelled. A cancelled order never adds to `Received` or `Due`. Empty: all four
tiles show zero. Hidden: the strip is hidden for a session-expired owner.

### Filters

The search field accepts a customer name or an order code. Period pills are
`Today`, `This month`, and `All`. Status pills are `All`, `To finish`,
`Payment due`, `Paid`, and `Cancelled`. The default period is **This month** and
the default status is **All**. Empty: the filter bar is hidden when the shop has
no orders. Hidden: the status pills are hidden when the filter returns zero
rows, so the merchant can clear the filter.

### Order list

The card header follows the
[report list anatomy](README.md#report-list-anatomy). It shows `Orders:`,
`Total {count}`, `Total due: {amount}`, the sort control, and the collapse
chevron. Sort keys are `Newest`, `Needed date`, and `Amount due`. `Newest` is
the default. The list caps at 100 rows. A footer line states the cap when more
rows exist: `Showing 100 of 148 orders`. Empty: `No orders for this filter.`
and an Add sale action. Hidden: the list card is hidden while loading.

### Order row

| Row | Content |
|---|---|
| Primary | Customer name or `Walk-in sale`, then `· #{code}` in muted text |
| Secondary | `Needed by: {date}` and `Placed on: {date}` on separate lines at 360 px, one line from 768 px |
| Third | Item summary, item count, status pill, payment pill |
| Amount | Grand total in the right column, `figure` utility |
| Caption | `{due} due` in amber, or `Paid` in green, below the amount |

A needed date in the past is red. Today is amber. A later date is ink. The row
never uses a full-width colored band. A status word always sits beside its
color. See [merchant-language.md](../merchant-language.md#status-words).

## Guest and owner

| Element | Guest | Owner |
|---|---|---|
| Data source | `localStorage` `startlite_guest_v2` | Postgres through RLS |
| State pill | `Not saved` | `Saved` or `Offline` |
| Request bar | Hidden | Shown when requests wait |
| Order status | Derived from payments and stored status | Stored status from the order row |
| Bill link | Local bill text in the detail view | `/orders/{id}/bill` |

## Data

The owner adapter is `getOrdersReport(businessId, filters)` in
[queries.ts](../../lib/queries.ts). The guest adapter is
`guestOrdersReport(state, filters)` in
[guest-store.ts](../../lib/guest-store.ts). Both return `OrdersReportData`. The
shared shapes live in `lib/report-types.ts`, which implementation adds. The page
component never reads a database or local storage directly.

| Value | Source |
|---|---|
| Row | [orders](../data-model.md#orders) with [order_items](../data-model.md#order_items) for the item summary |
| Due | `grandTotal − paidTotal − tdsTotal` from [money](../data-model.md#money) |
| Payment state | [payment-status.ts](../../lib/payment-status.ts) |
| Work state | [order-status.ts](../../lib/order-status.ts) |
| Received in period | Payments on orders whose status is not cancelled |
| Search index | Order list `(business_id, status, created_at DESC)` in [data-model.md](../data-model.md#indexes) |

Guest orders use integer paise through [paise.ts](../../lib/paise.ts). The guest
adapter derives total, paid, due, and status from the same rules.

## Interactions

| Action | Result |
|---|---|
| Tap a row | Opens `/orders/{id}` with filters kept in the URL |
| Tap Add sale | Opens `/orders/new` |
| Change a pill or search field | Updates the URL and refetches the report |
| Tap sort | Opens a small menu. One tap sets the sort and closes the menu |
| Tap the chevron | Collapses or expands the list. State is local to the page |
| Back | Returns to the previous view with filters kept |
| Swipe | No swipe gesture on this page |

Keyboard shortcuts follow the shared shell: `1` to `6` switch tabs and Escape
closes any open menu.

## States

| State | What appears |
|---|---|
| First run | Empty state with Add sale |
| Loading | Skeleton with the final header, four tiles, filter bar, and five row heights |
| Empty filter | `No orders for this filter.` and a Clear filters action |
| Offline owner | Last loaded rows and the `Offline` pill. Writes show a connection message |
| Offline guest | All rows work. Pill stays `Not saved` |
| Load error | `Could not load orders.` and Try again |
| Session expired | Sign-in state. No guest rows |

## Copy

| Element | Text |
|---|---|
| Page title | `Orders` |
| Subtitle | `{n} orders · {period}` |
| Metric tiles | `Orders`, `To finish`, `Due`, `Received` |
| Search placeholder | `Search orders` |
| Period pills | `Today`, `This month`, `All` |
| Status pills | `All`, `To finish`, `Payment due`, `Paid`, `Cancelled` |
| Sort options | `Newest`, `Needed date`, `Amount due` |
| Column labels | `Needed by:`, `Placed on:` |
| Amount caption | `{amount} due`, `Paid` |
| Empty list | `No orders for this filter.` |
| Empty shop | `No orders.` and `Add sale` |
| Cap note | `Showing {n} of {total} orders` |
| Error | `Could not load orders.` and `Try again` |

## Accessibility and performance

- Each row is one link with an accessible name that includes the customer,
  code, total, and payment state.
- Status pills pair a word with a color.
- Amounts use tabular numerals and never animate.
- Search input has a visible label. The placeholder is not the label.
- Filter pills use `aria-pressed`. The sort menu uses `aria-expanded`.
- Tap targets are at least 44 px with 8 px gaps.
- The list renders at most 100 rows. Search and filter run in the adapter.
- Loading uses final heights. Data replaces the skeleton in place.

## Out of scope

- Charts, trends, and sparklines.
- Inline editing of an order.
- Drag to reschedule.
- A date-range picker. Period pills cover the report.
- Showing more than 100 rows without a filter.
- A second report for cancelled orders only. The status pill covers it.
