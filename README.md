# StartLite

WhatsApp storefront and cash-flow ledger for Indian micro-businesses.

**Status:** v1 in progress. **Documentation:** [docs/README.md](docs/README.md).

Open `http://localhost:3000` to use the app. It works before login. An account adds
a store link, sync, and a safe copy.

## Quick reference

Use `corepack pnpm`. pnpm is not installed globally.

| Command | Action |
|---|---|
| `corepack pnpm dev` | Start the app on port 3000 |
| `corepack pnpm build` | Production build |
| `corepack pnpm test` | Unit tests |
| `corepack pnpm typecheck` | Type check |
| `corepack pnpm db:push` | Apply the schema to the local database |
| `corepack pnpm db:seed` | Create the demo merchant and shop |

Setup steps are in [docs/local-development.md](docs/local-development.md).

## Where to look

| Topic | Document |
|---|---|
| Product, pricing, guardrails | [docs/product.md](docs/product.md) |
| Category defaults | [docs/category-packs.md](docs/category-packs.md) |
| Words on screen | [docs/merchant-language.md](docs/merchant-language.md) |
| Stack and repository layout | [docs/tech-stack.md](docs/tech-stack.md) |
| Architecture, flows, API | [docs/architecture.md](docs/architecture.md) |
| Schema, money, tenancy | [docs/data-model.md](docs/data-model.md) |
| Visual system and components | [docs/design-system.md](docs/design-system.md) |
| Deploy and runbook | [docs/operations.md](docs/operations.md) |
| Unit economics and break-even | [docs/economics.md](docs/economics.md) |
| Phases and test gates | [docs/roadmap.md](docs/roadmap.md) |
| Decision log | [docs/decisions.md](docs/decisions.md) |
| Local setup and workspace test | [docs/local-development.md](docs/local-development.md) |

## Rules

1. One fact lives in one document. Link to it.
2. A behavior change updates its document in the same pull request.
3. Read [the guardrails](docs/product.md#guardrails) before adding a feature.
4. Record a decision in [docs/decisions.md](docs/decisions.md) before changing behavior.

The original specification is archived at [docs/archive/startlite_ai_coding_agent_specification.md](docs/archive/startlite_ai_coding_agent_specification.md). It is history, not a source of truth.
