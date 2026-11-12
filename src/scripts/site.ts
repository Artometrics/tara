import {
  addSignup,
  clearSignups,
  loadSignups,
  mailtoHref,
} from "../lib/newsletter";
import {
  applyQuery,
  emptyQuery,
  isActive,
  queryFromParams,
  queryToParams,
  type LookFacts,
  type LookQuery,
  type SortKey,
} from "../lib/lookbook";
import type { CelebrationId } from "../data/site";
import type { Moment, PaletteKey } from "../data/looks";

function safeStorage(): Storage | null {
  try {
    const probe = "__tara_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

function wireDialog(button: HTMLElement | null, dialog: HTMLDialogElement | null) {
  if (!button || !dialog) return;
  button.addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
    button.setAttribute("aria-expanded", "true");
    dialog.querySelector<HTMLElement>("[data-close]")?.focus();
  });
  dialog.addEventListener("close", () => {
    button.setAttribute("aria-expanded", "false");
    button.focus();
  });
  dialog.querySelectorAll<HTMLElement>("[data-close]").forEach((closer) => {
    closer.addEventListener("click", () => dialog.close());
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function bindMobileMenu() {
  const dialog = document.querySelector<HTMLDialogElement>("#menu-dialog");
  wireDialog(document.querySelector<HTMLElement>("#menu-button"), dialog);
  dialog?.querySelectorAll<HTMLButtonElement>("[data-acc]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      if (panel instanceof HTMLElement) panel.hidden = open;
    });
  });
  const widen = window.matchMedia("(min-width: 980px)");
  widen.addEventListener("change", () => {
    if (widen.matches && dialog?.open) dialog.close();
  });
}

function bindDesktopMenus() {
  const header = document.querySelector<HTMLElement>("#site-header");
  if (!header) return;
  const items = Array.from(header.querySelectorAll<HTMLElement>(".nav-item"));
  const setOpen = (open: HTMLElement | null) => {
    items.forEach((item) => {
      const isOpen = item === open;
      item.classList.toggle("is-open", isOpen);
      item.querySelector("button")?.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  };
  items.forEach((item) => {
    const button = item.querySelector("button");
    let openedByHover = false;
    item.addEventListener("mouseenter", () => {
      if (!window.matchMedia("(hover: hover)").matches) return;
      openedByHover = !item.classList.contains("is-open");
      setOpen(item);
    });
    item.addEventListener("mouseleave", () => {
      openedByHover = false;
    });
    button?.addEventListener("click", () => {
      if (openedByHover) {
        openedByHover = false;
        return;
      }
      setOpen(item.classList.contains("is-open") ? null : item);
    });
    item.addEventListener("focusout", (event) => {
      const next = event.relatedTarget;
      if ((!(next instanceof Node) || !item.contains(next)) && item.classList.contains("is-open")) setOpen(null);
    });
  });
  header.addEventListener("mouseleave", () => setOpen(null));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(null);
  });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !header.contains(event.target)) setOpen(null);
  });
}

function checkedValues(root: ParentNode, name: string): string[] {
  return Array.from(root.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function bindLookbook() {
  const grid = document.querySelector<HTMLElement>("[data-grid]");
  const dialog = document.querySelector<HTMLDialogElement>("#filter-dialog");
  if (!grid || !dialog) return;
  wireDialog(document.querySelector<HTMLElement>("#filter-open"), dialog);

  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));
  const facts = new Map<HTMLElement, LookFacts>();
  cards.forEach((card) => {
    facts.set(card, {
      slug: card.dataset.slug ?? "",
      title: card.dataset.title ?? "",
      celebration: (card.dataset.celebration ?? "india") as CelebrationId,
      moment: (card.dataset.moment ?? "ceremony") as Moment,
      palette: (card.dataset.palette ?? "").split(",").filter(Boolean) as PaletteKey[],
    });
  });
  const originalOrder = [...cards];
  const empty = document.querySelector<HTMLElement>("[data-filter-empty]");
  const count = document.querySelector<HTMLElement>("[data-count]");
  const launch = document.querySelector<HTMLElement>("#filter-open");

  const syncControls = (query: LookQuery) => {
    const sets: Record<string, string[]> = {
      celebration: query.celebrations,
      moment: query.moments,
      palette: query.palettes,
    };
    dialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]").forEach((input) => {
      input.checked = sets[input.name]?.includes(input.value) ?? false;
    });
    dialog.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.sort === query.sort ? "true" : "false");
    });
  };

  const render = (query: LookQuery) => {
    const visible = applyQuery(
      originalOrder.map((card) => ({ ...(facts.get(card) as LookFacts), card })),
      query,
    );
    const shown = new Set(visible.map((item) => item.card));
    originalOrder.forEach((card) => {
      card.hidden = !shown.has(card);
    });
    visible.forEach((item) => grid.append(item.card));
    if (empty) empty.hidden = visible.length > 0;
    if (count) count.textContent = String(visible.length);
    launch?.classList.toggle("is-active", isActive(query));
  };

  const readControls = (): LookQuery => ({
    celebrations: checkedValues(dialog, "celebration") as CelebrationId[],
    moments: checkedValues(dialog, "moment") as Moment[],
    palettes: checkedValues(dialog, "palette") as PaletteKey[],
    sort: (dialog.querySelector<HTMLButtonElement>("[data-sort][aria-pressed=true]")?.dataset.sort ?? "curated") as SortKey,
  });

  const commit = (query: LookQuery) => {
    const params = queryToParams(query).toString();
    history.replaceState(null, "", `${location.pathname}${params ? `?${params}` : ""}`);
    syncControls(query);
    render(query);
  };

  dialog.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      dialog.querySelectorAll("[data-sort]").forEach((other) => other.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
    });
  });
  dialog.querySelector("[data-apply-filters]")?.addEventListener("click", () => {
    commit(readControls());
    dialog.close();
  });
  dialog.querySelector("[data-clear-filters]")?.addEventListener("click", () => {
    commit(emptyQuery());
  });

  const initial = queryFromParams(new URLSearchParams(location.search));
  syncControls(initial);
  render(initial);
}

function bindTabs() {
  document.querySelectorAll<HTMLElement>(".tabs[role=tablist]").forEach((list) => {
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>("[role=tab]"));
    const select = (selected: HTMLButtonElement) => {
      tabs.forEach((tab) => {
        const on = tab === selected;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });
}

function bindNewsletter() {
  const storage = safeStorage();
  const forms = document.querySelectorAll<HTMLFormElement>("[data-newsletter-form]");

  const refreshSaved = () => {
    const panel = document.querySelector<HTMLElement>("[data-saved-panel]");
    if (!panel || !storage) return;
    const total = loadSignups(storage).length;
    panel.hidden = total === 0;
    const label = panel.querySelector("[data-saved-count]");
    if (label) label.textContent = String(total);
  };

  forms.forEach((form) => {
    const status = form.querySelector<HTMLElement>("[data-newsletter-status]");
    const mail = form.querySelector<HTMLElement>("[data-newsletter-mail]");
    const mailLink = form.querySelector<HTMLAnchorElement>("[data-newsletter-mail-link]");
    const say = (message: string, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get("email") ?? "");
      const name = String(data.get("name") ?? "");
      if (!storage) {
        say("This browser is blocking local storage, so nothing could be saved. Nothing was sent.", true);
        return;
      }
      const result = addSignup(storage, { email, name });
      if (!result.ok) {
        say("That email address does not look right. Please check it and try again.", true);
        form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
        return;
      }
      say(
        result.duplicate
          ? "Already saved in this browser. Nothing was sent."
          : "Saved in this browser only. This is a draft, so nothing was sent.",
      );
      const to = form.dataset.mailto;
      if (to && mail && mailLink) {
        mailLink.href = mailtoHref(to, { email: email.trim().toLowerCase(), name: name.trim() });
        mail.hidden = false;
      }
      form.reset();
      refreshSaved();
    });
  });

  document.querySelector("[data-clear-signups]")?.addEventListener("click", () => {
    if (!storage) return;
    clearSignups(storage);
    forms.forEach((form) => {
      const status = form.querySelector<HTMLElement>("[data-newsletter-status]");
      if (status) status.textContent = "Saved signups cleared from this browser.";
    });
    refreshSaved();
  });
  refreshSaved();
}

bindMobileMenu();
bindDesktopMenus();
bindLookbook();
bindTabs();
bindNewsletter();
