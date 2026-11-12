import { describe, expect, it } from "vitest";
import {
  addItem,
  changeQty,
  emptyCart,
  lineCount,
  loadCart,
  removeLine,
  saveCart,
  subtotal,
  type AddInput,
} from "../src/lib/cart";

const dress: AddInput = {
  kind: "apparel",
  handle: "column-dress-chalk",
  variantId: "column-dress-chalk-m",
  title: "Column Dress",
  color: "Chalk",
  variantLabel: "M",
  unitPrice: 27800,
  href: "/products/column-dress-chalk",
};

const jean: AddInput = {
  kind: "apparel",
  handle: "river-jean",
  variantId: "river-jean-27",
  title: "River Jean",
  color: "Mid Wash",
  variantLabel: "27",
  unitPrice: 24800,
  href: "/products/river-jean",
};

describe("cart", () => {
  it("requires a variant", () => {
    const result = addItem(emptyCart(), { ...dress, variantId: null });
    expect(result.error).toMatch(/size/i);
    expect(result.cart.lines).toHaveLength(0);
  });

  it("refuses gift card issuance", () => {
    const result = addItem(emptyCart(), {
      ...dress,
      kind: "gift-card",
      handle: "gift-note",
      variantId: "gift-note-50",
    });
    expect(result.error).toMatch(/issuance/i);
    expect(result.cart.lines).toHaveLength(0);
  });

  it("keeps two lines, arithmetic, and a first-click remove", () => {
    const first = addItem(emptyCart(), dress);
    const second = addItem(first.cart, jean);
    expect(second.cart.lines).toHaveLength(2);
    expect(lineCount(second.cart)).toBe(2);

    const doubled = changeQty(second.cart, second.cart.lines[0].id, 1);
    expect(doubled.lines[0].qty).toBe(2);
    expect(subtotal(doubled)).toBe(27800 * 2 + 24800);

    const removed = removeLine(doubled, doubled.lines[0].id);
    expect(removed.lines).toHaveLength(1);
    expect(removed.lines[0].handle).toBe("river-jean");

    const cleared = changeQty(removed, removed.lines[0].id, -1);
    expect(cleared.lines).toHaveLength(0);
  });

  it("merges the same variant", () => {
    const once = addItem(emptyCart(), dress);
    const twice = addItem(once.cart, dress);
    expect(twice.cart.lines).toHaveLength(1);
    expect(twice.cart.lines[0].qty).toBe(2);
  });

  it("round-trips through storage and drops bad lines", () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
    };
    const saved = addItem(addItem(emptyCart(), dress).cart, jean).cart;
    saveCart(storage, saved);
    expect(loadCart(storage).lines).toHaveLength(2);

    storage.setItem("prism-pollen.cart.v1", "{");
    expect(loadCart(storage).lines).toHaveLength(0);

    storage.setItem(
      "prism-pollen.cart.v1",
      JSON.stringify({
        lines: [
          { ...saved.lines[0], qty: 0 },
          { ...saved.lines[1], handle: "gift-note" },
          saved.lines[1],
        ],
      }),
    );
    const loaded = loadCart(storage);
    expect(loaded.lines).toHaveLength(1);
    expect(loaded.lines[0].handle).toBe("river-jean");
  });
});
