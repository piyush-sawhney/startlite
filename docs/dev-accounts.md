# Development accounts and seed data

> Part of the StartLite docs. Start at [README](README.md).

This page is for local development only. `db:seed:dev` creates 24 shops, one for
each of the 12 category packs. Every shop has its own login, customers, items,
orders, payments, expenses, and one storefront request.

The seed is guarded. It refuses to run when `NODE_ENV=production`, and it
refuses a non-local database unless `ALLOW_REMOTE_DEV_DB=1` is set. Never set
that flag for a database that holds real work.

## Commands

| Command | Action |
|---|---|
| `corepack pnpm db:push` | Create or update the tables |
| `corepack pnpm db:seed:dev` | Create or refresh the 24 development accounts and shops |
| `corepack pnpm db:wipe:dev` | Delete every row and leave an empty database |
| `corepack pnpm db:reset:dev` | Wipe, then seed the 24 accounts |

`db:seed:dev` deletes and recreates only the 24 `@startlite.dev` accounts and
their shops. Other local accounts stay. `db:wipe:dev` deletes everything,
including the single `db:seed` demo shop.

## Sign in

Open `/login`, enter one email from the table, and use the shared password.

**Password for every account:** `StartLite!Dev2026`

Set `DEV_SEED_PASSWORD` in `.env.local` before the first seed to use a different
password. Use at least 8 characters. Change it only in local development.

## Accounts

| Pack | Business | Handle | Email |
|---|---|---|---|
| Food and tiffin | Tiffin Express | `tiffin-express` | `food1@startlite.dev` |
| Food and tiffin | Annapurna Kitchen | `annapurna-kitchen` | `food2@startlite.dev` |
| Bakery and cakes | Sugar & Spice Bakes | `sugar-and-spice` | `bakery1@startlite.dev` |
| Bakery and cakes | Daily Bread Co. | `daily-bread-co` | `bakery2@startlite.dev` |
| Grocery | Sharma Kirana Store | `sharma-kirana` | `grocery1@startlite.dev` |
| Grocery | Green Basket | `green-basket` | `grocery2@startlite.dev` |
| Tailoring | Stitch & Style | `stitch-and-style` | `tailoring1@startlite.dev` |
| Tailoring | Perfect Fit Tailors | `perfect-fit-tailors` | `tailoring2@startlite.dev` |
| Beauty and salon | Glow Salon | `glow-salon` | `salon1@startlite.dev` |
| Beauty and salon | Cut & Curl | `cut-and-curl` | `salon2@startlite.dev` |
| Tutoring | Bright Minds Tuition | `bright-minds-tuition` | `tutoring1@startlite.dev` |
| Tutoring | Maths with Meera | `maths-with-meera` | `tutoring2@startlite.dev` |
| Repairs | QuickFix Repairs | `quickfix-repairs` | `repairs1@startlite.dev` |
| Repairs | Phone Doctor | `phone-doctor` | `repairs2@startlite.dev` |
| Rentals and events | Event Rentals | `event-rentals` | `rentals1@startlite.dev` |
| Rentals and events | Party Needs | `party-needs` | `rentals2@startlite.dev` |
| Freelance | Design Desk | `design-desk` | `freelance1@startlite.dev` |
| Freelance | Content Corner | `content-corner` | `freelance2@startlite.dev` |
| Home services | Sparkle Home Services | `sparkle-home-services` | `home1@startlite.dev` |
| Home services | Handy Help | `handy-help` | `home2@startlite.dev` |
| Health and wellness | Calm Yoga Studio | `calm-yoga` | `wellness1@startlite.dev` |
| Health and wellness | Fit with Priya | `fit-with-priya` | `wellness2@startlite.dev` |
| Pets and other | Paws & Care | `paws-and-care` | `pets1@startlite.dev` |
| Pets and other | Pet Pantry | `pet-pantry` | `pets2@startlite.dev` |

Each business has a storefront at `/b/<handle>`, for example
`http://localhost:3000/b/tiffin-express`.

## What each shop contains

| Data | Count | Purpose |
|---|---|---|
| Items | 4 | Three pack starters plus one item for the trade |
| Variants | 2 items | The first and the custom item have two options |
| Extra | 1 | On the first item, for example Eggless or Home delivery |
| Customers | 5 | One has no phone, to test the no-phone identity rule |
| Orders | 7 | 2 completed, 2 ready, 1 accepted, 1 waiting for client, 1 cancelled |
| Payments | 4 | Full, 30% advance, 40% advance, full |
| Expenses | 4 | Today, yesterday, 3 days ago, 10 days ago |
| Requests | 1 | A pending storefront request for today |

The order mix fills every Home zone:

- **Ready to collect** has two orders, one from today and one older.
- **To finish** has a waiting-for-client order and an accepted order.
- **Day view** has two orders today with time slots.
- **Customer dues** has four customers with a balance.
- **Requests** has one pending request.
- The cancelled order stays hidden.

Each pack uses its own words for variants:

| Pack | Variants | Extra |
|---|---|---|
| Food and tiffin | Half / Full | Extra roti |
| Bakery and cakes | 500 g / 1 kg | Eggless |
| Grocery | 500 g / 1 kg | Home delivery |
| Tailoring | Standard / Express | Home pickup |
| Beauty and salon | Basic / Premium | Head massage |
| Tutoring | Group / One to one | Study material |
| Repairs | Standard / Same day | Pickup and drop |
| Rentals and events | Half day / Full day | Delivery and setup |
| Freelance | Basic / Standard | Extra revision |
| Home services | Standard / Deep | Consumables |
| Health and wellness | Single / Pack of 4 | Diet chart |
| Pets and other | Small / Large | Nail trim |

## Test an empty database

1. Run `corepack pnpm db:wipe:dev`.
2. Open `/`. The workspace starts with no local work.
3. Add a sale or an expense. Reload. The work is still there.
4. Open `/login?mode=signup` and create a new account.
5. Finish `/onboarding`. `/app` shows the new shop with no orders.

Use this state to test first-run copy, empty lists, and onboarding.

## Test a full database

1. Run `corepack pnpm db:seed:dev`.
2. Open `/login` and sign in as `food1@startlite.dev` with
   `StartLite!Dev2026`.
3. Open `/app`. Home shows a request, ready orders, in-progress orders, today's
   day view, metrics, and customer dues.
4. Sign in as a shop from another pack, for example `pets2@startlite.dev`.
   The item names and units change with the pack.

Use this state to test every list, bill, payment, and status transition.

## Reset both states

`corepack pnpm db:reset:dev` wipes the database and seeds the 24 accounts in one
step. Use it after a schema change or a broken test run.

The seed is safe to run again without wiping. It removes its own 24 accounts and
rebuilds them, so the credentials above always work.
