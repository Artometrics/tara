// Browser QA against the built site: every page at 320, 390 and 1440 wide, plus interactions.
import { builtRoutes, launchBrowser, loadAllImages, startPreview } from "./lib/preview.mjs";

const routes = await builtRoutes();
const server = await startPreview(4323);
const browser = await launchBrowser();
const failures = [];
const fail = (message) => failures.push(message);
const check = (condition, message) => {
  if (!condition) fail(message);
};

const FORBIDDEN = /prism|pollen|d[ôo]en|spotify|\balbum\b|\bsong\b|checkout|add to (cart|bag)|\$\s?\d/i;

async function sweep(width, height) {
  const label = `${width}px`;
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const remote = [];
  page.on("request", (request) => {
    const host = new URL(request.url()).hostname;
    if (host !== "127.0.0.1" && host !== "localhost") remote.push(request.url());
  });
  page.on("pageerror", (error) => fail(`${label} pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") fail(`${label} console error: ${message.text()}`);
  });

  for (const { route } of routes) {
    await page.goto(`${server.base}${route}`, { waitUntil: "networkidle" });
    await loadAllImages(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(overflow <= 0, `${label} ${route}: horizontal overflow of ${overflow}px`);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    check(robots?.includes("noindex"), `${label} ${route}: missing noindex`);
    check((await page.locator("h1").count()) === 1, `${label} ${route}: expected exactly one h1`);
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((image) => image.getClientRects().length > 0 && !(image.complete && image.naturalWidth > 0))
        .map((image) => image.currentSrc || image.src),
    );
    check(broken.length === 0, `${label} ${route}: images did not load: ${broken.join(", ")}`);
    const text = await page.locator("body").innerText();
    const hit = text.match(FORBIDDEN);
    check(!hit, `${label} ${route}: forbidden text "${hit?.[0]}"`);
    const unlabeled = await page.evaluate(() =>
      Array.from(document.images).filter((image) => image.getAttribute("alt") === null).length,
    );
    check(unlabeled === 0, `${label} ${route}: ${unlabeled} images without alt attribute`);
  }
  check(remote.length === 0, `${label}: remote requests: ${remote.join(", ")}`);
  await context.close();
}

async function interactions() {
  // Mobile menu
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(server.base, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await menu.waitFor({ state: "visible" });
    check((await page.locator("#menu-button").getAttribute("aria-expanded")) === "true", "mobile menu aria-expanded");
    await menu.getByRole("button", { name: /The Weddings/ }).click();
    await menu.getByRole("link", { name: "Italy", exact: true }).click();
    await page.waitForURL("**/weddings#italy");
    await context.close();
  }

  // Desktop mega menu
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(server.base, { waitUntil: "networkidle" });
    await page.locator("#weddings-button").hover();
    await page.locator("#mega-weddings").waitFor({ state: "visible" });
    check((await page.locator("#weddings-button").getAttribute("aria-expanded")) === "true", "mega aria-expanded");
    await page.keyboard.press("Escape");
    check(!(await page.locator("#mega-weddings").isVisible()), "Escape should close mega menu");
    await page.locator("#lookbook-button").click();
    await page.locator("#mega-lookbook").getByRole("link", { name: "India looks" }).click();
    await page.waitForURL("**/lookbook?celebration=india");
    const visible = await page.locator("[data-card]:not([hidden])").count();
    check(visible === 3, `India filter via menu should show 3 looks, saw ${visible}`);
    await context.close();
  }

  // Lookbook filter drawer, URL state, sort
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${server.base}/lookbook`, { waitUntil: "networkidle" });
    const total = await page.locator("[data-card]").count();
    check(total === 8, `expected 8 looks, saw ${total}`);
    await page.getByRole("button", { name: "Filter & sort" }).click();
    const drawer = page.getByRole("dialog", { name: "Filter & sort" });
    await drawer.waitFor({ state: "visible" });
    await drawer.getByLabel("Italy").check();
    await drawer.getByLabel("Pre-wedding event").check();
    await drawer.getByRole("button", { name: "Apply" }).click();
    check((await page.locator("[data-card]:not([hidden])").count()) === 2, "Italy + pre-wedding should show 2 looks");
    check(page.url().includes("celebration=italy") && page.url().includes("moment=pre-wedding"), "filter state should be in URL");
    await page.getByRole("button", { name: "Filter & sort" }).click();
    await drawer.getByLabel("Ceremony").check();
    await drawer.getByLabel("Pre-wedding event").uncheck();
    await drawer.getByRole("button", { name: "Apply" }).click();
    check((await page.locator("[data-card]:not([hidden])").count()) === 1, "Italy + ceremony should show 1 look");
    await page.getByRole("button", { name: "Filter & sort" }).click();
    await drawer.getByRole("button", { name: "Clear all" }).click();
    await drawer.getByRole("button", { name: "A to Z" }).click();
    await drawer.getByRole("button", { name: "Apply" }).click();
    const first = await page.locator("[data-card]:not([hidden]) h2").first().innerText();
    check(first === "Blush Lehenga & Net Dupatta", `A to Z should start with Blush Lehenga, saw ${first}`);
    await page.goto(`${server.base}/lookbook?celebration=america&moment=nonsense`, { waitUntil: "networkidle" });
    check((await page.locator("[data-card]:not([hidden])").count()) === 2, "URL filter should show 2 America looks and ignore junk values");
    await context.close();
  }

  // Look detail tabs
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${server.base}/lookbook/ivory-aisle-gown`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Questions" }).click();
    check(await page.locator("#panel-questions").isVisible(), "Questions tab should show its panel");
    check(!(await page.locator("#panel-why").isVisible()), "Why panel should hide");
    await context.close();
  }

  // Newsletter (footer + page), localStorage only
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const posts = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") posts.push(request.url());
    });
    await page.goto(`${server.base}/newsletter`, { waitUntil: "networkidle" });
    check((await page.locator("[data-newsletter-form]").count()) === 1, "newsletter page should have exactly one form");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: /Save my spot/ }).click();
    check(/does not look right/.test(await page.locator("[data-newsletter-status]").innerText()), "invalid email message");
    await page.getByLabel("Email").fill("Friend@Example.com");
    await page.getByLabel(/Name/).fill("Friend");
    await page.getByRole("button", { name: /Save my spot/ }).click();
    check(/Saved in this browser only/.test(await page.locator("[data-newsletter-status]").innerText()), "saved message");
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("tara.newsletter-draft.v1") ?? "[]"));
    check(stored.length === 1 && stored[0].email === "friend@example.com", "signup stored lowercase in localStorage");
    check((await page.locator("[data-saved-count]").innerText()) === "1", "saved count shown");
    const href = await page.locator("[data-newsletter-mail-link]").getAttribute("href");
    check(href?.startsWith("mailto:") && href.includes("friend%40example.com"), "mailto draft includes email");
    await page.reload({ waitUntil: "networkidle" });
    check((await page.locator("[data-saved-count]").innerText()) === "1", "signup persists after reload");
    await page.getByRole("button", { name: "Clear saved signups" }).click();
    check((await page.evaluate(() => localStorage.getItem("tara.newsletter-draft.v1"))) === null, "clear removes storage");
    check(posts.length === 0, `no non-GET requests expected, saw ${posts.join(", ")}`);

    await page.goto(server.base, { waitUntil: "networkidle" });
    await page.locator("#stay input[type=email]").fill("footer@example.com");
    await page.locator("#stay").getByRole("button", { name: /Save my spot/ }).click();
    check(/Saved in this browser only/.test(await page.locator("#stay [data-newsletter-status]").innerText()), "footer signup saved");
    await context.close();
  }

  // Skip link focus
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(server.base, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      return { text: el?.textContent?.trim(), outline: el ? getComputedStyle(el).outlineStyle : "none" };
    });
    check(focus.text === "Skip to content" && focus.outline !== "none", "skip link should be first focus with visible outline");
    await context.close();
  }
}

try {
  for (const [width, height] of [[320, 640], [390, 844], [1440, 900]]) await sweep(width, height);
  await interactions();
} catch (error) {
  fail(`QA crashed: ${error.stack ?? error}`);
} finally {
  await browser.close();
  server.stop();
}

if (failures.length) {
  console.error(failures.map((message) => `- ${message}`).join("\n"));
  process.exit(1);
}
console.log(`Browser QA passed: ${routes.length} pages at 320, 390 and 1440 wide, plus menu, filter, tabs and newsletter interactions.`);
