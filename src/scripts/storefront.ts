import { products } from "../data/catalog";
import {
  CART_KEY,
  addItem,
  changeQty,
  emptyCart,
  lineCount,
  loadCart,
  removeLine,
  saveCart,
  subtotal,
  type Cart,
} from "../lib/cart";
import { formatUSD } from "../lib/money";
import {
  applyQuery,
  searchProducts,
  sortFromParam,
  sortToParam,
  type PriceBand,
  type QueryState,
  type SortKey,
} from "../lib/query";

let cart: Cart = emptyCart();

function byHandle(handle: string) {
  return products.find((product) => product.handle === handle);
}

function persist() {
  saveCart(localStorage, cart, CART_KEY);
}

function setBagCount() {
  const count = lineCount(cart);
  const countEl = document.querySelector("#bag-count");
  const label = document.querySelector("#bag-label");
  const button = document.querySelector("#bag-button");
  if (countEl) countEl.textContent = String(count);
  if (label) label.textContent = `Bag, ${count} items`;
  if (button) button.setAttribute("aria-label", `Bag, ${count} items`);
}

function renderCart() {
  const roots = document.querySelectorAll("[data-cart-root]");
  roots.forEach((root) => {
    const empty = root.querySelector("[data-cart-empty]");
    const emptyNote = root.querySelector("[data-cart-empty-note]");
    const filled = root.querySelector("[data-cart-filled]");
    const lines = root.querySelector("[data-cart-lines]");
    const sub = root.querySelector("[data-cart-subtotal]");
    const isEmpty = cart.lines.length === 0;
    if (empty instanceof HTMLElement) empty.hidden = !isEmpty;
    if (emptyNote instanceof HTMLElement) emptyNote.hidden = !isEmpty;
    if (filled instanceof HTMLElement) filled.hidden = isEmpty;
    if (sub) sub.textContent = formatUSD(subtotal(cart));
    if (!lines) return;
    lines.replaceChildren();
    for (const line of cart.lines) {
      const row = document.createElement("article");
      row.className = "cart-line";
      row.dataset.line = line.id;

      const visual = document.createElement("div");
      if (line.image) {
        const img = document.createElement("img");
        img.src = line.image;
        img.alt = "";
        visual.append(img);
      } else {
        const blank = document.createElement("div");
        blank.className = "mini-empty";
        blank.textContent = "";
        visual.append(blank);
      }

      const copy = document.createElement("div");
      const title = document.createElement("a");
      title.href = line.href;
      title.textContent = line.title;
      const meta = document.createElement("p");
      meta.className = "quiet";
      meta.textContent = `${line.color} · ${line.variantLabel}`;
      const price = document.createElement("p");
      price.textContent = formatUSD(line.unitPrice * line.qty);

      const qty = document.createElement("div");
      qty.className = "qty";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.dataset.qtyDelta = "-1";
      minus.dataset.lineId = line.id;
      minus.setAttribute("aria-label", `Decrease quantity of ${line.title}`);
      minus.textContent = "−";
      const value = document.createElement("span");
      value.dataset.qtyValue = line.id;
      value.textContent = String(line.qty);
      const plus = document.createElement("button");
      plus.type = "button";
      plus.dataset.qtyDelta = "1";
      plus.dataset.lineId = line.id;
      plus.setAttribute("aria-label", `Increase quantity of ${line.title}`);
      plus.textContent = "+";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-line";
      remove.dataset.removeLine = line.id;
      remove.textContent = "Remove";
      qty.append(minus, value, plus, remove);
      copy.append(title, meta, price, qty);
      row.append(visual, copy);
      lines.append(row);
    }
  });
  setBagCount();
}

function openDialog(dialog: HTMLDialogElement | null, focus?: HTMLElement | null) {
  if (!dialog) return;
  if (!dialog.open) {
    if (dialog.dataset.overlay === "drop") dialog.show();
    else dialog.showModal();
  }
  (focus ?? dialog.querySelector<HTMLElement>("[data-close]"))?.focus();
}

function wireDialog(button: HTMLElement | null, dialog: HTMLDialogElement | null, focus?: HTMLElement | null) {
  if (!button || !dialog) return;
  button.addEventListener("click", () => {
    openDialog(dialog, focus);
    button.setAttribute("aria-expanded", "true");
  });
  dialog.addEventListener("close", () => button.setAttribute("aria-expanded", "false"));
  dialog.querySelectorAll<HTMLElement>("[data-close]").forEach((closer) => {
    closer.addEventListener("click", () => {
      if (dialog.open) dialog.close();
    });
  });
}

function announce(message: string) {
  const status = document.querySelector("#cart-status");
  if (status) status.textContent = message;
}

function selectedVariant(form: HTMLFormElement): string | null {
  const pressed = form.querySelector<HTMLElement>("[data-variant-id][aria-pressed='true']");
  return pressed?.getAttribute("data-variant-id") ?? null;
}

function bindProductForm() {
  const form = document.querySelector<HTMLFormElement>("#add-form");
  if (!form) return;
  const handle = form.dataset.handle ?? "";
  const product = byHandle(handle);
  const error = form.querySelector<HTMLElement>("#size-error");
  const addLabel = document.querySelector("#add-label");
  const setAddLabel = (ready: boolean) => {
    if (addLabel) addLabel.textContent = ready ? "Add to cart" : "Select size";
    document.querySelectorAll("#sticky-add").forEach((button) => {
      button.textContent = ready ? "Add to cart" : "Select size";
    });
  };
  form.querySelectorAll<HTMLButtonElement>("[data-variant-id]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      form.querySelectorAll("[data-variant-id]").forEach((other) => {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      if (error) error.hidden = true;
      setAddLabel(true);
      const variant = product?.variants.find((item) => item.id === button.dataset.variantId);
      const price = document.querySelector("[data-pdp-price]");
      if (variant && price) price.textContent = formatUSD(variant.price);
      const url = new URL(window.location.href);
      url.searchParams.set("variant", button.dataset.variantId ?? "");
      window.history.replaceState(null, "", url);
    });
  });
  const initialVariant = new URLSearchParams(window.location.search).get("variant");
  if (initialVariant) {
    const initialButton = form.querySelector<HTMLButtonElement>(
      `[data-variant-id="${initialVariant}"]:not([disabled])`,
    );
    initialButton?.click();
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!product) return;
    const submitButton = form.querySelector<HTMLButtonElement>("#add-to-cart");
    const variantId = selectedVariant(form);
    const variant = product.variants.find((item) => item.id === variantId) ?? null;
    if (!variant) {
      if (error) {
        error.hidden = false;
        error.textContent = "Select a size.";
      }
      form.querySelector<HTMLElement>("[data-size-group]")?.focus();
      return;
    }
    submitButton?.classList.add("is-loading");
    if (submitButton) submitButton.disabled = true;
    window.setTimeout(() => {
      const result = addItem(cart, {
      kind: product.kind,
      handle: product.handle,
      variantId: variant?.id ?? null,
      title: product.title,
      color: product.color,
      variantLabel: variant?.label ?? "",
      unitPrice: variant?.price ?? product.variants[0]?.price ?? 0,
      image: product.image,
      href: `/products/${product.handle}`,
    });
    submitButton?.classList.remove("is-loading");
      if (submitButton) submitButton.disabled = false;
      if (result.error) {
        if (error) {
          error.hidden = false;
          error.textContent = result.error;
        }
        announce(result.error);
        return;
      }
      cart = result.cart;
      persist();
      renderCart();
      announce(`Added ${product.title}, ${variant.label}.`);
      const dialogNode = document.querySelector("#cart-dialog");
      const dialog = dialogNode instanceof HTMLDialogElement ? dialogNode : null;
      openDialog(dialog);
      document.querySelector("#bag-button")?.setAttribute("aria-expanded", "true");
    }, 280);
  });
}

function bindCartClicks() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const quick = target.closest<HTMLElement>("[data-quick-add]");
    if (quick?.dataset.handle && quick.dataset.size && quick.dataset.price && quick.dataset.title) {
      const result = addItem(cart, {
        kind: "apparel",
        handle: quick.dataset.handle,
        variantId: `${quick.dataset.handle}-${quick.dataset.size}`,
        title: quick.dataset.title,
        color: "",
        variantLabel: quick.dataset.size,
        unitPrice: Number(quick.dataset.price),
        image: quick.dataset.image,
        href: "/#featured",
      });
      if (!result.error) {
        cart = result.cart;
        persist();
        renderCart();
        const dialogNode = document.querySelector("#cart-dialog");
        openDialog(dialogNode instanceof HTMLDialogElement ? dialogNode : null);
      }
      return;
    }
    const removeId = target.closest<HTMLElement>("[data-remove-line]")?.dataset.removeLine;
    if (removeId) {
      const row = document.querySelector(`[data-line="${CSS.escape(removeId)}"]`);
      row?.classList.add("is-leaving");
      cart = removeLine(cart, removeId);
      persist();
      window.setTimeout(() => {
        renderCart();
        announce("Removed.");
      }, 180);
      return;
    }
    const qtyButton = target.closest<HTMLElement>("[data-qty-delta]");
    if (!qtyButton?.dataset.lineId || !qtyButton.dataset.qtyDelta) return;
    const delta = Number(qtyButton.dataset.qtyDelta);
    document.querySelectorAll("[data-cart-root]").forEach((root) => root.classList.add("is-updating"));
    cart = changeQty(cart, qtyButton.dataset.lineId, delta);
    persist();
    window.setTimeout(() => {
      document.querySelectorAll("[data-cart-root]").forEach((root) => root.classList.remove("is-updating"));
      renderCart();
      announce("Quantity updated.");
    }, 280);
  });
}

function asElement(selector: string): HTMLElement | null {
  const node = document.querySelector(selector);
  return node instanceof HTMLElement ? node : null;
}

function bindMenu() {
  const dialogNode = document.querySelector("#menu-dialog");
  const dialog = dialogNode instanceof HTMLDialogElement ? dialogNode : null;
  wireDialog(asElement("#menu-button"), dialog);
  dialog?.querySelectorAll<HTMLButtonElement>("[data-acc]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      if (panel instanceof HTMLElement) panel.hidden = open;
    });
  });
  document.querySelector("#menu-bag")?.addEventListener("click", () => {
    if (dialog?.open) dialog.close();
    const cartNode = document.querySelector("#cart-dialog");
    openDialog(cartNode instanceof HTMLDialogElement ? cartNode : null);
    document.querySelector("#bag-button")?.setAttribute("aria-expanded", "true");
  });
}

function bindDesktopMenus() {
  const header = document.querySelector<HTMLElement>("#site-header");
  if (!header) return;
  const setMenu = (name: "" | "shop" | "collections") => {
    header.dataset.menu = name;
    header.querySelectorAll<HTMLButtonElement>(".nav-item > button").forEach((button) => {
      const controls = button.getAttribute("aria-controls");
      const open = (name === "shop" && controls === "mega-shop") || (name === "collections" && controls === "mega-collections");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  };
  const shop = header.querySelector<HTMLElement>("#shop-wrap");
  const collections = header.querySelector<HTMLElement>("#collections-wrap");
  shop?.addEventListener("mouseenter", () => setMenu("shop"));
  collections?.addEventListener("mouseenter", () => setMenu("collections"));
  shop?.querySelector("button")?.addEventListener("click", (event) => {
    event.preventDefault();
    setMenu(header.dataset.menu === "shop" ? "" : "shop");
  });
  collections?.querySelector("button")?.addEventListener("click", (event) => {
    event.preventDefault();
    setMenu(header.dataset.menu === "collections" ? "" : "collections");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu("");
  });
}

const trending = ["Silk", "Cardigan", "Skirt", "Henki", "White dress"];

function renderSuggestions(list: HTMLElement, text: string) {
  const label = document.querySelector("#search-suggest-label");
  const previews = document.querySelector("#search-previews");
  list.replaceChildren();
  if (previews) previews.replaceChildren();
  const query = text.trim();
  if (!query) {
    if (label) label.textContent = "Trending";
    for (const term of trending) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `/search?q=${encodeURIComponent(term)}`;
      link.textContent = term;
      item.append(link);
      list.append(item);
    }
    return;
  }
  if (label) label.textContent = "Suggestions";
  const matches = searchProducts(products, query).slice(0, 6);
  const suggestions = [query, ...matches.map((product) => product.title)];
  const seen = new Set<string>();
  for (const suggestion of suggestions) {
    const key = suggestion.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `/search?q=${encodeURIComponent(suggestion)}`;
    link.textContent = suggestion;
    item.append(link);
    list.append(item);
  }
  if (!previews) return;
  for (const product of matches) {
    const link = document.createElement("a");
    link.className = "preview-card";
    link.href = `/products/${product.handle}`;
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = "";
      link.append(img);
    }
    const title = document.createElement("span");
    title.textContent = product.title;
    const price = document.createElement("span");
    price.textContent = formatUSD(Math.min(...product.variants.map((variant) => variant.price)));
    link.append(title, price);
    previews.append(link);
  }
}

function bindSearch() {
  const dialogNode = document.querySelector("#search-dialog");
  const dialog = dialogNode instanceof HTMLDialogElement ? dialogNode : null;
  const inputNode = document.querySelector("#search-input");
  const input = inputNode instanceof HTMLInputElement ? inputNode : null;
  const listNode = document.querySelector("#search-suggest");
  const list = listNode instanceof HTMLElement ? listNode : null;
  wireDialog(asElement("#search-open"), dialog, input);
  if (list) renderSuggestions(list, "");
  input?.addEventListener("input", () => {
    if (list) renderSuggestions(list, input.value);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog?.open) dialog.close();
  });
  const pageInput = document.querySelector<HTMLInputElement>("#search-page-input");
  if (pageInput) {
    const params = new URLSearchParams(window.location.search);
    pageInput.value = params.get("q") ?? "";
  }
  document.querySelector("#search-page-clear")?.addEventListener("click", () => {
    if (!pageInput) return;
    pageInput.value = "";
    pageInput.dispatchEvent(new Event("input"));
  });
}

function readQuery(): QueryState {
  const sortButton = document.querySelector<HTMLElement>(".sort-row button[aria-pressed='true']");
  const sort = (sortButton?.dataset.sort as SortKey | undefined) ?? "featured";
  const checked = (name: string) =>
    [...document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)].map(
      (input) => input.value,
    );
  const searchInput = document.querySelector<HTMLInputElement>("#search-page-input");
  return {
    sort,
    sizes: checked("size"),
    categories: checked("category"),
    colors: checked("color"),
    priceBands: checked("price") as PriceBand[],
    text: searchInput?.value ?? "",
  };
}

function writeFilterUrl(state: QueryState) {
  const url = new URL(window.location.href);
  const sort = sortToParam(state.sort);
  if (sort) url.searchParams.set("sort_by", sort);
  else url.searchParams.delete("sort_by");
  if (state.sort === "price-asc") {
    const floors: Record<PriceBand, number> = {
      "under-100": 0,
      "100-300": 100,
      "300-500": 300,
      "500-plus": 500,
    };
    const caps: Record<PriceBand, number | ""> = {
      "under-100": 100,
      "100-300": 300,
      "300-500": 500,
      "500-plus": "",
    };
    const gte = state.priceBands.length
      ? Math.min(...state.priceBands.map((band) => floors[band]))
      : 0;
    const finiteCaps = state.priceBands
      .map((band) => caps[band])
      .filter((value): value is number => value !== "");
    url.searchParams.set("filter.v.price.gte", String(gte));
    url.searchParams.set("filter.v.price.lte", finiteCaps.length ? String(Math.max(...finiteCaps)) : "");
  } else {
    url.searchParams.delete("filter.v.price.gte");
    url.searchParams.delete("filter.v.price.lte");
  }
  if (document.querySelector("[data-search-page]")) {
    if (state.text) url.searchParams.set("q", state.text);
    else url.searchParams.delete("q");
  }
  window.history.replaceState(null, "", url);
}

function bindFilters() {
  const gridNode = document.querySelector("[data-grid]");
  if (!(gridNode instanceof HTMLElement)) return;
  const grid = gridNode;
  const dialogNode = document.querySelector("#filter-dialog");
  const dialog = dialogNode instanceof HTMLDialogElement ? dialogNode : null;
  wireDialog(asElement("#filter-open"), dialog);
  const handles = [...grid.querySelectorAll<HTMLElement>("[data-card]")].map(
    (card) => card.dataset.handle ?? "",
  );
  const subset = handles
    .map((handle) => byHandle(handle))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const apply = () => {
    const state = readQuery();
    const searching = Boolean(document.querySelector("[data-search-page]"));
    const result = searching && !state.text.trim() ? [] : applyQuery(subset, state);
    writeFilterUrl(state);
    const copy = document.querySelector("#search-page-copy");
    if (copy) {
      copy.textContent = !state.text.trim()
        ? "Type a word to search this preview."
        : `${result.length} result${result.length === 1 ? "" : "s"} for “${state.text.trim()}”.`;
    }
    const rank = new Map(result.map((product, index) => [product.handle, index]));
    const cards = [...grid.querySelectorAll<HTMLElement>("[data-card]")];
    const visible: HTMLElement[] = [];
    const hidden: HTMLElement[] = [];
    for (const card of cards) {
      const place = rank.get(card.dataset.handle ?? "");
      if (place === undefined) hidden.push(card);
      else visible[place] = card;
    }
    for (const card of visible) {
      card.hidden = false;
      grid.appendChild(card);
    }
    for (const card of hidden) {
      card.hidden = true;
      grid.appendChild(card);
    }
    const empty = document.querySelector<HTMLElement>("[data-filter-empty]");
    if (empty) {
      const showEmpty = searching ? state.text.trim() !== "" && result.length === 0 : result.length === 0;
      empty.hidden = !showEmpty;
    }
    const count = document.querySelector("[data-count]");
    if (count) count.textContent = String(result.length);
  };

  dialog?.querySelectorAll("input").forEach((input) => input.addEventListener("change", apply));
  dialog?.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      dialog.querySelectorAll("[data-sort]").forEach((other) => {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      apply();
    });
  });
  document.querySelector("[data-clear-filters]")?.addEventListener("click", () => {
    dialog?.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
      input.checked = false;
    });
    dialog?.querySelectorAll("[data-sort]").forEach((button, index) => {
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    });
    apply();
  });
  document.querySelector("[data-apply-filters]")?.addEventListener("click", () => {
    apply();
    if (dialog?.open) dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog?.open) dialog.close();
  });
  const initialSort = sortFromParam(new URLSearchParams(window.location.search).get("sort_by"));
  dialog?.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.sort === initialSort ? "true" : "false");
  });
  document.querySelector("#search-page-input")?.addEventListener("input", () => apply());
  apply();
}

function bindTabs() {
  const tabs = document.querySelectorAll<HTMLButtonElement>("[data-tab]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      tabs.forEach((other) => other.setAttribute("aria-selected", other === tab ? "true" : "false"));
      document.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.panel !== name;
      });
    });
  });
}

function bindExtras() {
  const video = document.querySelector<HTMLVideoElement>("#campaign-video");
  document.querySelector("#video-pause")?.addEventListener("click", () => {
    if (!video) return;
    if (video.paused) {
      void video.play();
      document.querySelector("#video-pause")!.textContent = "Pause background video";
    } else {
      video.pause();
      document.querySelector("#video-pause")!.textContent = "Play background video";
    }
  });
  const frames = [...document.querySelectorAll<HTMLElement>(".pdp-gallery .pdp-slide")];
  if (frames.length > 1 && window.matchMedia("(max-width: 899px)").matches) {
    frames.forEach((frame, index) => frame.classList.toggle("is-active", index === 0));
    const dots = document.createElement("div");
    dots.className = "gallery-dots";
    frames.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Image ${index + 1}`);
      dot.setAttribute("aria-current", index === 0 ? "true" : "false");
      dot.addEventListener("click", () => {
        frames.forEach((frame, frameIndex) => frame.classList.toggle("is-active", frameIndex === index));
        dots.querySelectorAll("button").forEach((item, itemIndex) => {
          item.setAttribute("aria-current", itemIndex === index ? "true" : "false");
        });
      });
      dots.append(dot);
    });
    document.querySelector(".pdp-gallery")?.append(dots);
  }
  const addButton = document.querySelector("#add-to-cart");
  const sticky = document.querySelector("#sticky-buy");
  if (addButton && sticky && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      sticky.classList.toggle("is-on", !visible && window.innerWidth < 900);
    });
    observer.observe(addButton);
  }
  document.querySelector("#size-selector-jump")?.addEventListener("click", () => {
    document.querySelector("[data-size-group]")?.scrollIntoView({ block: "center" });
  });
  document.querySelector("#pay-note")?.addEventListener("click", () => {
    const copy = document.querySelector<HTMLElement>("#pay-note-copy");
    if (copy) copy.hidden = !copy.hidden;
  });
  document.querySelector("#sticky-add")?.addEventListener("click", () => {
    document.querySelector<HTMLFormElement>("#add-form")?.requestSubmit();
  });
  const guide = document.querySelector<HTMLDialogElement>("#size-guide");
  document.querySelector("#open-size-guide")?.addEventListener("click", () => {
    if (guide && !guide.open) guide.showModal();
  });
  guide?.querySelector("[data-close]")?.addEventListener("click", () => guide.close());
  guide?.querySelectorAll<HTMLButtonElement>("[data-guide-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.guideTab;
      guide.querySelectorAll("[data-guide-tab]").forEach((other) => {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      guide.querySelectorAll<HTMLElement>("[data-guide-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.guidePanel !== name;
      });
    });
  });
  document.querySelector("#unit-toggle")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;
    const toCm = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", toCm ? "true" : "false");
    document.querySelectorAll(".guide-table [data-cm]").forEach((cell) => {
      if (!(cell instanceof HTMLElement)) return;
      if (!cell.dataset.in) cell.dataset.in = cell.textContent ?? "";
      cell.textContent = toCm ? cell.dataset.cm ?? cell.dataset.in : cell.dataset.in;
    });
  });
}

function bindNewsletter() {
  document.querySelector("#newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    announce("Email is off. Nothing was sent.");
  });
}

cart = loadCart(localStorage, CART_KEY);
renderCart();
bindCartClicks();
bindProductForm();
bindMenu();
bindDesktopMenus();
bindSearch();
bindFilters();
bindTabs();
bindExtras();
bindNewsletter();

const cartDialogNode = document.querySelector("#cart-dialog");
wireDialog(
  asElement("#bag-button"),
  cartDialogNode instanceof HTMLDialogElement ? cartDialogNode : null,
);
