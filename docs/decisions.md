# Decision Log

> Part of the StartLite docs. Start at [README](README.md).

- One decision per entry. Never rewrite an old entry.
- A replaced decision points forward to its replacement.
- A decision that changes behavior updates the owning document.

## How to use

1. Read the relevant decision before you change behavior.
2. Add a new decision with the next number.
3. Mark a replaced decision as `Superseded by ADR-0xx` and link forward.
4. A decision that changes the schema, the API, or a guardrail also updates the
   owning document.

Status values: `Accepted`, `Superseded`, `Deferred`.

## Index

| ID | Decision | Status |
|---|---|---|
| [ADR-001](#adr-001-nextjs-app-router) | Next.js App Router for all surfaces | Accepted |
| [ADR-002](#adr-002-postgres-row-level-security) | Postgres RLS for tenant isolation | Accepted |
| [ADR-003](#adr-003-no-field-level-encryption-in-v1) | No field-level encryption in v1 | Accepted |
| [ADR-004](#adr-004-no-offline-write-queue) | No offline write queue | Accepted |
| [ADR-005](#adr-005-quarterly-pricing-and-90-day-trial) | ₹130.98 per quarter, 90-day trial | Accepted |
| [ADR-006](#adr-006-manual-pass-activation-in-v1) | Manual pass activation in v1 | Accepted |
| [ADR-007](#adr-007-local-media-on-the-vps) | Local media on the VPS | Accepted |
| [ADR-008](#adr-008-traefik-on-the-vps) | Traefik on the VPS | Accepted |
| [ADR-009](#adr-009-locale-strategy) | Cookie locale, 24 supported, 6 live | Accepted |
| [ADR-010](#adr-010-pwa-only-no-app-stores) | PWA only, no app stores | Accepted |
| [ADR-011](#adr-011-calm-and-premium-visual-system) | Calm and premium visual system | Accepted |
| [ADR-012](#adr-012-ci-builds-the-vps-only-runs) | CI builds, the VPS only runs | Accepted |
| [ADR-013](#adr-013-rest-route-handlers-instead-of-server-actions) | REST route handlers instead of Server Actions | Accepted |
| [ADR-014](#adr-014-path-based-storefront-urls) | Path-based storefront URLs | Accepted |
| [ADR-015](#adr-015-single-owner-per-business) | Single owner per business | Accepted |
| [ADR-016](#adr-016-ai-translations-ship-as-beta) | AI translations ship as beta | Accepted |
| [ADR-017](#adr-017-numeric-money-with-decimaljs) | NUMERIC money with decimal.js | Accepted |
| [ADR-018](#adr-018-better-auth-for-sessions) | Better Auth for sessions | Accepted |
| [ADR-019](#adr-019-server-side-pending-order-with-a-short-link) | Server-side pending order with a short link | Accepted |
| [ADR-020](#adr-020-functional-tab-labels) | Functional tab labels | Accepted |
| [ADR-021](#adr-021-qr-on-the-bill-only) | QR on the bill only | Accepted |
| [ADR-022](#adr-022-text-bill-by-default) | Text bill by default | Accepted |
| [ADR-023](#adr-023-cash-left-is-not-profit) | Cash left is not profit | Accepted |
| [ADR-024](#adr-024-email-otp-at-three-moments-only) | Email OTP at three moments only | Accepted |
| [ADR-025](#adr-025-checkout-asks-for-two-fields) | Checkout asks for two fields | Accepted |
| [ADR-026](#adr-026-paper-migration-through-opening-dues) | Paper migration through opening dues | Accepted |
| [ADR-027](#adr-027-two-tier-options-in-v1) | Two-tier options in v1 | Accepted |
| [ADR-028](#adr-028-billing-automation-waits-for-500-merchants) | Billing automation waits for 500 merchants | Accepted |
| [ADR-029](#adr-029-guest-workspace-before-login) | Guest workspace before login | Accepted |

## ADR-001: Next.js App Router

**Context:** One product needs an indexable storefront, an app-like merchant
interface, and a versioned API. The original specification proposed a Vite
single-page app with FastAPI.

**Decision:** Use Next.js 16 with the App Router, React 19, and TypeScript strict
mode. Server components render the storefront. Client islands render the merchant
app. Route handlers serve the API.

**Consequences:**

- The storefront is server-rendered and indexable without a second frontend.
- The merchant app gets prefetching, optimistic updates, and the React ecosystem.
- Initial JavaScript is larger than server-rendered HTML alone. The budget is
  100 KB for the storefront and 200 KB for the merchant shell.
- Builds need memory. They run in CI, not on the 4 GB VPS.

**Supersedes:** The stack section of the archived specification.

## ADR-002: Postgres row-level security

**Context:** Tenant data must not leak between shops. Application filters are easy
to forget.

**Decision:** Enforce isolation in Postgres with `ENABLE` and `FORCE ROW LEVEL
SECURITY` on every tenant table. The app connects as a non-superuser role. Each
transaction sets `app.current_business_id`.

**Consequences:**

- A missed `WHERE` clause cannot cross tenants.
- Every query runs inside the tenant wrapper. Raw SQL without it returns zero rows.
- The admin uses a separate role with `BYPASSRLS` and writes an audit row.
- Integration tests must prove isolation on every table.

## ADR-003: No field-level encryption in v1

**Context:** The archived specification required MultiFernet column encryption and
HMAC blind indexes for names, phones, and addresses.

**Decision:** Use RLS, LUKS disk encryption, TLS, no public database port, and log
redaction. Store PII as plaintext columns.

**Consequences:**

- Less operational work and no key rotation.
- A database dump exposes PII. A host compromise exposes PII.
- Searching and deduplicating by phone is simple.
- Revisit before 1,000 paying merchants. The migration path is a new encrypted
  column plus a backfill.

## ADR-004: No offline write queue

**Context:** The archived specification required an IndexedDB mutation queue with
background sync.

**Decision:** The app is an installable PWA that requires a connection for writes.
Reads use a short cache. Mutations are optimistic and roll back on failure.

**Consequences:**

- No conflict resolution, no sync state machine, no duplicate-write bugs.
- A merchant without signal cannot log a sale. The app states this clearly.
- The app refetches on focus, so devices converge within seconds after a write.

This rule covers server writes. The signed-out workspace is local-only and is
specified in [ADR-029](#adr-029-guest-workspace-before-login). It does not queue a
server write.

## ADR-005: Quarterly pricing and 90-day trial

**Context:** The archived specification used a 14-day trial and ₹101 per year.

**Decision:** A 90-day trial. Then ₹111 plus 18% GST, which is ₹130.98 per
quarter, prepaid for 90 days. StartLite is GST-registered and invoices with GSTIN
and SAC 998314.

**Consequences:**

- The trial is long enough for a merchant to form a habit.
- Quarterly collection means four touch points per year.
- Amounts are stored as `130.98` and shown with Indian digit grouping.
- An expired pass pauses the storefront. Login and export stay available.

## ADR-006: Manual pass activation in v1

**Context:** Razorpay integration needs KYC, webhooks, and reconciliation. The
first cohort is small.

**Decision:** Activate passes from `/admin` after a manual UPI or bank transfer.
Record the reference in `subscription_payments` and `audit_log`.

**Consequences:**

- No payment gateway in v1.
- Every activation is a manual action. This is acceptable below 500 shops.
- Automated billing arrives in v2 with Razorpay. See
  [ADR-028](#adr-028-billing-automation-waits-for-500-merchants).

## ADR-007: Local media on the VPS

**Context:** Merchants need a logo and one image per item. The earlier plan ran
MinIO Community Edition on the VPS. That edition is archived and receives no
security fixes, so the plan was withdrawn before it was deployed. The owner wants
media on the VPS for now, because the volume is small and the VPS is already
paid for.

**Decision:** Store media on a mounted volume at `/srv/startlite/media`. Serve it
from the app at `/media/{key}` and let Cloudflare cache it. Use immutable keys and
no object store.

**Consequences:**

- No bucket, no access keys, and no extra service to patch.
- The disk is the limit. At 10,000 shops the volume is about 25 GB. Alert at 70%
  and plan a move at 40 GB.
- The media folder is part of the nightly backup. A backup that skips it is
  incomplete.
- A second app instance needs a shared volume or a move to object storage.
- A delete is real. Recovery comes from the backup, not from a version history.
- One `storage.ts` interface hides the path. An S3 driver can be added later
  without touching the catalog code.

**Alternatives rejected:** Cloudflare R2 would remove disk work, but it adds a
provider and a key to manage for a 25 GB corpus. Garage and SeaweedFS add a
service and a disk for the same result. Revisit either when media passes 40 GB or
a second app instance exists.

## ADR-008: Traefik on the VPS

**Context:** The VPS already runs Traefik for other services. A second proxy would
duplicate ports, certificates, and routing rules.

**Decision:** Use the existing Traefik v3.7 as the only reverse proxy. StartLite
joins its Docker network and adds router labels. TLS between Cloudflare and
Traefik uses a Cloudflare Origin Certificate. No ACME runs on the VPS.

**Consequences:**

- One proxy, one place to read routing.
- Origin certificates are long lived, so renewal is rare.
- Port 443 accepts only Cloudflare ranges.
- A Traefik upgrade affects every app on the VPS, so pin the version and upgrade
  in a window.
- Configuration lives in Docker labels, not a separate proxy file.

## ADR-009: Locale strategy

**Context:** The product must support the 22 scheduled languages plus English and
Hinglish. Locale URL prefixes would multiply storefront URLs and hurt SEO at
10,000 shops.

**Decision:** Support 24 locale codes. Keep locale in a cookie. Load messages on
the server so only the active locale reaches the client. Ship six locales live and
eighteen as beta.

**Consequences:**

- 10,000 shops stay at 10,000 indexable URLs.
- No `hreflang`. Set `<html lang>` and `dir` per request.
- Load fonts per script, never all scripts.
- Beta locales carry a label and a report link.

## ADR-010: PWA only, no app stores

**Context:** A native wrapper would cost two store reviews, an Apple developer
account, and a second release process. Web push and haptics on iOS remain limited.

**Decision:** Ship an installable PWA and a browser app. Do not plan a native
shell.

**Consequences:**

- One deployment, instant updates, no store review.
- iPhone merchants get add-to-homescreen without haptics or full push.
- The REST API stays available if this decision changes.

## ADR-011: Calm and premium visual system

**Context:** The owner referenced Zepto, Swiggy, and WhatsApp for feel, then chose
a calm and premium personality.

**Decision:** Warm neutral canvas, deep teal accent, one accent hue, generous
spacing, tabular numerals, minimal motion.

**Consequences:**

- The interface reads as trustworthy rather than energetic.
- No gradients on primary actions and no celebratory animation.
- Speed and clarity carry the experience, not decoration.

## ADR-012: CI builds, the VPS only runs

**Context:** A Next.js build needs more memory than a 4 GB VPS can spare while
Postgres runs.

**Decision:** GitHub Actions builds the image and pushes it to GHCR. The VPS pulls
a SHA-tagged image and restarts.

**Consequences:**

- Build memory is not a constraint.
- Deploys are reproducible and rollback is a tag change.
- The VPS needs registry credentials and a deploy key.
- A failed health check restores the previous tag.

## ADR-013: REST route handlers instead of Server Actions

**Context:** Server Actions are convenient but are not a stable API for a future
client.

**Decision:** Put every mutation behind `/api/v1` route handlers with Zod
validation. Use a typed fetch client in the app.

**Consequences:**

- One contract for the web app and any future client.
- More boilerplate than Server Actions.
- The contract is testable and versionable.
- Server components still read data directly from the database.

## ADR-014: Path-based storefront URLs

**Context:** A subdomain per shop needs wildcard DNS and a wildcard certificate,
and it splits SEO across origins.

**Decision:** Use `startlite.in/b/{handle}`.

**Consequences:**

- One origin, one certificate, consolidated ranking signals.
- Custom merchant domains are a later paid feature.
- The handle must remain unique and lowercase.

## ADR-015: Single owner per business

**Context:** The target business has one to three people. Multi-user access needs
invitations, roles, and permission tests.

**Decision:** One owner account per shop in v1.

**Consequences:**

- No invitation flow and no role matrix.
- Sharing a login is possible and tolerated.
- Add staff accounts only when a paying merchant asks.

## ADR-016: AI translations ship as beta

**Context:** Six languages need reviewed copy. Native review is not available at
launch.

**Decision:** Machine-translate five of the six live locales and label them beta
with a report link. Keep English as the reference.

**Consequences:**

- Some financial terms will be wrong.
- Every beta locale carries a visible label and a feedback path.
- Replace with reviewed copy when a native reviewer is available.
- Keep the English term in a tooltip for money and status labels.

## ADR-017: NUMERIC money with decimal.js

**Context:** Floating-point money loses precision. Postgres supports exact
decimals.

**Decision:** Store every amount and quantity as `NUMERIC(10,2)`. Compute on the
server with `decimal.js` and `ROUND_HALF_UP`. Use a generated column for
`line_total`. Never compute money in the browser.

**Consequences:**

- Exact totals in the database and the server.
- The client only displays server totals.
- The API rejects any client-supplied total.

## ADR-018: Better Auth for sessions

**Context:** Email and password auth needs hashing, sessions, reset, and role
checks.

**Decision:** Use Better Auth with Argon2id, database sessions, and a `role`
column.

**Consequences:**

- No custom auth code.
- Session rows live in Postgres, so logout and revocation are immediate.
- The library owns its tables. Do not change their shape.

## ADR-019: Server-side pending order with a short link

**Context:** The archived design put the whole cart in a Base64URL parameter on an
`/accept` link. Long orders made long URLs. WhatsApp wrapped them badly. A
shoulder-surfed message exposed the full cart. Nothing could expire.

**Decision:** The storefront writes the cart to `pending_orders` and sends a
10-character code in `/o/{code}`. The merchant must be signed in and must own the
shop. A nightly job deletes unaccepted rows after 7 days. Accepting an order
deletes the row in the same transaction.

**Consequences:**

- The message stays short at any order size.
- The cart cannot be read from a screenshot of a link. It still shows in the chat
  text, so the message summary stays short.
- Buyer PII lives for at most 7 days in a table that is never exported.
- Accepting is idempotent. A second tap returns the first order.
- Unknown, expired, and accepted codes all return `404`.
- The order form needs Turnstile and rate limits, because it is now a write
  endpoint.
- There is no offline path. A buyer without a connection cannot submit.

## ADR-020: Functional tab labels

**Context:** The prototype used Galla, Bikri, Khata, and Samaan. A first-time user
does not know what Galla means. The metaphor is charming to the team and costly to
the merchant.

**Decision:** Name tabs by function: Home, Sales, Customers, the pack noun, and
More. The pack noun is Menu, Items, or Services.

**Consequences:**

- A merchant can guess every tab on day one.
- One tab label changes by pack, so the tab bar is translated per pack.
- Marketing may keep a metaphor. The product does not.
- The words Galla, Bikri, Khata, and Samaan do not appear in the interface.

## ADR-021: QR on the bill only

**Context:** A QR at checkout implies the shop has accepted the order. It also
invites payment before the merchant confirms stock, price, or delivery.

**Decision:** Show the payment stack only on the final bill and the reminder, and
only when an amount is due. The QR encodes the total. There is no per-line QR.

**Consequences:**

- The buyer pays after the merchant accepts. Fewer refunds and disputes.
- One QR per bill is cheaper to support than one per item.
- A large bill scans as one code, so the ₹2,000 gallery limit has one warning.
- The merchant still logs every payment by hand. No callback exists.

## ADR-022: Text bill by default

**Context:** An image looks better but cannot be copied, searched, or read by a
screen reader. WhatsApp also recompresses images, which can break a QR.

**Decision:** Compile the bill as text. Offer a PNG on demand and share it as a
document.

**Consequences:**

- The bill works in any chat, on any phone, and in a forwarded message.
- A merchant can fix a typo by editing the message.
- The PNG keeps a crisp QR because a document is not recompressed.
- Two templates need tests. A golden file covers both.

## ADR-023: Cash left is not profit

**Context:** "Profit" needs costs, depreciation, and accounting choices. A micro
shop needs one honest number: what is left in the drawer.

**Decision:** Show cash left as payments on revenue lines minus expenses. Label it
"Cash left". Show one line: "This is not profit."

**Consequences:**

- The number matches the merchant's mental model.
- Deposits and reimbursements are excluded, because they are pass-through money.
- No journal, no accrual, no closing entries.
- The view states its period: Today, This month, or All.

## ADR-024: Email OTP at three moments only

**Context:** OTP on every login would raise email volume to about 200,000 messages
per month at 10,000 merchants.

**Decision:** Send an email OTP at signup, at password reset, and on a new device.
A known device keeps a 30-day session.

**Consequences:**

- Email volume stays under the free tier for a long time.
- A stolen password is not enough on a new device.
- A merchant who clears cookies sees one extra step.
- SMS OTP stays out of scope. It costs money per message and invites SIM-swap
  fraud.

## ADR-025: Checkout asks for two fields

**Context:** Every field at checkout loses buyers. A phone number is needed to
find the customer later. A note is not.

**Decision:** Ask for name and phone. Make the note optional. Default needed-by to
Today with one tap to change.

**Consequences:**

- Checkout fits one screen at 360 px.
- Most buyers send within seconds.
- A shop that needs an address puts it in the item prompt or the note.
- The merchant can still correct every field after accepting.

## ADR-026: Paper migration through opening dues

**Context:** A new merchant has a notebook of people who owe money. If the app
starts at zero, the merchant keeps two systems and abandons the app.

**Decision:** Offer **Add previous due** in Customers. It creates an order with
`source = 'opening'` and one line named "Previous due". Import the whole notebook
later with a CSV, not in v1.

**Consequences:**

- One number on day one: the real pending amount.
- Opening dues accept payments and appear in every total.
- No fake bill numbers and no invented dates.
- A bulk import needs a decision. It is not in v1.

## ADR-027: Two-tier options in v1

**Context:** A cake needs a size and an eggless extra. A tailor needs a garment and
a lining. Three tiers would cover more cases and slow every screen.

**Decision:** Ship two tiers. An option sets the price. An extra adds a delta or
scopes stock. Ship no third tier.

**Consequences:**

- The option sheet fits one bottom sheet.
- Most packs work with two tiers.
- A third tier needs a new decision and a migration.
- Free-text units stay display text and never affect a calculation.

## ADR-028: Billing automation waits for 500 merchants

**Context:** Razorpay adds KYC, webhooks, reconciliation, refunds, and dunning.
Manual activation costs about 20 seconds per merchant.

**Decision:** Keep manual activation until 500 paying merchants or 20 activations
per week, whichever comes first. Then add Razorpay.

**Consequences:**

- No gateway fee and no reconciliation work in year one.
- 500 merchants means about 2.2 activations per day. One batch a week is enough.
- The trigger is measurable, not a feeling.
- The switch is a milestone in [roadmap.md](roadmap.md#after-v1).

## ADR-029: Guest workspace before login

**Context:** A merchant on a budget Android phone will not create an account to
try a tool. The first screen decides whether the product is used. A signup wall
also blocks a real counter sale while the buyer waits.

**Decision:** `/` opens a full workspace for a signed-out merchant. Shop settings,
catalog, sales, payments, customers, expenses, cash left, CSV download, and a text
bill all work on the phone. State lives in `localStorage` under
`startlite_guest_v2`. Money is integer paise on the phone. After signup and
onboarding, `POST /merchant/import` copies the work into the shop; the server
recomputes every total with `decimal.js` and dedupes by order code.

Guest mode is a local workspace, not an offline queue. It never pretends to write
to the server and never reconciles later. It is consistent with
[ADR-004](#adr-004-no-offline-write-queue).

**Consequences:**

- The first sale costs zero fields. A merchant can judge the product in a minute.
- The account sells three concrete things: a store link, sync, and a safe copy.
- Clearing browser data loses unsaved work. The save card says so, and CSV export
  is available without an account.
- Imported rows are untrusted input. The server recomputes line totals, order
  totals, and payment sums, and skips an order whose payments exceed its total.
- Two money paths need tests: integer paise on the phone and `decimal.js` on the
  server.
- The public storefront, pending order handoff, PNG receipt, and cross-device
  sync stay behind an account.

## Superseded specification sections

The archived document is at
[archive/startlite_ai_coding_agent_specification.md](archive/startlite_ai_coding_agent_specification.md).
It is kept for history only.

| Original section | Now lives in | Change |
|---|---|---|
| 1. Product philosophy and pricing | [product.md](product.md#business-model) | 14 days becomes 90 days. ₹101 per year becomes ₹130.98 per quarter. Manual activation. |
| 2. Never-build list | [product.md](product.md#guardrails) | Added no offline queue, no native apps, no field encryption, no charts. |
| 3. Tech stack | [tech-stack.md](tech-stack.md) | Next.js, Drizzle, Better Auth, Traefik, local media, CI builds. FastAPI, Vite, and MinIO removed. |
| 4. Nine primitives | [product.md](product.md#capability-map) | Behavior kept. Each primitive points to its specification. |
| 5. Schema and encryption | [data-model.md](data-model.md) | Encryption columns removed. Pending orders, media, sessions, audit, and bill fields added. Trial default is 90 days. |
| 6. UI and UX | [product.md](product.md#surfaces), [design-system.md](design-system.md) | Five tabs kept, renamed. Visual system, bill templates, and motion added. |
| 7. API endpoints | [architecture.md](architecture.md#api-contract) | Pending-order endpoints added. Billing endpoints deferred to v2. |
| 8. Phased plan | [roadmap.md](roadmap.md) | Re-sequenced into seven phases with exit criteria. |
| 9. Definition of Done | [roadmap.md](roadmap.md#definition-of-done) | Amended for no offline queue, no encryption, and the locale strategy. |

## Open questions

Technical risks and their triggers live in
[architecture.md](architecture.md#accepted-risks). This table covers decisions that
are still open.

| Question | Owner | Revisit |
|---|---|---|
| Final GST invoice template and numbering | Accountant | Before P6 |
| Budget for native review of five locales | Owner | After launch feedback |
| Bulk import of a paper notebook | Owner | First merchant with more than 50 dues |
| Add staff accounts | Owner | First paying merchant request |
| Add charts | Owner | First merchant request after 5,000 shops |
