export type ImageKey =
  | "hero-lehenga"
  | "india-mandap"
  | "italy-villa"
  | "us-ceremony"
  | "look-silk-gown"
  | "creator-flatlay";

export type BridalImage = {
  key: ImageKey;
  /** Path without extension. `-640` variants and `.webp` / `.jpg` siblings exist for each. */
  base: string;
  width: number;
  height: number;
  small: number;
  alt: string;
};

const folder = "/images/bridal";

export const images: Record<ImageKey, BridalImage> = {
  "hero-lehenga": {
    key: "hero-lehenga",
    base: `${folder}/hero-lehenga`,
    width: 1280,
    height: 720,
    small: 640,
    alt: "Illustration of a bride in an ivory and gold lehenga with a blush net dupatta, seen from behind in a sunlit hall scattered with marigold petals. AI-generated, not a photo of Tara.",
  },
  "india-mandap": {
    key: "india-mandap",
    base: `${folder}/india-mandap`,
    width: 1152,
    height: 864,
    small: 640,
    alt: "Illustration of a marigold-draped wedding mandap in a stone courtyard at dusk, ringed with lanterns and rose petals. AI-generated, not a photo of Tara.",
  },
  "italy-villa": {
    key: "italy-villa",
    base: `${folder}/italy-villa`,
    width: 1152,
    height: 864,
    small: 640,
    alt: "Illustration of a long linen-draped dinner table on a terracotta terrace beside lemon trees and a mountain lake. AI-generated, not a photo of Tara.",
  },
  "us-ceremony": {
    key: "us-ceremony",
    base: `${folder}/us-ceremony`,
    width: 1152,
    height: 864,
    small: 640,
    alt: "Illustration of a floral ceremony arch of white and blush roses at the end of a gravel aisle lined with white chairs. AI-generated, not a photo of Tara.",
  },
  "look-silk-gown": {
    key: "look-silk-gown",
    base: `${folder}/look-silk-gown`,
    width: 864,
    height: 1152,
    small: 640,
    alt: "Illustration of a bride in a fitted ivory silk gown and long sheer veil, seen from behind under a weathered stone archway. AI-generated, not a photo of Tara.",
  },
  "creator-flatlay": {
    key: "creator-flatlay",
    base: `${folder}/creator-flatlay`,
    width: 864,
    height: 1152,
    small: 640,
    alt: "Illustration of a flat lay with henna-decorated hands holding a blush planner, with marigolds, gold bangles, a ring light and a laptop. AI-generated, not a photo of Tara.",
  },
};
