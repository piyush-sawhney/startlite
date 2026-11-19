export type StarterItem = { name: string; price: string; unit: string };

export type CategoryPack = {
  id: string;
  label: string;
  noun: "Menu" | "Items" | "Services";
  note: string;
  unit: string;
  starters: StarterItem[];
};

export const PACKS: CategoryPack[] = [
  {
    id: "food",
    label: "Food and tiffin",
    noun: "Menu",
    note: "Delivery address or tiffin note",
    unit: "plate",
    starters: [
      { name: "Veg thali", price: "120.00", unit: "plate" },
      { name: "Roti", price: "15.00", unit: "piece" },
      { name: "Dal", price: "80.00", unit: "bowl" },
    ],
  },
  {
    id: "bakery",
    label: "Bakery and cakes",
    noun: "Menu",
    note: "Message on cake, delivery area",
    unit: "cake",
    starters: [
      { name: "Chocolate cake", price: "450.00", unit: "cake" },
      { name: "Butter cookies", price: "150.00", unit: "box" },
      { name: "Bread loaf", price: "40.00", unit: "loaf" },
    ],
  },
  {
    id: "grocery",
    label: "Grocery",
    noun: "Items",
    note: "Delivery address",
    unit: "kg",
    starters: [
      { name: "Rice", price: "60.00", unit: "kg" },
      { name: "Atta", price: "45.00", unit: "kg" },
      { name: "Cooking oil", price: "140.00", unit: "litre" },
    ],
  },
  {
    id: "tailoring",
    label: "Tailoring",
    noun: "Services",
    note: "Measurements, delivery date",
    unit: "piece",
    starters: [
      { name: "Blouse stitching", price: "350.00", unit: "piece" },
      { name: "Alteration", price: "100.00", unit: "piece" },
      { name: "Kurta stitching", price: "500.00", unit: "piece" },
    ],
  },
  {
    id: "salon",
    label: "Beauty and salon",
    noun: "Services",
    note: "Preferred time, home service",
    unit: "visit",
    starters: [
      { name: "Haircut", price: "200.00", unit: "visit" },
      { name: "Facial", price: "800.00", unit: "visit" },
      { name: "Threading", price: "50.00", unit: "visit" },
    ],
  },
  {
    id: "tutoring",
    label: "Tutoring",
    noun: "Services",
    note: "Class, board, preferred slot",
    unit: "month",
    starters: [
      { name: "Maths tuition", price: "1500.00", unit: "month" },
      { name: "Science tuition", price: "1500.00", unit: "month" },
      { name: "Spoken English", price: "1200.00", unit: "month" },
    ],
  },
  {
    id: "repairs",
    label: "Repairs",
    noun: "Services",
    note: "Device model, problem",
    unit: "job",
    starters: [
      { name: "Phone screen", price: "1200.00", unit: "job" },
      { name: "Fan repair", price: "300.00", unit: "job" },
      { name: "Laptop service", price: "800.00", unit: "job" },
    ],
  },
  {
    id: "rentals",
    label: "Rentals and events",
    noun: "Items",
    note: "Event date, venue, delivery",
    unit: "day",
    starters: [
      { name: "Chair", price: "20.00", unit: "day" },
      { name: "Table", price: "50.00", unit: "day" },
      { name: "Tent", price: "1500.00", unit: "day" },
    ],
  },
  {
    id: "freelance",
    label: "Freelance",
    noun: "Services",
    note: "Scope, deadline, brand notes",
    unit: "project",
    starters: [
      { name: "Logo design", price: "3000.00", unit: "project" },
      { name: "Social post", price: "500.00", unit: "project" },
      { name: "Website", price: "15000.00", unit: "project" },
    ],
  },
  {
    id: "home",
    label: "Home services",
    noun: "Services",
    note: "Address, area, preferred slot",
    unit: "visit",
    starters: [
      { name: "Deep cleaning", price: "1500.00", unit: "visit" },
      { name: "Plumbing", price: "300.00", unit: "visit" },
      { name: "Electrician", price: "300.00", unit: "visit" },
    ],
  },
  {
    id: "wellness",
    label: "Health and wellness",
    noun: "Services",
    note: "Preferred slot, health note",
    unit: "session",
    starters: [
      { name: "Yoga session", price: "300.00", unit: "session" },
      { name: "Diet plan", price: "1000.00", unit: "session" },
      { name: "Physiotherapy", price: "500.00", unit: "session" },
    ],
  },
  {
    id: "pets",
    label: "Pets and other",
    noun: "Items",
    note: "Pet, breed, delivery",
    unit: "piece",
    starters: [
      { name: "Dog walk", price: "100.00", unit: "walk" },
      { name: "Grooming", price: "800.00", unit: "visit" },
      { name: "Pet food", price: "500.00", unit: "kg" },
    ],
  },
];

export function getPack(id: string | null | undefined): CategoryPack {
  return PACKS.find((pack) => pack.id === id) ?? PACKS[2];
}
