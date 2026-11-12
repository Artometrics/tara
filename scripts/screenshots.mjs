// Full-page screenshots of every built page at 1440x900 and 390x844.
// Usage: npm run build && npm run screenshots   (OUT_DIR overrides docs/screenshots)
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { builtRoutes, launchBrowser, loadAllImages, startPreview } from "./lib/preview.mjs";

const out = path.resolve(process.env.OUT_DIR ?? "docs/screenshots");
const viewports = [
  { dir: "desktop-1440x900", width: 1440, height: 900 },
  { dir: "mobile-390x844", width: 390, height: 844 },
];

const routes = await builtRoutes();
const server = await startPreview(4322);
const browser = await launchBrowser();
try {
  for (const viewport of viewports) {
    const dir = path.join(out, viewport.dir);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    for (const { route, slug } of routes) {
      await page.goto(`${server.base}${route}`, { waitUntil: "networkidle" });
      await loadAllImages(page);
      const shot = await page.screenshot({ fullPage: true });
      // Palette PNG keeps 44 full-page captures small enough to commit.
      await sharp(shot).png({ palette: true, quality: 82, effort: 8 }).toFile(path.join(dir, `${slug}.png`));
    }
    await context.close();
    console.log(`${viewport.dir}: ${routes.length} pages`);
  }
} finally {
  await browser.close();
  server.stop();
}
