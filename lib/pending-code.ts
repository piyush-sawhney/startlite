import { randomBytes } from "node:crypto";

// Crockford base32: no I, L, O, or U. Easy to read aloud.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newPendingCode(): string {
  const bytes = randomBytes(10);
  let code = "";
  for (let index = 0; index < 10; index += 1) {
    code += ALPHABET[bytes[index] % 32];
  }
  return code;
}

export function isPendingCode(value: string): boolean {
  return /^[0-9A-HJKMNP-TV-Z]{10}$/.test(value);
}
