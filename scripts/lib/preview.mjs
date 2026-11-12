import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

export const DIST = path.resolve("dist");

export async function startPreview(port = 4321) {
  const base = `http://127.0.0.1:${port}`;
  const child = spawn("npx", ["astro", "preview", "--host", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let log = "";
  child.stdout.on("data", (chunk) => (log += chunk));
  child.stderr.on("data", (chunk) => (log += chunk));

  const started = Date.now();
  for (;;) {
    try {
      const response = await fetch(base);
      if (response.ok) break;
    } catch {
      /* not up yet */
    }
    if (Date.now() - started > 30000) {
      stop();
      throw new Error(`Preview did not start.\n${log}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  function stop() {
    try {
      process.kill(-child.pid);
    } catch {
      /* already gone */
    }
  }
  return { base, stop };
}

const CHROME_CANDIDATES = ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];

export async function launchBrowser() {
  const executablePath = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  return chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
}

/** Every built page as { route, slug } derived from dist/. */
export async function builtRoutes() {
  const routes = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(".html")) {
        const rel = path.relative(DIST, full).split(path.sep).join("/");
        if (rel === "index.html") routes.push({ route: "/", slug: "home" });
        else if (rel === "404.html") routes.push({ route: "/404", slug: "404" });
        else {
          const route = `/${rel.replace(/\/index\.html$/, "")}`;
          routes.push({ route, slug: route.slice(1).replace(/\//g, "--") });
        }
      }
    }
  }
  await walk(DIST);
  return routes.sort((a, b) => a.route.localeCompare(b.route));
}

/** Lazy images below the fold only load when scrolled near, so walk the page before a full-page capture. */
export async function loadAllImages(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 70));
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.getClientRects().length > 0)
        .map((image) =>
        image.complete && image.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
              setTimeout(resolve, 4000);
            }),
      ),
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((resolve) => setTimeout(resolve, 150));
    await document.fonts.ready;
  });
}
