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
│ Customers  18 people · All │
├────────────────────────────┤
│ ┌──────────┬──────────┐    │
│ │All cust. │With dues │    │
│ │18  •     │7   ₹14.2k│    │
│ ├──────────┼──────────┤    │
│ │Has paid  │Active    │    │
│ │12  ₹52k  │9   8 jobs│    │
│ └──────────┴──────────┘    │
├────────────────────────────┤
│ Search name or phone       │
├────────────────────────────┤
│ Customers: Total 18        │
│ ─────────────────────────  │
│ Sana · Regular             │
│ Kothrud · 411038           │
│ ••••••3210 · Paid on 21-Nov│
│ 4  ·  2 done · 1 cancelled │
│ ₹5,600  ₹4,900  ₹700 due   │
└────────────────────────────┘
```

```text
1200 px
rail │ main column                                │ right column
     │ Customers  18 people · All                 │ empty
     │ ┌─────────┬──────────┬─────────┬─────────┐ │
     │ │All      │ With dues│ Has paid│ Active  │ │
     │ └─────────┴──────────┴─────────┴─────────┘ │
     │ [Search name or phone]                     │
     │ Customers: Total 18       Sort: Pending     │
     │ NAME MOBILE ORDERS BILLED PAID DUE         │
     │ row · row · row · row                       │
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

The title is **Customers**. The subtitle states the count and the period, for
example `18 people · All`. There is no filled action button on the page. New
customer records start from a sale or from a previous due in customer detail.
Hidden: the page header keeps the title but drops the count while loading.

### Filter cards

Four cards replace the old metric strip. Each card shows a count and a short
detail line, and tapping it filters the list to that group:

| Card | Filters to | Detail line |
|---|---|---|
| `All customers` | Every buyer | `Everyone` |
| `With dues` | Positive balance on open orders | Pending amount |
| `Has paid` | At least one payment ever | Lifetime collected amount |
| `Active orders` | At least one non-closed order | Number of open orders |

The active card gets an accent border and a dot, and exposes `aria-current`.
Counts come from all buyers, never from the current filter. Empty: each card
shows zero. Hidden: the cards are hidden for a session-expired owner.

### Filters

The search field accepts a name or phone digits. The old `All | With dues` pills
are gone: the cards are the only segment control, so the same choice is not
shown twice. The default segment is `All customers`. Sort keys are `Pending`,
`Name`, and `Recently added`. There is no period filter because customer records
have no period. Empty: the filter bar is hidden when the shop has no customers.

### Customer list

The card header follows the
[report list anatomy](README.md#report-list-anatomy). It shows `Customers:`,
`Total {count}`, and the collapse chevron. It has no total amount: money totals
live on the filter cards and in the money columns, not in the header. `Pending`
is the default sort. Sort ties break on name. The list has no row cap. Empty:
`No customers yet.` and Add sale. Hidden: the list card is hidden while loading.

### Customer row

On desktop the list has aligned columns with eyebrow headings: `Name`, `Mobile`,
`Orders`, `Total billed`, `Total paid`, and `Balance due`. A row uses one grid
and one `figure` column for each amount. On mobile the same cells stack in one
column.

| Cell | Content |
|---|---|
| Name | Name, or the phone when no name exists. Sub-label on a second line; `locality · pincode` from the stored address on a third line |
| Mobile | Phone masked to the last four digits (e.g. `••••••3210`), or `No phone`; `Paid on {date}` on a second line |
| Orders | Count only on desktop (`4`); `{n} orders` on mobile. Caption `{completed} done · {cancelled} cancelled` |
| Total billed | Lifetime sum of order totals, `figure` utility |
| Total paid | Lifetime sum of payments, `figure` utility |
| Balance due | Positive balance on open orders, `figure` utility. Caption `Due` or `Clear` on mobile |

Raw phone digits are never sent to the list; search still matches them on the
server. A row with no pending amount stays in the list under `All customers`. It
is hidden under `With dues`. Names, masked phone numbers, and the locality line
truncate instead of wrapping.

### Customer detail

`/customers/{id}` opens one customer record. It answers who the buyer is and
what they owe. Four cards use the list's card anatomy: `Orders` (with a
`completed · cancelled` detail line), `Total billed`, `Total paid`, and `Balance
due`. Billed and paid cover every order; the balance covers open orders only.
There is no separate Completed or Cancelled tile because the Orders card already
carries that split.

The header subtitle shows `locality · pincode`, or `Customer since {date}` when
there is no address. The header never repeats the phone or label: the details
card is the only place for phone, label, address, last paid, customer since, and
notes from [customers](../data-model.md#customers). Contact actions are `Call`,
`SMS`, and `WhatsApp` and still use the full number. The address uses
`line1`–`line3`, then `locality, city, state`, then `country pincode`. The guest
detail shows phone and address in its own card.

The orders card lists every order for that buyer under `Order`, `Needed`,
`Placed`, `Status`, `Bill total`, `Paid`, and `Balance`. Add previous due stays
below the orders. Empty: the orders card says `No orders yet.` Hidden: contact
actions are hidden when the customer has no phone.

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
`components/reports/CustomersReport.tsx`. The guest list is built from
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
| Locality, pincode | `address` on the customer record, or guest `address` in local storage |
| Last paid | `last_paid_at` on the customer record, written by a payment |
| Label, notes, customer since | `sub_label`, `notes`, and `created_at` on the customer record |
| Search index | Customer lookup `(business_id, phone)` in [data-model.md](../data-model.md#indexes) |

Guest totals use integer paise through [paise.ts](../../lib/paise.ts) and the
same open-order dues rule. Guest order status comes from `guestOrderTotals()`,
which can promote a paid `ready` order to `completed`.

## Interactions

| Action | Result |
|---|---|
| Tap a row | Opens `/customers/{id}` with filters kept in the URL |
| Type in search | Updates the URL and filters the list |
| Tap a filter card | Sets the customer segment and updates the URL |
| Tap sort | Opens a small menu. One tap sets the sort and closes the menu |
| Tap the chevron | Collapses or expands the list. State is local to the page |
| Back | Returns to the previous view with filters kept |
| Swipe | No swipe gesture on this page |

## States

| State | What appears |
|---|---|
| First run | Empty state with Add sale |
| Loading | Skeleton with the final header, four card outlines, search bar, and five row heights |
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
| Filter cards | `All customers`, `With dues`, `Has paid`, `Active orders` |
| Search placeholder | `Search name or phone` |
| Sort options | `Pending`, `Name`, `Recently added` |
| Column labels | `Name`, `Mobile`, `Orders`, `Total billed`, `Total paid`, `Balance due` |
| Row labels | `No phone`, `—`, `{n} orders`, `{n} done · {n} cancelled`, `No payments`, `Paid on {date}` |
| Amount captions | `Due`, `Clear` |
| Detail cards | `Orders`, `Total billed`, `Total paid`, `Balance due` |
| Detail table labels | `Order`, `Needed`, `Placed`, `Status`, `Bill total`, `Paid`, `Balance` |
| Detail labels | `Customer details`, `Phone`, `Label`, `Address`, `Last paid`, `Customer since`, `Note:`, `No orders yet.` |
| Detail actions | `Call`, `SMS`, `WhatsApp`, `Add previous due` |
| Empty list | `No customers yet.` and `Add sale` |
| Empty filter | `No customers for this filter.` and `Clear filters` |
| Error | `Could not load customers.` and `Try again` |

## Accessibility and performance

- Each row is one link with an accessible name that includes the customer name,
  masked phone, and balance due.
- Filter cards are links with `aria-current` on the active segment.
- Contact actions in detail use the shared 44 px target and an accessible name.
- Amounts use tabular numerals and never animate.
- Search input has a visible label. The placeholder is not the label.
- The sort menu uses `aria-expanded`.
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
