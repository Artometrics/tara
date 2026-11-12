import { describe, expect, it } from "vitest";
import { products } from "../src/data/catalog";
import { applyQuery, emptyQuery, searchProducts, sortFromParam, sortToParam } from "../src/lib/query";

const apparel = products.filter((product) => product.kind === "apparel");

describe("query", () => {
  it("searches the reference titles", () => {
    expect(searchProducts(products, "   ")).toHaveLength(0);
    expect(searchProducts(products, "lavon").map((product) => product.handle)).toEqual([
      "lavon-linen-pant-salt",
    ]);
    expect(searchProducts(products, "zzzz-not-a-piece")).toHaveLength(0);
    expect(searchProducts(products, "diana jean").map((product) => product.handle)).toEqual([
      "diana-mid-rise-jean-marville-wash",
    ]);
  });

  it("filters by the handoff size run and sorts by the public prices", () => {
    const sized = applyQuery(apparel, { ...emptyQuery(), sizes: ["27"] });
    expect(sized.map((product) => product.handle)).toEqual(["diana-mid-rise-jean-marville-wash"]);

    const sorted = applyQuery(apparel, { ...emptyQuery(), sort: "price-asc" });
    expect(sorted[0].handle).toBe("long-scoop-neck-slip-conch-2");
    const high = applyQuery(apparel, { ...emptyQuery(), sort: "price-desc" });
    expect(high[0].handle).toBe("germain-coat-light-khaki");
  });

  it("maps the reference price-ascending parameter", () => {
    expect(sortToParam("price-asc")).toBe("price-ascending");
    expect(sortFromParam("price-ascending")).toBe("price-asc");
    expect(sortToParam("featured")).toBeNull();
    const dress = searchProducts(products, "dress");
    expect(dress.map((product) => product.handle)).toEqual([
      "quinn-dress-salt",
      "long-scoop-neck-slip-conch-2",
    ]);
    expect(dress).toHaveLength(2);
  });

  it("filters the salt colorway without inventing extra colors", () => {
    const salt = applyQuery(apparel, { ...emptyQuery(), colors: ["Salt"] });
    expect(salt.map((product) => product.handle)).toEqual([
      "quinn-dress-salt",
      "lavon-linen-pant-salt",
    ]);
    const band = applyQuery(apparel, { ...emptyQuery(), priceBands: ["under-100"] });
    expect(band.map((product) => product.handle)).toEqual(["long-scoop-neck-slip-conch-2"]);
  });
});
