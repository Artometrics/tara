import type { Product } from "../data/catalog";

export type SortKey = "featured" | "price-asc" | "price-desc";

export type PriceBand = "under-100" | "100-300" | "300-500" | "500-plus";

export type QueryState = {
  sort: SortKey;
  sizes: string[];
  categories: string[];
  colors: string[];
  priceBands: PriceBand[];
  text: string;
};

export function sortToParam(sort: SortKey): string | null {
  if (sort === "price-asc") return "price-ascending";
  if (sort === "price-desc") return "price-descending";
  return null;
}

export function sortFromParam(value: string | null): SortKey {
  if (value === "price-ascending") return "price-asc";
  if (value === "price-descending") return "price-desc";
  return "featured";
}

export function emptyQuery(text = ""): QueryState {
  return {
    sort: "featured",
    sizes: [],
    categories: [],
    colors: [],
    priceBands: [],
    text,
  };
}

export function displayPrice(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.price));
}

function inBand(cents: number, band: PriceBand): boolean {
  const dollars = cents / 100;
  if (band === "under-100") return dollars < 100;
  if (band === "100-300") return dollars >= 100 && dollars < 300;
  if (band === "300-500") return dollars >= 300 && dollars < 500;
  return dollars >= 500;
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function searchProducts(products: Product[], text: string): Product[] {
  const terms = normalize(text).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return products.filter((product) => {
    const haystack = normalize(
      [
        product.title,
        product.color,
        product.category,
        product.description,
        ...product.variants.map((variant) => variant.label),
      ].join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}

export function applyQuery(products: Product[], state: QueryState): Product[] {
  const searched = state.text.trim() ? searchProducts(products, state.text) : products;
  const filtered = searched.filter((product) => {
    if (state.sizes.length > 0) {
      const labels = new Set(product.variants.map((variant) => variant.label));
      if (!state.sizes.some((size) => labels.has(size))) return false;
    }
    if (state.categories.length > 0 && !state.categories.includes(product.category)) {
      return false;
    }
    if (
      state.colors.length > 0 &&
      !state.colors.some((color) => normalize(color) === normalize(product.color))
    ) {
      return false;
    }
    if (state.priceBands.length > 0) {
      const price = displayPrice(product);
      if (!state.priceBands.some((band) => inBand(price, band))) return false;
    }
    return true;
  });

  const ranked = filtered.map((product, index) => ({ product, index }));
  ranked.sort((a, b) => {
    if (state.sort === "price-asc" || state.sort === "price-desc") {
      const delta = displayPrice(a.product) - displayPrice(b.product);
      if (delta !== 0) return state.sort === "price-asc" ? delta : -delta;
    }
    if (state.sort === "price-desc" || state.sort === "price-asc") return a.index - b.index;
    return a.index - b.index;
  });
  return ranked.map((item) => item.product);
}
