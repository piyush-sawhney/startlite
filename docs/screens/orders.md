# Orders

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md). Visual rules live in [design-system.md](../design-system.md).

Orders is the full order report. It answers one question: which work and which
money need attention in the chosen period. Home answers the same question for
today; Orders covers every date and every status.

The canonical route is `/orders`. The implementation serves `/app/sales` and
redirects `/orders` and `/orders/{id}` to it, so old links keep working. The page
is a list report with no charts and no editable rows.

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
| Home, bill link | Opens the bill for a printed or shared copy |
| Add sale | Opens the new-sale form, then returns to Orders |
| Order row | Opens the order detail |
| Detail or bill | Back returns to Orders with filters kept in the URL |

Filters live in the URL so a report can be refreshed or shared.

## Who sees it

| Visitor | What appears |
|---|---|
| Owner, signed in | Server data. Pill says `Saved` |
| Owner, offline | Last loaded rows. Pill says `Offline` |
| Owner, session expired | Sign-in state. No guest fallback |
| Guest on this phone | Local orders. Pill says `Not saved` |

## Layout

One column below 1280 px. From 1280 px the editor and order facts use a 360 px
right column.

```text
360 px
┌────────────────────────────┐
│ Orders            + Add sale│
│ 12 orders · This month     │
├────────────────────────────┤
│ ORDERS   TO FINISH  DUE    │
│ 12       4        ₹2,400  │
│ RECEIVED ₹8,000            │
├────────────────────────────┤
│ [Search name, mobile, code]│
│ Today · This month · All   │
│ All · To finish · Paid …   │
├────────────────────────────┤
│ ← sideways for columns →   │
│ ORDER │ CUSTOMER │ NEEDED │
│ [code] [name]   [date]     │
│ #SL42 │ Sana     │21-Nov… │
│       │••••3210 │         │
└────────────────────────────┘
```

```text
1280 px
rail │ main column                                │ right column
     │ Orders                       + Add sale     │ empty on report
     │ ─── ORDERS ─ TO FINISH ─ DUE ─ RECEIVED ─   │
     │ [Search name, mobile or order code]        │
     │ [Today][This month][All] [All][To finish]  │
     │ ORDER│CUSTOMER│NEEDED│PLACED│STATUS│PAYMENT│ITEMS…│
     │ [filter row]                               │
     │ row · row · row · row                       │
```

| Zone | Below 768 px | 768 to 1279 px | 1280 px and above |
|---|---|---|---|
| Navigation | Bottom tabs | Bottom tabs | Collapsible rail |
| Summary | Two by two grid, then stacked | One ruled row | One ruled row |
| Filters | Wrapped rows | One row | One row |
| Table | Horizontal scroll | Horizontal scroll | Full main width |

## Zones

### Page header

The title is **Orders** with a small `Report` eyebrow. The subtitle states the
count and period, for example `12 orders · This month`. The one filled action is
`Add sale`. Empty: the subtitle says `0 orders · This month`.

### Summary strip

Four figures sit in one hairline-ruled strip with eyebrow labels: `Orders`,
`To finish`, `Due`, `Received`. The Orders figure carries the `to finish · due`
mix as a caption. `Received` counts payments on orders that are not cancelled;
a cancelled order never adds to `Received` or `Due`. Every figure respects the
period filter. Empty: all four show zero.

### Filters

The search field matches customer name, mobile digits, and order code, and
updates the list as you type (300 ms debounce). Period pills are `Today`,
`This month`, and `All`. Status pills are `All`, `To finish`, `Payment due`,
`Paid`, and `Cancelled`. Defaults are `All` period and `All` status. The filter
bar is hidden when the shop has no orders.

### Order table

There is no card header strip: no `Orders:` label, count, or collapse chevron.
The table has sticky header rows and a sticky Order column, so headers stay with
their columns while scrolling. Text columns have filter inputs with per-column
clear buttons; amount and count columns are sortable only. `Placed` sorts by
newest first by default. The adapter caps rows at 100; a footer line reads
`Showing 100 of {total} orders`. Empty: `No orders.` with Add sale, or
`No orders for this filter.` with Clear filters.

| Column | Cell content | Filter |
|---|---|---|
| Order | `#{code}`, plus `From store` when applicable | Text |
| Customer | Name or `Walk-in sale`, masked mobile on a second line | Text on both lines |
| Needed | Needed date in `DD-Mon-YYYY` | Text on ISO and display date |
| Placed | Placed date | Text on ISO and display date |
| Status | Work status pill, in its own column | Text |
| Payment | Payment pill, in its own column, same size as the status pill | Text |
| Items | Item line count | None |
| Total | Grand total, `figure` utility | None |
| Paid | Amount collected, `figure` utility | None |
| Due | Positive balance in amber, or `—` when settled | None |

### Detail

The order detail is a compact workspace. The header shows the customer name,
`#code · placed date`, and the work status pill. `Send bill`, `Call`, and the
payment pill sit in one compact link row. A ruled stats strip shows `Total`,
`Paid`, `Due`, and `Items` (item count with a units caption).

From 1280 px the page uses two columns: Items with the amount breakdown on the
left, and order Details plus Payments in the sticky 360 px column on the right.
Below that breakpoint they stack in the same order. Payment and status actions
stay full width under the grid. Empty: Items says `No items.`; Payments is
hidden when there are no payments.

## Data

The owner adapter is `getOrdersReport(businessId, filters)` in
[queries.ts](../../lib/queries.ts). It returns `OrdersReportData` from
[report-types.ts](../../lib/report-types.ts) and renders through
`components/reports/OrdersReport.tsx`. The adapter filters, searches, sorts, and
caps rows before render; the page component reads neither storage nor the
database directly.

| Value | Source |
|---|---|
| Row | [orders](../data-model.md#orders) with grouped counts from `order_items` |
| Due | `grandTotal − paidTotal − tdsTotal` from [money](../data-model.md#money) |
| Payment state | [payment-status.ts](../../lib/payment-status.ts) |
| Work state | [order-status.ts](../../lib/order-status.ts) |
| Received in period | Payments on orders whose status is not cancelled |

## Interactions

| Action | Result |
|---|---|
| Type in search | Updates the URL after a 300 ms debounce and filters the table |
| Tap a period or status pill | Sets the segment and updates the URL |
| Tap a column header | Sorts that column; a second tap reverses the direction |
| Type in a text-column filter | Keeps rows matching that column |
| Tap the `×` in a filter | Clears that one column's filter |
| Tap `Clear filters` | Removes all column filters and server filters |
| Tap a row | Opens the order detail with filters kept in the URL |
| Back | Returns to Orders with filters kept |
| Swipe | Scroll the table sideways for more columns |

## States

| State | What appears |
|---|---|
| First run | `No orders.` with Add sale |
| Loading | Skeleton with the final header, strip, filters, and five row heights |
| Empty filter | `No orders for this filter.` and Clear filters |
| Offline owner | Last loaded rows and the `Offline` pill |
| Load error | `Could not load orders.` and Try again |
| Session expired | Sign-in state. No fallback rows |

## Copy

| Element | Text |
|---|---|
| Page title | `Orders` |
| Subtitle | `{n} orders · {period}` |
| Summary | `Orders`, `To finish`, `Due`, `Received` |
| Search placeholder | `Search name, mobile or order code` |
| Period pills | `Today`, `This month`, `All` |
| Status pills | `All`, `To finish`, `Payment due`, `Paid`, `Cancelled` |
| Column labels | `Order`, `Customer`, `Needed`, `Placed`, `Status`, `Payment`, `Items`, `Total`, `Paid`, `Due` |
| Filter clear label | `Clear {column} filter` |
| Cap note | `Showing {n} of {total} orders` |
| Detail labels | `Items`, `Details`, `Payments`, `Needed`, `Time`, `Placed`, `Source`, `Note` |
| Detail actions | `Send bill`, `Call`, `OrderActions` buttons |

## Accessibility and performance

- Each linked row's code is a link with an accessible name containing the code,
  customer, and balance due.
- Pills use `aria-current`; every sortable header sets `aria-sort`.
- Text filters have screen-reader labels, contextual placeholders, and named
  clear buttons.
- Amount figures are right aligned with tabular numerals and never animate.
- Header rows and the Order column stay visible while the table scrolls.
- The adapter caps at 100 rows. Search, filter, and sort run before render.

## Out of scope

- Charts, trends, and sparklines.
- Inline editing of an order.
- Drag to reschedule.
- A date-range picker.
- Showing more than 100 rows without a filter.
