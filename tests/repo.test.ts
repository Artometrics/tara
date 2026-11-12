import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { images } from "../src/data/images";

const root = path.resolve(__dirname, "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe("indexing and hosting", () => {
  it("keeps robots.txt disallowing everything", () => {
    expect(read("public/robots.txt")).toMatch(/User-agent: \*\s+Disallow: \//);
  });

  it("sends noindex from the document shell", () => {
    expect(read("src/components/Base.astro")).toMatch(/<meta name="robots" content="noindex, nofollow, noarchive"/);
  });

  it("sends X-Robots-Tag from firebase.json, netlify.toml and public/_headers", () => {
    const firebase = JSON.parse(read("firebase.json"));
    const values = JSON.stringify(firebase.hosting.headers);
    expect(values).toContain("X-Robots-Tag");
    expect(values).toContain("noindex");
    expect(read("netlify.toml")).toMatch(/X-Robots-Tag\s*=\s*"noindex/);
    expect(read("public/_headers")).toMatch(/X-Robots-Tag: noindex/);
  });

  it("hosts dist/ on Firebase with no site name or project hardcoded", () => {
    const firebase = JSON.parse(read("firebase.json"));
    expect(firebase.hosting.public).toBe("dist");
    expect(firebase.hosting.site).toBeUndefined();
    expect(existsSync(path.join(root, ".firebaserc"))).toBe(false);
    expect(read("firebase.json")).not.toMatch(/prism|pollen|tara-/i);
  });

  it("builds the Astro site on Netlify from dist/", () => {
    const netlify = read("netlify.toml");
    expect(netlify).toMatch(/command\s*=\s*"npm run build"/);
    expect(netlify).toMatch(/publish\s*=\s*"dist"/);
    expect(netlify).toMatch(/NODE_VERSION\s*=\s*"22"/);
    expect(JSON.parse(read("package.json")).scripts.build).toBe("astro build");
  });
});

describe("previous brand and music content are gone", () => {
  const textFiles = [
    ...walk(path.join(root, "src")),
    ...walk(path.join(root, "docs")).filter((file) => file.endsWith(".md")),
    ...walk(path.join(root, ".cursor")),
    ...["README.md", "AGENTS.md", "CLAUDE.md", "package.json", "firebase.json", "netlify.toml"].map((f) => path.join(root, f)),
  ];

  it("has no previous-brand, music or storefront references in source or docs", () => {
    const offenders = textFiles
      .filter((file) => /prism|pollen|d[ôo]en|spotify|singer-songwriter|\balbum\b/i.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(root, file));
    expect(offenders).toEqual([]);
  });

  it("ships no leftover product photography or storefront code", () => {
    for (const dir of ["public/campaign", "public/reference", "public/brand", "src/lib/cart.ts", "src/data/catalog.ts"]) {
      expect(existsSync(path.join(root, dir))).toBe(false);
    }
    const publicFiles = walk(path.join(root, "public")).map((file) => path.relative(root, file));
    for (const file of publicFiles) {
      expect(file).toMatch(/^public\/(_headers|robots\.txt|favicon\.svg|images\/bridal\/[a-z0-9-]+\.(jpg|webp))$/);
    }
  });
});

describe("bridal images", () => {
  for (const image of Object.values(images)) {
    it(`${image.key} has webp and jpeg at full and small width, within 1600px`, async () => {
      for (const ext of ["webp", "jpg"]) {
        for (const suffix of ["", `-${image.small}`]) {
          const file = path.join(root, `public${image.base}${suffix}.${ext}`);
          expect(existsSync(file), file).toBe(true);
          const meta = await sharp(file).metadata();
          expect(meta.width ?? 0).toBeLessThanOrEqual(1600);
          if (suffix === "") {
            expect(meta.width).toBe(image.width);
            expect(meta.height).toBe(image.height);
          } else {
            expect(meta.width).toBe(image.small);
          }
        }
      }
    });

    it(`${image.key} is described as AI-generated, not a photo of Tara`, () => {
      expect(image.alt).toMatch(/AI-generated/);
      expect(image.alt).toMatch(/not a photo of Tara/);
    });
  }

  it("documents every image in docs/IMAGE-SLOTS.md", () => {
    const doc = read("docs/IMAGE-SLOTS.md");
    for (const image of Object.values(images)) expect(doc).toContain(path.basename(image.base));
    expect(doc).toMatch(/AI-generated/);
    expect(doc).toMatch(/not photos? of Tara/i);
  });
});

describe("docs", () => {
  it("has a playbook without guaranteed-income claims", () => {
    const playbook = read("docs/PLAYBOOK.md");
    expect(playbook.length).toBeGreaterThan(5000);
    expect(playbook).toMatch(/no guaranteed income|not guaranteed|no guarantee/i);
    expect(playbook).not.toMatch(/you will (earn|make)/i);
  });
});
