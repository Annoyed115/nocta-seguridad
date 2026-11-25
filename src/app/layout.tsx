import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ViewTransition } from "react";
import { CatalogLoader } from "@/components/CatalogLoader";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Nocta · Alarmas, cámaras y cercas eléctricas", template: "%s · Nocta" },
  description:
    "Instalamos y monitoreamos alarmas, cámaras de seguridad, cercas eléctricas y motores para puertas. Monitoreo y apoyo 24 horas. (Proyecto conceptual, marca ficticia.)",
  alternates: { canonical: "/" },
  openGraph: { url: "/", siteName: "Nocta", images: "/brand/logo-1024.png", locale: "es_CO", type: "website" },
};

// Runs in <head>, before anything is painted. The opening plays only when a visit starts on the home page (html.intro-on,
// which also darkens the first frame); any other first page, or a later load, marks the visit as seen (html.seen).
const INTRO_ONCE =
  "var c=document.documentElement.classList;try{location.pathname=='/'&&!sessionStorage.seen?c.add('intro-on'):c.add('seen');sessionStorage.seen=1}catch(e){c.add('seen')}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script adds classes to <html> before React hydrates.
    // data-scroll-behavior: page changes jump straight to their scroll position; the smooth scroll (globals.css) is for
    // in-page links only. Smooth, a page change was left halfway down (the logo landing on "Expertos en", a product
    // opening low with its photo off screen, so it could not glide).
    <html lang="es" className={`${outfit.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_ONCE }} />
      </head>
      <body>
        {/* Keyboard users: the first Tab shows this above the bar and skips the menu links. */}
        <a href="#contenido" className="fixed left-4 top-3 z-[80] -translate-y-24 rounded-full bg-primary-strong px-5 py-3 font-semibold text-white focus:translate-y-0">
          Saltar al contenido
        </a>
        <Header />
        <CatalogLoader />
        {/* Page changes: the new page fades in where it belongs (globals.css, "page"). */}
        <ViewTransition name="page">
          <div>
            <main id="contenido" className="pt-16 xl:pt-[5.5rem]">
              {children}
            </main>
            <Footer />
          </div>
        </ViewTransition>
      </body>
    </html>
  );
}
