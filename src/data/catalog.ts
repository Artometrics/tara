import reference from "./reference-catalog.json";

export type Variant = {
  id: string;
  label: string;
  price: number;
  referenceSku: string;
  /** Capture observation only. Not live inventory. */
  unavailable?: boolean;
};

export type ProductImage = {
  src: string;
  source: string;
  filename: string;
};

export type Product = {
  handle: string;
  title: string;
  pageTitle: string;
  color: string;
  category: string;
  kind: "apparel" | "gift-card";
  sourceUrl: string;
  description: string;
  imageNote: string;
  images: ProductImage[];
  image?: string;
  imageAlt: string;
  variants: Variant[];
  rights: string;
  availability: "unverified";
};

export const products: Product[] = reference.products.map((product) => ({
  ...product,
  kind: product.kind === "gift-card" ? "gift-card" : "apparel",
  availability: "unverified",
  image: product.images[0]?.src,
  imageAlt: product.images[0]
    ? `${product.title}. Reference photograph, rights not cleared.`
    : "",
  variants: product.variants.map((variant) => ({
    ...variant,
    unavailable: product.handle === "quinn-dress-salt" && variant.label === "XXS",
  })),
}));

export type Collection = {
  handle: string;
  title: string;
  intro: string;
  handles: string[];
};

const categorySlug: Record<string, string> = {
  Dresses: "dresses",
  Skirts: "skirts",
  Tops: "tops",
  Knitwear: "knitwear",
  Sweaters: "sweaters",
  Pants: "pants",
  Denim: "denim",
  Outerwear: "outerwear",
  Shoes: "shoes",
  Bags: "bags",
  Slips: "slips",
  "Gift card": "gift-cards",
};

const apparel = products.filter((product) => product.kind === "apparel");

export const collections: Collection[] = [
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    intro:
      "The eleven garments in the supplied twelve-product handoff. This is not a capture of the live collection page.",
    handles: apparel.map((product) => product.handle),
  },
  ...Object.entries(categorySlug).map(([category, handle]) => ({
    handle,
    title: category === "Gift card" ? "Gift Card" : category,
    intro:
      category === "Gift card"
        ? "Denominations from the public product. Issuance is off."
        : "The matching product from the twelve-product handoff. Empty reference categories were not filled in.",
    handles: products.filter((product) => product.category === category).map((product) => product.handle),
  })),
];

export type NavLink = { label: string; href: string; note?: string };

export const shopColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Clothing",
    links: [
      { label: "Dresses", href: "/collections/dresses" },
      { label: "Tops", href: "/collections/tops" },
      { label: "Knitwear", href: "/collections/knitwear" },
      { label: "Sweaters", href: "/collections/sweaters" },
      { label: "Pants", href: "/collections/pants" },
      { label: "Skirts", href: "/collections/skirts" },
      { label: "Denim", href: "/collections/denim" },
      { label: "Outerwear", href: "/collections/outerwear" },
    ],
  },
  {
    title: "Shoes & accessories",
    links: [
      { label: "Shoes", href: "/collections/shoes" },
      { label: "Bags", href: "/collections/bags" },
      { label: "Slips", href: "/collections/slips" },
    ],
  },
  {
    title: "In this preview",
    links: [
      { label: "Twelve-product handoff", href: "/collections/new-arrivals" },
      { label: "Gift card", href: "/products/digital-gift-card", note: "Issuance off" },
      { label: "Fidelity ledger", href: "/pages/provenance" },
    ],
  },
];

export const collectionLinks: NavLink[] = [
  { label: "New arrivals", href: "/collections/new-arrivals" },
  { label: "Dresses", href: "/collections/dresses" },
  { label: "Denim", href: "/collections/denim" },
  { label: "Knitwear", href: "/collections/knitwear" },
  { label: "Journal", href: "/journal" },
];

export const discoverLinks: NavLink[] = [
  { label: "Journal", href: "/journal", note: "Text not captured" },
  { label: "Lookbook", href: "/pages/lookbook", note: "Not captured" },
  { label: "About", href: "/pages/about", note: "Not published" },
  { label: "Questions", href: "/pages/faq", note: "Not published" },
];

export type Article = {
  slug: string;
  title: string;
  dek: string;
  dateLabel: string;
  image?: string;
  imageAlt?: string;
  paragraphs: string[];
};

export const articles: Article[] = [
  {
    slug: "not-captured",
    title: "Journal",
    dek: "The representative article was not in the supplied capture.",
    dateLabel: "Not captured",
    paragraphs: [
      "A journal index and one article URL were in the reference route list. The article text, photographs, and layout were not captured.",
      "This page does not invent that article. Motion and the full homepage are also waiting on the next capture.",
    ],
  },
];

export type UtilityPage = {
  slug: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  kind: "prose" | "lookbook" | "provenance";
};

export const utilityPages: UtilityPage[] = [
  {
    slug: "faq",
    kicker: "Assistance",
    title: "Questions",
    kind: "prose",
    paragraphs: [
      "Support articles were not captured. Nothing below is a store policy.",
      "Can I buy a piece? No. Payments are off, and the bag stays in this browser.",
      "Do you ship? Fulfillment is off.",
      "How do sizes run? The size guide was not captured. Availability is unverified.",
      "Can I write to you? Email, SMS, and contact are off.",
    ],
  },
  {
    slug: "privacy",
    kicker: "Policies",
    title: "Privacy",
    kind: "prose",
    paragraphs: [
      "No privacy policy is published for Prism & Pollen.",
      "The bag is stored in local storage on this device. It is not sent to a server.",
    ],
  },
  {
    slug: "terms",
    kicker: "Policies",
    title: "Terms",
    kind: "prose",
    paragraphs: [
      "No terms of sale, return policy, or shipping policy is published.",
      "Reference prices are not offers. Checkout is off.",
    ],
  },
  {
    slug: "about",
    kicker: "The house",
    title: "About",
    kind: "prose",
    paragraphs: [
      "No founding story is published for Prism & Pollen.",
      "The wordmark on this preview is Prism & Pollen. The product records are the supplied reference catalog, held for a fidelity pass.",
    ],
  },
  {
    slug: "impact",
    kicker: "Values",
    title: "Impact",
    kind: "prose",
    paragraphs: ["No impact report was supplied. This page makes none."],
  },
  {
    slug: "contact",
    kicker: "Assistance",
    title: "Contact",
    kind: "prose",
    paragraphs: ["Contact is off. There is no form, inbox, phone, or SMS number."],
  },
  {
    slug: "account",
    kicker: "Account",
    title: "Account",
    kind: "prose",
    paragraphs: ["Accounts are off. There is no sign-in or order history."],
  },
  {
    slug: "assistance",
    kicker: "Assistance",
    title: "Assistance",
    kind: "prose",
    paragraphs: ["Chat, email, and phone assistance are off."],
  },
  {
    slug: "currency",
    kicker: "Currency",
    title: "Currency",
    kind: "prose",
    paragraphs: [
      "Amounts are the public reference prices in US dollars. They are not an offer.",
      "Conversion is off.",
    ],
  },
  {
    slug: "shops",
    kicker: "Shops",
    title: "Shops",
    kind: "prose",
    paragraphs: [
      "No shop, address, or hours is published.",
      "The shop-detail route exists only to say that a named shop was not copied.",
    ],
  },
  {
    slug: "not-in-preview",
    kicker: "Menu",
    title: "Not in this preview",
    kind: "prose",
    paragraphs: [
      "This label was on the reference menu. No Prism & Pollen page was supplied for it.",
    ],
  },
  {
    slug: "lookbook",
    kicker: "Lookbook",
    title: "Lookbook",
    kind: "lookbook",
    paragraphs: [
      "The lookbook page was not captured. No campaign photographs are substituted here.",
    ],
  },
  {
    slug: "provenance",
    kicker: "Notes",
    title: "Provenance",
    kind: "provenance",
    paragraphs: [
      "Prism & Pollen is the name on this preview. It is not the reference house, and it does not sell those goods.",
      "The twelve products, their variant matrices, public prices, and the photographs under /reference are from the supplied handoff plus ordinary public product HTML. Rights are not cleared. Stock is unknown. Three og:image files named other garments and were not used.",
      "Earlier studio photographs in /brand were a substitute catalog. They are no longer shown as the products.",
      "The campaign homepage, motion, mobile collection, mobile product, cart, and search were not in the supplied screenshots. They are not invented here. See the fidelity ledger in the repository.",
      "Payments, accounts, email, SMS, reviews, gift-card issuance, inventory, and fulfillment are off.",
    ],
  },
];

export const lookbookPlates: { src: string; alt: string; caption: string; href: string }[] = [];

export function getProduct(handle: string): Product | undefined {
  return products.find((product) => product.handle === handle);
}

export function getCollection(handle: string): Collection | undefined {
  return collections.find((collection) => collection.handle === handle);
}

export function productsIn(collection: Collection): Product[] {
  return collection.handles
    .map((handle) => getProduct(handle))
    .filter((product): product is Product => Boolean(product));
}

export function relatedProducts(handle: string, count = 3): Product[] {
  const current = getProduct(handle);
  if (!current) return [];
  const rest = products.filter((product) => product.kind === "apparel" && product.handle !== handle);
  const same = rest.filter((product) => product.category === current.category);
  const others = rest.filter((product) => product.category !== current.category);
  return [...same, ...others].slice(0, count);
}

export function sizeRank(label: string): number {
  const alpha = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "One size"];
  const index = alpha.indexOf(label);
  if (index >= 0) return index;
  if (label.startsWith("$")) return 200 + Number(label.slice(1));
  const numeric = Number(label);
  if (!Number.isNaN(numeric)) return 100 + numeric;
  return 1000;
}

export function uniqueLabels(items: Product[], pick: (product: Product) => string[]): string[] {
  const set = new Set<string>();
  for (const product of items) {
    for (const label of pick(product)) set.add(label);
  }
  return [...set].sort((a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b));
}

export function utilityPage(slug: string): UtilityPage | undefined {
  return utilityPages.find((page) => page.slug === slug);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
