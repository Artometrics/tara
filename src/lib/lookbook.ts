import type { CelebrationId } from "../data/site";
import type { Moment, PaletteKey } from "../data/looks";

export type SortKey = "curated" | "az";

export type LookFacts = {
  slug: string;
  title: string;
  celebration: CelebrationId;
  moment: Moment;
  palette: PaletteKey[];
};

export type LookQuery = {
  celebrations: CelebrationId[];
  moments: Moment[];
  palettes: PaletteKey[];
  sort: SortKey;
};

export const emptyQuery = (): LookQuery => ({ celebrations: [], moments: [], palettes: [], sort: "curated" });

const celebrationIds: CelebrationId[] = ["india", "italy", "america"];
const momentIds: Moment[] = ["ceremony", "pre-wedding", "reception"];
const paletteIds: PaletteKey[] = ["ivory", "blush", "marigold", "terracotta"];

const pick = <T extends string>(raw: string | null, allowed: readonly T[]): T[] =>
  (raw ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is T => (allowed as readonly string[]).includes(value));

export function queryFromParams(params: URLSearchParams): LookQuery {
  return {
    celebrations: pick(params.get("celebration"), celebrationIds),
    moments: pick(params.get("moment"), momentIds),
    palettes: pick(params.get("palette"), paletteIds),
    sort: params.get("sort") === "az" ? "az" : "curated",
  };
}

export function queryToParams(query: LookQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.celebrations.length) params.set("celebration", query.celebrations.join(","));
  if (query.moments.length) params.set("moment", query.moments.join(","));
  if (query.palettes.length) params.set("palette", query.palettes.join(","));
  if (query.sort !== "curated") params.set("sort", query.sort);
  return params;
}

export function isActive(query: LookQuery): boolean {
  return query.celebrations.length + query.moments.length + query.palettes.length > 0 || query.sort !== "curated";
}

export function matches(look: LookFacts, query: LookQuery): boolean {
  if (query.celebrations.length && !query.celebrations.includes(look.celebration)) return false;
  if (query.moments.length && !query.moments.includes(look.moment)) return false;
  if (query.palettes.length && !query.palettes.some((key) => look.palette.includes(key))) return false;
  return true;
}

export function applyQuery<T extends LookFacts>(items: readonly T[], query: LookQuery): T[] {
  const kept = items.filter((item) => matches(item, query));
  if (query.sort === "az") return [...kept].sort((a, b) => a.title.localeCompare(b.title));
  return kept;
}
