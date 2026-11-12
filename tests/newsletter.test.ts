import { describe, expect, it } from "vitest";
import {
  NEWSLETTER_KEY,
  addSignup,
  clearSignups,
  isValidEmail,
  loadSignups,
  mailtoHref,
  type StorageLike,
} from "../src/lib/newsletter";

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

const now = new Date("2026-01-02T03:04:05.000Z");

describe("newsletter draft storage", () => {
  it("validates email addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("  a@b.co  ")).toBe(true);
    for (const bad of ["", "a", "a@b", "a@b.", "a b@c.com", "@c.com"]) expect(isValidEmail(bad)).toBe(false);
  });

  it("saves a normalized signup", () => {
    const storage = memoryStorage();
    const result = addSignup(storage, { email: "  Friend@Example.COM ", name: " Friend " }, now);
    expect(result).toMatchObject({ ok: true, duplicate: false });
    expect(loadSignups(storage)).toEqual([{ email: "friend@example.com", name: "Friend", savedAt: now.toISOString() }]);
  });

  it("does not store duplicates", () => {
    const storage = memoryStorage();
    addSignup(storage, { email: "a@b.co" }, now);
    const again = addSignup(storage, { email: "A@B.co" }, now);
    expect(again).toMatchObject({ ok: true, duplicate: true });
    expect(loadSignups(storage)).toHaveLength(1);
  });

  it("rejects invalid email without writing", () => {
    const storage = memoryStorage();
    expect(addSignup(storage, { email: "nope" }, now)).toEqual({ ok: false, reason: "invalid-email" });
    expect(storage.data).toEqual({});
  });

  it("survives corrupt storage", () => {
    expect(loadSignups(memoryStorage({ [NEWSLETTER_KEY]: "{not json" }))).toEqual([]);
    expect(loadSignups(memoryStorage({ [NEWSLETTER_KEY]: '{"a":1}' }))).toEqual([]);
    expect(loadSignups(memoryStorage({ [NEWSLETTER_KEY]: '[{"email":1},{"email":"a@b.co","name":"","savedAt":"x"}]' }))).toHaveLength(1);
  });

  it("clears saved signups", () => {
    const storage = memoryStorage();
    addSignup(storage, { email: "a@b.co" }, now);
    clearSignups(storage);
    expect(loadSignups(storage)).toEqual([]);
  });

  it("builds a mailto draft that carries the address and encodes the body", () => {
    const href = mailtoHref("hello@tara.example", { email: "a+b@c.co", name: "A & B" });
    expect(href.startsWith("mailto:hello@tara.example?subject=")).toBe(true);
    expect(href).toContain(encodeURIComponent("Email: a+b@c.co"));
    expect(href).toContain(encodeURIComponent("Name: A & B"));
  });
});
