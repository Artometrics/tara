import { describe, expect, it } from "vitest";
import { products } from "../src/data/catalog";
import { formatUSD } from "../src/lib/money";

const handles = [
  "quinn-dress-salt",
  "sebastiane-skirt-powder",
  "the-jane-blouse-black-2",
  "petra-cardigan-coral",
  "merit-sweater-red-umber",
  "lavon-linen-pant-salt",
  "diana-mid-rise-jean-marville-wash",
  "germain-coat-light-khaki",
  "devi-boot-black-stretch-suede",
  "balfour-beaded-bag-champagne",
  "long-scoop-neck-slip-conch-2",
  "digital-gift-card",
];

describe("reference catalog", () => {
  it("ships the twelve handoff products and not the invented substitutes", () => {
    expect(products.map((product) => product.handle)).toEqual(handles);
    expect(products.some((product) => product.handle === "column-dress-chalk")).toBe(false);
    expect(products.filter((product) => product.kind === "gift-card")).toHaveLength(1);
  });

  it("does not use the three mismatched og:image files", () => {
    const files = JSON.stringify(products.map((product) => product.images)).toUpperCase();
    expect(files.includes("LOIS-TANK")).toBe(false);
    expect(files.includes("SHEP-JEAN")).toBe(false);
    expect(files.includes("MONTTEE")).toBe(false);
    for (const product of products) {
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.availability).toBe("unverified");
      expect(product.rights.toLowerCase()).toContain("not cleared");
    }
  });

  it("keeps the handoff variant matrices", () => {
    const byHandle = Object.fromEntries(products.map((product) => [product.handle, product]));
    expect(byHandle["quinn-dress-salt"].variants.map((variant) => variant.label)).toEqual([
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]);
    expect(byHandle["quinn-dress-salt"].variants[0].price).toBe(27800);
    expect(byHandle["diana-mid-rise-jean-marville-wash"].variants).toHaveLength(12);
    expect(byHandle["devi-boot-black-stretch-suede"].variants).toHaveLength(13);
    expect(byHandle["merit-sweater-red-umber"].variants).toHaveLength(5);
    expect(byHandle["balfour-beaded-bag-champagne"].variants[0].label).toBe("One size");
    expect(byHandle["digital-gift-card"].variants.map((variant) => variant.price)).toContain(5000);
    expect(formatUSD(27800)).toBe("$278");
  });
});
