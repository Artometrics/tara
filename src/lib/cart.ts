export const CART_KEY = "prism-pollen.cart.v1";

export type CartLine = {
  id: string;
  handle: string;
  variantId: string;
  title: string;
  color: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
  image?: string;
  href: string;
};

export type Cart = {
  lines: CartLine[];
};

export type AddInput = {
  kind: "apparel" | "gift-card";
  handle: string;
  variantId: string | null;
  title: string;
  color: string;
  variantLabel: string;
  unitPrice: number;
  image?: string;
  href: string;
  qty?: number;
};

export function emptyCart(): Cart {
  return { lines: [] };
}

export function lineCount(cart: Cart): number {
  return cart.lines.reduce((sum, line) => sum + line.qty, 0);
}

export function subtotal(cart: Cart): number {
  return cart.lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
}

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.id === "string" &&
    line.id.length > 0 &&
    typeof line.handle === "string" &&
    line.handle !== "gift-note" &&
    typeof line.variantId === "string" &&
    typeof line.title === "string" &&
    typeof line.color === "string" &&
    typeof line.variantLabel === "string" &&
    typeof line.href === "string" &&
    Number.isInteger(line.unitPrice) &&
    (line.unitPrice as number) >= 0 &&
    Number.isInteger(line.qty) &&
    (line.qty as number) >= 1 &&
    (line.image === undefined || typeof line.image === "string")
  );
}

export function sanitizeCart(value: unknown): Cart {
  if (!value || typeof value !== "object" || !Array.isArray((value as Cart).lines)) {
    return emptyCart();
  }
  const lines: CartLine[] = [];
  for (const raw of (value as Cart).lines) {
    if (!isLine(raw)) continue;
    lines.push({
      id: raw.id,
      handle: raw.handle,
      variantId: raw.variantId,
      title: raw.title,
      color: raw.color,
      variantLabel: raw.variantLabel,
      unitPrice: raw.unitPrice,
      qty: raw.qty,
      href: raw.href,
      ...(raw.image ? { image: raw.image } : {}),
    });
  }
  return { lines };
}

export function addItem(cart: Cart, input: AddInput): { cart: Cart; error?: string } {
  if (input.kind === "gift-card" || input.handle === "gift-note") {
    return { cart, error: "Gift card issuance is off." };
  }
  if (!input.variantId) {
    return { cart, error: "Select a size." };
  }
  const qty = input.qty ?? 1;
  if (!Number.isInteger(qty) || qty < 1) {
    return { cart, error: "Quantity must be a whole number." };
  }
  const id = `${input.handle}:${input.variantId}`;
  const existing = cart.lines.find((line) => line.id === id);
  if (existing) {
    return {
      cart: {
        lines: cart.lines.map((line) =>
          line.id === id ? { ...line, qty: line.qty + qty } : line,
        ),
      },
    };
  }
  const line: CartLine = {
    id,
    handle: input.handle,
    variantId: input.variantId,
    title: input.title,
    color: input.color,
    variantLabel: input.variantLabel,
    unitPrice: input.unitPrice,
    qty,
    href: input.href,
    ...(input.image ? { image: input.image } : {}),
  };
  return { cart: { lines: [...cart.lines, line] } };
}

export function changeQty(cart: Cart, lineId: string, delta: number): Cart {
  if (!Number.isInteger(delta) || delta === 0) return cart;
  const line = cart.lines.find((item) => item.id === lineId);
  if (!line) return cart;
  const next = line.qty + delta;
  if (next < 1) return removeLine(cart, lineId);
  return {
    lines: cart.lines.map((item) => (item.id === lineId ? { ...item, qty: next } : item)),
  };
}

/** Removes a line on the first call. There is no confirmation step. */
export function removeLine(cart: Cart, lineId: string): Cart {
  return { lines: cart.lines.filter((line) => line.id !== lineId) };
}

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export function loadCart(storage: Pick<StorageLike, "getItem">, key = CART_KEY): Cart {
  const raw = storage.getItem(key);
  if (!raw) return emptyCart();
  try {
    return sanitizeCart(JSON.parse(raw));
  } catch {
    return emptyCart();
  }
}

export function saveCart(
  storage: Pick<StorageLike, "setItem">,
  cart: Cart,
  key = CART_KEY,
): void {
  storage.setItem(key, JSON.stringify(sanitizeCart(cart)));
}
