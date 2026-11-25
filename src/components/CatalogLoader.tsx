"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const FAILSAFE_MS = 10000; // if the catalogue never arrives, get out of the way
const PHOTOS_MS = 1500;

/** A link into the catalogue list (/catalogo or /catalogo/<category>), not a product page. */
const catalogList = (path: string) => path.startsWith("/catalogo") && path.split("/").filter(Boolean).length <= 2;

/** Where an element's letters are (the text box, not the element's box). */
const textBox = (el: Element) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect();
};

/**
 * The way into the catalogue from the rest of the site, like the opening of the home page: a dark screen where
 * CARGANDO, in grey, fills with the brand orange from the bottom with a wavy edge (globals.css .loader-fill). Once it is
 * full and the catalogue has arrived underneath, the word swipes up into CATÁLOGO, the screen opens upwards, and the
 * word flies and shrinks into the catalogue's own title. Product links keep their photo glide instead.
 */
export function CatalogLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const [target, setTarget] = useState<string | null>(null);
  const [filled, setFilled] = useState(false);
  const field = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const lines = useRef<HTMLSpanElement>(null);
  const catalogo = useRef<HTMLSpanElement>(null);
  const running = useRef(false);

  // Catch clicks on catalogue links made outside the catalogue (bar, home buttons, category titles, the 404 page).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || !catalogList(url.pathname) || location.pathname.startsWith("/catalogo")) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault(); // Next's <Link> sees this and stands down
      setFilled(false);
      setTarget(url.pathname + url.search);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!target) return;
    const timer = setTimeout(() => setTarget(null), FAILSAFE_MS);
    return () => clearTimeout(timer);
  }, [target]);

  // Full, and the catalogue is on the page: swipe the word, open the screen, land the word on the title.
  useEffect(() => {
    const title = document.querySelector<HTMLElement>("[data-catalog-title]");
    if (!target || !filled || pathname !== target.split("?")[0] || !title || running.current || !field.current || !word.current || !lines.current || !catalogo.current) return;
    running.current = true;
    const end = () => {
      title.style.visibility = "";
      running.current = false;
      setTarget(null);
    };
    (async () => {
      scrollTo({ top: 0, behavior: "instant" }); // the catalogue opens at its top, whatever the router's smooth scroll did
      // The photos of its first screen are drawn before the curtain opens (waiting at most 1.5 s more for them).
      // (only drawn ones: the previous page stays in the document, hidden, and its lazy photos never load)
      const photos = [...document.querySelectorAll<HTMLImageElement>("main img")].filter((i) => i.getClientRects().length && i.getBoundingClientRect().top < innerHeight);
      await Promise.race([Promise.allSettled(photos.map((i) => i.decode())), new Promise((r) => setTimeout(r, PHOTOS_MS))]);
      await lines.current!.animate({ translate: ["0 0", "0 -1.6em"] }, { duration: 550, easing: EASE, fill: "forwards" }).finished;
      const to = textBox(title);
      const from = textBox(catalogo.current!);
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      title.style.visibility = "hidden";
      await Promise.all([
        field.current!.animate({ clipPath: ["inset(0 0 0 0)", "inset(0 0 100% 0)"] }, { duration: 800, easing: EASE, fill: "forwards" }).finished,
        word.current!.animate({ transform: ["none", `translate(${dx}px, ${dy}px) scale(${to.height / from.height})`] }, { duration: 800, easing: EASE, fill: "forwards" }).finished,
      ]);
      end();
    })().catch(end);
  }, [target, filled, pathname]);

  if (!target) return null;

  return (
    <div className="catalog-loader fixed inset-0 z-[75]">
      {/* The page changes only once the screen covers it: React's page transition must not catch it half-drawn. */}
      <div ref={field} className="loader-field absolute inset-0 bg-neutral" onAnimationEnd={(e) => e.animationName === "loader-in" && router.push(target)} />
      <div className="absolute inset-0 grid place-items-center overflow-hidden px-4">
        <span ref={word} role="status" className="block h-[1.2em] overflow-hidden text-[16vw] font-black uppercase leading-[1.2] md:text-[10vw]">
          <span ref={lines} className="block">
            <span className="relative block text-[#3a3533]">
              Cargando
              <span aria-hidden className="loader-fill absolute inset-0 text-primary" onAnimationEnd={() => setFilled(true)}>
                Cargando
              </span>
            </span>
            {/* 0.4em apart, so the accent on the Á stays out of the window until the swipe */}
            <span ref={catalogo} className="mt-[0.4em] block text-center text-primary">
              Catálogo
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
