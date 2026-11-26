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
- How many orders each buyer has.

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
│ Customers  18 people · All │
├────────────────────────────┤
│ ┌──────────┬──────────┐    │
│ │Customers │With dues │    │
│ │18        │7         │    │
│ ├──────────┼──────────┤    │
│ │Pending   │          │    │
│ │₹14,200   │          │    │
│ └──────────┴──────────┘    │
├────────────────────────────┤
│ Search name or phone       │
│ All | With dues            │
├────────────────────────────┤
│ Customers: Total 18        │
│ ─────────────────────────  │
│ Sana · Regular             │
│ 98765 43210 · 4 orders     │
│ Billed ₹5,600 Last 21-Nov  │
│              Pending ₹2,400│
└────────────────────────────┘
```

```text
1200 px
rail │ main column                                │ right column
     │ Customers  18 people · All                 │ empty
     │ ┌─────────┬──────────┬─────────┐            │
     │ │Customers│ With dues│ Pending │            │
     │ └─────────┴──────────┴─────────┘            │
     │ [Search name or phone] [With dues]          │
     │ Customers: Total 18       Sort: Pending     │
     │ CUSTOMER PHONE ORDERS BILLED LAST PAID PEND │
     │ row · row · row · row                       │
```

| Zone | Below 768 px | 768 to 1023 px | 1024 px and above |
|---|---|---|---|
| Navigation | Bottom tabs | Bottom tabs | Collapsible rail |
| Page header | 72 px | 72 px | 80 px |
| Summary strip | Two by two grid, third tile spans two columns | Three in a row | Three in a row |
| Filters | Wrapped rows | One row | One row |
| List card | Page flow | Page flow | Page flow, full main width |

## Zones

### Page header

The title is **Customers**. The subtitle states the count and the period, for
example `18 people · All`. There is no filled action button on the page. New
customer records start from a sale or from a previous due in customer detail.
Hidden: the page header keeps the title but drops the count while loading.

### Summary strip

Three tiles in this order: `Customers`, `With dues`, `Pending`. Each tile uses
the shared metric anatomy from
[report list anatomy](README.md#report-list-anatomy). The period is always
`All`. `Pending` is the sum of unpaid amounts across all buyers with a positive
balance. Empty: all three tiles show zero. Hidden: the strip is hidden for a
session-expired owner.

### Filters

The search field accepts a name or phone digits. The `With dues` pill shows only
buyers with a positive pending amount. The default filter is `All`. There is no
period filter because customer records have no period. Empty: the filter bar is
hidden when the shop has no customers. Hidden: the `With dues` pill is hidden
when no buyer has dues.

### Customer list

The card header follows the
[report list anatomy](README.md#report-list-anatomy). It shows `Customers:`,
`Total {count}`, and the collapse chevron. It has no total amount. `Pending`
lives in the summary strip. Sort keys are `Pending`, `Name`, and `Recently
added`. `Pending` is the default. Sort ties break on name. The list has no row
cap. Empty: `No customers yet.` and Add sale. Hidden: the list card is hidden
while loading.

### Customer row

On desktop the list has aligned columns with eyebrow headings: `Customer`,
`Phone`, `Orders`, `Billed`, `Last paid`, and `Pending`. A row uses one grid and
one `figure` column for each amount. On mobile the same cells stack in one
column.

| Cell | Content |
|---|---|
| Customer | Name, or the phone when no name exists. Sub-label on a second line when one exists |
| Phone | Phone digits, or `No phone` |
| Orders | `{n} orders` |
| Billed | Sum of open order totals, `figure` utility |
| Last paid | Date from `last_paid_at`, or `—` |
| Pending | Pending amount, `figure` utility. Caption `Pending` or `No dues` on mobile |

A row with no pending amount stays in the list under `All`. It is hidden under
`With dues`. Names and phone digits never wrap to a third line.

### Customer detail

`/customers/{id}` opens one customer record. It answers who the buyer is and
what they owe. The page has four metric tiles: `Orders`, `Billed`, `Paid`, and
`Pending`. `Billed` and `Paid` cover open orders only. Closed orders stay out of
both totals.

Contact actions are `Call`, `SMS`, and `WhatsApp`. A reminder message includes
the pending amount when one exists. The details card shows phone, label, last
paid, customer since, and notes from
[customers](../data-model.md#customers). The orders card lists every order for
that buyer with order code, needed-by date, placed-on date, status, total, and
due. Add previous due stays below the orders. Empty: the orders card says `No
orders yet.` Hidden: contact actions are hidden when the customer has no phone.

## Guest and owner

| Element | Guest | Owner |
|---|---|---|
| Data source | `localStorage` `startlite_guest_v2` | Postgres through RLS |
| State pill | `Not saved` | `Saved` or `Offline` |
| Request bar | Hidden | Shown when requests wait |
| Customer identity | Key from phone, then customer id, then name | Customer id with phone as the lookup |
| Detail actions | Add sale, remove not available | Add sale, Add previous due, call, WhatsApp |

Owner and guest both merge records with buyers found in orders. A buyer who
gives no phone stays a separate record. See
[ADR-033](../decisions.md#adr-033-customer-identity-is-an-id-phone-is-the-lookup).

## Data

The owner adapter is `getCustomersReport(businessId, filters)` in
[queries.ts](../../lib/queries.ts). The guest adapter is
`guestCustomersReport(state, filters)` in
[guest-store.ts](../../lib/guest-store.ts). Both return
`CustomersReportData`. The shared shapes live in `lib/report-types.ts`, which
implementation adds. The page component never reads a database or local storage
directly.

| Value | Source |
|---|---|
| Row | [customers](../data-model.md#customers) merged with order totals |
| Pending | `pendingByCustomer` from open orders with a positive balance |
| Order count, billed, paid, pending | Open orders with a positive balance. Closed orders are excluded |
| Last paid | `last_paid_at` on the customer record, written by a payment |
| Label, notes, customer since | `sub_label`, `notes`, and `created_at` on the customer record |
| Search index | Customer lookup `(business_id, phone)` in [data-model.md](../data-model.md#indexes) |

Guest totals use integer paise through [paise.ts](../../lib/paise.ts). The guest
adapter applies the same pending rule as the owner adapter.

## Interactions

| Action | Result |
|---|---|
| Tap a row | Opens `/customers/{id}` with filters kept in the URL |
| Type in search | Updates the URL and filters the list |
| Tap a pill | Sets the filter and updates the URL |
| Tap sort | Opens a small menu. One tap sets the sort and closes the menu |
| Tap the chevron | Collapses or expands the list. State is local to the page |
| Back | Returns to the previous view with filters kept |
| Swipe | No swipe gesture on this page |

## States

| State | What appears |
|---|---|
| First run | Empty state with Add sale |
| Loading | Skeleton with the final header, three tiles, filter bar, and five row heights |
| Empty filter | `No customers for this filter.` and Clear filters |
| Offline owner | Last loaded rows and the `Offline` pill |
| Offline guest | All rows work. Pill stays `Not saved` |
| Load error | `Could not load customers.` and Try again |
| Session expired | Sign-in state. No guest rows |

## Copy

| Element | Text |
|---|---|
| Page title | `Customers` |
| Subtitle | `{n} people · All` |
| Metric tiles | `Customers`, `With dues`, `Pending` |
| Search placeholder | `Search name or phone` |
| Filter pills | `All`, `With dues` |
| Sort options | `Pending`, `Name`, `Recently added` |
| Column labels | `Customer`, `Phone`, `Orders`, `Billed`, `Last paid`, `Pending` |
| Row labels | `No phone`, `—`, `{n} orders` |
| Amount captions | `Pending`, `No dues` |
| Detail labels | `Customer details`, `Phone`, `Label`, `Last paid`, `Customer since`, `Note:`, `Orders`, `No orders yet.` |
| Detail actions | `Call`, `SMS`, `WhatsApp`, `Add previous due` |
| Empty list | `No customers yet.` and `Add sale` |
| Empty filter | `No customers for this filter.` and `Clear filters` |
| Error | `Could not load customers.` and `Try again` |

## Accessibility and performance

- Each row is one link with an accessible name that includes the customer name,
  phone, and pending amount.
- Contact actions in detail use the shared 44 px target and an accessible name.
- Amounts use tabular numerals and never animate.
- Search input has a visible label. The placeholder is not the label.
- Filter pills use `aria-pressed`. The sort menu uses `aria-expanded`.
- Tap targets are at least 44 px with 8 px gaps.
- The list has no cap. The adapter sorts and filters before render.
- Loading uses final heights. Data replaces the skeleton in place.

## Out of scope

- Charts and account statements.
- Inline editing of a customer record.
- A phone number as the primary key shown on screen.
- A period filter. Customer records have no period.
- Sending a bulk WhatsApp message from the list.
- A country code field. The customer table has no `country_code` column yet. See
  [ADR-033](../decisions.md#adr-033-customer-identity-is-an-id-phone-is-the-lookup).
