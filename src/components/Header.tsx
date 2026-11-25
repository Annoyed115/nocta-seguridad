"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useLayoutEffect, useRef } from "react";
import { quoteLink, regreet } from "@/lib/quote";
import { CloseIcon, MenuIcon, WhatsappIcon } from "./icons";

const NAV = [
  ["Catálogo", "/catalogo"],
  ["Servicios", "/#servicios"],
  ["Ubícanos", "/#sedes"], // the two shops, with their maps
] as const;

const QUOTE = quoteLink();

/**
 * The dark bar, fixed on every page. Wide screens (≥ 1280 px) show the four links;
 * phones and tablets get ☰, which opens the full-screen menu (a modal <dialog>: Esc, focus and the inert page come free).
 */
export function Header() {
  const menu = useRef<HTMLDialogElement>(null);
  const close = () => menu.current?.close();
  const pathname = usePathname();
  const home = pathname === "/";
  const returnTo = useRef<number | null>(null);

  // Every WhatsApp link on the site (bar, product, footer) greets by the hour of the tap in Colombia, not of the build.
  useEffect(() => {
    const fresh = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (a) a.href = regreet(a.href);
    };
    const on = ["click", "auxclick", "contextmenu"]; // tap, middle click, "open in new tab"
    on.forEach((t) => document.addEventListener(t, fresh, true));
    return () => on.forEach((t) => document.removeEventListener(t, fresh, true));
  }, []);

  // The browser's back and forward buttons: React renders those at once inside the popstate event, which skips the page
  // transition (no dissolve, no photo gliding back to its card). Handed to Next.js one task later they run as ordinary
  // transitions. This listener is registered before Next.js's own (child effects run first), so it can hold the event.
  // The scroll is put back by hand: the browser would restore it at once, against the page still on screen.
  useEffect(() => {
    const scrolled: Record<string, number> = {};
    const save = () => (scrolled[location.href] = scrollY);
    const defer = (e: PopStateEvent) => {
      if (!e.isTrusted || !("startViewTransition" in document)) return;
      e.stopImmediatePropagation();
      history.scrollRestoration = "manual";
      returnTo.current = scrolled[location.href] ?? 0;
      setTimeout(() => dispatchEvent(new PopStateEvent("popstate", { state: e.state })));
    };
    addEventListener("scroll", save, { passive: true });
    addEventListener("popstate", defer);
    return () => {
      removeEventListener("scroll", save);
      removeEventListener("popstate", defer);
    };
  }, []);

  // ...once the page it returns to is drawn (inside the transition, before its picture is taken): where the visitor was,
  // so the photo glides back onto its own card.
  useLayoutEffect(() => {
    if (returnTo.current === null) return;
    scrollTo({ top: returnTo.current, behavior: "instant" });
    returnTo.current = null;
    history.scrollRestoration = "auto";
  }, [pathname]);

  // On the home page the logo glides back to the top instead of reloading the page (which only blinked the bar).
  const toTop = (e: MouseEvent) => {
    if (!home) return;
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-neutral text-white">
      <div className="flex h-16 items-center gap-3 px-4 xl:h-[5.5rem] xl:px-6">
        {/* The opening animation lands its logo exactly here (globals.css, --logo-x/--logo-y/--logo-size). */}
        <Link href="/" aria-label="Nocta, inicio" onClick={toTop} className="shrink-0">
          <Image src="/brand/logo-512.webp" alt="" width={128} height={128} loading="eager" className="size-12 xl:size-16" />
        </Link>
        <nav aria-label="Principal" className="ml-auto hidden items-center gap-12 text-[1.05rem] xl:flex">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link">
              {label}
            </Link>
          ))}
        </nav>
        <a href={QUOTE} target="_blank" rel="noopener noreferrer" className="btn-quote ml-auto text-sm xl:ml-14 xl:min-h-[3.25rem] xl:text-lg">
          <WhatsappIcon />
          Cotizar
        </a>
        <button
          type="button"
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          onClick={() => menu.current?.showModal()}
          className="grid size-11 place-items-center xl:hidden"
        >
          <MenuIcon className="size-7" />
        </button>
      </div>

      <dialog
        ref={menu}
        aria-label="Menú"
        // a tap on the dialog itself (outside its content) closes it
        onClick={(e) => e.target === e.currentTarget && close()}
        className="drawer fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-neutral p-0 text-white"
      >
        <div className="flex h-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex h-16 items-center justify-between">
            <Image src="/brand/logo-512.webp" alt="" width={96} height={96} className="size-12" />
            <button type="button" aria-label="Cerrar menú" autoFocus onClick={close} className="grid size-11 place-items-center">
              <CloseIcon className="size-7" />
            </button>
          </div>
          <nav aria-label="Principal" className="mt-8 flex flex-col">
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} onClick={close} className="border-b border-white/20 py-4 text-[2rem] font-black uppercase">
                {label}
              </Link>
            ))}
          </nav>
          <a href={QUOTE} target="_blank" rel="noopener noreferrer" className="btn-quote mt-auto w-full py-3 text-lg">
            <WhatsappIcon />
            Cotizar por WhatsApp
          </a>
        </div>
      </dialog>
    </header>
  );
}
