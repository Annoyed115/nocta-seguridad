import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { quoteLink } from "@/lib/quote";
import { EMAIL, PHONES, SHOPS } from "@/lib/site";
import { WhatsappIcon } from "./icons";

const SITE = [
  ["Servicios", "/#servicios"],
  ["Opiniones", "/#opiniones"],
  ["Ubícanos", "/#sedes"],
] as const;

const HEAD = "font-body text-sm font-semibold uppercase tracking-wider text-primary";
const LINK = "inline-flex min-h-11 items-center underline-offset-4 hover:underline md:min-h-0";

/** The footer: what NOCTA is and a way to quote, then the catalogue, the site, contact and the two shops. */
export async function Footer() {
  const catalog = await getCatalog();

  return (
    <footer className="bg-neutral px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-14 text-white md:px-[3.4%] md:pb-12 md:pt-20">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-12">
        <div>
          <p className="text-2xl font-black uppercase">Nocta</p>
          <p className="mt-3 max-w-[32ch] font-body text-white/75">
            Alarmas, cámaras de seguridad, cercas eléctricas y motores para puertas. Monitoreo y apoyo 24 horas.
          </p>
          <a href={quoteLink()} target="_blank" rel="noopener noreferrer" className="btn-quote mt-6 py-3">
            <WhatsappIcon />
            Cotizar por WhatsApp
          </a>
        </div>

        <nav aria-label="Catálogo">
          <h2 className={HEAD}>Catálogo</h2>
          <ul className="mt-3 font-body md:space-y-2">
            <li>
              <Link href="/catalogo" className={LINK}>
                Todo el catálogo
              </Link>
            </li>
            {catalog.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalogo/${c.slug}`} className={LINK}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Nocta">
          <h2 className={HEAD}>Nocta</h2>
          <ul className="mt-3 font-body md:space-y-2">
            {SITE.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className={LINK}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sample contact details: plain text, nothing to call or write to. */}
        <div className="font-body">
          <h2 className={HEAD}>Contacto</h2>
          <ul className="mt-3 space-y-2 text-white/75">
            {[...PHONES, EMAIL].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h2 className={`${HEAD} mt-8`}>Sedes</h2>
          <ul className="mt-3 space-y-2 text-white/75">
            {SHOPS.map((s) => (
              <li key={s.town}>
                <span className="font-semibold text-white">{s.town}:</span> {s.address}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-12 border-t border-white/15 pt-6 font-body text-sm text-white/70">
        © 2026 Nocta Seguridad · Proyecto conceptual: marca, datos de contacto y opiniones son ficticios.
      </p>
    </footer>
  );
}
