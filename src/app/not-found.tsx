import Link from "next/link";
import { quoteLink } from "@/lib/quote";

/** Unknown addresses, mostly mistyped or outdated links: say so plainly and offer the way back. */
export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col justify-center px-4 py-20 md:px-[8.6%]">
      <h1 className="max-w-[12ch] text-[13vw] font-black uppercase leading-[0.95] text-primary md:text-[6vw]">
        Esta página ya no existe
      </h1>
      <p className="mt-8 max-w-[44ch] font-body text-lg leading-relaxed">
        Quizá venía de un enlace de nuestra página anterior. Alarmas, cámaras, cercas y motores están en el catálogo.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Link href="/catalogo" className="btn-catalog">
          Ver el catálogo
        </Link>
        <a href={quoteLink()} target="_blank" rel="noopener noreferrer" className="font-body text-lg font-semibold underline underline-offset-4">
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}
