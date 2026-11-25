"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsappIcon } from "./icons";

/**
 * The product's "Cotizar por WhatsApp". On phones, once it scrolls out of view above,
 * a copy rises into a bar at the bottom of the screen (250 ms) so it is always at hand.
 */
export function QuoteCta({ href }: { href: string }) {
  const main = useRef<HTMLAnchorElement>(null);
  const [away, setAway] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(main.current!);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a ref={main} href={href} target="_blank" rel="noopener noreferrer" className="btn-quote mt-8 w-full py-3 text-lg md:w-auto md:px-12">
        <WhatsappIcon />
        Cotizar por WhatsApp
      </a>
      <div
        inert={!away}
        className={`sticky-quote fixed inset-x-0 bottom-0 z-40 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgb(0_0_0/0.08)] transition-transform duration-250 md:hidden ${
          away ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn-quote w-full py-3 text-lg">
          <WhatsappIcon />
          Cotizar por WhatsApp
        </a>
      </div>
    </>
  );
}
