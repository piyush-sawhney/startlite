# Customers

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md). Visual rules live in [design-system.md](../design-system.md).

Customers is the full customer report at `/customers`. It answers one question:
who owes money, and how much. Home shows the five highest dues. Customers shows
every customer record.

The page is a list report. It uses the
[report list anatomy](README.md#report-list-anatomy) shared by all three report
pages.

## Purpose

A merchant opens Customers to find a buyer, see the pending amount, and start a
follow-up. The page answers:

- Who has a pending amount.
- When each buyer last paid.
- How many orders each buyer has, including completed and cancelled ones.
- How much has been billed and collected in total.

## Arrival and exit

| From | Result |
|---|---|
| Rail or bottom tab | Opens Customers with the saved filters |
| Home, Customer dues → View all dues | Opens `/customers` |
| Home, a due row | Opens the payment sheet in Home, not this page |
| Customer row | Opens `/customers/{id}` |
| Customer detail, Add sale | Opens `/orders/new` for that buyer |
| Customer detail | Back returns to Customers with filters kept in the URL |

The filters live in the URL so a report can be refreshed or shared.

## Who sees it

| Visitor | What appears |
|---|---|
| Owner, signed in | Server data. Pill says `Saved` |
| Owner, offline | Last loaded rows. Pill says `Offline` |
| Owner, session expired | Sign-in state. No guest fallback |
| Guest on this phone | Local customer records and buyers found in orders. Pill says `Not saved` |
| New venture | Empty state with Add sale |

## Layout

The page uses one column below 1024 px. From 1024 px the collapsible rail
replaces the bottom tabs. The 360 px right column stays empty on report pages.

```text
360 px
┌────────────────────────────┐
│ Customers        + Add      │
├────────────────────────────┤
│ ┌──────────┬──────────┐    │
│ │All       │With dues │    │
│ │18  •     │7   ₹14.2k│    │
│ ├──────────┼──────────┤    │
│ │Has paid  │Active    │    │
│ │12  ₹52k  │9   8 jobs│    │
│ └──────────┴──────────┘    │
├────────────────────────────┤
│ Search name or phone       │
├────────────────────────────┤
│ ─────────────────────────  │
│ ← sideways to see columns →│
│ NAME ▾ │ PHONE │ LANDMARK  │
│ [filter] [filter] [filter] │
│ Sana   │••••3210│Kothrud…  │
│ Regular│       │ 411038    │
│ ₹5,600 │ ₹4,900 │ ₹700 │ 4 │
└────────────────────────────┘
```

```text
1200 px
rail │ main column                                    │ right column
     │ Customers                        + Add customer │ empty
     │ ┌─────────┬──────────┬─────────┬─────────────┐ │
     │ │All      │ With dues│ Has paid│ Active orders│ │
     │ └─────────┴──────────┴─────────┴─────────────┘ │
     │ [Search name or phone]                         │
     │ NAME ▾ │ PHONE │ LANDMARK │ BILLED │ PAID …    │
     │ [filter] [filter] [filter]  │       │          │
     │ Sana          │••••3210│Kothrud│₹5,600│₹4,900… │
     │ Regular       │       │ 411038│ ₹700 │ 4      │
     │ Clear filters (only when a column filter is on)│
```

| Zone | Below 768 px | 768 to 1023 px | 1024 px and above |
|---|---|---|---|
| Navigation | Bottom tabs | Bottom tabs | Collapsible rail |
| Page header | 72 px | 72 px | 80 px |
| Filter cards | Two by two grid, tappable | Four in a row | Four in a row |
| Filters | Search only | One row | One row |
| List card | Page flow | Page flow | Page flow, full main width |

## Zones

### Page header

The title is **Customers** — the only place on the page that repeats the tab
name. There is no subtitle and no count line under it; the counts live in the
filter cards and the table. The one filled action is `Add customer`, which opens
the add-customer sheet. Hidden: the page header keeps the title while loading.

### Filter cards

Four cards replace the old metric strip. Each card shows a count and a short
detail line, and tapping it filters the list to that group:

| Card | Filters to | Detail line |
|---|---|---|
| `All` | Every buyer | `Everyone` |
| `With dues` | Positive balance on open orders | Pending amount |
| `Has paid` | At least one payment ever | Lifetime collected amount |
| `Active orders` | At least one non-closed order | Number of open orders |

The active card gets an accent border and a dot, and exposes `aria-current`.
Counts come from all buyers, never from the current filter. Empty: each card
shows zero. Hidden: the cards are hidden for a session-expired owner.

### Filters

The search field matches a name, label, mobile digits, or email address and
updates the list as you type (300 ms debounce). It keeps the query in the URL so
the view can be refreshed or shared. The cards are the only segment control; the
same choice is never shown twice. The default segment is `All`.
There is no separate sort menu: every table header sorts its own column. A filter
input sits under the Name, Phone, and Landmark headers only; amount and count
columns are sortable but never filterable. The default view sorts by Due with the
highest amount at the top. There is no period filter because records have no
period. Empty: the filter bar is hidden when the shop has no people.

### People table

The table card has no header strip: no segment label, count, total, or collapse
chevron. The active segment and count already sit in the page subtitle, and the
amounts sit in their columns. `Clear filters` appears above the table only while
a column filter is set. The table has no row cap. Empty: `Nothing here yet.` and
Add sale; `No matches.` and Clear filters when a filter excludes everything.
Hidden: the card is hidden while loading.

The list is one real table with seven short headers: `Name`, `Phone`,
`Landmark`, `Billed`, `Paid`, `Due`, `Orders`. Every header is a sort button.
Only the text columns have a filter input, with substring matching; numeric
columns are sort-only. The table scrolls sideways below 900 px, so headers stay
with their columns on a phone. The default sort is `Due` descending — the
highest amount due is on the first row. Text columns sort A to Z when clicked.
Sort ties break on name. Every header exposes `aria-sort`.

| Column | Cell content | Filter |
|---|---|---|
| Name | Name on the first line; stored `subLabel` on a second line. Falls back to the phone when no name exists | Text, matches both lines |
| Phone | Masked to the last four digits (e.g. `••••••3210`), or `No phone` | Text on masked digits |
| Landmark | Landmark and pincode from the stored address, or `—` | Text |
| Billed | Lifetime sum of order totals, `figure` utility | None |
| Paid | Lifetime sum of payments, `figure` utility | None |
| Due | Positive balance on open orders, `figure` utility; sorted high to low by default | None |
| Orders | Every order, including closed ones | None |

Raw phone digits are never sent to the list; search still matches them on the
server. A row with no pending amount stays in the table under `All`. It is hidden
under `With dues`. Names, labels, masked numbers, and the landmark line truncate
instead of wrapping. A linked row opens detail on tap; rows without a stored
record are not links.

### Detail and edit

`/customers/{id}` opens one record. It answers who the buyer is, what they owe,
and lets the merchant correct the record in place. The page is a compact
workspace, not a stack of cards: one header, one hairline stats strip, and two
columns from 1280 px with the editor on the left and orders in the 360 px column
on the right. Above 1280 px the right column is sticky; below it the sections
stack in the same order.

The four figures (`Orders`, `Billed`, `Paid`, `Due`) sit in one ruled strip with
eyebrow labels and a value line. Billed and paid cover every order; due covers
open orders only. The `Orders` figure carries the full status mix as a caption:
`done · ready · to finish · cancelled`, each count paired with its word and
colour. No extra tile or chart is needed.

The header shows the name only. Landmark and pincode stay in the address section,
and `Since` stays in the form footer. The header never repeats the mobile or
label. `Call`, `SMS`, and
`WhatsApp` are compact icon links in the header, not a separate button row, and
still use the full number; `Email` opens a `mailto:` link. Links appear only for
the contact details that exist.

The `Details` card is an editable form, not a read-only list. Its fields are
grouped into three meaningful sections with hairline dividers: `Contact`
(`Name` required, `Label`, `Mobile`, optional `Email`), `Address` (`Address 1`,
`Address 2`, `Landmark`, `City`, `State`, `Country`, `Pincode`), and `Note`. Each
section uses a 12-column grid on desktop with widths matched to typical values:
a short label or mobile stays narrow, while email and address lines get more
room. Every field wrapper has `min-w-0`, so nothing overflows. `line3` from
[customers](../data-model.md#customers) is retained in storage for older records
but has no input. `Last paid` and `Since` are read-only facts in the footer row
beside the buttons. The form opens with values filled in; `Save` and `Discard`
stay disabled until a value changes. A save shows `Saved`, revalidates the server
data, and refreshes the header and strip in place. An invalid email or a
duplicate mobile shows the error beside the form. Empty address values clear the
stored address. The guest detail shows phone and address in its own card, with
no edit form.

A compact `Top items` card sits above orders in the right column. It lists the
three items bought in the greatest quantity with the count beside each name.
Cancelled and declined orders are excluded. Empty: `No items yet.`

The orders column lists every order as one compact row: code and status on the
first line, needed date and amounts on the second, and the balance only when it
is positive. Add previous due stays under the editor. Empty: the orders column
says `No orders yet.`

## Guest and owner

| Element | Guest | Owner |
|---|---|---|
| Data source | `localStorage` `startlite_guest_v2` | Postgres through RLS |
| State pill | `Not saved` | `Saved` or `Offline` |
| Request bar | Hidden | Shown when requests wait |
| Customer identity | Key from phone, then customer id, then name | Customer id with phone as the lookup |
| Phone display | Masked to the last four digits in both list and detail | Masked to the last four digits in both list and detail |
| Detail actions | Add sale, remove not available | Add sale, Add previous due, call, WhatsApp |

Both visitors see the same counts and money rules. Guest statuses come from
`guestOrderTotals()`, which can promote a paid `ready` order to `completed`.

Owner and guest both merge records with buyers found in orders. A buyer who
gives no phone stays a separate record. See
[ADR-033](../decisions.md#adr-033-customer-identity-is-an-id-phone-is-the-lookup).

## Data

The owner adapter is `getCustomersReport(businessId, filters)` in
[queries.ts](../../lib/queries.ts). It returns `CustomersReportData` from
[report-types.ts](../../lib/report-types.ts) and renders through
`components/reports/CustomersReport.tsx`. Each row carries the rupee number
behind its formatted amount so the table can sort and filter by value, not by
label. Detail edits post to `PATCH /api/v1/merchant/customers/{id}`, which
re-checks ownership and phone uniqueness before writing. The guest list is built from
`guestCustomers(state)` in [guest-store.ts](../../lib/guest-store.ts) and renders
through `components/guest/GuestCustomers.tsx`. ADR-040 describes a shared report
page; the guest report adapter has not been built yet, so the two views share the
display rules and helpers rather than one component. Neither page reads storage
directly.

| Value | Source |
|---|---|
| Row | [customers](../data-model.md#customers) merged with order totals |
| Counts, billed, paid | `summarizeCustomerOrders()` over every order; declined counts as cancelled |
| Pending | Positive balance on open orders only. Closed orders are excluded |
| Masked phone | `maskPhoneLast4()` in [contact.ts](../../lib/contact.ts) |
| Landmark, pincode | `address` on the customer record, or guest `address` in local storage |
| Last paid | `last_paid_at` on the customer record, written by a payment |
| Label, notes, customer since | `sub_label`, `notes`, and `created_at` on the customer record |
| Search index | Customer lookup `(business_id, phone)` in [data-model.md](../data-model.md#indexes) |

Guest totals use integer paise through [paise.ts](../../lib/paise.ts) and the
same open-order dues rule. Guest order status comes from `guestOrderTotals()`,
which can promote a paid `ready` order to `completed`.

## Interactions

| Action | Result |
|---|---|
| Tap a linked row | Opens `/customers/{id}` with filters kept in the URL |
| Type in search | Updates the URL and filters the list |
| Tap a filter card | Sets the segment and updates the URL |
| Tap a column header | Sorts that column; a second tap reverses the direction |
| Type in a text-column filter | Keeps rows that match that column only |
| Tap the `×` in a filter | Clears that one column's filter |
| Tap `Clear filters` | Removes all column filters (and server filters from the empty state) |
| Edit detail fields, then `Save` | Writes the record and refreshes the header and summary |
| Tap `Discard` | Restores the last saved values |
| Back | Returns to the previous view with filters kept |
| Swipe | Scroll the table sideways for more columns, vertically for more rows |

## States

| State | What appears |
|---|---|
| First run | Empty state with Add sale |
| Loading | Skeleton with the final header, four card outlines, search bar, and five table rows |
| Empty filter | `No matches.` and Clear filters |
| Offline owner | Last loaded rows and the `Offline` pill |
| Offline guest | All rows work. Pill stays `Not saved` |
| Load error | `Could not load the table.` and Try again |
| Edit error | Field values stay put, `Save failed`, and the server message |
| Session expired | Sign-in state. No guest rows |

## Copy

| Element | Text |
|---|---|
| Page title | `Customers` |
| Page action | `Add customer` |
| Filter cards | `All`, `With dues`, `Has paid`, `Active orders` |
| Search placeholder | `Search name, label, mobile or email` |
| Column labels | `Name`, `Phone`, `Landmark`, `Billed`, `Paid`, `Due`, `Orders` |
| Filter placeholders | `Search name or label`, `Search phone`, `Search landmark` |
| Filter clear label | `Clear {column} filter` |
| Row labels | `No phone`, `—` |
| Table controls | `Clear filters` only while a column filter is set |
| Stats strip | `Orders`, `Billed`, `Paid`, `Due` |
| Orders mix | `done`, `ready`, `to finish`, `cancelled` counts |
| Detail table labels | `Order`, `Needed`, `Status`, `Paid`, `Due` |
| Detail labels | `Details`, `Contact`, `Name`, `Label`, `Mobile`, `Email (optional)`, `Address`, `Address 1`, `Address 2`, `Landmark`, `City`, `State`, `Country`, `Pincode`, `Note`, `Last paid`, `Since` |
| Detail contact links | `Call`, `SMS`, `WhatsApp`, `Email` |
| Right column | `Top items`, `No items yet.`, `{n} ordered`, `Orders`, `No orders yet.` |
| Detail form states | `Saved`, `Save failed`, `Unsaved changes`, `Save`, `Discard` |
| Detail actions | `Call`, `SMS`, `WhatsApp`, `Email`, `Add previous due` |
| Empty list | `Nothing here yet.` and `Add sale` |
| Empty filter | `No matches.` and `Clear filters` |
| Error | `Not saved. Try again.` and `That phone is already saved.` |

## Accessibility and performance

- Each linked row's name is one link with an accessible name that includes the
  name, masked phone, and balance due.
- Filter cards are links with `aria-current` on the active segment.
- Every sortable header sets `aria-sort`; text filters have a screen-reader label,
  a contextual placeholder, and a named clear button.
- Amount and count figures are right aligned in both header and cells, with
  tabular numerals; text columns stay left aligned.
- Header rows and the Name column stay visible while the table scrolls.
- Details inputs have visible labels; form errors announce with `aria-live`.
- Contact actions in detail use the shared 44 px target and an accessible name.
- Amounts never animate. The placeholder is never the only label.
- Tap targets are at least 44 px with 8 px gaps.
- The table has no cap. The adapter sorts and filters before render.
- Loading uses final heights. Data replaces the skeleton in place.

## Out of scope

- Charts and account statements.
- Bulk edit or import from this page.
- A phone number as the primary key shown on screen.
- A period filter. Customer records have no period.
- Sending a bulk WhatsApp message from the list.
- A country code field. The customer table has no `country_code` column yet. See
  [ADR-033](../decisions.md#adr-033-customer-identity-is-an-id-phone-is-the-lookup).
