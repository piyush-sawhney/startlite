# Business Catalog

> Part of the StartLite docs. Start at [README](README.md).

- One item per row. The variant sets the price. The sub variant adds a delta.
- One business per heading. No two businesses do the same work.
- 140 businesses across 16 domains. This is the source for starter items, pack
  inference, and the test corpus.

## How to read a row

| Column | Meaning | Schema name |
|---|---|---|
| Item | What the shop sells. | `item` |
| Variant | First-level choice. It sets the price. | `item_option` |
| Sub Variant | Second-level choice. It adds a delta or scopes stock. | `item_extra` |
| What it should handle | The rule the flow cannot omit. | — |

Each business heading carries three things:

- **Pack and noun.** The tab label and the unit the shop counts in.
- **Rules.** The business-level rules that apply to every item in that business.
- **Items.** Two or three real items, with real 2026 prices in ₹.

A dash means the item has no choice at that level.

## Capability words

The fourth column uses these recurring words. Each one names a screen, a field, or
a calculation that must exist. Other words in the column name a field or a check,
for example `queue` or `proof`.

`date` · `slot` · `advance` · `deposit` · `measurement` · `photo` · `privacy` ·
`monthly` · `quantity` · `warranty` · `serial` · `delivery` · `pickup` ·
`per day` · `per word` · `revisions` · `TDS` · `custom text` · `instalments` ·
`attendance` · `route` · `expense` · `stock` · `credit` · `quick sale`

## Coverage

| Domain | Businesses |
|---|---|
| A. Food and drink | 11 |
| B. Bakery and sweets | 5 |
| C. Grocery and daily needs | 9 |
| D. Apparel and tailoring | 9 |
| E. Beauty and personal care | 8 |
| F. Health and wellness | 7 |
| G. Education and coaching | 8 |
| H. Repairs and technical | 13 |
| I. Home and property | 9 |
| J. Events, rentals and media | 9 |
| K. Creative and freelance | 13 |
| L. Retail and trading | 8 |
| M. Transport and gig work | 9 |
| N. Agriculture and rural | 6 |
| O. Pets and plants | 7 |
| P. Print, craft and making | 9 |
| **Total** | **140** |

## A. Food and drink

**Pack:** Food and tiffin · **Tab noun:** Menu · **Unit:** plate, box, piece

### 1. Home tiffin and dabba service

*Rules: monthly plan, time slot, delivery route, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg thali | Half ₹90 · Full ₹110 | Extra phulka +₹8 · Less spicy +₹0 | Variant price, monthly plan |
| Special thali | Half ₹130 · Full ₹150 | Extra paneer +₹30 | Variant price, monthly plan |
| Monthly dabba pass | 5 days ₹500 · 7 days ₹700 · 14 days ₹1,400 | Veg +₹0 · Egg +₹150 | Plan length, start date, delivery route |

### 2. Cloud kitchen

*Rules: time slot, delivery, packaging expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Biryani | Single ₹180 · Family ₹650 | Extra salan +₹20 · Boneless +₹30 | Variant price, delivery |
| Burger | Single ₹120 · Double ₹180 | Extra cheese +₹20 · No onion +₹0 | Variant price, quick sale |
| Fries | Regular ₹90 · Large ₹130 | Peri peri +₹10 | Variant price, combo |

### 3. Biryani kitchen

*Rules: time slot, advance for bulk, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chicken dum biryani | Single ₹180 · Family ₹650 | Extra salan +₹20 · Boneless +₹30 | Variant price, advance |
| Mutton biryani | Single ₹240 · Family ₹850 | Extra raita +₹20 | Variant price, advance |
| Raita | 200 g ₹20 · 500 g ₹45 | Boondi +₹10 | Quantity, delivery |

### 4. Chai and snack stall

*Rules: quick sale, no customer needed, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chai | Cup ₹10 · Thermos 5 cups ₹70 | Less sugar +₹0 · Extra ginger +₹0 | Quick sale, variant price |
| Bun maska | Single ₹35 · Double ₹65 | Extra butter +₹10 | Quick sale |
| Samosa | 1 piece ₹18 · 2 pieces ₹35 · 4 pieces ₹65 | Chutney +₹5 | Quick sale, quantity |

### 5. Momo and street food cart

*Rules: quick sale, parcel, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg momos | 6 pieces ₹70 · 8 pieces ₹90 | Steamed +₹0 · Fried +₹10 · Kurkure +₹20 | Variant price, quick sale |
| Paneer momos | 6 pieces ₹100 · 8 pieces ₹120 | Mayo +₹10 · Schezwan +₹10 | Variant price, quick sale |
| Fried rice | Half ₹80 · Full ₹130 | Extra egg +₹20 | Variant price, parcel |

### 6. South Indian breakfast counter

*Rules: morning slot, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Idli | 2 pieces ₹40 · 3 pieces ₹55 | Extra sambar +₹10 · Ghee +₹10 | Variant price, quick sale |
| Masala dosa | Plain ₹60 · Masala ₹70 · Ghee ₹90 | Extra podi +₹10 | Variant price, quick sale |
| Filter coffee | Small ₹25 · Large ₹30 | Extra strong +₹0 | Variant price, quick sale |

### 7. Juice and shake corner

*Rules: quick sale, seasonal fruit price*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fresh juice | Glass ₹60 · 500 ml ₹90 | No sugar +₹0 · Extra ice +₹0 | Variant price, daily fruit cost |
| Shake | Glass ₹90 · 500 ml ₹130 | Dry fruit +₹30 · Chocolate +₹20 | Variant price, quick sale |
| Seasonal fruit bowl | Small ₹70 · Large ₹120 | Curd +₹20 | Variant price, daily price |

### 8. Mithai shop

*Rules: festival pre-booking, advance, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kaju katli | 250 g ₹240 · 500 g ₹450 · 1 kg ₹880 | Silver leaf +₹40 | Quantity, advance |
| Gulab jamun | 250 g ₹90 · 500 g ₹170 · 1 kg ₹320 | Extra syrup +₹10 | Quantity, delivery |
| Motichoor laddoo | 250 g ₹150 · 500 g ₹280 · 1 kg ₹540 | Gift box +₹50 | Quantity, festival order |

### 9. Namkeen and farsan shop

*Rules: quantity, delivery, festival gift box*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sev | 250 g ₹80 · 500 g ₹150 · 1 kg ₹280 | Spicy +₹0 · Plain +₹0 | Quantity, stock |
| Bhujia | 250 g ₹90 · 500 g ₹170 · 1 kg ₹320 | Masala +₹0 | Quantity, stock |
| Chakli | 250 g ₹70 · 500 g ₹130 | Extra ajwain +₹0 | Quantity, gift box |

### 10. Home pickle and papad maker

*Rules: quantity, courier, shelf life*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Mango pickle | 250 g ₹120 · 500 g ₹220 | Mustard oil +₹0 · Refined oil +₹0 | Quantity, courier |
| Garlic thecha | 250 g ₹140 · 500 g ₹260 | Extra spicy +₹0 | Quantity, courier |
| Urad papad | 250 g ₹100 · 500 g ₹180 | Masala +₹0 · Plain +₹0 | Quantity, courier, breakage |

### 11. Event catering service

*Rules: event date, advance, per-plate quantity, deposit, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg plate | Standard ₹250 · Premium ₹350 | Extra sweet +₹20 · Jain +₹0 | Per-plate quantity, event date |
| Non-veg plate | Standard ₹400 · Premium ₹500 | Extra starter +₹40 | Per-plate quantity, event date |
| Live counter | Per counter ₹5,000 | Extra hour +₹1,500 | Event date, slot, advance |

## B. Bakery and sweets

**Pack:** Bakery and cakes · **Tab noun:** Menu · **Unit:** 500 g, 1 kg, piece

### 12. Home baker (celebration cakes)

*Rules: needed-by date, slot, advance, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chocolate truffle cake | 500 g ₹450 · 1 kg ₹850 | Eggless +₹50 · Extra ganache +₹80 | Variant price, message on cake |
| Birthday cake | 500 g ₹500 · 1 kg ₹950 | Eggless +₹50 · Photo print +₹150 | Custom text, photo upload |
| Cupcakes | Box of 6 ₹300 · Box of 12 ₹560 | Eggless +₹30 · Custom topper +₹40 | Box quantity, custom text |

### 13. Patisserie and bread studio

*Rules: daily stock, pre-order, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sourdough loaf | Half ₹160 · Full ₹280 | Sliced +₹0 | Variant price, daily stock |
| Croissant | Single ₹90 · Box of 4 ₹340 | Chocolate +₹20 · Almond +₹30 | Variant price, pre-order |
| Baguette | Single ₹150 · Half ₹80 | Sliced +₹0 | Variant price, daily stock |

### 14. Cookie and brownie gifting

*Rules: needed-by date, delivery, custom text, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Cookie box | 4 pieces ₹180 · 6 pieces ₹250 · 9 pieces ₹360 | Gift wrap +₹50 | Box quantity, custom card |
| Brownie box | 4 pieces ₹200 · 6 pieces ₹280 · 9 pieces ₹400 | Walnut +₹40 · Eggless +₹30 | Box quantity, gift wrap |
| Festive hamper | Small ₹850 · Large ₹1,400 | Corporate logo +₹100 | Hamper contents, delivery date |

### 15. Wedding and tiered cake designer

*Rules: event date, advance 50%, photo reference, delivery and setup, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Two-tier cake | 2 kg ₹6,000 · 3 kg ₹8,500 | Eggless +₹300 · Fresh flowers +₹500 | Tier count, flavour per tier |
| Three-tier cake | 4 kg ₹12,000 · 5 kg ₹15,000 | Fondant +₹800 · LED stand +₹600 | Tier count, delivery and setup |
| Fondant topper | Small ₹800 · Large ₹1,500 | Custom figure +₹500 | Photo reference, custom text |

### 16. Custom photo and number cake maker

*Rules: needed-by date, advance, photo upload, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Number cake | Single digit ₹1,200 · Double digit ₹1,800 | Eggless +₹50 · Extra cream +₹80 | Custom text, photo upload |
| Photo cake | 500 g ₹900 · 1 kg ₹1,500 | Eggless +₹50 · Edible frame +₹100 | Photo upload, variant price |
| Cupcake set | Box of 6 ₹500 · Box of 12 ₹900 | Photo topper +₹100 | Box quantity, custom text |

## C. Grocery and daily needs

**Pack:** Grocery · **Tab noun:** Items · **Unit:** g, kg, litre, packet

### 17. Kirana and general store

*Rules: quantity, credit, delivery, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Atta | 5 kg ₹240 · 10 kg ₹460 | Brand +₹0 | Quantity, stock |
| Milk | 500 ml ₹28 · 1 L ₹55 | Cow +₹5 · Buffalo +₹8 | Quantity, daily stock |
| Cooking oil | 1 L ₹140 · 5 L ₹680 | Refined +₹0 · Mustard +₹40 | Quantity, credit |

### 18. Fruit and vegetable cart

*Rules: daily price, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tomato | 250 g ₹12 · 500 g ₹22 · 1 kg ₹40 | — | Daily price, quantity |
| Apple | 250 g ₹50 · 500 g ₹95 · 1 kg ₹180 | Kashmiri +₹40 | Daily price, quantity |
| Banana | 6 pieces ₹35 · 12 pieces ₹60 | — | Quantity, quick sale |

### 19. Dairy and paneer shop

*Rules: daily stock, route, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Milk | 500 ml ₹38 · 1 L ₹72 | Cow +₹5 · Buffalo +₹8 | Quantity, daily route |
| Paneer | 250 g ₹110 · 500 g ₹210 | Fresh +₹0 · Malai +₹20 | Quantity, daily stock |
| Ghee | 250 ml ₹250 · 500 ml ₹480 | Cow +₹80 · Buffalo +₹0 | Quantity, stock |

### 20. Dry fruits and nuts

*Rules: quantity, delivery, festival gift box*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Almonds | 250 g ₹650 · 500 g ₹1,250 | Mamra +₹300 | Quantity, stock |
| Walnuts | 250 g ₹220 · 500 g ₹420 | Shelled +₹100 | Quantity, stock |
| Cashew | 250 g ₹380 · 500 g ₹740 | W320 +₹150 | Quantity, gift box |

### 21. Fish and seafood

*Rules: daily price, quantity, quick sale, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Rohu | 500 g ₹95 · 1 kg ₹180 | Whole +₹0 · Cleaned +₹20 | Daily price, quantity |
| Prawns | 250 g ₹120 · 500 g ₹230 | Cleaned +₹30 · Deveined +₹50 | Daily price, quantity |
| Pomfret | 500 g ₹460 · 1 kg ₹900 | Whole +₹0 · Cleaned +₹40 | Daily price, quantity |

### 22. Chicken and mutton shop

*Rules: daily price, quantity, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chicken | 500 g ₹115 · 1 kg ₹220 | Curry cut +₹0 · Biryani cut +₹10 · Skinless +₹10 | Daily price, quantity |
| Mutton | 500 g ₹390 · 1 kg ₹750 | Curry cut +₹0 · Keema +₹20 | Daily price, quantity |
| Eggs | 6 pieces ₹42 · 12 pieces ₹84 · 30 pieces ₹200 | — | Quantity, stock |

### 23. Flour mill (chakki)

*Rules: job work, quantity, token, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Grinding | 5 kg ₹25 · 10 kg ₹50 · 25 kg ₹125 | Fine +₹0 · Coarse +₹0 | Job work, quantity, token |
| Atta | 5 kg ₹225 · 10 kg ₹440 | Fine +₹0 · Coarse +₹0 | Quantity, stock |
| Besan | 1 kg ₹90 · 5 kg ₹430 | — | Quantity, stock |

### 24. Water can supplier

*Rules: deposit, route, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 20 L water can | 1 can ₹60 · 5 cans ₹290 · 10 cans ₹560 | — | Quantity, route, deposit |
| Dispenser rental | Monthly ₹500 | Hot and cold +₹200 | Monthly, deposit |
| Bottle | 1 L ₹20 · Pack of 12 ₹220 | — | Quantity, stock |

### 25. Pooja samagri shop

*Rules: quantity, festival, gift pack*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Agarbatti | Small ₹40 · Large ₹90 | Sandal +₹20 · Rose +₹20 | Quantity, stock |
| Camphor | 50 g ₹60 · 100 g ₹110 | — | Quantity, stock |
| Pooja thali | Small ₹250 · Large ₹450 | Custom items +₹100 | Gift pack, festival |

## D. Apparel and tailoring

**Pack:** Tailoring · **Tab noun:** Services · **Unit:** piece, set

### 26. Blouse tailor

*Rules: measurement, needed-by date, advance, trial*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Blouse stitching | Simple ₹450 · Designer ₹650 | Lining +₹100 · Padded +₹80 · Back design +₹150 | Measurement, date, advance |
| Saree fall | Plain ₹80 · Designer ₹150 | — | Quick sale, same day |
| Blouse alteration | Basic ₹100 · Fitting ₹150 | Urgent +₹50 | Measurement, date |

### 27. Boutique (stitching and retail)

*Rules: measurement, needed-by date, advance, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kurti stitching | Simple ₹600 · Designer ₹900 | Lining +₹100 · Custom neck +₹150 | Measurement, date, advance |
| Suit set | 2-piece ₹1,800 · 3-piece ₹2,400 | Lining +₹200 · Dupatta +₹350 | Measurement, date, photo |
| Readymade dupatta | Cotton ₹350 · Silk ₹850 | — | Stock, photo |

### 28. Alteration shop

*Rules: quick sale, same day, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Hem | ₹50 | Same day +₹30 | Quick sale, same day |
| Waist | ₹80 | Same day +₹30 | Quick sale |
| Zip replacement | ₹120 | Invisible +₹40 | Date, pickup |

### 29. Embroidery and maggam work

*Rules: measurement, needed-by date, advance, photo reference, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Maggam blouse | Simple ₹1,800 · Bridal ₹3,500 | Stone work +₹800 · Cutwork +₹500 | Measurement, date, advance |
| Saree border | Small ₹2,500 · Full ₹5,000 | Zari +₹1,000 · Mirror +₹700 | Measurement, date, deposit |
| Dupatta embroidery | Light ₹1,200 · Heavy ₹3,000 | Custom motif +₹500 | Photo reference, date |

### 30. Gents tailor and suiting

*Rules: measurement, needed-by date, trial, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shirt | Cotton ₹450 · Premium ₹650 | Lining +₹100 · Slim fit +₹0 | Measurement, date, trial |
| Trouser | Formal ₹650 · Casual ₹550 | Lining +₹100 | Measurement, date |
| Suit | 2-piece ₹3,500 · 3-piece ₹4,500 | Lining +₹300 · Extra trouser +₹900 | Measurement, trial, advance |

### 31. School uniform tailor

*Rules: season, bulk quantity, measurement, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shirt | Small ₹250 · Medium ₹280 · Large ₹310 | House colour +₹20 | Measurement, bulk quantity |
| Pinafore | Small ₹400 · Medium ₹430 · Large ₹460 | House colour +₹20 | Measurement, bulk quantity |
| Sports uniform | Set ₹350 | House colour +₹20 | Bulk quantity, season |

### 32. Saree fall and pico

*Rules: quick sale, same day, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fall | ₹80 | Designer ₹150 | Quick sale, same day |
| Pico | ₹30 | Colour match +₹10 | Quick sale |
| Tassels | ₹150 | Custom colour +₹30 | Date, pickup |

### 33. Fabric store

*Rules: quantity, stock, wholesale, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Cotton | 1 m ₹120 · 5 m ₹560 | — | Quantity, stock |
| Silk | 1 m ₹450 · 5 m ₹2,100 | Pure +₹200 | Quantity, stock |
| Lining | 1 m ₹60 · 10 m ₹550 | — | Quantity, wholesale |

### 34. Saree and lehenga reseller (social)

*Rules: photo, courier, COD, return*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Saree | Cotton ₹1,800 · Silk ₹3,500 | With blouse +₹800 · Stitched +₹1,200 | Photo, courier, COD |
| Lehenga | Semi-stitched ₹8,500 · Bridal ₹18,000 | Custom size +₹1,500 | Photo, courier, advance |
| Dupatta | ₹650 | — | Stock, courier |

## E. Beauty and personal care

**Pack:** Beauty and salon · **Tab noun:** Services · **Unit:** visit, session

### 35. Ladies parlour

*Rules: time slot, package, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Threading | Eyebrow ₹40 · Upper lip ₹30 · Full face ₹120 | — | Quick sale, repeat |
| Facial | Basic ₹650 · Premium ₹950 | Fruit +₹0 · Gold +₹200 | Slot, package |
| Waxing | Full arms ₹250 · Full legs ₹400 · Full body ₹1,200 | Chocolate +₹50 · Rica +₹100 | Slot, package |

### 36. Gents barber shop

*Rules: walk-in queue, quick sale, monthly pass*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Haircut | Senior ₹120 · Junior ₹100 | Beard +₹80 · Head massage +₹50 | Quick sale, queue |
| Beard grooming | Trim ₹80 · Hot towel ₹120 | Beard colour +₹100 | Quick sale |
| Hair spa | ₹400 | Extra serum +₹100 | Slot, repeat |

### 37. Unisex salon

*Rules: time slot, advance for colour, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Haircut | Stylist ₹300 · Senior ₹500 | Wash +₹100 · Styling +₹150 | Slot, repeat |
| Hair colour | Global ₹1,200 · Highlights ₹2,500 | Ammonia free +₹300 | Slot, advance |
| Keratin | Short ₹3,500 · Long ₹5,500 | Repair +₹800 | Slot, advance, hair length |

### 38. Bridal makeup artist

*Rules: event date, slot, advance, travel expense, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bridal makeup | HD ₹12,000 · Airbrush ₹15,000 | Draping +₹1,000 · Hair +₹1,500 | Event date, slot, advance |
| Engagement makeup | ₹5,000 | Hair styling +₹800 | Event date, slot |
| Guest makeup | ₹1,500 | Hair +₹500 | Event date, travel |

### 39. Mehendi artist

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bridal mehendi | Hands ₹4,500 · Hands and feet ₹7,500 | Arabic +₹500 · Portrait +₹1,000 | Event date, slot, advance |
| Guest mehendi | Palm ₹150 · Front hand ₹300 | Arabic +₹50 | Event date, travel |
| Arabic design | ₹350 | Glitter +₹50 | Quick sale, slot |

### 40. Nail artist

*Rules: slot, photo reference, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Gel polish | ₹800 | French +₹100 · Chrome +₹150 | Slot, photo |
| Extensions | ₹1,500 | Refill ₹800 | Slot, repeat |
| Nail art | Per nail ₹100 · Full set ₹600 | 3D +₹200 | Photo reference, slot |

### 41. Massage therapist (home service)

*Rules: address, slot, privacy, consent note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Swedish massage | 60 min ₹1,500 · 90 min ₹2,000 | Aroma oil +₹200 | Address, slot, privacy |
| Deep tissue | 60 min ₹2,000 · 90 min ₹2,600 | Hot stone +₹400 | Address, slot, consent |
| Head massage | 30 min ₹600 | — | Address, slot |

### 42. Tattoo artist

*Rules: advance, design approval, slot, aftercare note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Small tattoo | ₹1,500 | Colour +₹500 · Cover-up +₹800 | Advance, design approval |
| Half sleeve | ₹8,000 | Colour +₹2,000 · Touch-up +₹1,000 | Advance, slot, aftercare |
| Cover-up | ₹5,000 | — | Photo reference, design approval |

## F. Health and wellness

**Pack:** Health and wellness · **Tab noun:** Services · **Unit:** session, month

### 43. Yoga instructor

*Rules: monthly fee, slot, attendance, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Morning batch | Monthly ₹1,800 | 3 days +₹0 · 5 days +₹400 | Monthly, slot, attendance |
| One-to-one session | ₹600 | Online +₹0 · Home +₹200 | Slot, package |
| Workshop | ₹3,000 | — | Date, advance |

### 44. Fitness trainer

*Rules: monthly fee, slot, attendance, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly training | Home ₹4,000 · Gym ₹3,000 | 3 days +₹0 · 5 days +₹1,000 | Monthly, slot, attendance |
| One-to-one session | ₹800 | Home +₹200 · Online +₹0 | Slot, package |
| Diet plan | ₹1,500 | Monthly follow-up +₹500 | Package, follow-up |

### 45. Physiotherapist (home visit)

*Rules: address, slot, package expiry, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Home session | 30 min ₹600 · 45 min ₹800 | — | Address, slot, privacy |
| Session pack | 5 sessions ₹2,800 · 10 sessions ₹5,000 | — | Package, expiry |
| Assessment | ₹1,000 | — | Slot, follow-up |

### 46. Dietitian and nutritionist

*Rules: slot, follow-up, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Consultation | ₹2,000 | Online +₹0 · In person +₹0 | Slot, follow-up |
| Three-month plan | ₹5,000 | Weekly check-in +₹1,000 | Package, follow-up |
| Diet chart | ₹1,500 | — | Custom text, package |

### 47. Home nursing

*Rules: shift, monthly fee, attendance, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shift | 8 hours ₹1,200 · 12 hours ₹1,700 · 24 hours ₹2,500 | — | Shift, attendance, privacy |
| Monthly care | ₹25,000 | Night +₹5,000 | Monthly, attendance |
| Procedure visit | ₹800 | Injection +₹200 | Slot, privacy |

### 48. Elder care attendant

*Rules: monthly fee, attendance, recurring*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly attendant | ₹20,000 | Day +₹0 · Night +₹2,000 · Live-in +₹5,000 | Monthly, attendance |
| Daily visit | ₹1,000 | — | Attendance, recurring |
| Companion | 4 hours ₹600 | — | Slot, attendance |

### 49. Counsellor and therapist

*Rules: slot, privacy, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Session | ₹1,500 | Online +₹0 · In person +₹0 | Slot, privacy |
| Four-session package | ₹6,000 | — | Package, expiry |
| Couples session | ₹2,500 | — | Slot, privacy |

## G. Education and coaching

**Pack:** Tutoring · **Tab noun:** Services · **Unit:** month, class

### 50. School tuition

*Rules: monthly fee, attendance, fee reminder*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Maths tuition | Group ₹1,500 per month · One-to-one ₹3,000 per month | 3 days +₹0 · 5 days +₹500 | Monthly, attendance, reminder |
| Science tuition | Group ₹1,500 per month · One-to-one ₹3,000 per month | 3 days +₹0 · 5 days +₹500 | Monthly, attendance |
| Test series | ₹500 | — | Date, custom text |

### 51. Spoken English coach

*Rules: monthly fee, slot, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Group batch | Monthly ₹2,000 | 3 days +₹0 · 5 days +₹400 | Monthly, slot, attendance |
| One-to-one | Per session ₹500 · 10 sessions ₹4,000 | Online +₹0 | Slot, package |
| Interview prep | ₹3,000 | — | Package, date |

### 52. Music teacher

*Rules: monthly fee, slot, attendance, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Guitar | Monthly ₹1,600 | 30 min +₹0 · 45 min +₹400 · 60 min +₹800 | Monthly, slot, attendance |
| Vocal | Monthly ₹1,400 | 30 min +₹0 · 45 min +₹400 · 60 min +₹800 | Monthly, slot |
| Instrument rental | Monthly ₹800 | — | Deposit, monthly |

### 53. Dance teacher

*Rules: monthly fee, slot, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bollywood batch | Monthly ₹1,200 | 3 days +₹0 · 5 days +₹300 | Monthly, slot, attendance |
| Kathak | Monthly ₹1,500 | — | Monthly, slot |
| Private session | ₹600 | Home +₹200 | Slot, package |

### 54. Abacus and vedic maths

*Rules: monthly fee, level, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Level class | Monthly ₹1,000 | Level 1 to 4 +₹0 · Level 5 to 8 +₹200 | Monthly, level, attendance |
| Kit | ₹800 | — | Stock, kit |
| Competition fee | ₹500 | — | Date, custom text |

### 55. Computer classes

*Rules: course, instalments, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Basic course | 1 month ₹1,500 · 2 months ₹2,600 | — | Course, instalments |
| Tally | ₹4,000 | — | Course, certificate |
| Excel | Basic ₹2,000 · Advanced ₹2,800 | — | Course, certificate |

### 56. Competitive exam coaching

*Rules: instalments, batch, refund policy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Full course | Online ₹25,000 · Offline ₹30,000 | — | Instalments, batch, refund policy |
| Test series | ₹3,000 | — | Batch, date |
| Crash course | ₹8,000 | — | Date, instalments |

### 57. Driving school

*Rules: course, slot, instalments, RTO expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 20-day course | 4-wheeler ₹4,500 · 2-wheeler ₹3,000 | — | Course, slot, instalments |
| RTO assistance | ₹1,800 | — | Expense, date |
| Refresher course | 7 days ₹2,200 | — | Course, slot |

## H. Repairs and technical

**Pack:** Repairs · **Tab noun:** Services · **Unit:** job, piece

### 58. Mobile repair

*Rules: serial note, warranty, part advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Screen replacement | Original ₹2,800 · Compatible ₹1,400 | — | Serial, warranty, advance |
| Battery replacement | Original ₹1,800 · Compatible ₹850 | — | Serial, warranty |
| Tempered glass | ₹120 | — | Quick sale |

### 59. Laptop and computer repair

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹800 | — | Serial, estimate, warranty |
| Screen replacement | ₹4,500 | — | Serial, estimate, advance |
| SSD upgrade | 256 GB ₹2,500 · 512 GB ₹4,000 | — | Serial, warranty, data note |

### 60. Home appliance repair

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| TV repair | Panel ₹3,500 · Board ₹1,800 | — | Serial, estimate, pickup |
| Fridge repair | Gas ₹1,800 · Compressor ₹3,500 | — | Serial, estimate, warranty |
| Washing machine | Service ₹500 · Motor ₹2,200 | — | Serial, estimate, pickup |

### 61. AC service and installation

*Rules: slot, warranty, season, AMC*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | 1 unit ₹600 · 2 units ₹1,100 | — | Slot, season |
| Gas refill | ₹2,500 | — | Slot, warranty |
| Installation | Split ₹1,500 · Window ₹1,200 | — | Slot, warranty, AMC |

### 62. Electrician

*Rules: address, slot, material expense, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fan installation | ₹150 | — | Address, slot |
| Geyser repair | ₹650 | — | Address, slot, expense |
| Wiring | Per point ₹300 | — | Address, quantity, expense |

### 63. Plumber

*Rules: address, slot, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tap repair | ₹150 | — | Address, slot |
| Flush repair | ₹350 | — | Address, slot |
| Sink unclog | ₹400 | — | Address, slot, expense |

### 64. Carpenter

*Rules: address, slot, measurement, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Door repair | ₹500 | — | Address, slot, expense |
| Furniture repair | ₹1,200 | — | Address, slot, measurement |
| Custom shelf | Per sqft ₹450 | — | Measurement, date, advance |

### 65. House painter

*Rules: quantity, advance, material expense, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Flat painting | 1BHK ₹9,500 · 2BHK ₹16,000 | Basic +₹0 · Premium +₹4,000 | Quantity, advance, expense |
| Putty | Per sqft ₹15 | — | Quantity, expense |
| Waterproofing | ₹3,500 | — | Quantity, warranty |

### 66. Tile, marble and flooring

*Rules: quantity, measurement, date, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tile laying | Per sqft ₹35 | — | Quantity, measurement, date |
| Marble polishing | Per sqft ₹25 | — | Quantity, date |
| Wooden flooring | Per sqft ₹120 | — | Quantity, measurement, date |

### 67. Welder and fabrication

*Rules: measurement, quantity, advance, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Gate | Per sqft ₹450 | — | Measurement, advance, date |
| Grill | Per sqft ₹350 | — | Measurement, date |
| Repair | ₹500 | — | Address, quick sale |

### 68. CCTV installation

*Rules: site visit, quote, warranty, AMC*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Four-camera setup | ₹12,000 | — | Site visit, quote, warranty |
| Eight-camera setup | ₹22,000 | — | Site visit, quote, warranty |
| Yearly AMC | ₹4,000 | — | Warranty, follow-up |

### 69. Two-wheeler mechanic

*Rules: serial note, estimate, warranty, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹350 | — | Serial, date |
| Tyre | ₹1,200 | — | Serial, warranty |
| Engine work | ₹3,500 | — | Serial, estimate, advance |

### 70. Car mechanic and garage

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹1,500 | — | Serial, estimate |
| Clutch | ₹6,500 | — | Serial, estimate, warranty |
| Dent paint | Per panel ₹2,500 | — | Serial, estimate, pickup |

## I. Home and property

**Pack:** Home services · **Tab noun:** Services · **Unit:** visit, room

### 71. Deep cleaning

*Rules: address, slot, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Deep cleaning | 1BHK ₹1,800 · 2BHK ₹2,800 · 3BHK ₹3,800 | — | Address, slot |
| Kitchen cleaning | ₹1,200 | — | Slot, expense |
| Bathroom cleaning | ₹600 | — | Slot, quantity |

### 72. Sofa and carpet cleaning

*Rules: address, slot, quantity*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sofa cleaning | 3-seater ₹750 · 5-seater ₹1,200 · 7-seater ₹1,600 | Shampoo +₹100 | Address, quantity |
| Carpet cleaning | Per sqft ₹25 | Stain treatment +₹10 | Address, quantity |
| Mattress cleaning | Single ₹600 · Double ₹900 | — | Address, slot |

### 73. Pest control

*Rules: address, slot, warranty, follow-up*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| General pest control | 1BHK ₹1,200 · 2BHK ₹1,500 · 3BHK ₹1,800 | — | Address, warranty |
| Termite treatment | ₹3,000 | — | Address, warranty, follow-up |
| Cockroach gel | ₹800 | — | Address, slot |

### 74. Gardening and mali

*Rules: monthly fee, attendance, address*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Garden visit | ₹500 | — | Address, slot |
| Monthly maintenance | ₹2,000 | Weekly +₹800 | Monthly, attendance |
| Plant supply | Per plant ₹150 | — | Stock, quantity |

### 75. Maid and housekeeping

*Rules: monthly fee, attendance, recurring*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly maid | 2 hours ₹4,000 · 4 hours ₹7,000 | — | Monthly, attendance |
| Deep clean | ₹800 | — | Address, slot |
| Utensils | Monthly ₹1,500 | — | Monthly, attendance |

### 76. Cook at home

*Rules: monthly fee, attendance, recurring*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly cook | 1 meal ₹6,000 · 2 meals ₹9,000 | Veg +₹0 · Non-veg +₹1,500 | Monthly, attendance |
| Party cooking | ₹1,500 | Per 10 guests +₹800 | Date, slot |
| Tiffin | Monthly ₹3,000 | — | Monthly, route |

### 77. Packer and mover

*Rules: quote, date, inventory, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local shifting | 1BHK ₹8,000 · 2BHK ₹14,000 · 3BHK ₹20,000 | Packing +₹2,000 | Quote, date, inventory |
| Vehicle only | ₹4,000 | — | Quote, date |
| Insurance | 2% of value | — | Deposit, custom text |

### 78. Interior designer

*Rules: milestones, site visit, vendor expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Full home design | 2BHK ₹60,000 · 3BHK ₹85,000 | — | Milestones, site visit |
| Room design | Per room ₹25,000 | — | Milestones, measurement |
| Consultation | ₹2,500 | — | Slot, follow-up |

### 79. Waterproofing

*Rules: quantity, site visit, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Terrace waterproofing | Per sqft ₹65 | — | Quantity, site visit |
| Bathroom waterproofing | Per sqft ₹45 | — | Quantity, site visit |
| Wall seepage | Per sqft ₹55 | — | Quantity, warranty |

## J. Events, rentals and media

**Pack:** Rentals and events · **Tab noun:** Items · **Unit:** day, event

### 80. Tent house

*Rules: per day, deposit, return checklist, damage charge*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chair | Per day ₹12 | — | Per day, quantity, deposit |
| Tent | 20x20 ₹2,500 · 30x30 ₹4,500 | — | Per day, deposit, date |
| Crockery set | Per plate ₹8 | — | Per day, quantity, return checklist |

### 81. Sound and light rental

*Rules: per day, deposit, setup charge*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Speaker | Pair ₹1,800 per day | Operator +₹1,000 | Per day, deposit |
| Cordless mic | ₹500 per day | — | Per day, deposit |
| Party lights | ₹800 per day | Setup +₹500 | Per day, setup |

### 82. DJ service

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Event DJ | 4 hours ₹8,000 · 6 hours ₹11,000 | Extra hour +₹1,500 | Date, slot, advance |
| Wedding DJ | ₹15,000 | — | Date, advance |
| Lighting add-on | ₹3,000 | — | Setup, date |

### 83. Event decorator

*Rules: event date, advance, site visit, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Birthday decor | ₹6,000 | Theme +₹1,500 | Date, site visit |
| Wedding decor | ₹25,000 | Flowers +₹5,000 | Date, advance, site visit |
| Stage backdrop | ₹8,000 | Custom print +₹2,000 | Date, photo reference |

### 84. Wedding planner

*Rules: event date, instalments, vendor expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Partial planning | ₹15,000 | — | Date, instalments |
| Full planning | ₹50,000 | — | Date, instalments, expense |
| Day coordination | ₹10,000 | — | Date, slot |

### 85. Event photographer

*Rules: event date, advance, delivery date, photo count*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Half day | 4 hours ₹8,000 | — | Date, advance |
| Full day | ₹15,000 | — | Date, advance |
| Album | ₹4,000 | 20 pages +₹2,000 | Photo count, delivery date |

### 86. Videographer

*Rules: event date, advance, delivery date, revisions*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Highlight reel | ₹12,000 | — | Date, advance |
| Full film | ₹25,000 | — | Date, advance |
| Drone add-on | ₹5,000 | — | Date, delivery |

### 87. Kids party rental

*Rules: per day, deposit, delivery, safety note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bouncy castle | Per day ₹3,500 | — | Per day, deposit, delivery |
| Slide | Per day ₹5,000 | — | Per day, deposit |
| Attendant | ₹800 | — | Slot |

### 88. Dhol and band party

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Dhol | ₹3,000 | Extra player +₹1,500 | Date, slot |
| Band | 5 members ₹8,000 | Extra member +₹1,200 | Date, slot |
| Wedding package | ₹12,000 | — | Date, advance |

## K. Creative and freelance

**Pack:** Freelance · **Tab noun:** Services · **Unit:** project, page, post

### 89. Graphic designer

*Rules: brief, revisions, milestones, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Logo design | Basic ₹3,500 · Premium ₹7,000 | Two extra revisions +₹1,500 · Source file +₹1,000 | Brief, revisions |
| Social post | ₹400 | Carousel +₹200 | Brief, date |
| Packaging design | ₹1,800 | Mockup +₹600 | Brief, revisions |

### 90. Video editor

*Rules: brief, delivery date, revisions, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Reel edit | ₹800 | Subtitles +₹150 · Motion graphics +₹400 | Brief, date |
| Long form edit | ₹2,500 | Thumbnail +₹300 | Brief, revisions |
| Colour grade | ₹1,200 | — | Revisions |

### 91. Content writer

*Rules: per word, deadline, revisions, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Blog post | ₹1,200 | SEO +₹400 | Per word, deadline |
| Website copy | Per page ₹3,000 | — | Deadline, revisions |
| Product description | ₹250 | Bulk 10 +₹0 | Quantity, deadline |

### 92. Translator

*Rules: per word, deadline, certification*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Translation | Per word ₹1.5 | Certified +₹0.5 | Per word, certification |
| Document | Per page ₹1,200 | Notarised +₹500 | Per word, deadline |
| Subtitling | Per minute ₹150 | — | Deadline |

### 93. Social media manager

*Rules: monthly retainer, recurring, approval*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly retainer | 12 posts ₹8,000 · 20 posts ₹12,000 | Reel +₹300 each | Monthly, approval |
| Campaign | ₹6,000 | — | Date, approval |
| Ad management | ₹5,000 plus 10% spend | — | Monthly, expense |

### 94. Web and app developer

*Rules: milestones, retainer, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Landing page | ₹15,000 | CMS +₹5,000 | Milestones, revisions |
| E-commerce site | ₹60,000 | Payment +₹10,000 | Milestones, TDS |
| Mobile app | ₹1,50,000 | iOS +₹40,000 | Milestones, retainer |

### 95. Illustrator

*Rules: brief, revisions, usage rights*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Character art | ₹2,500 | Extra pose +₹800 | Brief, revisions |
| Book cover | ₹8,000 | Full wrap +₹3,000 | Brief, usage rights |
| Editorial image | ₹4,000 | — | Deadline, usage rights |

### 96. Mural painter

*Rules: quantity, site visit, advance, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Wall mural | Per sqft ₹120 | Ceiling +₹80 | Quantity, site visit |
| Exterior mural | Per sqft ₹150 | Height +₹50 | Quantity, site visit, advance |
| Design fee | ₹3,000 | — | Brief, advance |

### 97. Portrait and sketch artist

*Rules: photo, date, courier*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Pencil sketch | A4 ₹1,500 · A3 ₹3,000 | Frame +₹600 | Photo, courier |
| Digital portrait | ₹2,500 | Extra person +₹800 | Photo, date |
| Caricature | ₹1,200 | — | Photo, date |

### 98. Photographer (portrait and product)

*Rules: slot, delivery date, photo count*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Portrait shoot | 2 hours ₹5,000 · 4 hours ₹8,000 | Ten edited +₹2,000 | Slot, delivery date |
| Product shoot | Per shot ₹150 | Ten shots ₹1,200 | Photo count, delivery |
| Event shoot | Half day ₹8,000 | — | Date, advance |

### 99. Influencer and content creator

*Rules: date, deliverables, approval, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Promo post | ₹5,000 | Story +₹2,000 | Date, deliverables |
| Reel | ₹12,000 | Usage rights +₹5,000 | Date, approval |
| Bundle | 3 posts ₹20,000 | — | Date, deliverables |

### 100. Astrologer and tarot reader

*Rules: slot, privacy, follow-up*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kundali reading | ₹1,100 | Written report +₹500 | Slot, privacy |
| Matchmaking | ₹1,500 | — | Slot, privacy |
| Vastu visit | ₹3,500 | — | Address, slot |

### 101. Pandit and priest

*Rules: date, slot, material expense, travel*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Puja | ₹2,500 | Samagri included +₹800 | Date, slot |
| Wedding | ₹15,000 | — | Date, advance |
| Griha pravesh | ₹5,000 | — | Date, slot |

## L. Retail and trading

**Pack:** None today. Closest is Grocery with the noun Items. See [coverage gaps](#coverage-gaps). **Unit:** piece, sqft

### 102. Mobile accessories shop

*Rules: model note, stock, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Back cover | ₹150 | — | Model, stock |
| Charger | ₹450 | Fast +₹250 | Model, warranty |
| Earbuds | ₹900 | — | Model, warranty |

### 103. Electronics shop

*Rules: serial note, warranty, EMI, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fan | ₹1,800 | — | Serial, warranty |
| Mixer | ₹2,200 | — | Serial, warranty |
| Television | 32 inch ₹18,000 · 43 inch ₹28,000 | — | Serial, warranty, delivery |

### 104. Hardware store

*Rules: quantity, credit, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Nails | Per kg ₹80 | — | Quantity, stock |
| Hinges | Per pair ₹60 | — | Quantity, stock |
| Paint | 1 L ₹350 · 4 L ₹1,300 | Tinting +₹100 | Quantity, credit |

### 105. Tiles and sanitaryware

*Rules: quantity, box quantity, delivery, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tile | Per sqft ₹45 | — | Quantity, box quantity |
| Basin | ₹1,800 | — | Stock, delivery |
| Tap | ₹650 | — | Stock, warranty |

### 106. Furniture shop

*Rules: delivery, assembly, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chair | ₹2,500 | — | Delivery, assembly |
| Bed | Queen ₹18,000 · King ₹24,000 | Storage +₹4,000 | Delivery, assembly, advance |
| Sofa | 3-seater ₹15,000 | — | Delivery, advance |

### 107. Optical shop

*Rules: prescription, fitting date, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Frame | ₹1,200 | — | Prescription, stock |
| Lens | Single vision ₹800 · Progressive ₹2,500 | Anti-glare +₹400 | Prescription, fitting date |
| Sunglasses | ₹1,500 | — | Stock, warranty |

### 108. Jewellery shop

*Rules: weight, old gold exchange, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chain | 10 g ₹25,000 | — | Weight, certificate |
| Ring | 3 g ₹8,000 | — | Weight, old gold exchange |
| Earrings | 5 g ₹14,000 | — | Weight, certificate |

### 109. Auto parts and tyre

*Rules: part number, serial note, warranty, fitment*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Brake pad | ₹450 | — | Part number, warranty |
| Tyre | ₹2,500 | — | Serial, warranty, fitment |
| Alignment | ₹300 | — | Quick sale |

## M. Transport and gig work

**Pack:** None today. See [coverage gaps](#coverage-gaps). **Unit:** trip, shift, day

### 110. Delivery rider

*Rules: per trip, fuel expense, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Food delivery | Per order ₹35 | Peak +₹10 · Long distance +₹15 | Per trip, expense |
| Grocery delivery | Per order ₹45 | Heavy +₹20 | Per trip |
| Daily target | 10 orders ₹350 | — | Per day, daily cash left |

### 111. Auto rickshaw driver

*Rules: monthly route, credit, fuel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local trip | ₹120 | Waiting +₹30 per hour | Per trip |
| School route | Monthly ₹2,500 | — | Monthly, route, attendance |
| Hourly hire | ₹250 per hour | — | Per hour |

### 112. Cab driver

*Rules: per km, toll expense, EMI*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local ride | Per km ₹12 | Waiting +₹2 per km | Per km |
| Outstation | Per day ₹2,500 | Driver allowance +₹400 | Per day, expense |
| Airport transfer | ₹800 | — | Per trip |

### 113. School van driver

*Rules: monthly fee, attendance, route*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly seat | ₹1,500 | — | Monthly, route |
| One-way seat | ₹1,200 | — | Monthly, route |
| Single trip | ₹100 | — | Per trip |

### 114. Tempo and mini truck owner

*Rules: per trip, fuel expense, driver*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local trip | ₹2,500 | Loading +₹500 | Per trip |
| Per km | ₹35 | — | Per km |
| Full day | ₹6,000 | — | Per day, expense |

### 115. Courier agent

*Rules: per parcel, COD collection*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Parcel | ₹40 | COD +₹20 | Per parcel |
| Monthly franchise | ₹3,000 | — | Monthly |
| Bulk pickup | Per 100 ₹3,500 | — | Quantity |

### 116. Milk delivery route

*Rules: monthly card, route, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Daily delivery | Per litre ₹72 | — | Route, attendance |
| Monthly pass | ₹2,000 | — | Monthly, route |
| Extra litre | ₹72 | — | Quantity |

### 117. Multi-platform gig worker

*Rules: per task, expense, multiple income sources*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Errand | ₹150 | Distance +₹50 | Per task |
| Queue job | ₹200 per hour | — | Per hour |
| Delivery | ₹80 | — | Per trip |

### 118. Homestay host

*Rules: per night, date range, deposit, ID*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Room | Per night ₹2,500 | Extra guest +₹500 | Per night, date |
| Full home | Per night ₹6,000 | — | Per night, deposit |
| Breakfast | ₹150 | — | Quantity |

## N. Agriculture and rural

**Pack:** Grocery · **Tab noun:** Items · **Unit:** kg, quintal, acre

### 119. Farmer (direct produce)

*Rules: quantity, daily price, delivery, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tomato | Per kg ₹40 | Grade A +₹10 | Quantity, daily price |
| Wheat | Per kg ₹30 | — | Quantity, wholesale |
| Seasonal box | Small ₹300 · Large ₹500 | — | Quantity, delivery |

### 120. Dairy farmer

*Rules: quantity, route, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Milk | Per litre ₹55 | Cow +₹10 · Buffalo +₹5 | Quantity, route |
| Cow sale | ₹35,000 | — | Advance |
| Manure | Per kg ₹5 | — | Quantity |

### 121. Poultry farm

*Rules: quantity, daily price, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Broiler | Per kg ₹110 | Live +₹0 · Dressed +₹15 | Quantity, daily price |
| Eggs | Tray of 30 ₹180 | — | Quantity, stock |
| Chicks | Per piece ₹35 | — | Quantity |

### 122. Goat and sheep farm

*Rules: quantity, festival booking, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Goat | Live ₹12,000 | — | Advance, festival |
| Mutton | Per kg ₹750 | — | Quantity |
| Breeding pair | ₹18,000 | — | Advance |

### 123. Beekeeping and honey

*Rules: quantity, courier, batch*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Honey | 250 g ₹250 · 500 g ₹450 · 1 kg ₹850 | — | Quantity, courier |
| Bee box | ₹6,000 | — | Stock, delivery |
| Pollination service | Per acre ₹1,500 | — | Quantity, date |

### 124. Tractor and harvester rental

*Rules: per hour, fuel expense, operator*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Hourly hire | Per hour ₹1,200 | Operator +₹300 | Per hour |
| Daily hire | Per day ₹8,000 | — | Per day |
| Harvester | Per acre ₹1,800 | — | Quantity |

## O. Pets and plants

**Pack:** Pets and other · **Tab noun:** Items · **Unit:** visit, kg, piece

### 125. Pet grooming

*Rules: slot, pet note, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bath | Small ₹700 · Medium ₹900 · Large ₹1,200 | — | Slot, pet note |
| Full groom | Small ₹1,400 · Medium ₹1,800 · Large ₹2,300 | Nail trim +₹350 · Ear clean +₹200 | Slot, photo |
| Nail trim | ₹350 | — | Quick sale |

### 126. Pet boarding

*Rules: per day, date range, vaccination note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Per day | Small ₹600 · Large ₹900 | Food included +₹150 | Per day, date |
| Weekly stay | ₹4,000 | — | Per day, date |
| Day care | ₹400 | — | Per day |

### 127. Dog trainer

*Rules: course, slot, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Basic course | ₹8,000 | — | Course, slot |
| Advanced course | ₹12,000 | — | Course, slot |
| Single session | ₹1,000 | Home +₹300 | Slot, package |

### 128. Aquarium and fish shop

*Rules: stock, live guarantee*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fighter fish | ₹150 | — | Stock |
| Tank | 1 ft ₹1,200 · 2 ft ₹2,500 | — | Stock, delivery |
| Fish food | 100 g ₹90 | — | Stock |

### 129. Plant nursery

*Rules: stock, delivery, care note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Areca palm | ₹250 | Pot +₹220 | Stock |
| Compost | 5 kg ₹180 | — | Quantity |
| Pot | 8 inch ₹220 | — | Stock |

### 130. Landscaping

*Rules: quantity, site visit, maintenance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Terrace garden | Per sqft ₹80 | — | Quantity, site visit |
| Maintenance | Monthly ₹3,000 | — | Monthly, attendance |
| Plant supply | Per plant ₹150 | — | Stock, quantity |

### 131. Vet clinic (non-surgical)

*Rules: slot, follow-up, vaccination card*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Consultation | ₹500 | — | Slot, follow-up |
| Vaccination | ₹800 | — | Slot, vaccination card |
| Deworming | ₹300 | — | Slot, follow-up |

## P. Print, craft and making

**Pack:** None today. Closest is Freelance for services and Pets and other for goods. See [coverage gaps](#coverage-gaps). **Unit:** piece, sqft

### 132. Printing press

*Rules: quantity, proof, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Visiting card | 100 ₹300 · 500 ₹1,200 | — | Quantity, proof |
| Letterhead | 500 ₹1,500 | — | Quantity, proof |
| Bill book | 100 ₹600 | — | Quantity, custom text |

### 133. Flex and banner printing

*Rules: quantity, design, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Flex banner | Per sqft ₹25 | Eyelets +₹100 | Quantity, design |
| Standee | ₹1,200 | — | Quantity, design |
| Backdrop | Per sqft ₹35 | — | Quantity, design |

### 134. T-shirt printing

*Rules: bulk tiers, size mix, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| T-shirt | 1 to 9 ₹350 · 10 or more ₹280 | Back print +₹50 | Quantity, size mix |
| Hoodie | 1 to 9 ₹850 · 10 or more ₹750 | — | Quantity, size mix |
| Cap | ₹250 | — | Quantity |

### 135. Photo studio

*Rules: quick sale, print quantity*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Passport photo | 8 copies ₹80 | — | Quick sale |
| Photo frame | ₹250 | — | Stock |
| Photo print | Per print ₹20 | — | Quantity |

### 136. Candle maker

*Rules: stock, courier, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Jar candle | ₹380 | Scent +₹50 | Stock, courier |
| Wax melts | Pack of 6 ₹220 | — | Stock, courier |
| Gift box | ₹850 | — | Quantity, festival |

### 137. Resin and jewellery maker

*Rules: custom text, courier, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Jhumka | ₹280 | Custom name +₹50 | Custom text, courier |
| Pendant | ₹350 | — | Photo, courier |
| Bracelet | ₹160 | — | Stock, courier |

### 138. Handloom weaver

*Rules: quantity, courier, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Saree | ₹3,500 | — | Quantity, courier |
| Stole | ₹800 | — | Quantity, courier |
| Fabric | Per metre ₹450 | — | Quantity, wholesale |

### 139. Idol maker

*Rules: date, advance, delivery, breakage*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Ganesh idol | 12 inch ₹2,500 · 24 inch ₹8,000 | — | Date, advance |
| Fibre idol | ₹8,000 | — | Date, delivery |
| Eco idol | ₹1,800 | — | Date, stock |

### 140. Flower shop

*Rules: daily price, delivery, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Garland | ₹150 | — | Daily price |
| Bouquet | ₹350 | — | Stock, delivery |
| Car decor | ₹1,800 | — | Date, delivery |

## Coverage gaps

Three domains have no pack. The twelve packs cover 114 of the 140 businesses.

| Domain | Rows | Closest pack today | Problem |
|---|---|---|---|
| Retail and trading | 102–109 | Grocery, noun Items | Grocery implies food. An electronics or jewellery shop is not a kirana. |
| Transport and gig work | 110–118 | None | A rider, driver, or homestay host has no catalog. The unit is a trip, shift, or night. |
| Print, craft and making | 132–140 | Freelance for services, Pets and other for goods | Two workflows in one row set: a print shop quotes a job, a craft maker holds stock. |

Agriculture fits Grocery. It sells by weight and price changes daily, which the
Grocery pack already handles.

### Pack proposals

| Gap | Proposal | Noun | Why |
|---|---|---|---|
| Retail | Widen Grocery into **Grocery and retail** | Items | Same flow: stock, quantity, price, delivery. Only the starter items differ. |
| Transport and gig | New pack **Rides and errands** | Trips | The catalog is a rate card of trips, not items. The bill is a trip receipt. |
| Print and craft | Split: print shops join **Freelance**, craft makers join **Pets and other** | Services / Items | A print shop sells a quoted job. A candle maker sells stock. |

The transport gap matters most. It is nine of the 140 rows, and it includes the
gig worker and the delivery rider from the brief.

### Primitive gaps

Most of the fourth-column rules already exist as a primitive. Two do not.

| Rule | Rows | Gap |
|---|---|---|
| Bulk tiers | 134 | A quantity price break, for example 350 per piece, 280 at 10 or more. A variant sets one price. It cannot set a tier. |
| Queue | 36 | A walk-in queue for a barber. Time slots cover appointments, not a waiting line. |

Do not build either until a paying merchant asks. Record them in
[decisions.md](decisions.md#open-questions) when that happens.

## How this feeds the build

This document is not only a reference. It is the input to three things.

1. **Starter items.** Each pack takes its three chips from the rows above. A
   bakery shows cake, cookie, and brownie. A repair shop shows screen, battery,
   and service. The item names and prices are already here.
2. **Pack inference.** The business names, item names, and sub variants are the
   keyword table. `cake` maps to bakery, `screen` to repairs, `mural` to
   freelance.
3. **Test corpus.** Every business is one assertion: the first item name must
   infer the row's pack. A classifier that passes 140 businesses is good enough
   for v1.

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
- **Pricing strategy.** That lives in [economics.md](economics.md).
- **Localisation.** Item names here are English. The keyword table needs the
  Hindi and Hinglish tokens for each live locale.
- **Regulated trades.** Pharmacy, liquor, and insurance need a licence check
  that v1 does not do. They are out of scope.
