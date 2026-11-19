# Category Packs

> Part of the StartLite docs. Start at [README](README.md).

- One product serves 100+ categories through twelve packs.
- A pack changes words, defaults, and starter items.
- A pack never changes the data model.

## Why packs

A tiffin service and a tailor use the same ledger. They do not use the same words.
"Menu" is right for one and wrong for the other. A pack is a small bundle of
defaults that makes the product feel made for the shop.

A pack has four jobs:

1. Name the catalog tab: Menu, Items, or Services.
2. Suggest three starter items.
3. Set the default note placeholder and unit labels.
4. Set sensible defaults for time slots and privacy mode.

## The twelve packs

| # | Pack | Covers | Noun |
|---|---|---|---|
| 1 | Food and tiffin | Tiffin, meals, snacks, catering, cloud kitchen | Menu |
| 2 | Bakery and cakes | Cakes, bread, cookies, sweets, chocolates | Menu |
| 3 | Grocery | Kirana, vegetables, dairy, dry fruit, spices | Items |
| 4 | Tailoring | Stitching, alterations, boutique, embroidery | Services |
| 5 | Beauty and salon | Salon, parlour, makeup, mehendi, nails | Services |
| 6 | Tutoring | Tuition, coaching, music, dance, spoken English | Services |
| 7 | Repairs | Mobile, laptop, appliance, bicycle, watch, shoes | Services |
| 8 | Rentals and events | Furniture, tent, sound, decor, photography gear | Items |
| 9 | Freelance | Design, writing, editing, video, web, social media | Services |
| 10 | Home services | Cleaning, plumbing, electrical, pest control, painting | Services |
| 11 | Health and wellness | Yoga, physiotherapy, diet, massage, home nursing | Services |
| 12 | Pets and other | Pet food, grooming, vet visits, aquarium, plants | Items |

## Starter items

An empty catalog shows three suggestions as chips. One tap adds the item. The app
never creates rows without a tap, so a new shop never starts with fake data.

| Pack | Starter items | Common options | Common extras |
|---|---|---|---|
| Food and tiffin | Veg thali ₹120 · Dal and rice ₹90 · Chapati (4) ₹40 | Half, Full | Extra roti +₹10 · Less spicy ₹0 |
| Bakery and cakes | Chocolate cake 500 g ₹450 · Birthday cake 1 kg ₹900 · Cookies 250 g ₹150 | 500 g, 1 kg | Eggless +₹50 · Message on cake ₹0 |
| Grocery | Atta 5 kg ₹240 · Milk 500 ml ₹28 · Oil 1 L ₹140 | 500 g, 1 kg, 5 kg | None |
| Tailoring | Blouse stitching ₹450 · Kurti stitching ₹600 · Alteration ₹150 | Simple, Designer | Lining +₹100 · Urgent +₹150 |
| Beauty and salon | Haircut ₹150 · Facial ₹600 · Full-arm waxing ₹300 | Basic, Premium | Threading +₹50 |
| Tutoring | Maths tuition ₹1,500/month · Science tuition ₹1,500/month · Spoken English ₹2,000/month | Group, One-to-one | Test series +₹300 |
| Repairs | Screen replacement ₹1,200 · Fan repair ₹350 · Laptop service ₹800 | By model | Pickup +₹100 · Urgent +₹200 |
| Rentals and events | Chair ₹10/day · Tent ₹2,500/day · Sound system ₹1,500/day | Half day, Full day | Delivery +₹500 · Setup +₹800 |
| Freelance | Logo design ₹2,500 · Social post ₹500 · Landing page ₹3,000 | Basic, Standard, Premium | Rush +25% |
| Home services | Deep cleaning 2BHK ₹2,500 · Plumber visit ₹300 · AC service ₹600 | 1BHK, 2BHK, 3BHK | Sofa cleaning +₹800 |
| Health and wellness | Yoga month ₹1,200 · Physiotherapy session ₹600 · Diet plan ₹1,500 | Single, Monthly | Home visit +₹300 |
| Pets and other | Dog food 3 kg ₹900 · Grooming ₹800 · Cat litter 5 kg ₹450 | 1 kg, 3 kg | Nail trim +₹200 |

Prices are examples. They are editable before the first save.

## Pack defaults

| Pack | Note placeholder | Time slots | Privacy mode | Unit labels |
|---|---|---|---|---|
| Food and tiffin | "Delivery address or tiffin note" | On | Off | plate, box, piece |
| Bakery and cakes | "Message on cake, delivery area" | On | Off | 500 g, 1 kg, piece |
| Grocery | "Delivery address" | On | Off | g, kg, litre, packet |
| Tailoring | "Measurements, delivery date" | Off | Off | piece, set |
| Beauty and salon | "Preferred time, home service" | On | On | visit, session |
| Tutoring | "Class, board, preferred slot" | On | On | month, class |
| Repairs | "Device model, problem" | Off | Off | job, piece |
| Rentals and events | "Event date, venue, delivery" | Off | Off | day, piece |
| Freelance | "Scope, deadline, brand notes" | Off | Off | project, page, post |
| Home services | "Address, area, preferred slot" | On | On | visit, room |
| Health and wellness | "Preferred slot, health note" | On | On | session, month |
| Pets and other | "Pet, breed, delivery" | On | Off | kg, visit, piece |

Privacy mode changes the bill header to "Consultation Receipt". It hides the item
names from a forwarded bill. Use it where the item name reveals a health or
personal matter.

## How a pack is applied

1. Onboarding asks for the pack. That is one tap, not a category tree.
2. The pack sets the tab noun, defaults, and suggestions.
3. The merchant can change the pack later in More → Store settings.
4. A pack change rewrites defaults. It never rewrites items, bills, or totals.

The pack is stored as `businesses.category_pack`. The display noun is derived, not
stored, so a rename is one code change.

## Rules for adding a pack

A new pack ships only when all of these are true.

1. At least 200 shops would pick it.
2. It fits an existing noun: Menu, Items, or Services.
3. It needs no new table, column, or flow.
4. Its starter items use the existing option and extra model.
5. Its words exist in the six live locales.

A pack is a config change, not a feature. If it needs code outside the pack file,
it needs a decision in [decisions.md](decisions.md).

## Mapping from a category name

The merchant may type a category instead of choosing a pack. The app maps the
words to the nearest pack and lets the merchant change the result.

| Words in the category | Pack |
|---|---|
| tiffin, meal, food, kitchen, catering, snack | Food and tiffin |
| cake, bakery, bread, sweet, chocolate, cookie | Bakery and cakes |
| kirana, grocery, vegetable, dairy, spice, dry fruit | Grocery |
| tailor, stitching, boutique, alteration, embroidery | Tailoring |
| salon, parlour, beauty, makeup, mehendi, nail | Beauty and salon |
| tuition, coaching, class, tutor, music, dance | Tutoring |
| repair, service centre, mobile, laptop, appliance | Repairs |
| rental, tent, event, decor, sound, chair | Rentals and events |
| freelance, design, writer, video, website, social media | Freelance |
| cleaning, plumber, electrician, pest, painter | Home services |
| yoga, physio, diet, massage, nursing, clinic | Health and wellness |
| pet, dog, cat, aquarium, plant, nursery | Pets and other |

No match falls back to Grocery for products and Freelance for services. The
merchant sees the choice and can change it in one tap.
