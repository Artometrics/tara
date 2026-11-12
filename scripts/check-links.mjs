import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const htmlFiles = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function localPath(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) return null;
  const rel = clean.replace(/^\//, "");
  if (rel === "") return path.join(dist, "index.html");
  return path.join(dist, rel, "index.html");
}

await walk(dist);
const missing = [];
const external = [];
const hrefRe = /(?:href|src)="([^"]+)"/g;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (!html.includes('name="robots" content="noindex')) {
    missing.push(`${path.relative(dist, file)} missing noindex`);
  }
  for (const match of html.matchAll(hrefRe)) {
    const value = match[1];
    if (value.startsWith("mailto:") || value.startsWith("tel:") || value.startsWith("#") || value.startsWith("data:")) {
      continue;
    }
    if (/^https?:\/\//.test(value)) {
      external.push(`${path.relative(dist, file)} -> ${value}`);
      continue;
    }
    if (!value.startsWith("/")) continue;
    const target = localPath(value);
    if (!target) continue;
    try {
      await readFile(target);
    } catch {
      const fileTarget = value.endsWith(".svg") || value.includes(".")
        ? path.join(dist, value.replace(/^\//, ""))
        : null;
      if (fileTarget) {
        try {
          await readFile(fileTarget);
          continue;
        } catch {
          missing.push(`${path.relative(dist, file)} -> ${value}`);
          continue;
        }
      }
      missing.push(`${path.relative(dist, file)} -> ${value}`);
    }
  }
}

if (external.length || missing.length) {
  console.error(JSON.stringify({ external, missing }, null, 2));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files. Internal links resolve. No remote URLs.`);
