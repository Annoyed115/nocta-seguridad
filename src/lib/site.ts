// The site's public address: Vercel's production domain, read at build time.
export const SITE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`;

// NOCTA is a fictional brand (concept project): no real phone, email or address anywhere on the site.
export const EMAIL = "contacto@ejemplo.com";
export const PHONES = ["(000) 000 0000", "(000) 000 0001"];

// No number: WhatsApp opens with the message ready and asks who to send it to.
export const whatsappLink = (text?: string) => `https://wa.me/${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** The two shops: shown on the home page (with maps) and in the footer. Maps show the area, not a building. */
export const SHOPS = [
  { town: "Norte", address: "Calle 000 # 00-00", map: "Usaquén, Bogotá" },
  { town: "Sur", address: "Carrera 00 # 00-00", map: "Kennedy, Bogotá" },
];

/** schema.org BreadcrumbList for a trail of [name, path] pairs, so Google can show the page's place in the site. */
export const breadcrumbLd = (trail: [string, string][]) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path}` })),
  });
