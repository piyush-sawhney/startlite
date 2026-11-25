# Merchant Language

> Part of the StartLite docs. Start at [README](README.md).

- One word per idea, on every screen.
- The merchant's word wins over the accountant's word.
- Twelve words per label, twenty per sentence.

## Rules

1. Use the word a shopkeeper says, not the word a form says.
2. Use one word for one thing. Never two words for the same thing.
3. Use the second person: "Your order", not "The order".
4. Cap a label at 12 words. Cap a sentence at 20.
5. A number always states its period: Today, This month, or All.
6. A Hindi or Hinglish string must fit the same space as English.
7. Keep a financial term in English inside regional text, with a tooltip.

## Vocabulary

The left column is the concept. The right column is the only word the interface
may use.

| Concept | Use | Never use |
|---|---|---|
| The price list | Menu, Items, or Services | Catalogue, product list, SKU list |
| A first-level choice | Option | Variant, sub-product, attribute |
| A second-level choice | Extra | Sub-variant, modifier, add-on |
| A price list entry | Item | Product, SKU, listing |
| The document sent to a buyer | Bill | Invoice, receipt, tax invoice |
| Money still owed | Pending | Outstanding, receivable, due balance, Baaki |
| Money already received | Paid | Settled, cleared, realized |
| One payment | Payment | Transaction, receipt entry, settlement |
| A saved buyer order | Pending order | Draft order, cart, abandoned order |
| A bill that is not finished | Open tab | Running bill, KOT, open invoice |
| A refundable amount | Deposit | Advance, security, token |
| A pass-through cost | Reimbursement | Expense recovery, disbursement |
| Tax deducted by a client | TDS | Withholding, TDS amount |
| Money received minus expenses | Cash left | Profit, net profit, earnings |
| The full data file | Download | Export, dump, backup |
| The person or shop that took money | Paid to | Vendor, payee, supplier, beneficiary |
| A shop on StartLite | Shop | Store, outlet, tenant, business account |
| The public page | Store link | Microsite, webpage, catalog URL |
| A customer record | Customer | Client, party, account, contact |
| A shop's chosen set of defaults | Pack | Template, vertical, preset |
| The paid plan | Pass | Subscription, licence, plan |

## Tab labels

Six fixed tabs. The same six for every pack, guest or owner.

| Position | English | Hindi | Hinglish |
|---|---|---|---|
| 1 | Home | होम | Home |
| 2 | Orders | ऑर्डर | Orders |
| 3 | Customers | ग्राहक | Customers |
| 4 | Items | आइटम | Items |
| 5 | Expenses | खर्च | Expenses |
| 6 | Settings | सेटिंग्स | Settings |

The pack noun is retired. Food, grocery, tailoring, and repair shops all say
`Items`, because one vocabulary is cheaper than twelve. The pack still decides
starter items and default units; it no longer decides a label.

Marathi, Gujarati, and Tamil ship from the messages file. They are machine
translated and labelled beta until a native reviewer signs off.

## Buttons

One verb, one object. Never a sentence.

| Use | Never use |
|---|---|
| Add sale | Create new transaction, New order, Add order |
| Add item | Add a new catalog entry |
| Go to today | Back to today, Today chip |
| Send bill | Generate invoice |
| Send reminder | Notify customer |
| Log payment | Record payment entry |
| Review | Open pending order |
| Accept | Confirm and convert |
| Save | Submit |
| Download | Export data |
| Share | Publish |

## Status words

| Status | Shown as | Meaning |
|---|---|---|
| `under_review` | Under review | New request, merchant deciding |
| `waiting_client` | Waiting for client | Quote sent, awaiting confirmation |
| `accepted` | Accepted | Confirmed, work not started |
| `in_progress` | In progress | Work has started |
| `ready` | Ready | Work is done, money is not |
| `completed` | Completed | Work is done and money is in |
| `declined` | Declined | Merchant cannot fulfil |
| `cancelled` | Cancelled | Closed with no money |
| Pending order | New | Waiting for the merchant |

Never show the database value. Never show a status without a word.

## Money words

| Shown as | Meaning |
|---|---|
| Today's sales | Revenue of orders created today |
| Received today | Payments logged today |
| Pending | Unpaid amount across all open orders |
| Cash left | Payments on revenue lines minus expenses |
| This month | The current calendar month in IST |
| All | Every open record |

Always show the period next to the number. "Pending" with no period is a bug.

Never say "profit". The one allowed sentence is: "This is not profit."

## Errors

State what happened and what to do. Two sentences maximum.

| Situation | Message |
|---|---|
| Save failed | "Not saved. Check your connection and try again." |
| Bad price | "Enter a price above zero." |
| Order link expired | "This link has expired. Ask the buyer to send again." |
| Order already accepted | "This order is already in Sales." |
| Payment too large | "That is more than the amount due." |
| Offline | "You are offline. Saving needs a connection." |
| Store paused | "Your store is paused. Renew to make it live again." |
| Export failed | "Download failed. Try again in a minute." |

Never show a code, a stack trace, or the word "error" alone.

## Empty states

One sentence and one action.

| Screen | Text | Action |
|---|---|---|
| Sales | "No sales yet." | Add sale |
| Customers | "No customers yet." | Add previous due |
| Catalog | "Nothing here yet." | Add item |
| Pending orders | Hidden when empty | None |
| Expenses | "No expenses this month." | Add expense |

## Locale rules

The live and beta locale lists live in
[architecture.md](architecture.md#internationalization). Copy rules:

- A beta locale carries a badge and a report link.
- Keep the English term for money and status in a tooltip when the translation is
  uncertain.
- Do not translate a shop name, a person's name, a UPI ID, or an order code.
- Write numbers in Latin digits. Group them Indian style.
- A date is `18 Nov 2026`, never `11/18/2026`.
- Use the native script for Devanagari, Gujarati, and Tamil. Do not romanise
  those locales.
- `hi-Latn` is Hinglish: Hindi word order in Latin script, English for money and
  status.

## Forbidden words

| Word | Why |
|---|---|
| Ledger, journal, voucher, narration | Accounting software language |
| Receivable, payable, accrual | The merchant does not use these |
| Tenant, instance, workspace | Software language |
| Transaction | Sounds like a bank failure |
| Invoice | Implies GST. The product sends a bill. |
| Samaan, Galla, Khata, Bikri | Retired tab names |
| Baaki | Ambiguous between "due" and "left over" |
| Profit | Needs costs the app does not track |
| Sync, cache, cloud | Not the merchant's problem |

## Writing a new string

1. Find the concept in [the vocabulary table](#vocabulary).
2. Write the shortest sentence that keeps the meaning.
3. Read it aloud as a shopkeeper would.
4. Check it against the 12-word and 20-word caps.
5. Add it to every live locale file in the same pull request.
6. Test the longest string at 360 px.
