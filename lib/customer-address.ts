/** The address shape stored on a customer, shared by the API and the reports. */
export type CustomerAddress = {
  line1: string;
  line2: string;
  line3: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type CustomerAddressInput = {
  line1?: string | null;
  line2?: string | null;
  line3?: string | null;
  locality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
};

/** Turn form input into a complete address, or null when nothing was entered. */
export function normalizeCustomerAddress(
  input: CustomerAddressInput | null | undefined,
): CustomerAddress | null {
  if (!input) return null;
  const clean = (value: string | null | undefined) => (value ?? "").trim();
  const address: CustomerAddress = {
    line1: clean(input.line1),
    line2: clean(input.line2),
    line3: clean(input.line3),
    locality: clean(input.locality),
    city: clean(input.city),
    state: clean(input.state),
    country: clean(input.country),
    pincode: clean(input.pincode),
  };
  return Object.values(address).some(Boolean) ? address : null;
}

/** Compact locality and pincode caption used in customer lists. */
export function localityAndPincode(
  address: CustomerAddress | null | undefined,
): string {
  if (!address) return "";
  return [address.locality, address.pincode].filter(Boolean).join(" · ");
}

/** Full address for the customer detail card, one part per line. */
export function formatCustomerAddress(
  address: CustomerAddress | null | undefined,
): string {
  if (!address) return "";
  const place = [address.locality, address.city, address.state]
    .filter(Boolean)
    .join(", ");
  const countryAndPin = [address.country, address.pincode]
    .filter(Boolean)
    .join(" ");
  return [
    address.line1,
    address.line2,
    address.line3,
    place,
    countryAndPin,
  ]
    .filter(Boolean)
    .join("\n");
}
