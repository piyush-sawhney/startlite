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
| [ADR-005](#adr-005-quarterly-activation-and-90-day-trial) | 90-day trial, prepaid quarterly activation | Accepted |
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
| [ADR-030](#adr-030-requested-time-not-availability) | Requested time, not availability | Accepted |
| [ADR-031](#adr-031-one-dashboard-six-fixed-tabs) | One dashboard, six fixed tabs | Accepted |
| [ADR-032](#adr-032-desktop-rail-and-day-column) | Desktop rail and day column | Accepted |
| [ADR-033](#adr-033-customer-identity-is-an-id-phone-is-the-lookup) | Customer identity is an id, phone is the lookup | Accepted |
| [ADR-034](#adr-034-display-dates-as-dd-mmm-yyyy) | Display dates as DD-MMM-YYYY | Accepted |
| [ADR-035](#adr-035-development-seed-is-separate-and-guarded) | Development seed is separate and guarded | Accepted |
| [ADR-036](#adr-036-home-work-queue-and-overlay-actions) | Home work queue and overlay actions | Accepted |
| [ADR-037](#adr-037-generic-order-status-funnel) | Generic order status funnel | Accepted |

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

## ADR-005: Quarterly activation and 90-day trial

**Context:** The archived specification used a 14-day trial and a yearly plan.

**Decision:** A 90-day trial with full features. After that, access runs for 90
days per activation, prepaid. Activation is manual in v1.

**Consequences:**

- The trial is long enough for a merchant to form a habit.
- Quarterly activation means four touch points per year.
- An expired pass pauses the storefront. Login and export stay available.
- Price, tax, and collection math are out of scope for these docs.

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

**Decision:** Ask for name and phone. Make the note optional. Default the
requested date to Today with one tap to change. Time is one optional field that
opens at the pack's precision. See
[ADR-030](#adr-030-requested-time-not-availability).

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

## ADR-030: Requested time, not availability

**Context:** The catalog covers a tutor with 5–6 and 6–7 batches, a makeup artist
with a 3–7 block, a salon with an 11:30 appointment, a tent rented Friday to
Sunday, and a kirana that has no time at all. A `Morning / Afternoon / Evening`
enum forced every one of them into three buckets. A real availability grid needs
hours, durations, capacity, and locking, and it encodes one model (a one-to-one
appointment). That model breaks a yoga batch of twenty, a delivery route, and a
regular squeezed in at 6:15.

**Decision:** The order stores a requested interval and a confirmed interval.
`requested_precision` is one of `none`, `date`, `period`, `window`, or `exact`.
Packs choose the date label and the default precision; they never own a list of
times. The merchant accepts as asked, accepts a changed time agreed with the
client outside the app, or declines. A changed time is a record, not a proposal:
there is no client-side re-confirmation.

No slot table, no hours table, no capacity, no exclusion constraint, no travel
buffers. A request shows the last confirmed order before it, any overlap, and the
first order after it. The strip is read-only and owner-only, and it never blocks
an accept.

**Consequences:**

- One shape holds every business in the 200-business corpus, including the ones
  with no time.
- Double bookings are visible, not prevented. The owner decides, which matches
  how the shop already works.
- The client never sees the merchant's book, only their own request.
- The app records commitments, not coordination. "Running ten minutes late" and
  travel time stay in a phone call.
- The calendar is a day sheet rendered from confirmed orders and ghost requests,
  not an availability editor.
- Adding business 201 is a catalog row and keywords, not a schema change.
- `confirmed_source` separates "accepted as asked" from "time agreed with the
  client", which is the only reporting this needs.

## ADR-031: One dashboard, six fixed tabs

**Context:** The guest workspace and the owner app grew as two products. The
guest shell had five tabs, the owner shell had five different ones, and neither
had a real Expenses screen. The pack noun supplied the fourth tab label, so the
same shop could read `Samaan` in one pack and `Catalog` in another. Two Home
screens meant two specs, two sets of copy, and two places to fix a bug.

**Decision:** `/` renders one dashboard for both guest and owner. Only the data
source and a few signals differ: the `Not saved` pill, the launch sheet on a
fresh device, the post-write toast, and the Settings save row. There are six
fixed tabs in the same order for every pack and every state: Home, Orders,
Customers, Items, Expenses, Settings. The pack still chooses starter items and
default units; it no longer chooses a label. Owner routes under `/app/*` keep
their five-tab shell until they move onto the shared dashboard.

**Consequences:**

- One Home spec covers both states, so a layout change lands once.
- Expenses is a real tab, not a dead end behind More.
- The pack noun is retired from navigation and from all button copy.
- The owner shell is the remaining duplicate. It is a migration, not a second
  design.
- Tests run against both data sources: server data for the owner, local state
  for the guest.

## ADR-032: Desktop rail and day column

**Context:** The product is phone first, but merchants also open it on a laptop
at the counter. A single 640 px column centered in a 1440 px window leaves wide
empty margins. It also pushes the day view below both order groups, so the
merchant scrolls past the work to reach the schedule. The metrics, meanwhile,
switch to a five-across strip that reads differently from the phone.

**Decision:** Three widths. Below 768 px, bottom tabs, one column, 16 px gutter.
From 768 px, a 200 px left rail replaces the tabs. From 1200 px, the rail grows
to 240 px and the main column gains a 360 px right column. The day view lives in
that right column, sticky and scrolling on its own, so it sits beside the order
groups instead of below them. Between 768 and 1199 px the day view stays in the
main column, after In progress. The KPI grid is two columns at every width, with
Cash left spanning both, and each cell keeps the short label and the icon on
desktop. The request bar is compact below 1200 px and becomes a header pill plus
a panel above it.

**Consequences:**

- Desktop is the same app at a wider width, not a separate build.
- The day view is visible beside the order groups at 1200 px and above.
- Metrics read the same on a phone and a laptop, so the numbers do not move
  around between devices.
- The right column scrolls independently. It must not trap the page scroll.
- The rail costs 200 px at tablet width, so the main column must stay above
  560 px before the 1200 px breakpoint.

## ADR-033: Customer identity is an id, phone is the lookup

**Context:** The guest store keyed a customer by phone, and when no phone was
present, by the lowercased name. Two different `Ramesh` entries silently became
one person. A family sharing one phone became one person. The phone was also cut
to the last ten digits, so the country code was lost and numbers from different
countries could collide.

**Decision:** A generated customer id is the only identity. A phone plus its
country code is the only automatic match. A name is never a key. If a phone is
present and already saved, the UI asks "Use this customer?"; if a name matches
but no phone is present, the UI asks "Same as …?" and the merchant decides. A
customer with no phone is always a new row. Add sale passes `customerId` when an
existing customer is selected, so the order links exactly instead of re-matching
by name. The guest store keys a record as `phone:<country_code><digits>` when a
phone exists, otherwise `id:<customer_id>`.

**Consequences:**

- No silent merges, in either direction.
- The daily flow stays simple: type a phone, see one suggestion, tap it.
- One phone maps to one customer for now. Allowing a second person on a shared
  number is an open question; the UI prompt is the place to decide it later.
- The server needs `country_code` on `customers` and `customer_id` on order
  creation to match the guest model. That is the owner-parity follow-up.
- A manual `Merge customers` action stays a rare Settings tool, not a daily step.

## ADR-034: Display dates as DD-MMM-YYYY

**Context:** Dates appeared as `18 Nov 2026`, `18/11/2026`, and raw ISO in
different places. A merchant reading a bill and a list saw two formats for the
same day.

**Decision:** Every displayed date uses `DD-MMM-YYYY`, for example
`18-Nov-2026`. Storage, API payloads, and CSV filenames keep ISO `YYYY-MM-DD`.
Date inputs keep the native picker while editing; the chosen value is shown as
`18-Nov-2026` beside the field. One helper, `formatDateDMY`, owns the label.

**Consequences:**

- One format across Home, orders, bills, expenses, and customer history.
- Sorting and storage do not change.
- The native picker still follows the browser locale while open. Only the
  committed label is guaranteed.

## ADR-035: Development seed is separate and guarded

**Context:** One `db:seed` created a single bakery. Checking a grocery, salon, or
rental flow meant editing the seed by hand. Testing an empty database meant
removing the Docker volume.

**Decision:** `db:seed:dev` owns 24 development accounts, two per pack, with
known credentials. `db:wipe:dev` truncates every application table.
`db:reset:dev` does both. The tools refuse `NODE_ENV=production` and refuse a
non-local database unless `ALLOW_REMOTE_DEV_DB=1`. The seed deletes and recreates
only its own `@startlite.dev` accounts, so it is safe to rerun.

**Consequences:**

- Every pack can be checked with a real login.
- An empty database is one command away.
- The shared password is public on purpose. It never reaches production.
- The seed is not part of the app runtime and adds no route or API.
- `db:seed` keeps the single demo shop for the onboarding walkthrough.

## ADR-036: Home work queue and overlay actions

**Context:** Home showed unfinished work and ready-to-collect orders in separate
cards, prioritized collection, and opened several actions on separate routes.
Merchants need one view of all incomplete work and should keep their place on
Home while acting on it.

**Decision:** Home shows a scrollable queue of up to 10 incomplete orders across
all dates. Not-ready orders come first; ready orders with a balance follow. In
each group, scheduled orders sort by required date and slot, then unscheduled
orders by oldest placement. Rows show placed and needed dates and offer relevant
actions. The order remains incomplete until work is ready and payment is
complete; `settled` means both are true. Home actions open one responsive
overlay at a time. Mobile uses a sheet; desktop uses a dialog or side panel.
The Home logo and Settings allow signed-in owners to manage the logo. Guests
keep the initials fallback.

**Consequences:**

- The Home queue is independent of the selected calendar day.
- Paying before work is ready does not hide an order from the queue.
- Adding sale, customer, item, or expense; reviewing a request; and opening an
  order keep the merchant in Home.
- The Orders tab remains the place for full order management.
- The existing media pipeline stores shop logos; guests cannot upload one.

**Status names:** The status names in this entry are updated by
[ADR-037](#adr-037-generic-order-status-funnel). `settled` is now `completed`,
`open_tab` is now `accepted`, and `quote` is now `waiting_client`.

## ADR-037: Generic order status funnel

**Context:** The five statuses `quote`, `open_tab`, `ready`, `settled`, and
`cancelled` were too coarse for the way micro-businesses actually work. A bakery
needs to know whether a custom order is still being reviewed, waiting on the
customer, accepted, being baked, or ready. A salon needs an in-service state. A
retail shop needs a packed state. One `open_tab` hid all of these. The merchant
also had no way to record that they declined a request, only that they cancelled
an order.

**Decision:** Replace the five statuses with a generic eight-status funnel. The
internal keys are stable and the labels are merchant-facing.

| Key | Label | Meaning | Home group |
|---|---|---|---|
| `under_review` | Under review | New request, merchant deciding | To finish |
| `waiting_client` | Waiting for client | Quote or estimate sent, awaiting confirmation | To finish |
| `accepted` | Accepted | Customer confirmed, work not started | To finish |
| `in_progress` | In progress | Work started | To finish |
| `ready` | Ready | Work done, payment due | Ready to collect |
| `completed` | Completed | Work done and fully paid | Not shown |
| `declined` | Declined | Merchant cannot fulfil | Not shown |
| `cancelled` | Cancelled | Order cancelled after acceptance | Not shown |

The funnel is generic because it names the *state of the work*, not the trade.
Every pack maps onto it:

- **Bakery / food:** under review → waiting for client → accepted → in progress
  (baking) → ready → completed.
- **Salon / services:** under review → waiting for client → accepted → in
  progress (in service) → ready → completed.
- **Retail / kirana:** under review → accepted → ready (packed) → completed.
  `waiting_client` and `in_progress` are optional and simply skipped.
- **Repairs / trades:** under review → waiting for client (quote) → accepted →
  in progress (in workshop) → ready → completed.
- **Rentals:** under review → waiting for client → accepted (booked) → ready
  (handed over) → completed (returned and paid).

A pack never owns a status list. The UI shows the full funnel; the merchant uses
the states that fit their trade. `in_progress` and `waiting_client` are optional
steps, not required gates.

**Transitions:**

| From | To |
|---|---|
| `under_review` | `waiting_client`, `accepted`, `declined`, `cancelled` |
| `waiting_client` | `accepted`, `declined`, `cancelled` |
| `accepted` | `in_progress`, `ready`, `cancelled` |
| `in_progress` | `ready`, `cancelled` |
| `ready` | `completed`, `accepted` (reopen), `cancelled` |
| `completed` | none |
| `declined` | none |
| `cancelled` | none |

**Payment rule:** A payment never moves work forward. A fully paid `accepted` or
`in_progress` order stays in **To finish** until the merchant marks it ready.
Marking a fully paid order ready moves it straight to `completed`. Marking an
unpaid order ready moves it to `ready`; its final payment then moves it to
`completed`. Readiness and payment stay distinct without a second field.

**Consequences:**

- One status module, `lib/order-status.ts`, owns the keys, labels, groups, and
  transitions. No screen hardcodes a status string.
- The Home queue groups are **To finish** (`under_review`, `waiting_client`,
  `accepted`, `in_progress`) and **Ready to collect** (`ready`).
- `completed`, `declined`, and `cancelled` are closed and never appear in the
  queue.
- The storefront request flow still uses `pending_orders`; accepting a request
  creates an `accepted` order.
- This is a first-time application, so there is no data migration. The schema
  default becomes `accepted`.
- `cancelled` means closed with no money. A payment record on a cancelled order
  stays in history but never counts as received or as a pending balance.
- The Orders tab filters map `pending` to the open statuses and `paid` to
  `completed`.

## ADR-038: Home header context and dues collection

**Context:** The Home header named the shop but gave the merchant no reason to
look up: an owner could not see when the pass ends, and a guest had to infer
that an icon meant signing in would save their work. The customer dues card
listed balances but showed no total and offered no direct way to collect.

**Decision:** The header is one row. It holds the logo, the shop name, the edit
icon, a meta label, the state pill, and the owner's Share button. The store
handle is not in the header. The meta label is inline from 768 px and hidden
below it. An owner sees `Quarterly pass until`, `Quarterly pass ends`, or
`Quarterly pass expired` with the date; before activation the same three forms
use `3-month trial`. A guest or an expired session sees `Sign in to save this
shop` as a button that opens the save sheet. The pass label uses `success` above
30 days left, `warning` from 1 to 30 days, and `danger` on expiry; the word and
date carry the meaning. Share stays owner-only, carries the text `Share your
store instantly`, and the separate power icon is removed. An owner also gets an
`Open storefront` button that opens `/b/{handle}` in a new tab. Each order list uses
one header row: title, total count, total due, sort, and collapse. On desktop
the header is 64 px tall. The customer dues card shows the count and total of
all dues, lists the five highest balances, and gives each row a Collect action
that opens the payment sheet. A quiet link leads to the Customers tab for full
management.

**Consequences:**

- Pass and trial dates come from the business record; guests have no expiry
  label and always see the sign-in prompt.
- The trial is 3 months (90 days) from signup. Each pass is quarterly (90 days).
  The schema default and admin activation already use 90 days.
- The date format is the same as other Home dates: `21-Nov-2026`.
- The dues total covers every customer with a positive pending amount, not just
  the five rows shown. Each row names the unpaid orders behind its balance.
- Pending orders and Completed · payment due are disjoint. Ready orders belong
  to payment due only, so a balance is never counted twice.
- Payment for a due row stays inside Home; the Customers tab remains the place
  for customer records and full dues management.
- Mobile keeps the collapsible card anatomy and the same row actions.

## ADR-039: Collapsible sidebar and desktop width

**Context:** The compact left rail fixed 200 px of the desktop before any work
was shown. Its six items did not match the work a merchant does most, and the
Home header truncated the pass or trial line even on a wide screen.

**Decision:** From 1024 px the navigation is a left rail that starts collapsed
at 68 px with icons only. A toggle expands it to 240 px with labels, and the
choice persists. The rail order is Home, Customers, Orders, Items, Store
settings. The footer holds sign-in and create-account for a guest, and the
storefront link and sign-out for an owner. The bottom bar stays for widths below
1024 px. In the header, the pass or trial label is never truncated at desktop
width; the shop name shrinks first. The `Open storefront` and Share buttons show
their full labels from 1280 px and use icons below it.

**Consequences:**

- The collapsed rail gives the workspace more width without losing navigation.
- Expenses remains reachable from Store settings; it is not a rail item.
- An icon-only rail item still has an accessible name and a title.
- The rail's top mark is the shop logo for an owner, or the first letter of the
  shop name when no logo is set or the merchant is signed out. It is round, as
  in the header.
- Footer actions follow the rail state: labels and full buttons when expanded,
  accessible icons only when collapsed. Sign out is no exception.
- Guest and owner rails differ only in their footer actions.

## Superseded specification sections

The archived document is at
[archive/startlite_ai_coding_agent_specification.md](archive/startlite_ai_coding_agent_specification.md).
It is kept for history only.

| Original section | Now lives in | Change |
|---|---|---|
| 1. Product philosophy and pricing | [product.md](product.md#access) | 14 days becomes 90 days. Yearly becomes prepaid quarterly activation. Manual activation. Pricing math removed. |
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
