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
4. Set the date label, the default time precision, and privacy mode.

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

Each pack takes its three chips from the first business in its category in
[business-catalog.md](business-catalog.md#how-this-feeds-the-build). The chip
name and the base variant price come from that row. Prices are examples and are
editable before the first save.

## Pack defaults

| Pack | Note placeholder | Date label | Precision | Privacy mode | Unit labels |
|---|---|---|---|---|---|
| Food and tiffin | "Delivery address or tiffin note" | Delivery | period | Off | plate, box, piece |
| Bakery and cakes | "Message on cake, delivery area" | Needed by | exact | Off | 500 g, 1 kg, piece |
| Grocery | "Delivery address" | Delivery | period | Off | g, kg, litre, packet |
| Tailoring | "Measurements, delivery date" | Needed by | date | Off | piece, set |
| Beauty and salon | "Preferred time, home service" | Visit on | exact | On | visit, session |
| Tutoring | "Class, board, preferred slot" | Starts | window | On | month, class |
| Repairs | "Device model, problem" | Promised | date | Off | job, piece |
| Rentals and events | "Event date, venue, delivery" | From | date | Off | day, piece |
| Freelance | "Scope, deadline, brand notes" | Deadline | date | Off | project, page, post |
| Home services | "Address, area, preferred slot" | Visit on | window | On | visit, room |
| Health and wellness | "Preferred slot, health note" | Session on | exact | On | session, month |
| Pets and other | "Pet, breed, delivery" | Visit on | window | Off | kg, visit, piece |

Privacy mode changes the bill header to "Consultation Receipt". It hides the item
names from a forwarded bill. Use it where the item name reveals a health or
personal matter.

## Time per pack

A pack never owns a list of times. It owns two words and a default:

- **Date label.** "Needed by" for a cake, "Visit on" for a salon, "From" for a
  tent, "Starts" for a class. The order sheet asks one question.
- **Precision.** The form opens at this level. The merchant or the client can
  move to a lower or higher one in the same field. The five levels are `none`,
  `date`, `period`, `window`, and `exact`.

A tutor types 5–6. A makeup artist types 3–7. A salon types 11:30. No pack
enumerates those times, and no pack change alters the data model. The full model
lives in [data-model.md](data-model.md#requested-time).

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
