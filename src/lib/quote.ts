import { whatsappLink } from "./site";

/** Lowercase and strip accents, so "camara" matches "Cámara". */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

/** URL piece for a product name: "Cámara IMOU Ranger con giro" → "camara-imou-ranger-con-giro". */
export const slugify = (s: string) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * "Buenos días" until noon in Colombia, "Buenas tardes" from noon on (Colombia has no daylight saving). Without a time
 * (pages built ahead of time, which may not read the clock) it says "Buenos días" and regreet() sets the hour on the tap.
 */
export const greeting = (now?: Date) =>
  now && Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Bogota", hour: "numeric", hourCycle: "h23" }).format(now)) >= 12
    ? "Buenas tardes"
    : "Buenos días";

/** WhatsApp link: "¡Buenos días, Nocta! Me gustaría cotizar lo siguiente: [producto]". */
export const quoteLink = (product?: string, now?: Date) =>
  whatsappLink(`¡${greeting(now)}, Nocta! Me gustaría cotizar${product ? ` lo siguiente: ${product}` : ""}`);

/** The same link greeting the hour of the tap: pages are built ahead of time, so Header.tsx refreshes it on click. */
export const regreet = (href: string, now = new Date()) => {
  const [base, query] = href.split("?");
  const text = new URLSearchParams(query).get("text");
  return text ? `${base}?text=${encodeURIComponent(text.replace(/^¡Buen(os días|as tardes)/, `¡${greeting(now)}`))}` : href;
};
