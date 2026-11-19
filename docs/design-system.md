# Design System

> Part of the StartLite docs. Start at [README](README.md).

- Calm and premium, never loud.
- One accent, generous spacing, numbers that line up.
- Every screen works at 360 px on a budget Android phone.

## Personality

The interface should feel like a well-run shop, not a discount banner. Confidence
comes from spacing, alignment, and restrained color. It does not come from
animation or decoration.

| Trait | Expression |
|---|---|
| Calm | Warm neutral canvas, one accent, few borders |
| Premium | Generous spacing, precise alignment, tabular numerals |
| Trustworthy | Plain words, visible totals, no surprise states |
| Fast | Immediate feedback, no spinners for local actions |
| Indian-first | Rupee grouping, WhatsApp-native flows, 24 locales |

Do not use: gradients on primary buttons, more than one accent hue, shadows
stronger than `e2`, all-caps labels, stock photography, confetti, bouncing icons,
animated money counters, or emoji in navigation.

## Frictionless rule

- Every screen opens without login. There is no auth modal.
- The save prompt is a quiet card, never a gate. It never blocks a write.
- The signed-out workspace shows one state: **Saved on this phone**. The save
  action is secondary.
- After signup, local work copies into the shop before the first interaction.
  Show one line when it finishes.
- Do not say "guest" on screen. Say "this phone".
- A failed save or copy leaves the current screen and data intact.

## Color tokens

Light theme only in v1. Dark tokens stay reserved in the same file but are not
exposed.

| Token | OKLCH | Approx hex | Use |
|---|---|---|---|
| `canvas` | `0.985 0.004 90` | `#FBFAF7` | Page background |
| `surface` | `1 0 0` | `#FFFFFF` | Cards, sheets |
| `surface-muted` | `0.965 0.005 90` | `#F4F2ED` | Inputs, inactive tabs |
| `border` | `0.905 0.006 90` | `#E4E1D9` | Dividers, card outlines |
| `ink` | `0.24 0.012 70` | `#2A2724` | Primary text |
| `ink-muted` | `0.50 0.010 70` | `#75706A` | Secondary text |
| `ink-subtle` | `0.63 0.008 70` | `#9C978F` | Captions, placeholders |
| `accent` | `0.47 0.075 195` | `#12666B` | Primary actions, active tab |
| `accent-strong` | `0.38 0.070 195` | `#0B4D52` | Pressed state, links |
| `accent-soft` | `0.950 0.020 195` | `#E5F2F2` | Selected chips, highlights |
| `success` | `0.55 0.110 155` | `#2E7D5B` | Paid, settled |
| `warning` | `0.66 0.140 70` | `#B8730F` | Due soon, low stock |
| `danger` | `0.55 0.170 25` | `#B33A2B` | Overdue, destructive |
| `info` | `0.55 0.130 250` | `#2F5FB3` | Informational badges |

Rules:

- Status color never carries meaning alone. Pair it with a word and an icon.
- Body text uses `ink` on `canvas` or `surface`. That pair exceeds 12:1 contrast.
- `accent` on `surface` exceeds 6:1. Use white text on `accent`.
- Do not tint large surfaces with status colors. Use a left border or a pill.

## Typography

| Role | Family | Weight | Size and line height |
|---|---|---|---|
| Marketing display | Instrument Serif | 400 | 40/48, Latin only |
| Page title | Inter | 600 | 24/32 |
| Section title | Inter | 600 | 20/28 |
| Body | Inter | 400 | 16/24 |
| Body strong | Inter | 600 | 16/24 |
| Small | Inter | 400 | 14/20 |
| Caption | Inter | 500 | 12/16 |
| Micro | Inter | 500 | 11/14, tracking `0.02em` |

Rules:

- All amounts use `font-variant-numeric: tabular-nums`.
- Amounts align right in lists and use a fixed decimal column.
- The measure is 45 to 75 characters. Never full width on a tablet.
- One family per script. Do not mix a Latin display font into regional text.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for paragraphs.

## Scripts and fonts

Load only the active locale's script. Use `unicode-range` subsets and
`font-display: swap`.

| Script | Locales | Font | Direction |
|---|---|---|---|
| Latin | `en`, `hi-Latn` | Inter | LTR |
| Devanagari | `hi`, `mr`, `ne`, `sa`, `doi`, `brx`, `kok`, `mai` | Noto Sans Devanagari | LTR |
| Gujarati | `gu` | Noto Sans Gujarati | LTR |
| Tamil | `ta` | Noto Sans Tamil | LTR |
| Bengali | `bn`, `as` | Noto Sans Bengali | LTR |
| Telugu | `te` | Noto Sans Telugu | LTR |
| Kannada | `kn` | Noto Sans Kannada | LTR |
| Malayalam | `ml` | Noto Sans Malayalam | LTR |
| Gurmukhi | `pa` | Noto Sans Gurmukhi | LTR |
| Odia | `or` | Noto Sans Oriya | LTR |
| Ol Chiki | `sat` | Noto Sans Ol Chiki | LTR |
| Meitei Mayek | `mni` | Noto Sans Meetei Mayek | LTR |
| Arabic | `ur`, `sd`, `ks` | Noto Nastaliq Urdu | RTL |

RTL rules:

- Use logical properties: `margin-inline-start`, `padding-inline-end`, `inset-inline`.
- Mirror directional icons. Do not mirror numbers, logos, or the QR code.
- Phone numbers, amounts, and order codes stay LTR inside RTL text.
- Test every screen with `dir="rtl"` and a longer Urdu string.

## Spacing, radius, elevation

Spacing scale, in pixels: `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8 | Inputs, chips |
| `radius-md` | 12 | Buttons, list rows |
| `radius-lg` | 16 | Cards |
| `radius-xl` | 24 | Sheets, hero panels |
| `radius-full` | 9999 | Pills, avatars |

| Token | Shadow |
|---|---|
| `e1` | `0 1px 2px rgb(20 18 15 / 6%)` |
| `e2` | `0 8px 24px rgb(20 18 15 / 8%)` |
| `e3` | `0 16px 48px rgb(20 18 15 / 12%)` |

Sheets use `e3` and a backdrop of `ink` at 32% opacity.

## Layout

| Item | Rule |
|---|---|
| Design range | 360 px to 430 px wide |
| Storefront width | `max-width: 460px`, centered |
| Merchant app width | `max-width: 640px`, centered |
| Workspace width | `max-width: 640px`, centered. Same shell as the merchant app. |
| Admin width | `max-width: 1200px` |
| Page gutter | 16 px |
| Tap target | 44 px minimum, 48 px preferred, 8 px gap |
| Bottom tab bar | 64 px plus safe area |
| Sticky action | Sits above the tab bar, never overlaps it |
| Safe area | Respect `env(safe-area-inset-*)` on every fixed element |
| Primary reach | Primary actions sit in the lower third of the screen |

The storefront must never scroll horizontally. Test at 320 px, 360 px, and 430 px.

## Motion

| Token | Value | Use |
|---|---|---|
| `motion-fast` | 120 ms | Press, toggle |
| `motion-base` | 180 ms | Fade, chip select |
| `motion-slow` | 240 ms | Page section enter |
| `motion-sheet` | spring, stiffness 380, damping 34 | Bottom sheet |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | All non-spring motion |

Rules:

- Animate only `transform` and `opacity`.
- Respect `prefers-reduced-motion`. Replace motion with an instant change.
- Do not animate money values. A counting number can mislead.
- Do not animate a spinner for an action that resolves under 300 ms.
- The payment success state may use one short scale-in. Nothing else celebrates.

## Navigation

Five tabs. Four names are fixed. The fifth comes from the shop's category pack.

| Position | Label | Icon meaning |
|---|---|---|
| 1 | Home | Shop overview |
| 2 | Sales | Orders and bills |
| 3 | Customers | People who owe money |
| 4 | Menu, Items, or Services | The catalog |
| 5 | More | Everything else |

Rules:

- A tab label is one word. Never a metaphor.
- The pack noun comes from [category-packs.md](category-packs.md).
- No tab is ever named Galla, Bikri, Khata, or Samaan.
- The active tab uses `accent` and weight 600.
- The bar never hides on scroll.
- The workspace uses the same five tabs over local state. A tab switch keeps the
  current phone data and never reloads the page.

## Visibility tiers

A new merchant sees three tabs, three numbers, and one button. The rest appears
when it is needed.

| Tier | When it appears | Examples |
|---|---|---|
| 0 | Always | Home, Sales, Customers, Add sale, Send bill |
| 1 | After the first item is published | Catalog tab, item images, options and extras |
| 2 | More → Advanced, on request | TDS, bank details, time slots, privacy mode, paper import |

Hidden is not removed. A search field in More finds an advanced setting by name.

## Screens

### Home

Three numbers above the fold. Each states its period.

| Slot | Content |
|---|---|
| 1 | **Today's sales** · revenue of orders created today |
| 2 | **Received today** · payments logged today |
| 3 | **Pending** · unpaid amount across all open orders |

Below the numbers:

- A pending-order strip, only when at least one order waits. Newest first.
- Three recent orders.
- One primary button: **Add sale**.
- A quiet **Saved on this phone** card with one save action. It sits below the
  other content, never above it.

No charts. No sparklines. No "insights".

### Sales

A list, newest first. Filters: All, Pending, Paid. Search by name, phone, or
order code.

Each row shows customer, item count, total, and a status pill. A row opens a
sheet with actions: add item, log payment, send bill, send reminder.

The row also states the date. Never show a bare amount without a date or a
period.

### Customers

A list sorted by pending amount, highest first. Each row shows name, pending
amount, and the last payment date.

Actions in the row sheet: repeat last bill, log payment, send reminder, add
previous due.

### Catalog tab

The label is Menu, Items, or Services, from the pack. A list with a photo
thumbnail, name, price, and an in-stock toggle. One primary button: **Add item**.

The add form has three fields: name, price, and availability. Options and extras
sit below, closed by default.

### More

| Group | Rows |
|---|---|
| Money | Expenses, Cash left, Bills |
| Shop | Store link, Store settings, Share on WhatsApp |
| Language | Current language, Change |
| Data | Download data |
| Help | How it works, Contact us |
| Advanced | TDS, Bank details, Time slots, Privacy mode, Previous dues |

`Cash left` opens a period picker: Today, This month, All. It shows money
received, expenses, and the difference. It also shows one line: "This is not
profit."

### Checkout

Three fields at most. Two are required.

| Order | Field | Default |
|---|---|---|
| 1 | Name | Remembered from last time |
| 2 | Phone | Remembered from last time |
| 3 | Note | Empty, optional |
| — | Needed by | Today, one tap to change |

Rules:

- Name and phone are required. The note is optional.
- **Needed by** is a pill group: Today, Tomorrow, Pick date.
- No payment step. No QR. No account. No OTP.
- The submit button says **Send on WhatsApp**.
- Turnstile runs invisible. Never show a puzzle unless the check fails.
- After submit, show the WhatsApp button with the order text previewed.
- If the network fails, keep the cart and offer retry. Never clear the cart.

## Components

| Component | Behavior | Notes |
|---|---|---|
| `AppShell` | Bottom tabs, safe areas, scroll restoration | Five tabs, one from the pack |
| `BottomTabs` | Five items, icon plus label | Active item uses `accent` at weight 600 |
| `PageHeader` | Title, optional back, one action | Never two primary actions |
| `KpiCard` | Label, amount, period | Amount uses tabular numerals |
| `OrderCard` | Customer, items, status, paid, due, date | Expand for actions |
| `StatusPill` | Quote, open, ready, settled, cancelled | Word plus color |
| `PendingOrderCard` | Buyer, item count, total, age | **Review** is the only accent action |
| `PaymentSheet` | Amount keypad, mode, TDS link, save | Prefill the full due amount |
| `NumericKeypad` | Large keys, one decimal point | Amount entry, never a plain input |
| `QuantityStepper` | Minus, value, plus | Long press to type a decimal |
| `OptionSheet` | Option radio, extra radio or checkbox | Shows the computed price live |
| `StockToggle` | One tap, optimistic | Shows "In stock" or "Sold out" |
| `PillGroup` | Single or multi select | Today, Tomorrow, Pick date |
| `CartBar` | Item count and total, opens checkout | Fixed above safe area |
| `StoreHeader` | Name, tagline, notice, privacy mode | Logo is optional |
| `ItemCard` | Name, price, mode label, availability | Sold-out items stay visible, dimmed |
| `BillPreview` | Rendered text bill with a copy action | Shows the exact WhatsApp text |
| `ReminderPreview` | Short due message | One line plus the amount |
| `EmptyState` | One line, one action | No illustrations in v1 |
| `Toast` | Result of a write | Bottom, above the tab bar, 3 seconds |
| `SaveBanner` | "Saved on this phone" plus one quiet save action | Never blocks a write |
| `GuestImportBanner` | Result of copying phone data into a shop | One line, then it fades |
| `GuestTabs` | Same five tabs over local state | Same labels, icons, and safe area |
| `ConfirmSheet` | Destructive action | Names the consequence, not "Are you sure?" |
| `MediaUploader` | Pick, crop to square, preview, remove | Client resize to 1600 px |
| `LocaleSwitcher` | Searchable list of 24 locales | Beta locales carry a badge |
| `NetworkBanner` | Offline or slow connection | Explains that writes need a connection |
| `DataTable` | Admin lists with search and pagination | Keyboard accessible |
| `PassCard` | Trial or pass status, expiry, activate | Admin only in v1 |

Component rules:

- Use a bottom sheet on mobile, not a centered modal.
- Use skeletons that match the final layout. Do not use a generic shimmer block.
- A destructive action requires a confirm sheet that states the result.
- A row that opens a sheet shows a chevron. A row that navigates shows a chevron
  plus a distinct press state.
- Never place two filled accent buttons in one view.

## Bill and message text

The bill is plain text first. It must survive WhatsApp, SMS, and a screenshot.

```text
*Anita's Bakes*
Bill 42 · 18 Nov 2026

2 × Chocolate cake (500 g)   ₹900.00
1 × Eggless extra            ₹100.00

Total    ₹1,000.00
Paid       ₹400.00
Due        ₹600.00

Pay by UPI: anita@okhdfcbank
PhonePe · GPay · Paytm

Needed by: Today

⚡ Run a business on WhatsApp?
Get your free digital store at StartLite.in
```

Rules:

- Bold only the shop name.
- One line per item. Quantity, name, option, then amount.
- Extras indent under their parent line where the client allows it.
- Totals are the last block. Label them Total, Paid, Due.
- Show the UPI block only when the amount due is above zero.
- Show the QR only in the PNG, never in the text.
- The referral line is always last and always two lines.
- Date format: `18 Nov 2026`. Never `11/18/2026`.
- Amount format: `₹1,00,000.00`. Indian grouping, two decimals.

Reminder text:

```text
*Anita's Bakes*
Bill 42 · 18 Nov 2026
Due ₹600.00

Pay by UPI: anita@okhdfcbank
```

## Canvas outputs

Images render on the client. The server stores nothing.

| Output | Size | Trigger |
|---|---|---|
| Receipt PNG | 720 × auto | **Generate image** on a bill |
| WhatsApp status card | 720 × 1280 | Store settings → Share on WhatsApp |
| Bag-stuffer flyer | 800 × 1000 | Store settings → Share on WhatsApp |

Receipt contents, in order:

1. Shop name and optional logo.
2. Bill number and date.
3. Customer name.
4. Item rows with quantity, name, option, and amount.
5. Total, paid, due.
6. UPI QR, only when due is above zero. Total only.
7. Footer with the shop phone number and the referral line.

Rendering rules:

- Margins: 48 px for the receipt, 56 px for the status card, 64 px for the flyer.
- Receipt rows: 24 px, right-aligned amounts, tabular numerals.
- Keep the top and bottom 120 px of the status card free of critical content.
  WhatsApp crops it.
- QR quiet zone: 24 px. Minimum module size: 4 px.
- The QR encodes the total only, never the item list.
- Render at the target size, not scaled. Export with `canvas.toBlob('image/png')`.
- Share as a document with `navigator.share` and a `File`. Otherwise download.
- A document avoids WhatsApp recompression, which can destroy a QR.
- The footer is always the StartLite referral line.
- Test every image on a 360 px screen and after one WhatsApp forward.

## States

| State | Treatment |
|---|---|
| Empty | One sentence, one action, no illustration |
| Loading | Skeleton with the real shape, no spinner |
| Error | What happened, what to do, retry action |
| Slow network | Inline banner after 3 seconds, keep the current screen |
| Offline | Banner states that writes need a connection. Reads stay cached. |
| Pass expired | Merchant keeps access. Storefront shows a paused page. Export stays. |
| Pending order expired | "This order link has expired. Ask the buyer to send again." |
| Beta locale | Small badge plus "Report a translation" in More |
| Unsaved work | The screen says "Saved on this phone". The save action stays quiet. |
| Copied phone data | One success line after signup. No modal and no blocking step. |
| Copy failed | The shop stays usable. One line says the phone data is still safe. |

## Accessibility

- Contrast: 4.5:1 for body text, 3:1 for large text and UI borders.
- Focus ring: 2 px `accent` with a 2 px offset. Never remove it.
- Every icon button has an accessible name.
- Every input has a visible label. Placeholders are not labels.
- Form errors appear next to the field and are announced with `aria-live`.
- Touch targets are at least 44 px with 8 px separation.
- Support 200% text zoom without clipping.
- Set `<html lang>` and `dir` from the active locale.
- Test with TalkBack on Android for the four primary flows.
- Motion respects `prefers-reduced-motion`. Reduced motion keeps all state changes.

## Content and tone

- Use the second person: "Your order", not "The order".
- Use the shortest correct word. "Pay" not "Make a payment".
- No accounting jargon. "Pending" not "accounts receivable".
- Every error states what happened and what to do next.
- Keep Hindi and Hinglish copy at the same length as English.
- Beta translations keep the English term in a tooltip for money and status.
- Words per screen: 12 maximum in a label, 20 in a sentence.

Examples:

| Avoid | Use |
|---|---|
| "Transaction failed" | "Payment not saved. Check your connection and try again." |
| "No data found" | "No orders yet. Add your first sale." |
| "Are you sure?" | "Delete this item? Past bills keep their records." |
| "Create an account to continue" | "Saved on this phone. Save my shop to keep it safe." |
| "Guest mode" | "On this phone" |
| "Utilize the export functionality" | "Download your data" |
| "Accounts receivable" | "Pending" |
