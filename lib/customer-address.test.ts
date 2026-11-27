import { describe, expect, it } from "vitest";
import {
  formatCustomerAddress,
  localityAndPincode,
  normalizeCustomerAddress,
} from "./customer-address";

describe("customer address", () => {
  it("normalizes form input and drops an empty address", () => {
    expect(
      normalizeCustomerAddress({
        line1: "  12 Main Street  ",
        locality: " Kothrud ",
        pincode: "411038",
      }),
    ).toEqual({
      line1: "12 Main Street",
      line2: "",
      line3: "",
      locality: "Kothrud",
      city: "",
      state: "",
      country: "",
      pincode: "411038",
    });
    expect(normalizeCustomerAddress({ line1: "  ", locality: "" })).toBeNull();
    expect(normalizeCustomerAddress(null)).toBeNull();
  });

  it("builds the compact list caption", () => {
    expect(
      localityAndPincode(normalizeCustomerAddress({ locality: "Bandra West", pincode: "400050" })),
    ).toBe("Bandra West · 400050");
    expect(localityAndPincode(null)).toBe("");
  });

  it("formats the full address one group per line", () => {
    const address = normalizeCustomerAddress({
      line1: "12 Main Street",
      line2: "Near temple",
      locality: "Kothrud",
      city: "Pune",
      state: "MH",
      country: "India",
      pincode: "411038",
    });
    expect(formatCustomerAddress(address)).toBe(
      "12 Main Street\nNear temple\nKothrud, Pune, MH\nIndia 411038",
    );
  });
});
