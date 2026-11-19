# StartLite — Master Engineering & Product Specification (AI Agent Directive)

> **Purpose of this document:** This is the single source of truth for building **StartLite**, a mobile-first WhatsApp storefront and cash-flow ledger (*Bahi-Khata*) for India's hybrid micro-businesses (home bakers, tailors, tutors, cloud kitchens, repair techs) and independent freelancers.
> **Core Mandate:** Accommodate the real-world workflows of 100+ micro-business categories through **9 orthogonal, progressively disclosed primitives**—while keeping the UI strictly limited to **5 simple tabs** and a **< 60-second onboarding flow**.

---

## 1. Product Philosophy & Business Model

* **Pricing:** 14-day free trial, followed by a flat **₹101/year prepaid pass** via standard Razorpay UPI checkout (inclusive of 18% GST, SAC 998314). No recurring AutoPay mandates; upon expiry, the public storefront pauses while merchant data remains 100% exportable.
* **Zero-CAC Viral Distribution:** Every customer storefront and every WhatsApp order/receipt appends a subtle footer: `⚡ Run a business on WhatsApp? Get your free digital store at StartLite.in`.
* **Zero Variable Infrastructure Cost:**
  * **Communication:** Strictly client-side `wa.me` deep links (₹0 API fees, zero Meta ban risk).
  * **Payments:** Direct buyer-to-merchant settlement (UPI ID / Bank transfer). StartLite never touches or holds merchant funds.
  * **Storage:** Never store QR code images or customer reference photos on the server. QR codes and marketing cards are rendered client-side via HTML5 Canvas; customer photos/PDFs stay in WhatsApp chat.
* **Data Sovereignty ("Anti-Hostage Guarantee"):** A visible **Export All Data (CSV/Excel)** button must always be accessible on the merchant dashboard, even on expired accounts.

---

## 2. Hard Guardrails ("NEVER BUILD" List)

Coding agents **MUST NOT** introduce any of the following features, dependencies, or abstractions:
1. **No GST / E-Invoicing / HSN / GSTR-1 / ITC Accounting:** StartLite is strictly for non-GST bills, estimates, and simple cash-flow tracking.
2. **No Warehouse / FIFO / Batch Inventory Systems:** Use a 1-tap `In Stock / Sold Out` boolean toggle (plus an optional simple integer `slots_left` counter for workshops/limited drops).
3. **No Paid WhatsApp Business API or In-App Chat:** Never integrate Twilio, Interakt, Wati, or build a real-time chat backend.
4. **No Customer Accounts or Logins on the Storefront:** Zero buyer registration, zero buyer OTPs, zero buyer passwords. Use browser `localStorage` for Buyer Auto-Memory.
5. **No Payment Aggregation / Escrow / Nodal Accounts:** Never route customer-to-merchant payments through a StartLite-owned gateway.
6. **No Multi-Branch RBAC Bloat:** Optimize ruthlessly for 1–3 person businesses operating on budget Android smartphones over patchy 4G.
7. **No Floating-Point Money Math:** Never use JavaScript `Number` floats for persistent financial totals without integer paise conversion or backend `Decimal` / PostgreSQL `NUMERIC(10, 2)`.

---

## 3. Target Tech Stack & Deployment Architecture

* **Frontend (PWA):** React 19 + TypeScript (strict mode) + Vite + Tailwind CSS.
  * **Offline-First Engine:** Service Worker (Workbox / Vite PWA) + IndexedDB mutation queue (`idb`) so merchants can log walk-in sales and running-tab entries offline.
  * **Client-Side Visuals:** HTML5 `<canvas>` + deterministic offline QR encoder (zero external QR API calls).
* **Backend:** Python 3.14+ + FastAPI + Pydantic v2 + SQLAlchemy 2.0 (async) + Alembic + `cryptography` (Fernet/AES-256-GCM for PII).
* **Database:** PostgreSQL 16+ with **Row-Level Security (RLS)** enforced on every tenant table.
* **Infrastructure:** Single Debian/Ubuntu VPS running Docker Compose behind a rootless **Traefik** reverse proxy (automatic Let's Encrypt TLS), **CrowdSec** intrusion prevention, and LUKS full-disk encryption.

---

## 4. The 9 Universal Primitives (Progressive Disclosure Architecture)

All edge cases across 100 micro-business and freelancer categories map to these 9 building blocks. **Rule:** Every advanced field must be hidden by default and revealed only via a single opt-in toggle or progressive expansion button.

### Primitive 1: 3-Tier Bulletproof Payment Stack (2026 UPI Compliance)
Because unsigned P2P `upi://pay` deep links frequently fail on GPay/PhonePe or get blocked inside Instagram's in-app browser—and NPCI caps gallery-scanned QR screenshots at ₹2,000—every payment view must render this exact fallback ladder:
1. **Dynamic Client-Side QR Code:** Generated from `upi://pay?pa={upiId}&pn={encodedName}&am={amount}&cu=INR` for direct camera scanning.
2. **1-Tap `Copy UPI ID` & `Copy Exact Amount` Buttons:** Placed directly beside the QR. Never fails in any browser.
3. **Best-Effort `Open UPI App` Link:** Properly URL-encoded (`encodeURIComponent` on all values) with a helper note when `amount > 2000`: *"For ₹2,000+, tap Copy UPI ID or Open UPI App (gallery QR screenshots are capped at ₹2,000 by banks)."*
4. **Optional `Bank A/C + IFSC` Block (Opt-In):** Disabled by default in Settings. When enabled (freelancers, architects, B2B consultants), renders NEFT/IMPS details cleanly on bills and receipts.

### Primitive 2: Progressive 2-Tier Options (Variants + Sub-Variants)
Avoid combinatorial SKU matrices (`Size × Color × Material`).
* **Default Item Creation:** Only asks for `Name`, `Price`, and `Product / Service` toggle.
* **Opt-in `+ Add Options` Expansion:**
  * **Level 1 — Variants (Price Setters):** Single-select choices that override `base_price` (e.g., `500g — ₹600`, `1kg — ₹1,100`; or `Hatchback — ₹400`, `SUV — ₹700`). Each variant has its own `is_available` toggle.
  * **Level 2 — Sub-Variants (Modifiers or Scoped Specs):**
    * **Global Modifier (`parent_variant_id = NULL`):** Applies across all variants with an optional `price_delta` (`+₹0` or `+₹100`), supporting either radio (`is_multi_select = false`, e.g., Flavor/Color) or checkbox (`is_multi_select = true`, e.g., `Eggless +₹100`, `With Lining +₹250`).
    * **Variant-Scoped Spec (`parent_variant_id = <variant_uuid>`):** Tied to a specific Level-1 variant so individual stock combinations (e.g., `Size M → Maroon`) can be toggled `Sold Out` in one tap.
* **Decimal Quantities + Custom Unit Labels:** Support `NUMERIC(10, 2)` quantities (`1.25 kg`, `2.5 hrs`, `1250 sq.ft`, `2.4 × 1k words`) while defaulting the UI stepper to integer `1, 2, 3`.

### Primitive 3: 3-Mode Pricing Toggle
Single radio selector per catalog item:
1. `fixed`: Standard exact price (`₹800`).
2. `starting_from`: Displays `From ₹800` (caterers, nail art, designers, tax filers).
3. `quote`: Displays `Confirm on Chat / Pickup Request` with `₹0` checkout total (mobile repair inspection, laundry pickup, bespoke tailoring).

### Primitive 4: Open Running Tabs & Quote-to-Bill State Machine
Every order follows a single unified lifecycle:
`quote` → `open_tab` → `ready` → `settled` (plus `cancelled`).
* While an order is in `quote` or `open_tab`, the merchant can at any time:
  * Tap **`+ Add Item`** (solves daily milk/water/ironing tabs, mid-appointment salon add-ons, extra wedding songs, AC spare parts).
  * Apply **`+ Extra / - Discount (₹)`** with a short reason string (solves bargaining, round-offs, urgent delivery, travel charges).
  * Update **`progress_note`** (e.g., `"4/10 physio sessions done"` or `"2 empty water jars held"`).
  * Convert a `quote` into an `open_tab` in 1 tap upon client approval.

### Primitive 5: Financial Reconciliation (`Paid` + `TDS` + `Deposits` + `Reimbursements`)
Keep accounting mathematically clean without exposing double-entry jargon:
* **Multi-Installment Payment Log:** Each order supports multiple dated payment entries (`amount`, `mode: upi | cash | bank | cheque`, `paid_at`).
* **Opt-In TDS Reconciliation (Income-tax Act, 2025 — Section 393(1)):** Hidden behind a subtle `+ Log TDS / Write-off` link inside the payment drawer. Logging `₹45,000 Received` + `₹5,000 TDS` marks a `₹50,000` invoice as **Settled (`₹0 Pending`)**, while keeping `tds_deducted` totaled in CSV exports for year-end tax filing.
* **Line-Item Kind (`standard` | `deposit` | `reimbursement`):**
  * `standard`: Included in Revenue & Estimated Profit.
  * `deposit`: Refundable security deposit (rentals, decor frames, milk glass bottles). Shown on customer bill, **excluded** from merchant Revenue/Profit.
  * `reimbursement`: Pass-through expenses (RTO fees, stamp duty, ad spend, hardware/plywood bought for client). Shown on customer bill, **excluded** from merchant Revenue/Profit.

### Primitive 6: Base64 Magic Link Sync + Offline-First PWA Queue
* **Customer → Merchant Zero-Backend Order Sync:**
  * Storefront encodes the checkout cart as compact UTF-8-safe Base64URL JSON inside the WhatsApp message: `https://startlite.in/accept?o=<base64url>`.
  * Compact payload keys to keep URLs short:
    ```json
    {
      "v": 1,
      "n": "Rahul Verma",
      "p": "919811223344",
      "d": "Tomorrow",
      "s": "Evening",
      "nt": "Tower 4, Flat 602",
      "i": [
        {
          "id": "b1",
          "t": "Truffle Cake",
          "vr": "1 kg",
          "sv": ["Eggless (+100)"],
          "cn": "Happy Birthday Dad",
          "q": 1,
          "pr": 1050
        }
      ],
      "tot": 1050
    }
    ```
  * When the merchant clicks the link in WhatsApp, the PWA parses `?o=...`, validates schema/size limits (< 4 KB), opens the **Review & Accept Modal** (allowing `+ Extra / - Discount` or advance entry), and saves directly to PostgreSQL (or IndexedDB if offline).
* **Offline-First Merchant Queue:** All `POST/PATCH` mutations (`create_order`, `add_payment`, `toggle_stock`, `add_expense`) write optimistically to IndexedDB first with client-generated UUIDv7 IDs, then flush sequentially to FastAPI when `navigator.onLine` returns.

### Primitive 7: Optional 1-Line Item Prompt + Zero-Storage WhatsApp Media Flag
* Each catalog item has an optional `customer_prompt` text field (e.g., `"Message on cake?"`, `"Enter DOB, Time & Place"`, `"Exact embroidery spelling"`). If null/empty, nothing renders on the storefront.
* Each catalog item has a boolean `ask_whatsapp_media`. When true, the compiled `wa.me` order text automatically appends: `📸 Note: Please attach your reference photo / PDF below in this chat.`

### Primitive 8: Store-Level Checkout Metadata Switches & Buyer Auto-Memory
Configurable in Settings (minimal defaults):
* `notice_banner`: Optional 1-line announcement at top of storefront (e.g., `"Order before 8 PM for next-day delivery"`).
* `needed_by` pills: Mandatory 1-tap `Today` | `Tomorrow` | `Pick Date` selector in checkout.
* `enable_time_slots`: Optional `Morning` | `Afternoon` | `Evening` pill row.
* `advance_policy_text`: Optional badge in checkout (e.g., `"50% UPI advance confirms your booking"`).
* `address_placeholder`: Customizable prompt (default `"Delivery address or special note"`; editable to `"Tower, Parking Slot & Car No."` or `"Pickup & Drop Address"`).
* `privacy_mode`: Neutralizes receipt headers to `"Consultation Receipt"` for therapists/advisors.
* **Buyer Auto-Memory:** Silently saves `{ name, phone, address }` in browser `localStorage` (`startlite_buyer_v1`) upon checkout with a subtle `"Remembered from last time · Clear"` chip.

### Primitive 9: Client-Side Viral & Retention Engine (HTML5 Canvas)
All visuals render 100% in the browser to PNG blobs (zero server CPU/storage):
1. **9:16 WhatsApp Status Menu Card (`720×1280`):** Auto-populates Business Name, top 6 In-Stock items with prices, scannable storefront QR, and StartLite footer.
2. **4:5 Printable Bag-Stuffer QR Flyer (`800×1000`):** *"Loved our service? Order directly on WhatsApp next time & save!"* + large store QR code.
3. **Shareable Bill/Receipt PNG (`720×auto`):** Clean digital receipt showing items, adjustments, deposits/reimbursements, paid vs. balance due, and UPI QR / Bank details (triggers Web Share API `navigator.share` on mobile or downloads PNG).
4. **1-Tap `Repeat Last Bill` & Polite `Udhaar` Reminders:** Clones a customer's latest order for Today with `paid = 0`, and generates warm EN / Hinglish WhatsApp payment reminders pre-filled with the merchant's UPI ID.

---

## 5. Production PostgreSQL Schema (RLS + Field-Level Encryption)

### Security & Encryption Specification (DPDPA 2023)
* **Encryption in Transit:** TLS 1.3 via Traefik.
* **Encryption at Rest:** LUKS volume encryption on host + **Server-Side Field-Level Encryption** in FastAPI using `cryptography.fernet.MultiFernet` (supports zero-downtime key rotation via `STARTLITE_MASTER_KEYS` env var).
* **Encrypted Columns (stored as `TEXT` ciphertext):** `customers.name_enc`, `customers.phone_enc`, `customers.address_enc`, `orders.customer_name_enc`, `orders.customer_phone_enc`, `orders.delivery_note_enc`.
* **Blind Index for Lookup:** Store `phone_hmac` (`HMAC-SHA256(normalized_phone, STARTLITE_HMAC_KEY)`) + `phone_last4` (`TEXT`) so the backend can deduplicate returning customers by phone number without storing plaintext phones in PostgreSQL.
* **Row-Level Security (RLS):** Every request middleware runs inside a transaction:
  `SELECT set_config('app.current_business_id', :business_id, true);`
  and connects using a non-superuser Postgres role (`startlite_app`) so RLS policies can never be bypassed.

### Complete SQL Schema

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TENANT BUSINESSES
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL, -- URL slug: startlite.in/b/{handle}
    business_name TEXT NOT NULL,
    category TEXT,
    locality TEXT,
    tagline TEXT,
    whatsapp_number TEXT NOT NULL, -- E.164 digits e.g., 919876543210
    upi_id TEXT NOT NULL, -- Plaintext VPA string e.g., anitasbakes@okhdfcbank
    -- Optional Bank Details (Primitive 1)
    show_bank_details BOOLEAN NOT NULL DEFAULT FALSE,
    bank_account_name TEXT,
    bank_account_number_enc TEXT, -- Encrypted
    bank_ifsc TEXT,
    -- Checkout & UX Switches (Primitive 8)
    default_lang TEXT NOT NULL DEFAULT 'en' CHECK (default_lang IN ('en', 'hi')),
    notice_banner TEXT,
    enable_time_slots BOOLEAN NOT NULL DEFAULT FALSE,
    advance_policy_text TEXT,
    address_placeholder TEXT DEFAULT 'Delivery address or special note',
    privacy_mode BOOLEAN NOT NULL DEFAULT FALSE,
    -- Monetization (₹101/year Prepaid Pass)
    trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
    pass_expires_at TIMESTAMPTZ, -- NULL if unpaid; set to NOW() + 365 days on ₹101 payment
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CUSTOMERS (Encrypted PII + Blind Index)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name_enc TEXT NOT NULL,
    phone_enc TEXT NOT NULL,
    phone_hmac TEXT NOT NULL, -- HMAC-SHA256 for exact dedup lookup
    phone_last4 TEXT NOT NULL, -- Masked display e.g., "3344"
    address_enc TEXT,
    sub_label TEXT, -- e.g., "Rohan - Class 10" (Parent vs Student)
    notes TEXT,
    last_paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (business_id, phone_hmac)
);

-- 3. CATALOG ITEMS (Products & Services)
CREATE TABLE catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subtitle TEXT, -- Short 1-line helper e.g., "Takes 5 days" or "Eggless"
    item_type TEXT NOT NULL DEFAULT 'product' CHECK (item_type IN ('product', 'service')),
    price_mode TEXT NOT NULL DEFAULT 'fixed' CHECK (price_mode IN ('fixed', 'starting_from', 'quote')),
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (base_price >= 0),
    unit_label TEXT DEFAULT 'unit', -- e.g., "1 kg", "hr", "sq.ft", "1k words"
    allow_decimal_qty BOOLEAN NOT NULL DEFAULT FALSE,
    customer_prompt TEXT, -- Optional 1-line question for buyer
    ask_whatsapp_media BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    slots_left INT CHECK (slots_left IS NULL OR slots_left >= 0), -- Optional seat/drop limit
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LEVEL-1 VARIANTS (Base Price Setters)
CREATE TABLE item_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
    group_label TEXT NOT NULL DEFAULT 'Option', -- e.g., "Weight", "Size", "Car Type"
    name TEXT NOT NULL, -- e.g., "1 kg", "Size M", "SUV"
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 5. LEVEL-2 SUB-VARIANTS (Global Add-Ons OR Variant-Scoped Specs)
CREATE TABLE item_subvariants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
    parent_variant_id UUID REFERENCES item_variants(id) ON DELETE CASCADE, -- NULL = applies to all variants
    group_label TEXT NOT NULL DEFAULT 'Add-on', -- e.g., "Dietary", "Color", "Extra"
    name TEXT NOT NULL, -- e.g., "Eggless", "Maroon", "With Lining"
    price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_multi_select BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 6. ORDERS / OPEN RUNNING TABS / QUOTES
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_code TEXT NOT NULL, -- Human-friendly e.g., "ORD-8921"
    status TEXT NOT NULL DEFAULT 'open_tab'
        CHECK (status IN ('quote', 'open_tab', 'ready', 'settled', 'cancelled')),
    source TEXT NOT NULL DEFAULT 'whatsapp_store'
        CHECK (source IN ('whatsapp_store', 'walk_in', 'repeated')),
    -- Encrypted snapshot of customer details on order
    customer_name_enc TEXT NOT NULL,
    customer_phone_enc TEXT NOT NULL,
    delivery_note_enc TEXT,
    -- Scheduling & Follow-up
    needed_by TEXT NOT NULL DEFAULT 'Today',
    time_slot TEXT, -- 'Morning' | 'Afternoon' | 'Evening' | NULL
    follow_up_date DATE, -- Optional reminder (e.g., 6-month pest control / AMC)
    progress_note TEXT, -- e.g., "4/10 sessions done" or "2 empty jars"
    -- Adjustments (Bargaining / Custom Extra)
    adjustment_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    adjustment_reason TEXT,
    -- Materialized Financial Totals (maintained atomically by backend service)
    revenue_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- standard items + adjustment
    non_revenue_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- deposits + reimbursements
    grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- revenue_subtotal + non_revenue_total
    paid_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tds_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Section 393(1) TDS reconciliation
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (business_id, order_code)
);

-- 7. ORDER LINE ITEMS (Immutable Financial Snapshots)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE SET NULL,
    line_kind TEXT NOT NULL DEFAULT 'standard'
        CHECK (line_kind IN ('standard', 'deposit', 'reimbursement')),
    item_name_snapshot TEXT NOT NULL,
    variant_snapshot TEXT,
    subvariants_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    customer_note TEXT,
    unit_label_snapshot TEXT DEFAULT 'unit',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(10, 2) GENERATED ALWAYS AS (ROUND(quantity * unit_price, 2)) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDER PAYMENTS (Multi-Installment + TDS Support)
CREATE TABLE order_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
    tds_deducted NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tds_deducted >= 0),
    payment_mode TEXT NOT NULL DEFAULT 'upi'
        CHECK (payment_mode IN ('upi', 'cash', 'bank', 'cheque')),
    note TEXT,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (amount > 0 OR tds_deducted > 0)
);

-- 9. SIMPLE EXPENSES (For Estimated Profit Calculation)
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PREPAID ₹101 PASS TRANSACTIONS
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 101.00,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'captured', 'failed')),
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES & ROW-LEVEL SECURITY (RLS)
-- ============================================================================
CREATE INDEX idx_customers_biz_hmac ON customers (business_id, phone_hmac);
CREATE INDEX idx_catalog_biz_avail ON catalog_items (business_id, is_available, sort_order);
CREATE INDEX idx_variants_item ON item_variants (item_id, sort_order);
CREATE INDEX idx_subvariants_item ON item_subvariants (item_id, parent_variant_id, sort_order);
CREATE INDEX idx_orders_biz_status_created ON orders (business_id, status, created_at DESC);
CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_payments_order ON order_payments (order_id);
CREATE INDEX idx_expenses_biz_date ON expenses (business_id, expense_date DESC);

-- Enable & Force RLS across all tenant-scoped tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'customers', 'catalog_items', 'item_variants', 'item_subvariants',
        'orders', 'order_items', 'order_payments', 'expenses', 'subscription_payments'
    ]
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);
        EXECUTE format(
            'CREATE POLICY tenant_isolation_%I ON %I USING (business_id = NULLIF(current_setting(''app.current_business_id'', true), '''')::uuid) WITH CHECK (business_id = NULLIF(current_setting(''app.current_business_id'', true), '''')::uuid);',
            tbl, tbl
        );
    END LOOP;
END $$;
```

---

## 6. UI / UX Information Architecture (Strict 5-Tab Layout)

### Merchant PWA Navigation (Bottom Tab Bar)
1. **Home (`Galla`):**
   * 4 KPI cards: `Today's Sales` (`Aaj ki Bikri`), `Money Received` (`Galla / Aaya`), `Money Pending` (`Baaki / Udhaar`), `Active Orders` (`Chalu Orders`).
   * Quick Actions: `+ Walk-in Sale`, `Share Store Link`, `Paste Magic Link`, `Export All Data (CSV)`.
   * Follow-up / Due Today strip (only appears if any orders have `follow_up_date <= TODAY`).
2. **Sales (`Bikri`):**
   * Filter pills: `All` | `Quotes` | `Pending` | `Paid`.
   * Each order card shows: Customer Name, `Needed By` pill, line items (with variants/sub-variants), `+ Extra / - Discount`, `Paid / Pending` strip, inline `+ Log Payment` (with hidden `+ TDS` link), `+ Edit / Add Item` (for Open Tabs), and 1-tap **`Send Bill on WhatsApp`** (text + Shareable PNG Receipt).
3. **Customers (`Khata`):**
   * Sorted by highest `Pending` balance first; displays `Last Paid` date and optional `sub_label`.
   * Two primary buttons per card: **`Repeat Last Bill`** (1-tap clone) and **`Polite Remind`** (warm EN/Hinglish WhatsApp message with UPI ID).
4. **Catalogue (`Samaan`):**
   * Top growth card: **Download 9:16 WhatsApp Status Menu Card (PNG)**.
   * Item list with instant 1-tap **`In Stock / Sold Out`** switch (and expandable variant stock switches).
   * `+ Add Item` sheet: defaults to just Name + Price + Product/Service; optional toggles for `+ Add Options (Variants/Sub-Variants)`, `Price Mode`, `Item Prompt`, and `Ask Photo on WhatsApp`.
5. **More:**
   * **Printable Bag-Stuffer QR Flyer (PNG)** generator.
   * **Simple Profit & Expenses:** `Estimated Profit = Standard Revenue Received - Expenses` (explicitly excludes refundable deposits & pass-through reimbursements).
   * **Store Profile & Checkout Switches:** Business Name, WhatsApp No., UPI ID, optional Bank A/C + IFSC, Notice Banner, Time Slots toggle, Advance Policy text, Privacy Mode, EN/Hinglish default.
   * **₹101/Year Prepaid Pass:** Status + 1-tap Razorpay UPI recharge.

### Customer Public Storefront (`/b/{handle}`)
* Single mobile-first view (`max-w-[460px] mx-auto`), zero login required.
* Displays Store Header, optional `Notice Banner`, Filter pills (`All | Products | Services`), and Catalog Cards.
* Items with variants/sub-variants open a clean **Option Bottom Sheet** showing Level-1 choices, Level-2 add-ons (with `+₹` deltas), and optional 1-line `customer_prompt` input.
* Floating Cart Bar → **Frictionless Checkout Drawer**:
  * Mandatory `Needed By` pills (`Today | Tomorrow | Pick Date`) + optional `Time Slot`.
  * `Name`, `WhatsApp Phone`, `Address/Note` (auto-filled from `localStorage` Auto-Memory).
  * 3-Tier UPI Payment Stack (QR + Copy UPI ID + Open UPI App + NPCI ₹2,000 warning).
  * Massive primary CTA: **`Send Order on WhatsApp`** (compiles formatted text + Base64 Magic Link + viral footer → redirects to `wa.me`).

---

## 7. API Endpoints Specification (FastAPI)

| Method & Path | Auth | Purpose |
|---|---|---|
| `GET /api/v1/public/store/{handle}` | Public (Cached) | Returns storefront metadata, active status (checks `trial_ends_at` / `pass_expires_at`), and full nested `items -> variants -> subvariants`. Zero PII returned. |
| `POST /api/v1/auth/signup` | Public | 60-second onboarding: creates business, hashes password (Argon2id), generates unique handle, starts 14-day trial. |
| `POST /api/v1/auth/login` | Public | Issues HttpOnly JWT access/refresh cookies. |
| `GET /api/v1/merchant/bootstrap` | Merchant JWT | Single-shot hydration payload for offline-first PWA (profile, catalog, recent orders, customers, expenses). |
| `POST /api/v1/merchant/catalog` | Merchant JWT | Creates/updates item + nested Level-1 variants & Level-2 sub-variants atomically. |
| `PATCH /api/v1/merchant/catalog/{id}/availability` | Merchant JWT | 1-tap toggle for item, variant, or sub-variant `is_available`. |
| `POST /api/v1/merchant/orders` | Merchant JWT | Creates order from Magic Link import, Walk-in Sale, Quote, or Repeat Last Bill. Encrypts PII & upserts customer via `phone_hmac`. |
| `PATCH /api/v1/merchant/orders/{id}` | Merchant JWT | Edits open tab (add/remove items, update adjustment, status, progress note, follow-up date) and recomputes `grand_total` atomically. |
| `POST /api/v1/merchant/orders/{id}/payments` | Merchant JWT | Logs partial/full payment + optional `tds_deducted`; auto-transitions status to `settled` when `paid_total + tds_total >= grand_total`. |
| `GET /api/v1/merchant/export.csv` | Merchant JWT | Streams decrypted UTF-8 CSV of all orders, line items, payments, TDS, and expenses. Allowed even if pass expired. |
| `POST /api/v1/billing/razorpay/create-order` | Merchant JWT | Creates ₹101 (`10100` paise) Razorpay order. |
| `POST /api/v1/billing/razorpay/webhook` | Razorpay HMAC | Verifies signature, records payment, extends `pass_expires_at` by 365 days. |

---

## 8. Phased Implementation Plan for Coding Agents

### Phase 1: Core Database, Security & Backend API
1. Initialize FastAPI project with strict Pydantic v2 models, SQLAlchemy 2.0 async engine, and Alembic migrations for the exact schema in Section 5.
2. Implement `CryptoService` (`MultiFernet` + `HMAC-SHA256` blind index) and unit-test encrypt/decrypt + key rotation.
3. Implement `TenantRLSMiddleware` setting `app.current_business_id` per DB session; write an automated cross-tenant isolation test proving Business A can never read/write Business B's rows even with raw SQL.
4. Implement atomic order financial calculation service using Python `Decimal` (`ROUND_HALF_UP`), covering `standard` vs. `deposit` vs. `reimbursement` lines and `tds_deducted` settlement.

### Phase 2: Customer Storefront & Base64 Magic Link Engine
1. Build `/b/:handle` mobile storefront with Level-1 Variant & Level-2 Sub-Variant bottom sheet, decimal quantity support, and 3-mode pricing (`fixed` / `starting_from` / `quote`).
2. Implement UTF-8 safe Base64URL Magic Link encoder/decoder (`startlite.in/accept?o=...`) with strict payload validation.
3. Implement Buyer `localStorage` Auto-Memory, `Needed By` date pills, 3-Tier UPI fallback stack (with NPCI ₹2,000 guardrail), and `wa.me` compiler.

### Phase 3: 5-Tab Merchant PWA, Offline Queue & Canvas Generators
1. Build the 5-tab Merchant PWA (`Home`, `Sales`, `Customers`, `Catalogue`, `More`) with EN / Hinglish dictionary toggle.
2. Implement IndexedDB offline queue for instant optimistic writes on flaky mobile networks.
3. Build client-side HTML5 Canvas generators for:
   * 9:16 WhatsApp Status Menu Card
   * 4:5 Printable Bag-Stuffer QR Flyer
   * Shareable Digital Receipt PNG
4. Wire up 1-tap `Export CSV` and Razorpay ₹101/year prepaid recharge + webhook.

---

## 9. Definition of Done & Verification Checklist

Before declaring any milestone complete, the coding agent must verify:
* [ ] **RLS Isolation Test Passes:** Cross-tenant read/update/delete returns 0 rows.
* [ ] **PII Encryption Test Passes:** Raw `SELECT` on `customers` and `orders` shows zero plaintext names, phone numbers, or addresses.
* [ ] **Exact Money Math Test Passes:** All totals (`quantity * unit_price + adjustment`), deposits, reimbursements, and TDS reconciliations pass with `Decimal` precision (zero float drift).
* [ ] **Variant Independence Test Passes:** Editing a catalog variant's price does **not** alter any historical `order_items` row.
* [ ] **Mobile UX Budget:** Storefront bundle loads fast on 3G/4G, fits `360px`–`430px` viewports cleanly without horizontal scroll, and requires **zero login** to send a WhatsApp order.
* [ ] **Strict Type & Lint Cleanliness:** `ruff check` + `pytest` pass on backend; `tsc --noEmit` + `vitest` pass on frontend.