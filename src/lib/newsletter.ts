export const NEWSLETTER_KEY = "tara.newsletter-draft.v1";

export type Signup = { email: string; name: string; savedAt: string };

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type AddResult =
  | { ok: true; duplicate: boolean; signups: Signup[] }
  | { ok: false; reason: "invalid-email" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value: string): boolean => EMAIL.test(value.trim());

export function loadSignups(storage: StorageLike, key = NEWSLETTER_KEY): Signup[] {
  try {
    const raw = storage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Signup =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Signup).email === "string" &&
        typeof (item as Signup).name === "string" &&
        typeof (item as Signup).savedAt === "string",
    );
  } catch {
    return [];
  }
}

export function addSignup(
  storage: StorageLike,
  input: { email: string; name?: string },
  now: Date = new Date(),
  key = NEWSLETTER_KEY,
): AddResult {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, reason: "invalid-email" };
  const existing = loadSignups(storage, key);
  if (existing.some((item) => item.email === email)) return { ok: true, duplicate: true, signups: existing };
  const signups = [...existing, { email, name: (input.name ?? "").trim(), savedAt: now.toISOString() }];
  storage.setItem(key, JSON.stringify(signups));
  return { ok: true, duplicate: false, signups };
}

export function clearSignups(storage: StorageLike, key = NEWSLETTER_KEY): void {
  storage.removeItem(key);
}

export function mailtoHref(to: string, signup: { email: string; name?: string }): string {
  const subject = "Newsletter draft signup";
  const lines = ["Please add me to the newsletter list.", "", `Email: ${signup.email}`];
  if (signup.name) lines.push(`Name: ${signup.name}`);
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
