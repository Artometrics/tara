import type { CelebrationId } from "./site";
import type { ImageKey } from "./images";

export type Moment = "ceremony" | "pre-wedding" | "reception";
export type PaletteKey = "ivory" | "blush" | "marigold" | "terracotta";
export type Motif = "veil" | "dupatta" | "marigold" | "arch" | "table" | "lemon" | "aisle" | "jacket";

export const momentLabels: Record<Moment, string> = {
  ceremony: "Ceremony",
  "pre-wedding": "Pre-wedding event",
  reception: "Reception & after",
};

export const paletteLabels: Record<PaletteKey, string> = {
  ivory: "Ivory Silk",
  blush: "Blush Petal",
  marigold: "Marigold",
  terracotta: "Terracotta",
};

export const paletteHex: Record<PaletteKey, string> = {
  ivory: "#FBF5EA",
  blush: "#F2D6CE",
  marigold: "#EFA91E",
  terracotta: "#A8472A",
};

export type Look = {
  slug: string;
  title: string;
  celebration: CelebrationId;
  moment: Moment;
  mood: string;
  palette: PaletteKey[];
  /** Real (AI-generated) image if one is supplied; otherwise a drawn placeholder is used. */
  image?: ImageKey;
  motif: Motif;
  summary: string;
  whyItsHere: string[];
  silhouette: string;
  fabricIdeas: string;
  finishingTouches: string;
  questions: string[];
  contentIdea: string;
};

export const looks: Look[] = [
  {
    slug: "silk-column-and-cathedral-veil",
    title: "Silk Column & Cathedral Veil",
    celebration: "italy",
    moment: "ceremony",
    mood: "Quiet, architectural, timeless",
    palette: ["ivory", "blush"],
    image: "look-silk-gown",
    motif: "veil",
    summary: "A clean ivory column with all the drama saved for a long, sheer veil.",
    whyItsHere: [
      "Old stone, soft light and a very long veil: this is the picture that comes to mind for the Italian ceremony. The gown does very little so the setting can do a lot.",
      "It is also the look that most clearly shows how a plain silhouette photographs well from behind, which matters for a creator who will film walking shots.",
    ],
    silhouette: "Fitted column with a modest train and long sleeves",
    fabricIdeas: "Matte or satin-faced silk, or a crepe that holds its line in warm weather",
    finishingTouches: "A single hairpin, a delicate earring, and a veil with a hand-finished edge",
    questions: [
      "How will it feel after four hours in warm weather?",
      "Can the veil be detached for dinner and dancing?",
      "Is there a fitting plan that works while traveling?",
    ],
    contentIdea: "A try-on diary comparing fabrics in daylight, then a short film on veil handling.",
  },
  {
    slug: "blush-lehenga-net-dupatta",
    title: "Blush Lehenga & Net Dupatta",
    celebration: "india",
    moment: "ceremony",
    mood: "Heirloom glow, soft metallics",
    palette: ["blush", "ivory", "marigold"],
    motif: "dupatta",
    summary: "An ivory and gold skirt softened by a blush net dupatta.",
    whyItsHere: [
      "Most lehenga inspiration is loud. This board entry is about the quiet end of the range: pale ground, gold work kept to the borders, and a dupatta that moves.",
      "It is a starting question rather than a decision. Tara will test it against the shades she actually looks good in.",
    ],
    silhouette: "Full skirt, structured blouse, dupatta draped for movement",
    fabricIdeas: "Lightweight net over silk, with metallic work concentrated at the hem and border",
    finishingTouches: "Gold jewelry with one focal piece instead of many",
    questions: [
      "How heavy is the whole outfit once it is worn for hours?",
      "How long do made-to-order pieces take, and when is the last safe order date?",
      "Does the color still look right in flash photography?",
    ],
    contentIdea: "A shopping checklist video: what to ask, what to bring, how to read a quote.",
  },
  {
    slug: "marigold-morning-look",
    title: "Marigold Morning Look",
    celebration: "india",
    moment: "pre-wedding",
    mood: "Bright, playful, photographs outdoors",
    palette: ["marigold", "ivory"],
    motif: "marigold",
    summary: "A sunny, lightweight outfit made for a daytime pre-wedding event.",
    whyItsHere: [
      "Daytime events call for something bright and comfortable. Marigold is the obvious color, and the challenge is wearing it without disappearing into the flowers.",
      "This entry is a reminder to plan outfits that can be washed, sat in and danced in, not only photographed.",
    ],
    silhouette: "Easy skirt or palazzo with a short, simple top",
    fabricIdeas: "Cotton blends or chiffon that breathe and survive a long day",
    finishingTouches: "Fresh flowers or a simple gold set; nothing that snags",
    questions: [
      "Will it stain, and does that matter?",
      "Can it be restyled for a different event later?",
      "What shoes are realistic on grass?",
    ],
    contentIdea: "A one-outfit, three-ways reel to show how to stretch a budget.",
  },
  {
    slug: "red-and-gold-ceremony",
    title: "Red & Gold Ceremony Study",
    celebration: "india",
    moment: "ceremony",
    mood: "Rich, traditional, saturated",
    palette: ["terracotta", "marigold"],
    motif: "arch",
    summary: "A study in classic red and gold, to compare against quieter palettes.",
    whyItsHere: [
      "Saturated red and gold sits at the other end from the blush lehenga entry. Keeping both on the board makes it easier to see what feels like Tara and what feels expected.",
      "Whether this palette appears at all is Tara's call. It is here so the comparison is honest.",
    ],
    silhouette: "Traditional structured outfit with heavy borders",
    fabricIdeas: "Silk with dense embroidery; ask about weight and lining",
    finishingTouches: "Statement jewelry, and a plan for who helps with the draping",
    questions: [
      "Which family heirlooms might be part of it?",
      "How do you rent, borrow or restyle something this significant?",
      "What is the budget ceiling for one outfit?",
    ],
    contentIdea: "A side-by-side: classic versus modern palette, with comments invited.",
  },
  {
    slug: "terracotta-welcome-dinner",
    title: "Terracotta Welcome Dinner",
    celebration: "italy",
    moment: "pre-wedding",
    mood: "Warm, relaxed, golden hour",
    palette: ["terracotta", "ivory"],
    motif: "table",
    summary: "A flowing terracotta dress for the first evening with guests.",
    whyItsHere: [
      "A welcome dinner is the most underrated outfit moment. It sets the tone for the whole trip and nobody expects a gown.",
      "Terracotta is the color of the place this celebration is imagined in, and it happens to look good next to ivory tablecloths.",
    ],
    silhouette: "Midi or maxi with movement, easy to eat and walk in",
    fabricIdeas: "Linen blend or soft crepe that packs without a steamer",
    finishingTouches: "Flat sandals for cobblestones, a light wrap for the evening",
    questions: [
      "Will it travel well in a carry-on?",
      "Can it serve as a rehearsal or guest-facing look again?",
    ],
    contentIdea: "A packing list for a destination wedding weekend.",
  },
  {
    slug: "lemon-grove-aperitivo",
    title: "Lemon Grove Aperitivo",
    celebration: "italy",
    moment: "pre-wedding",
    mood: "Fresh, sunlit, effortless",
    palette: ["ivory", "marigold"],
    motif: "lemon",
    summary: "A light, citrus-bright look for a pre-dinner toast among the trees.",
    whyItsHere: [
      "Nothing about an aperitivo hour needs to be formal. This look is about a small celebration within the celebration.",
      "It also gives a creator a natural spot for a relaxed, talking-to-camera segment.",
    ],
    silhouette: "Wrap or slip dress with a short jacket",
    fabricIdeas: "Cotton poplin or silk blend with a little weight",
    finishingTouches: "Woven bag, simple earrings, sunglasses",
    questions: ["How does it photograph in strong midday sun?", "Is it appropriate for family of all ages?"],
    contentIdea: "A day-in-the-life of planning a destination weekend, in short clips.",
  },
  {
    slug: "ivory-aisle-gown",
    title: "Ivory Aisle Gown",
    celebration: "america",
    moment: "ceremony",
    mood: "Classic, polished, graceful",
    palette: ["ivory", "blush"],
    motif: "aisle",
    summary: "The classic gown question, answered in ivory with a soft blush underlayer.",
    whyItsHere: [
      "Every bride is asked about the gown. This entry is a place to think about structure, sleeves and how much a classic silhouette should borrow from the other celebrations.",
      "A blush underlayer is a small nod to the Indian palette without turning the gown into a costume.",
    ],
    silhouette: "A-line or fit-and-flare with structured sleeve",
    fabricIdeas: "Crepe or mikado; ask how each handles a long day",
    finishingTouches: "Pearl or gold detail, a veil that can come off for photos",
    questions: [
      "What is the realistic lead time for alterations?",
      "How will the gown be stored and transported between celebrations?",
    ],
    contentIdea: "A gown-shopping series with honest notes on every appointment.",
  },
  {
    slug: "fusion-reception-second-look",
    title: "Fusion Reception Second Look",
    celebration: "america",
    moment: "reception",
    mood: "Modern, celebratory, a little bold",
    palette: ["blush", "marigold", "terracotta"],
    motif: "jacket",
    summary: "A reception outfit that borrows color and craft from the Indian celebration.",
    whyItsHere: [
      "The reception is where the three celebrations can meet in one outfit. Think a modern silhouette with embroidery or a dupatta-inspired layer.",
      "It is also a practical second look: something easier to dance in than a ceremony gown.",
    ],
    silhouette: "Modern jacket-and-skirt or draped gown with movement",
    fabricIdeas: "Crepe or silk with selective embroidered detail",
    finishingTouches: "Statement earrings, and shoes you can dance in",
    questions: [
      "Which craft details feel natural, and which feel like decoration?",
      "Who could make or adapt it, and what is the lead time?",
    ],
    contentIdea: "A design-sketch collaboration: three outfits, one color story.",
  },
];

export const getLook = (slug: string): Look => {
  const found = looks.find((look) => look.slug === slug);
  if (!found) throw new Error(`Unknown look: ${slug}`);
  return found;
};

export const neighbors = (slug: string): { prev: Look; next: Look } => {
  const index = looks.findIndex((look) => look.slug === slug);
  if (index === -1) throw new Error(`Unknown look: ${slug}`);
  return {
    prev: looks[(index - 1 + looks.length) % looks.length],
    next: looks[(index + 1) % looks.length],
  };
};
