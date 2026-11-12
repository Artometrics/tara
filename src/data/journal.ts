import type { Motif } from "./looks";
import type { CelebrationId } from "./site";

export type Section = { heading: string; body: string[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  celebration?: CelebrationId;
  motif: Motif;
  dek: string;
  intro: string;
  sections: Section[];
  checklist?: { title: string; items: string[] };
  placeholder: string;
};

export const draftNotice =
  "Starter draft. Written as a planning framework before any of it has happened. Tara will replace the bracketed prompts with her own experience before anything is published.";

export const posts: Post[] = [
  {
    slug: "lehenga-shopping-questions",
    title: "Lehenga Shopping: The Questions I'm Bringing to Every Appointment",
    category: "Outfits",
    celebration: "india",
    motif: "dupatta",
    dek: "Before the first fitting, a list of questions that will save money, time and a few tears.",
    intro:
      "A bridal outfit is part purchase, part commission and part family event. Going in with a list changes the conversation.",
    sections: [
      {
        heading: "Start with the calendar, not the color",
        body: [
          "Made-to-order pieces can take months, and alterations take more. Ask for the production timeline in writing and work backward from the event, adding a buffer for shipping and one extra fitting.",
          "If the outfit comes from overseas, ask who handles customs and what happens if something arrives late.",
        ],
      },
      {
        heading: "Ask what the price includes",
        body: [
          "A quote can leave out the blouse, the dupatta, the canvas lining or the tailoring. Ask for a line-by-line list so two quotes can actually be compared.",
          "Ask what the deposit covers, and what happens if the design changes.",
        ],
      },
      {
        heading: "Try it on like it is the day",
        body: [
          "Walk, sit, lift your arms and try a pretend hug. Weight and movement matter more than a still mirror suggests. Bring the shoes and jewelry you expect to wear.",
          "Take photos in daylight as well as shop lighting, because color shifts.",
        ],
      },
      {
        heading: "Rent, restyle or buy",
        body: [
          "Not every outfit needs to be bought new. Renting, borrowing a family piece or restyling an existing one can free up budget for something else. Ask early so the option stays open.",
        ],
      },
    ],
    checklist: {
      title: "Appointment checklist",
      items: [
        "Production timeline and last safe order date",
        "Itemized quote and what the deposit covers",
        "Alteration plan, including who does it and where",
        "Care, storage and transport instructions",
        "Cancellation and change terms, in writing",
      ],
    },
    placeholder: "[Tara: add your first real appointment here, what surprised you and what you would ask differently.]",
  },
  {
    slug: "italy-venue-scouting",
    title: "Scouting an Italian Venue from Far Away",
    category: "Planning",
    celebration: "italy",
    motif: "lemon",
    dek: "A checklist for judging a destination venue before you ever see it in person.",
    intro:
      "Falling for a venue on a screen is easy. This is the list for slowing down and asking the boring questions first.",
    sections: [
      {
        heading: "Separate beauty from logistics",
        body: [
          "Begin with what the venue can actually hold: guest count, indoor backup space, power, restrooms and parking or boat access. Pretty photographs rarely answer any of these.",
          "Ask what a normal weekend looks like. Are other events happening on-site? Is the venue exclusive for your dates?",
        ],
      },
      {
        heading: "Ask about the paperwork early",
        body: [
          "Legal requirements for marrying abroad change, and differ between a legal and a symbolic ceremony. Check with official government sources and a qualified local professional rather than relying on a blog, including this one.",
        ],
      },
      {
        heading: "Think about the guest journey",
        body: [
          "A beautiful place that takes two flights and a long drive is a big ask. Map out how a typical guest would arrive, where they would sleep and how they would get back after the party.",
          "A smaller guest list is a perfectly good answer to this problem.",
        ],
      },
      {
        heading: "Use a short video call",
        body: [
          "Ask the venue contact to walk the grounds on video at the time of day you want the ceremony. Look at where the sun falls, how the ground feels for shoes and how far each space is from the next.",
        ],
      },
    ],
    checklist: {
      title: "Venue shortlist questions",
      items: [
        "Maximum guest count, seated and standing",
        "Indoor backup plan for rain and heat",
        "Exclusive use of the venue, and for how many hours",
        "Included and required vendors, and what they cost",
        "Music, noise and end-time restrictions",
        "Nearest accommodation and transport options",
      ],
    },
    placeholder: "[Tara: add your real shortlist, regions you are considering, and why.]",
  },
  {
    slug: "fusion-ceremonies",
    title: "Fusion Ceremonies: Letting Two Traditions Share One Day",
    category: "Ceremony",
    celebration: "america",
    motif: "arch",
    dek: "Ideas for blending cultures without turning either into a theme.",
    intro:
      "The aim of a fusion ceremony is to feel like a family, not a costume change. Here is a framework for deciding what goes where.",
    sections: [
      {
        heading: "Decide what is non-negotiable",
        body: [
          "Start with the moments that matter most to each family and to the couple. Write them down separately before looking at any inspiration photos.",
          "Everything else is flexible, and that is where creative blending happens.",
        ],
      },
      {
        heading: "Blend through details before structure",
        body: [
          "Color, flowers, music, food and language are easy places to weave cultures together. A ceremony structure is harder to blend and usually works better as a clear sequence of distinct moments.",
        ],
      },
      {
        heading: "Explain without lecturing",
        body: [
          "Guests unfamiliar with a tradition appreciate a short note in the program or a few words from a family member. Keep it warm and short.",
        ],
      },
      {
        heading: "Ask the elders early",
        body: [
          "Include the people who hold the traditions in the planning. Early conversations are cheaper than late surprises.",
        ],
      },
    ],
    placeholder: "[Tara: describe the traditions in your own family and what you want to keep.]",
  },
  {
    slug: "budget-diary-zero",
    title: "Budget Diary #0: Planning Three Weddings Before Booking Anything",
    category: "Budget",
    motif: "table",
    dek: "How to build a budget skeleton before a single vendor email goes out.",
    intro:
      "This is the entry before the money moves. It is about building the sheet, not the spending.",
    sections: [
      {
        heading: "Three celebrations, three envelopes",
        body: [
          "Give India, Italy and America their own budget lines, plus a shared line for things that cross over, such as photography, planning tools and travel. Seeing them separately makes tradeoffs visible.",
        ],
      },
      {
        heading: "Rank, then cut",
        body: [
          "Write down the five things that matter most to you and the five that matter least. When the totals come in, cut from the bottom of the list first.",
        ],
      },
      {
        heading: "Treat creator income as uncertain",
        body: [
          "Any money that might come from content, affiliate links or sponsorships should be treated as a bonus, not as a plan. Build the budget so it works at zero, and let anything earned reduce the strain.",
        ],
      },
      {
        heading: "Keep a buffer",
        body: [
          "Set aside a portion for costs nobody predicted, such as alterations, shipping and exchange-rate shifts. Decide the size of the buffer in advance rather than negotiating with yourself later.",
        ],
      },
    ],
    checklist: {
      title: "The skeleton sheet",
      items: [
        "One tab per celebration plus one shared tab",
        "Columns: item, estimate, actual, paid, deposit due, notes",
        "A top-five and bottom-five priority list",
        "A line for creator income, defaulting to zero",
        "A buffer line with a fixed percentage",
      ],
    },
    placeholder: "[Tara: decide how much of the real numbers to share publicly, and add the first real entry.]",
  },
  {
    slug: "creating-with-a-day-job",
    title: "Making Content Around a Full-Time Job",
    category: "Creator life",
    motif: "marigold",
    dek: "A realistic rhythm for building an audience in the margins of a working week.",
    intro:
      "Tara works in business and care coordination. The plan for this site has to fit around that, not replace it.",
    sections: [
      {
        heading: "Batch what you can",
        body: [
          "Film several short pieces in one session, and write captions in advance. One focused weekend block can feed a couple of weeks of posting.",
        ],
      },
      {
        heading: "Pick one anchor format",
        body: [
          "A repeating series makes content easier to plan and easier for an audience to follow. Weekly planning updates or a monthly budget diary are good candidates.",
        ],
      },
      {
        heading: "Protect your time off",
        body: [
          "Wedding planning is already a second job. Decide in advance which hours are off limits to content, and keep to that.",
        ],
      },
      {
        heading: "Check your employer's rules",
        body: [
          "Many workplaces have policies about outside work and sponsorships. Read the relevant policies before accepting paid partnerships, and keep work and content clearly separate.",
        ],
      },
    ],
    placeholder: "[Tara: add what an actual week looks like, if and when you want to share it.]",
  },
  {
    slug: "three-outfit-plan",
    title: "The Three-Dress Question: Outfits Across Three Celebrations",
    category: "Outfits",
    motif: "veil",
    dek: "How to plan a wardrobe for several events without buying several of everything.",
    intro:
      "Between India, Italy and America, the outfit list can feel endless. This is a way to count what you really need.",
    sections: [
      {
        heading: "List every moment, then merge",
        body: [
          "Write down each event and each outfit. Then look for overlaps: pieces that can be restyled, borrowed or worn twice with different accessories.",
        ],
      },
      {
        heading: "Choose one hero piece per celebration",
        body: [
          "Put the biggest part of the budget behind one outfit per celebration, and keep the rest simpler. It keeps the story clear and the spending sane.",
        ],
      },
      {
        heading: "Plan for travel",
        body: [
          "Fabric choices matter a lot when you are packing. Ask about creasing, weight and what the garment bag situation looks like on a plane.",
        ],
      },
      {
        heading: "Document the decisions",
        body: [
          "A simple spreadsheet or board with photos, costs and dates makes decisions easier and gives a creator an easy content backbone.",
        ],
      },
    ],
    checklist: {
      title: "Outfit planner columns",
      items: [
        "Celebration and event",
        "Outfit idea and source type: buy, rent, borrow or restyle",
        "Budget and actual cost",
        "Lead time and last safe order date",
        "Alterations, transport and storage",
      ],
    },
    placeholder: "[Tara: add the outfits you actually shortlist and what each one taught you.]",
  },
];

export const getPost = (slug: string): Post => {
  const found = posts.find((post) => post.slug === slug);
  if (!found) throw new Error(`Unknown post: ${slug}`);
  return found;
};

export const wordCount = (post: Post): number => {
  const text = [
    post.intro,
    ...post.sections.flatMap((section) => [section.heading, ...section.body]),
    ...(post.checklist?.items ?? []),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
};

export const readingMinutes = (post: Post): number => Math.max(1, Math.round(wordCount(post) / 200));
