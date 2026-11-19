import { describe, expect, it } from "vitest";
import { buildUpiUri, generateQrSvg } from "./qr";

describe("buildUpiUri", () => {
  it("formats standard UPI uri with encoded fields and exact decimal amount", () => {
    const uri = buildUpiUri({
      upiId: "anita@okhdfcbank",
      name: "Anita Sharma",
      amount: "450",
    });
    expect(uri).toBe("upi://pay?pa=anita%40okhdfcbank&pn=Anita+Sharma&am=450.00&cu=INR");
  });

  it("handles decimal amount correctly", () => {
    const uri = buildUpiUri({
      upiId: "shop@upi",
      name: "My Shop",
      amount: "123.45",
    });
    expect(uri).toContain("am=123.45");
  });
});

describe("generateQrSvg", () => {
  it("renders a valid SVG string", () => {
    const svg = generateQrSvg("upi://pay?pa=test@upi");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("<path");
  });
});
