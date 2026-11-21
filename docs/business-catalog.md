# Business Catalog

> Part of the StartLite docs. Start at [README](README.md).

- Sixteen categories, three businesses each, three items each.
- One item per row. The variant sets the price. The sub variant adds a delta.
- Every business lists the flows its items take through the app.
- The full 200-business list is archived at
  [archive/business-catalog-200.md](archive/business-catalog-200.md).

## How to read a row

| Column | Meaning | Schema name |
|---|---|---|
| Item | What the shop sells. | `item` |
| Variant | First-level choice. It sets the price. | `item_option` |
| Sub Variant | Second-level choice. It adds a delta or scopes stock. | `item_extra` |
| What it should handle | The rule the flow cannot omit. | — |

## The seven flows

| Flow | Starts with | The app does | Ends |
|---|---|---|---|
| Counter | A tap on an item | Price, payment, no customer, no date | Settled |
| Order | A client request | Accept, fulfil, settle | Settled |
| Booking | A request with a date and a time | Confirm the time, serve, settle | Settled |
| Plan | A request with a count | Start date, attendance, bill | Settled or lapsed |
| Rental | A request with a date range | Deposit, hand over, return checklist | Settled |
| Job | An item that needs work | Serial or measurement, estimate, work, warranty | Settled |
| Project | An item that needs milestones | Brief, revisions, part payments | Settled |

A business uses one or more. An advance or a deposit is a step inside a flow, not
a separate flow. Time is a requested interval with a precision (`date`, `period`,
`window`, `exact`), never a fixed slot list. See
[data-model.md](data-model.md#requested-time).

## Coverage

| Category | Businesses |
|---|---|
| A. Food and drink | 3 |
| B. Bakery and sweets | 3 |
| C. Grocery and daily needs | 3 |
| D. Apparel and tailoring | 3 |
| E. Beauty and personal care | 3 |
| F. Health and wellness | 3 |
| G. Education and coaching | 3 |
| H. Repairs and technical | 3 |
| I. Home and property | 3 |
| J. Events, rentals and media | 3 |
| K. Creative and freelance | 3 |
| L. Retail and trading | 3 |
| M. Transport and gig work | 3 |
| N. Agriculture and rural | 3 |
| O. Pets and plants | 3 |
| P. Print, craft and making | 3 |
| **Total** | **48** |

## A. Food and drink

**Pack:** Food and tiffin · **Tab noun:** Menu · **Unit:** plate, box, piece

### 1. Home tiffin and dabba service

*Rules: monthly plan, lunch window, delivery route, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg thali | Half ₹90 · Full ₹110 | Extra phulka +₹8 · Less spicy +₹0 | Variant price, lunch window |
| Special thali | Half ₹130 · Full ₹150 | Extra paneer +₹30 | Variant price, lunch window |
| Monthly dabba pass | 5 days ₹500 · 7 days ₹700 · 14 days ₹1,400 | Veg +₹0 · Egg +₹150 | Plan length, start date, route |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Veg thali | Booking | request tomorrow, period lunch → accept → ₹110 due → route delivery → cash → settled |
| Monthly dabba pass | Plan | start Monday, 7 days, egg → ₹700 advance → attendance daily → bill at end |

### 2. Chai and snack stall

*Rules: quick sale, no customer, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chai | Cup ₹10 · Thermos 5 cups ₹70 | Less sugar +₹0 · Extra ginger +₹0 | Quick sale, no customer |
| Samosa | 1 piece ₹18 · 2 pieces ₹35 · 4 pieces ₹65 | Chutney +₹5 | Quick sale, quantity |
| Chai flask | 20 cups ₹280 | Extra ginger +₹0 | Order, pickup time |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Chai | Counter | tap Cup → ₹10 → UPI → done. No customer, no date. |
| Chai flask | Order | request 20 cups for 5 pm → accept → ₹280 advance → pickup → balance |

### 3. Event catering service

*Rules: event date, advance, per-plate quantity, deposit, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg plate | Standard ₹250 · Premium ₹350 | Extra sweet +₹20 · Jain +₹0 | Per-plate quantity, event date |
| Non-veg plate | Standard ₹400 · Premium ₹500 | Extra starter +₹40 | Per-plate quantity, event date |
| Live counter | Per counter ₹5,000 | Extra hour +₹1,500 | Event date, window, advance |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Veg plate | Booking | request 12 Dec, 150 plates, Jain → accept → 50% advance → event → balance → settled |
| Live counter | Booking | request date, 4-hour window → accept → ₹5,000 advance → setup at venue → extra hour billed |

## B. Bakery and sweets

**Pack:** Bakery and cakes · **Tab noun:** Menu · **Unit:** 500 g, 1 kg, piece

### 4. Home baker (celebration cakes)

*Rules: needed-by date, pickup window, advance, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chocolate truffle cake | 500 g ₹450 · 1 kg ₹850 | Eggless +₹50 · Extra ganache +₹80 | Variant price, message on cake |
| Birthday cake | 500 g ₹500 · 1 kg ₹950 | Eggless +₹50 · Photo print +₹150 | Custom text, photo upload |
| Cupcakes | Box of 6 ₹300 · Box of 12 ₹560 | Eggless +₹30 · Custom topper +₹40 | Box quantity, custom text |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Chocolate truffle cake | Booking | request Sat, exact 5 pm pickup, 1 kg, eggless, message → accept → 50% advance → bake → pickup → balance |
| Cupcakes | Order | request 12 with topper → accept → paid → delivery → settled |

### 5. Bread and rusk wholesaler

*Rules: stock, wholesale, route, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bread loaf | 400 g ₹40 · 800 g ₹70 | — | Quantity, wholesale |
| Rusk | 250 g ₹80 · 500 g ₹150 | Elaichi +₹0 · Jeera +₹0 | Quantity, wholesale |
| Shop supply | Daily ₹2,500 | Credit +₹0 | Route, credit, delivery |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Bread loaf | Order | shop requests 40 loaves → accept → 6 am route → credit → monthly settlement |
| Shop supply | Plan | daily ₹2,500 → credit → weekly settlement → repeats until stopped |

### 6. Wedding and tiered cake designer

*Rules: event date, 50% advance, photo reference, delivery and setup, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Two-tier cake | 2 kg ₹6,000 · 3 kg ₹8,500 | Eggless +₹300 · Fresh flowers +₹500 | Tier count, flavour per tier |
| Three-tier cake | 4 kg ₹12,000 · 5 kg ₹15,000 | Fondant +₹800 · LED stand +₹600 | Tier count, delivery and setup |
| Fondant topper | Small ₹800 · Large ₹1,500 | Custom figure +₹500 | Photo reference, custom text |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Two-tier cake | Booking | request event date, 2 kg, flowers → accept → 50% advance → deliver and set up → balance |
| Fondant topper | Order | photo reference → accept → make → courier → settled |

## C. Grocery and daily needs

**Pack:** Grocery · **Tab noun:** Items · **Unit:** g, kg, litre, packet

### 7. Kirana and general store

*Rules: quantity, credit, delivery, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Atta | 5 kg ₹240 · 10 kg ₹460 | Brand +₹0 | Quantity, stock |
| Milk | 500 ml ₹28 · 1 L ₹55 | Cow +₹5 · Buffalo +₹8 | Quantity, daily stock |
| Monthly kit | Standard ₹1,800 | Custom items +₹0 | Monthly bill, credit |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Atta | Order | request 10 kg → accept → delivery → add to monthly bill (credit) |
| Monthly kit | Plan | start on the 1st → deliver kit → bill at month end → paid |

### 8. Fruit and vegetable cart

*Rules: daily price, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tomato | 250 g ₹12 · 500 g ₹22 · 1 kg ₹40 | — | Daily price, quantity |
| Apple | 250 g ₹50 · 500 g ₹95 · 1 kg ₹180 | Kashmiri +₹40 | Daily price, quantity |
| Mixed basket | Small ₹150 · Large ₹280 | — | Quantity, delivery |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Tomato | Counter | set the morning price ₹40/kg → weigh 1 kg → cash → done |
| Mixed basket | Order | request large → accept → pack → delivery ₹30 → settled |

### 9. Water can supplier

*Rules: deposit, route, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 20 L water can | 1 can ₹60 · 5 cans ₹290 · 10 cans ₹560 | — | Quantity, route, deposit |
| Dispenser rental | Monthly ₹500 | Hot and cold +₹200 | Monthly, deposit |
| Monthly pass | 20 cans ₹1,000 | — | Monthly, route |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| 20 L water can | Order | request 5 cans → accept → route → ₹290 plus ₹350 deposit if the can is new → cash |
| Monthly pass | Plan | 20 cans for the month → route → bill at month end |

## D. Apparel and tailoring

**Pack:** Tailoring · **Tab noun:** Services · **Unit:** piece, set

### 10. Blouse tailor

*Rules: measurement, needed-by date, advance, trial*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Blouse stitching | Simple ₹450 · Designer ₹650 | Lining +₹100 · Padded +₹80 · Back design +₹150 | Measurement, date, advance |
| Saree fall | Plain ₹80 · Designer ₹150 | — | Quick sale, same day |
| Bridal blouse | ₹2,500 | Heavy work +₹1,000 | Measurement, advance, date |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Blouse stitching | Job | measure → date → ₹200 advance → trial → pickup → balance |
| Saree fall | Counter | drop the saree → ₹80 → same-day pickup |

### 11. Saree and lehenga reseller (social)

*Rules: photo, courier, COD, return*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Saree | Cotton ₹1,800 · Silk ₹3,500 | With blouse +₹800 · Stitched +₹1,200 | Photo, courier, COD |
| Lehenga | Semi-stitched ₹8,500 · Bridal ₹18,000 | Custom size +₹1,500 | Photo, courier, advance |
| Dupatta | ₹650 | — | Stock, courier |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Saree | Order | client picks a photo → accept → courier → COD → settled |
| Lehenga | Order | request size → accept → 50% advance → courier → balance |

### 12. Laundry and dry cleaning

*Rules: quantity, pickup, delivery, stain note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shirt wash and iron | Single ₹25 · 10 pieces ₹220 | Starch +₹5 | Quantity, pickup, delivery |
| Dry clean saree | Single ₹180 | Heavy work +₹80 | Stain note, delivery |
| Monthly plan | 20 pieces ₹550 | — | Monthly, pickup |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Shirt wash and iron | Order | pickup 10 shirts → count → wash → delivery → ₹250 → settled |
| Monthly plan | Plan | 20 pieces a month → weekly pickup → attendance → monthly bill |

## E. Beauty and personal care

**Pack:** Beauty and salon · **Tab noun:** Services · **Unit:** visit, session

### 13. Ladies parlour

*Rules: appointment time, package, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Threading | Eyebrow ₹40 · Upper lip ₹30 · Full face ₹120 | — | Quick sale, repeat |
| Facial | Basic ₹650 · Premium ₹950 | Fruit +₹0 · Gold +₹200 | Appointment, package |
| Bridal package | ₹8,000 | Trial +₹1,500 | Advance, event date, trial |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Facial | Booking | request Sat, exact 11:00 → accept → ₹650 due → visit → UPI → settled |
| Threading | Counter | walk in → ₹40 → cash → done |

### 14. Bridal makeup artist

*Rules: event date, exact time, advance, travel expense, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bridal makeup | HD ₹12,000 · Airbrush ₹15,000 | Draping +₹1,000 · Hair +₹1,500 | Event date, time, advance |
| Engagement makeup | ₹5,000 | Hair styling +₹800 | Event date, time |
| Guest makeup | ₹1,500 | Hair +₹500 | Event date, travel |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Bridal makeup | Booking | request 12 Dec, exact 4 am, venue address → accept → ₹6,000 advance → trial → event → balance |
| Guest makeup | Booking | request 5 guests → accept → travel ₹300 → done on the day → paid |

### 15. Gents barber shop

*Rules: walk-in queue, quick sale, monthly pass*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Haircut | Senior ₹120 · Junior ₹100 | Beard +₹80 · Head massage +₹50 | Quick sale, queue |
| Beard grooming | Trim ₹80 · Hot towel ₹120 | Beard colour +₹100 | Quick sale |
| Monthly pass | 4 haircuts ₹400 | — | Plan, expiry |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Haircut | Counter | walk in → queue position → ₹120 → cash → done |
| Monthly pass | Plan | ₹400 → start date → each visit marked → expires in 60 days |

## F. Health and wellness

**Pack:** Health and wellness · **Tab noun:** Services · **Unit:** session, month

### 16. Yoga instructor

*Rules: monthly fee, batch time, attendance, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Morning batch | Monthly ₹1,800 | 3 days +₹0 · 5 days +₹400 | Plan, time, attendance |
| One-to-one session | ₹600 | Online +₹0 · Home +₹200 | Appointment, package |
| Workshop | ₹3,000 | — | Date, advance |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Morning batch | Plan | start 1st, 5 days a week → ₹1,800 → attendance daily → renew at month end |
| One-to-one session | Booking | request Tue, window 6–7 → accept → ₹600 → session → settled |

### 17. Physiotherapist (home visit)

*Rules: address, appointment, package expiry, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Home session | 30 min ₹600 · 45 min ₹800 | — | Address, appointment, privacy |
| Session pack | 5 sessions ₹2,800 · 10 sessions ₹5,000 | — | Plan, expiry |
| Assessment | ₹1,000 | — | Appointment, follow-up |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Home session | Booking | request tomorrow, window 10–11, address → accept → ₹800 → visit → paid |
| Session pack | Plan | ₹2,800 → start date → 5 visits marked → expires in 45 days |

### 18. Home nursing

*Rules: shift, monthly fee, attendance, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shift | 8 hours ₹1,200 · 12 hours ₹1,700 · 24 hours ₹2,500 | — | Shift, attendance, privacy |
| Monthly care | ₹25,000 | Night +₹5,000 | Plan, attendance |
| Procedure visit | ₹800 | Injection +₹200 | Appointment, privacy |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Shift | Booking | request 12-hour night shift from Monday → accept → ₹1,700 a day → attendance → weekly bill |
| Monthly care | Plan | ₹25,000 a month → attendance daily → bill at month end |

## G. Education and coaching

**Pack:** Tutoring · **Tab noun:** Services · **Unit:** month, class

### 19. School tuition

*Rules: monthly fee, attendance, fee reminder*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Maths tuition | Group ₹1,500/month · One-to-one ₹3,000/month | 3 days +₹0 · 5 days +₹500 | Plan, attendance, reminder |
| Science tuition | Group ₹1,500/month · One-to-one ₹3,000/month | 3 days +₹0 · 5 days +₹500 | Plan, attendance |
| Test series | ₹500 | — | Date, custom text |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Maths tuition | Plan | start June, group, 3 days → ₹1,500 → attendance → reminder on the 1st |
| Test series | Order | request 10 tests → accept → ₹500 → tests dated → settled |

### 20. Driving school

*Rules: course, time window, instalments, RTO expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 20-day course | 4-wheeler ₹4,500 · 2-wheeler ₹3,000 | — | Plan, time, instalments |
| RTO assistance | ₹1,800 | — | Expense, date |
| Refresher course | 7 days ₹2,200 | — | Plan, time |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| 20-day course | Plan | request start date, morning window → accept → ₹2,000 advance → 20 sessions marked → balance |
| RTO assistance | Order | ₹1,800 → RTO expense tracked → licence date → settled |

### 21. Study library and reading room

*Rules: monthly fee, seat, attendance, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly seat | ₹1,200 | AC +₹400 · Non-AC +₹0 | Plan, seat, attendance |
| Locker | Monthly ₹150 | — | Deposit, monthly |
| Exam season pass | 3 months ₹3,000 | — | Plan, expiry |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Monthly seat | Plan | start 1st, AC → ₹1,200 plus ₹300 registration → attendance → renew |
| Exam season pass | Plan | ₹3,000 → start date → seat assigned → expires after 3 months |

## H. Repairs and technical

**Pack:** Repairs · **Tab noun:** Services · **Unit:** job, piece

### 22. Mobile repair

*Rules: serial note, estimate, warranty, part advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Screen replacement | Original ₹2,800 · Compatible ₹1,400 | — | Serial, warranty, advance |
| Battery replacement | Original ₹1,800 · Compatible ₹850 | — | Serial, warranty |
| Tempered glass | ₹120 | — | Counter |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Screen replacement | Job | serial and model → estimate ₹2,800 → ₹1,000 advance → repair → 3-month warranty → balance |
| Tempered glass | Counter | ₹120 → fitted → paid |

### 23. AC service and installation

*Rules: appointment, warranty, season, AMC*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | 1 unit ₹600 · 2 units ₹1,100 | — | Appointment, season |
| Gas refill | ₹2,500 | — | Appointment, warranty |
| Annual maintenance | 2 visits ₹1,800 | — | Plan, follow-up |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Service | Booking | request Sat, window 10–12, 2 units → accept → ₹1,100 → visit → paid |
| Annual maintenance | Plan | ₹1,800 → two visits scheduled → attendance → renew next summer |

### 24. Car mechanic and garage

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹1,500 | — | Serial, estimate |
| Clutch | ₹6,500 | — | Serial, estimate, warranty |
| Dent paint | Per panel ₹2,500 | — | Serial, estimate, pickup |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Service | Job | serial → estimate ₹1,500 → pickup → work → warranty → paid |
| Dent paint | Job | estimate per panel ₹2,500 → approval → work → delivery → paid |

## I. Home and property

**Pack:** Home services · **Tab noun:** Services · **Unit:** visit, room

### 25. Deep cleaning

*Rules: address, appointment window, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Deep cleaning | 1BHK ₹1,800 · 2BHK ₹2,800 · 3BHK ₹3,800 | — | Address, window |
| Kitchen cleaning | ₹1,200 | — | Window, expense |
| Bathroom cleaning | ₹600 | — | Window, quantity |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Deep cleaning | Booking | request Sat, window 9–12, 2BHK → accept → ₹2,800 → team arrives → paid |
| Kitchen cleaning | Booking | add ₹1,200 to the same visit → paid with the main job |

### 26. Packer and mover

*Rules: quote, date, inventory, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local shifting | 1BHK ₹8,000 · 2BHK ₹14,000 · 3BHK ₹20,000 | Packing +₹2,000 | Quote, date, inventory |
| Vehicle only | ₹4,000 | — | Quote, date |
| Insurance | 2% of value | — | Deposit, custom text |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Local shifting | Job | site survey → quote ₹14,000 → date → ₹5,000 advance → inventory list → move → balance |
| Insurance | Order | 2% of declared value → added to the quote → settled with the bill |

### 27. Interior designer

*Rules: milestones, site visit, vendor expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Full home design | 2BHK ₹60,000 · 3BHK ₹85,000 | — | Project, site visit |
| Room design | Per room ₹25,000 | — | Project, measurement |
| Consultation | ₹2,500 | — | Appointment, follow-up |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Full home design | Project | site visit → brief → ₹60,000 → 30/40/30 milestones → revisions → handover |
| Consultation | Booking | request Sat, exact 11:00 → accept → ₹2,500 → visit → written report |

## J. Events, rentals and media

**Pack:** Rentals and events · **Tab noun:** Items · **Unit:** day, event

### 28. Tent house

*Rules: per day, deposit, return checklist, damage charge*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chair | Per day ₹12 | — | Per day, quantity, deposit |
| Tent | 20x20 ₹2,500 · 30x30 ₹4,500 | — | Per day, deposit, date |
| Crockery set | Per plate ₹8 | — | Per day, quantity, return checklist |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Tent | Rental | request 20x20 for 12 Dec → accept → ₹2,500 plus ₹2,000 deposit → deliver → return checklist → deposit back |
| Crockery set | Rental | 100 plates → return count → shortage billed at ₹8 a plate |

### 29. Event photographer

*Rules: event date, advance, delivery date, photo count*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Half day | 4 hours ₹8,000 | — | Date, advance |
| Full day | ₹15,000 | — | Date, advance |
| Album | ₹4,000 | 20 pages +₹2,000 | Photo count, delivery date |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Half day | Booking | request 12 Dec, window 4–8 pm → accept → ₹4,000 advance → shoot → delivery date → balance |
| Album | Order | 20 pages ₹4,000 → design → print → courier → settled |

### 30. Wedding planner

*Rules: event date, instalments, vendor expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Partial planning | ₹15,000 | — | Date, instalments |
| Full planning | ₹50,000 | — | Project, instalments, expense |
| Day coordination | ₹10,000 | — | Date, time |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Full planning | Project | date → ₹50,000 → three instalments → vendor expenses tracked → event → settled |
| Day coordination | Booking | event date, exact 8 am → accept → ₹10,000 → on-site → paid |

## K. Creative and freelance

**Pack:** Freelance · **Tab noun:** Services · **Unit:** project, page, post

### 31. Graphic designer

*Rules: brief, revisions, milestones, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Logo design | Basic ₹3,500 · Premium ₹7,000 | Two extra revisions +₹1,500 · Source file +₹1,000 | Project, revisions |
| Social post | ₹400 | Carousel +₹200 | Brief, date |
| Packaging design | ₹1,800 | Mockup +₹600 | Project, revisions |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Logo design | Project | brief → ₹3,500 → two revisions → source file +₹1,000 → final → paid |
| Social post | Order | ₹400 → brief → draft → approved → paid |

### 32. Content writer

*Rules: per word, deadline, revisions, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Blog post | ₹1,200 | SEO +₹400 | Deadline, revisions |
| Website copy | Per page ₹3,000 | — | Deadline, revisions |
| Product description | ₹250 | Bulk 10 +₹0 | Quantity, deadline |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Blog post | Project | brief → 1,200 words → deadline → one revision → paid |
| Product description | Order | 10 descriptions ₹2,500 → deadline → approved → paid |

### 33. Mural painter

*Rules: quantity, site visit, advance, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Wall mural | Per sqft ₹120 | Ceiling +₹80 | Quantity, site visit |
| Exterior mural | Per sqft ₹150 | Height +₹50 | Quantity, site visit, advance |
| Design fee | ₹3,000 | — | Brief, advance |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Wall mural | Job | site visit → 400 sqft at ₹120 → quote ₹48,000 → 50% advance → paint → balance |
| Design fee | Order | ₹3,000 → concept → approved → adjusted against the job |

## L. Retail and trading

**Pack:** None today. Closest is Grocery with the noun Items. See [coverage gaps](#coverage-gaps). **Unit:** piece, sqft

### 34. Electronics shop

*Rules: serial note, warranty, EMI, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fan | ₹1,800 | — | Serial, warranty |
| Television | 32 inch ₹18,000 · 43 inch ₹28,000 | — | Serial, warranty, delivery |
| Refrigerator | 190 L ₹18,000 · 250 L ₹24,000 | — | Serial, warranty, delivery |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Fan | Counter | ₹1,800 → serial recorded → warranty card → paid |
| Television | Order | 43 inch ₹28,000 → accept → delivery → installation → serial → paid |

### 35. Jewellery shop

*Rules: weight, old gold exchange, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chain | 10 g ₹25,000 | — | Weight, certificate |
| Ring | 3 g ₹8,000 | — | Weight, old gold exchange |
| Gold coin | 1 g ₹6,500 · 5 g ₹32,000 | — | Weight, certificate |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Chain | Counter | weigh 10 g → ₹25,000 → certificate → paid |
| Ring | Order | 3 g ₹8,000 → old gold at ₹5,500/g → balance → certificate |

### 36. Optical shop

*Rules: prescription, fitting date, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Frame | ₹1,200 | — | Prescription, stock |
| Lens | Single vision ₹800 · Progressive ₹2,500 | Anti-glare +₹400 | Prescription, fitting date |
| Sunglasses | ₹1,500 | — | Stock, warranty |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Lens | Job | prescription → fitting date → anti-glare ₹1,200 → pickup → paid |
| Sunglasses | Counter | ₹1,500 → warranty → paid |

## M. Transport and gig work

**Pack:** None today. See [coverage gaps](#coverage-gaps). **Unit:** trip, shift, day

### 37. Delivery rider

*Rules: per trip, fuel expense, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Food delivery | Per order ₹35 | Peak +₹10 · Long distance +₹15 | Per trip, expense |
| Grocery delivery | Per order ₹45 | Heavy +₹20 | Per trip |
| Daily target | 10 orders ₹350 | — | Day, daily cash left |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Food delivery | Counter | order assigned → pickup → drop → ₹35 → cash or UPI → done |
| Daily target | Plan | 10 orders a day → ₹350 → day close → cash left recorded |

### 38. Cab driver

*Rules: per km, toll expense, EMI*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local ride | Per km ₹12 | Waiting +₹2 per km | Per km |
| Outstation | Per day ₹2,500 | Driver allowance +₹400 | Day, expense |
| Airport transfer | ₹800 | — | Per trip |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Local ride | Counter | 8 km at ₹12 → ₹96 → UPI → done |
| Outstation | Booking | request 12 Dec, exact 6 am → accept → ₹2,500 a day plus ₹400 allowance → tolls tracked → settled |

### 39. Homestay host

*Rules: per night, date range, deposit, ID*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Room | Per night ₹2,500 | Extra guest +₹500 | Nights, date range |
| Full home | Per night ₹6,000 | — | Nights, deposit |
| Breakfast | ₹150 | — | Quantity |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Room | Rental | request 12–14 Dec, 2 guests → accept → ₹5,000 plus ₹2,000 deposit → ID note → check-in → check-out |
| Breakfast | Order | ₹150 a guest → served → added to the stay bill |

## N. Agriculture and rural

**Pack:** Grocery · **Tab noun:** Items · **Unit:** kg, quintal, acre

### 40. Farmer (direct produce)

*Rules: quantity, daily price, delivery, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tomato | Per kg ₹40 | Grade A +₹10 | Quantity, daily price |
| Wheat | Per kg ₹30 | — | Quantity, wholesale |
| Seasonal box | Small ₹300 · Large ₹500 | — | Quantity, delivery |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Tomato | Order | set the day price ₹40/kg → 50 kg → accept → delivery → paid or credit |
| Seasonal box | Order | request large → accept → pack → delivery → settled |

### 41. Tractor and harvester rental

*Rules: per hour, fuel expense, operator*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Hourly hire | Per hour ₹1,200 | Operator +₹300 | Per hour |
| Daily hire | Per day ₹8,000 | — | Per day |
| Harvester | Per acre ₹1,800 | — | Quantity |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Hourly hire | Rental | request 4 hours → accept → ₹1,200 an hour plus ₹300 operator → fuel tracked → bill |
| Harvester | Job | 5 acres at ₹1,800 → advance → harvest → balance |

### 42. Dairy farmer

*Rules: quantity, route, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Milk | Per litre ₹55 | Cow +₹10 · Buffalo +₹5 | Quantity, route |
| Curd | Per kg ₹80 | — | Quantity, route |
| Monthly milk pass | 30 litres ₹1,500 | — | Plan, route |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Milk | Order | 2 litres daily → route → monthly bill |
| Monthly milk pass | Plan | ₹1,500 for 30 litres → start date → route → bill at month end |

## O. Pets and plants

**Pack:** Pets and other · **Tab noun:** Items · **Unit:** visit, kg, piece

### 43. Pet grooming

*Rules: appointment, pet note, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bath | Small ₹700 · Medium ₹900 · Large ₹1,200 | — | Appointment, pet note |
| Full groom | Small ₹1,400 · Medium ₹1,800 · Large ₹2,300 | Nail trim +₹350 · Ear clean +₹200 | Appointment, photo |
| Nail trim | ₹350 | — | Counter |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Full groom | Booking | request Sat, exact 11:00, pet note → accept → ₹1,400 → groom → photo → paid |
| Nail trim | Counter | walk in → ₹350 → cash → done |

### 44. Pet boarding

*Rules: per day, date range, vaccination note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Per day | Small ₹600 · Large ₹900 | Food included +₹150 | Nights, date range |
| Weekly stay | ₹4,000 | — | Nights, date range |
| Day care | ₹400 | — | Day |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Per day | Rental | request 12–15 Dec → vaccination note → ₹600 a night → check-in → check-out |
| Day care | Rental | ₹400 → same-day drop and pickup → paid |

### 45. Plant nursery

*Rules: stock, delivery, care note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Areca palm | ₹250 | Pot +₹220 | Stock |
| Compost | 5 kg ₹180 | — | Quantity |
| Pot | 8 inch ₹220 | — | Stock |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Areca palm | Counter | ₹250 plus pot ₹220 → paid → done |
| Compost | Order | 5 kg ₹180 → accept → delivery → paid |

## P. Print, craft and making

**Pack:** None today. Closest is Freelance for services and Pets and other for goods. See [coverage gaps](#coverage-gaps). **Unit:** piece, sqft

### 46. Printing press

*Rules: quantity, proof, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Visiting card | 100 ₹300 · 500 ₹1,200 | — | Quantity, proof |
| Letterhead | 500 ₹1,500 | — | Quantity, proof |
| Bill book | 100 ₹600 | — | Quantity, custom text |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Visiting card | Job | 500 cards ₹1,200 → proof → approve → print → delivery |
| Bill book | Job | 100 books ₹600 → custom text → proof → delivery |

### 47. T-shirt printing

*Rules: bulk tiers, size mix, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| T-shirt | 1 to 9 ₹350 · 10 or more ₹280 | Back print +₹50 | Quantity, size mix |
| Hoodie | 1 to 9 ₹850 · 10 or more ₹750 | — | Quantity, size mix |
| Corporate order | 50 pieces ₹12,000 | — | Advance, proof |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| T-shirt | Job | 20 pieces at ₹280 → size mix → date → print → delivery → paid |
| Corporate order | Order | 50 pieces ₹12,000 → 50% advance → proof → delivery → balance |

### 48. Candle maker

*Rules: stock, courier, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Jar candle | ₹380 | Scent +₹50 | Stock |
| Gift box | ₹850 | — | Quantity, festival |
| Custom candle | ₹450 | Custom text +₹80 | Custom text, courier |

**Flows**

| Item | Flow | Steps |
|---|---|---|
| Jar candle | Counter | ₹380 → stock → paid |
| Gift box | Order | ₹850 → accept → courier → paid |

## Coverage gaps

Three categories have no pack. The twelve packs cover 39 of the 48 businesses.

| Category | Rows | Closest pack today | Problem |
|---|---|---|---|
| Retail and trading | 34–36 | Grocery, noun Items | Grocery implies food. An electronics or jewellery shop is not a kirana. |
| Transport and gig work | 37–39 | None | A rider, driver, or homestay host has no catalog. The unit is a trip, shift, or night. |
| Print, craft and making | 46–48 | Freelance for services, Pets and other for goods | Two workflows in one row set: a print shop quotes a job, a craft maker holds stock. |

Agriculture fits Grocery. It sells by weight and price changes daily, which the
Grocery pack already handles.

### Pack proposals

| Gap | Proposal | Noun | Why |
|---|---|---|---|
| Retail | Widen Grocery into **Grocery and retail** | Items | Same flow: stock, quantity, price, delivery. Only the starter items differ. |
| Transport and gig | New pack **Rides and errands** | Trips | The catalog is a rate card of trips, not items. The bill is a trip receipt. |
| Print and craft | Split: print shops join **Freelance**, craft makers join **Pets and other** | Services / Items | A print shop sells a quoted job. A candle maker sells stock. |

The transport gap matters most. It is three of the 48 rows, and it includes the
gig worker and the delivery rider from the brief.

### Primitive gaps

Most of the fourth-column rules already exist as a primitive. Two do not.

| Rule | Row | Gap |
|---|---|---|
| Bulk tiers | 47 | A quantity price break, for example 350 a piece, 280 at 10 or more. A variant sets one price. It cannot set a tier. |
| Queue | 15 | A walk-in queue for a barber. Appointments cover a confirmed time, not a waiting line. |

Do not build either until a paying merchant asks. Record them in
[decisions.md](decisions.md#open-questions) when that happens.

## How this feeds the build

1. **Starter items.** Each pack takes its three chips from the rows above.
2. **Pack inference.** The business names, item names, and sub variants are the
   keyword table. `cake` maps to bakery, `screen` to repairs, `mural` to
   freelance.
3. **Test corpus.** Every business is one assertion: the first item name must
   infer the row's pack. The full 200-business list in
   [archive/business-catalog-200.md](archive/business-catalog-200.md) is the
   larger corpus.

### Worked inference examples

| Typed by the merchant | Infer | Unit | Why |
|---|---|---|---|
| `Chocolate cake 500 g` | Bakery and cakes | 500 g | Two keywords, one unit hint. |
| `Screen replacement` | Repairs | piece | Strong keyword, no competing pack. |
| `Bridal mehendi` | Beauty and salon | visit | Strong keyword. |
| `Bulk order 20 t-shirts` | Print, craft and making | piece | `t-shirt` is the only match. |
| `Ramesh` | None | — | No keyword. The app stays neutral. |

## What this document does not cover

- **Customer profiles.** The 50 narrative profiles stay in
  [50-micro-businesses.md](50-micro-businesses.md).
- **Localisation.** Item names here are English. The keyword table needs the
  Hindi and Hinglish tokens for each live locale.
- **Regulated trades.** Pharmacy, liquor, and insurance need a licence check
  that v1 does not do. They are out of scope.
