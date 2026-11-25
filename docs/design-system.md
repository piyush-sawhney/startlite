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

The behavior rules for the signed-out workspace live in
[product.md](product.md#frictionless-first) and
[ADR-029](decisions.md#adr-029-guest-workspace-before-login). The visual rules
are:

- The save prompt is a quiet card, never a gate. It never blocks a write.
- The signed-out workspace shows one state: **Saved on this phone**. The save
  action is secondary.
- Do not say "guest" on screen. Say "this phone".

## Color tokens

Light theme only in v1. Dark tokens stay reserved in the same file but are not
exposed.

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#FFFFFF` | Page background, plain white |
| `surface` | `#FFFFFF` | Cards, sheets |
| `muted` | `#F4F7F6` | Inactive chips, soft row bands |
| `line` | `#E2E9E6` | Dividers, card outlines |
| `ink` | `#17231F` | Primary text, 16.2:1 on white |
| `ink-muted` | `#52635E` | Secondary text, 6.4:1 on white |
| `ink-subtle` | `#63736D` | Captions and placeholders, 5:1 on white |
| `accent` | `#0B6E62` | Primary actions, active tab, 6.1:1 on white |
| `accent-strong` | `#07544B` | Pressed state, links, net-cash card |
| `accent-soft` | `#E6F4F1` | Selected chips, teal tints |
| `success` | `#137A4B` | Money in, settled, WhatsApp, 5.4:1 on white |
| `success-soft` | `#E8F6EE` | Green tint |
| `warning` | `#A85A08` | Money due, requests, 5.1:1 on white |
| `warning-soft` | `#FFF3E3` | Amber tint |
| `danger` | `#C0392B` | Money out, overdue, destructive, 5.4:1 on white |
| `danger-soft` | `#FDECEB` | Red tint |
| `info` | `#2E5FA3` | Waiting, SMS, 6.4:1 on white |
| `info-soft` | `#EAF1FB` | Blue tint |

Rules:

- The page is plain white. Cards are white with a hairline border and a 1 px
  shadow. Depth comes from spacing, alignment, and a restrained semantic tint —
  not from a coloured page.
- Every semantic colour is at least 4.5:1 on white and on its own soft tint, so
  it can carry small text as well as an icon or a dot.
- Status color never carries meaning alone. Pair it with a word and an icon.
- Reserve red for money out, overdue, and destructive actions. Amber means an
  action is waiting; teal means the primary action or a net position.
- Do not tint large surfaces with status colours. Use a soft tint, a left rail,
  or a pill. The one exception is the deep teal net-cash card.

## Typography

The app uses one family: Inter when it is installed, otherwise the system UI
stack. No font is fetched at build or runtime. Regional scripts use their own
Noto family through the same stack.

| Role | Family | Weight | Size and line height |
|---|---|---|---|
| Page title | Sans | 700 | 24/32, tracking `-0.022em` |
| Section title | Sans | 700 | 18/24, tracking `-0.022em` |
| Body | Sans | 400 | 16/24, tracking `-0.006em` |
| Body strong | Sans | 600–700 | 14–16/20–24 |
| Small | Sans | 500 | 14/20 |
| Caption | Sans | 500 | 12/16 |
| Eyebrow / group label | Sans | 700 | 12/16, uppercase, tracking `0.08em` |
| Footer micro | Sans | 500 | 11/14, tracking `0.02em` |

Rules:

- All amounts use the `figure` utility: tabular digits, right alignment, and
  `font-feature-settings: "tnum"`.
- The `eyebrow` utility is the only uppercase label style: 12 px, weight 700,
  tracking `0.08em`. Labels are plain words, never one-word riddles. An eyebrow
  names its section; it does not decorate it.
- Use the shared scale (`text-caption`, `text-small`, `text-body`, `text-title`)
  instead of ad-hoc pixel sizes. This keeps baselines aligned across screens.
- Prefer 12 px over 10 px for captions. Never set body copy below 14 px.
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
| Design range | 320 px to 1440 px wide. Mobile first, desktop capable. |
| Storefront width | `max-width: 460px`, centered |
| Merchant app width | One column below 768 px. Left rail from 768 px, main plus a 360 px right column from 1200 px. |
| Workspace width | Same shell as the merchant app. Guest and owner share it. |
| Admin width | `max-width: 1200px` |
| Page gutter | 16 px below 768 px, 24 px from 768 px |
| Tap target | 44 px minimum, 48 px preferred, 8 px gap |
| Bottom tab bar | 64 px plus safe area, six items |
| Left rail | 200 px from 768 px, 240 px from 1200 px |
| Right column | 360 px from 1200 px, sticky, scrolls on its own |
| Sticky action | Sits above the tab bar, never overlaps it |
| Safe area | Respect `env(safe-area-inset-*)` on every fixed element |
| Primary reach | Primary actions sit in the lower third of the screen on mobile, in the first column on desktop |

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

Six tabs. The same six for every pack, guest or owner: Home, Orders, Customers,
Items, Expenses, Settings. The names and their translations live in
[merchant-language.md](merchant-language.md#tab-labels).

Rules:

- A tab label is one word. Never a metaphor.
- No tab is ever named Galla, Bikri, Khata, or Samaan.
- The active tab uses `accent` and weight 600.
- The bar never hides on scroll.
- Below 768 px the six items share one bottom bar. From 768 px they become a
  left rail; the bar is hidden.
- The workspace and the owner app use the same six tabs. A tab switch keeps the
  current data and never reloads the page.

## Visibility tiers

A new merchant sees three tabs, three numbers, and one button. The rest appears
when it is needed.

| Tier | When it appears | Examples |
|---|---|---|
| 0 | Always | Home, Sales, Customers, Add sale, Send bill |
| 1 | After the first item is published | Catalog tab, item images, options and extras |
| 2 | More → Advanced, on request | TDS, bank details, time precision, privacy mode, paper import |

Hidden is not removed. A search field in More finds an advanced setting by name.

## Components

The component inventory is written with each screen. The shared rules are:

- Use a bottom sheet on mobile, not a centered modal.
- Use skeletons that match the final layout. Do not use a generic shimmer block.
- A destructive action requires a confirm sheet that states the result, not "Are
  you sure?".
- A row that opens a sheet shows a chevron. A row that navigates shows a chevron
  plus a distinct press state.
- Never place two filled accent buttons in one view.
- Amount entry uses a keypad, never a plain input.
- A status pill always pairs a word with a color.
- An empty state is one sentence and one action. No illustration in v1.
- A toast sits above the tab bar for 3 seconds.

## Bill and message text

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
- Date format: `18-Nov-2026`. Never `11/18/2026` or `18 Nov 2026`. Storage and
  API keep ISO `2026-11-18`; only the label changes.
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

Every word on screen is owned by [merchant-language.md](merchant-language.md).
This document covers only the visual treatment of that copy.
