export function formatUSD(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.trunc(abs / 100);
  const remainder = abs % 100;
  const body = dollars.toLocaleString("en-US");
  if (remainder === 0) return `${sign}$${body}`;
  return `${sign}$${body}.${String(remainder).padStart(2, "0")}`;
}
