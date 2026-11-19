# StartLite

> Part of the StartLite docs. Start here.

- StartLite is a WhatsApp storefront and a cash-flow ledger.
- The app works before login. Login saves and syncs.
- A buyer orders without an account.
- StartLite never holds buyer money.

A merchant opens `/` and starts working: catalog, sales, payments, customers,
expenses, cash left, and a bill. An account adds a store link, sync, and a safe
copy. A buyer sends an order through WhatsApp. The merchant accepts it, logs
payments, and sends a bill. StartLite stores no buyer photos.

**Status:** v1 in progress. **Last updated:** 2026-11-19.

## Document map

| Document | Answers | Read when |
|---|---|---|
| [product.md](product.md) | Who it serves, what it charges, what it must never do | Deciding whether a feature belongs |
| [category-packs.md](category-packs.md) | Defaults for 100+ categories | Onboarding a merchant |
| [merchant-language.md](merchant-language.md) | The words on screen, per pack and per locale | Writing any label or message |
| [tech-stack.md](tech-stack.md) | What we build with, and the repository layout | Setting up or adding a dependency |
| [architecture.md](architecture.md) | How the parts fit, how a request flows, the API contract | Building a route, a flow, or an integration |
| [data-model.md](data-model.md) | Tables, money rules, isolation, order states | Writing a migration or a query |
| [design-system.md](design-system.md) | Tokens, type, components, motion, canvas output | Building any screen |
| [operations.md](operations.md) | Deploy, backups, monitoring, runbook, cost | Running production |
| [economics.md](economics.md) | Unit economics, break-even, growth math | Setting price or planning capacity |
| [roadmap.md](roadmap.md) | Phases, exit criteria, test gates, risks | Planning the next unit of work |
| [decisions.md](decisions.md) | Why each choice was made, and what it replaced | Changing a decision |
| [local-development.md](local-development.md) | Run the app, seed data, test the workspace | Starting work on the code |

## Reading order

1. New to the project: [product](product.md) → [category packs](category-packs.md) → [architecture](architecture.md) → [data-model](data-model.md) → [design-system](design-system.md).
2. About to write code: [roadmap](roadmap.md) → [data-model](data-model.md) → [architecture](architecture.md).
3. About to write copy: [merchant-language](merchant-language.md) → [design-system](design-system.md#content-and-tone).
4. About to deploy: [operations](operations.md).
5. About to change a decision: [decisions](decisions.md) first.
6. Setting up a laptop: [local-development](local-development.md).

## Glossary

| Term | Meaning |
|---|---|
| **Bahi-khata** | A running cash ledger. In StartLite it is the Home and Customers view. |
| **Pack** | A bundle of defaults for a group of categories. |
| **Handle** | The public URL slug for a store, for example `anitas-bakes`. |
| **Pass** | The paid quarterly subscription that keeps the storefront live. |
| **Primitive** | One reusable product capability. |
| **Option** | A first-level choice that sets the price, for example `1 kg`. The schema calls it `item_option`. |
| **Extra** | A second-level choice that adds a price delta, for example `Eggless +₹100`. The schema calls it `item_extra`. |
| **Open tab** | An order that is still running and can accept more items. |
| **Pending order** | A saved order that waits for the merchant to accept it. It expires in 7 days. |
| **Short link** | The `/o/{code}` link that opens one pending order. |
| **Bill** | The message or image that lists items, totals, paid, and due. |
| **Deposit** | A refundable amount on a bill. It is excluded from revenue. |
| **Reimbursement** | A pass-through expense on a bill. It is excluded from revenue. |
| **TDS** | Tax deducted at source by a business client. It settles part of a bill. |
| **Cash left** | Money received minus expenses. It is not accounting profit. |
| **Workspace** | The signed-out app at `/`. It runs on the phone with no account. |
| **Saved on this phone** | The state of a workspace record. It is not on the server yet. |
| **Paise** | One hundredth of a rupee. The workspace computes money in integer paise. |
| **RLS** | Postgres row-level security. It isolates shops in the database. |

## Rules

1. One fact lives in one document. Link to it. Do not copy it.
2. Record a decision in [decisions.md](decisions.md) before you change behavior.
3. [product.md](product.md) defines what not to build. Treat its guardrails as hard limits.
4. A change that alters behavior updates a document in the same pull request.
5. Keep sentences short. Use 15 words in docs and 12 in the interface.

## Hard limits

The never-build list and the v1 scope boundary live in
[product.md](product.md#guardrails). Read them before you add a feature.
The simplicity budget lives in [product.md](product.md#simplicity-budget).

## Conventions

| Item | Rule |
|---|---|
| Money | INR. `NUMERIC(10,2)` in Postgres. `decimal.js` on the server. Integer paise in a local preview. Never a JavaScript float. |
| IDs | UUIDv7, generated on the server. |
| Time | UTC in the database. IST in the interface. |
| Money display | Indian digit grouping, for example `₹1,11,000.00`. |
| Locale codes | BCP 47, for example `hi`, `hi-Latn`, `ta`. |
| Links | Relative paths inside this folder. |
| Headings | One `H1` per file. Do not skip a level. |
