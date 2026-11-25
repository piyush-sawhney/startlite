# Home

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md).

- Route: `/`. Tab: Home.
- The same screen for a guest and a signed-in owner. Only the data source and a
  handful of signals differ. Logo upload is owner-only.
- The screen answers three questions: what money is waiting, what work is
  unfinished, and what is happening today.

## Purpose

Home is the first screen and the only screen most merchants open on a normal
day. It shows an all-date work queue, today's commitments, and the money.
The order queue is independent of the selected day in the calendar.

An order stays in the queue until work is ready and payment is complete:

| Kind | Meaning | Group |
|---|---|---|
| Work is not ready | Includes quotes and open work, even if fully paid | **To finish** |
| Work is ready, payment incomplete | Work is done. Money is still due. | **Ready to collect** |

**To finish** always comes first. Within each group, scheduled orders sort by
required date and slot (if available), earliest first. Orders without a slot sort by oldest
placed time.

## Arrival

| From | How |
|---|---|
| App icon, bookmark, or `/` | Opens Home |
| Any tab | Tapping Home returns here and keeps the selected day |
| Sign-in, onboarding, import | Lands here after success |
| Notification or WhatsApp link | Lands on the order-details overlay, then Back returns here |

Leaving Home is always a tab tap, an order card, a quick action, or the request
bar. There is no back button on Home.

## Who sees it

| Visitor | What they see |
|---|---|
| New venture, signed out | Launch sheet, then an empty Home on this phone |
| Returning guest | Home from local data. Pill says `Not saved` |
| Owner on a new device | Launch sheet first. Sign in loads the shop |
| Owner, signed in | Home from the server. Pill says `Saved` |
| Owner, session expired | Sign-in state, never a silent guest fallback |
| Owner, pass expired | Home works. Storefront is paused. Pill and banner say so |

## Layout

### Mobile, 360 px

```
┌────────────────────────────────────┐
│ ▢  Anita's Bakes       ● Not saved │  header 56
├────────────────────────────────────┤
│ ⚡ 3 requests · oldest 2h  Review › │  request bar 40
├────────────────────────────────────┤
│ [ Add sale ]       [ Add customer ]│  quick actions
│ [ Add item ]       [ Add expense ] │
├────────────────────────────────────┤
│ INCOMPLETE ORDERS                  │
│ 3 to finish · 5 to collect        │
│ ₹6,200 pending                    │
│ TO FINISH                          │
│ Sana · Bridal · ₹8,000             │
│ Placed 21-Nov · Needed 22-Nov 10am │
│ [Order details]       [Mark ready] │
│ READY TO COLLECT                   │
│ Meena · Facial · ₹650 due          │
│ Placed 20-Nov-2026 · Needed 21-Nov │
│ [Order details]          [Collect] │
│ View all incomplete orders ›       │
├────────────────────────────────────┤
│ ‹  Sat, 21-Nov-2026  ›  Go to today  ▤  │  day view
│                                    │
│ ANY TIME                           │
│  · Ramesh · 2 items · ₹900 · Open  │
│ 10:00  Meena · Facial · ₹650       │
│ 11:30  Sana · Bridal · ₹8,000      │
│ 12:00  ┈ Asha · Bridal · ₹450      │
│ 15:00  ┈ Vikram · 2 items · ₹1,200 │
├────────────────────────────────────┤
│ ↙ CASH IN          ◷ TO COLLECT   │  metrics
│ ₹8,400              ₹4,250         │
│ 12 orders           7 orders       │
│                                    │
│ ▲ SALES             ↗ CASH OUT     │
│ ₹38,900             ₹9,600         │
│ 52 orders           18 entries     │
│                                    │
│ ⌂ CASH LEFT                        │
│ ₹21,300                            │
│ Received − expenses · not profit   │
├────────────────────────────────────┤
│ TO COLLECT FROM CUSTOMERS          │
│  Imran · ₹4,800 · last 2 Nov    ›  │
│  Asha · ₹2,200 · last 8 Nov     ›  │
├────────────────────────────────────┤
│ StartLite · v1                     │
└────────────────────────────────────┘
[Home][Orders][Customers][Items][Expenses][Settings]
```

### Desktop, 1200 px and above

```
┌──────────┬──────────────────────────────────┬─────────────────┐
│ StartLite│ ▢ Anita's Bakes      ● Not saved │ ⚡ 3 requests   │
│          ├──────────────────────────────────┤─────────────────│
│ Home   ● │ [Add sale][Customer][Item][Exp]  │ Sat, 21-Nov-2026  ▤  │
│ Orders   │                                  │                 │
│ Customers│ INCOMPLETE ORDERS                │ ANY TIME        │
│ Items    │ 3 to finish · 5 to collect       │  · Ramesh ₹900  │
│ Expenses │ ₹6,200 pending                   │                 │
│ Settings │ TO FINISH                        │ 10:00 Meena     │
│          │ Sana · Bridal · ₹8,000           │ 11:30 Sana      │
│          │ Placed 21-Nov-2026 · Needed 22-Nov│ 12:00 ┈ Asha    │
│          │ [Order details] [Mark ready]     │ 15:00 ┈ Vikram  │
│          │ READY TO COLLECT                 │                 │
│          │ Meena · Facial · ₹650 due        │                 │
│          │ [Order details] [Collect]        │                 │
│          │ View all incomplete orders ›    │                 │
│          │                                  │                 │
│          │ ↙ CASH IN             ◷ TO COLLECT│                 │
│          │ ₹8,400                      ₹4,250│                 │
│          │ 12 orders                 7 orders│                 │
│          │ ▲ SALES                 ↗ CASH OUT│                 │
│          │ ₹38,900                     ₹9,600│                 │
│          │ 52 orders               18 entries│                 │
│          │ ⌂ CASH LEFT                       │                 │
│          │ ₹21,300                           │                 │
│          │ Received − expenses · not profit │                 │
│          │                                  │                 │
│          │ TO COLLECT FROM CUSTOMERS        │                 │
│          │  Imran ₹4,800 · last 2 Nov    ›  │                 │
│          │  Asha ₹2,200 · last 8 Nov     ›  │                 │
│          │                                  │                 │
│ StartLite│                                  │                 │
└──────────┴──────────────────────────────────┴─────────────────┘
```

The right column scrolls on its own and stays in place while the main column
scrolls. The day view lives there, beside the order queue. From 768 to 1199 px
the day view moves into the main column, after the queue.

### Breakpoint behaviour

| Zone | 320–767 | 768–1199 | 1200+ |
|---|---|---|---|
| Navigation | Bottom tabs | Left rail 200 px | Left rail 240 px |
| Request bar | Bar under header | Bar under header | Header pill plus panel |
| Quick actions | 2 × 2 grid | One row of 4 | One row of 4 |
| Incomplete orders | In flow; list scrolls in the card | In flow | In flow |
| Day view | In flow | In flow | Right column, sticky |
| Metrics | 2 columns, Cash left spans both | 2 columns, Cash left spans both | 2 columns, Cash left spans both |
| Customers | In flow | In flow | In flow |

## Zones

Zones appear in this order on every width.

### 1. Header

- Shop logo 40 px, rounded 12 px. Falls back to the first letter of the shop
  name on `accent-soft`.
- A signed-in owner can tap the logo to open **Shop logo**, then upload, replace,
  or remove it. Settings offers the same controls. Guests see the initial and
  cannot upload a logo.
- Shop name, 16 px, weight 600, one line, truncates with an ellipsis.
- A pen button, 32 × 32, immediately after the shop name. It opens **Edit shop
  name**. It is the only way to rename the shop from Home. The accessible name
  is `Edit shop name`.
- Handle, 12 px muted, from 768 px only.
- State pill, right aligned. See [screens](README.md#state-pill).
- A power button, 32 × 32, immediately after the pill, for a guest and an
  expired session only. It opens the same save sheet as the pill. The
  accessible name is `Sign in to save this shop`. It is never shown to a signed-in
  owner, who has nothing to sign in to.
- The header never hides on scroll. It never carries a search field or a gear.

```
┌────────────────────────────────────┐
│ ▢  Anita's Bakes ✎     ● Not saved ⏻│
└────────────────────────────────────┘
```

Both new buttons are visually quiet: `ink-muted` at rest, `ink` on hover, no
fill, no border. Their tap target is 44 px even though the icon is 16 px.


### 2. Request bar

- Visible only when `pending_orders` has at least one row for this shop.
- Copy: `⚡ {n} requests · oldest {age}` with `Review ›` on the right.
- Age is the oldest row, in `2h` or `3d` form.
- Tap opens the Requests overlay. Accepting does not navigate away.
- A guest never sees this bar. A guest has no public storefront.
- Hidden entirely when the count is zero. No placeholder.

The bar is the pinned form of a pending order. On Home the same requests also
appear as dashed ghost cards in the day view at their requested time.

### 3. Quick actions

Four equal buttons. Two columns on mobile, one row on desktop.

| Button | Opens | Style |
|---|---|---|
| **Add sale** | Full-screen sheet on mobile; dialog or side panel on desktop | Primary, filled accent |
| **Add customer** | Responsive modal sheet | Outlined, quiet |
| **Add item** | Responsive modal sheet | Outlined, quiet |
| **Add expense** | Responsive modal sheet | Outlined, quiet |

**Add sale** is the only filled accent button on the screen. The other three are
outlined with contextual icons (`UserPlus`, `PackagePlus`, `ArrowUpRight`).

**Add sale** opens a full-screen overlay on mobile and a roomy dialog or side
panel on desktop. Back or Escape closes it and returns to the unchanged Home.

### 4. Pending orders

This is a cross-day work queue. It does not change when the selected calendar
day changes.

- Include every `quote` and `open_tab`, plus every `ready` order with a positive
  balance. Exclude `settled` and `cancelled`.
- `settled` means both work is ready and the balance is paid. A fully paid
  `quote` or `open_tab` remains here until work is marked ready.
- Show up to 10 orders. The list scrolls inside the card when needed. The Orders
  tab remains the place for the full order list.
- Group `quote` and `open_tab` under **To finish**, before **Ready to collect**.
- In each group, scheduled orders sort by effective needed date and slot,
  earliest first. Use the confirmed date and slot for accepted orders, and the
  requested date and time for quotes. Orders without a slot follow, oldest
  placed first.
- Orders past their needed date show an **Overdue** badge.
- The header shows the count to finish, count ready to collect, and sum of
  unpaid balances.
- Each row shows needed date and time (most prominent), first item plus `+N`,
  order total or amount due, customer name, placed date, and status.
- **Review** opens a quote in the order-details overlay. **Mark ready** opens
  order details with the ready action. **Collect** opens the payment overlay
  with the full balance prefilled. Tapping the row also opens order details.
- Rows with a customer phone show **WhatsApp**, **SMS**, and **Call** icons for
  quick contact.
- An **Edit** icon on each row opens an edit sheet to change customer details,
  needed-by date/time, items, quantities, prices, discount, and notes.
- Marking work ready moves an unpaid order to **Ready to collect**. A fully paid
  order stays under **To finish** until marked ready, then leaves the queue.
- When both groups are empty, show `No pending orders.` and `Add sale`.

All Home actions use one overlay at a time. Opening another action replaces the
current overlay rather than stacking dialogs. Mobile uses bottom or full-screen
sheets; desktop uses a dialog or side panel. Tab navigation remains navigation.

### 5. Day view

The day view is a sheet of commitments, not an availability grid.

**Date row.** The label states the day. The button states the action. They never
share a word.

| Selected day | Label | Right side |
|---|---|---|
| Today | `Today` | calendar only |
| Yesterday | `Yesterday` | `Go to today` |
| Tomorrow | `Tomorrow` | `Go to today` |
| Any other day | `Sat, 21-Nov-2026` | `Go to today` |

```
‹  Sat, 21-Nov-2026  ›   Go to today   ▤
```

- `Go to today` is direction-neutral, so it reads correctly for a past day and a
  future day. `Back to today` is wrong in the future.
- The button is a text button, 44 px tall, `accent-strong`, no fill. It is never
  a pill, because a pill means "this is selected".
- The calendar button stays pinned at the far right, so nothing shifts when the
  action appears.
- Chevrons and calendar are 44 × 44.
- On desktop the label expands to `Today · Sun, 22 Nov`.
- Swipe left and right on the card area to change day. The chevrons are the
  accessible alternative.
- `T` returns to today.

**Commitments.** Every order for the selected day, regardless of status, in one
scrollable list. Grouped by time: **Any time** first (orders with no confirmed
time), then **morning**, **afternoon**, **evening** (or a flat timeline by
`confirmed_from` when time slots are enabled). Each card shows the time,
customer, first item plus `+N`, total, due, and a status pill. Dashed ghost
cards for storefront requests sit among them at their requested time.

**Scrollable.** The list scrolls inside its container. Mobile shows 5 items at
a time before scrolling. Desktop uses a fixed height with internal scroll so
the right column stays pinned.

**Requests.** Storefront requests as dashed ghost cards at their requested time.
A ghost card is not an order. Tapping it opens the Requests overlay, not the
order-details overlay.

**Empty day.** `Nothing for this day.` plus a text button `Add sale`. When
today is empty, the day view also shows the nearest upcoming day with an order
and a `Go to {date}` button.

**Caps.** No cap on total orders, but the visible viewport is capped at 5
items on mobile and a fixed height on desktop. The section scrolls within its
container; it never grows the page.

### 6. Metrics

Five cells. Each cell is an icon, a short label, an amount, and a muted count.
The same five cells, in the same order, at every width.

| Cell | Short label | Icon | Amount | Count | Period |
|---|---|---|---|---|---|
| Today · Paid | `Cash in` | Green arrow down-left | Payments logged today | Orders paid today | Today |
| Today · To collect | `To collect` | Amber clock | Due on today's orders | Orders with due above zero | Today |
| This week · Sales | `Sales` | Trending up | Revenue subtotal of the week's orders | Orders | Monday to Sunday |
| This week · Expenses | `Cash out` | Red arrow up-right | Expenses logged this week | Entries | Monday to Sunday |
| This week · Cash left | `Cash left` | Wallet | Revenue received minus expenses | None | Monday to Sunday |

Rules:

- The short label and the icon are identical on mobile and desktop. Desktop
  does not switch back to the long label, because the long label wraps at
  1200 px and the icon already carries the period.
- The full label (`Today · Paid`, `This week · Cash left`) is the `title` and the
  accessible name of the cell, so the period is never lost to a screen reader or
  a hover.
- Due is `grand_total − paid_total − tds_total`. Never below zero.
- Sales use `revenue_subtotal`, so deposits and reimbursements do not inflate it.
- Cash left uses money received on revenue lines, not booked sales. It carries the
  caption `Received − expenses · not profit`.
- A zero amount shows `₹0.00`, never a dash.
- The count line is hidden when the count is zero.
- Amounts above ₹1,00,000 use the compact form `₹1.04L` on mobile and the full
  form on desktop. The full amount is always available on tap.

### 7. To collect from customers

- Top 5 customers by pending amount, highest first.
- Row: name, pending amount, `last {date}`, chevron.
- Rows with a customer phone show **WhatsApp**, **SMS**, and **Call** icons for
  quick payment reminders.
- Tap the row to open the customer-details overlay. The Customers tab remains
  available for full customer management.
- Empty: `No dues.`
- Hidden for a shop with no customers.

### 8. Footer

`StartLite · v1` at 11 px, muted, centred on mobile, last row of the rail on
desktop. It never competes with the shop name.

## Entry sheets

Four sheets are reachable from Home. Each is specified here as a field contract;
each gets its own screen doc when it is built.

### Add customer

| Field | Required | Default |
|---|---|---|
| Name | yes | — |
| Country code | yes | `+91` India |
| WhatsApp number | no | 10 digits when the code is `+91` |
| Identification label | no | e.g. `regular`, `Sector 4` |
| Store address | toggle | off |
| Address line 1 | yes when the toggle is on | — |
| Address line 2 | no | — |
| Address line 3 | no | — |
| City | no | — |
| State | no | — |
| Country | no | India |
| Pincode | no | 6 digits when the country is India |

The identification label is how the merchant recognises the person later. It is
free text, not a fixed list.

### Add item

| Field | Required | Notes |
|---|---|---|
| Name | yes | — |
| Category | no | Picker, plus `New category` |
| Description | no | Two lines |
| Photo | no | One image, camera or gallery |
| Unit | no | Default `item`; `piece`, `kg`, `hour` also common |
| Base price | yes unless every variant is priced | — |
| Variant | no | Repeatable: name and price |
| Sub-variant | no | Repeatable inside a variant: name and price |
| Availability slot | no | Toggle, start and end time, optional days |

On a 360 px phone the sheet is full screen with three collapsed sections:
**Basics**, **Pricing**, **Availability**. Only Name and a price are visible on
open. A merchant with no variants sees no variant rows until they tap `Add
variant`. Every variant and every sub-variant row has its own remove control, so
one wrong row never forces a restart.

### Add expense

| Field | Required | Default |
|---|---|---|
| Paid to | yes | — |
| Paid for | yes | — |
| Amount | yes | — |
| Date | no | Today, shown as `23-Nov-2026` |

Four fields, one screen, no scroll. `Paid to` is the person or shop that took the
money, for example `Flour mill`, `Auto`, `Packaging`. `Paid for` is what the
money bought, for example `Flour`, `Rent`, `Packaging`. The two are separate so
the merchant can later see "paid ₹4,000 to the flour mill for flour" without
guessing.

### Add sale

One sheet for a counter sale and for a booked order. Both write the same order
row, so there is one form and one code path. The UI never says `Add order`. The
screen has two tabs: **New sale** and **Record payment**.

| Step | Content |
|---|---|
| Who | Existing customer search, or `Add new customer` inline |
| What | Existing item, then variant, then sub-variant, then quantity. Or `Add new item` inline |
| When | `Now` for a walk-in, or `Later` with a date and a time |
| Payment | Amount received now with mode Cash, UPI, or Card, or `Due later` |

Resulting status:

| When | Payment | Status |
|---|---|---|
| Now | Full | `settled` |
| Now | Partial or none | `ready` |
| Later | Any | `open_tab` |
| Later, marked as an estimate | Any | `quote` |

`Add sale` is also the way to record a payment against an existing order: pick
the order, then `Log payment`. That path is the same payment form the **Collect**
button opens.

## Guest and owner

The layout is identical. Only these differ.

| Element | Guest | Owner |
|---|---|---|
| Pill | `Not saved`, amber | `Saved`, green |
| Request bar | Hidden | Shown when requests wait |
| Ghost cards | None | Shown |
| Store link | Hidden until saved | In Settings |
| Save affordance | Pill, Settings row, one toast | None |
| Data source | `localStorage` `startlite_guest_v2` | Postgres through RLS |

### New device

When there is no session and no local shop, the launch sheet appears before the
dashboard. It is the only thing on screen.

```
┌────────────────────────────────────┐
│                                    │
│   StartLite                        │
│                                    │
│   Is this your shop?               │
│                                    │
│   Sign in to open your shop on     │
│   this phone.                      │
│                                    │
│   New here? Start fresh. It saves  │
│   on this phone.                   │
│                                    │
│   [        Sign in        ]        │
│   [      Start fresh      ]        │
│                                    │
│   You can sign in later from       │
│   Settings.                        │
│                                    │
└────────────────────────────────────┘
```

- **Sign in** opens `/login`. On success the shop loads at `/`.
- **Start fresh** reveals the empty Home and writes a local flag so the sheet
  does not return.
- The sheet is shown once per device. Clearing site data shows it again.

### Tapping the pill

The `Not saved` pill opens the save sheet. It is not the launch sheet: the
launch sheet is first run only, and the pill works on every later day.

```
┌────────────────────────────────────┐
│  Save your shop                    │
│                                    │
│  This shop is only on this phone.  │
│  Sign in to keep it safe and open  │
│  it on another phone.              │
│                                    │
│  [        Sign in        ]         │
│  [     Create account    ]         │
│  [ Keep using this phone ]         │
└────────────────────────────────────┘
```

- **Sign in** opens `/login`.
- **Create account** opens `/login?mode=signup`.
- **Keep using this phone** closes the sheet. It is never the default and never
  styled as primary. The pill stays amber.

This is the answer to the merchant who changes phones and keeps typing without
realising they are not signed in: the pill is always on screen, and one tap
explains the consequence.

### First write as a guest

After the first successful write on this device, one toast appears:

> Saved on this phone. Sign in to keep it safe.

Five seconds, once per device, above the tab bar. Never a modal.

### Session expired

Never fall back to an empty guest workspace. Replace the content:

```
┌────────────────────────────────────┐
│ ▢  Anita's Bakes          ● Sign in│
├────────────────────────────────────┤
│                                    │
│   Your session ended.              │
│   Sign in to open your shop.       │
│                                    │
│   [        Sign in        ]        │
│   [   Use this phone instead   ]   │
│                                    │
└────────────────────────────────────┘
```

- **Sign in** opens `/login` and returns here.
- **Use this phone instead** starts a separate local shop. It is never the
  default and never automatic.

## Data

| Zone | Source | Query shape |
|---|---|---|
| Metrics | `orders`, `order_payments`, `expenses` | One aggregate per period, scoped by `business_id` |
| Day view | `orders`, `pending_orders` | `confirmed_date = $day`, plus `requested_date = $day` for ghosts |
| Incomplete orders | `orders` | `quote`, `open_tab`, or `ready` with positive balance; all dates; count and sum before limiting visible rows to 10 |
| Customers | `customers` | Pending above zero, `pending DESC`, limit 5 |
| Request bar | `pending_orders` | Count and `MIN(created_at)` |

Indexes used:

- `(business_id, confirmed_date, confirmed_from)` for the day view.
- `(business_id, status, confirmed_date, confirmed_from)` for queue sorting and the day view.
- `(business_id, status, created_at)` for unscheduled queue order and the Orders tab.
- `(business_id, created_at DESC)` for pending requests.
- `(business_id, expense_date DESC)` for weekly expenses.

The guest adapter computes the same six shapes from local arrays. It uses the
same labels and the same order. No shape changes between adapters.

## Interactions

| Action | Result |
|---|---|
| Swipe the day area left or right | Previous or next day |
| Tap `‹` or `›` | Previous or next day |
| Tap `Go to today` | Return to today |
| Tap the calendar button | Month sheet, then a day |
| Tap an order row | Order-details overlay |
| Tap **Review** | Quote opens in order-details overlay |
| Tap **Mark ready** | Order-details overlay opens with the ready action |
| Tap a ghost card or Review in the request bar | Requests overlay |
| Tap **Collect** | Payment overlay, due prefilled |
| Tap **Add sale** | Full-screen overlay on mobile; dialog or side panel on desktop |
| Tap **Add customer** | Customer overlay |
| Tap **Add item** | Item overlay |
| Tap **Add expense** | Expense overlay |
| Tap the logo, signed-in owner | Shop logo upload/change/remove overlay |
| Tap a customer row | Customer-details overlay |
| Tap the state pill, guest | Save overlay |
| Tap the pen beside the shop name | Edit shop name overlay |
| Tap the power button, guest | Save overlay |
| Pull to refresh, signed in | Refetch the screen |
| Pull to refresh, guest | No-op, no spinner |

Keyboard, desktop:

- `Tab` moves through the zones in order.
- `Enter` on a row opens it.
- `1` to `6` switch tabs.
- `T` returns to today. `N` opens Add sale.
- `Escape` closes the active overlay.

Back:

- Home has no back button.
- Back or Escape closes the active overlay and restores the Home scroll position.
- Only tab changes leave Home.

## States

| State | What shows |
|---|---|
| First run, no data | Launch sheet, then zeros, `Add sale` primary, empty day |
| Loading | Skeleton below, no spinner |
| Empty day | `Nothing for this day.` plus `Add sale` |
| No requests | Request bar hidden |
| No dues | `No dues.` |
| No incomplete orders | `No incomplete orders.` plus `Add sale` |
| Offline, signed in | Pill `Offline`, last data stays, writes show `You are offline. Saving needs a connection.` |
| Offline, guest | Everything works. Pill stays `Not saved` |
| Session expired | Sign-in state |
| Pass expired | Home works, banner `Your store is paused. Renew to make it live again.` |
| Error | `Could not load Home.` plus `Try again` |
| Logo upload error | State what failed and offer retry; keep the existing logo |

### Loading skeleton

```
┌────────────────────────────────────┐
│ ▢  ██████████          ░░░░░░░░░░ │
├────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────┤
│ ████████      ████████             │
│ ████          ████                 │
│ ██████        ██████               │
│                                    │
│ ████████      ████████             │
│ ████          ████                 │
├────────────────────────────────────┤
│ ████████  ████████  ████████       │
├────────────────────────────────────┤
│ ████████████████████████████████   │
│ ████████████████████████████████   │
└────────────────────────────────────┘
```

The skeleton uses the final heights, so nothing shifts when data arrives.

## Copy

| Element | Text |
|---|---|
| Pill, guest | `Not saved` |
| Pill, owner | `Saved` |
| Pill, offline | `Offline` |
| Pill, expired | `Sign in` |
| Header action, pen | `Edit shop name` |
| Header action, power | `Sign in to save this shop` |
| Edit name title | `Shop name` |
| Edit name hint | `Buyers see this name on every bill.` |
| Edit name save | `Save name` |
| Request bar | `{n} requests · oldest {age}` and `Review` |
| Metrics 1 | `Cash in` (full label `Today · Paid`) |
| Metrics 2 | `To collect` (full label `Today · To collect`) |
| Metrics 3 | `Sales` (full label `This week · Sales`) |
| Metrics 4 | `Cash out` (full label `This week · Expenses`) |
| Metrics 5 | `Cash left` (full label `This week · Cash left`) |
| Cash left caption | `Received − expenses · not profit` |
| Quick actions | `Add sale`, `Add customer`, `Add item`, `Add expense` |
| Day label, today | `Today` |
| Day label, yesterday | `Yesterday` |
| Day label, tomorrow | `Tomorrow` |
| Day label, other | `Sat, 21-Nov-2026` |
| Day action | `Go to today` |
| Day empty | `Nothing for this day.` |
| Any time | `Any time` |
| Queue header | `Pending orders` |
| Queue groups | `To finish`, `Ready to collect` |
| Queue empty | `No pending orders.` |
| Queue row dates | `Placed {date}` and `Needed {date · time}` or `Any time` |
| Queue actions | `Review`, `Mark ready`, `Collect`, `Order details` |
| Queue contact actions | `WhatsApp`, `SMS`, `Call` (when customer phone exists) |
| Queue badge | `Overdue` (when needed date has passed) |
| Queue edit action | `Edit` (opens edit sheet for customer, dates, items, discount) |
| Logo action | `Shop logo` |
| Logo upload actions | `Upload logo`, `Change logo`, `Remove logo` |
| Customers empty | `No dues.` |
| Guest toast | `Saved on this phone. Sign in to keep it safe.` |
| Launch title | `Is this your shop?` |
| Launch body | `Sign in to open your shop on this phone. New here? Start fresh. It saves on this phone.` |
| Launch buttons | `Sign in`, `Start fresh` |
| Launch footnote | `You can sign in later from Settings.` |
| Save sheet title | `Save your shop` |
| Save sheet body | `This shop is only on this phone. Sign in to keep it safe and open it on another phone.` |
| Save sheet buttons | `Sign in`, `Create account`, `Keep using this phone` |
| Expired title | `Your session ended.` |
| Expired body | `Sign in to open your shop.` |
| Expired secondary | `Use this phone instead` |
| Offline write | `You are offline. Saving needs a connection.` |
| Pass banner | `Your store is paused. Renew to make it live again.` |
| Load error | `Could not load Home.` and `Try again` |

## Accessibility and performance

- Every swipe has a button alternative.
- Metrics are a description list, read as label, amount, count.
- Queue group headers are headings, so screen readers can jump between them.
- Each order row opens a labelled order-details overlay. Row actions are separate
  buttons with 44 px targets.
- The queue has a visible scroll region and an accessible name. It does not
  capture page scrolling when the user reaches either end.
- Every overlay traps focus, supports Escape, restores focus to its opener, and
  announces errors.
- The state pill is announced on focus, not on every screen change.
- The date row controls are 44 × 44. The label is not a control.
- Tap targets are 44 px minimum, 8 px apart.
- Amounts use tabular numerals and never animate.
- First meaningful paint under 1.5 s on Slow 4G. The metrics skeleton is the first
  paint, the data replaces it in place.
- The day view stays at 60 fps while swiping. Only `transform` animates.

## Out of scope

- Charts, trends, and sparklines.
- Drag to reschedule. A time change goes through the order-details overlay.
- Editing an order inline. Rows open the order-details overlay.
- A multi-day or month grid on mobile.
- A separate logged-out landing page.
- Profit. The screen says Cash left.

## Open questions

1. Does the week start on Monday in every locale? Current answer: yes, IST.
2. Should the day view default to the next order when today is empty? Current
   answer: yes, show the nearest upcoming day with an order.
3. Should **Mark ready** require a second confirmation? Current answer: no. It
   opens order details, where the owner confirms the action.
4. Should an empty incomplete-order queue stay visible? Current answer: yes.
   Keep one queue card with `No pending orders.` and `Add sale`.

## TODO

1. ~~Incomplete order text to be changed to Pending Orders.~~ Done — section
   renamed to "Pending orders" throughout code and docs.

2. ~~The Orders in the Order Card List -> Prioritisation of the info shown.~~
   Done — order card now leads with needed-by date/time, then items, then
   customer name. Overdue badge added for past-due orders.

3. ~~Adding actions on the order item in order card list.~~ Done — WhatsApp,
   SMS, and Call icons added to each order row (when customer phone exists) and
   to each customer dues row. Message is prefilled with order details and due
   amount.

4. The idea is home screen is the primary action page of the app. so it should
   be built like that . the other pages will be primarily report pages for
   sales, customers or item and secondary for actions. So from home screen or
   through the modals that open in home scree a merchant should ideally be able
   to take all action.


5. improve the modals. Like add sale should have by default searchable items to
   add, if item not present ability to add item (similar to add item modal),
   chose from customer or add customer (similar to add customer). This should be
   the most comprehensive modal.

6. ~~There should be a way to edit orders by the merchant.~~ Done — edit sheet
   added to Home with customer details, needed-by date/time, items
   (add/remove/edit), discount, and notes. PATCH API extended to support all
   fields. Keyboard shortcuts (T = today, N = add sale, 1-6 = tabs, Escape =
   close overlay) added for desktop.

7. Statuses -> Under Review, Waiting for Client Confirm, Accepted, Declined,
   Pending Payment, Completed (For which order is also done and payment is also
   received), give me more suggestions, for each business type and how can we
   make these generic. 

8. ~~Day view should show all orders of the day irrespective of the status.~~
   Done — day view is now a scrollable commitment list showing all orders for
   the selected day. Mobile caps at 5 visible items; desktop uses a fixed
   height with internal scroll. 

9. Way to update logo for the merchant in signed in state, round or reactangle logo, need discussion. 

10. A permanent way that remains on the screen always, either in menu or simile to review notification , a way to quickly share the storefront. 
