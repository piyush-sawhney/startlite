# Economics

> Part of the StartLite docs. Start at [README](README.md).

- ₹111 net per shop per quarter. ₹130.98 with GST.
- The model works on volume, not on price.
- Every number here is a plan, not a result.

## Price anatomy

| Item | Per quarter | Per year |
|---|---|---|
| Net price | ₹111.00 | ₹444.00 |
| GST at 18% | ₹19.98 | ₹79.92 |
| **Charged to the merchant** | **₹130.98** | **₹523.92** |

StartLite keeps ₹111 per quarter. The ₹19.98 is collected for the government and
is not revenue.

The trial is 90 days with full features. A merchant pays for the next 90 days
before it starts, so cash arrives ahead of service.

## Revenue at 10,000 shops

| Line | Amount per year |
|---|---|
| Gross collected | ₹52.39 lakh |
| GST remitted | ₹7.99 lakh |
| **Net revenue** | **₹44.40 lakh** |

## Cost base

| Item | Per year | Note |
|---|---|---|
| Tools and infrastructure | ₹30,000 | The VPS is already paid. Backups, domain, and email. |
| Support | ₹1.30 lakh | 6,000 tickets at about ₹22 each |
| Manual renewals | ₹4.00 lakh | 40,000 renewals at 2 minutes, valued at ₹300 per hour |
| **Total** | **₹5.60 lakh** | |

Support assumes 5 tickets per 100 shops per month, which is the target in
[product.md](product.md#success-metrics).

## Unit economics

| Metric | Value |
|---|---|
| Net revenue per shop per year | ₹444 |
| Support per shop per year | ₹13 |
| Renewal time per shop per year | ₹40 |
| Tools per shop per year | ₹3 |
| **Contribution per shop per year** | **₹388** |
| **Margin before marketing** | **87%** |

The margin is high because the product is software and the price is low. The risk
is not margin. The risk is volume and support load.

## Break-even

| Case | Shops needed | Working |
|---|---|---|
| Tools only, on the owner's paid VPS | About 70 | ₹30,000 ÷ ₹444 |
| Tools and infrastructure at market rates | About 350 | ₹1.55 lakh ÷ ₹444 |
| Infrastructure plus one ₹12 lakh salary | About 3,050 | ₹13.55 lakh ÷ ₹444 |

Market-rate infrastructure means a 2 vCPU, 4 GB VPS in India, managed backups, and
a paid email tier. At ₹1.55 lakh per year, it costs about ₹13,000 per month.

The first case is the real one today. The second and third are what the business
must clear to pay a salary.

## Growth math

The trial converts at 15%. That is the planning number.

| Goal | Trials needed |
|---|---|
| 1,000 paying shops | 6,700 |
| 5,000 paying shops | 33,300 |
| 10,000 paying shops | 66,700 |

At 3% monthly churn, 10,000 shops lose 300 shops a month. To stand still, the
business needs 2,000 trials a month, or about 67 a day.

### Lifetime value

| Assumption | Value |
|---|---|
| Net revenue per year | ₹444 |
| Annual churn | 30% |
| **Lifetime value** | **About ₹1,480** |
| Maximum sensible acquisition cost | About ₹400 |

At ₹1,480 of lifetime value, paid ads must stay under ₹400 per paying shop. That
is hard in India at this price. The plan is organic growth: every storefront,
bill, and reminder carries the referral line.

## Cash timing

| Event | Cash effect |
|---|---|
| Merchant pays ₹130.98 | Cash in today |
| Service is delivered | Revenue earned over 90 days |
| GST is remitted | Cash out next month or quarter |
| Refund | Rare, manual, and recorded |

Prepaid quarters mean the business is always funded by the next quarter of
revenue. Do not spend a full year of collected cash as if it were earned.

## Sensitivity

| Shops | Net revenue | Costs | Margin |
|---|---|---|---|
| 1,000 | ₹4.44 lakh | ₹0.83 lakh | 81% |
| 3,000 | ₹13.32 lakh | ₹1.89 lakh | 86% |
| 10,000 | ₹44.40 lakh | ₹5.60 lakh | 87% |
| 25,000 | ₹1.11 crore | ₹13.85 lakh | 88% |

At 1,000 shops the business pays for itself but pays no salary. At about 3,100
shops it covers one salary of ₹12 lakh. Below 1,000 shops it is a side project.

## What would break the model

| Risk | Effect | Guardrail |
|---|---|---|
| Support above 10 tickets per 100 shops | Cost per shop triples | Fix the screen that causes the ticket |
| Churn above 5% a month | Lifetime value falls below ₹900 | Watch week-4 retention, not signups |
| Paid acquisition above ₹400 | Every shop loses money | Organic only until proven |
| Email tier jump | ₹30,000 becomes ₹1 lakh | OTP at three moments only |
| Discounting to win a shop | Price war at ₹50 a quarter | No discount below ₹111 net |

## Pricing guardrails

1. The net price never falls below ₹111 per quarter.
2. GST is always shown as a separate line on the tax invoice.
3. There is no annual plan in v1. Four quarters is the annual price.
4. There is no per-order fee. The merchant keeps every rupee of a sale.
5. A refund is manual and needs an owner decision.
6. A price change needs a new decision in [decisions.md](decisions.md).

## Open numbers

These are guesses until the first 1,000 shops.

| Number | Guess | Check at |
|---|---|---|
| Trial to paid | 15% | 1,000 trials |
| Monthly churn | 3% | 1,000 paying shops |
| Tickets per 100 shops | 5 | 500 paying shops |
| Renewal time | 2 minutes | 500 activations |
| Support cost per ticket | ₹22 | 1,000 tickets |
