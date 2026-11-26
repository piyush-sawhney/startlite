# Expenses

> Part of the StartLite docs. Start at [README](../README.md) and
> [screens](README.md). Visual rules live in [design-system.md](../design-system.md).

Expenses is the expense report at `/expenses`. It answers one question: how much
money went out in the chosen period. The Add expense sheet on Home records a
single expense. Expenses reviews all of them.

The page is a list report. It uses the
[report list anatomy](README.md#report-list-anatomy) shared by all three report
pages.

## Purpose

A merchant opens Expenses to check spending and see where money went. The page
answers:

- How much was spent in the period.
- How many entries were logged.
- What cash is left after expenses.

## Arrival and exit

| From | Result |
|---|---|
| Store settings → Expenses | Opens `/expenses` with the saved filters |
| Bottom tab, where present | Opens `/expenses` |
| Home, Add expense | Records one expense and stays on Home |
| Add expense on this page | Opens the entry form inline, then returns to the list |
| Back | Returns to Store settings with filters kept in the URL |

The filters live in the URL so a report can be refreshed or shared.

## Who sees it

| Visitor | What appears |
|---|---|
| Owner, signed in | Server data. Pill says `Saved` |
| Owner, offline | Last loaded rows. Pill says `Offline`. Writes need a connection |
| Owner, session expired | Sign-in state. No guest fallback |
| Guest on this phone | Local expenses. Pill says `Not saved` |
| New venture | Empty state with Add expense |

## Layout

The page uses one column below 1024 px. From 1024 px the collapsible rail
replaces the bottom tabs. The 360 px right column stays empty on report pages.

```text
360 px
┌────────────────────────────┐
│ Expenses  12 entries ·     │
│           This month  +    │
├────────────────────────────┤
│ ┌──────────┬──────────┐    │
│ │ Spent    │ Entries  │    │
│ │ ₹8,400   │ 12       │    │
│ ├──────────┼──────────┤    │
│ │ Cash left│          │    │
│ │ ₹6,100   │          │    │
│ └──────────┴──────────┘    │
├────────────────────────────┤
│ Search paid to             │
│ Today | This month | All   │
├────────────────────────────┤
│ Expenses: Total 12         │
│ ─────────────────────────  │
│ Flour mill                 │
│ 21-Nov-2026                │
│                 ₹1,200.00  │
└────────────────────────────┘
```

```text
1200 px
rail │ main column                              │ right column
     │ Expenses  12 entries · This month  +     │ empty
     │ ┌────────┬─────────┬──────────┐          │
     │ │ Spent  │ Entries │ Cash left│          │
     │ └────────┴─────────┴──────────┘          │
     │ [Search paid to] [This month] [All]      │
     │ Expenses: Total 12       Sort: Newest    │
     │ row · row · row · row                    │
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

The title is **Expenses**. The subtitle states the count and the period, for
example `12 entries · This month`. The filled action is **Add expense**. No
second filled button appears on the page. Empty: the subtitle says
`No expenses · This month`. Hidden: Add expense is hidden for an expired
session.

### Summary strip

Three tiles in this order: `Spent`, `Entries`, `Cash left`. Each tile uses the
shared metric anatomy from
[report list anatomy](README.md#report-list-anatomy). `Cash left` shows the hint
`Received − expenses · not profit`. The period follows the selected pill. Empty:
all three tiles show zero. Hidden: the strip is hidden for a session-expired
owner.

### Filters

The search field accepts the name of the person or shop paid. Period pills are
`Today`, `This month`, and `All`. The default period is **This month**. Empty:
the filter bar is hidden when the shop has no expenses. Hidden: the search field
is hidden when the period returns zero rows, so the merchant can change the
period first.

### Expense list

The card header follows the
[report list anatomy](README.md#report-list-anatomy). It shows `Expenses:`,
`Total {count}`, `Total spent: {amount}`, the sort control, and the collapse
chevron. Sort keys are `Newest` and `Amount`. `Newest` is the default. The list
has no row cap. Empty: `No expenses for this filter.` and Add expense. Hidden:
the list card is hidden while loading.

### Expense row

| Row | Content |
|---|---|
| Primary | Paid to, from the expense title |
| Secondary | Expense date in `21-Nov-2026` form |
| Amount | Expense amount in the right column, `figure` utility |

A row has no action. The owner detail view and edit form are out of scope. A
guest row has a Remove action because guest data is local and has no server
record.

The merchant table has no `paid_for` column. Do not show a paid-for line for an
owner until that column exists. The guest store has a `paid_for` value, but the
report does not show it for either visitor. This keeps one row shape for both
adapters. See the deferred decision in
[ADR-040](../decisions.md#adr-040-shared-report-pages).

## Guest and owner

| Element | Guest | Owner |
|---|---|---|
| Data source | `localStorage` `startlite_guest_v2` | Postgres through RLS |
| State pill | `Not saved` | `Saved` or `Offline` |
| Request bar | Hidden | Shown when requests wait |
| Entry form | Paid to, Paid for, Amount, Date | Paid to and Amount. Date defaults to today |
| Row action | Remove | None |
| Paid for | Stored locally but not shown | Not stored |

## Data

The owner adapter is `getExpensesReport(businessId, filters)` in
[queries.ts](../../lib/queries.ts). The guest adapter is
`guestExpensesReport(state, filters)` in
[guest-store.ts](../../lib/guest-store.ts). Both return
`ExpensesReportData`. The shared shapes live in `lib/report-types.ts`, which
implementation adds. The page component never reads a database or local storage
directly.

| Value | Source |
|---|---|
| Row | [expenses](../data-model.md#expenses) |
| Spent in period | Sum of expense amounts in the selected period |
| Cash left | [cashSummary](../../lib/queries.ts) with the period start. Guest uses `guestCashSummary` |
| Search index | Expenses `(business_id, expense_date DESC)` in [data-model.md](../data-model.md#indexes) |

Guest totals use integer paise through [paise.ts](../../lib/paise.ts). The guest
adapter applies the same period rule as the owner adapter.

## Interactions

| Action | Result |
|---|---|
| Tap Add expense | Opens the entry form inline |
| Submit the form | Saves the entry, closes the form, and refreshes the list |
| Type in search | Updates the URL and filters the list |
| Tap a pill | Sets the period and updates the URL |
| Tap sort | Opens a small menu. One tap sets the sort and closes the menu |
| Tap the chevron | Collapses or expands the list. State is local to the page |
| Tap Remove, guest | Deletes the local entry after a confirm sheet that states the result |
| Back | Returns to the previous view with filters kept |
| Swipe | No swipe gesture on this page |

## States

| State | What appears |
|---|---|
| First run | Empty state with Add expense |
| Loading | Skeleton with the final header, three tiles, filter bar, and five row heights |
| Empty filter | `No expenses for this filter.` and Clear filters |
| Offline owner | Last loaded rows and the `Offline` pill. The form shows a connection message |
| Offline guest | All rows work. Pill stays `Not saved` |
| Bad amount | `Enter an amount above zero.` next to the field |
| Load error | `Could not load expenses.` and Try again |
| Session expired | Sign-in state. No guest rows |

## Copy

| Element | Text |
|---|---|
| Page title | `Expenses` |
| Subtitle | `{n} entries · {period}` |
| Metric tiles | `Spent`, `Entries`, `Cash left` |
| Cash left hint | `Received − expenses · not profit` |
| Search placeholder | `Search paid to` |
| Period pills | `Today`, `This month`, `All` |
| Sort options | `Newest`, `Amount` |
| Entry labels | `Paid to`, `Paid for`, `Amount`, `Date` |
| Empty list | `No expenses yet.` and `Add expense` |
| Empty filter | `No expenses for this filter.` and `Clear filters` |
| Remove confirm | `Remove this expense?`, `Yes, remove`, `Keep it` |
| Error | `Could not load expenses.` and `Try again` |

## Accessibility and performance

- Each row has an accessible name that includes the paid-to name, date, and
  amount.
- Amounts use tabular numerals and never animate.
- The form has visible labels. Placeholders are not labels.
- Errors appear beside the field and use `aria-live`.
- Filter pills use `aria-pressed`. The sort menu uses `aria-expanded`.
- Tap targets are at least 44 px with 8 px gaps.
- The list has no cap. The adapter sorts and filters before render.
- Loading uses final heights. Data replaces the skeleton in place.

## Out of scope

- Charts and spend categories.
- Editing an owner expense.
- A paid-for field for the owner until the table has the column.
- Recurring expenses and reminders.
- A date-range picker. Period pills cover the report.
- Showing profit. Cash left is not profit.
