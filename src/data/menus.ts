export type MenuLink = { label: string; href: string };

export const shopMenu: { title: string; links: MenuLink[] }[] = [
  {
    title: "Clothing",
    links: [
      { label: "Dresses", href: "/collections/dresses" },
      { label: "Tops", href: "/collections/tops" },
      { label: "Knitwear", href: "/collections/knitwear" },
      { label: "Coats & jackets", href: "/collections/outerwear" },
      { label: "Pants & shorts", href: "/collections/pants" },
      { label: "Denim", href: "/collections/denim" },
      { label: "Skirts", href: "/collections/skirts" },
      { label: "Tees & tanks", href: "/pages/not-in-preview" },
      { label: "Kids", href: "/pages/not-in-preview" },
      { label: "Swimwear", href: "/pages/not-in-preview" },
    ],
  },
  {
    title: "Shoes & accessories",
    links: [
      { label: "Bags & pouches", href: "/collections/bags" },
      { label: "Shoes", href: "/collections/shoes" },
      { label: "Sunglasses", href: "/pages/not-in-preview" },
      { label: "View all", href: "/collections/new-arrivals" },
    ],
  },
  {
    title: "Lingerie & sleepwear",
    links: [
      { label: "Delicates", href: "/pages/not-in-preview" },
      { label: "Lounge & sleepwear", href: "/pages/not-in-preview" },
      { label: "Slips", href: "/collections/slips" },
    ],
  },
  {
    title: "Featured",
    links: [
      { label: "Holiday occasion shop", href: "/#explore" },
      { label: "Dôen & Vogue", href: "/pages/not-in-preview" },
      { label: "Favorite characters", href: "/pages/not-in-preview" },
      { label: "Dôen Heirloom", href: "/pages/not-in-preview" },
      { label: "Margaret & Katherine's favorites", href: "/pages/about" },
      { label: "Family sets", href: "/pages/not-in-preview" },
      { label: "Dôen & Trove", href: "/pages/not-in-preview" },
      { label: "Dôen & Library Science", href: "/pages/not-in-preview" },
    ],
  },
];

export const collectionMenu: { title: string; links: MenuLink[] }[] = [
  {
    title: "Featured",
    links: shopMenu[3].links,
  },
  {
    title: "Library",
    links: [
      { label: "Holiday Chapter Two", href: "/#hero" },
      { label: "Holiday Chapter One", href: "/pages/not-in-preview" },
      { label: "Knitwear capsule", href: "/collections/knitwear" },
      { label: "Fall Chapter Two", href: "/pages/not-in-preview" },
      { label: "Denim collection", href: "/collections/denim" },
      { label: "Fall Chapter One", href: "/pages/not-in-preview" },
      { label: "Pre-Fall collection", href: "/pages/not-in-preview" },
    ],
  },
  {
    title: "Gift cards",
    links: [
      { label: "Digital gift card", href: "/products/digital-gift-card" },
      { label: "Physical gift card", href: "/pages/not-in-preview" },
    ],
  },
];
