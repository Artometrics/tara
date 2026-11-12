// Re-encodes the AI-generated bridal images from assets/source-images/bridal
// into public/images/bridal as webp + jpeg at two widths. Never upscales.
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const srcDir = path.resolve("assets/source-images/bridal");
const outDir = path.resolve("public/images/bridal");
const MAX_WIDTH = 1600;
const SMALL_WIDTH = 640;

await mkdir(outDir, { recursive: true });
const files = (await readdir(srcDir)).filter((name) => /\.(jpe?g|png)$/i.test(name));
const report = [];

for (const file of files) {
  const base = path.parse(file).name;
  const input = sharp(path.join(srcDir, file)).rotate();
  const meta = await input.metadata();
  const fullWidth = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);
  const smallWidth = Math.min(SMALL_WIDTH, fullWidth);

  for (const [suffix, width] of [["", fullWidth], ["-640", smallWidth]]) {
    const pipeline = () => input.clone().resize({ width, withoutEnlargement: true });
    await pipeline().webp({ quality: 70, effort: 6, smartSubsample: true }).toFile(path.join(outDir, `${base}${suffix}.webp`));
    await pipeline().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(outDir, `${base}${suffix}.jpg`));
  }
  report.push({ base, source: `${meta.width}x${meta.height}`, widths: [fullWidth, smallWidth] });
}

console.table(report);
