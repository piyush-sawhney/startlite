# Home

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md).

- Route: `/`. Tab: Home.
- The same screen for a guest and a signed-in owner. Only the data source and a
  handful of signals differ.
- The screen answers three questions: what money is waiting, what work is
  unfinished, and what is happening today.

## Purpose

Home is the first screen and the only screen most merchants open on a normal
day. It must show the two kinds of unfinished order, the day, and the money
without a scroll on a 360 px phone.

There are two kinds of unfinished order. They are different problems and they
never mix:

| Kind | Meaning | Group |
|---|---|---|
| Order complete, payment incomplete | Work is done. Money is not in. | **Ready to collect** |
| Order incomplete | Work is not done yet. | **In progress** |

Money waiting is the more urgent of the two, so **Ready to collect is always
first**.

## Arrival

| From | How |
|---|---|
| App icon, bookmark, or `/` | Opens Home |
| Any tab | Tapping Home returns here and keeps the selected day |
| Sign-in, onboarding, import | Lands here after success |
| Notification or WhatsApp link | Lands on the order sheet, then Back returns here |

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
│ READY TO COLLECT      5 · ₹6,200   │  money waiting
│  Ramesh · 2 items · ₹900 [Collect] │
│  Meena · Facial · ₹650   [Collect] │
│  View all 5                        │
├────────────────────────────────────┤
│ IN PROGRESS           3 · ₹2,100   │  work unfinished
│  Sana · Bridal · ₹8,000 [Complete] │
│  Imran · Quote · ₹1,800 [Open]     │
│  View all 3                        │
├────────────────────────────────────┤
│ ‹  Sat, 21 Nov  ›  Go to today  ▤  │  day view
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
│ Home   ● │ [Add sale][Customer][Item][Exp]  │ Sat, 21 Nov  ▤  │
│ Orders   │                                  │                 │
│ Customers│ READY TO COLLECT     5 · ₹6,200  │ ANY TIME        │
│ Items    │  Ramesh  2 items  ₹900  Collect  │  · Ramesh ₹900  │
│ Expenses │  Meena   Facial   ₹650  Collect  │                 │
│ Settings │  View all 5                      │ 10:00 Meena     │
│          │                                  │ 11:30 Sana      │
│          │ IN PROGRESS          3 · ₹2,100  │ 12:00 ┈ Asha    │
│          │  Sana    Bridal   ₹8,000 Complete│ 15:00 ┈ Vikram  │
│          │  Imran   Quote    ₹1,800 Open    │                 │
│          │  View all 3                      │                 │
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
scrolls. The day view lives there, so it is beside the order groups rather than
below them. From 768 to 1199 px the day view moves into the main column, after
In progress.

### Breakpoint behaviour

| Zone | 320–767 | 768–1199 | 1200+ |
|---|---|---|---|
| Navigation | Bottom tabs | Left rail 200 px | Left rail 240 px |
| Request bar | Bar under header | Bar under header | Header pill plus panel |
| Quick actions | 2 × 2 grid | One row of 4 | One row of 4 |
| Ready to collect | In flow | In flow | In flow |
| In progress | In flow | In flow | In flow |
| Day view | In flow | In flow | Right column, sticky |
| Metrics | 2 columns, Cash left spans both | 2 columns, Cash left spans both | 2 columns, Cash left spans both |
| Customers | In flow | In flow | In flow |

## Zones

Zones appear in this order on every width.

### 1. Header

- Shop logo 40 px, rounded 12 px. Falls back to the first letter of the shop
  name on `accent-soft`.
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
- Tap opens the Requests sheet. Accepting does not navigate away.
- A guest never sees this bar. A guest has no public storefront.
- Hidden entirely when the count is zero. No placeholder.

The bar is the pinned form of a pending order. On Home the same requests also
appear as dashed ghost cards in the day view at their requested time.

### 3. Quick actions

Four equal buttons. Two columns on mobile, one row on desktop.

| Button | Opens | Style |
|---|---|---|
| **Add sale** | Add sale screen | Primary, filled accent |
| **Add customer** | Add customer sheet | Outlined, quiet |
| **Add item** | Add item sheet | Outlined, quiet |
| **Add expense** | Add expense sheet | Outlined, quiet |

**Add sale** is the only filled accent button on the screen. The other three are
outlined with contextual icons (`UserPlus`, `PackagePlus`, `ArrowUpRight`).

**Add sale** opens a full screen, not a modal. It needs the height on a 360 px
phone, and a sale must survive a refresh. Back returns to Home with the
dashboard unchanged.

### 4. Ready to collect

The first group. Work is done, money is not in. This is the more urgent of the
two unfinished kinds.

- Source: `status = 'ready'`.
- Order: `ready_at` ascending, oldest first. A missing `ready_at` falls back to
  the confirmed date.
- Header: `READY TO COLLECT`, then `{count} · ₹{total due}`.
- Row: customer, first item plus `+N`, due, and a **Collect** button.
- **Collect** opens the payment sheet with the full due prefilled.
- Tapping the row opens the order sheet.
- Cap: 5 rows. `View all {n}` opens `/orders?group=ready`.
- Empty: `Nothing to collect.` The group stays visible with its header, so the
  screen does not change shape between a busy and a quiet day.

### 5. In progress

The second group. The work is not finished yet.

- Source: `status IN ('quote', 'open_tab')`.
- Order: quotes first, then `open_tab` by confirmed date and time ascending.
  Untimed orders last.
- Header: `IN PROGRESS`, then `{count} · ₹{total}`.
- Row: customer, first item plus `+N`, total, and one action.
  - `open_tab`: **Complete**. One tap sets `status = 'ready'` and
    `ready_at = now()`. A toast says `Marked complete · Undo` for 5 seconds.
  - `quote`: **Open**. Acceptance happens in the order sheet.
- Tapping the row opens the order sheet.
- Cap: 5 rows. `View all {n}` opens `/orders?group=open`.
- Empty: `Nothing in progress.`

The two groups never mix. A completed order with money due is never shown under
In progress, and an open order is never shown under Ready to collect.

### 6. Day view

The day view is a sheet of commitments, not an availability grid.

**Date row.** The label states the day. The button states the action. They never
share a word.

| Selected day | Label | Right side |
|---|---|---|
| Today | `Today` | calendar only |
| Yesterday | `Yesterday` | `Go to today` |
| Tomorrow | `Tomorrow` | `Go to today` |
| Any other day | `Sat, 21 Nov` | `Go to today` |

```
‹  Sat, 21 Nov  ›   Go to today   ▤
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

**Any time.** Orders with no confirmed time (`confirmed_from IS NULL`) sit in a
compact row above the timeline. This covers `none` and `date` precision.

**Timeline.** Confirmed orders as solid cards, sorted by `confirmed_from`. Each
card shows the time, customer, first item plus `+N`, total, due, and a status
pill.

**Requests.** Storefront requests as dashed ghost cards at their requested time.
A ghost card is not an order. Tapping it opens the Requests sheet, not the order
sheet.

**Empty day.** `Nothing for this day.` plus a text button `Add sale`.

**Caps.** No cap. The day is short by nature. The section scrolls with the page
on mobile and inside the right column on desktop.

### 7. Metrics

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

### 8. To collect from customers

- Top 5 customers by pending amount, highest first.
- Row: name, pending amount, `last {date}`, chevron.
- Tap opens the customer sheet. `View all` is not needed; the Customers tab is one
  tap away.
- Empty: `No dues.`
- Hidden for a shop with no customers.

### 9. Footer

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
variant`.

### Add expense

| Field | Required | Default |
|---|---|---|
| Paid to | yes | — |
| Amount | yes | — |
| Date | no | Today |

Two fields, one screen, no scroll. `Paid to` is the person or shop that took the
money, for example `Flour mill`, `Auto`, `Packaging`.

### Add sale

One sheet for a counter sale and for a booked order. Both write the same order
row, so there is one form and one code path. The UI never says `Add order`.

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
| Ready to collect | `orders` | `status = 'ready'`, `ready_at ASC`, limit 5 plus count and sum |
| In progress | `orders` | `status IN ('quote','open_tab')`, quotes first, limit 5 plus count and sum |
| Customers | `customers` | Pending above zero, `pending DESC`, limit 5 |
| Request bar | `pending_orders` | Count and `MIN(created_at)` |

Indexes used:

- `(business_id, confirmed_date, confirmed_from)` for the day view.
- `(business_id, status, ready_at)` for Ready to collect.
- `(business_id, status, created_at DESC)` for In progress and the Orders tab.
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
| Tap an order card | Order sheet |
| Tap a ghost card | Requests sheet |
| Tap **Collect** | Payment sheet, due prefilled |
| Tap **Complete** | Order becomes `ready`, toast with Undo |
| Tap **Add sale** | Add sale screen |
| Tap **Add customer** | Add customer sheet |
| Tap **Add item** | Add item sheet |
| Tap **Add expense** | Add expense sheet |
| Tap the state pill, guest | Save sheet |
| Tap the pen beside the shop name | Edit shop name sheet |
| Tap the power button, guest | Save sheet |
| Pull to refresh, signed in | Refetch the screen |
| Pull to refresh, guest | No-op, no spinner |

Keyboard, desktop:

- `Tab` moves through the zones in order.
- `Enter` on a row opens it.
- `1` to `6` switch tabs.
- `T` returns to today. `N` opens Add sale.

Back:

- Home has no back button.
- Back from a sheet closes the sheet.
- Back from Add sale returns to Home.
- Back from another tab returns to Home.

## States

| State | What shows |
|---|---|
| First run, no data | Launch sheet, then zeros, `Add sale` primary, empty day |
| Loading | Skeleton below, no spinner |
| Empty day | `Nothing for this day.` plus `Add sale` |
| No requests | Request bar hidden |
| No dues | `No dues.` |
| No orders at all | Both groups show their empty line, so the shape stays stable |
| Offline, signed in | Pill `Offline`, last data stays, writes show `You are offline. Saving needs a connection.` |
| Offline, guest | Everything works. Pill stays `Not saved` |
| Session expired | Sign-in state |
| Pass expired | Home works, banner `Your store is paused. Renew to make it live again.` |
| Error | `Could not load Home.` plus `Try again` |

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
| Day label, other | `Sat, 21 Nov` |
| Day action | `Go to today` |
| Day empty | `Nothing for this day.` |
| Any time | `Any time` |
| Ready header | `Ready to collect` |
| In progress header | `In progress` |
| Group empty, ready | `Nothing to collect.` |
| Group empty, progress | `Nothing in progress.` |
| Row action, ready | `Collect` |
| Row action, open | `Complete` |
| Row action, quote | `Open` |
| Complete toast | `Marked complete · Undo` |
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
- Group headers are headings, so screen readers can jump between them.
- Each order row is one link with an accessible name:
  `Ramesh, 2 items, ₹900 due, completed`.
- The state pill is announced on focus, not on every screen change.
- The date row controls are 44 × 44. The label is not a control.
- Tap targets are 44 px minimum, 8 px apart.
- Amounts use tabular numerals and never animate.
- First meaningful paint under 1.5 s on Slow 4G. The metrics skeleton is the first
  paint, the data replaces it in place.
- The day view stays at 60 fps while swiping. Only `transform` animates.

## Out of scope

- Charts, trends, and sparklines.
- Drag to reschedule. A time change goes through the order sheet.
- Editing an order inline. Rows open the order sheet.
- A multi-day or month grid on mobile.
- A separate logged-out landing page.
- Profit. The screen says Cash left.

## Open questions

1. Does the week start on Monday in every locale? Current answer: yes, IST.
2. Should the day view default to the next order when today is empty? Current
   answer: no, today stays today.
3. Should **Complete** require a confirm when the order has a future confirmed
   date? Current answer: no, Undo covers it.
4. When a shop has no orders at all, should both groups collapse into one
   first-run card? Current answer: no, keep both headers so the screen does not
   change shape later.
