import type { StarterItem } from "@/lib/packs";

/**
 * Development-only seed data.
 *
 * These accounts and shops exist to exercise every category pack. They are
 * never created in production: `db/dev/guard.ts` refuses to run against a
 * production environment or a non-local database.
 */

export const DEV_SEED_PASSWORD =
  process.env.DEV_SEED_PASSWORD?.trim() || "StartLite!Dev2026";

export type DevBusinessSeed = {
  handle: string;
  businessName: string;
  pack: string;
  category: string;
  locality: string;
  tagline: string;
  ownerName: string;
  email: string;
  /** One extra item that makes this shop feel like its trade. */
  customItem: StarterItem;
};

export type PackSeedProfile = {
  /** Two labels for the first variant of an item, for example 500 g / 1 kg. */
  variants: [string, string];
  extra: { name: string; priceDelta: string };
  /** A second option group on the first item, so combinations are exercisable. */
  optionGroup: { label: string; choices: [string, string] };
  /** An extra that only appears under one variant — a sub-variant. */
  subVariant: {
    parentVariant: string;
    name: string;
    priceDelta: string;
  };
  /** More selectable extras on the first item. */
  extras: Array<{ name: string; priceDelta: string }>;
  /** Two more catalogue items: one with variants, one a plain single item. */
  extraItems: [StarterItem, StarterItem];
  /** Realistic expense titles, `Paid to — Paid for`. */
  expenses: string[];
  /** Identification labels shown beside a customer name. */
  customerNotes: string[];
  deliveryNote: string;
};

export const PACK_SEED_PROFILES: Record<string, PackSeedProfile> = {
  food: {
    variants: ["Half", "Full"],
    extra: { name: "Extra roti", priceDelta: "20.00" },
    optionGroup: { label: "Spice", choices: ["Mild", "Extra spicy"] },
    subVariant: { parentVariant: "Full", name: "Extra gravy", priceDelta: "30.00" },
    extras: [
      { name: "Pickle", priceDelta: "10.00" },
      { name: "Papad", priceDelta: "15.00" },
    ],
    extraItems: [
      { name: "Veg thali", price: "120.00", unit: "plate" },
      { name: "Masala chai", price: "20.00", unit: "cup" },
    ],
    expenses: [
      "Vegetable market — vegetables",
      "Gas cylinder — refill",
      "Delivery auto — lunch run",
    ],
    customerNotes: ["Office lunch for 12", "No onion, no garlic"],
    deliveryNote: "Delivery address or tiffin note",
  },
  bakery: {
    variants: ["500 g", "1 kg"],
    extra: { name: "Eggless", priceDelta: "50.00" },
    optionGroup: { label: "Finish", choices: ["Plain", "Buttercream"] },
    subVariant: { parentVariant: "1 kg", name: "Wax flowers", priceDelta: "180.00" },
    extras: [
      { name: "Gift box", priceDelta: "40.00" },
      { name: "Candle set", priceDelta: "25.00" },
    ],
    extraItems: [
      { name: "Chocolate brownie", price: "140.00", unit: "piece" },
      { name: "Tea cake", price: "60.00", unit: "slice" },
    ],
    expenses: [
      "Flour mill — flour",
      "Dairy — butter and cream",
      "Packaging shop — boxes",
    ],
    customerNotes: ["Birthday order", "Eggless only"],
    deliveryNote: "Message on cake, delivery area",
  },
  grocery: {
    variants: ["500 g", "1 kg"],
    extra: { name: "Home delivery", priceDelta: "30.00" },
    optionGroup: { label: "Quality", choices: ["Regular", "Premium"] },
    subVariant: { parentVariant: "1 kg", name: "Organic", priceDelta: "45.00" },
    extras: [
      { name: "Carry bag", priceDelta: "5.00" },
      { name: "Express delivery", priceDelta: "60.00" },
    ],
    extraItems: [
      { name: "Toor dal 1 kg", price: "170.00", unit: "packet" },
      { name: "Cooking oil 1 L", price: "140.00", unit: "bottle" },
    ],
    expenses: [
      "Wholesale market — stock",
      "Tempo — delivery",
      "Shop rent — November",
    ],
    customerNotes: ["Monthly ration", "Deliver after 6 pm"],
    deliveryNote: "Delivery address",
  },
  tailoring: {
    variants: ["Standard", "Express"],
    extra: { name: "Home pickup", priceDelta: "100.00" },
    optionGroup: { label: "Fit", choices: ["Regular", "Slim"] },
    subVariant: { parentVariant: "Express", name: "Steaming", priceDelta: "80.00" },
    extras: [
      { name: "Lining", priceDelta: "250.00" },
      { name: "Button set", priceDelta: "60.00" },
    ],
    extraItems: [
      { name: "Shirt stitch", price: "450.00", unit: "piece" },
      { name: "Trouser hem", price: "120.00", unit: "piece" },
    ],
    expenses: [
      "Fabric shop — cloth",
      "Thread and buttons — supplies",
      "Courier — delivery",
    ],
    customerNotes: ["Measurements on file", "Wedding order"],
    deliveryNote: "Measurements, delivery date",
  },
  salon: {
    variants: ["Basic", "Premium"],
    extra: { name: "Head massage", priceDelta: "150.00" },
    optionGroup: { label: "Stylist", choices: ["Junior", "Senior"] },
    subVariant: { parentVariant: "Premium", name: "Hot towel", priceDelta: "90.00" },
    extras: [
      { name: "Hair wash", priceDelta: "120.00" },
      { name: "Serum", priceDelta: "200.00" },
    ],
    extraItems: [
      { name: "Haircut", price: "250.00", unit: "visit" },
      { name: "Threading", price: "60.00", unit: "visit" },
    ],
    expenses: [
      "Beauty supplier — products",
      "Salon rent — November",
      "Electricity — shop",
    ],
    customerNotes: ["Prefers morning slot", "Regular customer"],
    deliveryNote: "Preferred time, home service",
  },
  tutoring: {
    variants: ["Group", "One to one"],
    extra: { name: "Study material", priceDelta: "200.00" },
    optionGroup: { label: "Board", choices: ["CBSE", "ICSE"] },
    subVariant: { parentVariant: "One to one", name: "Doubt session", priceDelta: "300.00" },
    extras: [
      { name: "Weekly test", priceDelta: "150.00" },
      { name: "Home visit", priceDelta: "400.00" },
    ],
    extraItems: [
      { name: "Chemistry tuition", price: "1500.00", unit: "month" },
      { name: "Maths crash course", price: "2500.00", unit: "course" },
    ],
    expenses: [
      "Book shop — workbooks",
      "Print shop — test papers",
      "Tea stall — class break",
    ],
    customerNotes: ["Class 10", "Weak in algebra"],
    deliveryNote: "Class, board, preferred slot",
  },
  repairs: {
    variants: ["Standard", "Same day"],
    extra: { name: "Pickup and drop", priceDelta: "100.00" },
    optionGroup: { label: "Service", choices: ["Repair", "Replacement"] },
    subVariant: { parentVariant: "Same day", name: "Priority bench", priceDelta: "250.00" },
    extras: [
      { name: "Screen guard", priceDelta: "150.00" },
      { name: "Protective case", priceDelta: "300.00" },
    ],
    extraItems: [
      { name: "Fan repair", price: "350.00", unit: "job" },
      { name: "Washing machine service", price: "700.00", unit: "job" },
    ],
    expenses: [
      "Spare parts — supplier",
      "Tools — purchase",
      "Transport — pickup",
    ],
    customerNotes: ["Phone screen", "Pickup from shop"],
    deliveryNote: "Device model, problem",
  },
  rentals: {
    variants: ["Half day", "Full day"],
    extra: { name: "Delivery and setup", priceDelta: "300.00" },
    optionGroup: { label: "Setup", choices: ["Basic", "Decorated"] },
    subVariant: { parentVariant: "Full day", name: "Late pickup", priceDelta: "500.00" },
    extras: [
      { name: "Extra chairs", priceDelta: "80.00" },
      { name: "Table cloth", priceDelta: "120.00" },
    ],
    extraItems: [
      { name: "Folding table", price: "300.00", unit: "day" },
      { name: "Plastic chair", price: "80.00", unit: "day" },
    ],
    expenses: [
      "Tent house — stock",
      "Transport — delivery",
      "Chair repair — maintenance",
    ],
    customerNotes: ["Wedding at home", "Society function"],
    deliveryNote: "Event date, venue, delivery",
  },
  freelance: {
    variants: ["Basic", "Standard"],
    extra: { name: "Extra revision", priceDelta: "500.00" },
    optionGroup: { label: "Format", choices: ["Digital", "Print ready"] },
    subVariant: { parentVariant: "Standard", name: "Source files", priceDelta: "1200.00" },
    extras: [
      { name: "Social crops", priceDelta: "800.00" },
      { name: "Brand guide", priceDelta: "1500.00" },
    ],
    extraItems: [
      { name: "Logo design", price: "3500.00", unit: "project" },
      { name: "Flyer design", price: "1200.00", unit: "project" },
    ],
    expenses: [
      "Software — subscription",
      "Internet — monthly",
      "Stock photos — licence",
    ],
    customerNotes: ["Logo and social kit", "Needs invoice"],
    deliveryNote: "Scope, deadline, brand notes",
  },
  home: {
    variants: ["Standard", "Deep"],
    extra: { name: "Consumables", priceDelta: "150.00" },
    optionGroup: { label: "Rooms", choices: ["2 BHK", "3 BHK"] },
    subVariant: { parentVariant: "Deep", name: "Balcony sweep", priceDelta: "250.00" },
    extras: [
      { name: "Window cleaning", priceDelta: "400.00" },
      { name: "Fridge cleaning", priceDelta: "350.00" },
    ],
    extraItems: [
      { name: "Kitchen deep clean", price: "1800.00", unit: "visit" },
      { name: "Bathroom clean", price: "600.00", unit: "visit" },
    ],
    expenses: [
      "Cleaning supplies — stock",
      "Transport — site visits",
      "Helper — daily wage",
    ],
    customerNotes: ["3 BHK deep clean", "Second floor"],
    deliveryNote: "Address, area, preferred slot",
  },
  wellness: {
    variants: ["Single", "Pack of 4"],
    extra: { name: "Diet chart", priceDelta: "300.00" },
    optionGroup: { label: "Batch", choices: ["Morning", "Evening"] },
    subVariant: { parentVariant: "Pack of 4", name: "Personal plan", priceDelta: "500.00" },
    extras: [
      { name: "Yoga mat", priceDelta: "450.00" },
      { name: "Breathing session", priceDelta: "200.00" },
    ],
    extraItems: [
      { name: "Personal training", price: "900.00", unit: "session" },
      { name: "Stretch class", price: "350.00", unit: "class" },
    ],
    expenses: [
      "Yoga mats — stock",
      "Studio rent — November",
      "Supplements — stock",
    ],
    customerNotes: ["Knee pain", "Morning batch"],
    deliveryNote: "Preferred slot, health note",
  },
  pets: {
    variants: ["Small", "Large"],
    extra: { name: "Nail trim", priceDelta: "100.00" },
    optionGroup: { label: "Coat", choices: ["Short", "Long"] },
    subVariant: { parentVariant: "Large", name: "De-shedding", priceDelta: "250.00" },
    extras: [
      { name: "Ear cleaning", priceDelta: "120.00" },
      { name: "Perfume spray", priceDelta: "180.00" },
    ],
    extraItems: [
      { name: "Dog bath", price: "400.00", unit: "visit" },
      { name: "Cat grooming", price: "500.00", unit: "visit" },
    ],
    expenses: [
      "Pet food — stock",
      "Grooming tools — supplies",
      "Vet — checkup",
    ],
    customerNotes: ["Golden retriever", "Two cats at home"],
    deliveryNote: "Pet, breed, delivery",
  },
};

/** Two brand colours per pack, used for seeded logos and item images. */
export const PACK_COLORS: Record<string, [string, string]> = {
  food: ["#0B6E62", "#E6F4F1"],
  bakery: ["#A85A08", "#FFF3E3"],
  grocery: ["#137A4B", "#E8F6EE"],
  tailoring: ["#6D3BA8", "#F1EAFB"],
  salon: ["#B03A73", "#FCE9F2"],
  tutoring: ["#2E5FA3", "#EAF1FB"],
  repairs: ["#C0392B", "#FDECEB"],
  rentals: ["#8A5A0B", "#FBF1DF"],
  freelance: ["#1F6F8B", "#E5F3F8"],
  home: ["#0E7C86", "#E4F4F6"],
  wellness: ["#3F7D3A", "#EAF5E8"],
  pets: ["#8A4B1E", "#FAEEE3"],
};

export const CUSTOMER_NAMES = [
  "Aarav Mehta",
  "Diya Sharma",
  "Rohan Gupta",
  "Meera Joshi",
  "Kabir Singh",
  "Ananya Rao",
  "Vivaan Patel",
  "Isha Nair",
  "Arjun Desai",
  "Saanvi Kulkarni",
  "Reyansh Verma",
  "Myra Iyer",
  "Aditya Menon",
  "Kiara Bose",
  "Dhruv Malhotra",
  "Anika Reddy",
  "Yash Chauhan",
  "Nisha Agarwal",
  "Ishaan Kapoor",
  "Tara Pillai",
  "Rudra Jain",
  "Pooja Shah",
  "Karan Bhatia",
  "Sneha Das",
  "Manav Ahuja",
  "Riya Saxena",
  "Nikhil Rane",
  "Aisha Khan",
  "Ved Mishra",
  "Zoya Sheikh",
];

export const DEV_BUSINESSES: DevBusinessSeed[] = [
  {
    handle: "tiffin-express",
    businessName: "Tiffin Express",
    pack: "food",
    category: "Home tiffin service",
    locality: "Kothrud, Pune",
    tagline: "Ghar ka khana, delivered on time.",
    ownerName: "Ravi Kulkarni",
    email: "food1@startlite.dev",
    customItem: { name: "Paneer thali", price: "160.00", unit: "plate" },
  },
  {
    handle: "annapurna-kitchen",
    businessName: "Annapurna Kitchen",
    pack: "food",
    category: "South Indian kitchen",
    locality: "Jayanagar, Bengaluru",
    tagline: "Fresh South Indian meals for the office.",
    ownerName: "Lakshmi Iyer",
    email: "food2@startlite.dev",
    customItem: { name: "Curd rice", price: "90.00", unit: "box" },
  },
  {
    handle: "sugar-and-spice",
    businessName: "Sugar & Spice Bakes",
    pack: "bakery",
    category: "Home bakery",
    locality: "Bandra, Mumbai",
    tagline: "Small-batch cakes and cookies.",
    ownerName: "Neha D'Souza",
    email: "bakery1@startlite.dev",
    customItem: { name: "Red velvet cake", price: "650.00", unit: "cake" },
  },
  {
    handle: "daily-bread-co",
    businessName: "Daily Bread Co.",
    pack: "bakery",
    category: "Bread and pastry",
    locality: "Satellite, Ahmedabad",
    tagline: "Sourdough and morning bread.",
    ownerName: "Arjun Patel",
    email: "bakery2@startlite.dev",
    customItem: { name: "Butter croissant", price: "90.00", unit: "piece" },
  },
  {
    handle: "sharma-kirana",
    businessName: "Sharma Kirana Store",
    pack: "grocery",
    category: "Kirana and daily needs",
    locality: "Lajpat Nagar, Delhi",
    tagline: "Everyday groceries at your door.",
    ownerName: "Vikram Sharma",
    email: "grocery1@startlite.dev",
    customItem: { name: "Basmati rice 5 kg", price: "550.00", unit: "bag" },
  },
  {
    handle: "green-basket",
    businessName: "Green Basket",
    pack: "grocery",
    category: "Fresh produce",
    locality: "Indiranagar, Bengaluru",
    tagline: "Fresh produce and pantry staples.",
    ownerName: "Priya Nair",
    email: "grocery2@startlite.dev",
    customItem: { name: "Organic eggs", price: "120.00", unit: "dozen" },
  },
  {
    handle: "stitch-and-style",
    businessName: "Stitch & Style",
    pack: "tailoring",
    category: "Ladies tailoring",
    locality: "Gomti Nagar, Lucknow",
    tagline: "Fitting first, fashion second.",
    ownerName: "Meena Verma",
    email: "tailoring1@startlite.dev",
    customItem: { name: "Lehenga alteration", price: "800.00", unit: "piece" },
  },
  {
    handle: "perfect-fit-tailors",
    businessName: "Perfect Fit Tailors",
    pack: "tailoring",
    category: "Tailoring and alterations",
    locality: "Arera Colony, Bhopal",
    tagline: "Alterations while you wait.",
    ownerName: "Salim Ansari",
    email: "tailoring2@startlite.dev",
    customItem: { name: "School uniform set", price: "600.00", unit: "set" },
  },
  {
    handle: "glow-salon",
    businessName: "Glow Salon",
    pack: "salon",
    category: "Beauty salon",
    locality: "Sector 18, Noida",
    tagline: "Hair, skin, and bridal looks.",
    ownerName: "Ritika Singh",
    email: "salon1@startlite.dev",
    customItem: { name: "Bridal makeup", price: "5000.00", unit: "visit" },
  },
  {
    handle: "cut-and-curl",
    businessName: "Cut & Curl",
    pack: "salon",
    category: "Unisex salon",
    locality: "Banjara Hills, Hyderabad",
    tagline: "Walk-in haircuts and grooming.",
    ownerName: "Farah Khan",
    email: "salon2@startlite.dev",
    customItem: { name: "Beard trim", price: "120.00", unit: "visit" },
  },
  {
    handle: "bright-minds-tuition",
    businessName: "Bright Minds Tuition",
    pack: "tutoring",
    category: "School tuition",
    locality: "Aundh, Pune",
    tagline: "Maths and science, class 8 to 12.",
    ownerName: "Suresh Rao",
    email: "tutoring1@startlite.dev",
    customItem: { name: "Physics tuition", price: "1800.00", unit: "month" },
  },
  {
    handle: "maths-with-meera",
    businessName: "Maths with Meera",
    pack: "tutoring",
    category: "Maths coaching",
    locality: "Adyar, Chennai",
    tagline: "Small batches, clear basics.",
    ownerName: "Meera Krishnan",
    email: "tutoring2@startlite.dev",
    customItem: { name: "Spoken English", price: "1200.00", unit: "month" },
  },
  {
    handle: "quickfix-repairs",
    businessName: "QuickFix Repairs",
    pack: "repairs",
    category: "Appliance repair",
    locality: "Andheri, Mumbai",
    tagline: "Phones, fans, and small appliances.",
    ownerName: "Imran Shaikh",
    email: "repairs1@startlite.dev",
    customItem: { name: "AC service", price: "600.00", unit: "job" },
  },
  {
    handle: "phone-doctor",
    businessName: "Phone Doctor",
    pack: "repairs",
    category: "Mobile repair",
    locality: "Kukatpally, Hyderabad",
    tagline: "Screen, battery, and software fixes.",
    ownerName: "Karthik Reddy",
    email: "repairs2@startlite.dev",
    customItem: { name: "Battery replacement", price: "900.00", unit: "job" },
  },
  {
    handle: "event-rentals",
    businessName: "Event Rentals",
    pack: "rentals",
    category: "Furniture and tent rental",
    locality: "Vaishali Nagar, Jaipur",
    tagline: "Chairs, tables, and tents for every function.",
    ownerName: "Deepak Jain",
    email: "rentals1@startlite.dev",
    customItem: { name: "Sound system", price: "2500.00", unit: "day" },
  },
  {
    handle: "party-needs",
    businessName: "Party Needs",
    pack: "rentals",
    category: "Event equipment rental",
    locality: "Salt Lake, Kolkata",
    tagline: "Sound, lights, and party setup.",
    ownerName: "Sneha Bose",
    email: "rentals2@startlite.dev",
    customItem: { name: "LED light set", price: "800.00", unit: "day" },
  },
  {
    handle: "design-desk",
    businessName: "Design Desk",
    pack: "freelance",
    category: "Graphic design",
    locality: "Remote, Bengaluru",
    tagline: "Logos, posts, and brand kits.",
    ownerName: "Ananya Ghosh",
    email: "freelance1@startlite.dev",
    customItem: { name: "Brand kit", price: "5000.00", unit: "project" },
  },
  {
    handle: "content-corner",
    businessName: "Content Corner",
    pack: "freelance",
    category: "Content writing",
    locality: "Remote, Kochi",
    tagline: "Words that sell, on time.",
    ownerName: "Rahul Menon",
    email: "freelance2@startlite.dev",
    customItem: { name: "Landing page copy", price: "8000.00", unit: "project" },
  },
  {
    handle: "sparkle-home-services",
    businessName: "Sparkle Home Services",
    pack: "home",
    category: "Home cleaning",
    locality: "Sector 56, Gurugram",
    tagline: "Deep cleaning and daily help.",
    ownerName: "Sunita Yadav",
    email: "home1@startlite.dev",
    customItem: { name: "Sofa cleaning", price: "1200.00", unit: "visit" },
  },
  {
    handle: "handy-help",
    businessName: "Handy Help",
    pack: "home",
    category: "Home repairs",
    locality: "Kankarbagh, Patna",
    tagline: "Plumbing, electrical, and repairs.",
    ownerName: "Manoj Kumar",
    email: "home2@startlite.dev",
    customItem: { name: "Bathroom deep clean", price: "900.00", unit: "visit" },
  },
  {
    handle: "calm-yoga",
    businessName: "Calm Yoga Studio",
    pack: "wellness",
    category: "Yoga studio",
    locality: "Baner, Pune",
    tagline: "Small yoga batches and diet plans.",
    ownerName: "Aarti Deshpande",
    email: "wellness1@startlite.dev",
    customItem: { name: "Nutrition consult", price: "700.00", unit: "session" },
  },
  {
    handle: "fit-with-priya",
    businessName: "Fit with Priya",
    pack: "wellness",
    category: "Fitness coaching",
    locality: "Vasant Kunj, Delhi",
    tagline: "Strength, mobility, and nutrition.",
    ownerName: "Priya Malhotra",
    email: "wellness2@startlite.dev",
    customItem: { name: "Physiotherapy", price: "500.00", unit: "session" },
  },
  {
    handle: "paws-and-care",
    businessName: "Paws & Care",
    pack: "pets",
    category: "Pet grooming",
    locality: "Sector 22, Chandigarh",
    tagline: "Grooming, walking, and pet food.",
    ownerName: "Rohit Bansal",
    email: "pets1@startlite.dev",
    customItem: { name: "Pet grooming", price: "800.00", unit: "visit" },
  },
  {
    handle: "pet-pantry",
    businessName: "Pet Pantry",
    pack: "pets",
    category: "Pet supplies",
    locality: "Gomti Nagar, Lucknow",
    tagline: "Food and everyday pet supplies.",
    ownerName: "Nisha Agarwal",
    email: "pets2@startlite.dev",
    customItem: { name: "Dog walking pack", price: "1200.00", unit: "week" },
  },
];

/* ------------------------------------------------------------------ */
/* Account and address helpers                                         */
/* ------------------------------------------------------------------ */

const BANK_PROFILES = [
  { upi: "okhdfcbank", ifsc: "HDFC0001234" },
  { upi: "okaxis", ifsc: "UTIB0001122" },
  { upi: "oksbi", ifsc: "SBIN0001234" },
  { upi: "okicici", ifsc: "ICIC0001234" },
] as const;

const MOBILE_PREFIXES = ["98765", "90000", "98123", "99001", "96321"];

/** City facts used for customer addresses and storefront locale. */
export const CITY_DETAILS: Record<
  string,
  { state: string; pincode: string; locale: string }
> = {
  Pune: { state: "Maharashtra", pincode: "411038", locale: "mr" },
  Bengaluru: { state: "Karnataka", pincode: "560011", locale: "en" },
  Mumbai: { state: "Maharashtra", pincode: "400050", locale: "en" },
  Ahmedabad: { state: "Gujarat", pincode: "380015", locale: "gu" },
  Delhi: { state: "Delhi", pincode: "110024", locale: "hi-Latn" },
  Lucknow: { state: "Uttar Pradesh", pincode: "226010", locale: "hi" },
  Bhopal: { state: "Madhya Pradesh", pincode: "462003", locale: "hi" },
  Noida: { state: "Uttar Pradesh", pincode: "201301", locale: "hi-Latn" },
  Hyderabad: { state: "Telangana", pincode: "500034", locale: "en" },
  Chennai: { state: "Tamil Nadu", pincode: "600040", locale: "ta" },
  Jaipur: { state: "Rajasthan", pincode: "302017", locale: "hi" },
  Kolkata: { state: "West Bengal", pincode: "700064", locale: "en" },
  Gurugram: { state: "Haryana", pincode: "122009", locale: "hi-Latn" },
  Patna: { state: "Bihar", pincode: "800001", locale: "hi" },
  Chandigarh: { state: "Chandigarh", pincode: "160022", locale: "hi" },
  Kochi: { state: "Kerala", pincode: "682016", locale: "en" },
};

export function cityDetails(locality: string) {
  const city = locality.split(",")[1]?.trim() || "Pune";
  return {
    city,
    area: locality.split(",")[0]?.trim() || city,
    ...(CITY_DETAILS[city] ?? CITY_DETAILS.Pune),
  };
}

/** Country code plus ten digits, stored as plain digits like real accounts. */
export function devWhatsappNumber(index: number): string {
  const prefix = MOBILE_PREFIXES[index % MOBILE_PREFIXES.length];
  return `91${prefix}${String((index * 3571 + 60427) % 100000).padStart(5, "0")}`;
}

export function devCustomerPhone(seedIndex: number, index: number): string {
  const prefix = MOBILE_PREFIXES[(index + seedIndex) % MOBILE_PREFIXES.length];
  return `${prefix}${String((seedIndex * 7919 + index * 104729 + 48211) % 100000).padStart(5, "0")}`;
}

export function devUpiId(seed: DevBusinessSeed, index: number): string {
  const handle = seed.ownerName
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .join(".");
  return `${handle}@${BANK_PROFILES[index % BANK_PROFILES.length].upi}`;
}

/** Cash-first shops have no bank details to show on a bill. */
export function devBankDetails(
  seed: DevBusinessSeed,
  index: number,
): { accountName: string; accountNumber: string; ifsc: string } | null {
  if (index % 3 === 0) return null;
  const bank = BANK_PROFILES[index % BANK_PROFILES.length];
  return {
    accountName: seed.ownerName,
    accountNumber: String(10000000000000 + index * 123457),
    ifsc: bank.ifsc,
  };
}

export function devEnableTimeSlots(pack: string): boolean {
  return !["freelance", "tutoring", "wellness"].includes(pack);
}

/** Consultation-style trades use a neutral bill header. */
export function devPrivacyMode(pack: string): boolean {
  return ["tutoring", "wellness", "freelance"].includes(pack);
}

export function devNoticeBanner(index: number): string | null {
  if (index % 7 === 3) return "Closed on Tuesdays";
  if (index % 11 === 5) return "Cash and UPI accepted";
  return null;
}

export function devAdvancePolicy(pack: string): string | null {
  if (["food", "bakery", "rentals"].includes(pack)) {
    return "50% advance confirms your order.";
  }
  return null;
}
