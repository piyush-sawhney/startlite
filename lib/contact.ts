/** One contact-link implementation for every customer shortcut in the app. */
export function phoneDigits(phone: string, countryCode = "+91"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return digits.slice(1);
  const cc = countryCode.replace("+", "");
  if (!digits.startsWith(cc)) return cc + digits;
  return digits;
}

export function smsLink(
  phone: string,
  countryCode: string | undefined,
  text: string,
): string {
  return `sms:${phoneDigits(phone, countryCode)}?body=${encodeURIComponent(text)}`;
}

export function callLink(
  phone: string,
  countryCode: string | undefined,
): string {
  return `tel:${phoneDigits(phone, countryCode)}`;
}

/**
 * Display-only phone masking. Every digit except the last four becomes a
 * bullet; short numbers are left alone. Contact links still use the raw value.
 */
export function maskPhoneLast4(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "No phone";
  if (digits.length <= 4) return digits;
  return `${"•".repeat(digits.length - 4)}${digits.slice(-4)}`;
}
