# Local development

> Part of the StartLite docs. Start at [README](README.md).

- The app runs on a laptop with one Docker Postgres container.
- Opening `/` enters the workspace. No account is needed to use it.
- The demo data is seeded. No external service is required.
- Media stays in a local folder. No bucket and no CDN.

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 24 or newer | `node --version` |
| pnpm | 10, through Corepack | `corepack pnpm --version` |
| Docker | Any recent version | `docker --version` |

Use `corepack pnpm` for every command. pnpm is not installed globally.

## First run

1. Install dependencies.

   ```bash
   corepack pnpm install
   ```

2. Create the environment file.

   ```bash
   cp .env.example .env.local
   ```

   Fill `BETTER_AUTH_SECRET`, `IP_HASH_SECRET`, and `SEED_PASSWORD`. Generate a
   secret with:

   ```bash
   openssl rand -base64 48
   ```

   Keep the other values as they are for local work. `.env.local` is ignored by
   Git and is the only file that holds real secrets.

3. Start Postgres.

   ```bash
   docker run -d --name startlite-db \
     -e POSTGRES_PASSWORD=startlite \
     -e POSTGRES_DB=startlite \
     -p 5433:5432 \
     -v startlite-db-data:/var/lib/postgresql/data \
     postgres:18
   ```

   The connection string in `.env.local` expects port `5433`. The container
   name is `startlite-db`.

4. Create the tables and load the demo data.

   ```bash
   corepack pnpm db:push
   corepack pnpm db:seed
   corepack pnpm db:seed:dev
   ```

   `db:seed` makes one demo shop. `db:seed:dev` makes 24 shops across all 12
   packs. The accounts and the wipe commands live in
   [dev-accounts.md](dev-accounts.md).

5. Start the app.

   ```bash
   corepack pnpm dev
   ```

6. Open `http://localhost:3000`.

## Demo login

The seed reads `SEED_EMAIL`, `SEED_PASSWORD`, and `SEED_NAME` from `.env.local`. It
prints neither the email nor the password.

| Field | Where to look |
|---|---|
| Email | `SEED_EMAIL` in `.env.local` (default `anita@example.com`) |
| Password | `SEED_PASSWORD` in `.env.local` |
| Storefront | `http://localhost:3000/b/anitas-bakes` |

The seed makes one shop, three catalog items, two customers, two orders, and two
expenses. It reads the password from the environment, so no secret sits in the
repository.

### Development accounts

`db:seed:dev` creates 24 additional accounts, one or two for each category pack.
Every account uses the same local password. The full table, the seeded data, and
the empty-database flow live in [dev-accounts.md](dev-accounts.md).

## Try the workspace

`/` is the product. Use this path to test the frictionless flow.

1. Open `http://localhost:3000` in a private window. You are signed out.
2. Add a sale, log a payment, add an expense, and copy a bill.
3. Reload the page. The work is still there.
4. Tap **Save my shop**. Sign up, then finish onboarding.
5. After onboarding, open `/app`. The phone work is imported and the success line
   shows once.

The local copy lives under the `startlite_guest_v2` key. To start over without a
signup, open More → **Start fresh on this phone**, or clear site data in the
browser. Imported data is not affected.

A failed import keeps the phone copy and shows a retry action. The shop itself is
still usable.

## Everyday commands

| Command | Action |
|---|---|
| `corepack pnpm dev` | Start the development server |
| `corepack pnpm typecheck` | Type check |
| `corepack pnpm test` | Run unit tests |
| `corepack pnpm build` | Production build |
| `corepack pnpm db:push` | Apply the schema to the database |
| `corepack pnpm db:seed` | Reset the demo shop and its data |
| `corepack pnpm db:seed:dev` | Create or refresh the 24 development shops |
| `corepack pnpm db:wipe:dev` | Delete every row, for an empty database |
| `corepack pnpm db:reset:dev` | Wipe, then seed the 24 development shops |

## Main routes

The route list and the surface each route serves live in
[product.md](product.md#surfaces). The folder that renders each one lives in
[tech-stack.md](tech-stack.md#repository-layout).

## Test guest import

The import endpoint takes a signed-in merchant with a shop. A quick check without
a browser:

1. Sign up through `/login?mode=signup`.
2. Finish `/onboarding`.
3. Send a payload to `/api/v1/merchant/import` with the session cookie.
4. Send the same payload again. The response reports `skippedOrders`.
5. Compare `orders.grand_total` and `orders.paid_total` with your input. The server
   recomputes both.

The totals use `decimal.js`, so a line of `0.5 × 140.00` is `70.00`, not a float.

## Reset the database

To empty every table and keep the schema:

```bash
corepack pnpm db:wipe:dev
```

To empty every table and then create the 24 development shops:

```bash
corepack pnpm db:reset:dev
```

Both commands refuse to run in production or against a non-local database. The
accounts and the full test flow live in [dev-accounts.md](dev-accounts.md).

To reset only the demo data, run `corepack pnpm db:seed`. It deletes the
`anitas-bakes` shop and rebuilds it. To reset only the 24 development shops, run
`corepack pnpm db:seed:dev`.

To destroy the container itself, stop it and remove its volume:

```bash
docker stop startlite-db
docker rm startlite-db
docker volume rm startlite-db-data
```

Then repeat steps 3 and 4.

## Media

Uploaded photos are written to `MEDIA_ROOT`. The default in `.env.local` is
`./.data/media`, which is ignored by Git. The app serves them from
`/media/{key}`. No separate media server runs locally.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ECONNREFUSED 5433` | Start the container with `docker start startlite-db` |
| Login says the account is missing | Run `corepack pnpm db:seed` or `corepack pnpm db:seed:dev` again |
| Port 3000 is busy | Stop the other process, or run `corepack pnpm dev -- -p 3001` |
| Schema out of date | Run `corepack pnpm db:push` |
| Build warns about `output: standalone` | Use `corepack pnpm dev`. For a production run, use `node .next/standalone/server.js`. |
