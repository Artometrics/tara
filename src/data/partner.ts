export type MediaKitRow = { label: string; value: string };

export const mediaKit: MediaKitRow[] = [
  { label: "Creator", value: "Tara" },
  { label: "Niche", value: "Multicultural, three-country bridal planning" },
  { label: "Stage", value: "Starting out. Audience not yet built." },
  { label: "Platforms", value: "Instagram, TikTok, YouTube, Pinterest (handles not set)" },
  { label: "Followers and reach", value: "Not available yet. Add real figures once they exist." },
  { label: "Engagement rate", value: "Not available yet" },
  { label: "Audience location and age", value: "Not available yet" },
  { label: "Timeline", value: "Wedding celebrations planned in about two years" },
  { label: "Best contact", value: "Placeholder address. Replace before launch." },
];

export type Pillar = { title: string; body: string };

export const audiencePillars: Pillar[] = [
  {
    title: "Multicultural couples",
    body: "People planning a wedding that has to honor more than one family, culture or country, and who want practical examples, not generic checklists.",
  },
  {
    title: "Destination planners",
    body: "People weighing a venue abroad, a smaller guest list and a longer logistics trail.",
  },
  {
    title: "Budget-aware brides",
    body: "People who want transparency about what things cost and where to save, not only what looks beautiful.",
  },
  {
    title: "Working professionals",
    body: "People planning in the margins of a full-time job who need systems, timelines and short formats.",
  },
];

export type Tier = {
  name: string;
  tagline: string;
  includes: string[];
  rate: string;
};

export const exampleTiers: Tier[] = [
  {
    name: "Example: Spark",
    tagline: "A single, simple collaboration.",
    includes: [
      "One short video or a set of story frames",
      "One round of feedback on the draft",
      "Clear disclosure that the post is a partnership",
    ],
    rate: "No rate set. Illustrative only.",
  },
  {
    name: "Example: Story",
    tagline: "A small series that follows a real planning step.",
    includes: [
      "Three pieces of content over one month",
      "A mention in the newsletter draft",
      "A short written summary of audience response",
    ],
    rate: "No rate set. Illustrative only.",
  },
  {
    name: "Example: Season",
    tagline: "A longer relationship across one celebration.",
    includes: [
      "A planned content arc across several months",
      "A dedicated journal entry",
      "A review call at the midpoint",
    ],
    rate: "No rate set. Illustrative only.",
  },
];

export const draftPrinciples: string[] = [
  "Paid or gifted content will be labeled clearly.",
  "Partnerships will be limited to products and services that fit a real planning need.",
  "Budget numbers shared publicly will be real, or labeled as examples.",
  "Family and wedding-party privacy comes before content.",
];

export const pitchSubject = "Partnership idea: multicultural three-country wedding planning";
export const pitchBody = `Hello,

I'm Tara, a bridal creator in the making. I'm planning wedding celebrations in India, Italy and America and sharing the planning process.

I'd like to talk about a possible collaboration with [brand or business].

[Add one sentence on why it fits the planning journey.]

I'd be glad to share a draft media kit.

Thank you,
Tara`;
