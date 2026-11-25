"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Tab = { label: string; text: string };

/**
 * Descripción / Instalación. The chosen tab is orange with a 3 px orange line under it;
 * the line slides to the chosen tab (250 ms) and the text fades in (200 ms). Arrow keys move between tabs.
 */
export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [line, setLine] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const b = buttons.current[active]!;
    setLine({ left: b.offsetLeft, width: b.offsetWidth });
  }, [active]);

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    buttons.current[next]!.focus();
  };

  return (
    <div className="mt-16 md:mt-20">
      <div role="tablist" aria-label="Información del producto" onKeyDown={onKey} className="relative flex gap-6 border-b border-line md:gap-10">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-${i}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            // until script measures the sliding line, the chosen tab draws its own
            className={`-mb-px min-h-11 border-b-[3px] font-body text-base font-semibold transition-colors md:text-lg ${
              i === active ? "text-primary" : "text-muted"
            } ${i === active && !line ? "border-primary" : "border-transparent"}`}
          >
            {t.label}
          </button>
        ))}
        {line && (
          <span
            aria-hidden
            className="absolute -bottom-px border-b-[3px] border-primary transition-[left,width] duration-250 ease-in-out"
            style={line}
          />
        )}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" aria-labelledby={`${id}-${i}`} hidden={i !== active} tabIndex={0}>
          <div className="fade-in pt-6">
            <h2 className="text-2xl font-black uppercase md:text-3xl">{t.label}</h2>
            <p className="mt-3 max-w-[70ch] font-body leading-relaxed">{t.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
