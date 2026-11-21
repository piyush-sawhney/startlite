# Business Catalog

> Part of the StartLite docs. Start at [README](README.md).

- One item per row. The variant sets the price. The sub variant adds a delta.
- One business per heading. No two businesses do the same work.
- 200 businesses across 16 domains, ten items each. This is the source for
  starter items, pack inference, and the test corpus.

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
- **Items.** Ten real items, with real 2026 prices in ₹.

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
| A. Food and drink | 15 |
| B. Bakery and sweets | 8 |
| C. Grocery and daily needs | 13 |
| D. Apparel and tailoring | 13 |
| E. Beauty and personal care | 12 |
| F. Health and wellness | 11 |
| G. Education and coaching | 12 |
| H. Repairs and technical | 18 |
| I. Home and property | 14 |
| J. Events, rentals and media | 14 |
| K. Creative and freelance | 17 |
| L. Retail and trading | 12 |
| M. Transport and gig work | 12 |
| N. Agriculture and rural | 8 |
| O. Pets and plants | 9 |
| P. Print, craft and making | 12 |
| **Total** | **200** |

## A. Food and drink

**Pack:** Food and tiffin · **Tab noun:** Menu · **Unit:** plate, box, piece

### 1. Home tiffin and dabba service

*Rules: monthly plan, time slot, delivery route, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg thali | Half ₹90 · Full ₹110 | Extra phulka +₹8 · Less spicy +₹0 | Variant price, monthly plan |
| Special thali | Half ₹130 · Full ₹150 | Extra paneer +₹30 | Variant price, monthly plan |
| Jain thali | Half ₹100 · Full ₹120 | No onion garlic +₹0 | Variant price, monthly plan |
| Egg curry thali | Half ₹110 · Full ₹135 | Extra egg +₹15 | Variant price, monthly plan |
| Monthly dabba pass | 5 days ₹500 · 7 days ₹700 · 14 days ₹1,400 | Veg +₹0 · Egg +₹150 | Plan length, start date, delivery route |
| Breakfast box | Idli ₹60 · Poha ₹50 · Upma ₹50 | Extra chutney +₹5 | Morning slot, delivery |
| Roti pack | 6 rotis ₹30 · 12 rotis ₹55 | Butter +₹10 | Quantity, delivery |
| Rice box | 500 g ₹70 · 1 kg ₹130 | Jeera rice +₹20 | Quantity, delivery |
| Salad | Small ₹30 · Large ₹50 | Curd +₹10 | Quantity, delivery |
| Sweet of the day | 2 pieces ₹40 | Extra syrup +₹5 | Quantity, daily price |

### 2. Cloud kitchen

*Rules: time slot, delivery, packaging expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Biryani | Single ₹180 · Family ₹650 | Extra salan +₹20 · Boneless +₹30 | Variant price, delivery |
| Burger | Single ₹120 · Double ₹180 | Extra cheese +₹20 · No onion +₹0 | Variant price, quick sale |
| Fries | Regular ₹90 · Large ₹130 | Peri peri +₹10 | Variant price, combo |
| Pizza | 7 inch ₹180 · 10 inch ₹320 | Extra cheese +₹50 | Variant price, delivery |
| Pasta | White sauce ₹220 · Red sauce ₹200 | Extra veggies +₹30 | Variant price, delivery |
| Momos | 6 pieces ₹90 · 10 pieces ₹140 | Fried +₹20 | Variant price, delivery |
| Sandwich | Veg ₹110 · Chicken ₹150 | Grilled +₹20 | Variant price, quick sale |
| Cold coffee | Regular ₹110 · Large ₹150 | Ice cream +₹40 | Variant price, packaging |
| Combo meal | Burger and fries ₹220 | Coke +₹40 | Combo, packaging |
| Party platter | Small ₹900 · Large ₹1,600 | Delivery +₹100 | Quantity, advance |

### 3. Biryani kitchen

*Rules: time slot, advance for bulk, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chicken dum biryani | Single ₹180 · Family ₹650 | Extra salan +₹20 · Boneless +₹30 | Variant price, advance |
| Mutton biryani | Single ₹240 · Family ₹850 | Extra raita +₹20 | Variant price, advance |
| Veg biryani | Single ₹150 · Family ₹520 | Extra veggies +₹30 | Variant price, delivery |
| Egg biryani | Single ₹160 · Family ₹560 | Extra egg +₹15 | Variant price, delivery |
| Prawn biryani | Single ₹280 · Family ₹950 | Cleaned +₹30 | Daily price, advance |
| Raita | 200 g ₹20 · 500 g ₹45 | Boondi +₹10 | Quantity, delivery |
| Salan | 200 ml ₹30 · 500 ml ₹70 | Extra spicy +₹0 | Quantity, delivery |
| Kebab platter | 6 pieces ₹220 · 12 pieces ₹400 | Boneless +₹40 | Quantity, advance |
| Family combo | 1 kg biryani and raita ₹720 | Sweet +₹60 | Combo, advance |
| Bulk order | 10 plates ₹1,600 · 25 plates ₹3,800 | Delivery +₹200 | Quantity, advance, date |

### 4. Chai and snack stall

*Rules: quick sale, no customer needed, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chai | Cup ₹10 · Thermos 5 cups ₹70 | Less sugar +₹0 · Extra ginger +₹0 | Quick sale, variant price |
| Bun maska | Single ₹35 · Double ₹65 | Extra butter +₹10 | Quick sale |
| Samosa | 1 piece ₹18 · 2 pieces ₹35 · 4 pieces ₹65 | Chutney +₹5 | Quick sale, quantity |
| Vada pav | Single ₹25 · Double ₹45 | Extra chutney +₹5 | Quick sale |
| Kachori | 1 piece ₹20 · 4 pieces ₹75 | — | Quick sale, quantity |
| Poha | Plate ₹30 | Sev +₹5 | Morning slot, quick sale |
| Sandwich | Single ₹40 · Double ₹70 | Grilled +₹10 | Quick sale |
| Cold drink | 250 ml ₹20 · 500 ml ₹35 | — | Quick sale, stock |
| Cigarette | Single ₹15 · Pack ₹180 | — | Quick sale, stock |
| Daily cash left | Per day ₹2,000 | — | Daily cash left, expense |

### 5. Momo and street food cart

*Rules: quick sale, parcel, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg momos | 6 pieces ₹70 · 8 pieces ₹90 | Steamed +₹0 · Fried +₹10 · Kurkure +₹20 | Variant price, quick sale |
| Paneer momos | 6 pieces ₹100 · 8 pieces ₹120 | Mayo +₹10 · Schezwan +₹10 | Variant price, quick sale |
| Chicken momos | 6 pieces ₹110 · 8 pieces ₹140 | Fried +₹10 | Variant price, quick sale |
| Fried rice | Half ₹80 · Full ₹130 | Extra egg +₹20 | Variant price, parcel |
| Chowmein | Half ₹70 · Full ₹120 | Extra veggies +₹15 | Variant price, parcel |
| Spring roll | 2 pieces ₹60 · 4 pieces ₹110 | — | Quick sale, quantity |
| Chilli potato | Half ₹80 · Full ₹140 | Extra spicy +₹0 | Variant price, parcel |
| Momo chutney | 50 g ₹10 | Extra spicy +₹0 | Quantity |
| Combo box | Momos and drink ₹120 | — | Combo, parcel |
| Daily cash left | Per day ₹1,500 | — | Daily cash left, expense |

### 6. South Indian breakfast counter

*Rules: morning slot, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Idli | 2 pieces ₹40 · 3 pieces ₹55 | Extra sambar +₹10 · Ghee +₹10 | Variant price, quick sale |
| Masala dosa | Plain ₹60 · Masala ₹70 · Ghee ₹90 | Extra podi +₹10 | Variant price, quick sale |
| Set dosa | 3 pieces ₹70 | Extra chutney +₹10 | Variant price, quick sale |
| Uttapam | Plain ₹60 · Onion ₹70 | Extra tomato +₹10 | Variant price, quick sale |
| Pongal | Plate ₹60 | Extra ghee +₹10 | Morning slot, quick sale |
| Vada | 2 pieces ₹40 | Sambar +₹10 | Quick sale, quantity |
| Filter coffee | Small ₹25 · Large ₹30 | Extra strong +₹0 | Quick sale |
| Buttermilk | Glass ₹20 | — | Quick sale |
| Breakfast combo | Idli and vada ₹70 | Coffee +₹25 | Combo, quick sale |
| Catering plate | Per plate ₹120 | — | Quantity, advance |

### 7. Juice and shake corner

*Rules: quick sale, seasonal fruit price*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fresh juice | Glass ₹60 · 500 ml ₹90 | No sugar +₹0 · Extra ice +₹0 | Variant price, daily fruit cost |
| Shake | Glass ₹90 · 500 ml ₹130 | Dry fruit +₹30 · Chocolate +₹20 | Variant price, quick sale |
| Seasonal fruit bowl | Small ₹70 · Large ₹120 | Curd +₹20 | Variant price, daily price |
| Sugarcane juice | Glass ₹30 · 500 ml ₹50 | Lemon +₹5 | Daily price, quick sale |
| Coconut water | Single ₹40 | — | Stock, quick sale |
| Lassi | Glass ₹60 · 500 ml ₹100 | Mango +₹20 | Variant price, quick sale |
| Falooda | Regular ₹120 | Ice cream +₹30 | Variant price, quick sale |
| Fruit chaat | Plate ₹60 | Extra masala +₹0 | Daily price, quick sale |
| Dry fruit shake | Glass ₹130 | — | Variant price, quick sale |
| Party pack | 5 litres ₹800 | Delivery +₹100 | Quantity, advance |

### 8. Mithai shop

*Rules: festival pre-booking, advance, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kaju katli | 250 g ₹240 · 500 g ₹450 · 1 kg ₹880 | Silver leaf +₹40 | Quantity, advance |
| Gulab jamun | 250 g ₹90 · 500 g ₹170 · 1 kg ₹320 | Extra syrup +₹10 | Quantity, delivery |
| Motichoor laddoo | 250 g ₹150 · 500 g ₹280 · 1 kg ₹540 | Gift box +₹50 | Quantity, festival order |
| Besan laddoo | 250 g ₹120 · 500 g ₹230 | Ghee +₹40 | Quantity, stock |
| Mysore pak | 250 g ₹140 · 500 g ₹260 | — | Quantity, stock |
| Rasmalai | 4 pieces ₹120 · 8 pieces ₹220 | — | Quantity, delivery |
| Soan papdi | 250 g ₹100 · 500 g ₹180 | Gift box +₹40 | Quantity, festival order |
| Peda | 250 g ₹130 · 500 g ₹240 | Kesar +₹30 | Quantity, stock |
| Festival hamper | Small ₹650 · Large ₹1,200 | Corporate logo +₹100 | Custom text, delivery date |
| Wedding box | 500 g ₹450 | Custom box +₹80 | Advance, quantity, delivery |

### 9. Namkeen and farsan shop

*Rules: quantity, delivery, festival gift box*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sev | 250 g ₹80 · 500 g ₹150 · 1 kg ₹280 | Spicy +₹0 · Plain +₹0 | Quantity, stock |
| Bhujia | 250 g ₹90 · 500 g ₹170 · 1 kg ₹320 | Masala +₹0 | Quantity, stock |
| Chakli | 250 g ₹70 · 500 g ₹130 | Extra ajwain +₹0 | Quantity, gift box |
| Mixture | 250 g ₹85 · 500 g ₹160 | Extra spicy +₹0 | Quantity, stock |
| Fafda | 250 g ₹100 | Papaya chutney +₹20 | Morning slot, stock |
| Jalebi | 250 g ₹90 · 500 g ₹170 | Extra syrup +₹10 | Daily price, stock |
| Gathiya | 250 g ₹90 · 500 g ₹170 | — | Quantity, stock |
| Khakhra | 250 g ₹80 | Masala +₹0 | Quantity, stock |
| Gift hamper | Small ₹450 · Large ₹850 | Custom box +₹60 | Gift box, delivery |
| Festival pack | 1 kg ₹520 | — | Quantity, festival order |

### 10. Home pickle and papad maker

*Rules: quantity, courier, shelf life*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Mango pickle | 250 g ₹120 · 500 g ₹220 | Mustard oil +₹0 · Refined oil +₹0 | Quantity, courier |
| Garlic thecha | 250 g ₹140 · 500 g ₹260 | Extra spicy +₹0 | Quantity, courier |
| Urad papad | 250 g ₹100 · 500 g ₹180 | Masala +₹0 · Plain +₹0 | Quantity, courier, breakage |
| Lemon pickle | 250 g ₹110 · 500 g ₹200 | — | Quantity, courier |
| Green chilli pickle | 250 g ₹100 · 500 g ₹180 | — | Quantity, courier |
| Amla murabba | 250 g ₹150 · 500 g ₹280 | — | Quantity, shelf life |
| Masala papad | 250 g ₹120 | Extra chilli +₹0 | Quantity, courier |
| Fryums | 250 g ₹80 | — | Quantity, courier |
| Combo pack | 3 jars ₹550 | Gift wrap +₹60 | Quantity, courier |
| Festival hamper | 5 items ₹1,100 | Custom label +₹100 | Gift box, delivery date |

### 11. Event catering service

*Rules: event date, advance, per-plate quantity, deposit, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Veg plate | Standard ₹250 · Premium ₹350 | Extra sweet +₹20 · Jain +₹0 | Per-plate quantity, event date |
| Non-veg plate | Standard ₹400 · Premium ₹500 | Extra starter +₹40 | Per-plate quantity, event date |
| Live counter | Per counter ₹5,000 | Extra hour +₹1,500 | Event date, slot, advance |
| Breakfast menu | Standard ₹150 · Premium ₹220 | Extra item +₹30 | Per-plate quantity, slot |
| Welcome drink | Per plate ₹40 | Mocktail +₹30 | Quantity, event date |
| Dessert counter | Per plate ₹80 | Ice cream +₹30 | Quantity, event date |
| Snacks package | Per plate ₹120 | Extra item +₹25 | Quantity, slot |
| Service staff | Per person ₹800 | — | Quantity, event date |
| Crockery rental | Per plate ₹15 | — | Quantity, deposit |
| Full event package | Per plate ₹650 | Custom menu +₹100 | Advance, event date, deposit |

### 12. Chocolate and confectionery maker

*Rules: stock, courier, shelf life*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bonbons | Box of 6 ₹450 · Box of 12 ₹850 | Dark +₹0 · Milk +₹0 | Quantity, courier |
| Chocolate bark | 200 g ₹280 | Nuts +₹50 | Stock, courier |
| Laddoo | 250 g ₹220 · 500 g ₹420 | Dry fruit +₹80 | Quantity, festival |
| Truffles | Box of 4 ₹320 · Box of 9 ₹650 | Rum +₹80 | Quantity, shelf life |
| Chocolate bar | 100 g ₹180 | 70% cocoa +₹40 | Stock, courier |
| Gift hamper | Small ₹750 · Large ₹1,400 | Custom box +₹100 | Gift box, delivery date |
| Chocolate covered nuts | 200 g ₹350 | — | Stock, courier |
| Hot chocolate mix | 250 g ₹300 | — | Stock, courier |
| Corporate order | 50 boxes ₹18,000 | Logo +₹1,000 | Quantity, advance |
| Festival box | 12 pieces ₹900 | — | Festival, delivery |

### 13. Ice cream and kulfi maker

*Rules: stock, delivery, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kulfi | Single ₹40 · Box of 6 ₹220 | Malai +₹0 · Pista +₹20 | Quantity, stock |
| Ice cream tub | 500 ml ₹250 · 1 L ₹450 | Vanilla +₹0 · Chocolate +₹30 | Quantity, delivery |
| Ice cream cake | 500 g ₹600 · 1 kg ₹1,100 | — | Date, advance |
| Kulfi falooda | Plate ₹90 | Extra falooda +₹20 | Quick sale, stock |
| Matka kulfi | Single ₹60 | Dry fruit +₹20 | Stock, delivery |
| Cassata | Slice ₹70 · Family ₹550 | — | Stock, delivery |
| Sundae | Small ₹110 · Large ₹160 | Extra topping +₹30 | Quick sale |
| Fruit bar | Single ₹30 · Pack of 6 ₹160 | — | Stock, delivery |
| Party pack | 5 litres ₹1,900 | Dry ice +₹150 | Quantity, advance |
| Wedding counter | Per hour ₹4,500 | Extra flavour +₹500 | Date, slot, advance |

### 14. Roll and kebab counter

*Rules: quick sale, parcel*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chicken roll | Single ₹90 · Double ₹140 | Extra egg +₹15 · Cheese +₹20 | Quick sale, variant price |
| Egg roll | Single ₹60 · Double ₹100 | — | Quick sale |
| Seekh kebab | 4 pieces ₹120 · 8 pieces ₹220 | — | Quick sale, quantity |
| Paneer roll | Single ₹80 · Double ₹130 | Extra paneer +₹25 | Quick sale, variant price |
| Mutton roll | Single ₹130 · Double ₹200 | Extra onion +₹0 | Quick sale, daily price |
| Chicken tikka | 6 pieces ₹180 · 12 pieces ₹340 | Boneless +₹30 | Quantity, parcel |
| Shawarma | Single ₹110 · Double ₹170 | Extra mayo +₹15 | Quick sale |
| Hummus dip | 100 g ₹40 | — | Quantity |
| Combo | Roll and drink ₹120 | Fries +₹60 | Combo, parcel |
| Party platter | 20 pieces ₹650 | Delivery +₹80 | Quantity, advance |

### 15. Food truck

*Rules: slot, event booking, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Burger | Single ₹120 · Double ₹180 | Cheese +₹20 | Quick sale, slot |
| Fries | Regular ₹90 · Large ₹130 | Peri peri +₹10 | Quick sale |
| Wrap | Veg ₹110 · Chicken ₹150 | Extra sauce +₹15 | Quick sale |
| Hot dog | Single ₹100 · Double ₹160 | Cheese +₹20 | Quick sale |
| Nachos | Regular ₹120 | Extra cheese +₹30 | Quick sale |
| Cold drink | 300 ml ₹40 | — | Quick sale, stock |
| Combo meal | Burger, fries, drink ₹250 | — | Combo, quick sale |
| Event booking | Per hour ₹2,500 | Minimum 4 hours +₹0 | Date, advance, slot |
| Corporate lunch | Per plate ₹180 | — | Quantity, advance |
| Daily cash left | Per day ₹3,000 | — | Daily cash left, expense |

## B. Bakery and sweets

**Pack:** Bakery and cakes · **Tab noun:** Menu · **Unit:** 500 g, 1 kg, piece

### 16. Home baker (celebration cakes)

*Rules: needed-by date, slot, advance, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chocolate truffle cake | 500 g ₹450 · 1 kg ₹850 | Eggless +₹50 · Extra ganache +₹80 | Variant price, message on cake |
| Birthday cake | 500 g ₹500 · 1 kg ₹950 | Eggless +₹50 · Photo print +₹150 | Custom text, photo upload |
| Cupcakes | Box of 6 ₹300 · Box of 12 ₹560 | Eggless +₹30 · Custom topper +₹40 | Box quantity, custom text |
| Red velvet cake | 500 g ₹550 · 1 kg ₹1,000 | Cream cheese +₹100 | Variant price, date |
| Pineapple cake | 500 g ₹400 · 1 kg ₹750 | Eggless +₹50 | Variant price, date |
| Butterscotch cake | 500 g ₹480 · 1 kg ₹900 | Extra crunch +₹60 | Variant price, date |
| Brownie tray | 500 g ₹450 | Walnut +₹80 | Quantity, date |
| Anniversary cake | 500 g ₹600 · 1 kg ₹1,100 | Fresh flowers +₹200 | Custom text, photo reference |
| Photo cake | 500 g ₹700 · 1 kg ₹1,250 | Edible print +₹150 | Photo upload, date |
| Bento cake | 250 g ₹350 | Custom text +₹50 | Custom text, quick sale |

### 17. Patisserie and bread studio

*Rules: daily stock, pre-order, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sourdough loaf | Half ₹160 · Full ₹280 | Sliced +₹0 | Variant price, daily stock |
| Croissant | Single ₹90 · Box of 4 ₹340 | Chocolate +₹20 · Almond +₹30 | Variant price, pre-order |
| Baguette | Single ₹150 · Half ₹80 | Sliced +₹0 | Variant price, daily stock |
| Multigrain loaf | 400 g ₹180 | Sliced +₹0 | Daily stock, pre-order |
| Cinnamon roll | Single ₹110 · Box of 4 ₹400 | Cream cheese +₹30 | Daily stock |
| Danish pastry | Single ₹120 | Fruit +₹30 | Daily stock, pre-order |
| Éclair | Single ₹100 · Box of 4 ₹360 | Chocolate +₹20 | Daily stock |
| Tart | Single ₹140 | Seasonal fruit +₹40 | Daily stock, pre-order |
| Morning box | 6 assorted ₹550 | Coffee +₹80 | Pre-order, date |
| Bread subscription | Weekly ₹450 | — | Pre-order, route, date |

### 18. Cookie and brownie gifting

*Rules: needed-by date, delivery, custom text, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Cookie box | 4 pieces ₹180 · 6 pieces ₹250 · 9 pieces ₹360 | Gift wrap +₹50 | Box quantity, custom card |
| Brownie box | 4 pieces ₹200 · 6 pieces ₹280 · 9 pieces ₹400 | Walnut +₹40 · Eggless +₹30 | Box quantity, gift wrap |
| Festive hamper | Small ₹850 · Large ₹1,400 | Corporate logo +₹100 | Hamper contents, delivery date |
| Chocolate chip cookie | 6 pieces ₹220 | Sea salt +₹20 | Quantity, delivery |
| Oat cookie | 6 pieces ₹240 | Sugar free +₹30 | Quantity, delivery |
| Fudge brownie | 4 pieces ₹260 | Extra fudge +₹50 | Quantity, delivery |
| Blondie | 4 pieces ₹240 | White chocolate +₹40 | Quantity, delivery |
| Custom cookie | 12 pieces ₹600 | Logo print +₹150 | Custom text, photo |
| Corporate box | 25 boxes ₹9,500 | Logo +₹800 | Quantity, advance |
| Wedding favour | 50 pieces ₹4,500 | Custom tag +₹500 | Quantity, advance, date |

### 19. Wedding and tiered cake designer

*Rules: event date, advance 50%, photo reference, delivery and setup, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Two-tier cake | 2 kg ₹6,000 · 3 kg ₹8,500 | Eggless +₹300 · Fresh flowers +₹500 | Tier count, flavour per tier |
| Three-tier cake | 4 kg ₹12,000 · 5 kg ₹15,000 | Fondant +₹800 · LED stand +₹600 | Tier count, delivery and setup |
| Fondant topper | Small ₹800 · Large ₹1,500 | Custom figure +₹500 | Photo reference, custom text |
| Four-tier cake | 6 kg ₹20,000 | Sugar flowers +₹2,000 | Tier count, setup, deposit |
| Semi-naked cake | 2 kg ₹5,500 | Fresh fruit +₹400 | Photo reference, date |
| Dummy tier | Per tier ₹1,500 | — | Event date, deposit |
| Cupcake tower | 50 pieces ₹7,500 | Stand rental +₹1,000 | Quantity, setup |
| Dessert table | 100 pieces ₹12,000 | Setup +₹1,500 | Event date, setup |
| Groom cake | 1 kg ₹3,500 | Custom design +₹800 | Photo reference, date |
| Tasting box | 4 flavours ₹1,200 | — | Advance, slot |

### 20. Custom photo and number cake maker

*Rules: needed-by date, advance, photo upload, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Number cake | Single digit ₹1,200 · Double digit ₹1,800 | Eggless +₹50 · Extra cream +₹80 | Custom text, photo upload |
| Photo cake | 500 g ₹900 · 1 kg ₹1,500 | Eggless +₹50 · Edible frame +₹100 | Photo upload, variant price |
| Cupcake set | Box of 6 ₹500 · Box of 12 ₹900 | Photo topper +₹100 | Box quantity, custom text |
| Letter cake | Per letter ₹700 | Custom text +₹50 | Custom text, date |
| Collage cake | 1 kg ₹1,800 | Extra photos +₹200 | Photo upload, date |
| Theme cake | 1 kg ₹1,600 | 3D figure +₹500 | Photo reference, date |
| Pull-apart cake | 12 pieces ₹1,400 | Custom text +₹80 | Quantity, date |
| Edible print sheet | A4 ₹250 | — | Photo upload, stock |
| Cake banner | ₹150 | Custom text +₹30 | Custom text, quick sale |
| Same-day cake | 500 g ₹1,100 | — | Quick sale, slot |

### 21. Cupcake and dessert jar studio

*Rules: needed-by date, delivery, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Cupcake | Box of 6 ₹300 · Box of 12 ₹560 | Custom topper +₹40 | Box quantity, custom text |
| Dessert jar | Single ₹120 · Box of 6 ₹650 | — | Quantity, delivery |
| Cake pop | Box of 6 ₹240 | — | Quantity, custom text |
| Mini cupcake | Box of 12 ₹400 | — | Box quantity, delivery |
| Cheesecake jar | Single ₹160 · Box of 4 ₹580 | — | Quantity, delivery |
| Brownie jar | Single ₹140 · Box of 4 ₹500 | Walnut +₹40 | Quantity, delivery |
| Cupcake bouquet | 7 pieces ₹750 | Custom ribbon +₹60 | Custom text, date |
| DIY kit | Box ₹650 | — | Stock, delivery |
| Party pack | 24 pieces ₹1,000 | Delivery +₹100 | Quantity, advance |
| Wedding favour | 50 pieces ₹3,500 | Custom tag +₹400 | Quantity, advance |

### 22. Bread and rusk wholesaler

*Rules: stock, wholesale, delivery, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bread loaf | 400 g ₹40 · 800 g ₹70 | — | Quantity, wholesale |
| Rusk | 250 g ₹80 · 500 g ₹150 | Elaichi +₹0 · Jeera +₹0 | Quantity, wholesale |
| Pav | Pack of 6 ₹30 | — | Quantity, daily stock |
| Bun | Pack of 6 ₹35 | — | Quantity, daily stock |
| Milk bread | 400 g ₹50 | — | Quantity, wholesale |
| Wheat bread | 400 g ₹60 | — | Quantity, wholesale |
| Toast | 250 g ₹70 | — | Quantity, wholesale |
| Khari | 250 g ₹90 | — | Quantity, wholesale |
| Cream roll | Pack of 6 ₹120 | — | Quantity, daily stock |
| Shop supply | Daily ₹2,500 | Credit +₹0 | Route, credit, delivery |

### 23. Cake topper and decoration studio

*Rules: needed-by date, courier, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Acrylic topper | ₹350 | Custom name +₹50 | Custom text, courier |
| Fondant topper | ₹500 | 3D figure +₹300 | Photo reference, date |
| Decoration kit | ₹450 | — | Stock, courier |
| Cake candle | Pack of 6 ₹120 | Number candle +₹40 | Stock, quick sale |
| Cake ribbon | Per metre ₹30 | Custom print +₹50 | Stock, courier |
| Cupcake wrapper | Pack of 50 ₹180 | Custom colour +₹40 | Quantity, courier |
| Cake stand | Rental ₹400 per day | Deposit +₹500 | Per day, deposit |
| Happy birthday banner | ₹250 | Custom text +₹50 | Custom text, courier |
| Balloon set | ₹350 | Custom colour +₹60 | Stock, courier |
| Theme decoration | ₹2,500 | Setup +₹500 | Date, setup |

## C. Grocery and daily needs

**Pack:** Grocery · **Tab noun:** Items · **Unit:** g, kg, litre, packet

### 24. Kirana and general store

*Rules: quantity, credit, delivery, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Atta | 5 kg ₹240 · 10 kg ₹460 | Brand +₹0 | Quantity, stock |
| Milk | 500 ml ₹28 · 1 L ₹55 | Cow +₹5 · Buffalo +₹8 | Quantity, daily stock |
| Cooking oil | 1 L ₹140 · 5 L ₹680 | Refined +₹0 · Mustard +₹40 | Quantity, credit |
| Rice | 5 kg ₹320 · 10 kg ₹620 | Basmati +₹200 | Quantity, stock |
| Sugar | 1 kg ₹45 · 5 kg ₹220 | — | Quantity, stock |
| Dal | 1 kg ₹120 · 5 kg ₹580 | Toor +₹0 · Moong +₹20 | Quantity, stock |
| Tea | 250 g ₹140 · 500 g ₹270 | — | Quantity, stock |
| Detergent | 1 kg ₹120 · 2 kg ₹230 | — | Quantity, stock |
| Monthly kit | Standard ₹1,800 | Custom items +₹0 | Monthly bill, credit |
| Home delivery | Per order ₹30 | Free above ₹500 +₹0 | Route, delivery |

### 25. Fruit and vegetable cart

*Rules: daily price, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tomato | 250 g ₹12 · 500 g ₹22 · 1 kg ₹40 | — | Daily price, quantity |
| Apple | 250 g ₹50 · 500 g ₹95 · 1 kg ₹180 | Kashmiri +₹40 | Daily price, quantity |
| Banana | 6 pieces ₹35 · 12 pieces ₹60 | — | Quantity, quick sale |
| Onion | 500 g ₹25 · 1 kg ₹45 | — | Daily price, quantity |
| Potato | 500 g ₹20 · 1 kg ₹38 | — | Daily price, quantity |
| Spinach | Bunch ₹20 | Cleaned +₹5 | Daily price, quick sale |
| Coriander | Bunch ₹15 | — | Daily price, quick sale |
| Lemon | 4 pieces ₹20 | — | Daily price, quantity |
| Mixed basket | Small ₹150 · Large ₹280 | — | Quantity, delivery |
| Weekly subscription | 3 kg ₹500 | — | Route, weekly, daily price |

### 26. Dairy and paneer shop

*Rules: daily stock, route, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Milk | 500 ml ₹38 · 1 L ₹72 | Cow +₹5 · Buffalo +₹8 | Quantity, daily route |
| Paneer | 250 g ₹110 · 500 g ₹210 | Fresh +₹0 · Malai +₹20 | Quantity, daily stock |
| Ghee | 250 ml ₹250 · 500 ml ₹480 | Cow +₹80 · Buffalo +₹0 | Quantity, stock |
| Curd | 250 g ₹30 · 500 g ₹55 | — | Quantity, daily stock |
| Butter | 100 g ₹60 · 500 g ₹280 | Salted +₹0 | Quantity, stock |
| Buttermilk | 500 ml ₹25 | — | Quantity, daily stock |
| Khoya | 250 g ₹140 | — | Quantity, daily stock |
| Cheese | 200 g ₹160 | — | Quantity, stock |
| Monthly milk pass | 30 L ₹2,000 | — | Monthly, route, attendance |
| Shop supply | Per crate ₹1,200 | Credit +₹0 | Route, credit |

### 27. Dry fruits and nuts

*Rules: quantity, delivery, festival gift box*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Almonds | 250 g ₹650 · 500 g ₹1,250 | Mamra +₹300 | Quantity, stock |
| Walnuts | 250 g ₹220 · 500 g ₹420 | Shelled +₹100 | Quantity, stock |
| Cashew | 250 g ₹380 · 500 g ₹740 | W320 +₹150 | Quantity, gift box |
| Pistachio | 250 g ₹450 · 500 g ₹880 | Salted +₹0 | Quantity, stock |
| Raisins | 250 g ₹120 · 500 g ₹230 | Black +₹30 | Quantity, stock |
| Dates | 500 g ₹220 · 1 kg ₹420 | Medjool +₹300 | Quantity, stock |
| Figs | 250 g ₹350 | — | Quantity, stock |
| Mixed nuts | 500 g ₹650 | — | Quantity, gift box |
| Gift hamper | Small ₹950 · Large ₹1,800 | Custom box +₹150 | Gift box, delivery |
| Corporate box | 25 boxes ₹22,000 | Logo +₹1,500 | Quantity, advance |

### 28. Fish and seafood

*Rules: daily price, quantity, quick sale, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Rohu | 500 g ₹95 · 1 kg ₹180 | Whole +₹0 · Cleaned +₹20 | Daily price, quantity |
| Prawns | 250 g ₹120 · 500 g ₹230 | Cleaned +₹30 · Deveined +₹50 | Daily price, quantity |
| Pomfret | 500 g ₹460 · 1 kg ₹900 | Whole +₹0 · Cleaned +₹40 | Daily price, quantity |
| Katla | 500 g ₹110 · 1 kg ₹210 | Curry cut +₹20 | Daily price, quantity |
| Tilapia | 500 g ₹90 · 1 kg ₹170 | Cleaned +₹20 | Daily price, quantity |
| Crab | 500 g ₹250 | Cleaned +₹40 | Daily price, quantity |
| Squid | 250 g ₹140 | Cleaned +₹30 | Daily price, quantity |
| Surmai | 500 g ₹400 | Sliced +₹30 | Daily price, quantity |
| Fish curry pack | 500 g ₹220 | — | Quantity, delivery |
| Party pack | 2 kg ₹1,600 | Cleaning +₹150 | Quantity, advance |

### 29. Chicken and mutton shop

*Rules: daily price, quantity, quick sale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chicken | 500 g ₹115 · 1 kg ₹220 | Curry cut +₹0 · Biryani cut +₹10 · Skinless +₹10 | Daily price, quantity |
| Mutton | 500 g ₹390 · 1 kg ₹750 | Curry cut +₹0 · Keema +₹20 | Daily price, quantity |
| Eggs | 6 pieces ₹42 · 12 pieces ₹84 · 30 pieces ₹200 | — | Quantity, stock |
| Chicken breast | 500 g ₹180 | Boneless +₹30 | Daily price, quantity |
| Chicken liver | 250 g ₹60 | — | Daily price, quantity |
| Mutton chops | 500 g ₹420 | — | Daily price, quantity |
| Country chicken | 1 kg ₹450 | — | Daily price, quantity |
| Marinated chicken | 500 g ₹200 | Tikka +₹30 | Daily price, quantity |
| Combo pack | 1 kg chicken and 6 eggs ₹260 | — | Combo, quantity |
| Party order | 5 kg ₹1,050 | Delivery +₹100 | Advance, quantity |

### 30. Flour mill (chakki)

*Rules: job work, quantity, token, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Grinding | 5 kg ₹25 · 10 kg ₹50 · 25 kg ₹125 | Fine +₹0 · Coarse +₹0 | Job work, quantity, token |
| Atta | 5 kg ₹225 · 10 kg ₹440 | Fine +₹0 · Coarse +₹0 | Quantity, stock |
| Besan | 1 kg ₹90 · 5 kg ₹430 | — | Quantity, stock |
| Maida | 1 kg ₹45 · 5 kg ₹210 | — | Quantity, stock |
| Suji | 1 kg ₹55 · 5 kg ₹260 | — | Quantity, stock |
| Dalia | 1 kg ₹60 | — | Quantity, stock |
| Masala grinding | Per kg ₹80 | — | Job work, quantity |
| Turmeric powder | 250 g ₹60 · 1 kg ₹220 | — | Quantity, stock |
| Monthly grinding pass | 10 kg ₹180 | — | Monthly, token |
| Home delivery | Per order ₹40 | Free above ₹500 +₹0 | Route, delivery |

### 31. Water can supplier

*Rules: deposit, route, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 20 L water can | 1 can ₹60 · 5 cans ₹290 · 10 cans ₹560 | — | Quantity, route, deposit |
| Dispenser rental | Monthly ₹500 | Hot and cold +₹200 | Monthly, deposit |
| Bottle | 1 L ₹20 · Pack of 12 ₹220 | — | Quantity, stock |
| Can deposit | Per can ₹350 | — | Deposit, return |
| Monthly pass | 20 cans ₹1,000 | — | Monthly, route |
| Office plan | 50 cans ₹2,400 | — | Monthly, route, credit |
| Water pump | ₹450 | — | Stock, warranty |
| Cleaning service | Per can ₹20 | — | Quantity, route |
| New connection | ₹500 | — | Deposit, address |
| Emergency delivery | Per can ₹90 | — | Quick sale, route |

### 32. Pooja samagri shop

*Rules: quantity, festival, gift pack*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Agarbatti | Small ₹40 · Large ₹90 | Sandal +₹20 · Rose +₹20 | Quantity, stock |
| Camphor | 50 g ₹60 · 100 g ₹110 | — | Quantity, stock |
| Pooja thali | Small ₹250 · Large ₹450 | Custom items +₹100 | Gift pack, festival |
| Diya | Pack of 12 ₹60 | Clay +₹0 · Brass +₹200 | Quantity, festival |
| Kumkum | 50 g ₹30 | — | Quantity, stock |
| Haldi | 100 g ₹40 | — | Quantity, stock |
| Coconut | Single ₹35 | — | Stock, festival |
| Ghee lamp | Pack of 6 ₹120 | — | Quantity, stock |
| Festival kit | Small ₹450 · Large ₹850 | Custom items +₹100 | Gift pack, festival |
| Wedding kit | ₹2,500 | Custom items +₹300 | Advance, quantity |

### 33. Oil mill (ghani)

*Rules: job work, quantity, token, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Cold pressed oil | 1 L ₹320 · 5 L ₹1,500 | Coconut +₹80 · Sesame +₹0 | Quantity, stock |
| Job work crushing | Per kg ₹12 | Filtered +₹3 | Job work, quantity, token |
| Oil cake | Per kg ₹25 | — | Quantity, stock |
| Groundnut oil | 1 L ₹280 · 5 L ₹1,300 | — | Quantity, stock |
| Mustard oil | 1 L ₹240 · 5 L ₹1,100 | — | Quantity, stock |
| Coconut oil | 500 ml ₹220 · 1 L ₹400 | Virgin +₹100 | Quantity, stock |
| Sesame oil | 500 ml ₹260 | — | Quantity, stock |
| Castor oil | 250 ml ₹150 | — | Quantity, stock |
| Monthly pass | 5 L ₹1,200 | — | Monthly, token |
| Home delivery | Per order ₹50 | — | Route, delivery |

### 34. Seeds and fertiliser shop

*Rules: season, quantity, credit, licence note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Seed packet | 500 g ₹180 · 1 kg ₹320 | Hybrid +₹120 | Season, quantity, stock |
| Urea | 45 kg ₹270 | — | Quantity, credit |
| Pesticide | 500 ml ₹450 · 1 L ₹820 | — | Quantity, licence note |
| DAP | 50 kg ₹1,350 | — | Quantity, credit |
| Potash | 50 kg ₹1,100 | — | Quantity, credit |
| Vermicompost | 5 kg ₹150 · 25 kg ₹600 | — | Quantity, stock |
| Sprayer | 5 L ₹850 | Battery +₹400 | Stock, warranty |
| Drip pipe | Per metre ₹18 | — | Quantity, stock |
| Seed treatment | 250 ml ₹220 | — | Quantity, licence note |
| Seasonal kit | Per acre ₹1,800 | — | Season, quantity |

### 35. Egg wholesaler

*Rules: daily price, quantity, credit, route*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Egg tray | Tray of 30 ₹180 · 10 trays ₹1,750 | — | Daily price, quantity, credit |
| Country egg | Tray of 30 ₹300 | — | Daily price, stock |
| Broken egg | Per kg ₹90 | — | Daily price, quantity |
| Duck egg | Tray of 30 ₹360 | — | Daily price, stock |
| Desi egg | 6 pieces ₹90 | — | Daily price, stock |
| Boiled egg | Per piece ₹12 | — | Quick sale, daily price |
| Egg powder | 500 g ₹350 | — | Stock, quantity |
| Crate deposit | Per crate ₹250 | — | Deposit, return |
| Shop route | Daily 20 trays ₹3,400 | Credit +₹0 | Route, credit, delivery |
| Monthly supply | 300 trays ₹50,000 | — | Monthly, credit |

### 36. Baking supplies shop

*Rules: stock, quantity, delivery, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Maida | 1 kg ₹45 · 5 kg ₹210 | — | Quantity, stock |
| Cocoa powder | 250 g ₹180 · 1 kg ₹650 | — | Quantity, stock |
| Cake mould | 6 inch ₹250 · 8 inch ₹320 | Non-stick +₹80 | Stock, delivery |
| Baking powder | 100 g ₹40 | — | Quantity, stock |
| Baking soda | 100 g ₹35 | — | Quantity, stock |
| Vanilla essence | 30 ml ₹60 | — | Quantity, stock |
| Whipping cream | 250 ml ₹120 · 1 L ₹420 | — | Quantity, stock |
| Chocolate compound | 500 g ₹250 · 1 kg ₹460 | Dark +₹40 | Quantity, stock |
| Piping set | 12 pieces ₹450 | — | Stock, delivery |
| Shop supply | Monthly ₹8,000 | Credit +₹0 | Monthly, credit, delivery |

## D. Apparel and tailoring

**Pack:** Tailoring · **Tab noun:** Services · **Unit:** piece, set

### 37. Blouse tailor

*Rules: measurement, needed-by date, advance, trial*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Blouse stitching | Simple ₹450 · Designer ₹650 | Lining +₹100 · Padded +₹80 · Back design +₹150 | Measurement, date, advance |
| Saree fall | Plain ₹80 · Designer ₹150 | — | Quick sale, same day |
| Blouse alteration | Basic ₹100 · Fitting ₹150 | Urgent +₹50 | Measurement, date |
| Princess cut blouse | ₹750 | Lining +₹100 | Measurement, date |
| Boat neck blouse | ₹650 | Padded +₹80 | Measurement, date |
| Backless blouse | ₹900 | Custom design +₹200 | Measurement, date, photo |
| Blouse lining | ₹100 | — | Quick sale |
| Padding | Pair ₹80 | — | Quick sale |
| Blouse set | 3 blouses ₹1,500 | — | Quantity, date |
| Bridal blouse | ₹2,500 | Heavy work +₹1,000 | Measurement, advance, date |

### 38. Boutique (stitching and retail)

*Rules: measurement, needed-by date, advance, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kurti stitching | Simple ₹600 · Designer ₹900 | Lining +₹100 · Custom neck +₹150 | Measurement, date, advance |
| Suit set | 2-piece ₹1,800 · 3-piece ₹2,400 | Lining +₹200 · Dupatta +₹350 | Measurement, date, photo |
| Readymade dupatta | Cotton ₹350 · Silk ₹850 | — | Stock, photo |
| Anarkali | Simple ₹1,500 · Designer ₹2,500 | Lining +₹200 | Measurement, date |
| Palazzo | ₹450 | Lining +₹80 | Measurement, date |
| Lehenga stitching | Semi ₹3,500 · Bridal ₹6,000 | Canvas +₹800 | Measurement, trial, advance |
| Gown | ₹2,200 | Custom design +₹500 | Measurement, date |
| Coord set | ₹1,400 | — | Measurement, date |
| Alteration | Basic ₹150 | Urgent +₹50 | Quick sale, date |
| Trial session | ₹300 | — | Slot, measurement |

### 39. Alteration shop

*Rules: quick sale, same day, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Hem | ₹50 | Same day +₹30 | Quick sale, same day |
| Waist | ₹80 | Same day +₹30 | Quick sale |
| Zip replacement | ₹120 | Invisible +₹40 | Date, pickup |
| Sleeve shortening | ₹90 | — | Quick sale |
| Darted fitting | ₹150 | — | Measurement, date |
| Button replacement | ₹30 | — | Quick sale |
| Hook and eye | ₹40 | — | Quick sale |
| Lining change | ₹350 | — | Date, pickup |
| Blouse fitting | ₹120 | — | Measurement, date |
| Bulk alteration | 10 pieces ₹700 | — | Quantity, date |

### 40. Embroidery and maggam work

*Rules: measurement, needed-by date, advance, photo reference, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Maggam blouse | Simple ₹1,800 · Bridal ₹3,500 | Stone work +₹800 · Cutwork +₹500 | Measurement, date, advance |
| Saree border | Small ₹2,500 · Full ₹5,000 | Zari +₹1,000 · Mirror +₹700 | Measurement, date, deposit |
| Dupatta embroidery | Light ₹1,200 · Heavy ₹3,000 | Custom motif +₹500 | Photo reference, date |
| Zardosi work | Per piece ₹4,000 | — | Measurement, date, advance |
| Aari work | Basic ₹2,000 · Heavy ₹4,500 | Beads +₹600 | Measurement, date |
| Mirror work | Per metre ₹450 | — | Quantity, date |
| Sequin work | Per metre ₹350 | — | Quantity, date |
| Name embroidery | Per piece ₹150 | — | Custom text, quick sale |
| Logo embroidery | 50 pieces ₹4,000 | — | Quantity, advance |
| Bridal package | ₹12,000 | Custom design +₹2,000 | Advance, date, deposit |

### 41. Gents tailor and suiting

*Rules: measurement, needed-by date, trial, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shirt | Cotton ₹450 · Premium ₹650 | Lining +₹100 · Slim fit +₹0 | Measurement, date, trial |
| Trouser | Formal ₹650 · Casual ₹550 | Lining +₹100 | Measurement, date |
| Suit | 2-piece ₹3,500 · 3-piece ₹4,500 | Lining +₹300 · Extra trouser +₹900 | Measurement, trial, advance |
| Kurta | Simple ₹700 · Designer ₹1,100 | Lining +₹100 | Measurement, date |
| Sherwani | ₹6,500 | Hand work +₹2,000 | Measurement, trial, advance |
| Waistcoat | ₹1,200 | Lining +₹150 | Measurement, date |
| Blazer | ₹2,800 | Lining +₹250 | Measurement, trial |
| Pathani suit | ₹1,400 | — | Measurement, date |
| Alteration | ₹150 | Urgent +₹50 | Quick sale, date |
| Wedding package | 3 pieces ₹12,000 | Extra piece +₹3,000 | Advance, trial, date |

### 42. School uniform tailor

*Rules: season, bulk quantity, measurement, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shirt | Small ₹250 · Medium ₹280 · Large ₹310 | House colour +₹20 | Measurement, bulk quantity |
| Pinafore | Small ₹400 · Medium ₹430 · Large ₹460 | House colour +₹20 | Measurement, bulk quantity |
| Sports uniform | Set ₹350 | House colour +₹20 | Bulk quantity, season |
| Trouser | Small ₹280 · Medium ₹310 · Large ₹340 | — | Measurement, bulk quantity |
| Skirt | Small ₹300 · Medium ₹330 | — | Measurement, bulk quantity |
| Sweater | Small ₹450 · Medium ₹500 | — | Season, bulk quantity |
| Tie | ₹60 | — | Stock, bulk quantity |
| Belt | ₹80 | — | Stock, bulk quantity |
| School bag | ₹450 | — | Stock, bulk quantity |
| Bulk order | 50 sets ₹18,000 | — | Advance, quantity, date |

### 43. Saree fall and pico

*Rules: quick sale, same day, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fall | ₹80 | Designer ₹150 | Quick sale, same day |
| Pico | ₹30 | Colour match +₹10 | Quick sale |
| Tassels | ₹150 | Custom colour +₹30 | Date, pickup |
| Saree pre-drape | ₹500 | Pinned +₹100 | Date, pickup |
| Blouse hook | ₹40 | — | Quick sale |
| Saree ironing | ₹40 | — | Quick sale, same day |
| Saree polish | ₹250 | — | Date, pickup |
| Fall and pico combo | ₹100 | — | Quick sale, same day |
| Bulk pico | 10 sarees ₹250 | — | Quantity, date |
| Pickup service | Per order ₹50 | — | Pickup, route |

### 44. Fabric store

*Rules: quantity, stock, wholesale, credit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Cotton | 1 m ₹120 · 5 m ₹560 | — | Quantity, stock |
| Silk | 1 m ₹450 · 5 m ₹2,100 | Pure +₹200 | Quantity, stock |
| Lining | 1 m ₹60 · 10 m ₹550 | — | Quantity, wholesale |
| Chiffon | 1 m ₹180 | — | Quantity, stock |
| Georgette | 1 m ₹220 | — | Quantity, stock |
| Rayon | 1 m ₹140 | — | Quantity, stock |
| Denim | 1 m ₹260 | — | Quantity, stock |
| Linen | 1 m ₹320 | — | Quantity, stock |
| Blouse piece | 1 m ₹150 | — | Quantity, stock |
| Wholesale bundle | 20 m ₹3,500 | Credit +₹0 | Quantity, wholesale, credit |

### 45. Saree and lehenga reseller (social)

*Rules: photo, courier, COD, return*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Saree | Cotton ₹1,800 · Silk ₹3,500 | With blouse +₹800 · Stitched +₹1,200 | Photo, courier, COD |
| Lehenga | Semi-stitched ₹8,500 · Bridal ₹18,000 | Custom size +₹1,500 | Photo, courier, advance |
| Dupatta | ₹650 | — | Stock, courier |
| Kurti set | ₹1,200 | — | Photo, courier, COD |
| Coord set | ₹1,800 | — | Photo, courier |
| Gown | ₹4,500 | — | Photo, courier, COD |
| Jewellery set | ₹850 | — | Stock, courier |
| Clutch | ₹450 | — | Stock, courier |
| Return request | Per order ₹0 | — | Return, photo |
| Bulk reseller | 10 pieces ₹15,000 | — | Quantity, credit |

### 46. Kids wear tailor

*Rules: measurement, needed-by date, advance, growth allowance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Frock | Small ₹350 · Medium ₹420 · Large ₹480 | Lining +₹60 | Measurement, date |
| School uniform set | Set ₹550 | Extra set +₹500 | Measurement, bulk quantity |
| Party wear | ₹850 | Custom design +₹250 | Measurement, photo reference |
| Baba suit | ₹600 | — | Measurement, date |
| Kurta pyjama | ₹700 | — | Measurement, date |
| Lehenga choli | ₹1,200 | — | Measurement, date |
| Shorts | ₹250 | — | Measurement, date |
| T-shirt | ₹300 | — | Measurement, date |
| Growth allowance | ₹100 | — | Measurement, date |
| Sibling set | 2 pieces ₹1,000 | — | Quantity, date |

### 47. Knitting and woollen wear

*Rules: measurement, season, needed-by date, courier*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sweater | Small ₹1,200 · Medium ₹1,400 · Large ₹1,600 | Hand knit +₹400 | Measurement, date |
| Baby set | ₹900 | Booties +₹200 | Measurement, date |
| Muffler | ₹450 | Custom colour +₹50 | Stock, courier |
| Cardigan | ₹1,500 | Buttons +₹100 | Measurement, date |
| Shawl | ₹1,800 | Custom colour +₹150 | Stock, courier |
| Cap | ₹250 | Pom pom +₹40 | Stock, courier |
| Socks | Pair ₹180 | — | Stock, courier |
| Gloves | Pair ₹220 | — | Stock, courier |
| Blanket | Small ₹1,500 · Large ₹2,200 | — | Stock, courier |
| Custom order | Per piece ₹1,400 | — | Measurement, advance |

### 48. Laundry and dry cleaning

*Rules: quantity, pickup, delivery, stain note, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shirt wash and iron | Single ₹25 · 10 pieces ₹220 | Starch +₹5 | Quantity, pickup, delivery |
| Dry clean saree | Single ₹180 | Heavy work +₹80 | Stain note, delivery |
| Blanket wash | Single ₹350 · Double ₹450 | — | Quantity, delivery |
| Trouser wash and iron | Single ₹30 · 10 pieces ₹270 | — | Quantity, pickup |
| Suit dry clean | 2-piece ₹350 · 3-piece ₹450 | — | Stain note, delivery |
| Curtain wash | Per panel ₹120 | — | Quantity, pickup |
| Shoe cleaning | Pair ₹250 | — | Quantity, delivery |
| Bag cleaning | ₹350 | — | Quantity, delivery |
| Monthly plan | 20 pieces ₹550 | — | Monthly, pickup |
| Express service | Per order ₹100 | — | Quick sale, same day |

### 49. Cobbler and shoe repair

*Rules: quick sale, same day, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sole replacement | ₹350 | Original +₹200 | Warranty, date |
| Stitching | ₹120 | Same day +₹40 | Quick sale, same day |
| Polish | ₹50 | — | Quick sale |
| Heel tip | ₹80 | — | Quick sale |
| Zip repair | ₹150 | — | Warranty, date |
| Shoe stretching | ₹200 | — | Quick sale, same day |
| Bag repair | ₹250 | — | Warranty, date |
| Sandal repair | ₹180 | — | Warranty, date |
| Key duplicate | ₹60 | — | Quick sale |
| Pickup service | Per order ₹50 | — | Pickup, route |

## E. Beauty and personal care

**Pack:** Beauty and salon · **Tab noun:** Services · **Unit:** visit, session

### 50. Ladies parlour

*Rules: time slot, package, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Threading | Eyebrow ₹40 · Upper lip ₹30 · Full face ₹120 | — | Quick sale, repeat |
| Facial | Basic ₹650 · Premium ₹950 | Fruit +₹0 · Gold +₹200 | Slot, package |
| Waxing | Full arms ₹250 · Full legs ₹400 · Full body ₹1,200 | Chocolate +₹50 · Rica +₹100 | Slot, package |
| Haircut | Basic ₹250 · Stylist ₹450 | Wash +₹100 | Slot, repeat |
| Hair spa | ₹600 | Extra serum +₹150 | Slot, package |
| Bleach | Face ₹350 · Neck ₹200 | — | Slot, repeat |
| Detan | Face ₹300 | — | Slot, repeat |
| Manicure | ₹350 | Gel +₹200 | Slot, repeat |
| Pedicure | ₹450 | Gel +₹200 | Slot, repeat |
| Bridal package | ₹8,000 | Trial +₹1,500 | Advance, date, slot |

### 51. Gents barber shop

*Rules: walk-in queue, quick sale, monthly pass*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Haircut | Senior ₹120 · Junior ₹100 | Beard +₹80 · Head massage +₹50 | Quick sale, queue |
| Beard grooming | Trim ₹80 · Hot towel ₹120 | Beard colour +₹100 | Quick sale |
| Hair spa | ₹400 | Extra serum +₹100 | Slot, repeat |
| Shave | ₹70 | Alum +₹0 | Quick sale, queue |
| Head massage | ₹150 | Almond oil +₹30 | Quick sale |
| Hair colour | ₹350 | Ammonia free +₹150 | Slot, repeat |
| Face clean-up | ₹250 | — | Quick sale |
| Kids haircut | ₹80 | — | Quick sale, queue |
| Monthly pass | 4 haircuts ₹400 | — | Monthly, repeat |
| Groom package | ₹1,500 | Facial +₹500 | Advance, date |

### 52. Unisex salon

*Rules: time slot, advance for colour, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Haircut | Stylist ₹300 · Senior ₹500 | Wash +₹100 · Styling +₹150 | Slot, repeat |
| Hair colour | Global ₹1,200 · Highlights ₹2,500 | Ammonia free +₹300 | Slot, advance |
| Keratin | Short ₹3,500 · Long ₹5,500 | Repair +₹800 | Slot, advance, hair length |
| Smoothening | Short ₹3,000 · Long ₹5,000 | — | Slot, advance |
| Facial | Basic ₹700 · Premium ₹1,200 | Gold +₹300 | Slot, package |
| Waxing | Arms ₹300 · Legs ₹450 | Rica +₹120 | Slot, package |
| Manicure | ₹400 | Gel +₹200 | Slot, repeat |
| Pedicure | ₹500 | Gel +₹200 | Slot, repeat |
| Makeup | Party ₹1,500 · Bridal ₹6,000 | Hair +₹800 | Advance, date, slot |
| Membership | 6 visits ₹2,500 | — | Package, expiry |

### 53. Bridal makeup artist

*Rules: event date, slot, advance, travel expense, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bridal makeup | HD ₹12,000 · Airbrush ₹15,000 | Draping +₹1,000 · Hair +₹1,500 | Event date, slot, advance |
| Engagement makeup | ₹5,000 | Hair styling +₹800 | Event date, slot |
| Guest makeup | ₹1,500 | Hair +₹500 | Event date, travel |
| Reception makeup | ₹8,000 | Hair +₹1,000 | Event date, slot |
| Party makeup | ₹2,500 | Lashes +₹300 | Slot, travel |
| Makeup trial | ₹3,000 | — | Slot, photo reference |
| Hair styling | ₹2,000 | Extensions +₹1,000 | Event date, slot |
| Saree draping | ₹1,000 | Pinned +₹300 | Event date, slot |
| Family package | 4 people ₹8,000 | — | Quantity, event date |
| Destination wedding | Per day ₹20,000 | Travel +₹5,000 | Advance, event date, expense |

### 54. Mehendi artist

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bridal mehendi | Hands ₹4,500 · Hands and feet ₹7,500 | Arabic +₹500 · Portrait +₹1,000 | Event date, slot, advance |
| Guest mehendi | Palm ₹150 · Front hand ₹300 | Arabic +₹50 | Event date, travel |
| Arabic design | ₹350 | Glitter +₹50 | Quick sale, slot |
| Simple design | ₹100 | — | Quick sale |
| Back hand design | ₹250 | — | Quick sale, slot |
| Full hand design | ₹600 | — | Slot, travel |
| Groom mehendi | ₹1,000 | — | Event date, slot |
| Family package | 5 people ₹1,200 | — | Quantity, event date |
| Mehendi cones | Pack of 5 ₹150 | — | Stock, quick sale |
| Aftercare kit | ₹200 | — | Stock, quick sale |

### 55. Nail artist

*Rules: slot, photo reference, repeat customer*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Gel polish | ₹800 | French +₹100 · Chrome +₹150 | Slot, photo |
| Extensions | ₹1,500 | Refill ₹800 | Slot, repeat |
| Nail art | Per nail ₹100 · Full set ₹600 | 3D +₹200 | Photo reference, slot |
| Manicure | ₹350 | Gel +₹200 | Slot, repeat |
| Pedicure | ₹450 | Gel +₹200 | Slot, repeat |
| Nail removal | ₹200 | — | Quick sale |
| Acrylic nails | ₹1,800 | Custom shape +₹300 | Slot, photo |
| Cat eye polish | ₹900 | — | Slot, photo |
| Nail repair | Per nail ₹100 | — | Quick sale |
| Bridal set | ₹2,500 | Custom design +₹500 | Advance, date |

### 56. Massage therapist (home service)

*Rules: address, slot, privacy, consent note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Swedish massage | 60 min ₹1,500 · 90 min ₹2,000 | Aroma oil +₹200 | Address, slot, privacy |
| Deep tissue | 60 min ₹2,000 · 90 min ₹2,600 | Hot stone +₹400 | Address, slot, consent |
| Head massage | 30 min ₹600 | — | Address, slot |
| Foot massage | 30 min ₹500 | — | Address, slot |
| Prenatal massage | 60 min ₹2,200 | — | Address, slot, consent |
| Sports massage | 60 min ₹2,200 | — | Address, slot |
| Couple massage | 60 min ₹3,500 | — | Address, slot, privacy |
| Four-session pack | ₹5,500 | — | Package, expiry |
| Chair massage | 20 min ₹400 | — | Slot, office |
| Home visit charge | Per visit ₹300 | — | Address, travel |

### 57. Tattoo artist

*Rules: advance, design approval, slot, aftercare note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Small tattoo | ₹1,500 | Colour +₹500 · Cover-up +₹800 | Advance, design approval |
| Half sleeve | ₹8,000 | Colour +₹2,000 · Touch-up +₹1,000 | Advance, slot, aftercare |
| Cover-up | ₹5,000 | — | Photo reference, design approval |
| Wrist tattoo | ₹1,000 | — | Advance, slot |
| Back tattoo | ₹15,000 | Colour +₹3,000 | Advance, slot, aftercare |
| Touch-up | ₹800 | — | Slot, aftercare |
| Tattoo removal | Per session ₹2,000 | — | Slot, package |
| Piercing | ₹500 | Jewellery +₹300 | Quick sale, aftercare |
| Custom design | ₹1,500 | — | Design approval, advance |
| Aftercare kit | ₹350 | — | Stock, quick sale |

### 58. Home hair stylist

*Rules: address, slot, travel expense, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Haircut | Basic ₹500 · Stylist ₹800 | Wash +₹150 | Address, slot, travel |
| Blow dry | ₹600 | Styling +₹200 | Address, slot |
| Hair colour | Global ₹1,500 · Root touch-up ₹900 | Ammonia free +₹300 | Address, slot, advance |
| Hair spa | ₹900 | Extra serum +₹200 | Address, slot |
| Keratin | Short ₹4,000 · Long ₹6,000 | — | Address, advance, slot |
| Bridal hair | ₹2,500 | Extensions +₹1,000 | Date, slot, travel |
| Braiding | ₹800 | — | Address, slot |
| Kids haircut | ₹300 | — | Address, slot |
| Party styling | ₹1,200 | — | Date, slot |
| Monthly package | 4 visits ₹2,800 | — | Package, expiry |

### 59. Home threading and waxing

*Rules: address, slot, travel expense, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Threading | Eyebrow ₹60 · Upper lip ₹50 · Full face ₹180 | — | Address, slot, travel |
| Waxing | Full arms ₹350 · Full legs ₹550 | Chocolate +₹80 · Rica +₹120 | Address, slot |
| Package | 4 sessions ₹1,200 | — | Package, expiry |
| Full body wax | ₹1,500 | Rica +₹200 | Address, slot, privacy |
| Underarm wax | ₹120 | — | Address, slot |
| Facial | Basic ₹700 · Premium ₹1,000 | — | Address, slot |
| Bleach | Face ₹350 | — | Address, slot |
| Detan | Face ₹300 | — | Address, slot |
| Bridal package | ₹4,000 | Trial +₹800 | Advance, date |
| Group booking | 4 people ₹2,000 | — | Quantity, address |

### 60. Makeup classes

*Rules: course, instalments, kit, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Self makeup | 3 days ₹4,000 · 7 days ₹8,000 | — | Course, instalments |
| Professional course | 1 month ₹18,000 · 3 months ₹45,000 | Kit included +₹8,000 | Course, instalments, certificate |
| Bridal masterclass | ₹12,000 | — | Date, advance |
| Hairstyling course | 7 days ₹9,000 | — | Course, instalments |
| Airbrush class | 3 days ₹15,000 | Kit +₹6,000 | Course, advance |
| Online class | ₹5,000 | Recordings +₹1,000 | Course, online |
| Practice kit | ₹4,500 | — | Stock, kit |
| Certificate fee | ₹500 | — | Certificate |
| Trial class | ₹1,000 | — | Slot, quick sale |
| Batch booking | 5 students ₹70,000 | — | Quantity, instalments |

### 61. Saree draping service

*Rules: event date, slot, travel expense, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Basic drape | ₹500 | Pleats +₹100 | Date, slot, travel |
| Bridal drape | ₹2,500 | Pinned +₹300 | Date, slot, advance |
| Group draping | Per person ₹400 | Five or more +₹0 | Date, quantity, travel |
| Lehenga drape | ₹1,200 | Pinned +₹200 | Date, slot |
| Dhoti drape | ₹600 | — | Date, slot |
| Dupatta setting | ₹300 | — | Date, slot |
| Pre-drape trial | ₹800 | — | Slot, photo reference |
| Home visit charge | Per visit ₹300 | — | Address, travel |
| Wedding package | 5 people ₹5,000 | — | Quantity, advance |
| Same-day service | ₹800 | — | Quick sale, slot |

## F. Health and wellness

**Pack:** Health and wellness · **Tab noun:** Services · **Unit:** session, month

### 62. Yoga instructor

*Rules: monthly fee, slot, attendance, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Morning batch | Monthly ₹1,800 | 3 days +₹0 · 5 days +₹400 | Monthly, slot, attendance |
| One-to-one session | ₹600 | Online +₹0 · Home +₹200 | Slot, package |
| Workshop | ₹3,000 | — | Date, advance |
| Evening batch | Monthly ₹1,800 | 3 days +₹0 · 5 days +₹400 | Monthly, slot, attendance |
| Prenatal yoga | Monthly ₹2,200 | — | Monthly, slot, attendance |
| Therapy yoga | Per session ₹900 | — | Slot, package |
| Corporate session | Per hour ₹2,500 | — | Date, slot, invoice |
| Ten-session pack | ₹5,000 | — | Package, expiry |
| Yoga mat | ₹800 | — | Stock, quick sale |
| Retreat | 3 days ₹8,000 | — | Advance, date |

### 63. Fitness trainer

*Rules: monthly fee, slot, attendance, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly training | Home ₹4,000 · Gym ₹3,000 | 3 days +₹0 · 5 days +₹1,000 | Monthly, slot, attendance |
| One-to-one session | ₹800 | Home +₹200 · Online +₹0 | Slot, package |
| Diet plan | ₹1,500 | Monthly follow-up +₹500 | Package, follow-up |
| Couple training | Monthly ₹6,000 | — | Monthly, attendance |
| Strength program | 12 weeks ₹9,000 | — | Package, follow-up |
| Online coaching | Monthly ₹2,500 | — | Monthly, online |
| Body composition test | ₹500 | — | Slot, quick sale |
| Group class | Per session ₹300 | — | Slot, attendance |
| Ten-session pack | ₹7,000 | — | Package, expiry |
| Competition prep | ₹15,000 | — | Advance, package |

### 64. Physiotherapist (home visit)

*Rules: address, slot, package expiry, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Home session | 30 min ₹600 · 45 min ₹800 | — | Address, slot, privacy |
| Session pack | 5 sessions ₹2,800 · 10 sessions ₹5,000 | — | Package, expiry |
| Assessment | ₹1,000 | — | Slot, follow-up |
| Back pain therapy | Per session ₹800 | — | Address, slot |
| Knee rehab | Per session ₹900 | — | Address, slot, package |
| Post-surgery care | Per session ₹1,200 | — | Address, slot, privacy |
| Electrotherapy | Per session ₹700 | — | Address, slot |
| Exercise plan | ₹1,500 | — | Package, follow-up |
| Clinic visit | ₹500 | — | Slot, follow-up |
| Monthly care | ₹8,000 | — | Monthly, attendance |

### 65. Dietitian and nutritionist

*Rules: slot, follow-up, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Consultation | ₹2,000 | Online +₹0 · In person +₹0 | Slot, follow-up |
| Three-month plan | ₹5,000 | Weekly check-in +₹1,000 | Package, follow-up |
| Diet chart | ₹1,500 | — | Custom text, package |
| Weight loss plan | Monthly ₹3,000 | — | Monthly, follow-up |
| Diabetes plan | Monthly ₹3,500 | — | Monthly, follow-up |
| Sports nutrition | Monthly ₹4,000 | — | Monthly, follow-up |
| Body composition | ₹800 | — | Slot, quick sale |
| Grocery list | ₹500 | — | Custom text |
| Family plan | Monthly ₹5,000 | — | Package, follow-up |
| Follow-up session | ₹700 | Online +₹0 | Slot, follow-up |

### 66. Home nursing

*Rules: shift, monthly fee, attendance, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Shift | 8 hours ₹1,200 · 12 hours ₹1,700 · 24 hours ₹2,500 | — | Shift, attendance, privacy |
| Monthly care | ₹25,000 | Night +₹5,000 | Monthly, attendance |
| Procedure visit | ₹800 | Injection +₹200 | Slot, privacy |
| Dressing | ₹500 | — | Slot, privacy |
| Catheter care | ₹700 | — | Slot, privacy |
| Injection | ₹200 | — | Slot, quick sale |
| BP and sugar check | ₹150 | — | Slot, quick sale |
| Post-surgery care | Per day ₹2,000 | — | Shift, privacy |
| Attendant | Per day ₹1,000 | — | Attendance, privacy |
| Night shift | 12 hours ₹1,900 | — | Shift, attendance |

### 67. Elder care attendant

*Rules: monthly fee, attendance, recurring*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly attendant | ₹20,000 | Day +₹0 · Night +₹2,000 · Live-in +₹5,000 | Monthly, attendance |
| Daily visit | ₹1,000 | — | Attendance, recurring |
| Companion | 4 hours ₹600 | — | Slot, attendance |
| Physiotherapy add-on | Per session ₹500 | — | Slot, package |
| Doctor visit escort | ₹800 | — | Slot, date |
| Medicine pickup | ₹200 | — | Quick sale, delivery |
| Night attendant | Per night ₹900 | — | Attendance, privacy |
| Weekly package | ₹5,500 | — | Package, attendance |
| Emergency call | Per hour ₹400 | — | Quick sale, attendance |
| Live-in care | Monthly ₹28,000 | — | Monthly, attendance, privacy |

### 68. Counsellor and therapist

*Rules: slot, privacy, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Session | ₹1,500 | Online +₹0 · In person +₹0 | Slot, privacy |
| Four-session package | ₹6,000 | — | Package, expiry |
| Couples session | ₹2,500 | — | Slot, privacy |
| Child counselling | ₹1,800 | — | Slot, privacy |
| Career counselling | ₹2,000 | — | Slot, privacy |
| Group therapy | Per person ₹600 | — | Slot, quantity |
| Assessment | ₹2,500 | — | Slot, follow-up |
| Family session | ₹3,000 | — | Slot, privacy |
| Follow-up | ₹1,200 | Online +₹0 | Slot, package |
| Workshop | Per person ₹1,500 | — | Date, advance |

### 69. Zumba and group fitness

*Rules: monthly fee, slot, attendance, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Zumba batch | Monthly ₹1,500 | 3 days +₹0 · 5 days +₹400 | Monthly, slot, attendance |
| Personal session | ₹700 | Home +₹200 | Slot, package |
| Dance fitness workshop | ₹1,000 | — | Date, advance |
| Aerobics batch | Monthly ₹1,400 | — | Monthly, slot, attendance |
| Bollywood fitness | Monthly ₹1,600 | — | Monthly, slot, attendance |
| Morning batch | Monthly ₹1,300 | — | Monthly, slot, attendance |
| Online class | Monthly ₹900 | — | Monthly, online |
| Ten-session pack | ₹5,500 | — | Package, expiry |
| Corporate class | Per hour ₹2,000 | — | Date, slot, invoice |
| Fitness event | Per event ₹8,000 | — | Date, advance |

### 70. Speech therapy

*Rules: slot, package expiry, follow-up, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Assessment | ₹1,500 | — | Slot, follow-up |
| Session | 30 min ₹700 · 45 min ₹900 | Home +₹300 | Slot, package |
| Ten-session pack | ₹6,500 | — | Package, expiry |
| Child therapy | Per session ₹900 | — | Slot, package, privacy |
| Stuttering therapy | Per session ₹1,000 | — | Slot, package |
| Autism support | Per session ₹1,200 | — | Slot, package, privacy |
| Online session | 30 min ₹600 | — | Slot, online |
| Parent training | ₹1,500 | — | Slot, package |
| Progress report | ₹500 | — | Custom text, follow-up |
| School visit | ₹2,000 | — | Address, date |

### 71. Acupressure and reflexology

*Rules: slot, package, privacy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Foot reflexology | 30 min ₹500 · 45 min ₹700 | — | Slot, package |
| Full body acupressure | 60 min ₹1,000 | Oil +₹150 | Slot, privacy |
| Five-session pack | ₹3,200 | — | Package, expiry |
| Back therapy | 30 min ₹600 | — | Slot, package |
| Head and neck | 30 min ₹500 | — | Slot, package |
| Sujok therapy | Per session ₹600 | — | Slot, package |
| Magnetic therapy | Per session ₹700 | — | Slot, package |
| Home visit | Per session ₹1,200 | — | Address, slot |
| Consultation | ₹500 | — | Slot, follow-up |
| Monthly plan | 8 sessions ₹4,500 | — | Monthly, package |

### 72. Postnatal care (doula)

*Rules: package, attendance, privacy, follow-up*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Day visit | 4 hours ₹1,200 | — | Slot, privacy |
| Twelve-day package | ₹18,000 | Night +₹6,000 | Package, attendance |
| Lactation consult | ₹1,500 | Home +₹300 | Slot, follow-up |
| Newborn care | Per day ₹1,500 | — | Shift, privacy |
| Mother massage | Per session ₹900 | — | Slot, privacy |
| Belly binding | ₹700 | — | Slot, privacy |
| Diet plan | ₹1,000 | — | Custom text, follow-up |
| Night doula | Per night ₹2,000 | — | Shift, attendance |
| Monthly package | ₹45,000 | — | Monthly, attendance |
| Follow-up call | ₹300 | — | Follow-up, quick sale |

## G. Education and coaching

**Pack:** Tutoring · **Tab noun:** Services · **Unit:** month, class

### 73. School tuition

*Rules: monthly fee, attendance, fee reminder*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Maths tuition | Group ₹1,500 per month · One-to-one ₹3,000 per month | 3 days +₹0 · 5 days +₹500 | Monthly, attendance, reminder |
| Science tuition | Group ₹1,500 per month · One-to-one ₹3,000 per month | 3 days +₹0 · 5 days +₹500 | Monthly, attendance |
| Test series | ₹500 | — | Date, custom text |
| English tuition | Group ₹1,200 per month | — | Monthly, attendance |
| Social studies | Group ₹1,200 per month | — | Monthly, attendance |
| Crash course | ₹4,000 | — | Date, instalments |
| Doubt session | Per hour ₹300 | — | Slot, package |
| Study material | ₹600 | — | Stock, quick sale |
| Admission fee | ₹500 | — | Advance, quick sale |
| Sibling discount | 10% off | — | Discount, monthly |

### 74. Spoken English coach

*Rules: monthly fee, slot, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Group batch | Monthly ₹2,000 | 3 days +₹0 · 5 days +₹400 | Monthly, slot, attendance |
| One-to-one | Per session ₹500 · 10 sessions ₹4,000 | Online +₹0 | Slot, package |
| Interview prep | ₹3,000 | — | Package, date |
| Grammar course | Monthly ₹1,500 | — | Monthly, attendance |
| Public speaking | Monthly ₹2,500 | — | Monthly, slot |
| IELTS coaching | Monthly ₹4,000 | — | Monthly, package |
| Corporate training | Per hour ₹2,000 | — | Date, invoice |
| Demo class | Free | — | Slot, quick sale |
| Study material | ₹500 | — | Stock, quick sale |
| Certificate | ₹300 | — | Certificate |

### 75. Music teacher

*Rules: monthly fee, slot, attendance, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Guitar | Monthly ₹1,600 | 30 min +₹0 · 45 min +₹400 · 60 min +₹800 | Monthly, slot, attendance |
| Vocal | Monthly ₹1,400 | 30 min +₹0 · 45 min +₹400 · 60 min +₹800 | Monthly, slot |
| Instrument rental | Monthly ₹800 | — | Deposit, monthly |
| Keyboard | Monthly ₹1,800 | — | Monthly, slot |
| Drums | Monthly ₹2,000 | — | Monthly, slot |
| Tabla | Monthly ₹1,200 | — | Monthly, slot |
| Flute | Monthly ₹1,200 | — | Monthly, slot |
| Exam preparation | ₹3,000 | — | Package, certificate |
| Home visit | Per session ₹300 | — | Address, slot |
| Annual concert | ₹1,000 | — | Date, advance |

### 76. Dance teacher

*Rules: monthly fee, slot, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bollywood batch | Monthly ₹1,200 | 3 days +₹0 · 5 days +₹300 | Monthly, slot, attendance |
| Kathak | Monthly ₹1,500 | — | Monthly, slot |
| Private session | ₹600 | Home +₹200 | Slot, package |
| Hip hop | Monthly ₹1,300 | — | Monthly, slot, attendance |
| Salsa | Monthly ₹1,500 | — | Monthly, slot |
| Wedding choreography | ₹5,000 | Extra session +₹800 | Date, advance |
| Kids batch | Monthly ₹1,000 | — | Monthly, slot, attendance |
| Workshop | ₹800 | — | Date, advance |
| Annual show | ₹1,500 | Costume +₹800 | Date, advance |
| Ten-session pack | ₹4,500 | — | Package, expiry |

### 77. Abacus and vedic maths

*Rules: monthly fee, level, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Level class | Monthly ₹1,000 | Level 1 to 4 +₹0 · Level 5 to 8 +₹200 | Monthly, level, attendance |
| Kit | ₹800 | — | Stock, kit |
| Competition fee | ₹500 | — | Date, custom text |
| Vedic maths batch | Monthly ₹1,200 | — | Monthly, attendance |
| Speed writing | Monthly ₹900 | — | Monthly, attendance |
| Demo class | Free | — | Slot, quick sale |
| Level exam | ₹300 | — | Date, certificate |
| Online batch | Monthly ₹800 | — | Monthly, online |
| Annual fee | ₹10,000 | — | Annual, instalments |
| Sibling discount | 10% off | — | Discount, monthly |

### 78. Computer classes

*Rules: course, instalments, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Basic course | 1 month ₹1,500 · 2 months ₹2,600 | — | Course, instalments |
| Tally | ₹4,000 | — | Course, certificate |
| Excel | Basic ₹2,000 · Advanced ₹2,800 | — | Course, certificate |
| MS Office | ₹2,500 | — | Course, certificate |
| Typing | ₹1,200 | — | Course, certificate |
| Photoshop | ₹3,000 | — | Course, certificate |
| Web design | ₹6,000 | — | Course, instalments |
| Python | ₹5,000 | — | Course, instalments |
| Certificate fee | ₹300 | — | Certificate |
| Corporate batch | Per person ₹3,500 | — | Quantity, invoice |

### 79. Competitive exam coaching

*Rules: instalments, batch, refund policy*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Full course | Online ₹25,000 · Offline ₹30,000 | — | Instalments, batch, refund policy |
| Test series | ₹3,000 | — | Batch, date |
| Crash course | ₹8,000 | — | Date, instalments |
| Foundation batch | ₹18,000 | — | Batch, instalments |
| Interview batch | ₹6,000 | — | Batch, date |
| Study material | ₹2,500 | — | Stock, quick sale |
| Doubt session | Per hour ₹500 | — | Slot, package |
| Mock interview | ₹1,000 | — | Slot, date |
| Hostel fee | Monthly ₹5,000 | — | Monthly, attendance |
| Scholarship test | Free | — | Date, quick sale |

### 80. Driving school

*Rules: course, slot, instalments, RTO expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 20-day course | 4-wheeler ₹4,500 · 2-wheeler ₹3,000 | — | Course, slot, instalments |
| RTO assistance | ₹1,800 | — | Expense, date |
| Refresher course | 7 days ₹2,200 | — | Course, slot |
| Licence renewal | ₹1,200 | — | Expense, date |
| Home pickup | ₹500 | — | Address, route |
| Extra class | Per hour ₹400 | — | Slot, package |
| Night driving | 5 days ₹2,500 | — | Course, slot |
| Highway training | 2 days ₹2,000 | — | Course, date |
| Learning licence | ₹600 | — | Expense, date |
| Vehicle rental | Per day ₹1,000 | — | Per day, deposit |

### 81. Art and craft teacher

*Rules: monthly fee, slot, attendance, material*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Drawing class | Monthly ₹1,200 | 2 days +₹0 · 4 days +₹400 | Monthly, slot, attendance |
| Craft class | Monthly ₹1,000 | — | Monthly, slot |
| Painting workshop | ₹1,500 | Material +₹400 | Date, advance |
| Exam preparation | ₹3,000 | — | Package, certificate |
| Pottery class | Monthly ₹2,000 | Material +₹500 | Monthly, slot |
| Calligraphy class | Monthly ₹1,500 | — | Monthly, slot |
| Kids batch | Monthly ₹900 | — | Monthly, attendance |
| Art kit | ₹700 | — | Stock, quick sale |
| Birthday workshop | ₹3,000 | — | Date, advance |
| Annual exhibition | ₹500 | — | Date, quick sale |

### 82. Cooking classes

*Rules: course, slot, material, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Basic cooking | 7 days ₹3,500 | — | Course, slot, material |
| Baking class | 3 days ₹2,500 | Material +₹500 | Course, slot |
| Cake decorating | 2 days ₹3,000 | Material +₹600 | Course, slot |
| Regional cuisine | Per class ₹1,200 | — | Slot, material |
| Tiffin business course | ₹5,000 | — | Course, certificate |
| Chocolate making | 1 day ₹1,800 | Material +₹400 | Date, material |
| Kids cooking | 3 days ₹1,500 | — | Course, slot |
| Online class | ₹1,000 | — | Online, course |
| Recipe booklet | ₹300 | — | Stock, quick sale |
| Certificate | ₹200 | — | Certificate |

### 83. Chess coach

*Rules: monthly fee, slot, attendance, rating*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Beginner batch | Monthly ₹1,500 | 2 days +₹0 · 4 days +₹400 | Monthly, slot, attendance |
| One-to-one | Per session ₹600 | Online +₹0 | Slot, package |
| Tournament prep | ₹4,000 | — | Package, date |
| Online batch | Monthly ₹1,200 | — | Monthly, online |
| Summer camp | 10 days ₹2,500 | — | Date, advance |
| Chess set | ₹600 | — | Stock, quick sale |
| Clock | ₹800 | — | Stock, quick sale |
| Rating analysis | ₹500 | — | Custom text, follow-up |
| School program | Per month ₹15,000 | — | Monthly, invoice |
| Ten-session pack | ₹5,000 | — | Package, expiry |

### 84. Study library and reading room

*Rules: monthly fee, seat, attendance, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly seat | ₹1,200 | AC +₹400 · Non-AC +₹0 | Monthly, seat, attendance |
| Half-day seat | ₹700 | — | Monthly, attendance |
| Locker | Monthly ₹150 | — | Deposit, monthly |
| Reading room | Per hour ₹40 | — | Slot, quick sale |
| Exam season pass | 3 months ₹3,000 | — | Monthly, package |
| Night shift | Monthly ₹1,800 | — | Monthly, attendance |
| Printing | Per page ₹2 | — | Quick sale |
| Photocopy | Per page ₹1 | — | Quick sale |
| Wi-Fi add-on | Monthly ₹200 | — | Monthly, package |
| Registration | ₹300 | — | Deposit, quick sale |

## H. Repairs and technical

**Pack:** Repairs · **Tab noun:** Services · **Unit:** job, piece

### 85. Mobile repair

*Rules: serial note, warranty, part advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Screen replacement | Original ₹2,800 · Compatible ₹1,400 | — | Serial, warranty, advance |
| Battery replacement | Original ₹1,800 · Compatible ₹850 | — | Serial, warranty |
| Tempered glass | ₹120 | — | Quick sale |
| Charging port | ₹650 | — | Serial, warranty |
| Speaker repair | ₹500 | — | Serial, warranty |
| Camera glass | ₹400 | — | Serial, warranty |
| Motherboard repair | ₹2,500 | — | Serial, estimate, advance |
| Software flash | ₹500 | — | Serial, warranty |
| Back panel | ₹800 | — | Serial, warranty |
| Water damage clean | ₹900 | — | Serial, estimate |

### 86. Laptop and computer repair

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹800 | — | Serial, estimate, warranty |
| Screen replacement | ₹4,500 | — | Serial, estimate, advance |
| SSD upgrade | 256 GB ₹2,500 · 512 GB ₹4,000 | — | Serial, warranty, data note |
| RAM upgrade | 8 GB ₹1,800 · 16 GB ₹3,200 | — | Serial, warranty |
| Keyboard replacement | ₹1,500 | — | Serial, estimate |
| Battery replacement | ₹2,800 | — | Serial, warranty |
| Motherboard repair | ₹4,000 | — | Serial, estimate, advance |
| OS installation | ₹700 | — | Serial, quick sale |
| Virus removal | ₹600 | — | Serial, quick sale |
| Data recovery | ₹2,000 | — | Serial, estimate, privacy |

### 87. Home appliance repair

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| TV repair | Panel ₹3,500 · Board ₹1,800 | — | Serial, estimate, pickup |
| Fridge repair | Gas ₹1,800 · Compressor ₹3,500 | — | Serial, estimate, warranty |
| Washing machine | Service ₹500 · Motor ₹2,200 | — | Serial, estimate, pickup |
| Microwave repair | ₹800 | — | Serial, estimate |
| Mixer repair | ₹350 | — | Serial, quick sale |
| Water heater | ₹700 | — | Serial, estimate |
| Chimney service | ₹900 | — | Serial, estimate |
| Induction repair | ₹600 | — | Serial, estimate |
| Air cooler | ₹450 | — | Serial, quick sale |
| Annual maintenance | ₹2,500 | — | Warranty, follow-up |

### 88. AC service and installation

*Rules: slot, warranty, season, AMC*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | 1 unit ₹600 · 2 units ₹1,100 | — | Slot, season |
| Gas refill | ₹2,500 | — | Slot, warranty |
| Installation | Split ₹1,500 · Window ₹1,200 | — | Slot, warranty, AMC |
| Uninstall | ₹800 | — | Slot, quick sale |
| Deep clean | ₹1,200 | — | Slot, season |
| PCB repair | ₹2,200 | — | Slot, warranty |
| Compressor change | ₹5,500 | — | Slot, warranty, advance |
| Annual maintenance | 2 visits ₹1,800 | — | AMC, follow-up |
| Copper piping | Per metre ₹450 | — | Quantity, slot |
| Stabiliser | ₹2,800 | — | Stock, warranty |

### 89. Electrician

*Rules: address, slot, material expense, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fan installation | ₹150 | — | Address, slot |
| Geyser repair | ₹650 | — | Address, slot, expense |
| Wiring | Per point ₹300 | — | Address, quantity, expense |
| Switchboard repair | ₹200 | — | Address, slot |
| Light installation | ₹120 | — | Address, slot |
| MCB replacement | ₹250 | — | Address, slot, warranty |
| Inverter wiring | ₹1,500 | — | Address, slot, expense |
| Motor repair | ₹800 | — | Address, slot, warranty |
| Inspection | ₹300 | — | Address, slot |
| Emergency call | ₹500 | — | Address, quick sale |

### 90. Plumber

*Rules: address, slot, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tap repair | ₹150 | — | Address, slot |
| Flush repair | ₹350 | — | Address, slot |
| Sink unclog | ₹400 | — | Address, slot, expense |
| Pipe leak | ₹300 | — | Address, slot, expense |
| Bathroom fitting | ₹600 | — | Address, slot |
| Water tank cleaning | ₹800 | — | Address, slot |
| Geyser installation | ₹500 | — | Address, slot |
| Motor installation | ₹700 | — | Address, slot |
| Drain cleaning | ₹600 | — | Address, slot |
| Emergency call | ₹500 | — | Address, quick sale |

### 91. Carpenter

*Rules: address, slot, measurement, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Door repair | ₹500 | — | Address, slot, expense |
| Furniture repair | ₹1,200 | — | Address, slot, measurement |
| Custom shelf | Per sqft ₹450 | — | Measurement, date, advance |
| Wardrobe | Per sqft ₹1,200 | — | Measurement, date, advance |
| Bed repair | ₹800 | — | Address, slot |
| Modular kitchen | Per running ft ₹2,500 | — | Measurement, date, advance |
| TV unit | Per sqft ₹900 | — | Measurement, date |
| Door installation | ₹1,500 | — | Measurement, date |
| Polish work | Per sqft ₹60 | — | Measurement, date |
| Hardware fitting | ₹200 | — | Address, quick sale |

### 92. House painter

*Rules: quantity, advance, material expense, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Flat painting | 1BHK ₹9,500 · 2BHK ₹16,000 | Basic +₹0 · Premium +₹4,000 | Quantity, advance, expense |
| Putty | Per sqft ₹15 | — | Quantity, expense |
| Waterproofing | ₹3,500 | — | Quantity, warranty |
| Interior emulsion | Per sqft ₹22 | — | Quantity, expense |
| Exterior paint | Per sqft ₹28 | — | Quantity, expense |
| Texture finish | Per sqft ₹45 | — | Quantity, advance |
| Wood polish | Per sqft ₹55 | — | Quantity, expense |
| Enamel paint | Per sqft ₹30 | — | Quantity, expense |
| Wallpaper | Per sqft ₹60 | — | Quantity, measurement |
| Site inspection | ₹300 | — | Address, slot |

### 93. Tile, marble and flooring

*Rules: quantity, measurement, date, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tile laying | Per sqft ₹35 | — | Quantity, measurement, date |
| Marble polishing | Per sqft ₹25 | — | Quantity, date |
| Wooden flooring | Per sqft ₹120 | — | Quantity, measurement, date |
| Tile removal | Per sqft ₹20 | — | Quantity, date |
| Granite fitting | Per sqft ₹150 | — | Quantity, measurement |
| Skirting | Per running ft ₹60 | — | Quantity, date |
| Grouting | Per sqft ₹15 | — | Quantity, date |
| Marble fitting | Per sqft ₹90 | — | Quantity, measurement |
| Vinyl flooring | Per sqft ₹70 | — | Quantity, measurement |
| Site visit | ₹300 | — | Address, slot |

### 94. Welder and fabrication

*Rules: measurement, quantity, advance, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Gate | Per sqft ₹450 | — | Measurement, advance, date |
| Grill | Per sqft ₹350 | — | Measurement, date |
| Repair | ₹500 | — | Address, quick sale |
| Railing | Per running ft ₹550 | — | Measurement, date |
| Shed | Per sqft ₹280 | — | Measurement, advance |
| Staircase | Per step ₹1,200 | — | Measurement, date |
| Window grill | Per sqft ₹380 | — | Measurement, date |
| MS frame | Per kg ₹120 | — | Quantity, measurement |
| SS work | Per sqft ₹900 | — | Measurement, advance |
| On-site welding | Per hour ₹500 | — | Address, slot |

### 95. CCTV installation

*Rules: site visit, quote, warranty, AMC*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Four-camera setup | ₹12,000 | — | Site visit, quote, warranty |
| Eight-camera setup | ₹22,000 | — | Site visit, quote, warranty |
| Yearly AMC | ₹4,000 | — | Warranty, follow-up |
| Single camera | ₹3,000 | — | Site visit, warranty |
| DVR | 4 channel ₹4,500 · 8 channel ₹7,500 | — | Stock, warranty |
| Hard disk | 1 TB ₹4,000 | — | Stock, warranty |
| Cabling | Per metre ₹25 | — | Quantity, site visit |
| Installation only | ₹500 per camera | — | Site visit, slot |
| Mobile viewing setup | ₹800 | — | Site visit, quick sale |
| Repair visit | ₹500 | — | Site visit, warranty |

### 96. Two-wheeler mechanic

*Rules: serial note, estimate, warranty, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹350 | — | Serial, date |
| Tyre | ₹1,200 | — | Serial, warranty |
| Engine work | ₹3,500 | — | Serial, estimate, advance |
| Brake pad | ₹450 | — | Serial, warranty |
| Chain sprocket | ₹900 | — | Serial, warranty |
| Battery | ₹1,500 | — | Serial, warranty |
| Clutch plate | ₹1,100 | — | Serial, estimate |
| Oil change | ₹450 | — | Serial, quick sale |
| Puncture | ₹100 | — | Quick sale |
| Pickup service | ₹200 | — | Pickup, quick sale |

### 97. Car mechanic and garage

*Rules: serial note, estimate approval, warranty, pickup*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹1,500 | — | Serial, estimate |
| Clutch | ₹6,500 | — | Serial, estimate, warranty |
| Dent paint | Per panel ₹2,500 | — | Serial, estimate, pickup |
| Brake pad | ₹1,800 | — | Serial, warranty |
| Battery | ₹4,500 | — | Serial, warranty |
| AC service | ₹1,200 | — | Serial, estimate |
| Wheel alignment | ₹600 | — | Quick sale |
| Suspension | ₹5,000 | — | Serial, estimate, warranty |
| Insurance claim work | ₹8,000 | — | Serial, estimate, advance |
| Pickup and drop | ₹500 | — | Pickup, route |

### 98. RO water purifier service

*Rules: serial note, warranty, AMC, slot*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹400 | — | Serial, slot |
| Filter replacement | ₹650 | — | Serial, warranty |
| Membrane change | ₹1,200 | — | Serial, warranty |
| Installation | ₹500 | — | Serial, slot |
| AMC yearly | ₹2,500 | — | AMC, follow-up |
| Pump repair | ₹1,500 | — | Serial, estimate |
| UV lamp | ₹700 | — | Serial, warranty |
| TDS check | ₹100 | — | Quick sale |
| New purifier | ₹8,500 | — | Serial, warranty, delivery |
| Uninstall | ₹300 | — | Slot, quick sale |

### 99. Inverter and battery service

*Rules: serial note, warranty, pickup, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Battery replacement | 100 Ah ₹9,000 · 150 Ah ₹13,000 | — | Serial, warranty, pickup |
| Inverter repair | ₹1,200 | — | Serial, estimate |
| Installation | ₹500 | — | Serial, slot |
| Battery water top-up | ₹150 | — | Quick sale |
| Inverter service | ₹400 | — | Serial, quick sale |
| Stabiliser repair | ₹800 | — | Serial, estimate |
| Old battery exchange | Up to ₹1,500 off | — | Deposit, quick sale |
| Wiring | Per metre ₹40 | — | Quantity, slot |
| AMC | Yearly ₹1,000 | — | AMC, follow-up |
| New inverter | ₹6,500 | — | Serial, warranty, delivery |

### 100. Cycle repair

*Rules: quick sale, warranty, serial note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Service | ₹250 | — | Quick sale |
| Tyre change | ₹450 | — | Warranty, quick sale |
| Brake adjustment | ₹80 | — | Quick sale |
| Gear repair | ₹300 | — | Warranty |
| Chain replacement | ₹350 | — | Warranty |
| Puncture | ₹50 | — | Quick sale |
| Spoke repair | ₹150 | — | Quick sale |
| Bicycle sale | ₹6,500 | — | Serial, warranty |
| Accessories | ₹250 | — | Stock, quick sale |
| Home service | ₹150 | — | Address, route |

### 101. Watch repair

*Rules: serial note, warranty, estimate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Battery change | ₹100 | — | Quick sale, warranty |
| Strap replacement | ₹350 | — | Serial, warranty |
| Glass replacement | ₹450 | — | Serial, estimate |
| Service | ₹600 | — | Serial, estimate |
| Chain repair | ₹200 | — | Quick sale |
| Dial repair | ₹800 | — | Serial, estimate |
| Waterproof test | ₹150 | — | Quick sale |
| Polishing | ₹250 | — | Quick sale |
| Smartwatch screen | ₹1,500 | — | Serial, warranty |
| Estimate | ₹0 | — | Estimate, follow-up |

### 102. Key maker and locksmith

*Rules: address, quick sale, warranty, ID note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Key duplicate | ₹60 | — | Quick sale |
| Car key | ₹800 | Remote +₹1,200 | Serial, warranty |
| Lock opening | ₹300 | — | Address, ID note |
| Lock replacement | ₹650 | — | Address, warranty |
| Digital lock | ₹4,500 | — | Address, warranty |
| Master key | ₹250 | — | Quick sale |
| Door lock repair | ₹350 | — | Address, quick sale |
| Bike key | ₹300 | — | Serial, quick sale |
| Emergency call | ₹500 | — | Address, quick sale |
| ID verification | ₹0 | — | ID note |

## I. Home and property

**Pack:** Home services · **Tab noun:** Services · **Unit:** visit, room

### 103. Deep cleaning

*Rules: address, slot, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Deep cleaning | 1BHK ₹1,800 · 2BHK ₹2,800 · 3BHK ₹3,800 | — | Address, slot |
| Kitchen cleaning | ₹1,200 | — | Slot, expense |
| Bathroom cleaning | ₹600 | — | Slot, quantity |
| Sofa cleaning | Per seat ₹250 | — | Slot, quantity |
| Window cleaning | Per window ₹150 | — | Slot, quantity |
| Floor scrub | Per room ₹400 | — | Slot, quantity |
| Fridge cleaning | ₹400 | — | Slot, quick sale |
| Chimney cleaning | ₹700 | — | Slot, expense |
| Post-construction clean | Per sqft ₹12 | — | Address, quantity |
| Move-out clean | 2BHK ₹3,200 | — | Address, slot |

### 104. Sofa and carpet cleaning

*Rules: address, slot, quantity*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Sofa cleaning | 3-seater ₹750 · 5-seater ₹1,200 · 7-seater ₹1,600 | Shampoo +₹100 | Address, quantity |
| Carpet cleaning | Per sqft ₹25 | Stain treatment +₹10 | Address, quantity |
| Mattress cleaning | Single ₹600 · Double ₹900 | — | Address, slot |
| Chair cleaning | Per chair ₹150 | — | Address, quantity |
| Rug cleaning | Per sqft ₹35 | — | Address, quantity |
| Car seat cleaning | Per seat ₹300 | — | Address, quantity |
| Curtain cleaning | Per panel ₹200 | — | Address, quantity |
| Stain removal | Per spot ₹200 | — | Address, quick sale |
| Sanitisation | Per room ₹300 | — | Address, quantity |
| Pickup and drop | Per order ₹300 | — | Pickup, route |

### 105. Pest control

*Rules: address, slot, warranty, follow-up*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| General pest control | 1BHK ₹1,200 · 2BHK ₹1,500 · 3BHK ₹1,800 | — | Address, warranty |
| Termite treatment | ₹3,000 | — | Address, warranty, follow-up |
| Cockroach gel | ₹800 | — | Address, slot |
| Bed bug treatment | ₹1,500 | — | Address, warranty |
| Mosquito fogging | ₹1,000 | — | Address, quantity |
| Rodent control | ₹1,200 | — | Address, warranty |
| Ant treatment | ₹700 | — | Address, slot |
| Wood borer | ₹2,000 | — | Address, warranty |
| Commercial contract | Monthly ₹3,500 | — | Monthly, invoice |
| Follow-up visit | ₹300 | — | Warranty, follow-up |

### 106. Gardening and mali

*Rules: monthly fee, attendance, address*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Garden visit | ₹500 | — | Address, slot |
| Monthly maintenance | ₹2,000 | Weekly +₹800 | Monthly, attendance |
| Plant supply | Per plant ₹150 | — | Stock, quantity |
| Lawn mowing | Per sqft ₹8 | — | Quantity, address |
| Potting | Per pot ₹100 | Soil +₹50 | Quantity, address |
| Hedge trimming | Per metre ₹80 | — | Quantity, address |
| Manure supply | 5 kg ₹200 | — | Stock, delivery |
| Landscape design | ₹5,000 | — | Site visit, advance |
| Tree cutting | Per tree ₹1,500 | — | Address, quote |
| Festival flowers | Per pot ₹250 | — | Stock, festival |

### 107. Maid and housekeeping

*Rules: monthly fee, attendance, recurring*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly maid | 2 hours ₹4,000 · 4 hours ₹7,000 | — | Monthly, attendance |
| Deep clean | ₹800 | — | Address, slot |
| Utensils | Monthly ₹1,500 | — | Monthly, attendance |
| Clothes washing | Monthly ₹1,200 | — | Monthly, attendance |
| Ironing | Per piece ₹10 | — | Quantity, quick sale |
| Bathroom cleaning | Monthly ₹800 | — | Monthly, attendance |
| Floor mopping | Monthly ₹1,000 | — | Monthly, attendance |
| Cooking help | Monthly ₹3,000 | — | Monthly, attendance |
| One-time clean | 2 hours ₹500 | — | Address, slot |
| Replacement maid | ₹0 | — | Attendance, follow-up |

### 108. Cook at home

*Rules: monthly fee, attendance, recurring*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly cook | 1 meal ₹6,000 · 2 meals ₹9,000 | Veg +₹0 · Non-veg +₹1,500 | Monthly, attendance |
| Party cooking | ₹1,500 | Per 10 guests +₹800 | Date, slot |
| Tiffin | Monthly ₹3,000 | — | Monthly, route |
| Breakfast only | Monthly ₹4,000 | — | Monthly, attendance |
| Dinner only | Monthly ₹5,500 | — | Monthly, attendance |
| Festival cooking | ₹2,500 | — | Date, slot |
| Special dish | ₹500 | — | Quick sale |
| Grocery shopping | Per visit ₹200 | — | Address, quick sale |
| Kitchen cleaning | ₹600 | — | Address, slot |
| Trial cooking | ₹500 | — | Slot, quick sale |

### 109. Packer and mover

*Rules: quote, date, inventory, deposit*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local shifting | 1BHK ₹8,000 · 2BHK ₹14,000 · 3BHK ₹20,000 | Packing +₹2,000 | Quote, date, inventory |
| Vehicle only | ₹4,000 | — | Quote, date |
| Insurance | 2% of value | — | Deposit, custom text |
| Loading and unloading | Per hour ₹500 | — | Quote, date |
| Intercity shifting | Per km ₹35 | — | Quote, date |
| Packing material | Per box ₹80 | — | Quantity, stock |
| Storage | Monthly ₹2,500 | — | Monthly, deposit |
| Bike transport | ₹2,500 | — | Quote, date |
| Office shifting | Per seat ₹1,200 | — | Quote, date |
| Site survey | ₹0 | — | Address, slot |

### 110. Interior designer

*Rules: milestones, site visit, vendor expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Full home design | 2BHK ₹60,000 · 3BHK ₹85,000 | — | Milestones, site visit |
| Room design | Per room ₹25,000 | — | Milestones, measurement |
| Consultation | ₹2,500 | — | Slot, follow-up |
| 3D visualisation | Per room ₹5,000 | — | Milestones, revisions |
| Modular kitchen design | ₹15,000 | — | Measurement, milestones |
| Furniture layout | ₹4,000 | — | Measurement, revisions |
| False ceiling design | Per sqft ₹15 | — | Quantity, measurement |
| Site supervision | Monthly ₹15,000 | — | Milestones, site visit |
| Shopping assistance | Per day ₹3,000 | — | Slot, expense |
| Turnkey project | 10% of budget | — | Milestones, advance |

### 111. Waterproofing

*Rules: quantity, site visit, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Terrace waterproofing | Per sqft ₹65 | — | Quantity, site visit |
| Bathroom waterproofing | Per sqft ₹45 | — | Quantity, site visit |
| Wall seepage | Per sqft ₹55 | — | Quantity, warranty |
| Tank waterproofing | ₹4,500 | — | Quantity, site visit |
| Basement waterproofing | Per sqft ₹75 | — | Quantity, warranty |
| Crack filling | Per running ft ₹120 | — | Quantity, warranty |
| Roof coating | Per sqft ₹40 | — | Quantity, site visit |
| Sunken slab | Per sqft ₹85 | — | Quantity, warranty |
| Inspection | ₹500 | — | Address, slot |
| Five-year warranty | ₹2,000 | — | Warranty, follow-up |

### 112. Nanny and babysitter

*Rules: monthly fee, attendance, privacy, verification*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly nanny | 6 hours ₹12,000 · 10 hours ₹18,000 | — | Monthly, attendance, privacy |
| Hourly babysitting | Per hour ₹200 | — | Slot, attendance |
| Night care | Per night ₹1,000 | — | Shift, privacy |
| Day care | Monthly ₹8,000 | — | Monthly, attendance |
| Pickup from school | Monthly ₹2,000 | — | Route, attendance |
| Overnight stay | Per night ₹1,500 | — | Shift, privacy |
| Weekend care | Per day ₹800 | — | Slot, attendance |
| Newborn care | Monthly ₹25,000 | — | Monthly, privacy |
| Verification | ₹500 | — | Verification, quick sale |
| Trial day | ₹500 | — | Slot, quick sale |

### 113. Modular kitchen fitter

*Rules: measurement, quote, milestones, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Modular kitchen | Per running ft ₹2,500 | — | Measurement, quote, warranty |
| Cabinet | Per unit ₹3,500 | — | Measurement, quote |
| Countertop | Per sqft ₹450 | Granite +₹150 | Measurement, quote |
| Chimney installation | ₹1,200 | — | Slot, warranty |
| Hardware fitting | ₹300 | — | Quick sale, warranty |
| Drawer repair | ₹400 | — | Slot, quick sale |
| Kitchen redesign | ₹8,000 | — | Measurement, milestones |
| Site measurement | ₹0 | — | Address, slot |
| Appliance fitting | ₹500 | — | Slot, quick sale |
| Five-year warranty | ₹3,000 | — | Warranty, follow-up |

### 114. Curtain and blind fitter

*Rules: measurement, date, advance, installation*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Curtain stitching | Per panel ₹350 | Lining +₹100 | Measurement, date |
| Curtain rod | Per metre ₹250 | — | Measurement, installation |
| Roller blind | Per sqft ₹120 | — | Measurement, installation |
| Vertical blind | Per sqft ₹150 | — | Measurement, installation |
| Roman blind | Per sqft ₹200 | — | Measurement, installation |
| Motorised blind | Per sqft ₹450 | Remote +₹1,500 | Measurement, warranty |
| Installation | Per window ₹200 | — | Slot, installation |
| Fabric | Per metre ₹300 | — | Stock, quantity |
| Measurement visit | ₹0 | — | Address, slot |
| Curtain cleaning | Per panel ₹150 | — | Quantity, pickup |

### 115. POP and false ceiling

*Rules: measurement, quantity, advance, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| False ceiling | Per sqft ₹85 | — | Measurement, advance, date |
| POP punning | Per sqft ₹25 | — | Measurement, quantity |
| Cornice | Per running ft ₹120 | — | Measurement, date |
| Ceiling design | Per sqft ₹150 | — | Measurement, advance |
| Partition | Per sqft ₹110 | — | Measurement, date |
| Wall panelling | Per sqft ₹180 | — | Measurement, date |
| Repair work | ₹800 | — | Address, quick sale |
| Site measurement | ₹0 | — | Address, slot |
| Material supply | Per bag ₹450 | — | Quantity, stock |
| Painting after POP | Per sqft ₹18 | — | Quantity, date |

### 116. Aluminium and glass work

*Rules: measurement, quantity, advance, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Aluminium window | Per sqft ₹450 | — | Measurement, advance |
| Glass partition | Per sqft ₹550 | — | Measurement, advance |
| Sliding door | Per sqft ₹650 | — | Measurement, warranty |
| Mosquito net | Per sqft ₹180 | — | Measurement, installation |
| Glass railing | Per running ft ₹1,200 | — | Measurement, warranty |
| Shower cubicle | ₹18,000 | — | Measurement, advance |
| Mirror fitting | Per sqft ₹350 | — | Measurement, installation |
| Aluminium cupboard | Per sqft ₹750 | — | Measurement, advance |
| Glass repair | ₹500 | — | Address, quick sale |
| Site measurement | ₹0 | — | Address, slot |

## J. Events, rentals and media

**Pack:** Rentals and events · **Tab noun:** Items · **Unit:** day, event

### 117. Tent house

*Rules: per day, deposit, return checklist, damage charge*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chair | Per day ₹12 | — | Per day, quantity, deposit |
| Tent | 20x20 ₹2,500 · 30x30 ₹4,500 | — | Per day, deposit, date |
| Crockery set | Per plate ₹8 | — | Per day, quantity, return checklist |
| Table | Per day ₹60 | — | Per day, quantity, deposit |
| Fan | Per day ₹150 | — | Per day, quantity, deposit |
| Light set | Per day ₹400 | — | Per day, quantity |
| Shamiana | Per day ₹3,500 | — | Per day, deposit, date |
| Stage | Per day ₹2,000 | — | Per day, quantity, deposit |
| Chairs and table combo | 100 chairs ₹1,000 | — | Quantity, per day |
| Return shortage | Per item ₹50 | — | Return checklist, damage charge |

### 118. Sound and light rental

*Rules: per day, deposit, setup charge*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Speaker | Pair ₹1,800 per day | Operator +₹1,000 | Per day, deposit |
| Cordless mic | ₹500 per day | — | Per day, deposit |
| Party lights | ₹800 per day | Setup +₹500 | Per day, setup |
| Mixer | ₹1,200 per day | — | Per day, deposit |
| Amplifier | ₹1,500 per day | — | Per day, deposit |
| LED wall | Per sqft ₹350 per day | — | Per day, setup |
| Smoke machine | ₹800 per day | — | Per day, deposit |
| Stage light | ₹400 per day | — | Per day, quantity |
| Setup charge | ₹1,000 | — | Setup, slot |
| Damage charge | At cost | — | Deposit, return checklist |

### 119. DJ service

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Event DJ | 4 hours ₹8,000 · 6 hours ₹11,000 | Extra hour +₹1,500 | Date, slot, advance |
| Wedding DJ | ₹15,000 | — | Date, advance |
| Lighting add-on | ₹3,000 | — | Setup, date |
| Sangeet DJ | ₹12,000 | — | Date, slot, advance |
| Birthday DJ | ₹5,000 | — | Date, slot |
| Corporate event | ₹10,000 | — | Date, invoice |
| Karaoke setup | ₹4,000 | — | Date, setup |
| Sound system | ₹3,000 | — | Date, setup |
| Travel charge | Per km ₹20 | — | Travel, expense |
| Extra hour | ₹1,500 | — | Slot, quick sale |

### 120. Event decorator

*Rules: event date, advance, site visit, photo reference*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Birthday decor | ₹6,000 | Theme +₹1,500 | Date, site visit |
| Wedding decor | ₹25,000 | Flowers +₹5,000 | Date, advance, site visit |
| Stage backdrop | ₹8,000 | Custom print +₹2,000 | Date, photo reference |
| Balloon decor | ₹3,500 | Custom colour +₹500 | Date, site visit |
| Haldi decor | ₹7,000 | — | Date, advance |
| Mehendi decor | ₹9,000 | — | Date, advance |
| Car decor | ₹2,500 | Flowers +₹800 | Date, delivery |
| Room decor | ₹4,000 | — | Date, site visit |
| Baby shower | ₹8,000 | Theme +₹1,500 | Date, advance |
| Setup and removal | ₹1,500 | — | Setup, slot |

### 121. Wedding planner

*Rules: event date, instalments, vendor expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Partial planning | ₹15,000 | — | Date, instalments |
| Full planning | ₹50,000 | — | Date, instalments, expense |
| Day coordination | ₹10,000 | — | Date, slot |
| Destination wedding | ₹1,50,000 | — | Date, instalments, expense |
| Vendor management | ₹20,000 | — | Date, expense |
| Decor planning | ₹25,000 | — | Date, instalments |
| Guest management | ₹15,000 | — | Date, quantity |
| Invitation design | ₹8,000 | — | Date, custom text |
| Rehearsal coordination | ₹5,000 | — | Date, slot |
| Budget tracking | ₹5,000 | — | Custom text, expense |

### 122. Event photographer

*Rules: event date, advance, delivery date, photo count*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Half day | 4 hours ₹8,000 | — | Date, advance |
| Full day | ₹15,000 | — | Date, advance |
| Album | ₹4,000 | 20 pages +₹2,000 | Photo count, delivery date |
| Pre-wedding shoot | ₹12,000 | — | Date, advance |
| Wedding shoot | 2 days ₹35,000 | — | Date, advance, delivery |
| Maternity shoot | ₹6,000 | — | Slot, delivery |
| Newborn shoot | ₹7,000 | — | Slot, delivery |
| Birthday shoot | ₹5,000 | — | Date, delivery |
| Photo printing | Per print ₹25 | — | Quantity, delivery |
| Express delivery | ₹3,000 | — | Delivery date, quick sale |

### 123. Videographer

*Rules: event date, advance, delivery date, revisions*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Highlight reel | ₹12,000 | — | Date, advance |
| Full film | ₹25,000 | — | Date, advance |
| Drone add-on | ₹5,000 | — | Date, delivery |
| Wedding film | 2 days ₹45,000 | — | Date, advance, delivery |
| Pre-wedding video | ₹15,000 | — | Date, delivery |
| Corporate video | ₹20,000 | — | Date, revisions |
| Reel package | 5 reels ₹15,000 | — | Date, delivery |
| Live streaming | ₹10,000 | — | Date, setup |
| Extra revision | ₹2,000 | — | Revisions |
| Raw footage | ₹5,000 | — | Delivery, privacy |

### 124. Kids party rental

*Rules: per day, deposit, delivery, safety note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bouncy castle | Per day ₹3,500 | — | Per day, deposit, delivery |
| Slide | Per day ₹5,000 | — | Per day, deposit |
| Attendant | ₹800 | — | Slot |
| Ball pit | Per day ₹2,500 | — | Per day, deposit |
| Trampoline | Per day ₹4,000 | — | Per day, deposit, safety |
| Candy floss machine | Per day ₹1,500 | Material +₹500 | Per day, deposit |
| Popcorn machine | Per day ₹1,500 | Material +₹400 | Per day, deposit |
| Magic show | ₹5,000 | — | Date, slot |
| Game host | ₹3,000 | — | Date, slot |
| Delivery charge | Per km ₹30 | — | Delivery, route |

### 125. Dhol and band party

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Dhol | ₹3,000 | Extra player +₹1,500 | Date, slot |
| Band | 5 members ₹8,000 | Extra member +₹1,200 | Date, slot |
| Wedding package | ₹12,000 | — | Date, advance |
| Baraat package | ₹15,000 | — | Date, advance |
| DJ with dhol | ₹10,000 | — | Date, slot |
| Nagada | ₹4,000 | — | Date, slot |
| Shehnai | ₹5,000 | — | Date, slot |
| Travel charge | Per km ₹25 | — | Travel, expense |
| Extra hour | ₹1,500 | — | Slot, quick sale |
| Traditional dress | ₹500 per person | — | Quantity, deposit |

### 126. Anchor and emcee

*Rules: event date, slot, advance, travel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Event anchoring | 4 hours ₹6,000 | Extra hour +₹1,000 | Date, slot, advance |
| Wedding anchoring | ₹10,000 | — | Date, advance |
| Corporate event | ₹8,000 | — | Date, invoice |
| Birthday party | ₹3,500 | — | Date, slot |
| Game host | ₹4,000 | — | Date, slot |
| Script writing | ₹2,000 | — | Custom text, date |
| Voice over | Per minute ₹500 | — | Date, delivery |
| Stage performance | ₹5,000 | — | Date, slot |
| Travel charge | Per km ₹20 | — | Travel, expense |
| Rehearsal | ₹1,500 | — | Slot, date |

### 127. Mandap and flower decorator

*Rules: event date, advance, site visit, quantity*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Mandap setup | ₹25,000 | Flowers +₹8,000 | Date, advance, site visit |
| Flower stage | ₹15,000 | Imported flowers +₹10,000 | Date, advance |
| Car decoration | ₹3,000 | Flowers +₹1,000 | Date, delivery |
| Garland | ₹500 | — | Date, quantity |
| Entrance decor | ₹8,000 | — | Date, site visit |
| Ceiling decor | ₹12,000 | — | Date, site visit |
| Table centerpiece | Per table ₹800 | — | Quantity, date |
| Pooja mandap | ₹10,000 | — | Date, advance |
| Flower wall | ₹9,000 | — | Date, setup |
| Setup team | ₹2,000 | — | Setup, slot |

### 128. Costume rental

*Rules: per day, deposit, size, return checklist*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Halloween costume | Per day ₹500 | — | Per day, deposit |
| Theme costume | Per day ₹800 | — | Per day, deposit, size |
| Kids costume | Per day ₹400 | — | Per day, deposit, size |
| Stage drama set | Per day ₹2,000 | — | Per day, deposit |
| Santa costume | Per day ₹1,200 | — | Per day, deposit |
| Historical costume | Per day ₹1,500 | — | Per day, deposit, size |
| Dance group set | 10 pieces ₹5,000 | — | Quantity, deposit |
| Accessories | Per piece ₹150 | — | Per day, deposit |
| Damage charge | At cost | — | Return checklist, damage charge |
| Late fee | Per day ₹200 | — | Return checklist, per day |

### 129. Lehenga and sherwani rental

*Rules: per day, deposit, size, fitting, return checklist*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bridal lehenga | 2 days ₹12,000 | — | Per day, deposit, fitting |
| Sherwani | 2 days ₹6,000 | — | Per day, deposit, size |
| Groom package | ₹10,000 | — | Per day, deposit, fitting |
| Engagement lehenga | 2 days ₹8,000 | — | Per day, deposit |
| Indo-western | 2 days ₹7,000 | — | Per day, deposit, size |
| Dupatta set | ₹1,500 | — | Per day, deposit |
| Turban | ₹800 | — | Per day, deposit |
| Mojari | ₹600 | — | Per day, deposit, size |
| Fitting charge | ₹500 | — | Fitting, quick sale |
| Late fee | Per day ₹500 | — | Return checklist, per day |

### 130. Photo booth rental

*Rules: per day, deposit, delivery, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Photo booth | 4 hours ₹8,000 | Extra hour +₹1,500 | Per day, deposit, delivery |
| Instant prints | Per print ₹20 | — | Quantity, delivery |
| Props set | ₹1,500 | — | Per day, deposit |
| Backdrop | ₹3,000 | Custom print +₹1,000 | Per day, custom text |
| 360 booth | 4 hours ₹12,000 | — | Per day, deposit |
| Mirror booth | 4 hours ₹15,000 | — | Per day, deposit |
| Attendant | ₹1,000 | — | Slot, date |
| Custom frame | ₹500 | Custom text +₹100 | Custom text, date |
| Delivery charge | Per km ₹30 | — | Delivery, route |
| Setup charge | ₹1,000 | — | Setup, slot |

## K. Creative and freelance

**Pack:** Freelance · **Tab noun:** Services · **Unit:** project, page, post

### 131. Graphic designer

*Rules: brief, revisions, milestones, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Logo design | Basic ₹3,500 · Premium ₹7,000 | Two extra revisions +₹1,500 · Source file +₹1,000 | Brief, revisions |
| Social post | ₹400 | Carousel +₹200 | Brief, date |
| Packaging design | ₹1,800 | Mockup +₹600 | Brief, revisions |
| Brand identity | ₹15,000 | Brand book +₹5,000 | Brief, milestones |
| Flyer design | ₹800 | Print ready +₹200 | Brief, date |
| Brochure | ₹3,000 | Per page +₹400 | Brief, revisions |
| Menu design | ₹2,000 | — | Brief, date |
| Presentation deck | ₹3,000 | Per slide +₹150 | Brief, revisions |
| Banner set | ₹1,200 | — | Brief, date |
| Retainer | Monthly ₹12,000 | — | Monthly, TDS |

### 132. Video editor

*Rules: brief, delivery date, revisions, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Reel edit | ₹800 | Subtitles +₹150 · Motion graphics +₹400 | Brief, date |
| Long form edit | ₹2,500 | Thumbnail +₹300 | Brief, revisions |
| Colour grade | ₹1,200 | — | Revisions |
| Wedding edit | ₹8,000 | Full film +₹5,000 | Date, revisions |
| YouTube package | 4 videos ₹6,000 | Thumbnails +₹800 | Brief, date |
| Podcast edit | Per episode ₹1,500 | — | Brief, date |
| Corporate film | ₹12,000 | — | Brief, milestones |
| Motion graphics | Per minute ₹3,000 | — | Brief, revisions |
| Subtitle work | Per minute ₹60 | — | Quantity, date |
| Retainer | Monthly ₹15,000 | — | Monthly, TDS |

### 133. Content writer

*Rules: per word, deadline, revisions, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Blog post | ₹1,200 | SEO +₹400 | Per word, deadline |
| Website copy | Per page ₹3,000 | — | Deadline, revisions |
| Product description | ₹250 | Bulk 10 +₹0 | Quantity, deadline |
| SEO article | Per 1,000 words ₹1,500 | Keyword research +₹400 | Per word, deadline |
| Newsletter | ₹800 | — | Deadline, revisions |
| Press release | ₹1,500 | — | Deadline, revisions |
| Script writing | Per minute ₹500 | — | Deadline, revisions |
| Case study | ₹3,000 | — | Deadline, revisions |
| Editing | Per 1,000 words ₹500 | — | Quantity, deadline |
| Retainer | Monthly ₹20,000 | — | Monthly, TDS |

### 134. Translator

*Rules: per word, deadline, certification*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Translation | Per word ₹1.5 | Certified +₹0.5 | Per word, certification |
| Document | Per page ₹1,200 | Notarised +₹500 | Per word, deadline |
| Subtitling | Per minute ₹150 | — | Deadline |
| Legal translation | Per page ₹2,000 | Notarised +₹800 | Certification, deadline |
| Website localisation | Per word ₹2 | — | Per word, deadline |
| Proofreading | Per 1,000 words ₹400 | — | Quantity, deadline |
| Voice over script | Per minute ₹300 | — | Deadline |
| Interpretation | Per hour ₹1,500 | — | Slot, date |
| Certificate | ₹500 | — | Certification, quick sale |
| Urgent delivery | 25% extra | — | Deadline, quick sale |

### 135. Social media manager

*Rules: monthly retainer, recurring, approval*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly retainer | 12 posts ₹8,000 · 20 posts ₹12,000 | Reel +₹300 each | Monthly, approval |
| Campaign | ₹6,000 | — | Date, approval |
| Ad management | ₹5,000 plus 10% spend | — | Monthly, expense |
| Reel package | 8 reels ₹10,000 | — | Monthly, approval |
| Content calendar | ₹2,000 | — | Monthly, approval |
| Community management | ₹4,000 | — | Monthly, approval |
| Influencer outreach | ₹5,000 | — | Monthly, follow-up |
| Analytics report | ₹1,500 | — | Monthly, custom text |
| Profile setup | ₹3,000 | — | Date, approval |
| Shoot add-on | Per day ₹6,000 | — | Date, expense |

### 136. Web and app developer

*Rules: milestones, retainer, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Landing page | ₹15,000 | CMS +₹5,000 | Milestones, revisions |
| E-commerce site | ₹60,000 | Payment +₹10,000 | Milestones, TDS |
| Mobile app | ₹1,50,000 | iOS +₹40,000 | Milestones, retainer |
| Business website | ₹25,000 | — | Milestones, revisions |
| WordPress site | ₹18,000 | Plugin +₹3,000 | Milestones, revisions |
| Maintenance | Monthly ₹5,000 | — | Monthly, retainer |
| Hosting setup | ₹2,000 | — | Quick sale |
| SEO setup | ₹8,000 | — | Milestones, revisions |
| API integration | ₹12,000 | — | Milestones, TDS |
| Bug fixing | Per hour ₹800 | — | Quick sale, retainer |

### 137. Illustrator

*Rules: brief, revisions, usage rights*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Character art | ₹2,500 | Extra pose +₹800 | Brief, revisions |
| Book cover | ₹8,000 | Full wrap +₹3,000 | Brief, usage rights |
| Editorial image | ₹4,000 | — | Deadline, usage rights |
| Children book art | Per page ₹2,000 | — | Brief, revisions |
| Comic strip | Per panel ₹800 | — | Brief, revisions |
| T-shirt graphic | ₹3,000 | — | Brief, usage rights |
| Sticker pack | 10 pieces ₹2,500 | — | Quantity, usage rights |
| Portrait illustration | ₹2,000 | Extra person +₹600 | Brief, revisions |
| Storyboard | Per frame ₹1,200 | — | Brief, revisions |
| Commercial licence | 2x price | — | Usage rights, TDS |

### 138. Mural painter

*Rules: quantity, site visit, advance, material expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Wall mural | Per sqft ₹120 | Ceiling +₹80 | Quantity, site visit |
| Exterior mural | Per sqft ₹150 | Height +₹50 | Quantity, site visit, advance |
| Design fee | ₹3,000 | — | Brief, advance |
| Kids room mural | Per sqft ₹140 | — | Quantity, site visit |
| Cafe mural | Per sqft ₹180 | — | Quantity, site visit |
| Office branding | Per sqft ₹160 | Logo +₹2,000 | Quantity, advance |
| Wall art | ₹5,000 | — | Brief, date |
| Touch-up | Per sqft ₹60 | — | Quantity, warranty |
| Material cost | Per sqft ₹25 | — | Expense, quantity |
| Site visit | ₹500 | — | Address, slot |

### 139. Portrait and sketch artist

*Rules: photo, date, courier*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Pencil sketch | A4 ₹1,500 · A3 ₹3,000 | Frame +₹600 | Photo, courier |
| Digital portrait | ₹2,500 | Extra person +₹800 | Photo, date |
| Caricature | ₹1,200 | — | Photo, date |
| Watercolour portrait | A4 ₹3,000 · A3 ₹5,000 | Frame +₹800 | Photo, courier |
| Charcoal sketch | ₹2,000 | — | Photo, courier |
| Couple portrait | ₹4,000 | — | Photo, courier |
| Pet portrait | ₹2,000 | — | Photo, courier |
| Family portrait | ₹6,000 | Extra person +₹1,000 | Photo, courier |
| Live sketching | Per hour ₹3,000 | — | Event date, slot |
| Courier charge | ₹200 | — | Courier, route |

### 140. Photographer (portrait and product)

*Rules: slot, delivery date, photo count*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Portrait shoot | 2 hours ₹5,000 · 4 hours ₹8,000 | Ten edited +₹2,000 | Slot, delivery date |
| Product shoot | Per shot ₹150 | Ten shots ₹1,200 | Photo count, delivery |
| Event shoot | Half day ₹8,000 | — | Date, advance |
| Maternity shoot | ₹6,000 | — | Slot, delivery |
| Fashion portfolio | ₹12,000 | — | Slot, delivery |
| Food photography | Per dish ₹800 | — | Photo count, delivery |
| Real estate shoot | Per property ₹5,000 | — | Address, delivery |
| Passport photo | ₹150 | — | Quick sale |
| Photo editing | Per photo ₹100 | — | Quantity, delivery |
| Studio rental | Per hour ₹1,000 | — | Slot, deposit |

### 141. Influencer and content creator

*Rules: date, deliverables, approval, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Promo post | ₹5,000 | Story +₹2,000 | Date, deliverables |
| Reel | ₹12,000 | Usage rights +₹5,000 | Date, approval |
| Bundle | 3 posts ₹20,000 | — | Date, deliverables |
| YouTube integration | ₹25,000 | — | Date, deliverables |
| Product review | ₹8,000 | — | Date, approval |
| Brand ambassadorship | Monthly ₹40,000 | — | Monthly, TDS |
| UGC video | ₹4,000 | — | Date, deliverables |
| Live session | ₹6,000 | — | Date, slot |
| Photo shoot | ₹10,000 | — | Date, deliverables |
| Exclusivity fee | ₹15,000 | — | Date, TDS |

### 142. Astrologer and tarot reader

*Rules: slot, privacy, follow-up*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kundali reading | ₹1,100 | Written report +₹500 | Slot, privacy |
| Matchmaking | ₹1,500 | — | Slot, privacy |
| Vastu visit | ₹3,500 | — | Address, slot |
| Tarot reading | ₹800 | — | Slot, privacy |
| Gemstone consult | ₹1,000 | — | Slot, follow-up |
| Numerology | ₹900 | — | Slot, privacy |
| Career reading | ₹1,500 | — | Slot, privacy |
| Pooja recommendation | ₹700 | — | Slot, follow-up |
| Monthly horoscope | ₹500 | — | Monthly, custom text |
| Follow-up call | ₹300 | — | Follow-up, quick sale |

### 143. Pandit and priest

*Rules: date, slot, material expense, travel*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Puja | ₹2,500 | Samagri included +₹800 | Date, slot |
| Wedding | ₹15,000 | — | Date, advance |
| Griha pravesh | ₹5,000 | — | Date, slot |
| Satyanarayan puja | ₹3,000 | — | Date, slot |
| Namkaran | ₹2,500 | — | Date, slot |
| Mundan | ₹2,000 | — | Date, slot |
| Shraddh | ₹3,500 | — | Date, slot |
| Havan | ₹4,000 | Samagri +₹1,000 | Date, slot |
| Travel charge | Per km ₹20 | — | Travel, expense |
| Samagri kit | ₹800 | — | Stock, quick sale |

### 144. Calligrapher

*Rules: custom text, date, courier*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Wedding invite | Per card ₹150 | — | Custom text, date |
| Envelope addressing | Per envelope ₹40 | — | Custom text, quantity |
| Certificate writing | Per certificate ₹200 | — | Custom text, date |
| Name board | ₹2,500 | — | Custom text, date |
| Poem artwork | ₹1,500 | Frame +₹500 | Custom text, courier |
| Logo lettering | ₹3,000 | — | Custom text, revisions |
| Menu calligraphy | ₹1,500 | — | Custom text, date |
| Live calligraphy | Per hour ₹2,000 | — | Event date, slot |
| Workshop | Per person ₹800 | — | Date, advance |
| Courier charge | ₹150 | — | Courier, route |

### 145. Animator and motion designer

*Rules: brief, revisions, delivery date, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Explainer video | 60 sec ₹15,000 | Extra 30 sec +₹6,000 | Brief, revisions |
| Logo animation | ₹3,000 | — | Brief, revisions |
| Motion graphics | Per minute ₹8,000 | — | Brief, delivery |
| 2D animation | Per minute ₹12,000 | — | Brief, revisions |
| 3D animation | Per minute ₹25,000 | — | Brief, milestones |
| Whiteboard animation | Per minute ₹6,000 | — | Brief, revisions |
| Social media animation | ₹2,000 | — | Brief, date |
| Character rigging | ₹5,000 | — | Brief, revisions |
| Storyboard | Per frame ₹800 | — | Brief, revisions |
| Retainer | Monthly ₹30,000 | — | Monthly, TDS |

### 146. Podcast editor

*Rules: brief, delivery date, revisions, TDS*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Episode edit | 30 min ₹1,200 · 60 min ₹2,000 | — | Brief, delivery |
| Noise cleanup | Per episode ₹400 | — | Delivery, revisions |
| Show intro | ₹2,000 | — | Brief, revisions |
| Full production | Per episode ₹3,500 | — | Brief, delivery |
| Video podcast | Per episode ₹4,000 | — | Brief, delivery |
| Show notes | ₹300 | — | Custom text, delivery |
| Audiogram | ₹500 | — | Delivery, date |
| Distribution setup | ₹1,500 | — | Date, quick sale |
| Bulk package | 4 episodes ₹6,000 | — | Quantity, delivery |
| Retainer | Monthly ₹8,000 | — | Monthly, TDS |

### 147. Drone service

*Rules: date, slot, permissions, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Aerial shoot | Per hour ₹5,000 | — | Date, slot, permissions |
| Wedding coverage | ₹15,000 | — | Date, advance |
| Real estate video | ₹8,000 | — | Address, delivery |
| Survey mapping | Per acre ₹1,500 | — | Quantity, permissions |
| Event coverage | ₹10,000 | — | Date, slot |
| Agriculture spray | Per acre ₹400 | — | Quantity, date |
| Inspection | Per site ₹6,000 | — | Address, date |
| Raw footage | ₹2,000 | — | Delivery, privacy |
| Editing | ₹3,000 | — | Delivery, revisions |
| Travel charge | Per km ₹30 | — | Travel, expense |

## L. Retail and trading

**Pack:** None today. Closest is Grocery with the noun Items. See [coverage gaps](#coverage-gaps). **Unit:** piece, sqft

### 148. Mobile accessories shop

*Rules: model note, stock, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Back cover | ₹150 | — | Model, stock |
| Charger | ₹450 | Fast +₹250 | Model, warranty |
| Earbuds | ₹900 | — | Model, warranty |
| Tempered glass | ₹120 | — | Model, stock |
| Power bank | 10,000 mAh ₹900 · 20,000 mAh ₹1,600 | — | Model, warranty |
| Cable | ₹150 | Type C +₹50 | Model, stock |
| Car charger | ₹350 | — | Model, warranty |
| Phone holder | ₹250 | — | Stock, quick sale |
| Bluetooth speaker | ₹1,200 | — | Warranty, stock |
| Smartwatch strap | ₹300 | — | Model, stock |

### 149. Electronics shop

*Rules: serial note, warranty, EMI, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fan | ₹1,800 | — | Serial, warranty |
| Mixer | ₹2,200 | — | Serial, warranty |
| Television | 32 inch ₹18,000 · 43 inch ₹28,000 | — | Serial, warranty, delivery |
| Refrigerator | 190 L ₹18,000 · 250 L ₹24,000 | — | Serial, warranty, delivery |
| Washing machine | 6 kg ₹16,000 · 8 kg ₹22,000 | — | Serial, warranty, delivery |
| Air conditioner | 1 ton ₹32,000 · 1.5 ton ₹38,000 | Installation +₹1,500 | Serial, warranty, delivery |
| Microwave | ₹8,500 | — | Serial, warranty |
| Induction cooktop | ₹2,500 | — | Serial, warranty |
| Iron | ₹1,200 | — | Serial, warranty |
| Stabiliser | ₹2,800 | — | Serial, warranty |

### 150. Hardware store

*Rules: quantity, credit, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Nails | Per kg ₹80 | — | Quantity, stock |
| Hinges | Per pair ₹60 | — | Quantity, stock |
| Paint | 1 L ₹350 · 4 L ₹1,300 | Tinting +₹100 | Quantity, credit |
| Screws | Per box ₹120 | — | Quantity, stock |
| Door lock | ₹650 | — | Stock, warranty |
| Drill bit | ₹150 | — | Stock, quick sale |
| Sandpaper | Per sheet ₹20 | — | Quantity, stock |
| PVC pipe | Per metre ₹60 | — | Quantity, stock |
| Wire | Per metre ₹25 | — | Quantity, stock |
| Tool kit | ₹1,500 | — | Stock, credit |

### 151. Tiles and sanitaryware

*Rules: quantity, box quantity, delivery, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tile | Per sqft ₹45 | — | Quantity, box quantity |
| Basin | ₹1,800 | — | Stock, delivery |
| Tap | ₹650 | — | Stock, warranty |
| Floor tile | Per sqft ₹55 | — | Quantity, box quantity |
| Wall tile | Per sqft ₹40 | — | Quantity, box quantity |
| Commode | ₹4,500 | — | Stock, delivery |
| Shower panel | ₹3,500 | — | Stock, warranty |
| Sink | ₹2,500 | — | Stock, delivery |
| Grout | Per kg ₹60 | — | Quantity, stock |
| Adhesive | Per bag ₹350 | — | Quantity, delivery |

### 152. Furniture shop

*Rules: delivery, assembly, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chair | ₹2,500 | — | Delivery, assembly |
| Bed | Queen ₹18,000 · King ₹24,000 | Storage +₹4,000 | Delivery, assembly, advance |
| Sofa | 3-seater ₹15,000 | — | Delivery, advance |
| Dining table | 4-seater ₹12,000 · 6-seater ₹18,000 | — | Delivery, assembly |
| Wardrobe | 2 door ₹14,000 · 3 door ₹20,000 | — | Delivery, assembly, advance |
| Study table | ₹5,500 | — | Delivery, assembly |
| TV unit | ₹7,000 | — | Delivery, assembly |
| Mattress | Single ₹6,000 · Double ₹10,000 | — | Delivery, warranty |
| Recliner | ₹22,000 | — | Delivery, advance |
| Custom furniture | Per sqft ₹1,500 | — | Measurement, advance |

### 153. Optical shop

*Rules: prescription, fitting date, warranty*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Frame | ₹1,200 | — | Prescription, stock |
| Lens | Single vision ₹800 · Progressive ₹2,500 | Anti-glare +₹400 | Prescription, fitting date |
| Sunglasses | ₹1,500 | — | Stock, warranty |
| Contact lens | Pair ₹600 · Box of 6 ₹1,800 | — | Prescription, stock |
| Lens cleaning solution | ₹150 | — | Stock, quick sale |
| Eye test | ₹0 | — | Slot, quick sale |
| Frame repair | ₹200 | — | Quick sale, warranty |
| Sports glasses | ₹2,500 | — | Prescription, stock |
| Blue light lens | ₹1,200 | — | Prescription, fitting date |
| Kids frame | ₹900 | — | Stock, warranty |

### 154. Jewellery shop

*Rules: weight, old gold exchange, certificate*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Chain | 10 g ₹25,000 | — | Weight, certificate |
| Ring | 3 g ₹8,000 | — | Weight, old gold exchange |
| Earrings | 5 g ₹14,000 | — | Weight, certificate |
| Bangle | 8 g ₹22,000 | — | Weight, certificate |
| Necklace | 20 g ₹55,000 | — | Weight, certificate |
| Mangalsutra | 6 g ₹18,000 | — | Weight, certificate |
| Silver item | 20 g ₹2,000 | — | Weight, stock |
| Gold coin | 1 g ₹6,500 · 5 g ₹32,000 | — | Weight, certificate |
| Repair | ₹500 | — | Weight, warranty |
| Old gold exchange | Per gram ₹5,500 | — | Old gold exchange, weight |

### 155. Auto parts and tyre

*Rules: part number, serial note, warranty, fitment*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Brake pad | ₹450 | — | Part number, warranty |
| Tyre | ₹2,500 | — | Serial, warranty, fitment |
| Alignment | ₹300 | — | Quick sale |
| Clutch plate | ₹1,800 | — | Part number, warranty |
| Battery | ₹4,500 | — | Serial, warranty |
| Headlight | ₹1,200 | — | Part number, fitment |
| Mirror | ₹650 | — | Part number, fitment |
| Wiper | ₹350 | — | Part number, quick sale |
| Engine oil | 1 L ₹450 · 4 L ₹1,600 | — | Stock, quick sale |
| Alloy wheel | ₹4,000 | — | Serial, fitment |

### 156. Paint shop

*Rules: quantity, tinting, credit, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Interior emulsion | 1 L ₹350 · 4 L ₹1,300 | Tinting +₹100 | Quantity, credit |
| Exterior paint | 4 L ₹1,800 · 10 L ₹4,200 | — | Quantity, credit |
| Primer | 1 L ₹250 · 4 L ₹900 | — | Quantity, stock |
| Putty | 20 kg ₹650 | — | Quantity, delivery |
| Enamel | 1 L ₹300 | — | Quantity, stock |
| Wood finish | 1 L ₹450 | — | Quantity, stock |
| Distemper | 10 kg ₹550 | — | Quantity, credit |
| Waterproof coating | 10 L ₹2,500 | — | Quantity, delivery |
| Brush set | ₹150 | — | Stock, quick sale |
| Colour consultation | ₹500 | — | Slot, follow-up |

### 157. Cosmetics and perfume shop

*Rules: stock, expiry, brand, billing*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Lipstick | ₹350 | — | Stock, expiry |
| Foundation | ₹650 | — | Stock, expiry |
| Perfume | 50 ml ₹1,200 · 100 ml ₹2,000 | — | Stock, brand |
| Face wash | ₹250 | — | Stock, expiry |
| Moisturiser | ₹450 | — | Stock, expiry |
| Kajal | ₹180 | — | Stock, expiry |
| Nail polish | ₹150 | — | Stock, expiry |
| Shampoo | 200 ml ₹220 · 400 ml ₹400 | — | Stock, brand |
| Gift set | ₹1,500 | — | Gift box, stock |
| Makeup kit | ₹2,500 | — | Stock, brand |

### 158. Gift and stationery shop

*Rules: stock, gift wrap, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Notebook | 100 pages ₹40 · 200 pages ₹70 | — | Stock, quantity |
| Pen | ₹10 · Pack of 10 ₹90 | — | Stock, quick sale |
| Gift wrap | Per item ₹30 | Custom paper +₹20 | Quick sale |
| Greeting card | ₹40 | Custom text +₹30 | Custom text, stock |
| Photo frame | ₹250 | — | Stock, gift box |
| Soft toy | Small ₹250 · Large ₹600 | — | Stock, gift box |
| Mug | ₹200 | Custom print +₹100 | Custom text, stock |
| Keychain | ₹80 | — | Stock, quick sale |
| Gift hamper | Small ₹500 · Large ₹1,000 | Custom items +₹150 | Gift box, delivery |
| School kit | ₹450 | — | Stock, quantity |

### 159. Bicycle shop

*Rules: serial note, warranty, assembly, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Kids cycle | ₹4,500 | — | Serial, warranty |
| Adult cycle | ₹8,500 | — | Serial, warranty |
| Gear cycle | ₹15,000 | — | Serial, warranty |
| Electric cycle | ₹32,000 | — | Serial, warranty, delivery |
| Helmet | ₹800 | — | Stock, warranty |
| Spare tyre | ₹450 | — | Stock, warranty |
| Service | ₹250 | — | Quick sale |
| Accessories | ₹350 | — | Stock, quick sale |
| Assembly | ₹300 | — | Quick sale |
| Home delivery | ₹500 | — | Delivery, route |

## M. Transport and gig work

**Pack:** None today. See [coverage gaps](#coverage-gaps). **Unit:** trip, shift, day

### 160. Delivery rider

*Rules: per trip, fuel expense, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Food delivery | Per order ₹35 | Peak +₹10 · Long distance +₹15 | Per trip, expense |
| Grocery delivery | Per order ₹45 | Heavy +₹20 | Per trip |
| Daily target | 10 orders ₹350 | — | Per day, daily cash left |
| Parcel delivery | Per parcel ₹60 | Fragile +₹20 | Per trip, delivery |
| Medicine delivery | Per order ₹70 | Urgent +₹30 | Per trip, quick sale |
| Document pickup | Per trip ₹80 | — | Per trip, route |
| Cash on delivery | Per order ₹20 | — | Credit, daily cash left |
| Fuel expense | Per day ₹150 | — | Expense, daily cash left |
| Weekly incentive | ₹500 | — | Per day, quick sale |
| Monthly target | 250 orders ₹9,000 | — | Monthly, attendance |

### 161. Auto rickshaw driver

*Rules: monthly route, credit, fuel expense*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local trip | ₹120 | Waiting +₹30 per hour | Per trip |
| School route | Monthly ₹2,500 | — | Monthly, route, attendance |
| Hourly hire | ₹250 per hour | — | Per hour |
| Railway station | ₹150 | Luggage +₹30 | Per trip |
| Airport trip | ₹600 | — | Per trip |
| Monthly pass | ₹1,800 | — | Monthly, route |
| Night charge | 25% extra | — | Per trip, quick sale |
| Waiting charge | Per hour ₹120 | — | Per hour |
| Fuel expense | Per day ₹300 | — | Expense, daily cash left |
| Daily cash left | Per day ₹800 | — | Daily cash left |

### 162. Cab driver

*Rules: per km, toll expense, EMI*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local ride | Per km ₹12 | Waiting +₹2 per km | Per km |
| Outstation | Per day ₹2,500 | Driver allowance +₹400 | Per day, expense |
| Airport transfer | ₹800 | — | Per trip |
| Hourly package | 4 hours ₹800 | — | Per hour |
| Monthly corporate | ₹25,000 | — | Monthly, invoice |
| Toll charge | At actual | — | Expense, per trip |
| Night charge | 20% extra | — | Per trip |
| Extra km | Per km ₹14 | — | Per km |
| Cancellation fee | ₹100 | — | Quick sale |
| EMI expense | Monthly ₹12,000 | — | Monthly, expense |

### 163. School van driver

*Rules: monthly fee, attendance, route*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly seat | ₹1,500 | — | Monthly, route |
| One-way seat | ₹1,200 | — | Monthly, route |
| Single trip | ₹100 | — | Per trip |
| Sibling seat | ₹1,200 | — | Monthly, route |
| Admission fee | ₹500 | — | Advance, quick sale |
| Route change | ₹300 | — | Route, quick sale |
| Late pickup | ₹50 | — | Per trip, quick sale |
| Annual fee | ₹15,000 | — | Annual, attendance |
| Fuel expense | Per day ₹400 | — | Expense, daily cash left |
| Monthly attendance | 24 days ₹1,500 | — | Attendance, monthly |

### 164. Tempo and mini truck owner

*Rules: per trip, fuel expense, driver*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Local trip | ₹2,500 | Loading +₹500 | Per trip |
| Per km | ₹35 | — | Per km |
| Full day | ₹6,000 | — | Per day, expense |
| Loading help | Per person ₹400 | — | Quantity, quick sale |
| Outstation | Per km ₹42 | — | Per km, expense |
| Monthly contract | ₹45,000 | — | Monthly, invoice |
| Waiting charge | Per hour ₹200 | — | Per hour |
| Night halt | ₹500 | — | Per day, expense |
| Driver allowance | Per day ₹400 | — | Expense, per day |
| Fuel expense | Per trip ₹800 | — | Expense, daily cash left |

### 165. Courier agent

*Rules: per parcel, COD collection*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Parcel | ₹40 | COD +₹20 | Per parcel |
| Monthly franchise | ₹3,000 | — | Monthly |
| Bulk pickup | Per 100 ₹3,500 | — | Quantity |
| Document courier | ₹30 | — | Per parcel |
| International courier | ₹1,200 | — | Per parcel, delivery |
| Packaging | Per parcel ₹30 | — | Quick sale |
| COD remittance | Per parcel ₹20 | — | Credit, daily cash left |
| Same-day delivery | ₹100 | — | Per parcel, quick sale |
| Return parcel | ₹35 | — | Per parcel, delivery |
| Monthly volume | 500 parcels ₹15,000 | — | Monthly, credit |

### 166. Milk delivery route

*Rules: monthly card, route, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Daily delivery | Per litre ₹72 | — | Route, attendance |
| Monthly pass | ₹2,000 | — | Monthly, route |
| Extra litre | ₹72 | — | Quantity |
| Curd | 500 g ₹55 | — | Route, daily stock |
| Paneer | 250 g ₹110 | — | Route, daily stock |
| Ghee | 500 ml ₹480 | — | Route, stock |
| Route charge | Monthly ₹100 | — | Route, monthly |
| New connection | ₹200 | — | Advance, quick sale |
| Holiday pause | ₹0 | — | Attendance, route |
| Monthly bill | 30 litres ₹2,100 | — | Monthly, credit |

### 167. Multi-platform gig worker

*Rules: per task, expense, multiple income sources*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Errand | ₹150 | Distance +₹50 | Per task |
| Queue job | ₹200 per hour | — | Per hour |
| Delivery | ₹80 | — | Per trip |
| Home cleaning | Per hour ₹250 | — | Per hour, address |
| Furniture assembly | ₹500 | — | Per task, address |
| Photography gig | ₹1,500 | — | Per task, date |
| Tutoring | Per hour ₹400 | — | Per hour, online |
| Survey work | Per form ₹50 | — | Quantity, quick sale |
| Expense | Per day ₹200 | — | Expense, daily cash left |
| Weekly total | Per week ₹4,500 | — | Per day, quick sale |

### 168. Homestay host

*Rules: per night, date range, deposit, ID*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Room | Per night ₹2,500 | Extra guest +₹500 | Per night, date |
| Full home | Per night ₹6,000 | — | Per night, deposit |
| Breakfast | ₹150 | — | Quantity |
| Lunch | ₹250 | — | Quantity |
| Dinner | ₹300 | — | Quantity |
| Airport pickup | ₹800 | — | Per trip, date |
| Extra bed | ₹500 | — | Per night, quantity |
| Weekly stay | 7 nights ₹15,000 | — | Per night, date |
| Deposit | ₹2,000 | — | Deposit, ID |
| Cleaning fee | ₹300 | — | Quick sale |

### 169. Bike taxi rider

*Rules: per trip, fuel expense, daily cash left*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Short trip | Per km ₹8 | — | Per trip |
| Long trip | Per km ₹7 | — | Per trip |
| Minimum fare | ₹30 | — | Per trip |
| Parcel delivery | ₹50 | — | Per trip |
| Hourly hire | ₹150 per hour | — | Per hour |
| Monthly pass | ₹2,000 | — | Monthly, route |
| Night charge | 20% extra | — | Per trip |
| Waiting charge | Per 10 min ₹10 | — | Per trip |
| Fuel expense | Per day ₹120 | — | Expense, daily cash left |
| Daily cash left | Per day ₹600 | — | Daily cash left |

### 170. Newspaper delivery

*Rules: monthly card, route, attendance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Monthly delivery | ₹300 | — | Monthly, route |
| Magazine | Monthly ₹150 | — | Monthly, route |
| Sunday special | ₹20 | — | Per day, route |
| Extra copy | ₹10 | — | Quantity |
| New connection | ₹50 | — | Advance, route |
| Route change | ₹0 | — | Route, attendance |
| Holiday pause | ₹0 | — | Attendance, route |
| Collection | Monthly ₹300 | — | Monthly, credit |
| Morning shift | 5 am to 7 am | — | Slot, attendance |
| Annual card | ₹3,300 | — | Annual, route |

### 171. Tour guide

*Rules: date, slot, group size, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Half-day tour | ₹2,500 | — | Date, slot, group size |
| Full-day tour | ₹4,500 | — | Date, slot, group size |
| Heritage walk | Per person ₹500 | — | Date, quantity |
| Food walk | Per person ₹1,200 | — | Date, quantity |
| Airport pickup | ₹800 | — | Date, per trip |
| Group tour | 10 people ₹12,000 | Extra person +₹800 | Group size, date |
| Custom itinerary | ₹1,500 | — | Custom text, date |
| Translation | Per day ₹3,000 | — | Date, slot |
| Ticket booking | ₹100 | — | Quick sale |
| Travel expense | Per day ₹500 | — | Expense, date |

## N. Agriculture and rural

**Pack:** Grocery · **Tab noun:** Items · **Unit:** kg, quintal, acre

### 172. Farmer (direct produce)

*Rules: quantity, daily price, delivery, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tomato | Per kg ₹40 | Grade A +₹10 | Quantity, daily price |
| Wheat | Per kg ₹30 | — | Quantity, wholesale |
| Seasonal box | Small ₹300 · Large ₹500 | — | Quantity, delivery |
| Onion | Per kg ₹35 | — | Quantity, daily price |
| Potato | Per kg ₹28 | — | Quantity, daily price |
| Rice | Per kg ₹45 | — | Quantity, wholesale |
| Green chilli | Per kg ₹60 | — | Quantity, daily price |
| Brinjal | Per kg ₹40 | — | Quantity, daily price |
| Bulk order | Per quintal ₹3,800 | Delivery +₹200 | Quantity, wholesale |
| Farm visit | Per person ₹200 | — | Date, quantity |

### 173. Dairy farmer

*Rules: quantity, route, monthly bill*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Milk | Per litre ₹55 | Cow +₹10 · Buffalo +₹5 | Quantity, route |
| Cow sale | ₹35,000 | — | Advance |
| Manure | Per kg ₹5 | — | Quantity |
| Curd | Per kg ₹80 | — | Quantity, route |
| Ghee | Per litre ₹700 | — | Quantity, stock |
| Paneer | Per kg ₹400 | — | Quantity, route |
| Cow rental | Per day ₹500 | — | Per day, advance |
| Monthly milk pass | 30 litres ₹1,500 | — | Monthly, route |
| Calf sale | ₹12,000 | — | Advance |
| Farm supply | Monthly ₹8,000 | Credit +₹0 | Monthly, credit |

### 174. Poultry farm

*Rules: quantity, daily price, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Broiler | Per kg ₹110 | Live +₹0 · Dressed +₹15 | Quantity, daily price |
| Eggs | Tray of 30 ₹180 | — | Quantity, stock |
| Chicks | Per piece ₹35 | — | Quantity |
| Country chicken | Per kg ₹280 | — | Quantity, daily price |
| Layer chicken | Per piece ₹350 | — | Quantity, stock |
| Feed | Per kg ₹45 | — | Quantity, stock |
| Chicken manure | Per kg ₹8 | — | Quantity |
| Bulk order | 50 kg ₹5,000 | Delivery +₹200 | Quantity, wholesale |
| Monthly supply | 500 kg ₹52,000 | Credit +₹0 | Monthly, credit |
| Farm visit | Per person ₹150 | — | Date, quantity |

### 175. Goat and sheep farm

*Rules: quantity, festival booking, advance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Goat | Live ₹12,000 | — | Advance, festival |
| Mutton | Per kg ₹750 | — | Quantity |
| Breeding pair | ₹18,000 | — | Advance |
| Sheep | Live ₹9,000 | — | Advance, festival |
| Lamb | Live ₹6,000 | — | Advance |
| Goat milk | Per litre ₹150 | — | Quantity, route |
| Manure | Per kg ₹6 | — | Quantity |
| Festival booking | Per goat ₹13,000 | — | Advance, festival |
| Bulk mutton | 10 kg ₹7,000 | — | Quantity, advance |
| Farm visit | Per person ₹200 | — | Date, quantity |

### 176. Beekeeping and honey

*Rules: quantity, courier, batch*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Honey | 250 g ₹250 · 500 g ₹450 · 1 kg ₹850 | — | Quantity, courier |
| Bee box | ₹6,000 | — | Stock, delivery |
| Pollination service | Per acre ₹1,500 | — | Quantity, date |
| Comb honey | 250 g ₹400 | — | Quantity, courier |
| Beeswax | 250 g ₹300 | — | Quantity, courier |
| Propolis | 30 ml ₹450 | — | Quantity, courier |
| Bee colony | ₹4,500 | — | Stock, delivery |
| Hive tool | ₹350 | — | Stock, quick sale |
| Bulk order | 10 kg ₹7,500 | — | Quantity, courier |
| Farm visit | Per person ₹250 | — | Date, quantity |

### 177. Tractor and harvester rental

*Rules: per hour, fuel expense, operator*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Hourly hire | Per hour ₹1,200 | Operator +₹300 | Per hour |
| Daily hire | Per day ₹8,000 | — | Per day |
| Harvester | Per acre ₹1,800 | — | Quantity |
| Ploughing | Per acre ₹1,500 | — | Quantity |
| Rotavator | Per acre ₹1,200 | — | Quantity |
| Trailer | Per trip ₹2,000 | — | Per trip |
| Fuel expense | Per hour ₹300 | — | Expense, per hour |
| Operator | Per day ₹600 | — | Expense, per day |
| Seasonal contract | Per acre ₹1,400 | — | Quantity, advance |
| Transport charge | Per km ₹40 | — | Route, expense |

### 178. Floriculture

*Rules: daily price, quantity, delivery, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Marigold | Per kg ₹120 | — | Daily price, quantity |
| Rose | 100 stems ₹600 | — | Daily price, quantity |
| Jasmine | Per kg ₹800 | — | Daily price, quantity |
| Chrysanthemum | Per kg ₹200 | — | Daily price, quantity |
| Lotus | Per piece ₹30 | — | Daily price, quantity |
| Garland | Per piece ₹150 | — | Daily price, delivery |
| Pooja flowers | Pack ₹50 | — | Quantity, quick sale |
| Wedding bulk | 20 kg ₹8,000 | — | Advance, date |
| Festival order | 10 kg ₹2,500 | — | Festival, advance |
| Delivery | Per trip ₹200 | — | Route, delivery |

### 179. Mushroom grower

*Rules: quantity, daily stock, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Oyster mushroom | 200 g ₹80 · 500 g ₹180 | — | Daily stock, quantity |
| Button mushroom | 200 g ₹120 · 500 g ₹280 | — | Daily stock, quantity |
| Millet mushroom | 200 g ₹100 | — | Daily stock |
| Dry mushroom | 100 g ₹250 | — | Stock, courier |
| Spawn packet | ₹80 | — | Stock, quantity |
| Grow kit | ₹350 | — | Stock, delivery |
| Bulk order | 10 kg ₹3,200 | — | Quantity, delivery |
| Restaurant supply | Daily 5 kg ₹1,600 | Credit +₹0 | Daily, credit |
| Training | Per person ₹1,500 | — | Date, advance |
| Farm visit | Per person ₹200 | — | Date, quantity |

## O. Pets and plants

**Pack:** Pets and other · **Tab noun:** Items · **Unit:** visit, kg, piece

### 180. Pet grooming

*Rules: slot, pet note, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Bath | Small ₹700 · Medium ₹900 · Large ₹1,200 | — | Slot, pet note |
| Full groom | Small ₹1,400 · Medium ₹1,800 · Large ₹2,300 | Nail trim +₹350 · Ear clean +₹200 | Slot, photo |
| Nail trim | ₹350 | — | Quick sale |
| Haircut | Small ₹800 · Large ₹1,200 | — | Slot, pet note |
| Ear cleaning | ₹200 | — | Quick sale |
| Teeth cleaning | ₹400 | — | Slot, pet note |
| Tick treatment | ₹500 | — | Slot, pet note |
| De-shedding | ₹600 | — | Slot, pet note |
| Spa package | ₹2,500 | — | Slot, package |
| Pickup and drop | ₹300 | — | Pickup, route |

### 181. Pet boarding

*Rules: per day, date range, vaccination note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Per day | Small ₹600 · Large ₹900 | Food included +₹150 | Per day, date |
| Weekly stay | ₹4,000 | — | Per day, date |
| Day care | ₹400 | — | Per day |
| Cat boarding | Per day ₹500 | — | Per day, date |
| Medical boarding | Per day ₹1,200 | — | Per day, vaccination note |
| Food pack | Per day ₹100 | — | Quantity, stock |
| Pickup and drop | ₹500 | — | Pickup, route |
| Grooming add-on | ₹700 | — | Slot, quick sale |
| Monthly stay | ₹12,000 | — | Monthly, date |
| Vaccination check | ₹0 | — | Vaccination note, quick sale |

### 182. Dog trainer

*Rules: course, slot, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Basic course | ₹8,000 | — | Course, slot |
| Advanced course | ₹12,000 | — | Course, slot |
| Single session | ₹1,000 | Home +₹300 | Slot, package |
| Puppy training | ₹6,000 | — | Course, slot |
| Behaviour correction | ₹10,000 | — | Course, package |
| Guard dog training | ₹25,000 | — | Course, advance |
| Board and train | Monthly ₹30,000 | — | Monthly, date |
| Group class | Per session ₹500 | — | Slot, attendance |
| Home visit | ₹1,500 | — | Address, slot |
| Ten-session pack | ₹8,500 | — | Package, expiry |

### 183. Aquarium and fish shop

*Rules: stock, live guarantee*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Fighter fish | ₹150 | — | Stock |
| Tank | 1 ft ₹1,200 · 2 ft ₹2,500 | — | Stock, delivery |
| Fish food | 100 g ₹90 | — | Stock |
| Goldfish | ₹80 | — | Stock, live guarantee |
| Guppy | Pair ₹60 | — | Stock, live guarantee |
| Filter | ₹450 | — | Stock, warranty |
| Air pump | ₹350 | — | Stock, warranty |
| Aquarium light | ₹500 | — | Stock, warranty |
| Plant | ₹120 | — | Stock |
| Setup service | ₹1,500 | — | Address, slot |

### 184. Plant nursery

*Rules: stock, delivery, care note*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Areca palm | ₹250 | Pot +₹220 | Stock |
| Compost | 5 kg ₹180 | — | Quantity |
| Pot | 8 inch ₹220 | — | Stock |
| Money plant | ₹120 | — | Stock |
| Snake plant | ₹180 | — | Stock |
| Rose plant | ₹150 | — | Stock |
| Fruit sapling | ₹200 | — | Stock, season |
| Soil mix | 5 kg ₹150 | — | Quantity |
| Fertiliser | 1 kg ₹120 | — | Quantity, stock |
| Garden setup | ₹3,000 | — | Address, site visit |

### 185. Landscaping

*Rules: quantity, site visit, maintenance*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Terrace garden | Per sqft ₹80 | — | Quantity, site visit |
| Maintenance | Monthly ₹3,000 | — | Monthly, attendance |
| Plant supply | Per plant ₹150 | — | Stock, quantity |
| Lawn setup | Per sqft ₹45 | — | Quantity, site visit |
| Vertical garden | Per sqft ₹250 | — | Quantity, site visit |
| Fountain | ₹15,000 | — | Site visit, advance |
| Pathway | Per sqft ₹120 | — | Quantity, site visit |
| Lighting | Per point ₹800 | — | Quantity, site visit |
| Design fee | ₹5,000 | — | Site visit, advance |
| Irrigation setup | Per sqft ₹35 | — | Quantity, site visit |

### 186. Vet clinic (non-surgical)

*Rules: slot, follow-up, vaccination card*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Consultation | ₹500 | — | Slot, follow-up |
| Vaccination | ₹800 | — | Slot, vaccination card |
| Deworming | ₹300 | — | Slot, follow-up |
| Health check | ₹700 | — | Slot, follow-up |
| Blood test | ₹900 | — | Slot, follow-up |
| Skin treatment | ₹1,200 | — | Slot, follow-up |
| Ear treatment | ₹600 | — | Slot, follow-up |
| Wound dressing | ₹500 | — | Slot, follow-up |
| Home visit | ₹1,500 | — | Address, slot |
| Vaccination card | ₹100 | — | Vaccination card, quick sale |

### 187. Pet walking

*Rules: slot, pet note, route, package*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| 30-minute walk | ₹200 | — | Slot, route |
| 60-minute walk | ₹350 | — | Slot, route |
| Monthly pass | 20 walks ₹3,500 | — | Monthly, route |
| Group walk | ₹150 | — | Slot, route |
| Puppy visit | ₹250 | — | Slot, pet note |
| Feeding visit | ₹200 | — | Slot, pet note |
| Overnight care | ₹1,200 | — | Slot, privacy |
| Two pets | ₹300 | — | Quantity, slot |
| Weekend walk | ₹250 | — | Slot, route |
| Ten-walk pack | ₹1,800 | — | Package, expiry |

### 188. Aquarium maintenance

*Rules: address, slot, monthly plan, stock*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Tank cleaning | ₹600 | — | Address, slot |
| Water change | ₹400 | — | Address, slot |
| Monthly maintenance | ₹1,500 | — | Monthly, address |
| Filter cleaning | ₹250 | — | Address, slot |
| Algae removal | ₹350 | — | Address, slot |
| Fish health check | ₹300 | — | Address, slot |
| Tank setup | ₹3,000 | — | Address, slot |
| Plant trimming | ₹200 | — | Address, slot |
| Emergency visit | ₹800 | — | Address, quick sale |
| Annual plan | ₹15,000 | — | Annual, address |

## P. Print, craft and making

**Pack:** None today. Closest is Freelance for services and Pets and other for goods. See [coverage gaps](#coverage-gaps). **Unit:** piece, sqft

### 189. Printing press

*Rules: quantity, proof, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Visiting card | 100 ₹300 · 500 ₹1,200 | — | Quantity, proof |
| Letterhead | 500 ₹1,500 | — | Quantity, proof |
| Bill book | 100 ₹600 | — | Quantity, custom text |
| Brochure | 100 ₹2,500 | — | Quantity, proof |
| Pamphlet | 500 ₹800 | — | Quantity, proof |
| Envelope | 500 ₹1,200 | — | Quantity, proof |
| ID card | 50 ₹600 | — | Quantity, custom text |
| Sticker | 100 ₹400 | — | Quantity, proof |
| Wedding card | 100 ₹3,500 | — | Quantity, custom text |
| Bulk order | 1,000 pieces ₹5,000 | — | Quantity, delivery |

### 190. Flex and banner printing

*Rules: quantity, design, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Flex banner | Per sqft ₹25 | Eyelets +₹100 | Quantity, design |
| Standee | ₹1,200 | — | Quantity, design |
| Backdrop | Per sqft ₹35 | — | Quantity, design |
| Vinyl print | Per sqft ₹40 | — | Quantity, design |
| Canvas print | Per sqft ₹80 | — | Quantity, design |
| Cut-out standee | ₹2,500 | — | Quantity, design |
| Wall graphic | Per sqft ₹60 | — | Quantity, installation |
| Poster | Per piece ₹150 | — | Quantity, design |
| Signage board | Per sqft ₹450 | — | Quantity, design |
| Installation | Per visit ₹500 | — | Address, slot |

### 191. T-shirt printing

*Rules: bulk tiers, size mix, date*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| T-shirt | 1 to 9 ₹350 · 10 or more ₹280 | Back print +₹50 | Quantity, size mix |
| Hoodie | 1 to 9 ₹850 · 10 or more ₹750 | — | Quantity, size mix |
| Cap | ₹250 | — | Quantity |
| Polo t-shirt | 1 to 9 ₹450 · 10 or more ₹380 | — | Quantity, size mix |
| Couple set | ₹800 | — | Quantity, size mix |
| Kids t-shirt | ₹250 | — | Quantity, size mix |
| Tote bag | ₹200 | — | Quantity |
| Apron | ₹350 | — | Quantity |
| Corporate order | 50 pieces ₹12,000 | — | Quantity, advance |
| Design fee | ₹500 | — | Custom text, proof |

### 192. Photo studio

*Rules: quick sale, print quantity*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Passport photo | 8 copies ₹80 | — | Quick sale |
| Photo frame | ₹250 | — | Stock |
| Photo print | Per print ₹20 | — | Quantity |
| Studio portrait | ₹1,500 | — | Slot, delivery |
| Lamination | Per page ₹30 | — | Quantity, quick sale |
| Photo album | ₹1,200 | — | Quantity, delivery |
| ID card print | ₹50 | — | Quick sale |
| Canvas print | Per sqft ₹300 | — | Quantity, delivery |
| Photo restoration | ₹500 | — | Photo, delivery |
| Same-day print | Per print ₹30 | — | Quick sale |

### 193. Candle maker

*Rules: stock, courier, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Jar candle | ₹380 | Scent +₹50 | Stock, courier |
| Wax melts | Pack of 6 ₹220 | — | Stock, courier |
| Gift box | ₹850 | — | Quantity, festival |
| Pillar candle | ₹250 | — | Stock, courier |
| Tea light | Pack of 12 ₹180 | — | Stock, courier |
| Custom candle | ₹450 | Custom text +₹80 | Custom text, courier |
| Birthday candle | ₹120 | — | Stock, quick sale |
| Diwali set | ₹650 | — | Festival, stock |
| Wedding favour | 50 pieces ₹5,000 | Custom label +₹500 | Quantity, advance |
| Bulk order | 100 pieces ₹8,000 | — | Quantity, courier |

### 194. Resin and jewellery maker

*Rules: custom text, courier, photo*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Jhumka | ₹280 | Custom name +₹50 | Custom text, courier |
| Pendant | ₹350 | — | Photo, courier |
| Bracelet | ₹160 | — | Stock, courier |
| Keychain | ₹120 | Custom name +₹40 | Custom text, courier |
| Earrings | ₹220 | — | Stock, courier |
| Photo frame | ₹450 | Photo +₹100 | Photo, courier |
| Coaster set | ₹400 | — | Stock, courier |
| Bookmark | ₹90 | — | Stock, courier |
| Gift hamper | ₹950 | Custom box +₹100 | Gift box, courier |
| Bulk order | 50 pieces ₹6,000 | — | Quantity, courier |

### 195. Handloom weaver

*Rules: quantity, courier, wholesale*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Saree | ₹3,500 | — | Quantity, courier |
| Stole | ₹800 | — | Quantity, courier |
| Fabric | Per metre ₹450 | — | Quantity, wholesale |
| Dupatta | ₹650 | — | Quantity, courier |
| Shawl | ₹1,200 | — | Quantity, courier |
| Table runner | ₹400 | — | Quantity, courier |
| Cushion cover | ₹250 | — | Quantity, courier |
| Bed sheet | ₹1,800 | — | Quantity, courier |
| Bulk order | 20 pieces ₹30,000 | — | Quantity, wholesale |
| Custom weave | Per metre ₹600 | — | Custom text, advance |

### 196. Idol maker

*Rules: date, advance, delivery, breakage*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Ganesh idol | 12 inch ₹2,500 · 24 inch ₹8,000 | — | Date, advance |
| Fibre idol | ₹8,000 | — | Date, delivery |
| Eco idol | ₹1,800 | — | Date, stock |
| Durga idol | 24 inch ₹12,000 | — | Date, advance |
| Lakshmi idol | 12 inch ₹3,000 | — | Date, advance |
| Clay idol | 8 inch ₹1,200 | — | Stock, festival |
| Custom idol | ₹15,000 | — | Photo reference, advance |
| Decoration | ₹2,000 | — | Date, setup |
| Delivery | Per km ₹30 | — | Delivery, breakage |
| Bulk order | 10 pieces ₹15,000 | — | Quantity, advance |

### 197. Flower shop

*Rules: daily price, delivery, festival*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Garland | ₹150 | — | Daily price |
| Bouquet | ₹350 | — | Stock, delivery |
| Car decor | ₹1,800 | — | Date, delivery |
| Rose bouquet | 10 stems ₹500 | — | Daily price, delivery |
| Wedding decor | ₹15,000 | — | Date, advance |
| Pooja flowers | Pack ₹80 | — | Daily price, quick sale |
| Flower basket | ₹1,200 | — | Date, delivery |
| Petals | Per kg ₹400 | — | Daily price, quantity |
| Subscription | Weekly ₹600 | — | Route, weekly |
| Event flowers | Per event ₹8,000 | — | Date, advance |

### 198. Laser engraving

*Rules: custom text, quantity, delivery*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Name plate | ₹450 | — | Custom text, delivery |
| Wooden plaque | ₹600 | — | Custom text, delivery |
| Metal tag | ₹150 | — | Custom text, quantity |
| Keychain | ₹100 | Custom name +₹30 | Custom text, quantity |
| Trophy | ₹800 | — | Custom text, delivery |
| Phone cover | ₹350 | — | Custom text, delivery |
| Glass engraving | ₹500 | — | Custom text, delivery |
| Corporate gift | ₹1,200 | Logo +₹200 | Custom text, quantity |
| Bulk order | 50 pieces ₹7,500 | — | Quantity, advance |
| Design fee | ₹300 | — | Custom text, proof |

### 199. Pottery and ceramics

*Rules: stock, courier, breakage, custom text*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Mug | ₹350 | Custom text +₹80 | Custom text, courier |
| Planter | ₹450 | — | Stock, courier |
| Dinner set | ₹2,500 | — | Stock, courier, breakage |
| Bowl | ₹250 | — | Stock, courier |
| Vase | ₹600 | — | Stock, courier |
| Tea set | ₹1,500 | — | Stock, courier, breakage |
| Wall plate | ₹800 | — | Stock, courier |
| Workshop | Per person ₹1,200 | — | Date, advance |
| Custom order | ₹900 | — | Custom text, advance |
| Bulk order | 25 pieces ₹10,000 | — | Quantity, courier |

### 200. Soap and skincare maker

*Rules: stock, courier, batch, shelf life*

| Item | Variant | Sub Variant | What it should handle |
|---|---|---|---|
| Handmade soap | Single ₹150 · Pack of 3 ₹400 | — | Stock, courier |
| Body butter | 100 g ₹350 | — | Stock, shelf life |
| Lip balm | ₹120 | — | Stock, courier |
| Face pack | 50 g ₹250 | — | Stock, shelf life |
| Bath salt | 250 g ₹200 | — | Stock, courier |
| Gift set | ₹750 | Custom box +₹100 | Gift box, courier |
| Shampoo bar | ₹220 | — | Stock, courier |
| Serum | 30 ml ₹450 | — | Stock, shelf life |
| Bulk order | 50 pieces ₹6,000 | — | Quantity, courier |
| Custom label | ₹0 | Custom text +₹50 | Custom text, batch |

## Coverage gaps

Three domains have no pack. The twelve packs cover 164 of the 200 businesses.

| Domain | Rows | Closest pack today | Problem |
|---|---|---|---|
| Retail and trading | 148–159 | Grocery, noun Items | Grocery implies food. An electronics or jewellery shop is not a kirana. |
| Transport and gig work | 160–171 | None | A rider, driver, or homestay host has no catalog. The unit is a trip, shift, or night. |
| Print, craft and making | 189–200 | Freelance for services, Pets and other for goods | Two workflows in one row set: a print shop quotes a job, a craft maker holds stock. |

Agriculture fits Grocery. It sells by weight and price changes daily, which the
Grocery pack already handles.

### Pack proposals

| Gap | Proposal | Noun | Why |
|---|---|---|---|
| Retail | Widen Grocery into **Grocery and retail** | Items | Same flow: stock, quantity, price, delivery. Only the starter items differ. |
| Transport and gig | New pack **Rides and errands** | Trips | The catalog is a rate card of trips, not items. The bill is a trip receipt. |
| Print and craft | Split: print shops join **Freelance**, craft makers join **Pets and other** | Services / Items | A print shop sells a quoted job. A candle maker sells stock. |

The transport gap matters most. It is twelve of the 200 rows, and it includes the
gig worker and the delivery rider from the brief.

### Primitive gaps

Most of the fourth-column rules already exist as a primitive. Two do not.

| Rule | Rows | Gap |
|---|---|---|
| Bulk tiers | 191 | A quantity price break, for example 350 per piece, 280 at 10 or more. A variant sets one price. It cannot set a tier. |
| Queue | 51 | A walk-in queue for a barber. Time slots cover appointments, not a waiting line. |

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
   infer the row's pack. A classifier that passes 200 businesses is good enough
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
