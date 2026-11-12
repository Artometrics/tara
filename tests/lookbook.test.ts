import { describe, expect, it } from "vitest";
import { looks } from "../src/data/looks";
import {
  applyQuery,
  emptyQuery,
  isActive,
  matches,
  queryFromParams,
  queryToParams,
} from "../src/lib/lookbook";

describe("lookbook filtering", () => {
  it("returns every look, in curated order, for an empty query", () => {
    expect(applyQuery(looks, emptyQuery()).map((look) => look.slug)).toEqual(looks.map((look) => look.slug));
  });

  it("filters by celebration", () => {
    const query = { ...emptyQuery(), celebrations: ["india" as const] };
    const result = applyQuery(looks, query);
    expect(result).toHaveLength(3);
    expect(result.every((look) => look.celebration === "india")).toBe(true);
  });

  it("combines groups with AND and values inside a group with OR", () => {
    const query = {
      ...emptyQuery(),
      celebrations: ["india" as const, "italy" as const],
      moments: ["ceremony" as const],
    };
    const result = applyQuery(looks, query);
    expect(result.map((look) => look.slug).sort()).toEqual(
      ["blush-lehenga-net-dupatta", "red-and-gold-ceremony", "silk-column-and-cathedral-veil"].sort(),
    );
  });

  it("filters by color story when any palette key overlaps", () => {
    const query = { ...emptyQuery(), palettes: ["terracotta" as const] };
    const result = applyQuery(looks, query);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((look) => look.palette.includes("terracotta"))).toBe(true);
  });

  it("sorts A to Z without mutating the source", () => {
    const before = looks.map((look) => look.slug);
    const sorted = applyQuery(looks, { ...emptyQuery(), sort: "az" });
    const titles = sorted.map((look) => look.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
    expect(looks.map((look) => look.slug)).toEqual(before);
  });

  it("returns nothing when no look matches", () => {
    const query = { ...emptyQuery(), celebrations: ["america" as const], moments: ["pre-wedding" as const] };
    expect(applyQuery(looks, query)).toEqual([]);
    expect(matches(looks[0], query)).toBe(false);
  });
});

describe("lookbook URL state", () => {
  it("round-trips a query through URL params", () => {
    const query = {
      celebrations: ["italy" as const],
      moments: ["ceremony" as const, "reception" as const],
      palettes: ["ivory" as const],
      sort: "az" as const,
    };
    expect(queryFromParams(queryToParams(query))).toEqual(query);
  });

  it("drops unknown values instead of trusting the URL", () => {
    const params = new URLSearchParams("celebration=india,mars&moment=<script>&palette=&sort=price");
    expect(queryFromParams(params)).toEqual({ celebrations: ["india"], moments: [], palettes: [], sort: "curated" });
  });

  it("reports whether a query narrows the grid", () => {
    expect(isActive(emptyQuery())).toBe(false);
    expect(isActive({ ...emptyQuery(), sort: "az" })).toBe(true);
    expect(isActive({ ...emptyQuery(), moments: ["ceremony"] })).toBe(true);
    expect(queryToParams(emptyQuery()).toString()).toBe("");
  });
});
