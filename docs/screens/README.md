# Screens

> Part of the StartLite docs. Start at [README](../README.md).

- One file per screen. Layout first, engineering second.
- The screen doc owns layout, states, and copy. Other docs own data and words.
- Every screen is specified at 360 px, 768 px, and 1200 px.
- A zone states what it shows when it is empty and when it is hidden.

## Index

| Screen | Route | Tab | File |
|---|---|---|---|
| Home | `/` | Home | [home.md](home.md) |
| Orders | `/orders` | Orders | Not written |
| Customers | `/customers` | Customers | Not written |
| Items | `/items` | Items | Not written |
| Expenses | `/expenses` | Expenses | Not written |
| Settings | `/settings` | Settings | Not written |
| Add sale | `/sales/new` | Home | [home.md](home.md#add-sale) |
| Add customer | overlay | Home | [home.md](home.md#add-customer) |
| Add item | overlay | Home | [home.md](home.md#add-item) |
| Add expense | overlay | Home | [home.md](home.md#add-expense) |
| Order sheet | overlay | — | Not written |
| Requests sheet | overlay | — | Not written |
| Launch sheet | overlay | — | Not written |
| Save sheet | overlay | — | Not written |
| Public storefront | `/b/{handle}` | — | Not written |

## Template

Every screen doc uses these sections, in this order.

| Section | Content |
|---|---|
| Purpose | The one question the screen answers |
| Arrival | How the user gets here and where they leave |
| Who sees it | Guest, owner, new device, expired session |
| Layout | ASCII skeleton at 360 and 1200, plus the breakpoint table |
| Zones | Top to bottom. Content, order, caps, empty and hidden rules |
| Guest and owner | A table of the only visible differences |
| Data | Queries, aggregates, indexes |
| Interactions | Tap, swipe, keyboard, back |
| States | First run, loading, empty, offline, error, expired |
| Copy | Exact labels, buttons, empty text |
| Accessibility and performance | Targets and budgets |
| Out of scope | What this screen does not do |

## Shared shell

Every merchant screen uses the same shell. The shell is specified once, here.

### Breakpoints

| Width | Navigation | Content |
|---|---|---|
| 320–767 | Bottom tab bar, 64 px plus safe area | One column, 16 px gutter |
| 768–1199 | Left rail, 200 px | One column, `max-width: 720px` |
| 1200 and above | Left rail, 240 px | Main column plus a 360 px right column |

The storefront keeps its own shell at `max-width: 460px`. The admin keeps
`max-width: 1200px`.

### Tabs

Six fixed tabs. The same six on every merchant screen, guest or owner.

| Position | Label |
|---|---|
| 1 | Home |
| 2 | Orders |
| 3 | Customers |
| 4 | Items |
| 5 | Expenses |
| 6 | Settings |

The tab bar is 64 px plus the safe area. Each item is 60 px at 360 px and 53 px
at 320 px. Icon 22 px, label 10 px. Labels never wrap and never ellipsis. The
active tab uses `accent` at weight 600. The bar never hides on scroll.

From 768 px the same six items become a left rail. The rail ends with the
`StartLite` wordmark at 11 px, muted.

### Header

56 px on mobile, 64 px on desktop. Sticky. It holds the shop logo or initial
(round, 40 px), the shop name, and the state pill. The handle appears from
768 px. There is no search and no gear; Settings is a tab.

### State pill

One pill, always visible, on every screen.

| State | Dot | Text | Tap |
|---|---|---|---|
| Guest | Amber | `Not saved` | Opens the save sheet: Sign in, Create account, Keep using this phone |
| Signed in | Green | `Saved` | Opens sync details |
| Offline | Grey | `Offline` | Explains that writes need a connection |
| Expired | Grey | `Sign in` | Opens the sign-in screen |

The pill never disappears. It is the only persistent guest signal besides the
footer.

### Request bar

Shown on every merchant screen when at least one storefront request waits.

```
⚡ 3 requests · oldest 2h                  Review ›
```

40 px tall, `accent-soft`, one tap opens the Requests sheet. Accept, change time,
and decline all happen inside that sheet. The owner never navigates to Home to
accept a request.

From 1200 px the bar becomes a header pill with the same count, opening a right
side panel.

### Footer

`StartLite` at 11 px, muted, plus the build version. On mobile it is the last row
of the page. On desktop it is the last row of the rail. It is never the loudest
element on the screen.

### Loading

Skeletons match the final layout. No spinners for local actions. No layout shift
when data arrives.

## Number rules

| Rule | Value |
|---|---|
| Money | Indian grouping, two decimals: `₹1,04,250.00`. Compact form `₹1.04L` only above ₹1,00,000 |
| Period | Every number states Today, This week, This month, or All |
| Week | Monday to Sunday, IST |
| Count | A muted second line under the amount, for example `7 orders` |
| Profit | Never shown. Money summary cards are not on Home |
| Dates | `21-Nov-2026`. Times are 12-hour with `am` and `pm` |
| Tabular numerals | Every amount and count |

## Status to surface

The order status decides where an order appears. The screen never invents a
status.

| Status | Shown as | Home list | Orders tab |
|---|---|---|---|
| `under_review` | Under review | Pending orders | Incomplete |
| `waiting_client` | Waiting for client | Pending orders | Incomplete |
| `accepted` | Accepted | Pending orders | Incomplete |
| `in_progress` | In progress | Pending orders | Incomplete |
| `ready` | Ready | Completed · payment due when a balance exists | Incomplete |
| `completed` | Completed | Completed · payment due when a balance exists | Paid |
| `declined` | Declined | Not shown | All only |
| `cancelled` | Cancelled | Not shown | All only |

On Home, **Pending orders** appears above **Completed · payment due**. Work
unfinished outranks money waiting. The two lists never mix. See
[ADR-037](../decisions.md#adr-037-generic-order-status-funnel).

## Writing rules

1. Draw the skeleton before the data.
2. Every zone states its empty state and its hidden state.
3. Write the exact copy. Do not paraphrase a label.
4. Link to [data-model.md](../data-model.md) for a column. Never restate a type.
5. Link to [merchant-language.md](../merchant-language.md) for a word. Never
   invent a synonym.
6. A screen that needs a new column updates the data model in the same change.
