// Verifies every internal link, image and srcset candidate in dist/ resolves, anchors exist,
// every page carries noindex, and no page loads anything from a remote host.
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const htmlFiles = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

const exists = (file) => access(file).then(() => true, () => false);

async function resolveTarget(pathname) {
  const rel = decodeURIComponent(pathname).replace(/^\//, "");
  const candidates = rel === "" ? ["index.html"] : [rel, path.join(rel, "index.html"), `${rel}.html`];
  for (const candidate of candidates) {
    const full = path.join(dist, candidate);
    if ((await exists(full)) && !(await readdir(full).then(() => true, () => false))) return full;
    if (await exists(full)) {
      const index = path.join(full, "index.html");
      if (await exists(index)) return index;
    }
  }
  return null;
}

await walk(dist);
const problems = [];
const remote = [];
const idCache = new Map();

async function idsFor(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
  }
  return idCache.get(file);
}

const refRe = /\s(?:href|src|poster)="([^"]*)"/g;
const srcsetRe = /\ssrcset="([^"]*)"/g;

for (const file of htmlFiles) {
  const rel = path.relative(dist, file);
  const html = await readFile(file, "utf8");
  if (!/<meta name="robots" content="noindex/.test(html)) problems.push(`${rel}: missing noindex meta`);

  const refs = [...html.matchAll(refRe)].map((match) => match[1]);
  for (const match of html.matchAll(srcsetRe)) {
    for (const candidate of match[1].split(",")) refs.push(candidate.trim().split(/\s+/)[0]);
  }

  for (const value of refs) {
    if (!value || value.startsWith("mailto:") || value.startsWith("data:")) continue;
    if (/^(https?:)?\/\//.test(value)) {
      remote.push(`${rel} -> ${value}`);
      continue;
    }
    const url = new URL(value, "http://local/" + (rel === "index.html" ? "" : rel.replace(/index\.html$/, "")));
    const target = value.startsWith("#") ? file : await resolveTarget(url.pathname);
    if (!target) {
      problems.push(`${rel}: ${value} does not resolve`);
      continue;
    }
    if (url.hash && target.endsWith(".html")) {
      const ids = await idsFor(target);
      if (!ids.has(url.hash.slice(1))) problems.push(`${rel}: ${value} anchor not found`);
    }
  }
}

if (remote.length || problems.length) {
  console.error(JSON.stringify({ remote, problems }, null, 2));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} HTML files. Links, images, srcset and anchors resolve. noindex on every page. No remote URLs.`);
