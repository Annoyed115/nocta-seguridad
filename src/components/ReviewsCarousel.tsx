"use client";

import { type PointerEvent, useRef, useState } from "react";
import { ChevronLeftIcon, PersonIcon } from "./icons";

export type Review = { name: string; text: string };

/**
 * The customers' reviews as a row of cards (after "5-card carousel" by creativeocean on CodePen): the chosen card sits
 * in the centre, taller, with an orange edge; its neighbours rest lower and dimmer, fading out at the sides. Arrows,
 * a tap on a side card, or a swipe move the row; the cards follow one another with a light spring (globals.css .review).
 */
export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [current, setCurrent] = useState(Math.min(2, reviews.length - 1));
  const [dir, setDir] = useState(1);
  const swipe = useRef<number | null>(null);
  const last = reviews.length - 1;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(last, i));
    if (next === current) return;
    setDir(next > current ? 1 : -1);
    setCurrent(next);
  };

  const down = (e: PointerEvent) => (swipe.current = e.clientX);
  const up = (e: PointerEvent) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
  };

  const arrow = "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral shadow-[0_6px_10px_rgb(0_0_0/0.18)] transition-[opacity,box-shadow] duration-300 hover:shadow-[0_3px_5px_rgb(0_0_0/0.3)] disabled:pointer-events-none disabled:opacity-0";

  return (
    <div role="region" aria-roledescription="carrusel" aria-label="Opiniones de nuestros clientes" className="relative">
      <div className="reviews-viewport overflow-hidden py-6" onPointerDown={down} onPointerUp={up} onPointerCancel={() => (swipe.current = null)}>
        <ul className="reviews-track flex gap-[var(--gap)]">
          {reviews.map((r, i) => {
            const active = i === current;
            // The row moves as a wave: the cards nearest the direction of travel go first.
            const delay = (dir > 0 ? i : last - i) * 30;
            return (
              <li
                key={r.name}
                aria-roledescription="opinión"
                aria-label={`${i + 1} de ${reviews.length}`}
                aria-hidden={!active}
                onClick={() => go(i)}
                style={{ translate: `calc(${-current} * (var(--card) + var(--gap))) ${active ? "0" : "0.9rem"}`, transitionDelay: `${delay}ms` }}
                className={`review flex w-[var(--card)] shrink-0 flex-col rounded-2xl border-2 p-6 font-body md:p-8 ${
                  active ? "border-primary bg-white shadow-[0_10px_24px_rgb(12_12_13/0.14)]" : "cursor-pointer border-transparent bg-[#f3f3f3]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-full transition-colors duration-500 ${active ? "bg-primary text-white" : "bg-[#fde3d6] text-primary"}`}>
                    <PersonIcon className="size-6" />
                  </span>
                  <p className="font-sans text-lg font-black uppercase leading-tight">{r.name}</p>
                </div>
                <blockquote className={`mt-5 leading-relaxed transition-opacity duration-500 ${active ? "" : "opacity-45"}`}>
                  <p>“{r.text}”</p>
                </blockquote>
              </li>
            );
          })}
        </ul>
      </div>
      <button type="button" aria-label="Opinión anterior" onClick={() => go(current - 1)} disabled={current === 0} className={`${arrow} left-2 md:left-6`}>
        <ChevronLeftIcon className="size-6" />
      </button>
      <button type="button" aria-label="Opinión siguiente" onClick={() => go(current + 1)} disabled={current === last} className={`${arrow} right-2 md:right-6`}>
        <ChevronLeftIcon className="size-6 rotate-180" />
      </button>
      <p aria-live="polite" className="sr-only">
        {`Opinión ${current + 1} de ${reviews.length}: ${reviews[current].name}`}
      </p>
    </div>
  );
}
