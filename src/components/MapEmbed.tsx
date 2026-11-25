"use client";

import { useState } from "react";
import { PinIcon } from "./icons";

/**
 * A shop's Google map, loaded on tap. Until then a light placeholder stands in, so the home page
 * carries no Google cookies, map tiles or Maps scripts (Lighthouse: third-party cookies, caching, main-thread work).
 */
export function MapEmbed({ town, query }: { town: string; query: string }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(query);
  const box = "mt-4 aspect-[4/3] w-full bg-card md:aspect-[16/7]";

  if (open) return <iframe title={`Mapa de la sede de ${town}`} src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`} className={box} />;

  return (
    <div className={`${box} grid place-content-center justify-items-center gap-4 p-6 text-center font-body`}>
      <PinIcon className="size-12 text-primary" />
      <button type="button" onClick={() => setOpen(true)} className="chip bg-white">
        Ver mapa de {town}
      </button>
      <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline underline-offset-4">
        Abrir en Google Maps
      </a>
    </div>
  );
}
