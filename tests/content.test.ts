import { describe, expect, it } from "vitest";
import { images } from "../src/data/images";
import { posts, readingMinutes } from "../src/data/journal";
import { getLook, looks, neighbors } from "../src/data/looks";
import { exampleTiers, mediaKit } from "../src/data/partner";
import { celebrations, lookbookMenu, weddingsMenu } from "../src/data/site";

describe("looks", () => {
  it("has unique slugs and only known celebrations", () => {
    const slugs = looks.map((look) => look.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const ids = celebrations.map((item) => item.id);
    for (const look of looks) expect(ids).toContain(look.celebration);
  });

  it("covers all three celebrations", () => {
    for (const item of celebrations) expect(looks.some((look) => look.celebration === item.id)).toBe(true);
  });

  it("references real image slots only", () => {
    for (const look of looks) if (look.image) expect(images[look.image]).toBeDefined();
  });

  it("gives every look questions, notes and a palette", () => {
    for (const look of looks) {
      expect(look.questions.length).toBeGreaterThan(0);
      expect(look.whyItsHere.length).toBeGreaterThan(0);
      expect(look.palette.length).toBeGreaterThan(0);
    }
  });

  it("wraps previous and next around the ends", () => {
    expect(neighbors(looks[0].slug).prev.slug).toBe(looks[looks.length - 1].slug);
    expect(neighbors(looks[looks.length - 1].slug).next.slug).toBe(looks[0].slug);
    expect(() => getLook("missing")).toThrow();
  });
});

describe("journal", () => {
  it("has exactly six starter drafts with unique slugs", () => {
    expect(posts).toHaveLength(6);
    expect(new Set(posts.map((post) => post.slug)).size).toBe(6);
  });

  it("covers the requested topics", () => {
    const text = posts.map((post) => post.title.toLowerCase()).join(" | ");
    for (const topic of ["lehenga", "italian venue", "fusion", "budget"]) expect(text).toContain(topic);
  });

  it("marks every draft with a placeholder for Tara's own words", () => {
    for (const post of posts) {
      expect(post.placeholder).toMatch(/^\[Tara:/);
      expect(readingMinutes(post)).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("menus", () => {
  const slugs = new Set(posts.map((post) => post.slug));
  it("links planning notes to journal drafts that exist", () => {
    for (const link of weddingsMenu.flatMap((column) => column.links)) {
      const match = link.href.match(/^\/journal\/(.+)$/);
      if (match) expect(slugs.has(match[1])).toBe(true);
    }
  });

  it("only filters the lookbook by values the lookbook understands", () => {
    for (const link of lookbookMenu.flatMap((column) => column.links)) {
      const query = link.href.split("?")[1];
      if (!query) continue;
      const params = new URLSearchParams(query);
      for (const value of params.getAll("celebration")) expect(celebrations.map((c) => c.id)).toContain(value);
      for (const value of params.getAll("moment")) expect(["ceremony", "pre-wedding", "reception"]).toContain(value);
    }
  });
});

describe("partner page honesty", () => {
  it("labels every package as an example with no rate", () => {
    expect(exampleTiers.length).toBeGreaterThanOrEqual(3);
    for (const tier of exampleTiers) {
      expect(tier.name).toMatch(/^Example/);
      expect(tier.rate).toMatch(/no rate set/i);
      expect(tier.rate).not.toMatch(/\d/);
    }
  });

  it("does not invent audience numbers", () => {
    const text = mediaKit.map((row) => `${row.label}: ${row.value}`).join("\n");
    expect(text).not.toMatch(/\d[\d,.]*\s?(k|m|%|followers)/i);
    expect(text).toMatch(/not available yet/i);
  });
});

describe("copy hygiene", () => {
  const everything = JSON.stringify({ looks, posts, celebrations, mediaKit, exampleTiers });
  it("has no music, shop, or previous-brand language", () => {
    for (const pattern of [/spotify/i, /\balbum\b/i, /\bsong/i, /\bprism\b/i, /\bpollen\b/i, /d[ôo]en/i, /add to (cart|bag)/i, /checkout/i]) {
      expect(everything).not.toMatch(pattern);
    }
  });

  it("has no prices, guaranteed income, or earnings claims", () => {
    expect(everything).not.toMatch(/\$\s?\d/);
    expect(everything).not.toMatch(/guarantee/i);
    expect(everything).not.toMatch(/\bearn(s|ed)? \d/i);
  });
});
