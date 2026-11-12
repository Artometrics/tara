import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4321";
const shotDir = "/opt/cursor/artifacts/prism-pollen";
await mkdir(shotDir, { recursive: true });

const preview = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4321"], {
  stdio: ["ignore", "pipe", "pipe"],
  detached: true,
});
let previewLog = "";
preview.stdout.on("data", (chunk) => {
  previewLog += chunk.toString();
});
preview.stderr.on("data", (chunk) => {
  previewLog += chunk.toString();
});

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 30000) {
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`Preview did not start.\n${previewLog}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await waitForServer();
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const failures = [];

async function shot(page, name) {
  await page.screenshot({ path: path.join(shotDir, `${name}.png`), fullPage: true });
}

async function shotView(page, name) {
  await page.screenshot({ path: path.join(shotDir, `${name}.png`), fullPage: false });
}

async function overflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

async function exercise(width, height, label) {
  const page = await browser.newPage({ viewport: { width, height } });
  const remote = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") remote.push(request.url());
  });
  page.on("pageerror", (error) => failures.push(`${label} pageerror ${error.message}`));
  try {
    await page.goto(base, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement);
      return { outline: style.outlineStyle, name: document.activeElement?.textContent?.trim() ?? "" };
    });
    assert(focus.outline !== "none", `${label} skip link has no focus outline`);
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    assert((await overflow(page)) <= 1, `${label} home overflows`);
    await shot(page, `${label}-home`);

    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    assert(robots?.includes("noindex"), `${label} missing noindex`);
    const homeText = await page.locator("body").innerText();
    assert(/prism\s*&\s*pollen/i.test(homeText), `${label} wordmark`);
    assert(/holiday chapter two/i.test(homeText), `${label} hero`);
    await page.locator("#footer").scrollIntoViewIfNeeded();
    await shot(page, `${label}-footer`);

    if (width < 900) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("dialog", { name: "Menu" });
      await menu.waitFor({ state: "visible" });
      await shotView(page, `${label}-menu`);
      assert(
        (await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")) === "true",
        `${label} menu aria-expanded`,
      );
      await menu.getByRole("button", { name: /Shop/ }).click();
      await menu.getByRole("link", { name: "Dresses" }).click();
      await page.waitForURL("**/collections/dresses");
      await shot(page, `${label}-collection`);
    } else {
      await page.getByRole("button", { name: "Shop", exact: true }).hover();
      await shotView(page, `${label}-menu-open`);
      await page.getByRole("link", { name: "Dresses", exact: true }).first().click();
      await page.waitForURL("**/collections/dresses");
      await shot(page, `${label}-collection`);
      await page.keyboard.press("Escape");
    }

    await page.goto(`${base}/collections/new-arrivals`, { waitUntil: "networkidle" });
    assert((await overflow(page)) <= 1, `${label} collection overflows`);
    await page.getByRole("button", { name: "Filter & sort" }).click();
    const filters = page.getByRole("dialog", { name: "Filter & sort" });
    await filters.waitFor({ state: "visible" });
    await shot(page, `${label}-filters`);
    await shotView(page, `${label}-filters-viewport`);
    await filters.locator("summary", { hasText: "Size" }).click();
    await filters.getByRole("checkbox", { name: "27", exact: true }).check();
    await page.waitForTimeout(50);
    const visible = page.locator("[data-card]:not([hidden])");
    assert((await visible.count()) === 1, `${label} size 27 should leave one piece`);
    assert(
      (await visible.first().getAttribute("data-handle")) === "diana-mid-rise-jean-marville-wash",
      `${label} size 27 piece`,
    );
    await filters.getByRole("button", { name: "Clear all" }).click();
    await filters.getByRole("button", { name: "Price: low to high" }).click();
    await page.waitForFunction(() => location.href.includes("sort_by=price-ascending"));
    await page.waitForFunction(() => location.href.includes("filter.v.price.gte=0"));
    assert(await filters.isVisible(), `${label} sort keeps the drawer open`);
    assert(
      (await page.locator("[data-card]:not([hidden])").first().getAttribute("data-handle")) ===
        "long-scoop-neck-slip-conch-2",
      `${label} price sort`,
    );
    await filters.getByRole("button", { name: "Apply" }).click();
    await filters.waitFor({ state: "hidden" });
    if (width < 900) {
      await page.getByRole("button", { name: "Filter & sort" }).click();
      await filters.waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await filters.waitFor({ state: "hidden" });
      await page.getByRole("button", { name: "Search" }).click();
      const search = page.getByRole("dialog", { name: "Search" });
      await search.waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await search.waitFor({ state: "hidden" });
    }

    await page.goto(`${base}/products/quinn-dress-salt`, { waitUntil: "networkidle" });
    assert((await overflow(page)) <= 1, `${label} pdp overflows`);
    await shot(page, `${label}-pdp`);
    if (width < 900) {
      const dots = page.locator(".gallery-dots button");
      assert((await dots.count()) >= 2, `${label} gallery dots`);
      await dots.nth(1).click();
      assert((await dots.nth(1).getAttribute("aria-current")) === "true", `${label} dot 2`);
      await dots.nth(0).click();
      assert((await dots.nth(0).getAttribute("aria-current")) === "true", `${label} dot 1`);
    }
    const sizeM = page.getByRole("button", { name: "M", exact: true });
    assert((await sizeM.getAttribute("aria-pressed")) !== "true", `${label} size M starts unselected`);
    await shot(page, `${label}-pdp-before-size`);
    await page.getByRole("button", { name: "Select size" }).click();
    await page.locator("#size-error").waitFor({ state: "visible" });
    assert((await page.locator("#bag-count").innerText()) === "0", `${label} bag changed without a size`);
    await shot(page, `${label}-size-required`);
    await page.getByRole("button", { name: "S", exact: true }).click();
    await page.waitForFunction(() => location.href.includes("variant=40107503124593"));
    assert(/add to cart/i.test(await page.locator("#add-label").innerText()), `${label} S enables add`);
    await page.getByRole("tab", { name: "Details" }).click();
    await page.getByText("Hand Wash Cold").waitFor();
    await page.getByRole("tab", { name: "Size & fit" }).click();
    await page.getByRole("button", { name: "Click here for size guide" }).click();
    const guide = page.getByRole("dialog", { name: /Quinn Dress/i });
    await guide.waitFor();
    await guide.getByRole("button", { name: "in | cm" }).click();
    const bodyText = await guide.locator("[data-guide-panel='body']").innerText();
    assert(bodyText.includes("82.5"), `${label} cm bust`);
    assert(bodyText.includes("114–116"), `${label} cm range`);
    await guide.getByRole("button", { name: "Garment" }).click();
    const garmentText = await guide.locator("[data-guide-panel='garment']").innerText();
    assert(garmentText.includes("Bust (extended)"), `${label} garment heading`);
    assert(garmentText.includes("49"), `${label} garment bust`);
    await guide.getByRole("button", { name: "Conversion" }).click();
    const conversionText = await guide.locator("[data-guide-panel='conversion']").innerText();
    assert(conversionText.includes("30"), `${label} conversion`);
    await guide.getByRole("button", { name: "Close size guide" }).click();
    await guide.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "M", exact: true }).click();
    await page.locator("#add-to-cart").click();
    const bag = page.getByRole("dialog", { name: /in your bag/i });
    await bag.waitFor({ state: "visible" });
    assert((await bag.locator("[data-line]").count()) === 1, `${label} first line`);

    await page.goto(`${base}/products/diana-mid-rise-jean-marville-wash`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "27", exact: true }).click();
    await page.locator("#add-to-cart").click();
    await bag.waitFor({ state: "visible" });
    assert((await bag.locator("[data-line]").count()) === 2, `${label} two lines`);
    await bag.getByRole("button", { name: "Increase quantity of Quinn Dress" }).click();
    await bag.locator("[data-qty-value]").first().filter({ hasText: "2" }).waitFor();
    assert((await bag.locator("[data-qty-value]").first().innerText()) === "2", `${label} qty plus`);
    assert((await bag.locator("[data-cart-subtotal]").innerText()) === "$804", `${label} subtotal`);
    await shot(page, `${label}-cart-two-lines`);
    await shotView(page, `${label}-cart-drawer`);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Bag, 3 items/ }).click();
    await bag.waitFor({ state: "visible" });
    assert((await bag.locator("[data-line]").count()) === 2, `${label} reload keeps two lines`);
    assert((await bag.locator("[data-qty-value]").first().innerText()) === "2", `${label} reload qty`);
    await bag.getByRole("button", { name: "Remove" }).first().click();
    await bag.locator("[data-line]").nth(0).waitFor();
    await page.waitForFunction(() => document.querySelectorAll("#cart-dialog [data-line]").length === 1);
    assert((await bag.locator("[data-line]").count()) === 1, `${label} first-click remove`);
    await bag.getByRole("button", { name: "Decrease quantity of Diana Mid Rise Jean" }).click();
    await bag.getByText(/your cart is empty/i).waitFor();
    await shot(page, `${label}-cart-empty`);
    await page.reload({ waitUntil: "networkidle" });
    await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
    await page.locator("main").getByText(/your cart is empty/i).waitFor();
    assert((await page.locator("main [data-checkout]").isDisabled()) === true, `${label} checkout off`);
    await shot(page, `${label}-cart-page`);

    await page.goto(`${base}/search?q=dress`, { waitUntil: "networkidle" });
    await page.getByText("2 results for").waitFor();
    assert(!(await page.content()).includes("749"), `${label} does not invent a result count`);
    await shot(page, `${label}-search-dress`);
    await page.goto(`${base}/search?q=lavon`, { waitUntil: "networkidle" });
    await page.getByText("Lavon Linen Pant").waitFor();
    await shot(page, `${label}-search`);
    await page.goto(`${base}/search?q=zzzz-not-a-piece`, { waitUntil: "networkidle" });
    await page.getByText(/No matches/).waitFor();
    await shot(page, `${label}-search-empty`);

    await page.goto(`${base}/products/digital-gift-card`, { waitUntil: "networkidle" });
    assert((await page.locator("#add-to-cart").isDisabled()) === true, `${label} gift issuance`);
    await page.getByText(/issuance is off/i).first().waitFor();
    await shot(page, `${label}-gift`);

    await page.goto(`${base}/pages/contact`, { waitUntil: "networkidle" });
    assert((await page.locator("#newsletter-form input").isDisabled()) === true, `${label} email input`);
    assert((await page.locator("#newsletter-form button").count()) === 0, `${label} email has no send button`);
    assert((await page.locator("#newsletter-form").getAttribute("action")) === null, `${label} email action`);
    await shot(page, `${label}-contact`);

    await page.goto(`${base}/journal/not-captured`, { waitUntil: "networkidle" });
    await shot(page, `${label}-journal`);
    await page.goto(`${base}/pages/lookbook`, { waitUntil: "networkidle" });
    await shot(page, `${label}-lookbook`);
    await page.goto(`${base}/not-a-real-page`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Lost" }).waitFor();
    await shot(page, `${label}-404`);

    assert(remote.length === 0, `${label} remote requests: ${remote.join(", ")}`);
  } catch (error) {
    failures.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    try {
      await shot(page, `${label}-failure`);
    } catch {
      /* ignore screenshot errors */
    }
  } finally {
    await page.close();
  }
}

try {
  await exercise(1365, 1072, "desktop");
  await exercise(390, 844, "mobile390");
  await exercise(320, 700, "mobile320");
} finally {
  await browser.close();
  try {
    process.kill(-preview.pid, "SIGTERM");
  } catch {
    preview.kill("SIGTERM");
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Browser QA passed at 1365, 390, and 320.");
process.exit(0);
