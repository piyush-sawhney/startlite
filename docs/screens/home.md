# Home

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md).

- Route: `/`. Tab: Home.
- The same screen for a guest and a signed-in owner. Only the data source and a
  handful of signals differ. Logo upload is owner-only.
- The screen answers three questions: what money is waiting, what work is
  unfinished, and what is happening today.
- Visual language: a plain white canvas and white cards. Color is reserved for
  meaning — brand teal for primary actions and net cash, green for money in,
  amber for money due and requests, red for money out and overdue, blue for
  waiting. A label and a word always carry the meaning; color never does it
  alone.

## Purpose

Home is the first screen and the only screen most merchants open on a normal
day. It shows an all-date work queue, today's commitments, and the money.
The order queue is independent of the selected day in the calendar.

An order stays in the queue until work is ready and payment is complete:

| Kind | Meaning | Group |
|---|---|---|
| Work is not ready | `under_review`, `waiting_client`, `accepted`, `in_progress`, even if fully paid | **To finish** |
| Work is ready, payment incomplete | `ready`. Work is done. Money is still due. | **Ready to collect** |

**To finish** always comes first. Inside each group the queue is sorted by
urgency, most important first:

1. Overdue — the needed date has passed.
2. Needed today.
3. Upcoming, earliest date first.
4. Undated.

Inside one band, a timed commitment comes before an "Any time" order, then the
earliest slot wins, then the oldest placed order. A scheduled order for next
week never outranks an overdue order with no slot. The sort takes the real
today, not the selected day in the calendar, so the queue stays independent of
the day view.

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
│ 3 requests · oldest 2h  Review › │  request bar 40
├────────────────────────────────────┤
│ [ Add sale ]       [ Add customer ]│  quick actions
│ [ Add item ]       [ Add expense ] │
├────────────────────────────────────┤
│ PENDING ORDERS                  │
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
│  · Ramesh · 2 items · ₹900 · Accepted │
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
│ StartLite│ ▢ Anita's Bakes      ● Not saved │ 3 requests   │
│          ├──────────────────────────────────┤─────────────────│
│ Home   ● │ [Add sale][Customer][Item][Exp]  │ Sat, 21-Nov-2026  ▤  │
│ Orders   │                                  │                 │
│ Customers│ PENDING ORDERS                │ ANY TIME        │
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
| Pending orders | In flow; list scrolls in the card | In flow | In flow |
| Day view | In flow | In flow | Right column, sticky |
| Metrics | 2 columns, Cash left spans both | 2 columns, Cash left spans both | 2 columns, Cash left spans both |
| Customers | In flow | In flow | In flow |

## Zones

Zones appear in this order on every width.

### 1. Header

- Shop logo 40 px, round (a circle). Falls back to the first letter of the shop
  name on `accent-soft`, in the same round shape.
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
- A share button, 32 × 32, for a signed-in owner only. It opens the **Share
  storefront** sheet with the store link, a copy action, and a WhatsApp share
  action. The accessible name is `Share storefront`.
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
- Copy: `{n} requests · oldest {age}` with `Review ›` on the right. The bolt is
  an SVG icon, never an emoji.
- Age is the oldest row, in `2h` or `3d` form.
- Amber on white: the color says "attention", the words say what it is.
- Tap opens the Requests sheet. Accepting does not navigate away.
- A guest never sees this bar. A guest has no public storefront.
- Hidden entirely when the count is zero. No placeholder.

The bar is the pinned form of a pending order. On Home the same requests also
appear as dashed ghost cards in the day view at their requested time.

### 3. Quick actions

Four equal buttons. Two columns on mobile, one row on desktop.

| Button | Opens | Style |
|---|---|---|
| **Add sale** | Full-screen sheet on mobile; dialog or side panel on desktop | Filled brand teal |
| **Add customer** | Bottom sheet on mobile; dialog on desktop | White card, blue `UserPlus` |
| **Add item** | Bottom sheet on mobile; dialog on desktop | White card, teal `PackagePlus` |
| **Add expense** | Bottom sheet on mobile; dialog on desktop | White card, red `ArrowUpRight` |

**Add sale** is the only filled accent button on the screen. All four buttons
are 48 px tall on mobile. Each secondary icon has a meaningful hue: blue for a
person, teal for a catalog item, red for money going out.

**Add sale** opens a full-screen overlay on mobile and a roomy dialog or side
panel on desktop. Back or Escape closes it and returns to the unchanged Home.

### 4. Pending orders

This is a cross-day work queue. It does not change when the selected calendar
day changes.

- Include every `under_review`, `waiting_client`, `accepted`, and `in_progress`
  order, plus every `ready` order with a positive balance. Exclude `completed`,
  `declined`, and `cancelled`.
- `completed` means both work is ready and the balance is paid. A fully paid
  `accepted` or `in_progress` order remains here until work is marked ready.
- Show up to 10 orders. On mobile the card grows with its rows and the page
  scrolls normally. From 1200 px the card scrolls inside itself with
  `overscroll-contain`, so a wheel or swipe at its end never moves the page. The
  Orders tab remains the place for the full order list.
- Two visible groups: **To finish** (amber dot) before **Ready to collect**
  (teal dot). Each group header carries its count.
- Sorting is urgency first: overdue, today, upcoming, undated. See
  [Purpose](#purpose) for the full priority order.
- Orders past their needed date show an **Overdue** badge in red, with the
  word "Overdue" as well as the colour.
- The header shows the count to finish, count ready to collect, and sum of
  unpaid balances. A left rail marks each row's group.
- Each row leads with the two things the merchant scans: **Needed by** (date
  and time) and **Items**. Up to three item names are shown; a longer list
  reads `Cake, Bread, Tea · +2 more`. A buyer's note appears in its own amber
  block labelled `Buyer's note`; it is never hidden inside the item line.
- Below the highlights come the customer name, `Placed {date}`, status, and the
  total or amount due.
- The row action names the next action: **Accept**, **Mark ready**, or
  **Collect**. Tapping the row opens the same action sheet. There is no
  separate Review step.
- Rows with a customer phone show **WhatsApp**, **SMS**, and **Call** icons on
  soft green, blue, and teal chips. Every icon is 40 px with a 44 px hit area.
- An **Edit** icon on each row opens an edit sheet to change customer details,
  needed-by date/time, items, quantities, prices, discount, and notes.
- Labels are plain: "Due" means money owed, not a vague "Pending".
- Marking work ready moves an unpaid order to **Ready to collect**. A fully paid
  order stays under **To finish** until marked ready, then leaves the queue.
- When both groups are empty, show `No pending orders.` and `Add sale`.

All Home actions use one overlay at a time. Opening another action replaces the
current overlay rather than stacking dialogs. Mobile uses bottom or full-screen
sheets; desktop uses a dialog or side panel. Tab navigation remains navigation.

### Home is the primary action page

Home, or the overlays that open from it, must let the merchant take every
daily action. The other tabs are primarily reports: Sales, Customers, and Items
list and manage records; they are secondary for actions.

Audit of every action and where it lives:

| Action | Where |
|---|---|
| Add sale, customer, item, expense | Home quick actions |
| Accept, mark ready, collect payment | Home order sheet |
| Cancel order, reopen a ready order | Home order details overlay |
| Send bill | Home order details overlay → bill page |
| WhatsApp, SMS, call a customer | Home order rows and customer dues rows |
| Edit an order | Home edit sheet |
| Share the storefront | Home header |
| Rename the shop, change the logo | Home header |
| Add previous due (opening due) | Customers tab, a rare setup step |
| Edit or retire a catalog item | Items tab, a management step |
| Store settings, language, store link | Settings tab |

Opening the bill page from Home is the one navigation away from Home. Back
returns to the unchanged Home.

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
- Chevrons and calendar are SVG icons in 44 × 44 buttons. The calendar label
  uses a second calendar glyph so the two controls read differently.
- A count pill shows the number of commitments, so a long day is visible at a
  glance even though the list scrolls.
- Swipe left and right on the card area to change day. The chevrons are the
  accessible alternative.
- `T` returns to today.

**Commitments.** Every order needed on the selected day, in one scrollable
list. The day view reads its own query, so it is never limited by the 200 most
recent orders used for the metrics. Cancelled, declined, and completed orders
stay in the day's history. `Any time` covers orders with no slot, an empty
slot, or the literal `Any time` / `None`. Each row shows the time, customer,
first item plus `+N`, total, due in amber, and a status pill. A teal left rail
marks an order; an amber left rail marks a storefront request.

**Scrollable.** On mobile every commitment is in the page flow; there is no
inner scroll region that competes with page scrolling. On desktop the right
column has a fixed height with `overscroll-contain`, so it stays pinned while
its own list scrolls.

**Requests.** Storefront requests sit among the orders at their requested time.
A request is not an order. Tapping it opens the Requests sheet, not the
order-details sheet.

**Empty day.** `Nothing for this day.` plus a text button `Add sale`. When
today is empty, the day view also shows the nearest upcoming day with an order
and a `Go to {date}` button.

**Caps.** No cap on the number of orders returned, and no status filter. On
mobile the list grows with the page. On desktop the viewport is capped and
scrolls inside the card without chaining to the page. The guest workspace
computes the same list from local orders with the same rules.

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

Each cell is a soft tint of its own meaning: green for money in, amber for
money due, teal for sales, red for money out. **Cash left** is a deep teal card
that spans both columns; it is the net position and the one dark anchor on the
screen. All five amount/icon pairs are readable at 4.5:1 or better.

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
- Rows with a customer phone show **WhatsApp**, **SMS**, and **Call** icons on
  soft green, blue, and teal chips with 44 px hit areas.
- A count pill sits in the header. Rows are keyboard operable.
- Tap the row to open the customer-details sheet. The Customers tab remains
  available for full customer management.
- Empty: `No dues.`
- Hidden for a shop with no customers.

### 8. Footer

`StartLite · v1` at 11 px, muted, centred on mobile, last row of the rail on
desktop. It never competes with the shop name.

## Entry sheets

Four entry sheets are reachable from Home. The Requests and order sheets are
specified with them below. Each gets its own screen doc when it is built. All
sheets are bottom sheets on mobile, reach above the safe area, and keep their
primary action visible while the content scrolls.

### Add customer

| Field | Required | Default |
|---|---|---|
| Name | yes | — |
| Country code | yes | `+91` India |
| WhatsApp number | no | 10 digits when the code is `+91` |
| Label | no | e.g. `regular`, `Sector 4` |
| Store address | toggle | off |
| Address line 1 | yes when the toggle is on | — |
| Address line 2 | no | — |
| Address line 3 | no | — |
| City | no | — |
| State | no | — |
| Country | no | India |
| Pincode | no | 6 digits when the country is India |

The label is how the merchant recognises the person later. It is free text, not
a fixed list. The field is called "Label", with an example in the placeholder.

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

This is the most comprehensive modal on Home. It must let the merchant complete
a sale without leaving it, even when the customer or item does not exist yet.

| Step | Content |
|---|---|
| Customer | Searchable customer list by name or phone. Selecting one shows their pending due. Or `Add new customer` inline (name, country code, phone, label, optional address) |
| Items | Searchable item list by name. Each item expands to variant, sub-variant, quantity, and line note. Or `Add new item` inline (name, price, unit, category, photo, variants). `Quick amount` records one lump sum with no item list |
| Schedule | `Now` for a walk-in, or `Later` with a date and a time. `Later` can be marked as an estimate |
| Payment | `Full`, `Partial` (amount received now), or `Due later`, with mode Cash, UPI, Card, Bank, or Other |

The section names are plain nouns — Customer, Items, Schedule, Payment — never
single-word riddles such as "Who", "What", or "When". The outcome is written in
plain words: `Paid in full`, `Payment pending`, `Booked`, or `Estimate`. Internal
status names never appear in the form. The running total and **Save sale** stay
pinned to the bottom of the mobile sheet.

Rules:

- The item search filters as the merchant types. An empty result offers
  `Add new item` with the typed name prefilled.
- The customer search filters by name or phone. A typed phone that matches an
  existing customer offers to use that customer instead of creating a duplicate.
- Adding a customer or item inline saves it to the shop and selects it in the
  sale, so the merchant never loses the cart.
- The sheet shows a live total, paid, due, and the plain-language outcome.
- One overlay at a time. Opening `Add new item` or `Add new customer` replaces
  the sale sheet and returns to it with the new record selected.

Resulting status:

| When | Payment | Status |
|---|---|---|
| Now | Full | `completed` |
| Now | Partial or none | `ready` |
| Later | Any | `accepted` |
| Later, marked as an estimate | Any | `waiting_client` |

`Add sale` is also the way to record a payment against an existing order: pick
the order, then `Log payment`. That path is the same payment form the **Collect**
button opens.

### Requests sheet

One step, no drill-down. The sheet lists every pending storefront request as a
card: buyer, needed date and time, each item with quantity and price, any note,
the total, and one **Accept request** button. Reading the card is the review.
There is no detail screen, no `Review order` button, and no Back button inside
the sheet. Accepting closes the sheet and refreshes Home.

On mobile the sheet rises from the bottom and has a **Close** button above the
safe area. On desktop it is a 440 px side panel with a close button in the
header. An error appears on the affected card, not at the top of the sheet.

### Order sheet

The order sheet opens with the next action already visible: **Accept request**,
**Mark ready**, or **Collect payment**. Fields use plain labels — Total, Due,
Placed. The status pill is context, not the instruction. Secondary actions
(Send bill, Reopen, Cancel order) sit below the primary action. Cancelling asks
`Cancel this order?` with `Yes, cancel` and `Keep it`.

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

### Share storefront

A signed-in owner taps the share button in the header to open the **Share
storefront** sheet. It is the permanent, always-available way to grab the store
link without leaving Home.

```
┌────────────────────────────────────┐
│  Share storefront                  │
│                                    │
│  startlite.in/b/anitas-bakes       │
│  [ Copy link ]                     │
│                                    │
│  [ Share on WhatsApp ]             │
│  [ Close ]                         │
└────────────────────────────────────┘
```

- **Copy link** copies the absolute store URL and shows `Copied`.
- **Share on WhatsApp** opens `wa.me` with a prefilled message and the link.
- The sheet is owner-only. A guest has no public storefront, so the button is
  hidden.
- The link is the same one Settings shows, so there is one source of truth.

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
| Pending orders | `orders` | `under_review`, `waiting_client`, `accepted`, `in_progress`, or `ready` with positive balance; all dates; count and sum before limiting visible rows to 10 |
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
| Tap an order row or **Accept** | Order opens in the order sheet |
| Tap **Mark ready** | Order-details overlay opens with the ready action |
| Tap **Reopen**, order ready | Order moves back to `accepted` |
| Tap **Cancel order** | Confirm, then the order closes as `cancelled` |
| Tap **Send bill** | Opens the bill page for that order |
| Tap a ghost card or Review in the request bar | Requests sheet |
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
| Tap the share button, owner | Share storefront sheet |
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

## Interaction contract

Every button and sheet on Home follows the same rules, so a merchant never has
to learn a new pattern halfway through a task.

- **One overlay at a time.** Tab navigation is navigation; everything else is
  a sheet. Opening another action replaces the current sheet.
- **One close affordance.** Each sheet has a 44 px labelled `X` button in its
  header (`SheetClose`). A long form may also end with a Close or Cancel button,
  but there is never a text glyph such as `×` or `✕`.
- **One sheet shape.** Bottom sheet on mobile with rounded top corners and
  safe-area padding; centred dialog from 640 px; right-side panel only for
  Requests on desktop. All use `surface`, `line`, the same radius and `e2`.
- **One action vocabulary.** `Add sale`, `Accept request`, `Mark ready`,
  `Collect payment`, `Save sale`. No sheet invents a synonym for an action that
  already exists elsewhere.
- **One alignment grid.** The header shares the content gutter (16 px mobile,
  32 px desktop). Labels sit left, figures are right-aligned and tabular. Each
  order is its own bordered card with a 3 px status rail, an order code, and an
  8 px gap to the next card. Needed-by and Items lead the card; customer, code,
  placed date, and money share one baseline on the last line.
- **Escapable.** Escape and the close button both dismiss the active sheet.
  Keyboard shortcuts (`N`, `T`, `1`–`6`) are ignored while a control has focus.
- **Scroll ownership.** Mobile scrolls the page. Desktop cards scroll inside
  themselves with `overscroll-contain`; no inner region hijacks page scroll.
- **Feedback.** A write shows one toast above the tab bar. Errors appear next
  to the field or card that caused them, never only at the top of a sheet.

## States

| State | What shows |
|---|---|
| First run, no data | Launch sheet, then zeros, `Add sale` primary, empty day |
| Loading | Skeleton below, no spinner |
| Empty day | `Nothing for this day.` plus `Add sale` |
| No requests | Request bar hidden |
| No dues | `No dues.` |
| No pending orders | `No pending orders.` plus `Add sale` |
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
| Header action, share | `Share storefront` |
| Share sheet title | `Share storefront` |
| Share sheet copy | `Copy link` / `Copied` |
| Share sheet WhatsApp | `Share on WhatsApp` |
| Edit name title | `Shop name` |
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
| Queue actions | `Accept`, `Mark ready`, `Collect`, `Order details` |
| Requests sheet | `Requests`, `Accept request`, `Close requests`, `Close` |
| Order sheet actions | `Accept request`, `Mark ready`, `Collect payment`, `Send bill`, `Reopen`, `Cancel order` |
| Cancel confirm | `Cancel this order?`, `Yes, cancel`, `Keep it` |
| Add sale sections | `Customer`, `Items`, `Schedule`, `Payment` |
| Add sale outcome | `Paid in full`, `Payment pending`, `Booked`, `Estimate` |
| Queue contact actions | `WhatsApp`, `SMS`, `Call` (when customer phone exists) |
| Queue badge | `Overdue` (when needed date has passed) |
| Queue edit action | `Edit` (opens edit sheet for customer, dates, items, discount) |
| Logo action | `Shop logo` |
| Logo upload actions | `Upload logo`, `Change logo`, `Remove logo` |
| Customers empty | `No dues.` |
| Guest toast | `Saved on this phone. Sign in to keep it safe.` |
| Launch title | `Your shop` |
| Launch body | `Sign in, or start fresh on this phone.` |
| Launch buttons | `Sign in`, `Start fresh` |
| Launch footnote | `Sign in any time from Settings.` |
| Save sheet title | `Save your shop` |
| Save sheet body | `This shop is only on this phone. Sign in to keep it.` |
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

4. ~~The idea is home screen is the primary action page of the app.~~ Done —
   audited every action; the order actions (cancel, reopen, send bill) now live
   in the Home order-details overlay. The audit table is in the zones section.
   Rare setup and management steps stay on their tabs.


5. ~~improve the modals. Like add sale should have by default searchable items
   to add, if item not present ability to add item (similar to add item modal),
   chose from customer or add customer (similar to add customer). This should be
   the most comprehensive modal.~~
   Done — Add sale is now a comprehensive sheet with searchable items and
   customers, inline add-new for both, Now/Later with date and time, and
   Full/Partial/Due-later payment with mode.

6. ~~There should be a way to edit orders by the merchant.~~ Done — edit sheet
   added to Home with customer details, needed-by date/time, items
   (add/remove/edit), discount, and notes. PATCH API extended to support all
   fields. Keyboard shortcuts (T = today, N = add sale, 1-6 = tabs, Escape =
   close overlay) added for desktop.

7. ~~Statuses -> Under Review, Waiting for Client Confirm, Accepted, Declined,
   Pending Payment, Completed, give me more suggestions, for each business type
   and how can we make these generic.~~
   Done — see [ADR-037](../decisions.md#adr-037-generic-order-status-funnel).
   The generic funnel is `under_review`, `waiting_client`, `accepted`,
   `in_progress`, `ready`, `completed`, `declined`, `cancelled`. It names the
   state of the work, not the trade, so every pack maps onto it. 

8. ~~Day view should show all orders of the day irrespective of the status.~~
   Done — day view is now a scrollable commitment list showing all orders for
   the selected day. Mobile caps at 5 visible items; desktop uses a fixed
   height with internal scroll. 

9. ~~Way to update logo for the merchant in signed in state, round or rectangle
   logo, need discussion.~~ Done — the logo is round everywhere: Home header,
   the Shop logo sheet preview, and the Settings preview. The uploaded image is
   cropped to a circle; the initial fallback uses the same shape.

10. ~~A permanent way that remains on the screen always, either in menu or
    similar to review notification, a way to quickly share the storefront.~~
    Done — share button in the header (owner only) opens a Share storefront
    sheet with copy link and WhatsApp share.

11. ~~Pending order cards need a clear default priority.~~ Done — the queue
    ranks overdue, today, upcoming, then undated, with scheduled commitments
    before "Any time" inside a band. See [Purpose](#purpose).

12. ~~The day calendar view should have all orders of today.~~ Done — the day
    view uses its own unbounded query for the selected day and includes every
    status. The five-row limit is a viewport cap only.

13. ~~Review UX looks too complicated.~~ Done — the Requests sheet shows each
    request in full with one **Accept request** action. No detail step, no Back,
    no "Review order" button.

14. ~~Mobile view and labels need refinement.~~ Done — plain white canvas,
    semantic colour, bottom sheets with safe-area padding and visible primary
    actions, 44 px hit areas, and plain labels such as Customer, Items,
    Schedule, Due, and Booked.
