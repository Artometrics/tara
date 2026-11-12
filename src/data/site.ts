import type { ImageKey } from "./images";

export const site = {
  name: "Tara",
  fullTitle: "Tara · Bridal creator in the making",
  tagline: "One bride, three celebrations.",
  description:
    "Tara is planning wedding celebrations in India, Italy and America and sharing the planning as it happens. Draft preview.",
  status: "Draft preview",
  contactEmail: "hello@tara.example",
  contactNote: "Placeholder address. Replace before launch.",
  handlesNote: "Social handles are not set yet.",
} as const;

export type MenuLink = { label: string; href: string };
export type MenuColumn = { title: string; links: MenuLink[] };

export const weddingsMenu: MenuColumn[] = [
  {
    title: "The three celebrations",
    links: [
      { label: "India", href: "/weddings#india" },
      { label: "Italy", href: "/weddings#italy" },
      { label: "America", href: "/weddings#america" },
      { label: "How they fit together", href: "/weddings#together" },
    ],
  },
  {
    title: "Planning notes",
    links: [
      { label: "Lehenga shopping", href: "/journal/lehenga-shopping-questions" },
      { label: "Italy venue scouting", href: "/journal/italy-venue-scouting" },
      { label: "Fusion ceremonies", href: "/journal/fusion-ceremonies" },
      { label: "Budget diaries", href: "/journal/budget-diary-zero" },
    ],
  },
];

export const lookbookMenu: MenuColumn[] = [
  {
    title: "By celebration",
    links: [
      { label: "India looks", href: "/lookbook?celebration=india" },
      { label: "Italy looks", href: "/lookbook?celebration=italy" },
      { label: "America looks", href: "/lookbook?celebration=america" },
      { label: "All looks", href: "/lookbook" },
    ],
  },
  {
    title: "By moment",
    links: [
      { label: "Ceremony", href: "/lookbook?moment=ceremony" },
      { label: "Pre-wedding events", href: "/lookbook?moment=pre-wedding" },
      { label: "Reception & after", href: "/lookbook?moment=reception" },
    ],
  },
];

export const primaryLinks: MenuLink[] = [
  { label: "About Tara", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Partner with me", href: "/partner" },
  { label: "Newsletter", href: "/newsletter" },
];

export const menuPhotos: Record<"weddings" | "lookbook", ImageKey> = {
  weddings: "italy-villa",
  lookbook: "look-silk-gown",
};

export type CelebrationId = "india" | "italy" | "america";

export type Celebration = {
  id: CelebrationId;
  name: string;
  kicker: string;
  image: ImageKey;
  mood: string;
  palette: string;
  contentAngle: string;
  summary: string;
  paragraphs: string[];
  thingsToDecide: string[];
  placeholders: { label: string; value: string }[];
};

export const celebrations: Celebration[] = [
  {
    id: "india",
    name: "India",
    kicker: "Celebration one",
    image: "india-mandap",
    mood: "Marigold, lantern light, layered color",
    palette: "Marigold, blush, deep red accents",
    contentAngle: "Outfit decisions, family logistics, and what to ask before you book",
    summary: "The celebration rooted in Tara's Indian heritage.",
    paragraphs: [
      "This is the celebration that connects most directly to Tara's Indian heritage. Traditions differ a great deal between families, regions and faiths, so this page will not guess at which ceremonies belong in it. Tara will add that herself.",
      "What the site can already promise is the lens: color, craft and family. Expect honest notes on shopping for bridal outfits, budgeting for several events, and keeping elders and friends informed without a group-chat meltdown.",
    ],
    thingsToDecide: [
      "Which ceremonies and events the celebration includes",
      "City, venue and season",
      "Outfit plan for each event",
      "Who needs to travel, and how early to tell them",
    ],
    placeholders: [
      { label: "Date", value: "To be announced" },
      { label: "Place", value: "To be announced" },
      { label: "Events", value: "Tara to list" },
    ],
  },
  {
    id: "italy",
    name: "Italy",
    kicker: "Celebration two",
    image: "italy-villa",
    mood: "Terracotta, lemon groves, long tables",
    palette: "Terracotta, ivory, olive green",
    contentAngle: "Remote venue scouting, destination logistics and guest experience",
    summary: "The destination celebration, planned from a distance.",
    paragraphs: [
      "The Italian celebration is the destination chapter. It is also the one most likely to teach a lot of planning lessons in public: scouting from far away, working across time zones and languages, and deciding what a guest list can reasonably travel for.",
      "Nothing is booked on this site. The villa in the picture is an AI-made illustration, not a venue. Real scouting notes will arrive in the journal as they happen.",
    ],
    thingsToDecide: [
      "Region and venue type",
      "Legal and paperwork requirements, checked with official sources",
      "Guest travel and lodging",
      "A realistic budget for a smaller guest list",
    ],
    placeholders: [
      { label: "Date", value: "To be announced" },
      { label: "Place", value: "To be announced" },
      { label: "Guest list", value: "To be decided" },
    ],
  },
  {
    id: "america",
    name: "America",
    kicker: "Celebration three",
    image: "us-ceremony",
    mood: "Garden ivory, blush roses, a modern aisle",
    palette: "Ivory, blush, soft green",
    contentAngle: "Fusion ideas, the classic gown question and the reception that ties it together",
    summary: "The celebration where the other two meet.",
    paragraphs: [
      "The American celebration is where friends, coworkers and extended family can gather without a passport. It is also the natural place for fusion: a ceremony moment, an outfit change or a menu that nods to the other two celebrations.",
      "This preview does not name a state, venue or date. This section holds the space, and the lookbook already collects ideas for a gown, a second look and a reception that does not feel like an afterthought.",
    ],
    thingsToDecide: [
      "State, city and venue",
      "How much of the other two celebrations to echo",
      "Ceremony and reception outfits",
      "Vendor budget and what to ask sponsors for, if anything",
    ],
    placeholders: [
      { label: "Date", value: "To be announced" },
      { label: "Place", value: "To be announced" },
      { label: "Style", value: "Tara to decide" },
    ],
  },
];

export const celebrationById = (id: CelebrationId): Celebration => {
  const found = celebrations.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown celebration: ${id}`);
  return found;
};
