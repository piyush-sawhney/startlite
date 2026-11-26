# StartLite

> Part of the StartLite docs. Start here.

StartLite is a WhatsApp storefront and a cash-flow ledger for Indian
micro-businesses. The app works before login. Login saves and syncs. A buyer
orders without an account. StartLite never holds buyer money.

**Status:** v1 in progress. **Last updated:** 2026-11-26.

## Document map

| Document | Answers | Read when |
|---|---|---|
| [product.md](product.md) | Who it serves, what it must never do, the v1 requirements | Deciding whether a feature belongs |
| [business-catalog.md](business-catalog.md) | 16 categories, 48 businesses, their items and the flows each item takes | Choosing starter items, testing inference, mapping a new trade |
| [category-packs.md](category-packs.md) | Defaults for 100+ categories | Onboarding a merchant |
| [50-micro-businesses.md](50-micro-businesses.md) | Customer profile and daily pain for 50 real shops | Designing flows and copy |
| [merchant-language.md](merchant-language.md) | The words on screen, per pack and per locale | Writing any label or message |
| [tech-stack.md](tech-stack.md) | What we build with, the repository layout, environment variables | Adding a dependency or a file |
| [architecture.md](architecture.md) | How the parts fit, how a request flows, the API contract | Building a route, a flow, or an integration |
| [data-model.md](data-model.md) | Tables, money rules, isolation, order states | Writing a migration or a query |
| [design-system.md](design-system.md) | Tokens, type, motion, shared component rules, bill and canvas output | Building a screen |
| [local-development.md](local-development.md) | Run the app, seed data, test the workspace | Starting work on the code |
| [dev-accounts.md](dev-accounts.md) | 24 local accounts, seeded shops, wipe and reset commands | Testing empty and full local data |
| [operations.md](operations.md) | Deploy, backups, monitoring, runbook | Running production |
| [roadmap.md](roadmap.md) | Phases, exit criteria, test gates, risks | Planning the next unit of work |
| [decisions.md](decisions.md) | Why each choice was made, and what it replaced | Changing a decision |
| [screens/README.md](screens/README.md) | Screen specifications, shell, breakpoints, and states | Designing or implementing UI screens |

Screen specifications live in [screens/](screens/README.md):
[home](screens/home.md), [orders](screens/orders.md),
[customers](screens/customers.md), and [expenses](screens/expenses.md).

## Reading order

1. New to the project: [product](product.md) → [business catalog](business-catalog.md) → [architecture](architecture.md) → [data-model](data-model.md).
2. About to write code: [roadmap](roadmap.md) → [data-model](data-model.md) → [architecture](architecture.md).
3. About to write copy: [merchant-language](merchant-language.md).
4. About to deploy: [operations](operations.md).
5. Setting up a laptop: [local-development](local-development.md).
6. About to change a decision: [decisions](decisions.md) first.
7. Testing empty and full local data: [dev-accounts](dev-accounts.md).

## Glossary

These words appear in more than one document. Every other term is defined in the
document that owns it.

| Term | Meaning |
|---|---|
| **Pack** | A bundle of defaults for a group of categories. |
| **Handle** | The public URL slug for a store, for example `anitas-bakes`. |
| **Pass** | The 90-day access period that keeps the storefront live. |
| **Primitive** | One reusable product capability. |
| **Workspace** | The signed-out app at `/`. It runs on the phone with no account. |

## Rules

1. One fact lives in one document. Link to it. Do not copy it.
2. Record a decision in [decisions.md](decisions.md) before you change behavior.
3. [product.md](product.md) defines what not to build. Treat its guardrails as hard limits.
4. A change that alters behavior updates a document in the same pull request.
5. Keep sentences short. Use 15 words in docs and 12 in the interface.

## Conventions

| Item | Rule |
|---|---|
| Money | Defined in [data-model.md](data-model.md#money). Never a JavaScript float. |
| Time | Defined in [data-model.md](data-model.md#requested-time). |
| IDs | UUIDv7, generated on the server. |
| Locale codes | BCP 47, for example `hi`, `hi-Latn`, `ta`. |
| Links | Relative paths inside this folder. |
| Headings | One `H1` per file. Do not skip a level. |
