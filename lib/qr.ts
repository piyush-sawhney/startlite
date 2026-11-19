import { renderSVG } from "uqr";
import { money } from "./money";

export type UpiPayloadInput = {
  upiId: string;
  name: string;
  amount: string | number;
};

/**
 * Builds the standard upi://pay URI according to NPCI specifications.
 * All parameters are properly URL encoded.
 */
export function buildUpiUri(input: UpiPayloadInput): string {
  const params = new URLSearchParams({
    pa: input.upiId.trim(),
    pn: input.name.trim(),
    am: money(input.amount),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

export type QrSvgOptions = {
  border?: number;
  ecc?: "L" | "M" | "Q" | "H";
};

/**
 * Generates an SVG string representation of a QR code using uqr.
 */
export function generateQrSvg(text: string, options?: QrSvgOptions): string {
  return renderSVG(text, {
    border: options?.border ?? 2,
    ecc: options?.ecc ?? "M",
  });
}
