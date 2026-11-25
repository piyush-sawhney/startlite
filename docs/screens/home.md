# Home

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md). Visual rules live in [design-system.md](../design-system.md).

Home is the merchant dashboard at `/`. It is the same screen for a guest and an
owner. The data source and a few signals differ. Logo upload is owner only.

The screen has four lists and two control groups. The lists appear in this order:

1. Pending orders
2. Completed · payment due
3. Customer dues
4. Day view

The control groups are a review bar and four add buttons. The screen has no money
summary cards.

## Purpose

A merchant opens Home to do daily work. The screen answers three questions:

- What work is unfinished.
- What money is waiting.
- What is happening today.

The order lists cover all dates. They do not change when the calendar day changes.
The day view covers one selected day.

An order enters one of the two order lists based on its work state and its balance.

| Work state | Balance | List |
|---|---|---|
| `under_review`, `waiting_client`, `accepted`, `in_progress` | Any | Pending orders |
| `ready`, `completed` | Above zero | Completed · payment due |

A fully paid accepted order stays in Pending orders until the merchant marks the
work done. A completed order with no balance appears in neither list.

## Arrival and exit

| From | Result |
|---|---|
| App icon, bookmark, or `/` | Opens Home |
| Any tab | Tap Home to return and keep the selected day |
| Sign in, onboarding, import | Lands here after success |
| Notification or WhatsApp link | Opens the order sheet. Back returns here |

Home has no back button. A tab tap, an order card, a quick action, or the review
bar leads out of the zone.

## Who sees it

| Visitor | What appears |
|---|---|
| New venture, signed out | Launch sheet, then an empty Home on this phone |
| Returning guest | Local data. Pill says `Not saved` |
| Owner on a new device | Launch sheet, then sign in to load the shop |
| Owner, signed in | Server data. Pill says `Saved` |
| Owner, session expired | Sign-in state. No silent guest fallback |
| Owner, pass expired | Home works. A banner says the storefront is paused |

## Layout

The page uses one column below 1024 px. From 1024 px a left rail holds navigation
and a right column holds the day view. The two order lists scroll inside their
cards from 1024 px. Mobile scrolls the page.

| Zone | Below 768 px | 768 to 1023 px | 1024 px and above |
|---|---|---|---|
| Navigation | Bottom tabs | Left rail, 200 px | Left rail, 240 px |
| Header | 52 px | 56 px | 56 px |
| Review bar | Bar under header | Bar under header | Toolbar above day view |
| Quick actions | Two by two grid | One row of four | One row of four |
| Order lists | Page flow, collapsible | Page flow, collapsible | Independent scrolls |
| Day view | Page flow | Page flow | Sticky right column |
| Customer dues | Page flow, collapsible | Page flow, collapsible | Page flow, collapsible |

Each list has one collapsible header. The header carries the title, count, total
due, and a chevron. No list has a second-level header.

## Header

- The shop logo is round. It falls back to the first letter of the shop name on
  `accent-soft`. An owner can tap it to change the logo.
- The shop name is one line. It truncates with an ellipsis. A pen button opens
  **Shop name**. The accessible name is `Edit shop name`.
- The handle appears from 768 px.
- The state pill sits on the right. An owner sees `Saved`. A guest sees
  `Not saved`. An offline owner sees `Offline`. An expired session sees `Sign in`.
- A power button appears for a guest and an expired session. It opens the save
  sheet. An owner sees a share button instead.
- The header stays visible on scroll. It has no search field and no gear.

## Review bar

The bar appears only when storefront requests wait. It states the count, the age
of the oldest request, and a **Review** action. The bolt is an SVG icon.

Mobile shows the bar under the header. Desktop shows one toolbar above the day
view. No other desktop request banner appears.

The bar opens the Requests sheet. A guest never sees the bar.

## Quick actions

Four buttons open the entry sheets. Add sale is the only filled button.

| Button | Sheet | Icon hue |
|---|---|---|
| Add sale | Full screen on mobile, dialog on desktop | Brand teal |
| Add customer | Bottom sheet on mobile, dialog on desktop | Blue |
| Add item | Bottom sheet on mobile, dialog on desktop | Teal |
| Add expense | Bottom sheet on mobile, dialog on desktop | Red |

All four buttons are at least 48 px tall on mobile. Escape and the close button
return to the unchanged Home.

## Order lists

The two order lists use the same component and the same card anatomy. Each list
has one collapsible header. A sort control offers Priority, Needed date, Newest,
and Amount due. Priority is the default.

Priority order:

1. Needed date already passed.
2. Needed today.
3. Upcoming dates, earliest first.
4. Undated orders.

Inside one band, a timed order comes before an `Any time` order. The earliest
slot wins next. The oldest placed order wins last. The sort uses the real date,
not the selected calendar day.

Each list shows at most ten orders. The list header shows the total count and
the sum of unpaid balances.

### Order card

Each order is a bounded card with a border and a gap to the next card. Five rows
hold the information. One row holds the actions.

| Row | Left | Right |
|---|---|---|
| 1 | Customer name and order code | Order status chip and payment status chip |
| 2 | `Note: "message from client"` | `Needed by` absolute date and slot |
| 3 | Items summary and total item count | `Placed on` absolute date and time |
| 4 | `Paid:` amount and `Due:` amount | `Total:` amount |
| 5 | WhatsApp, SMS, Call, Edit order, next action | None |

The needed-by date has a time hue. A past date is red. Today is amber. A later
date is black. No overdue badge appears.

Card text is black. Colour is reserved for payment amounts, status chips, and
the needed-by date. Paid is green and due is amber.

Status chips share one size. They use a soft tint of the status hue with
complementary text. They never look like buttons.

Item names use `orderSummary`. The card shows three names, then `+N more`.

Row actions use one shape. On desktop each action shows an icon and a label. On
mobile the label is hidden and the icon keeps an `aria-label`. Targets are at
least 44 px. The next action follows the work state.

| Status | Action |
|---|---|
| `under_review`, `waiting_client` | Accept |
| `accepted`, `in_progress` | Mark done |
| `ready`, `completed` with a balance | Collect |

Tapping the card opens the order sheet. The row action opens the same sheet with
that action ready.

## Day view

The day view is a commitment list. It is not an availability grid.

The date row has a label and controls. Chevrons change the day. A calendar button
opens a date picker. `Go to today` appears when another day is selected. The
swipe has the same result as the chevrons. The `T` key returns to today.

Row labels use sentence case. The day view does not use `Today` or `Tomorrow` on
order cards. Those words appear only in the date row.

Rows are minimal. One line shows the slot, customer, items, amount, a note
indicator, and status. A teal rail marks an order. An amber rail marks a
storefront request. Tapping a request opens the Requests sheet.

The day view reads its own query. It has no cap and no status filter. Cancelled,
declined, and completed orders stay in the day history. `Any time` covers a
missing slot, an empty slot, or the literal `Any time` or `None`.

An empty day shows `Nothing for this day.` and an `Add sale` action. When today
is empty, the view also points to the nearest day with an order.

## Customer dues

This list shows the five customers with the highest pending amounts. It has one
collapsible header with a count. A row shows the name, pending amount, and last
payment date. Rows with a phone number show WhatsApp, SMS, and Call shortcuts.
Targets are at least 44 px.

Tapping a customer row opens the payment sheet with that customer's unpaid order.
The Customers tab remains the place for full customer management. An empty list
shows `No dues.`

## Footer

`StartLite · v1` sits at the end of the page on mobile and at the end of the rail
on desktop.

## Sheets

All sheets follow one contract.

- One sheet is open at a time. A new action replaces the current sheet.
- Each sheet has a labelled 44 px close button. No text glyph acts as a close
  button.
- Mobile uses a bottom sheet with safe-area padding. Desktop uses a centred
  dialog. Requests uses a side panel.
- Escape closes the active sheet. A nested add sheet owns Escape so it does not
  close the sale form and lose the cart.
- Errors appear next to the field or card that caused them.

### Add sale

One sheet handles a counter sale and a booked order. Tabs are New sale and Record
payment.

| Section | Content |
|---|---|
| Customer | Search by name or phone. Add a new customer inline. |
| Items | Search by name. Numbered cart lines show Item, Qty, Rate, Amount. Primary variants use a select. Other option groups and scoped extras use labelled add-on chips. Add a new item inline. Quick amount records one lump sum. |
| Schedule | Now or Later. Later takes a date, a slot, and an estimate flag. |
| Payment | Full, Partial, or Due later. Modes are Cash, UPI, Card, Bank, Other. |

The sheet shows a live total, paid amount, due amount, and a plain outcome.
Outcomes are `Paid in full`, `Payment pending`, `Booked`, and `Estimate`. The
total and Save sale stay pinned at the bottom of the mobile sheet.

| When | Payment | Saved status |
|---|---|---|
| Now | Full | `completed` |
| Now | Partial or none | `ready` |
| Later | Any | `accepted` |
| Later and estimate | Any | `waiting_client` |

### Requests sheet

The sheet lists every pending request. Each row shows the buyer, needed date,
item lines with quantity and amount, the note, and the total. Tapping a row opens
the order sheet. The **Accept request** action lives there. The sheet has no
second action vocabulary.

### Order sheet

The sheet opens with the next action visible. Fields are labelled Placed, Needed
by, Total, Due, Items, and Buyer's note.

Items use a table with the columns `#`, `Item`, `Qty`, `Rate`, `Amount`. Under
each item, the sheet shows the variant with its price, add-ons with their `+₹`
deltas, and the line note.

Contact shortcuts and Edit sit above the primary action. Send bill, Reopen, and
Cancel order sit below it. Cancelling asks `Cancel this order?` with `Yes,
cancel` and `Keep it`.

A storefront request opens the same sheet. Accept request acts on the pending
request code. Bill, reopen, and cancel actions do not appear for a request.

### Edit order sheet

The sheet loads the order lines from the API. Each line is a row with visible
labels for Item, Qty, Rate, and Unit. A variant select and add-on chips change
the rate. The saved payload carries the catalog item id, option, extras, and
line amounts. The PATCH endpoint stores these values on the order line.

### Add customer

| Field | Required | Default |
|---|---|---|
| Name | yes | None |
| Country code | yes | `+91` India |
| WhatsApp number | no | 10 digits for `+91` |
| Label | no | `regular`, `Sector 4` |
| Store address | toggle | Off |
| Address lines 1 to 3 | when the toggle is on | None |
| City, state, country, pincode | no | India for country |

The label is free text. It helps the merchant recognise the person later.

### Add item

| Field | Required | Notes |
|---|---|---|
| Name | yes | — |
| Category | no | Picker and New category |
| Description | no | Two lines |
| Photo | no | Camera or gallery |
| Unit | no | Default `item` |
| Base price | yes unless every variant has a price | — |
| Variant | no | Repeatable name and price |
| Sub-variant | no | Repeatable inside a variant |
| Availability slot | no | Toggle, start time, end time, days |

The sheet has sections for Basics, Pricing, and Availability. Each repeatable row
has its own remove control.

### Add expense

| Field | Required | Default |
|---|---|---|
| Paid to | yes | None |
| Paid for | yes | None |
| Amount | yes | None |
| Date | no | Today as `23-Nov-2026` |

`Paid to` names the person or shop. `Paid for` names the purchase. Four fields
fit on one screen.

### Other sheets

- Shop name changes the business name.
- Shop logo uploads, replaces, or removes the logo.
- Save your shop offers sign in, create account, or keep using this phone.
- Share storefront copies the store link or opens WhatsApp.
- Launch sheet appears once on a new device.

## Guest and owner

The layout is the same. These signals differ.

| Element | Guest | Owner |
|---|---|---|
| State pill | `Not saved` | `Saved` |
| Review bar | Hidden | Shown when requests wait |
| Storefront request rows | None | Shown in the day view |
| Data source | `localStorage` `startlite_guest_v2` | Postgres through RLS |

After the first guest write, one toast appears for five seconds. It says `Saved
on this phone. Sign in to keep it safe.` It is never a modal.

## Data

| Zone | Source | Shape |
|---|---|---|
| Pending orders | `orders` | Open work states, all dates, count and sum before the ten row limit |
| Completed with due | `orders` | `ready` or `completed`, positive balance |
| Day view | `orders`, `pending_orders` | All statuses for the selected day, no cap |
| Customer dues | `customers`, `orders` | Positive pending, highest first, limit five |
| Review bar | `pending_orders` | Count and oldest creation time |

The guest adapter computes the same shapes from local arrays. Labels and order
match the owner adapter.

## Interactions

| Action | Result |
|---|---|
| Tap an order card | Opens the order sheet |
| Tap a row action | Opens the order sheet with that action ready |
| Tap WhatsApp, SMS, or Call | Opens the external app link |
| Tap Edit | Opens the edit sheet |
| Tap a customer due | Opens the payment sheet with the unpaid order prefilled |
| Tap Review in the bar | Opens the Requests sheet |
| Tap a request | Opens the order sheet for that request |
| Tap `Go to today` | Selects today |
| Tap a chevron | Selects the previous or next day |
| Tap the calendar button | Opens the date picker |
| Swipe the day view | Selects the previous or next day |
| Pull to refresh, owner | Refetches the screen |
| Pull to refresh, guest | No action and no spinner |

Desktop keys:

- `T` selects today.
- `N` opens Add sale.
- `1` to `6` switch tabs.
- Escape closes the active sheet.

Tab changes are navigation. All other interactions open or close a sheet.

## States

| State | What appears |
|---|---|
| First run | Launch sheet, then empty lists and four add buttons |
| Loading | Skeleton with final heights. No spinner |
| Empty order list | `No orders.` inside the collapsed list area |
| Empty day | `Nothing for this day.` and `Add sale` |
| No requests | Review bar hidden |
| No dues | `No dues.` |
| Offline owner | `Offline` pill. Writes show a connection message |
| Offline guest | Everything works. Pill stays `Not saved` |
| Session expired | Sign-in state |
| Pass expired | Banner with the paused storefront message |
| Load error | `Could not load Home.` and `Try again` |

The skeleton uses final heights. Data replaces it in place.

## Copy

| Element | Text |
|---|---|
| State pill | `Saved`, `Not saved`, `Offline`, `Sign in` |
| Header actions | `Edit shop name`, `Share storefront`, `Sign in to save this shop` |
| Review bar | `{n} requests · oldest {age}` and `Review` |
| Quick actions | `Add sale`, `Add customer`, `Add item`, `Add expense` |
| Order list titles | `Pending orders`, `Completed · payment due`, `Customer dues` |
| Order card labels | `Note:`, `Needed by:`, `Placed on:`, `Paid:`, `Due:`, `Total:` |
| Order actions | `Accept`, `Mark done`, `Collect`, `Edit order` |
| Day labels | `Today`, `Yesterday`, `Tomorrow`, or `Sat, 21-Nov-2026` |
| Day action | `Go to today` |
| Empty day | `Nothing for this day.` |
| Day group | `Any time` |
| Sheet actions | `Accept request`, `Mark ready`, `Collect payment`, `Save sale` |
| Cancel confirm | `Cancel this order?`, `Yes, cancel`, `Keep it` |
| Launch | `Your shop`, `Sign in, or start fresh on this phone.` |
| Guest toast | `Saved on this phone. Sign in to keep it safe.` |

## Accessibility and performance

- Every swipe has a button alternative.
- Each list header is a button with `aria-expanded`.
- Each order card has one labelled open action. Row actions are separate buttons.
- Status chips pair a word with a colour.
- Amounts use tabular numerals and never animate.
- Every sheet has a labelled close button. Focus returns to the opener.
- Tap targets are at least 44 px with 8 px gaps.
- Mobile uses page scrolling. Desktop inner lists use `overscroll-contain`.
- The day view animates only `transform`.

## Out of scope

- Money summary cards and profit figures.
- Charts, trends, and sparklines.
- Drag to reschedule. The edit sheet changes time.
- Inline order editing on the card.
- A month grid on mobile.
- A logged-out landing page.
