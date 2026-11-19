# Tech Stack

> Part of the StartLite docs. Start at [README](README.md).

- One TypeScript codebase serves every surface.
- The storefront is server-rendered and indexable.
- The merchant app is a PWA with no app store.

## Summary

| Layer | Choice |
|---|---|
| Language | TypeScript, strict mode, no `any` |
| Framework | Next.js 16, App Router, React 19 |
| Styling | Tailwind CSS 4, design tokens in OKLCH |
| Components | shadcn/ui on Radix primitives |
| Motion | Motion for springs, Vaul for sheets, Sonner for toasts |
| Data access | Drizzle ORM over `postgres.js` |
| Database | PostgreSQL 18 |
| Auth | Better Auth with email and password, plus email OTP |
| Validation | Zod, shared between client and server |
| Client cache | TanStack Query |
| Local workspace | `localStorage`, key `startlite_guest_v2` |
| i18n | next-intl, cookie locale |
| PWA | Serwist |
| Media | Local disk at `/srv/startlite/media`, `sharp` for variants |
| QR | `uqr` for the matrix. Draw it to SVG or canvas. |
| Bot check | Cloudflare Turnstile on the public order form |
| Web server | Traefik v3, already on the VPS |
| Runtime | Docker Compose on one VPS |
| Build and deploy | GitHub Actions, image in GHCR, pull on the VPS |
| Email | Resend |
| Monitoring | Sentry, Uptime Kuma, pino structured logs |

Reasons and rejected alternatives live in [decisions.md](decisions.md).
The proxy is Traefik ([ADR-008](decisions.md#adr-008-traefik-on-the-vps)).
Media lives on the VPS disk ([ADR-007](decisions.md#adr-007-local-media-on-the-vps)).

## Version policy

- Pin every dependency to an exact version in the lockfile.
- Upgrade in a branch, monthly. Run the full test gate before merge.
- Do not use a canary, alpha, or release-candidate dependency in production.
- Node.js 26 is the active LTS in November 2026. Node 24 is in maintenance.
- PostgreSQL 18 is the current stable. PostgreSQL 19 is not released yet.
- Drizzle 0.45.x is stable. Do not ship the 1.0 release candidate.
- Pin Traefik to an exact patch, for example `traefik:v3.7.19`.

| Component | Version | Note |
|---|---|---|
| Next.js | 16.4.6 or newer | 16.4.x carries a critical RSC fix |
| React | 19.3.1 or newer | 19.3.1 carries a critical RSC fix |
| Tailwind CSS | 4.3.x | |
| Drizzle ORM | 0.45.x | 1.0 is at rc.5 |
| PostgreSQL | 18.7 | Includes index corruption fixes |
| Node.js | 26.x | Active LTS since October 2026 |
| Traefik | 3.7.19 | 3.8 is at rc.3 |
| TypeScript | Current 5.x | Check `pnpm outdated` before each release |

Never pin a version lower than the one in this table. Security fixes land in patch
releases, and this table is the floor.

## Dependency rules

| Rule | Reason |
|---|---|
| One UI kit only | Two kits double the CSS and the inconsistencies. |
| No global state library | Server state is TanStack Query. Local state is `useState` or a URL param. |
| No second ORM or raw SQL builder | Drizzle is enough. Raw SQL is allowed for migrations and RLS tests. |
| No CSS-in-JS | Tailwind plus tokens covers it. |
| No date library beyond `Intl` and `date-fns` | Keeps the bundle small. |
| No client-side money arithmetic on a server total | The server computes every stored total with `decimal.js`. A local workspace or cart may preview a total in integer paise. |
| No third-party QR image service | The matrix comes from `uqr` and stays local. |
| No `dangerouslySetInnerHTML` | Prevents an injection class of bugs. |

## Repository layout

```
startlite/
├── app/
│   ├── page.tsx                      # / guest workspace
│   ├── login/                        # sign in and sign up
│   ├── onboarding/                   # shop setup after signup
│   ├── b/[handle]/                   # public storefront
│   ├── o/[code]/                     # pending order link
│   ├── app/                          # merchant app
│   │   ├── page.tsx                  # Home
│   │   ├── sales/                    # Sales
│   │   ├── customers/                # Customers
│   │   ├── catalog/                  # Menu, Items, or Services
│   │   └── more/                     # expenses, cash, settings
│   ├── media/[...path]/              # local media files
│   └── api/
│       ├── auth/[...all]/            # Better Auth
│       └── v1/                       # versioned REST
├── components/
│   ├── guest/                        # signed-out workspace
│   ├── LoginForm.tsx
│   ├── OnboardingWizard.tsx
│   ├── GuestImport.tsx               # phone data to shop
│   └── ui.tsx                        # shared primitives
├── db/
│   ├── schema.ts                     # Drizzle tables
│   └── seed.ts
├── lib/
│   ├── env.ts                        # the only process.env reader
│   ├── guest-store.ts                # phone state and paise math
│   ├── guest-import.ts               # server import, retotals
│   ├── money.ts                      # decimal.js helpers
│   ├── paise.ts                      # integer paise helpers
│   ├── pending.ts                    # code, snapshot, pricing
│   ├── bill.ts                       # text bill compiler
│   ├── qr.ts                         # UPI payload and QR matrix
│   └── storage.ts                    # local media driver
├── docs/                             # this folder
└── tests/                            # unit and integration tests
```

## Local development

Prerequisites: Node.js 24 or newer, Corepack, and Docker.

```bash
corepack pnpm install
cp .env.example .env.local          # fill the empty secrets
docker start startlite-db           # local Postgres on port 5433
corepack pnpm db:push
corepack pnpm db:seed
corepack pnpm dev
```

The full walkthrough is in [local-development.md](local-development.md).

| Command | Action |
|---|---|
| `corepack pnpm dev` | Start the app on `http://localhost:3000` |
| `corepack pnpm typecheck` | `tsc --noEmit` |
| `corepack pnpm test` | Vitest unit tests |
| `corepack pnpm build` | Production build |
| `corepack pnpm db:push` | Push the schema to the local database |
| `corepack pnpm db:seed` | Create the demo merchant and shop |

## Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Session signing key |
| `BETTER_AUTH_URL` | Auth callback origin |
| `NEXT_PUBLIC_APP_URL` | Canonical origin |
| `TRUSTED_ORIGINS` | Comma-separated origins allowed to call auth |
| `IP_HASH_SECRET` | Salt for hashing buyer IP addresses |
| `MEDIA_ROOT` | Folder for uploaded images |
| `SEED_EMAIL`, `SEED_PASSWORD`, `SEED_NAME` | Local demo account for `db:seed` |
| `RESEND_API_KEY`, `MAIL_FROM` | Transactional email |
| `TURNSTILE_SECRET_KEY` | Server check for the order form |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser widget for the order form |
| `CRON_SECRET` | Authenticates the cleanup job |
| `SENTRY_DSN` | Error reporting |

Never read `process.env` outside `lib/env.ts`. That file validates the
environment at boot. `.env.local` is git-ignored. `.env.example` holds names and
empty secrets only.
