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
